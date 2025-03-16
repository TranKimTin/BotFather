import * as util from '../common/util';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { MAX_CANDLE, RateData } from '../common/Interface';
import { SocketData } from './socket_data';

export class BinanceFutureSocket extends SocketData {
    public static readonly broker = 'binance_future';

    constructor(onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void, symbolList: Array<string>) {
        const timeframes = [/*'1m', '3m', */'5m', '15m', '30m', '1h', /*'2h',*/ '4h', /*'6h', '8h', '12h',*/ '1d'];
        super(timeframes, BinanceFutureSocket.broker, 100, onCloseCandle, symbolList);
    }

    protected getOHLCV = (symbol: string, timeframe: string, since?: number) => {
        return util.getBinanceFutureOHLCV(symbol, timeframe, MAX_CANDLE, since);
    };

    protected init = () => {
        const streams = this.symbolList.map(symbol => `${symbol.toLowerCase()}@kline_1m`).join("/");
        const url = `wss://fstream.binance.com/stream?streams=${streams}`;

        const rws = new ReconnectingWebSocket(url, [], { WebSocket: WebSocket });

        rws.addEventListener('open', () => {
            console.log(`${BinanceFutureSocket.broker}: Socket connected`);
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
                isFinal: !!+kline.x
            };

            this.fetchCandles(candle);
        });

        rws.addEventListener('error', (err) => {
            console.error(`binance: WebSocket error`, err);
            // util.restartApp();
        });

        rws.addEventListener('close', (event) => {
            console.error(`${BinanceFutureSocket.broker}: WebSocket connection closed, ${event.code} ${event.reason}`);
            // util.restartApp();
        });
    }
};