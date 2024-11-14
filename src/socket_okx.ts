import * as util from './common/util';
import moment from 'moment';
import delay from 'delay';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';

export class OkxSocket {
    public static readonly broker = 'okx'

    private gData: { [key: string]: { [key: string]: Array<RateData> } };
    private gLastPrice: { [key: string]: number };
    private gLastUpdated: { [key: string]: number };

    constructor() {
        this.gData = {};
        this.gLastPrice = {};
        this.gLastUpdated = {};
    }

    public async init(numbler_candle_load: number, onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        const symbolList = await util.getOkxSymbolList();
        // console.log(symbolList.join(' '));
        console.log(`${OkxSocket.broker}: Total ${symbolList.length} symbols`);

        const timeframes = ['15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '1m', '3m', '5m'];
        // timeframes = ['1m', '15m', '4h', '1d'];
        for (const symbol of symbolList) {
            this.gData[symbol] = {};
            for (const tf of timeframes) {
                this.gData[symbol][tf] = [];
            }
        }

        // const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/business');
        const rws = new ReconnectingWebSocket('wss://ws.okx.com:8443/ws/v5/business', [], { WebSocket: WebSocket });

        // ws.on('open', async function open() {
        rws.addEventListener('open', () => {
            console.log(`${OkxSocket.broker}: WebSocket connection opened`);

            rws.send(JSON.stringify({
                op: "subscribe",
                args:
                    symbolList.map(symbol => ({
                        channel: "candle1m",
                        instId: symbol
                    }))

            }));
        });

        const fetchCandles = (symbol: string, candle: Array<string>) => {
            this.gLastUpdated[symbol] = new Date().getTime();
            for (const tf of timeframes) {
                const data: RateData = {
                    symbol: symbol,
                    startTime: util.getStartTime(tf, +candle[0]),
                    timestring: moment(util.getStartTime(tf, +candle[0])).format('YYYY-MM-DD HH:mm:SS'),
                    open: +candle[1],
                    high: +candle[2],
                    low: +candle[3],
                    close: +candle[4],
                    volume: +candle[5],
                    interval: tf,
                    isFinal: (!!+candle[8]) && util.checkFinal(tf, +candle[0])
                };
                this.gLastPrice[data.symbol] = data.close;

                const dataList = this.gData[data.symbol][data.interval];
                if (!dataList[0]) return;

                if (dataList[0].startTime == data.startTime) {
                    // dataList[0] = data;
                    dataList[0].high = Math.max(dataList[0].high, data.high);
                    dataList[0].low = Math.min(dataList[0].low, data.low);
                    dataList[0].close = data.close;
                    dataList[0].volume += (!!+candle[8]) ? data.volume : 0;

                    if (data.isFinal && !dataList[0].isFinal) {
                        dataList[0].isFinal = data.isFinal;
                        onCloseCandle(OkxSocket.broker, data.symbol, data.interval, [...dataList]);
                    }
                }
                else if (dataList[0].startTime < data.startTime) {
                    dataList.unshift(data);
                    if (dataList.length > numbler_candle_load) {
                        dataList.pop();
                    }
                    if (dataList[1] && !dataList[1].isFinal) {
                        dataList[1].isFinal = true;
                        console.log('forces final', dataList[1]);
                        onCloseCandle(OkxSocket.broker, data.symbol, data.interval, dataList.slice(1));
                    }
                }
            }
        }

        // ws.on('message', function incoming(mess) {
        rws.addEventListener('message', (event) => {
            const mess = event.data;
            const data = JSON.parse(mess.toString()) as { event: string, arg: { channel: string, instId: string }, data: Array<Array<string>> };
            if (data.arg.channel !== 'candle1m' || data.event === 'subscribe') return;


            const symbol = data.arg.instId;
            for (const candle of data.data) {
                fetchCandles(symbol, candle);
            }
        });

        // ws.on('close', function close() {
        rws.addEventListener('close', (event) => {
            console.error(`${OkxSocket.broker}: WebSocket connection closed ${event.code} ${event.reason}`);
            // util.restartApp();
        });

        // ws.on('error', function error(err) {
        rws.addEventListener('error', (err) => {
            console.error(`${OkxSocket.broker}: WebSocket error: `, err);
            // util.restartApp();
        });


        const initCandle = async (symbol: string, tf: string) => {
            const rates = await util.getOkxOHLCV(symbol, tf, numbler_candle_load);
            this.gData[symbol][tf] = rates;
            this.gLastPrice[symbol] = this.gData[symbol][tf][0]?.close || 0;
            // console.log('init candle', { symbol, tf })
        }

        for (const tf of timeframes) {
            console.log(`${OkxSocket.broker}: init candle ${tf}...`);
            let promiseList = [];
            for (const symbol of symbolList) {
                promiseList.push(initCandle(symbol, tf));
                if (promiseList.length >= 20) {
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
                    console.error(`${OkxSocket.broker}: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`);
                    util.restartApp();
                    // throw `${OkxSocket.broker}: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`;
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

        let data: Array<RateData> = okxSocket.getData(symbol, timeframe);

        while (data.length > 0 && data[data.length - 1].startTime < since) data.pop();

        if (data.length === 0 || data[data.length - 1].startTime > since) {
            data = await util.getOkxOHLCVHistory(symbol, timeframe, 100, since);
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
const port = 83;
let symbolListener: { [key: string]: boolean } = {};

io.on('connection', client => {
    console.log(`${OkxSocket.broker}: client connected. total: ${io.sockets.sockets.size} connection`);

    client.on('disconnect', () => {
        console.log(`${OkxSocket.broker}: onDisconnect - Client disconnected. total: ${io.sockets.sockets.size} connection`);
    });

    client.on('update_symbol_listener', (data: Array<SymbolListener>) => {
        symbolListener = {};
        for (const { symbol, timeframe, broker } of data) {
            if (broker !== OkxSocket.broker) continue;
            let key = `${symbol}:${timeframe}`;
            symbolListener[key] = true;
        }
        console.log(`${OkxSocket.broker} on update_symbol_listener. length = ${Object.keys(symbolListener).length}`);
    });
});
server.listen(port);

function onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
    let key = `${symbol}:${timeframe}`;
    if (!symbolListener[key]) return;

    io.emit('onCloseCandle', { broker, symbol, timeframe, data });
}

const okxSocket = new OkxSocket();
okxSocket.init(300, onCloseCandle);