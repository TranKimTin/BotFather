import { Candle } from 'binance-api-node';
import * as util from '../common/util';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { SocketServer } from './socket_server';
import { SocketData } from './socket_data';
import { RateData } from '../common/Interface';

export class BinanceSocket extends SocketData {
    public static readonly broker = 'binance';

    constructor() {
        const timeframes = [/*'1m', '3m', */'5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        super(timeframes, BinanceSocket.broker, 100);
    }

    protected getSymbolList = () => {
        return util.getBinanceSymbolList();
    }

    protected getOHLCV = (symbol: string, timeframe: string) => {
        return util.getBinanceOHLCV(symbol, timeframe, 300);
    };

    protected init = () => {
        const streams = this.symbolList.map(symbol => `${symbol.toLowerCase()}@kline_1m`).join("/");
        const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

        // const ws = new WebSocket(url);
        const rws = new ReconnectingWebSocket(url, [], { WebSocket: WebSocket });

        // ws.on('open', () => {
        rws.addEventListener('open', () => {
            console.log(`${BinanceSocket.broker}: Socket connected`);
        });

        // ws.on('message', (mess) => {
        rws.addEventListener('message', (event) => {
            const mess = event.data;
            const { stream, data } = JSON.parse(mess.toString());
            const kline = data.k;
            const candle: RateData = {
                symbol: data.s,
                startTime: kline.t,
                open: kline.o,
                high: kline.h,
                low: kline.l,
                close: kline.c,
                volume: kline.v,
                interval: kline.i,
                isFinal: kline.x,
                timestring: ''
            };

            this.fetchCandles(candle);
        });

        // ws.on('error', (err) => {
        rws.addEventListener('error', (err) => {
            console.error(`${BinanceSocket.broker}: WebSocket error`, err);
            // util.restartApp();
        });

        // ws.on('close', () => {
        rws.addEventListener('close', (event) => {
            console.error(`${BinanceSocket.broker}: WebSocket connection closed , ${event.code} ${event.reason}`);
            // util.restartApp();
        });
    }
};

const port = 81;

const binanceSocket = new BinanceSocket();

const socketServer = new SocketServer(
    BinanceSocket.broker,
    port,
    binanceSocket.getData.bind(binanceSocket),
    util.getBinanceOHLCV
);

binanceSocket.SetOnCloseCandle(socketServer.onCloseCandle.bind(socketServer));
binanceSocket.initData();