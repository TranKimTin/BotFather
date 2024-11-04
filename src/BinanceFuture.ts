"use strict";
import * as ccxt from 'ccxt'
import IBinance, { Binance } from 'binance-api-node';
import moment from 'moment';
import delay from 'delay';
import * as util from './common/util';
import dotenv from 'dotenv';
import { Digit, IParamsConstructor, Order, Position, RateData } from './common/Interface';

dotenv.config({ path: '../.env' });

class BinanceFuture {
    private binance: ccxt.binanceusdm;
    private client: Binance;
    private symbolList: Array<string>;
    private timeframes: Array<string>;
    private onCloseCandle: (symbol: string, timeframe: string, data: Array<RateData>) => void;
    private onHandleError: (err: any, symbol: string | undefined) => void;
    private onInitStart: () => void;
    private onInitDone: () => void;
    private onClosePosition: (symbol: string) => void;

    public digits: { [key: string]: Digit };
    private data: { [key: string]: { [key: string]: Array<RateData> } };
    private positions: { [key: string]: Position };
    private minVolumes: { [key: string]: number };
    private lastPrice: { [key: string]: number };
    private isReadOnly: boolean;

    constructor(params: IParamsConstructor) {
        // new ServerData(process.env.PORT_DATA_SERVER);

        const key = {
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
        this.onInitStart = params.onInitStart;
        this.onInitDone = params.onInitDone;
        this.data = {};
        this.digits = {};
        this.positions = {};
        this.minVolumes = {};
        this.lastPrice = {};
        this.isReadOnly = params.isReadOnly || false;

        for (const symbol of this.symbolList) {
            this.data[symbol] = {};
            for (const tf of this.timeframes) {
                this.data[symbol][tf] = [];
            }
        }
    }

    private async updatePosition() {
        if (this.isReadOnly) return;
        const balance = await this.binance.fetchBalance();
        for (const position of balance.info.positions) {
            const symbol = position.symbol;
            const volume = position.positionAmt * 1;
            const entryPrice = position.entryPrice * 1;
            const profit = position.unrealizedProfit * 1;
            const side = volume > 0 ? 'BUY' : volume < 0 ? 'SELL' : '';
            this.positions[symbol] = { symbol, side, volume, entryPrice, profit };
            if (volume != 0) console.log(position);
        }
    }

    async init(numbler_candle_load: number = 300): Promise<void> {
        // if (!this.isReadOnly)
        await this.onInitStart();
        console.log('init digits...');
        const market = await this.binance.loadMarkets(true);
        for (const key in market) {
            const item = market[key];
            if (!item) continue;
            const symbol = item.info.symbol.replace('/', '');
            const precision = item.precision;
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
            await this.updatePosition();
            console.log('init user event...');

            await this.client.ws.futuresUser(async msg => {
                console.log(msg);
                if (msg.eventType == 'ACCOUNT_UPDATE') {
                    const { positions } = msg;
                    for (const position of positions) {
                        const { symbol, positionAmount } = position;

                        if (+positionAmount) continue;

                        const orders = await this.getOpenOrders(symbol);
                        for (const order of orders) {
                            const { id, reduceOnly, closePosition } = order;
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
                        // await this.onClosePosition(symbol);
                    }
                }
                else if (msg.eventType == 'ORDER_TRADE_UPDATE' && msg.timeInForce.toString() == 'GTD' && msg.executionType == 'CANCELED') {
                    const { symbol } = msg;
                    const orders = await this.getOpenOrders(symbol);
                    for (const order of orders) {
                        const { id, reduceOnly, closePosition } = order;
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

        console.log('init timeframe', this.timeframes);
        this.client.ws.futuresCandles(this.symbolList, '1m', candle => {
            for (const tf of this.timeframes) {
                const data = {
                    symbol: candle.symbol,
                    startTime: util.getStartTime(tf, candle.startTime),
                    timestring: moment(util.getStartTime(tf, candle.startTime)).format('YYYY-MM-DD HH:mm:SS'),
                    open: +candle.open,
                    high: +candle.high,
                    low: +candle.low,
                    close: +candle.close,
                    volume: +candle.volume,
                    interval: tf,
                    isFinal: candle.isFinal && util.checkFinal(tf, candle.startTime)
                };
                this.lastPrice[data.symbol] = data.close;

                const dataList = this.data[data.symbol][data.interval];
                if (!dataList[0]) return;

                if (dataList[0].startTime == data.startTime) {
                    // dataList[0] = data;
                    dataList[0].high = Math.max(dataList[0].high, data.high);
                    dataList[0].low = Math.min(dataList[0].low, data.low);
                    dataList[0].close = data.close;
                    dataList[0].volume += candle.isFinal ? data.volume : 0;
                    dataList[0].isFinal = data.isFinal;

                    if (data.isFinal) {
                        this.onCloseCandle(data.symbol, data.interval, [...dataList]);
                    }
                }
                else {
                    dataList.unshift(data);
                    if (dataList[1] && !dataList[1].isFinal) {
                        this.onCloseCandle(data.symbol, data.interval, dataList.slice(1));
                    }
                }
            }
        });

        for (const tf of this.timeframes) {
            console.log(`init candle ${tf}...`);
            const promiseList = [];
            for (const symbol of this.symbolList) {
                promiseList.push(util.getBinanceFutureOHLCV(symbol, tf, numbler_candle_load));
                // promiseList.push(util.getOHLCVFromCache(symbol, tf, numbler_candle_load));
                // promiseList.push(fetch(`http://localhost:${process.env.PORT_DATA_SERVER}/?symbol=${symbol}&timeframe=${tf}&limit=${numbler_candle_load}`));
            }
            // const responses = await Promise.all(promiseList);
            // const rates = await Promise.all(responses.map(item => item.json()));
            const rates = await Promise.all(promiseList);
            let i = 0;
            for (const symbol of this.symbolList) {
                this.data[symbol][tf] = rates[i++];
                this.lastPrice[symbol] = this.data[symbol][tf][0]?.close || 0;
            }
            await delay(5000);
        }
        console.log('init done.');
        await this.onInitDone();
    }

    async getOpenOrders(symbol: string): Promise<Array<Order>> {
        if (this.isReadOnly) return [];

        const orders = await this.binance.fetchOpenOrders(symbol);
        const result = orders.map(item => (
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
                timestamp: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
                timeInt: moment(item.timestamp).valueOf()
            }));
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

        const lastPrice = this.lastPrice[symbol];
        volume = Math.max(volume, this.minVolumes[symbol]);
        volume = +volume.toFixed(this.digits[symbol].volume);

        if (side == 'buy' || side == 'long' || side == 'LONG') side = 'BUY';
        if (side == 'sell' || side == 'short' || side == 'SHORT') side = 'SELL';

        if (!TP && TP_Percent) TP = (side == 'BUY') ? (lastPrice * (1 + TP_Percent)) : lastPrice * (1 - TP_Percent);
        if (!SL && SL_Percent) SL = (side == 'BUY') ? (lastPrice * (1 - SL_Percent)) : lastPrice * (1 + SL_Percent);

        TP = TP ? +TP?.toFixed(this.digits[symbol].price) : 0;
        SL = SL ? +SL.toFixed(this.digits[symbol].price) : 0;

        const sideClose = (side == 'BUY') ? 'SELL' : 'BUY';

        console.log('orderMarket', { symbol, side, volume, TP, SL });
        if (this.isReadOnly) return;

        const promiseList = [this.binance.createMarketOrder(symbol, side, volume)];
        if (TP) promiseList.push(this.binance.createLimitOrder(symbol, sideClose, volume, TP, { 'reduceOnly': false }))
        if (SL) promiseList.push(this.orderStopMarket(symbol, sideClose, volume, SL, false, true));


        const result = await Promise.allSettled(promiseList);
        for (const res of result) {
            if (res.status == 'rejected') {
                for (const res of result) {
                    if (res.status == 'fulfilled') {
                        const { id, orderId, symbol } = <any>res.value;
                        await this.binance.cancelOrder(id || orderId, symbol);
                    }
                    else {
                        const reason = res.reason;
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

        const sideClose = (side == 'BUY') ? 'SELL' : 'BUY';

        const option = {
            timeInForce: 'GTC',
            goodTillDate: 0
        };

        if (expiredTime) {
            option.timeInForce = 'GTD';
            option.goodTillDate = expiredTime;
        }

        console.log('orderLimit', { symbol, side, volume, price, TP, SL, option });
        if (this.isReadOnly) return;

        const promiseList = [this.binance.createLimitOrder(symbol, side, volume, price, option)];
        if (TP) promiseList.push(this.orderStopLimit(symbol, sideClose, volume, price, TP, false, false))
        if (SL) promiseList.push(this.orderStopMarket(symbol, sideClose, volume, SL, false, true));

        const result = await Promise.allSettled(promiseList);
        for (const res of result) {
            if (res.status == 'rejected') {
                for (const res of result) {
                    if (res.status == 'fulfilled') {
                        const { id, orderId, symbol } = <any>res.value;
                        await this.binance.cancelOrder(id || orderId, symbol);
                    }
                    else {
                        const reason = res.reason;
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