import * as util from '../common/util';
import moment from 'moment';
import delay from 'delay';
import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { SocketServer } from './socket_server';
import { RateData } from '../common/Interface';
import { SocketData } from './socket_data';

export class OkxSocket extends SocketData {
    public static readonly broker = 'okx'

    constructor() {
        const timeframes = [/*'1m', '3m', */'5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        super(timeframes, OkxSocket.broker, 20);
    }

    protected getSymbolList = () => {
        return util.getOkxSymbolList();
    }

    protected getOHLCV = (symbol: string, timeframe: string) => {
        return util.getOkxOHLCV(symbol, timeframe, 300);
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
        });

        // ws.on('message', function incoming(mess) {
        rws.addEventListener('message', (event) => {
            const mess = event.data;
            const data = JSON.parse(mess.toString()) as { event: string, arg: { channel: string, instId: string }, data: Array<Array<string>> };
            if (data.arg.channel !== 'candle1m' || data.event === 'subscribe') return;


            const symbol = data.arg.instId;
            for (const candle of data.data) {
                const rate: RateData = {
                    symbol: symbol,
                    startTime: +candle[0],
                    timestring: '',
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

const port = 83;

const okxSocket = new OkxSocket();
const socketServer = new SocketServer(
    OkxSocket.broker,
    port,
    okxSocket.getData.bind(okxSocket),
    util.getOkxOHLCV
);

okxSocket.SetOnCloseCandle(socketServer.onCloseCandle.bind(socketServer));
okxSocket.initData();