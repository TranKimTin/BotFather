import { RateData } from "./BinanceFuture";
import * as util from './util';
import moment from 'moment';
import delay from 'delay';
import WebSocket from 'ws';

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

    async init(numbler_candle_load: number, onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        let symbolList = await util.getBybitSymbolList();
        // console.log(symbolList.join(' '));
        console.log(`bybit: Total ${symbolList.length} symbols`);

        let timeframes = ['15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '1m', '3m', '5m'];
        // timeframes = ['1m', '15m', '4h', '1d'];
        for (let symbol of symbolList) {
            this.gData[symbol] = {};
            for (let tf of timeframes) {
                this.gData[symbol][tf] = [];
            }
        }

        const ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');

        ws.on('open', async function open() {
            console.log('bybit: WebSocket connection opened');

            for (let i = 0; i < symbolList.length; i += 10) {
                ws.send(JSON.stringify({
                    op: 'subscribe',
                    args: symbolList.slice(i, i + 10).map(item => `kline.1.${item}`)
                }));
                await delay(50);
            }

        });

        const fetchCandles = (symbol: string, candle: BybitCandle) => {
            this.gLastUpdated[symbol] = new Date().getTime();
            for (let tf of timeframes) {
                let data: RateData = {
                    symbol: symbol,
                    startTime: util.getStartTime(tf, candle.start),
                    timestring: moment(util.getStartTime(tf, candle.start)).format('YYYY-MM-DD HH:mm:SS'),
                    open: +candle.open,
                    high: +candle.high,
                    low: +candle.low,
                    close: +candle.close,
                    volume: +candle.volume,
                    interval: tf,
                    isFinal: candle.confirm && util.checkFinal(tf, candle.start),
                    change: (+candle.close - +candle.open) / +candle.open,
                    ampl: (+candle.high - +candle.low) / +candle.open
                };
                this.gLastPrice[data.symbol] = data.close;

                let dataList = this.gData[data.symbol][data.interval];
                if (!dataList[0]) return;

                if (dataList[0].startTime == data.startTime) {
                    // dataList[0] = data;
                    dataList[0].high = Math.max(dataList[0].high, data.high);
                    dataList[0].low = Math.min(dataList[0].low, data.low);
                    dataList[0].close = data.close;
                    dataList[0].volume += candle.confirm ? data.volume : 0;
                    dataList[0].change = (dataList[0].close - dataList[0].open) / dataList[0].open;
                    dataList[0].ampl = (dataList[0].high - dataList[0].low) / dataList[0].open;

                    if (data.isFinal && !dataList[0].isFinal) {
                        dataList[0].isFinal = data.isFinal;
                        onCloseCandle(BybitSocket.broker, data.symbol, data.interval, [...dataList]);
                    }
                }
                else if (dataList[0].startTime < data.startTime) {
                    dataList.unshift(data);
                    if (dataList[1] && !dataList[1].isFinal) {
                        dataList[1].isFinal = true;
                        onCloseCandle(BybitSocket.broker, data.symbol, data.interval, dataList.slice(1));
                    }
                }
            }
        }

        ws.on('message', function incoming(mess) {
            const data: { type: string, topic: string, data: Array<BybitCandle> } = JSON.parse(mess.toString());
            if (!data || data.type !== 'snapshot') return;
            let symbol = data.topic.split('.')[2];

            for (let candle of data.data) {
                fetchCandles(symbol, candle);
            }
        });

        ws.on('close', function close() {
            console.log('bybit: WebSocket connection closed');
            throw 'bybit: WebSocket connection closed';
        });

        ws.on('error', function error(err) {
            console.error('bybit: WebSocket error: ', err);
            throw err;
        });


        let initCandle = async (symbol: string, tf: string) => {
            let rates = await util.getBybitOHLCV(symbol, tf, numbler_candle_load);
            this.gData[symbol][tf] = rates;
            this.gLastPrice[symbol] = this.gData[symbol][tf][0]?.close || 0;
            // console.log('init candle', { symbol, tf })
        }

        for (let tf of timeframes) {
            console.log(`bybit: init candle ${tf}...`);
            let promiseList = [];
            for (let symbol of symbolList) {
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
            let now = new Date().getTime();
            for (let symbol in this.gLastUpdated) {
                let lastTimeUpdated = this.gLastUpdated[symbol];
                if (now - lastTimeUpdated > timeInterval) {
                    console.log(`bybit: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`);
                    throw `bybit: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`;
                }
            }
        }, timeInterval);
    }
};