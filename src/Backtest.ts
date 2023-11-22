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

interface OHLCV {
    symbol: string,
    startTime: number,
    open: number
    high: number,
    low: number,
    close: number,
    volume: number
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

        for (let symbol of this.symbolList) {
            this.data[symbol] = {};
            for (let tf of this.timeframes) {
                this.data[symbol][tf] = [];
            }
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

    private async handleLogic() {
        let timestamp = this.timeCurrent;
        for (let order of this.orders) {
            let { symbol } = order;
            let curPrice = this.lastPrice[symbol];
            if (order.side == 'BUY') {
                if (order.type == 'MARKET') {

                }
                else if (order.type == 'LIMIT') {

                }
                else if (order.type == 'STOP_LIMIT') {

                }
                else if (order.type == 'MARKET') {

                }
            }
            else if (order.side == 'STOP_MARKET') {
                //
            }
        }
    }


    private async getOHLCV(symbol: string, timeframe: string, limit: number, since: number): Promise<Array<OHLCV>> {
        let result = [];
        let maxCall = 1000;
        let check: { [key: number]: boolean } = {};
        while (limit > 0) {
            // if (limit > maxCall) console.log(`getOHLCV pending ${symbol} ${timeframe} ${limit}`);
            let ohlcv = await this.binance.fetchOHLCV(symbol, timeframe, since, Math.min(limit, maxCall));
            let data = ohlcv.filter(item => item[0] !== undefined && item[1] !== undefined && item[2] !== undefined && item[3] !== undefined && item[4] !== undefined && item[5] !== undefined).map(item => {
                let startTime = item[0] || 0;
                let open = item[1] || 0;
                let high = item[2] || 0;
                let low = item[3] || 0;
                let close = item[4] || 0;
                let volume = item[5] || 0;
                return { symbol, startTime, open, high, low, close, volume };
            }).filter(item => !check[item.startTime]);
            if (data.length == 0) break;
            data.sort((a, b) => a.startTime - b.startTime);
            result.push(...data);
            for (let item of data) {
                check[item.startTime] = true;
            }
            limit -= Math.min(limit, maxCall);
            since = moment(data[data.length - 1].startTime).add(1, 'minute').valueOf();
        }
        result.sort((a, b) => a.startTime - b.startTime);

        return result;
    }

    private async getData(symbol: string, date: string): Promise<Array<RateData>> {
        let startDate = moment.utc(date);
        let data: Array<OHLCV> = [];

        let filename = `../data/${symbol}_${startDate.format('YYYY-MM-DD')}.data`;
        if (!fs.existsSync(filename)) {
            data = await this.getOHLCV(symbol, '1m', 1440, startDate.valueOf());
            if (data.length == 1440 && data[0].startTime == startDate.valueOf() && data[data.length - 1].startTime + 60000 == startDate.valueOf() + 86400000) {
                let compressData = await util.compress(JSON.stringify(data));
                fs.writeFileSync(filename, compressData);
                console.log(`update data ${symbol} ${startDate.format('YYYY-MM-DD')}`);
            }
            else {
                if (data[0].startTime == startDate.valueOf()) {
                    console.log('error', { symbol, startDate: startDate.format('YYYY-MM-DD'), length: data.length });
                }
                data = [];
            }

        }
        else {
            let dataDecompress = await util.decompress(fs.readFileSync(filename));
            data = JSON.parse(dataDecompress.toString());
        }

        return data.map(item => ({
            symbol: item.symbol,
            startTime: item.startTime,
            timestring: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
            interval: '1m',
            isFinal: true,
            change: (item.close - item.open) / item.open,
            ampl: (item.high - item.low) / item.open
        }));
    }
}

async function main() {
    let symbolList = await util.getSymbolList();
    let ignoreList = ['BTCDOMUSDT', 'USDCUSDT', 'COCOSUSDT'];
    symbolList = symbolList.filter(item => item.endsWith("USDT"))
        .filter(item => !ignoreList.includes(item));

    let bot = new Backtest({
        symbolList: symbolList,
        timeframes: [/*'1m', '3m', '5m',*/ '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'],
        onCloseCandle: onCloseCandle,
        onClosePosition: async (symbol: string) => { },
        onHandleError: async (err: any, symbol: string | undefined) => { },
    });
    await bot.runBacktest('2023-10-19', '2023-11-19');
}

async function onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {
    // console.log({ symbol, timeframe, timestamp: data[0].timestring });
}

main();