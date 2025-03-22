import * as util from '../common/util';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { MAX_CANDLE, RateData } from '../common/Interface';
import { SocketData } from './socket_data';

export class OkxSocket extends SocketData {
    public static readonly broker = 'okx';
    private pingInterval: string | number | NodeJS.Timeout | undefined;

    constructor(onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void, symbolList: Array<string>) {
        const timeframes = [/*'1m', '3m', */'5m', '15m', '30m', '1h', /*'2h',*/ '4h', /*'6h', '8h', '12h',*/ '1d'];
        super(timeframes, OkxSocket.broker, 20, onCloseCandle, symbolList);
    }

    protected getOHLCV = (symbol: string, timeframe: string, since?: number) => {
        if (!since) return util.getOkxOHLCV(symbol, timeframe, MAX_CANDLE);
        else return (since + util.timeframeToNumberMiliseconds(timeframe) * (MAX_CANDLE) < new Date().getTime())
            ? util.getOkxOHLCVHistory(symbol, timeframe, MAX_CANDLE, since)
            : util.getOkxOHLCV(symbol, timeframe, Math.ceil((new Date().getTime() - since) / util.timeframeToNumberMiliseconds(timeframe)));
    };

    protected init = () => {
        // const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/business');
        const rws = new ReconnectingWebSocket('wss://ws.okx.com:8443/ws/v5/business', [], { WebSocket: WebSocket });

        // ws.on('open', async function open() {
        rws.addEventListener('open', () => {
            console.log(`${OkxSocket.broker}: WebSocket connection opened`);

            rws.send(JSON.stringify({
                op: "subscribe",
                args:
                    this.symbolList.map(symbol => ({
                        channel: "candle1m",
                        instId: symbol
                    }))

            }));

            clearTimeout(this.pingInterval);
            this.pingInterval = setInterval(() => {
                rws.send('ping');
            }, 25000);
        });

        // ws.on('message', function incoming(mess) {
        rws.addEventListener('message', (event) => {
            const mess = event.data.toString();
            if (mess === 'pong') return;
            const data = JSON.parse(mess) as { event: string, arg: { channel: string, instId: string }, data: Array<Array<string>> };
            if (data.arg.channel !== 'candle1m' || data.event === 'subscribe') return;


            const symbol = data.arg.instId;
            for (const candle of data.data) {
                const rate: RateData = {
                    symbol: symbol,
                    startTime: +candle[0],
                    open: +candle[1],
                    high: +candle[2],
                    low: +candle[3],
                    close: +candle[4],
                    volume: +candle[5],
                    interval: '1m',
                    isFinal: !!+candle[8]
                };

                this.fetchCandles(rate);
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
    }
};