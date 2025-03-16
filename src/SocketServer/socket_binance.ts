import * as util from '../common/util';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { SocketData } from './socket_data';
import { MAX_CANDLE, RateData } from '../common/Interface';

export class BinanceSocket extends SocketData {
    public static readonly broker = 'binance';

    constructor(onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void, symbolList: Array<string>) {
        const timeframes = [/*'1m', '3m', */'5m', '15m', '30m', '1h', /*'2h',*/ '4h', /*'6h', '8h', '12h',*/ '1d'];
        super(timeframes, BinanceSocket.broker, 100, onCloseCandle, symbolList);
    }

    protected getOHLCV = (symbol: string, timeframe: string, since?: number) => {
        return util.getBinanceOHLCV(symbol, timeframe, MAX_CANDLE, since);
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
                startTime: +kline.t,
                open: +kline.o,
                high: +kline.h,
                low: +kline.l,
                close: +kline.c,
                volume: +kline.v,
                interval: kline.i,
                isFinal: !!+kline.x
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