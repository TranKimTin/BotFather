import { RateData } from "./BinanceFuture";
import * as util from './util';
import moment from 'moment';
import delay from 'delay';
import WebSocket from 'ws';

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

    async init(numbler_candle_load: number, onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        let symbolList = await util.getOkxSymbolList();
        // console.log(symbolList.join(' '));
        console.log(`okx: Total ${symbolList.length} symbols`);

        let timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        // timeframes = ['1m', '15m', '4h', '1d'];
        for (let symbol of symbolList) {
            this.gData[symbol] = {};
            for (let tf of timeframes) {
                this.gData[symbol][tf] = [];
            }
        }

        const ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/business');

        ws.on('open', async function open() {
            console.log('okx: WebSocket connection opened');

            ws.send(JSON.stringify({
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
            for (let tf of timeframes) {
                let data: RateData = {
                    symbol: symbol,
                    startTime: util.getStartTime(tf, +candle[0]),
                    timestring: moment(util.getStartTime(tf, +candle[0])).format('YYYY-MM-DD HH:mm:SS'),
                    open: +candle[1],
                    high: +candle[2],
                    low: +candle[3],
                    close: +candle[4],
                    volume: +candle[5],
                    interval: tf,
                    isFinal: (!!+candle[8]) && util.checkFinal(tf, +candle[0]),
                    change: (+candle[0] - +candle[1]) / +candle[1],
                    ampl: (+candle[2] - +candle[3]) / +candle[1]
                };
                this.gLastPrice[data.symbol] = data.close;

                let dataList = this.gData[data.symbol][data.interval];
                if (!dataList[0]) return;

                if (dataList[0].startTime == data.startTime) {
                    // dataList[0] = data;
                    dataList[0].high = Math.max(dataList[0].high, data.high);
                    dataList[0].low = Math.min(dataList[0].low, data.low);
                    dataList[0].close = data.close;
                    dataList[0].volume += (!!+candle[8]) ? data.volume : 0;
                    dataList[0].change = (dataList[0].close - dataList[0].open) / dataList[0].open;
                    dataList[0].ampl = (dataList[0].high - dataList[0].low) / dataList[0].open;

                    if (data.isFinal && !dataList[0].isFinal) {
                        dataList[0].isFinal = data.isFinal;
                        onCloseCandle(OkxSocket.broker, data.symbol, data.interval, [...dataList]);
                    }
                }
                else if (dataList[0].startTime < data.startTime) {
                    dataList.unshift(data);
                    if (dataList[1] && !dataList[1].isFinal) {
                        dataList[1].isFinal = true;
                        onCloseCandle(OkxSocket.broker, data.symbol, data.interval, dataList.slice(1));
                    }
                }
            }
        }

        ws.on('message', function incoming(mess) {
            let data = JSON.parse(mess.toString()) as { event: string, arg: { channel: string, instId: string }, data: Array<Array<string>> };
            if (data.arg.channel !== 'candle1m' || data.event === 'subscribe') return;


            let symbol = data.arg.instId;
            for (let candle of data.data) {
                fetchCandles(symbol, candle);
            }
        });

        ws.on('close', function close() {
            console.log('okx: WebSocket connection closed');
            throw 'okx: WebSocket connection closed';
        });

        ws.on('error', function error(err) {
            console.error('okx: WebSocket error: ', err);
            throw err;
        });


        let initCandle = async (symbol: string, tf: string) => {
            let rates = await util.getOkxOHLCV(symbol, tf, numbler_candle_load);
            this.gData[symbol][tf] = rates;
            this.gLastPrice[symbol] = this.gData[symbol][tf][0]?.close || 0;
            // console.log('init candle', { symbol, tf })
        }

        for (let tf of timeframes) {
            console.log(`okx: init candle ${tf}...`);
            let promiseList = [];
            for (let symbol of symbolList) {
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
            let now = new Date().getTime();
            for (let symbol in this.gLastUpdated) {
                let lastTimeUpdated = this.gLastUpdated[symbol];
                if (now - lastTimeUpdated > timeInterval) {
                    console.log(`okx: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`);
                    throw `okx: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`;
                }
            }
        }, timeInterval);
    }
};