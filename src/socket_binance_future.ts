import IBinance, { Binance, Candle } from 'binance-api-node';
import * as util from './common/util';
import moment from 'moment';
import delay from 'delay';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';

export class BinanceSocketFuture {
    public static readonly broker = 'binance_future';

    private gData: { [key: string]: { [key: string]: Array<RateData> } };
    private gLastPrice: { [key: string]: number };
    private gLastUpdated: { [key: string]: number };

    constructor() {
        this.gData = {};
        this.gLastPrice = {};
        this.gLastUpdated = {};
    }

    async init(numbler_candle_load: number, onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        const symbolList = await util.getBinanceFutureSymbolList();
        // console.log(symbolList.join(' '));
        console.log(`${BinanceSocketFuture.broker}: Total ${symbolList.length} symbols`);

        const timeframes = ['1m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3m', '5m',];
        // timeframes = ['1m', '15m', '4h', '1d'];
        for (const symbol of symbolList) {
            this.gData[symbol] = {};
            for (const tf of timeframes) {
                this.gData[symbol][tf] = [];
            }
        }

        console.log(`${BinanceSocketFuture.broker}: init timeframe`, timeframes);
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
                    isFinal: candle.isFinal && util.checkFinal(tf, candle.startTime)
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

                    if (data.isFinal && !dataList[0].isFinal) {
                        dataList[0].isFinal = data.isFinal;
                        onCloseCandle(BinanceSocketFuture.broker, data.symbol, data.interval, [...dataList]);
                    }
                }
                else if (dataList[0].startTime < data.startTime) {
                    dataList.unshift(data);
                    if (dataList.length > numbler_candle_load) {
                        dataList.pop();
                    }
                    if (dataList[1] && !dataList[1].isFinal) {
                        dataList[1].isFinal = true;
                        onCloseCandle(BinanceSocketFuture.broker, data.symbol, data.interval, dataList.slice(1));
                    }
                }
            }
        }

        for (const symbol of symbolList) {
            let url = `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@kline_1m`;

            const rws = new ReconnectingWebSocket(url, [], { WebSocket: WebSocket });

            rws.addEventListener('open', () => {
                // console.log(`binance: Connected to ${url}`);
            });

            rws.addEventListener('message', (event) => {
                const mess = event.data;
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

            rws.addEventListener('error', (err) => {
                console.error(`binance: WebSocket error ${symbol}`, err);
                util.restartApp();
            });

            rws.addEventListener('close', (event) => {
                console.error(`${BinanceSocketFuture.broker}: WebSocket connection closed ${symbol}, ${event.code} ${event.reason}`);
                util.restartApp();
            });
            await delay(10);
        }

        const initCandle = async (symbol: string, tf: string) => {
            const rates = await util.getBinanceFutureOHLCV(symbol, tf, numbler_candle_load);
            this.gData[symbol][tf] = rates;
            this.gLastPrice[symbol] = this.gData[symbol][tf][0]?.close || 0;
            // console.log(`${BinanceSocketFuture.broker}: init candle`, { symbol, tf })
        }

        for (const tf of timeframes) {
            console.log(`${BinanceSocketFuture.broker}: init candle ${tf}...`);
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
                    console.error(`${BinanceSocketFuture.broker}: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`);
                    throw `${BinanceSocketFuture.broker}: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`;
                }
            }
        }, timeInterval);
    }
};



import http from 'http';
import { Server } from "socket.io";
import { RateData, SymbolListener } from './common/Interface';
const server = http.createServer();
const io = new Server(server, {
    pingInterval: 25000,
    pingTimeout: 60000
});
const port = 85;
let symbolListener: { [key: string]: boolean } = {};

io.on('connection', client => {
    console.log(`${BinanceSocketFuture.broker}: client connected. total: ${io.sockets.sockets.size} connection`);

    client.on('disconnect', () => {
        console.log(`${BinanceSocketFuture.broker}: onDisconnect - Client disconnected. total: ${io.sockets.sockets.size} connection`);
    });

    client.on('update_symbol_listener', (data: Array<SymbolListener>) => {
        symbolListener = {};
        for (const { symbol, timeframe, broker } of data) {
            if (broker !== BinanceSocketFuture.broker) continue;
            let key = `${symbol}:${timeframe}`;
            symbolListener[key] = true;
        }
        console.log(`${BinanceSocketFuture.broker} on update_symbol_listener. length = ${Object.keys(symbolListener).length}`);
    });
});
server.listen(port);

function onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
    let key = `${symbol}:${timeframe}`;
    if (!symbolListener[key]) return;

    io.emit('onCloseCandle', { broker, symbol, timeframe, data });
}

const binanceSocketFuture = new BinanceSocketFuture();
binanceSocketFuture.init(300, onCloseCandle);