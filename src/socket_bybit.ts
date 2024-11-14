import * as util from './common/util';
import moment from 'moment';
import delay from 'delay';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';

interface BybitCandle {
    start: number,
    end: number,
    interval: string,
    open: string,
    close: string,
    high: string,
    low: string,
    volume: string,
    turnover: string,
    confirm: boolean,
    timestamp: number
};

export class BybitSocket {
    public static readonly broker = 'bybit'

    private gData: { [key: string]: { [key: string]: Array<RateData> } };
    private gLastPrice: { [key: string]: number };
    private gLastUpdated: { [key: string]: number };

    constructor() {
        this.gData = {};
        this.gLastPrice = {};
        this.gLastUpdated = {};
    }

    public async init(numbler_candle_load: number, onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        const symbolList = await util.getBybitSymbolList();
        // console.log(symbolList.join(' '));
        console.log(`${BybitSocket.broker}: Total ${symbolList.length} symbols`);

        const timeframes = ['15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '1m', '3m', '5m'];
        // timeframes = ['1m', '15m', '4h', '1d'];
        for (const symbol of symbolList) {
            this.gData[symbol] = {};
            for (const tf of timeframes) {
                this.gData[symbol][tf] = [];
            }
        }

        // const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
        const rws = new ReconnectingWebSocket('wss://stream.bybit.com/v5/public/spot', [], { WebSocket: WebSocket });

        // ws.on('open', async function open() {
        rws.addEventListener('open', () => {
            console.log(`${BybitSocket.broker}: WebSocket connection opened`);

            for (let i = 0; i < symbolList.length; i += 10) {
                rws.send(JSON.stringify({
                    op: 'subscribe',
                    args: symbolList.slice(i, i + 10).map(item => `kline.1.${item}`)
                }));
                // await delay(50);
            }

        });

        const fetchCandles = (symbol: string, candle: BybitCandle) => {
            this.gLastUpdated[symbol] = new Date().getTime();
            for (const tf of timeframes) {
                const data: RateData = {
                    symbol: symbol,
                    startTime: util.getStartTime(tf, candle.start),
                    timestring: moment(util.getStartTime(tf, candle.start)).format('YYYY-MM-DD HH:mm:SS'),
                    open: +candle.open,
                    high: +candle.high,
                    low: +candle.low,
                    close: +candle.close,
                    volume: +candle.volume,
                    interval: tf,
                    isFinal: candle.confirm && util.checkFinal(tf, candle.start)
                };
                this.gLastPrice[data.symbol] = data.close;

                const dataList = this.gData[data.symbol][data.interval];
                if (!dataList[0]) return;

                if (dataList[0].startTime == data.startTime) {
                    // dataList[0] = data;
                    dataList[0].high = Math.max(dataList[0].high, data.high);
                    dataList[0].low = Math.min(dataList[0].low, data.low);
                    dataList[0].close = data.close;
                    dataList[0].volume += candle.confirm ? data.volume : 0;

                    if (data.isFinal && !dataList[0].isFinal) {
                        dataList[0].isFinal = data.isFinal;
                        onCloseCandle(BybitSocket.broker, data.symbol, data.interval, [...dataList]);
                    }
                }
                else if (dataList[0].startTime < data.startTime) {
                    dataList.unshift(data);
                    if (dataList.length > numbler_candle_load) {
                        dataList.pop();
                    }
                    if (dataList[1] && !dataList[1].isFinal) {
                        dataList[1].isFinal = true;
                        onCloseCandle(BybitSocket.broker, data.symbol, data.interval, dataList.slice(1));
                    }
                }
            }
        }

        // ws.on('message', function incoming(mess) {
        rws.addEventListener('message', (event) => {
            const mess = event.data;
            const data: { type: string, topic: string, data: Array<BybitCandle> } = JSON.parse(mess.toString());
            if (!data || data.type !== 'snapshot') return;
            const symbol = data.topic.split('.')[2];

            for (const candle of data.data) {
                fetchCandles(symbol, candle);
            }
        });

        // ws.on('close', function close() {
        rws.addEventListener('close', (event) => {
            console.error(`${BybitSocket.broker}: WebSocket connection closed ${event.code} ${event.reason}`);
            // util.restartApp();
        });

        // ws.on('error', function error(err) {
        rws.addEventListener('error', (err) => {
            console.error(`${BybitSocket.broker}: WebSocket error: `, err);
            // util.restartApp();
        });


        const initCandle = async (symbol: string, tf: string) => {
            const rates = await util.getBybitOHLCV(symbol, tf, numbler_candle_load);
            this.gData[symbol][tf] = rates;
            this.gLastPrice[symbol] = this.gData[symbol][tf][0]?.close || 0;
            // console.log('init candle', { symbol, tf })
        }

        for (const tf of timeframes) {
            console.log(`${BybitSocket.broker}: init candle ${tf}...`);
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
                    console.error(`bybit: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`);
                    util.restartApp();
                    // throw `bybit: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`;
                }
            }
        }, timeInterval);
    }

    public getData(symbol: string, timeframe: string) {
        return this.gData[symbol][timeframe];
    }
};


import http from 'http';
import { Server } from "socket.io";
import { RateData, SymbolListener } from './common/Interface';
import express from "express";
import cors from "cors";
import body_parser from "body-parser";

const app = express();
const server = http.createServer(app);
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(cors());
app.use(body_parser.json({ limit: "50mb" }));
app.use(body_parser.urlencoded({ extended: false, limit: "50mb" }));
app.get('/api/getOHLCV', async (req: any, res) => {
    try {
        const { symbol, timeframe } = req.query;
        const since = parseInt(req.query.since);

        let data: Array<RateData> = bybitSocket.getData(symbol, timeframe);

        while (data.length > 0 && data[data.length - 1].startTime < since) data.pop();

        if (data.length === 0 || data[data.length - 1].startTime > since) {
            data = await util.getBybitOHLCV(symbol, timeframe, 300, since);
        }
        while (data.length > 0 && data[data.length - 1].startTime < since) data.pop();

        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.json([]);
    }
});

const io = new Server(server, {
    pingInterval: 25000,
    pingTimeout: 60000
});
const port = 82;
let symbolListener: { [key: string]: boolean } = {};

io.on('connection', client => {
    console.log(`${BybitSocket.broker}: client connected. total: ${io.sockets.sockets.size} connection`);

    client.on('disconnect', () => {
        console.log(`${BybitSocket.broker}: onDisconnect - Client disconnected. total: ${io.sockets.sockets.size} connection`);
    });

    client.on('update_symbol_listener', (data: Array<SymbolListener>) => {
        symbolListener = {};
        for (const { symbol, timeframe, broker } of data) {
            if (broker !== BybitSocket.broker) continue;
            let key = `${symbol}:${timeframe}`;
            symbolListener[key] = true;
        }
        console.log(`${BybitSocket.broker} on update_symbol_listener. length = ${Object.keys(symbolListener).length}`);
    });
});
server.listen(port);

function onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
    let key = `${symbol}:${timeframe}`;
    if (!symbolListener[key]) return;

    io.emit('onCloseCandle', { broker, symbol, timeframe, data });
}

const bybitSocket = new BybitSocket();
bybitSocket.init(300, onCloseCandle);