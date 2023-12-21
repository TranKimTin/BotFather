import * as ccxt from 'ccxt';
import { Digit, Position, RateData } from "./BinanceFuture";
import moment from 'moment';
import fs from 'fs';
import * as util from './util';

enum OrderStatus {
    ORDER_BOOKED,
    ORDER_WAIT_LIMIT,
    ORDER_WAIT_STOP,
    ORDER_FILL,
    ORDER_CANCLE
}

interface Order {
    symbol: string,
    side: 'BUY' | 'SELL' | string,
    type: 'MARKET' | 'LIMIT' | 'STOP_LIMIT' | 'STOP_MARKET' | string,
    volume: number,
    price?: number,
    stopPrice?: number,
    status: OrderStatus,
    createTime: number,
    updateTime?: number,
    expiredTime?: number,
    reduceOnly?: boolean,
    closePosition?: boolean
}

interface PositionHistory {
    symbol: string,
    side: 'BUY' | 'SELL' | string,
    volume: number,
    openPrice: number,
    closePrice: number,
    profit: number,
    closeTime: Date
}

interface IParam {
    symbolList: Array<string>,
    timeframes: Array<string>,
    onCloseCandle: (symbol: string, timeframe: string, data: Array<RateData>) => void,
    onClosePosition: (symbol: string) => void,
    onHandleError: (err: unknown, symbol: string | undefined) => void
}

export default class Backtest {
    private binance: ccxt.binanceusdm;
    private symbolList: Array<string>;
    private timeframes: Array<string>;
    private orders: Array<Order>;
    private onCloseCandle: (symbol: string, timeframe: string, data: Array<RateData>) => void;
    private onHandleError: (err: any, symbol: string | undefined) => void;
    private onClosePosition: (symbol: string) => void;

    public digits: { [key: string]: Digit };
    private data: { [key: string]: { [key: string]: Array<RateData> } };
    private positions: { [key: string]: Position };
    private minVolumes: { [key: string]: number };
    private lastPrice: { [key: string]: number };
    private timeCurrent: moment.Moment;
    private positionHistory: Array<PositionHistory>;

    constructor(params: IParam) {
        moment()
        this.binance = new ccxt.binanceusdm({});
        this.symbolList = params.symbolList;
        this.timeframes = params.timeframes;
        this.onCloseCandle = params.onCloseCandle;
        this.onClosePosition = params.onClosePosition;
        this.onHandleError = params.onHandleError;
        this.data = {};
        this.digits = {};
        this.positions = {};
        this.minVolumes = {};
        this.lastPrice = {};
        this.orders = [];
        this.timeCurrent = moment();
        this.positionHistory = [];

        for (let symbol of this.symbolList) {
            this.data[symbol] = {};
            for (let tf of this.timeframes) {
                this.data[symbol][tf] = [];
            }
            this.positions[symbol] = {
                symbol: symbol,
                side: '',
                volume: 0,
                entryPrice: 0,
                profit: 0
            };
        }

        if (!fs.existsSync('../data')) {
            fs.mkdirSync('../data');
        }
    }

    async runBacktest(from: string, to: string) {
        console.log('init digits...');
        let market = await this.binance.loadMarkets(true);
        for (let key in market) {
            let item = market[key];
            if (!item) continue;
            let symbol = item.info.symbol.replace('/', '');
            let precision = item.precision;
            this.digits[symbol] = {
                volume: precision.amount,
                price: precision.price
                // base: precision.base,
                // quote: precision.quote
            }
            this.minVolumes[symbol] = item.limits.amount?.min || 0;
        }

        let startDate = moment.utc(from);
        let endDate = moment.utc(to);

        while (startDate.valueOf() <= endDate.valueOf()) {
            let today = startDate.format('YYYY-MM-DD');
            let todayData: Array<RateData> = [];
            for (let symbol of this.symbolList) {
                todayData.push(...await util.getData_m1(symbol, today));
            }
            todayData.sort((a, b) => a.startTime - b.startTime);
            for (let rate of todayData) {
                this.timeCurrent = moment.utc(rate.startTime);

                this.lastPrice[rate.symbol] = rate.open;
                await this.updateCandle(rate.symbol, false);

                this.lastPrice[rate.symbol] = (rate.close > rate.open ? rate.low : rate.high);
                await this.updateCandle(rate.symbol, false);

                this.lastPrice[rate.symbol] = (rate.close > rate.open ? rate.high : rate.low)
                await this.updateCandle(rate.symbol, false);

                this.lastPrice[rate.symbol] = rate.close;
                await this.updateCandle(rate.symbol, true, rate.volume);

            }
            startDate.add(1, 'day');
        }

        console.log(this.positionHistory);

        console.log('backtest done.');
    }

    async getOpenOrders(symbol: string): Promise<Array<Order>> {
        return this.orders;
    }

    async orderStopMarket(symbol: string, side: string, volume: number, price: number, isTakeProfit: boolean, closePosition: boolean, workingType: 'CONTRACT_PRICE' | 'MARK_PRICE' = 'CONTRACT_PRICE'): Promise<Order> {
        if (side == 'buy' || side == 'long' || side == 'LONG') side = 'BUY';
        if (side == 'sell' || side == 'short' || side == 'SHORT') side = 'SELL';

        price = +price.toFixed(this.digits[symbol].price);
        volume = Math.max(volume, this.minVolumes[symbol]);
        volume = +volume.toFixed(this.digits[symbol].volume);

        console.log('orderStopMarket', { symbol, side, volume, price, isTakeProfit, closePosition, workingType });

        let order = {
            symbol,
            side,
            volume,
            price,
            createTime: this.timeCurrent.valueOf(),
            updateTime: this.timeCurrent.valueOf(),
            status: OrderStatus.ORDER_WAIT_STOP,
            type: 'STOP_MARKET',
            reduceOnly: closePosition,
            closePosition
        };

        this.orders.push(order);
        return order;
    }

    async orderStopLimit(symbol: string, side: string, volume: number, stopPrice: number, limitPrice: number, isTakeProfit: boolean, reduceOnly: boolean, workingType: 'CONTRACT_PRICE' | 'MARK_PRICE' = 'CONTRACT_PRICE'): Promise<Order> {
        if (side == 'buy' || side == 'long' || side == 'LONG') side = 'BUY';
        if (side == 'sell' || side == 'short' || side == 'SHORT') side = 'SELL';

        stopPrice = +stopPrice.toFixed(this.digits[symbol].price);
        limitPrice = +limitPrice.toFixed(this.digits[symbol].price);
        volume = Math.max(volume, this.minVolumes[symbol]);
        volume = +volume.toFixed(this.digits[symbol].volume);

        console.log('orderStopLimit', { symbol, side, volume, stopPrice, limitPrice, isTakeProfit, reduceOnly, workingType })

        let order: Order = {
            symbol,
            side,
            volume,
            price: limitPrice,
            stopPrice,
            createTime: this.timeCurrent.valueOf(),
            updateTime: this.timeCurrent.valueOf(),
            status: OrderStatus.ORDER_WAIT_STOP,
            type: 'STOP_LIMIT',
            reduceOnly
        };
        this.orders.push(order);
        return order;
    }

    async orderMarket(symbol: string, side: string, volume: number, options: { TP?: number, SL?: number, TP_Percent?: number, SL_Percent?: number } = {}): Promise<Array<Order>> {
        let { TP, SL, TP_Percent, SL_Percent } = options;

        let lastPrice = this.lastPrice[symbol];
        volume = Math.max(volume, this.minVolumes[symbol]);
        volume = +volume.toFixed(this.digits[symbol].volume);

        if (side == 'buy' || side == 'long' || side == 'LONG') side = 'BUY';
        if (side == 'sell' || side == 'short' || side == 'SHORT') side = 'SELL';

        if (!TP && TP_Percent) TP = (side == 'BUY') ? (lastPrice * (1 + TP_Percent)) : lastPrice * (1 - TP_Percent);
        if (!SL && SL_Percent) SL = (side == 'BUY') ? (lastPrice * (1 - SL_Percent)) : lastPrice * (1 + SL_Percent);

        TP = TP ? +TP?.toFixed(this.digits[symbol].price) : 0;
        SL = SL ? +SL.toFixed(this.digits[symbol].price) : 0;

        let sideClose = (side == 'BUY') ? 'SELL' : 'BUY';

        console.log('orderMarket', { symbol, side, volume, TP, SL });

        let order: Order = {
            symbol,
            side,
            type: 'MARKET',
            volume,
            status: OrderStatus.ORDER_BOOKED,
            createTime: this.timeCurrent.valueOf(),
            updateTime: this.timeCurrent.valueOf(),
        };
        this.orders.push(order);

        let result: Array<Order> = [order];
        if (TP) {
            result.push(((await this.orderLimit(symbol, sideClose, volume, TP)))[0]);
            result.push(await this.orderStopMarket(symbol, sideClose, volume, SL, false, true));
        }
        return result;
    }

    async orderLimit(symbol: string, side: string, volume: number, price: number, options: { TP?: number, SL?: number, TP_Percent?: number, SL_Percent?: number, expiredTime?: number } = {}): Promise<Array<Order>> {
        let { TP, SL, TP_Percent, SL_Percent, expiredTime } = options;

        volume = Math.max(volume, this.minVolumes[symbol]);
        volume = +volume.toFixed(this.digits[symbol].volume);
        price = +price.toFixed(this.digits[symbol].price);

        if (side == 'buy' || side == 'long' || side == 'LONG') side = 'BUY';
        if (side == 'sell' || side == 'short' || side == 'SHORT') side = 'SELL';

        if (!TP && TP_Percent) TP = (side == 'BUY') ? (price * (1 + TP_Percent)) : price * (1 - TP_Percent);
        if (!SL && SL_Percent) SL = (side == 'BUY') ? (price * (1 - SL_Percent)) : price * (1 + SL_Percent);

        TP = TP ? +TP.toFixed(this.digits[symbol].price) : 0;
        SL = SL ? +SL.toFixed(this.digits[symbol].price) : 0;

        let sideClose = (side == 'BUY') ? 'SELL' : 'BUY';

        let option = {
            timeInForce: 'GTC',
            goodTillDate: 0
        };

        if (expiredTime) {
            option.timeInForce = 'GTD';
            option.goodTillDate = expiredTime;
        }

        console.log('orderLimit', { symbol, side, volume, price, TP, SL, option });

        let order: Order = {
            symbol,
            side,
            type: 'LIMIT',
            volume,
            price,
            status: OrderStatus.ORDER_WAIT_LIMIT,
            createTime: this.timeCurrent.valueOf(),
            updateTime: this.timeCurrent.valueOf(),
            expiredTime: expiredTime || undefined
        };
        this.orders.push(order);

        let result: Array<Order> = [order];
        if (TP) {
            result.push(await this.orderStopLimit(symbol, sideClose, volume, price, TP, true, true));
            result.push(await this.orderStopMarket(symbol, sideClose, volume, SL, false, true));
        }
        return result;
    }

    private async updateCandle(symbol: string, close: boolean, volume: number = 0) {
        this.handleLogic();
        let price = this.lastPrice[symbol];
        for (let tf of this.timeframes) {
            let data = this.data[symbol][tf];
            if (data[0] && util.getStartTime(tf, this.timeCurrent.valueOf()) == data[0].startTime) {
                data[0].high = Math.max(data[0].high, price);
                data[0].low = Math.min(data[0].low, price);
                data[0].close = price;
                data[0].volume += volume;
                data[0].change = (data[0].close - data[0].open) / data[0].open;
                data[0].ampl = (data[0].high - data[0].low) / data[0].open;
                if (close && util.getStartTime(tf, this.timeCurrent.valueOf() + 60000) != data[0].startTime) {
                    data[0].isFinal = true;
                    await this.onCloseCandle(symbol, tf, [...data]);
                }
            }
            else {
                data.unshift({
                    symbol: symbol,
                    startTime: util.getStartTime(tf, this.timeCurrent.valueOf()),
                    timestring: moment(util.getStartTime(tf, this.timeCurrent.valueOf())).format('YYYY-MM-DD HH:mm:SS'),
                    open: price,
                    high: price,
                    low: price,
                    close: price,
                    volume: volume,
                    interval: tf,
                    isFinal: false,
                    change: 0,
                    ampl: 0
                });
                if (data[1] && !data[1].isFinal) {
                    data[1].isFinal = true;
                    await this.onCloseCandle(symbol, tf, data.slice(1));
                }
            }
        }
    }

    private handleLogic() {
        for (let i = 0; i < this.orders.length; i++) {
            let order = this.orders[i];
            if (order.side == 'BUY') {
                this.handleBuy(order);
            }
            else if (order.side == 'SELL') {
                this.handleSell(order);
            }
        }
        this.orders = this.orders.filter(order => order.status != OrderStatus.ORDER_FILL && order.status != OrderStatus.ORDER_CANCLE);
    }

    private fillOrder(order: Order, matchPrice: number) {
        let timeCurrent = this.timeCurrent.valueOf();
        let { symbol } = order;
        let position = this.positions[symbol];

        if (order.side == 'BUY') {
            order.updateTime = timeCurrent;
            order.status = OrderStatus.ORDER_FILL;
            order.price = matchPrice;

            if (position.volume >= 0) {//buy position
                position.entryPrice = (position.entryPrice * position.volume + order.price * order.volume) / (position.volume + order.volume);
                position.volume += order.volume;
                position.profit = position.volume * (matchPrice - position.entryPrice);
            }
            else {//sell position
                if (Math.abs(position.volume) >= order.volume) { //close partial
                    this.positionHistory.push({
                        symbol,
                        openPrice: position.entryPrice,
                        closePrice: matchPrice,
                        side: position.side,
                        volume: -order.volume,
                        profit: -order.volume * (matchPrice - position.entryPrice),
                        closeTime: new Date(timeCurrent)
                    });
                }
                else { //reverse position 
                    this.positionHistory.push({
                        symbol,
                        openPrice: position.entryPrice,
                        closePrice: matchPrice,
                        side: position.side,
                        volume: position.volume,
                        profit: position.volume * (matchPrice - position.entryPrice),
                        closeTime: new Date(timeCurrent)
                    });
                }
                position.volume += order.volume;
                position.profit = position.volume * (matchPrice - position.entryPrice);
                position.side = position.volume > 0 ? 'BUY' : position.volume < 0 ? 'SELL' : '';
            }
        }
        else if (order.side == 'SELL') {
            order.updateTime = timeCurrent;
            order.status = OrderStatus.ORDER_FILL;
            order.price = matchPrice;

            if (position.volume <= 0) {//sell position
                position.entryPrice = (position.entryPrice * Math.abs(position.volume) + order.price * order.volume) / (Math.abs(position.volume) + order.volume);
                position.volume -= order.volume;
                position.profit = position.volume * (matchPrice - position.entryPrice);
            }
            else {//buy position
                if (Math.abs(position.volume) >= order.volume) { //close partial
                    this.positionHistory.push({
                        symbol,
                        openPrice: position.entryPrice,
                        closePrice: matchPrice,
                        side: position.side,
                        volume: order.volume,
                        profit: order.volume * (matchPrice - position.entryPrice),
                        closeTime: new Date(timeCurrent)
                    });
                }
                else { //reverse position 
                    this.positionHistory.push({
                        symbol,
                        openPrice: position.entryPrice,
                        closePrice: matchPrice,
                        side: position.side,
                        volume: position.volume,
                        profit: position.volume * (matchPrice - position.entryPrice),
                        closeTime: new Date(timeCurrent)
                    });
                }
                position.volume -= order.volume;
                position.profit = position.volume * (matchPrice - position.entryPrice);
                position.side = position.volume > 0 ? 'BUY' : position.volume < 0 ? 'SELL' : '';
            }
        }
    }

    private handleBuy(order: Order) {
        let { symbol } = order;
        let lastPrice = this.lastPrice[symbol];

        if (order.type == 'MARKET') { //buy market
            if (order.status == OrderStatus.ORDER_BOOKED) {
                this.fillOrder(order, lastPrice);
            }
        }
        else if (order.type == 'LIMIT') { //buy limit
            if (order.status == OrderStatus.ORDER_WAIT_LIMIT && order.price && lastPrice <= order.price) {
                this.fillOrder(order, order.price);
            }
        }
        else if (order.type == 'STOP_LIMIT') { //buy stop limit
            if (order.status == OrderStatus.ORDER_WAIT_STOP && order.stopPrice && lastPrice >= order.stopPrice) {
                order.status = OrderStatus.ORDER_WAIT_LIMIT;
            }
            if (order.status == OrderStatus.ORDER_WAIT_LIMIT && order.price && lastPrice <= order.price) {
                this.fillOrder(order, order.price);
            }
        }
        else if (order.type == 'STOP_MARKET') { //buy stop market
            if (order.status == OrderStatus.ORDER_WAIT_STOP && order.stopPrice && lastPrice >= order.stopPrice) {
                this.fillOrder(order, order.stopPrice);
            }
        }
    }

    private handleSell(order: Order) {
        let { symbol } = order;
        let lastPrice = this.lastPrice[symbol];

        if (order.type == 'MARKET') { //sell market
            if (order.status == OrderStatus.ORDER_BOOKED) {
                this.fillOrder(order, lastPrice);
            }
        }
        else if (order.type == 'LIMIT') { //sell limit
            if (order.status == OrderStatus.ORDER_WAIT_LIMIT && order.price && lastPrice >= order.price) {
                this.fillOrder(order, order.price);
            }
        }
        else if (order.type == 'STOP_LIMIT') { //sell stop limit
            if (order.status == OrderStatus.ORDER_WAIT_STOP && order.stopPrice && lastPrice <= order.stopPrice) {
                order.status = OrderStatus.ORDER_WAIT_LIMIT;
            }
            if (order.status == OrderStatus.ORDER_WAIT_LIMIT && order.price && lastPrice >= order.price) {
                this.fillOrder(order, order.price);
            }
        }
        else if (order.type == 'STOP_MARKET') { //sell stop market
            if (order.status == OrderStatus.ORDER_WAIT_STOP && order.stopPrice && lastPrice <= order.stopPrice) {
                this.fillOrder(order, order.stopPrice);
            }
        }
    }
}

let bot: Backtest;

async function main() {
    // let symbolList = await util.getSymbolList();
    // let ignoreList = ['BTCDOMUSDT', 'USDCUSDT', 'COCOSUSDT'];
    // symbolList = symbolList.filter(item => item.endsWith("USDT"))
    //     .filter(item => !ignoreList.includes(item));
    let symbolList = ['BTCUSDT'];
    bot = new Backtest({
        symbolList: symbolList,
        timeframes: ['15m'],
        onCloseCandle: onCloseCandle,
        onClosePosition: async (symbol: string) => { },
        onHandleError: async (err: any, symbol: string | undefined) => { },
    });
    await bot.runBacktest('2023-12-01', '2023-12-20');
}

async function onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {

}

main();