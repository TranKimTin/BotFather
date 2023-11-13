"use strict";
import * as ccxt from 'ccxt'
import IBinance, { Binance } from 'binance-api-node';
import moment, { DurationInputArg2 } from 'moment';
import delay from 'delay';
import telegram from './telegram';


export interface RateData {
    symbol: string,
    startTime: number,
    timestring: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    interval: string,
    isFinal: boolean,
    change: number,
    ampl: number
}

export interface IParamsConstructor {
    apiKey: string | undefined,
    secretKey: string | undefined,
    symbolList: Array<string>,
    timeframes: Array<string>,
    onCloseCandle: (symbol: string, timeframe: string, data: Array<RateData>) => void,
    onClosePosition: (symbol: string) => void,
    onHandleError: (err: unknown, symbol: string | undefined) => void,
    isReadOnly?: boolean
}

export interface Digit {
    volume: number | undefined,
    price: number | undefined
}

export interface Position {
    symbol: string,
    side: string,
    volume: number
}

export interface Order {
    id: string,
    symbol: string,
    side: 'buy' | 'sell',
    type: 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_MARKET',
    price: number,
    volume: number,
    stopPrice: number,
    status: string,
    reduceOnly: boolean,
    closePosition: boolean,
    timestamp: string,
    timeInt: number
}

export interface OHLCV {
    symbol: string,
    startTime: number,
    timestring: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    interval: string,
    isFinal: boolean,
    change: number,
    ampl: number
}

class BinanceFuture {
    private binance: ccxt.binanceusdm;
    private client: Binance;
    private symbolList: Array<string>;
    private timeframes: Array<string>;
    private onCloseCandle: (symbol: string, timeframe: string, data: Array<RateData>) => void;
    private onHandleError: (err: any, symbol: string | undefined) => void;
    private onClosePosition: (symbol: string) => void;

    public digits: { [key: string]: Digit };
    private data: { [key: string]: { [key: string]: Array<RateData> } };
    private positions: { [key: string]: Position };
    private minVolumes: { [key: string]: number };
    private lastPrice: { [key: string]: number };
    private isReadOnly: boolean;

    constructor(params: IParamsConstructor) {
        let key = {
            apiKey: params.isReadOnly ? undefined : params.apiKey,
            secret: params.isReadOnly ? undefined : params.secretKey,
            apiSecret: params.isReadOnly ? undefined : params.secretKey
        };
        this.binance = new ccxt.binanceusdm(key);
        this.client = IBinance(key);
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
        this.isReadOnly = params.isReadOnly || false;

        for (let symbol of this.symbolList) {
            this.data[symbol] = {};
            for (let tf of this.timeframes) {
                this.data[symbol][tf] = [];
            }
        }
    }

    async init(numbler_candle_load: number = 300): Promise<void> {
        // if (!this.isReadOnly)
        await telegram.sendMessage('bot restart...');
        console.log('init digits...');
        let market = await this.binance.loadMarkets(true);
        for (let key in market) {
            let item = market[key];
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

        if (!this.isReadOnly) {
            console.log('init balance...');

            let balance = await this.binance.fetchBalance();
            for (let position of balance.info.positions) {
                let symbol = position.symbol;
                let volume = position.positionAmt * 1;
                let side = volume > 0 ? 'LONG' : volume < 0 ? 'SHORT' : '';
                this.positions[symbol] = { symbol, side, volume };
            }

            console.log('init user event...');

            await this.client.ws.futuresUser(async msg => {
                console.log(msg);
                if (msg.eventType == 'ACCOUNT_UPDATE') {
                    let { positions } = msg;
                    for (let position of positions) {
                        let { symbol, positionAmount } = position;
                        this.positions[symbol] = {
                            symbol,
                            side: (+positionAmount > 0) ? 'LONG' : +positionAmount < 0 ? 'SHORT' : '',
                            volume: +positionAmount
                        };

                        if (+positionAmount) continue;

                        let orders = await this.getOpenOrders(symbol);
                        for (let order of orders) {
                            let { id, reduceOnly, closePosition } = order;
                            // if (!reduceOnly && !closePosition) continue;
                            try {
                                console.log('cancel order', { id, symbol });
                                await this.binance.cancelOrder(id, symbol);
                            }
                            catch (err) {
                                console.log('ERROR', err);
                                await this.onHandleError(err, symbol);
                            }
                        }
                        await this.onClosePosition(symbol);
                    }
                }
                else if (msg.eventType == 'ORDER_TRADE_UPDATE' && msg.timeInForce.toString() == 'GTD' && msg.executionType == 'CANCELED') {
                    let { symbol } = msg;
                    let orders = await this.getOpenOrders(symbol);
                    for (let order of orders) {
                        let { id, reduceOnly, closePosition } = order;
                        // if (!reduceOnly && !closePosition) continue;
                        try {
                            console.log('cancel order', { id, symbol });
                            await this.binance.cancelOrder(id, symbol);
                        }
                        catch (err) {
                            console.log('ERROR', err);
                            await this.onHandleError(err, symbol);
                        }
                    }
                    await this.onClosePosition(symbol);
                }
            });
        }

        for (let tf of this.timeframes) {
            console.log(`init future candle ${tf}...`);
            let promiseList = [];
            for (let symbol of this.symbolList) {
                promiseList.push(this.getOHLCV(symbol, tf, numbler_candle_load));
            }
            let rates = await Promise.all(promiseList);
            let i = 0;
            for (let symbol of this.symbolList) {
                this.data[symbol][tf] = rates[i++];
                this.lastPrice[symbol] = this.data[symbol][tf][0].close;
            }

            await this.client.ws.futuresCandles(this.symbolList, tf, async candle => {
                let data = {
                    symbol: candle.symbol,
                    startTime: candle.startTime,
                    timestring: moment(candle.startTime).format('YYYY-MM-DD HH:mm:SS'),
                    open: +candle.open,
                    high: +candle.high,
                    low: +candle.low,
                    close: +candle.close,
                    volume: +candle.volume,
                    interval: candle.interval,
                    isFinal: candle.isFinal,
                    change: (+candle.open * 1 - +candle.close * 1) / +candle.open,
                    ampl: (+candle.high * 1 - +candle.low) / +candle.open
                };
                this.lastPrice[data.symbol] = data.close;

                let dataList = this.data[data.symbol][data.interval];
                if (dataList[0].startTime == data.startTime) {
                    dataList[0] = data;
                    if (data.isFinal) {
                        await this.onCloseCandle(data.symbol, data.interval, [...dataList]);
                    }
                }
                else {
                    dataList.unshift(data);
                    if (!dataList[1].isFinal) {
                        await this.onCloseCandle(data.symbol, data.interval, dataList.slice(1));
                    }
                }
            })//({ fastClose: false, keepClosed: false, delay: 1000 });
            await delay(5000);
        }
        console.log('init done.');
        // if (!this.isReadOnly)
        await telegram.sendMessage('bot restart done.');
    }

    async getOpenOrders(symbol: string): Promise<Array<Order>> {
        if (this.isReadOnly) return [];

        let orders = await this.binance.fetchOpenOrders(symbol);
        let result = orders.map(item => (
            {
                id: item.id,
                symbol: item.info.symbol,
                side: item.info.side, //buy sell
                type: item.info.type, //LIMIT, MARKET, STOP_LIMIT, STOP_MARKET
                price: item.info.price * 1 || 0,
                volume: item.amount * 1,
                stopPrice: item.info.stopPrice * 1 || 0,
                status: item.info.status,
                reduceOnly: item.info.reduceOnly,
                closePosition: item.info.closePosition,
                timestamp: moment(item.timestamp).format('DD/MM/YYYY HH:mm:ss'),
                timeInt: moment(item.timestamp).valueOf()
            }));
        return result;
    }

    async getOHLCV(symbol: string, timeframe: string, limit: number) {
        let result = [];
        let maxCall = 1000;
        let since: number | undefined = undefined;
        let check: { [key: number]: boolean } = {};
        while (limit > 0) {
            if (limit > maxCall) console.log(`getOHLCV pending ${symbol} ${timeframe} ${limit}`);
            let ohlcv = await this.binance.fetchOHLCV(symbol, timeframe, since, Math.min(limit, maxCall));
            let data = ohlcv.map(item => ({
                symbol,
                startTime: item[0],
                timestring: moment(item[0]).format('YYYY-MM-DD HH:mm:SS'),
                open: item[1],
                high: item[2],
                low: item[3],
                close: item[4],
                volume: item[5],
                interval: timeframe,
                isFinal: true,
                change: (item[4] - item[1]) / item[1],
                ampl: (item[2] - item[3]) / (item[1])
            })).filter(item => !check[item.startTime]);
            if (data.length == 0) break;
            data.sort((a, b) => a.startTime - b.startTime);
            result.push(...data);
            for (let item of data) {
                check[item.startTime] = true;
            }
            limit -= Math.min(limit, maxCall);
            since = moment(data[0].startTime).subtract(Math.min(limit, maxCall) * (+timeframe.slice(0, timeframe.length - 1)), <DurationInputArg2>timeframe[timeframe.length - 1]).valueOf();
        }
        result.sort((a, b) => b.startTime - a.startTime);
        result[0].isFinal = false;
        return result;
    }

    async orderStopMarket(symbol: string, side: string, volume: number, price: number, isTakeProfit: boolean, closePosition: boolean, workingType: 'CONTRACT_PRICE' | 'MARK_PRICE' = 'CONTRACT_PRICE') {
        if (side == 'buy' || side == 'long' || side == 'LONG') side = 'BUY';
        if (side == 'sell' || side == 'short' || side == 'SHORT') side = 'SELL';

        price = +price.toFixed(this.digits[symbol].price);
        volume = Math.max(volume, this.minVolumes[symbol]);
        volume = +volume.toFixed(this.digits[symbol].volume);

        console.log('orderStopMarket', { symbol, side, volume, price, isTakeProfit, closePosition, workingType });
        if (this.isReadOnly) return;

        return await this.binance.fapiPrivatePostOrder({
            'symbol': symbol,
            'type': isTakeProfit ? 'TAKE_PROFIT_MARKET' : 'STOP_MARKET',
            'side': side,
            'quantity': volume,
            'timeInForce': 'GTC',
            'stopPrice': price,
            'closePosition': closePosition,
            workingType: workingType
        });
    }

    async orderStopLimit(symbol: string, side: string, volume: number, stopPrice: number, limitPrice: number, isTakeProfit: boolean, reduceOnly: boolean, workingType: 'CONTRACT_PRICE' | 'MARK_PRICE' = 'CONTRACT_PRICE') {
        if (side == 'buy' || side == 'long' || side == 'LONG') side = 'BUY';
        if (side == 'sell' || side == 'short' || side == 'SHORT') side = 'SELL';

        stopPrice = +stopPrice.toFixed(this.digits[symbol].price);
        limitPrice = +limitPrice.toFixed(this.digits[symbol].price);
        volume = Math.max(volume, this.minVolumes[symbol]);
        volume = +volume.toFixed(this.digits[symbol].volume);

        console.log('orderStopLimit', { symbol, side, volume, stopPrice, limitPrice, isTakeProfit, reduceOnly, workingType })
        if (this.isReadOnly) return;

        return await this.binance.fapiPrivatePostOrder({
            'symbol': symbol,
            'type': isTakeProfit ? 'TAKE_PROFIT' : 'STOP',
            'side': side,
            'quantity': volume,
            'timeInForce': 'GTC',
            'price': limitPrice,
            'stopPrice': stopPrice,
            'reduceOnly': reduceOnly,
            'workingType': workingType
        });
    }

    async orderMarket(symbol: string, side: string, volume: number, options: { TP?: number, SL?: number, TP_Percent?: number, SL_Percent?: number } = {}) {
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
        if (this.isReadOnly) return;

        let promiseList = [this.binance.createMarketOrder(symbol, side, volume)];
        if (TP) promiseList.push(this.binance.createLimitOrder(symbol, sideClose, volume, TP, { 'reduceOnly': false }))
        if (SL) promiseList.push(this.orderStopMarket(symbol, sideClose, volume, SL, false, true));


        let result = await Promise.allSettled(promiseList);
        for (let res of result) {
            if (res.status == 'rejected') {
                for (let res of result) {
                    if (res.status == 'fulfilled') {
                        let { id, orderId, symbol } = <any>res.value;
                        await this.binance.cancelOrder(id || orderId, symbol);
                    }
                    else {
                        let reason = res.reason;
                        console.log('ERROR', reason);
                        await this.onHandleError(reason, symbol);
                    }
                }
                break;
            }
        }
        return result.map(item => item.status == 'fulfilled' ? item.value : item.reason);
    }

    async orderLimit(symbol: string, side: string, volume: number, price: number, options: { TP?: number, SL?: number, TP_Percent?: number, SL_Percent?: number, expiredTime?: number } = {}) {
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
        if (this.isReadOnly) return;

        let promiseList = [this.binance.createLimitOrder(symbol, side, volume, price, option)];
        if (TP) promiseList.push(this.orderStopLimit(symbol, sideClose, volume, price, TP, false, false))
        if (SL) promiseList.push(this.orderStopMarket(symbol, sideClose, volume, SL, false, true));

        let result = await Promise.allSettled(promiseList);
        for (let res of result) {
            if (res.status == 'rejected') {
                for (let res of result) {
                    if (res.status == 'fulfilled') {
                        let { id, orderId, symbol } = <any>res.value;
                        await this.binance.cancelOrder(id || orderId, symbol);
                    }
                    else {
                        let reason = res.reason;
                        console.log('ERROR', reason);
                        await this.onHandleError(reason, symbol);
                    }
                }
                break;
            }
        }
        return result.map(item => item.status == 'fulfilled' ? item.value : item.reason);
    }
}

export default BinanceFuture;