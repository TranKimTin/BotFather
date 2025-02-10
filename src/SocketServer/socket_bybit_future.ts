import * as util from '../common/util';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { RateData } from '../common/Interface';
import { SocketData } from './socket_data';

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

export class BybitFutureSocket extends SocketData {
    public static readonly broker = 'bybit_future'

    constructor(onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        const timeframes = [/*'1m', '3m', */'5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        super(timeframes, BybitFutureSocket.broker, 100, onCloseCandle);
    }

    protected getSymbolList = () => {
        return util.getBybitFutureSymbolList();
    }

    protected getOHLCV = (symbol: string, timeframe: string, since?: number) => {
        return util.getBybitFutureOHLCV(symbol, timeframe, 300, since);
    };

    protected init = () => {
        const rws = new ReconnectingWebSocket('wss://stream.bybit.com/v5/public/linear', [], { WebSocket: WebSocket });

        rws.addEventListener('open', () => {
            console.log(`${BybitFutureSocket.broker}: WebSocket connection opened`);

            for (let i = 0; i < this.symbolList.length; i += 10) {
                rws.send(JSON.stringify({
                    op: 'subscribe',
                    args: this.symbolList.slice(i, i + 10).map(item => `kline.1.${item}`)
                }));
                // await delay(50);
            }

        });

        // ws.on('message', function incoming(mess) {
        rws.addEventListener('message', (event) => {
            const mess = event.data;
            const data: { type: string, topic: string, data: Array<BybitCandle> } = JSON.parse(mess.toString());
            if (!data || data.type !== 'snapshot') return;
            const symbol = data.topic.split('.')[2];

            for (const candle of data.data) {
                const rate: RateData = {
                    symbol: symbol,
                    startTime: candle.start,
                    timestring: '',
                    open: +candle.open,
                    high: +candle.high,
                    low: +candle.low,
                    close: +candle.close,
                    volume: +candle.volume,
                    interval: candle.interval,
                    isFinal: candle.confirm
                };
                this.fetchCandles(rate);
            }
        });

        rws.addEventListener('close', (event) => {
            console.error(`${BybitFutureSocket.broker}: WebSocket connection closed ${event.code} ${event.reason}`);
            // util.restartApp();
        });

        rws.addEventListener('error', (err) => {
            console.error(`${BybitFutureSocket.broker}: WebSocket error: `, err);
            // util.restartApp();
        });
    }
};