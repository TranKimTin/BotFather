import { Candle } from 'binance-api-node';
import * as util from '../common/util';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { SocketServer } from './socket_server';
import { RateData } from '../common/Interface';
import { SocketData } from './socket_data';


export class BinanceSocketFuture extends SocketData {
    public static readonly broker = 'binance_future';

    constructor() {
        const timeframes = [/*'1m', '3m', */'5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        super(timeframes, BinanceSocketFuture.broker, 100);
    }

    protected getSymbolList = () => {
        return util.getBinanceFutureSymbolList();
    }

    protected getOHLCV = (symbol: string, timeframe: string) => {
        return util.getBinanceFutureOHLCV(symbol, timeframe, 300);
    };

    protected init = () => {
        const streams = this.symbolList.map(symbol => `${symbol.toLowerCase()}@kline_1m`).join("/");
        const url = `wss://fstream.binance.com/stream?streams=${streams}`;

        const rws = new ReconnectingWebSocket(url, [], { WebSocket: WebSocket });

        rws.addEventListener('open', () => {
            console.log(`${BinanceSocketFuture.broker}: Socket connected`);
        });

        rws.addEventListener('message', (event) => {
            const mess = event.data;
            const { data } = JSON.parse(mess.toString());
            const kline = data.k;
            const candle: RateData = {
                symbol: data.s,
                startTime: +kline.t,
                open: +kline.o,
                high: +kline.h,
                low: +kline.l,
                close: +kline.c,
                volume: +kline.v,
                interval: kline.i,
                isFinal: !!kline.x,
                timestring: ''
            };

            this.fetchCandles(candle);
        });

        rws.addEventListener('error', (err) => {
            console.error(`binance: WebSocket error`, err);
            // util.restartApp();
        });

        rws.addEventListener('close', (event) => {
            console.error(`${BinanceSocketFuture.broker}: WebSocket connection closed, ${event.code} ${event.reason}`);
            // util.restartApp();
        });
    }
};

const port = 85;

const binanceSocketFuture = new BinanceSocketFuture();
const socketServer = new SocketServer(
    BinanceSocketFuture.broker,
    port,
    binanceSocketFuture.getData.bind(binanceSocketFuture),
    util.getBinanceFutureOHLCV
);

binanceSocketFuture.SetOnCloseCandle(socketServer.onCloseCandle.bind(socketServer));
binanceSocketFuture.initData();