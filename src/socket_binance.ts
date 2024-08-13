import IBinance, { Binance, Candle } from 'binance-api-node';
import { RateData } from './BinanceFuture';
import * as util from './util';
import moment from 'moment';
import delay from 'delay';
import WebSocket from 'ws';

export class BinanceSocket {
    public static readonly broker = 'binance';

    private gBinance: Binance;
    private gData: { [key: string]: { [key: string]: Array<RateData> } };
    private gLastPrice: { [key: string]: number };
    private gLastUpdated: { [key: string]: number };

    constructor() {
        this.gBinance = IBinance({});
        this.gData = {};
        this.gLastPrice = {};
        this.gLastUpdated = {};
    }

    async init(numbler_candle_load: number, onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        const symbolList = await util.getBinanceSymbolList();
        // console.log(symbolList.join(' '));
        console.log(`binance: Total ${symbolList.length} symbols`);

        const timeframes = ['15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '1m', '3m', '5m',];
        // timeframes = ['1m', '15m', '4h', '1d'];
        for (const symbol of symbolList) {
            this.gData[symbol] = {};
            for (const tf of timeframes) {
                this.gData[symbol][tf] = [];
            }
        }

        console.log('binance: init timeframe', timeframes);
        const fetchCandles = (candle: Candle) => {
            this.gLastUpdated[candle.symbol] = new Date().getTime();
            for (const tf of timeframes) {
                const data: RateData = {
                    symbol: candle.symbol,
                    startTime: util.getStartTime(tf, candle.startTime),
                    timestring: moment(util.getStartTime(tf, candle.startTime)).format('YYYY-MM-DD HH:mm:SS'),
                    open: +candle.open,
                    high: +candle.high,
                    low: +candle.low,
                    close: +candle.close,
                    volume: +candle.volume,
                    interval: tf,
                    isFinal: candle.isFinal && util.checkFinal(tf, candle.startTime),
                    change: (+candle.close - +candle.open) / +candle.open,
                    ampl: (+candle.high - +candle.low) / +candle.open
                };
                this.gLastPrice[data.symbol] = data.close;

                const dataList = this.gData[data.symbol][data.interval];
                if (!dataList[0]) return;

                if (dataList[0].startTime == data.startTime) {
                    // dataList[0] = data;
                    dataList[0].high = Math.max(dataList[0].high, data.high);
                    dataList[0].low = Math.min(dataList[0].low, data.low);
                    dataList[0].close = data.close;
                    dataList[0].volume += candle.isFinal ? data.volume : 0;
                    dataList[0].change = (dataList[0].close - dataList[0].open) / dataList[0].open;
                    dataList[0].ampl = (dataList[0].high - dataList[0].low) / dataList[0].open;

                    if (data.isFinal && !dataList[0].isFinal) {
                        dataList[0].isFinal = data.isFinal;
                        onCloseCandle(BinanceSocket.broker, data.symbol, data.interval, [...dataList]);
                    }
                }
                else if (dataList[0].startTime < data.startTime) {
                    dataList.unshift(data);
                    if (dataList[1] && !dataList[1].isFinal) {
                        dataList[1].isFinal = true;
                        onCloseCandle(BinanceSocket.broker, data.symbol, data.interval, dataList.slice(1));
                    }
                }
            }
        }

        // if (util.isFuture()) {
        //     this.gBinance.ws.futuresCandles(symbolList, '1m', fetchCandles);
        // }
        // else {
        //     this.gBinance.ws.candles(symbolList, '1m', fetchCandles);
        // }
        for (const symbol of symbolList) {
            let url = '';
            if (util.isFuture()) {
                url = `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@kline_1m`;
            }
            else {
                url = `wss://stream.binance.com/ws/${symbol.toLowerCase()}@kline_1m`;
            }
            const ws = new WebSocket(url);
            ws.on('open', () => {
                // console.log(`binance: Connected to ${url}`);
            });
            ws.on('message', (mess) => {
                const data = JSON.parse(mess.toString());
                const kline = data.k;
                const candle: Candle = {
                    eventType: data.e,
                    eventTime: data.E,
                    symbol: symbol,
                    startTime: kline.t,
                    closeTime: kline.T,
                    firstTradeId: kline.f,
                    lastTradeId: kline.L,
                    open: kline.o,
                    high: kline.h,
                    low: kline.l,
                    close: kline.c,
                    volume: kline.v,
                    trades: kline.n,
                    interval: kline.i,
                    isFinal: kline.x,
                    quoteVolume: kline.q,
                    buyVolume: kline.V,
                    quoteBuyVolume: kline.Q
                };

                fetchCandles(candle);
            });

            ws.on('error', (error) => {
                console.error(`binance: WebSocket error ${symbol}`, error);
                setTimeout(() => {
                    throw error;
                }, 5000);
            });

            ws.on('close', () => {
                console.error(`binance: WebSocket connection closed ${symbol}`);
                setTimeout(() => {
                    throw 'binance: socket close';
                }, 5000);
            });
            await delay(10);
        }

        const initCandle = async (symbol: string, tf: string) => {
            const rates = await util.getOHLCV(symbol, tf, numbler_candle_load);
            this.gData[symbol][tf] = rates;
            this.gLastPrice[symbol] = this.gData[symbol][tf][0]?.close || 0;
            // console.log('binance: init candle', { symbol, tf })
        }

        for (const tf of timeframes) {
            console.log(`binance: init candle ${tf}...`);
            let promiseList = [];
            for (const symbol of symbolList) {
                promiseList.push(initCandle(symbol, tf));
                if (promiseList.length >= 100) {
                    await Promise.all(promiseList);
                    promiseList = [];
                    await delay(5000);
                }
            }
            await Promise.all(promiseList);

            await delay(1000);
        }

        const timeInterval = 10 * 60 * 1000;
        setInterval(() => {
            const now = new Date().getTime();
            for (const symbol in this.gLastUpdated) {
                const lastTimeUpdated = this.gLastUpdated[symbol];
                if (now - lastTimeUpdated > timeInterval) {
                    console.log(`binance: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`);
                    throw `binance: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`;
                }
            }
        }, timeInterval);
    }
};