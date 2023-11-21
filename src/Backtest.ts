import * as ccxt from 'ccxt';
import { Digit, Position, RateData } from "./BinanceFuture";
import moment from 'moment';
import fs from 'fs';
import zlib from 'zlib';
import { reject } from 'lodash';
import * as util from './util';

interface IParam {
    symbolList: Array<string>,
    timeframes: Array<string>,
    onCloseCandle: (symbol: string, timeframe: string, data: Array<RateData>) => void,
    onClosePosition: (symbol: string) => void,
    onHandleError: (err: unknown, symbol: string | undefined) => void
}

export default class Backtest {
    private binance: ccxt.binanceusdm;
    private symbolList: Array<string>;
    private timeframes: Array<string>;
    private onCloseCandle: (symbol: string, timeframe: string, data: Array<RateData>) => void;
    private onHandleError: (err: any, symbol: string | undefined) => void;
    private onClosePosition: (symbol: string) => void;

    public digits: { [key: string]: Digit };
    private data: { [key: string]: { [key: string]: Array<RateData> } };
    private positions: { [key: string]: Position };
    private minVolumes: { [key: string]: number };
    private lastPrice: { [key: string]: number };

    constructor(params: IParam) {
        this.binance = new ccxt.binanceusdm({});
        this.symbolList = params.symbolList;
        this.timeframes = params.timeframes;
        this.onCloseCandle = params.onCloseCandle;
        this.onClosePosition = params.onClosePosition;
        this.onHandleError = params.onHandleError;
        this.data = {};
        this.digits = {};
        this.positions = {};
        this.minVolumes = {};
        this.lastPrice = {};

        for (let symbol of this.symbolList) {
            this.data[symbol] = {};
            for (let tf of this.timeframes) {
                this.data[symbol][tf] = [];
            }
        }

        if (!fs.existsSync('../data')) {
            fs.mkdirSync('../data');
        }
    }

    async runBacktest(from: string, to: string) {
        console.log('init digits...');
        let market = await this.binance.loadMarkets(true);
        for (let key in market) {
            let item = market[key];
            if (!item) continue;
            let symbol = item.info.symbol.replace('/', '');
            let precision = item.precision;
            this.digits[symbol] = {
                volume: precision.amount,
                price: precision.price
                // base: precision.base,
                // quote: precision.quote
            }
            this.minVolumes[symbol] = item.limits.amount?.min || 0;
        }
        await this.initData(from, to);

        let idx: any = {};
        for (let symbol of this.symbolList) {
            idx[symbol] = {};
            for (let tf of this.timeframes) {
                idx[symbol][tf] = this.data[symbol][tf].length - 1;
            }
        }

        let timestamp = moment.utc(from);
        let endTime = moment.utc(to).add(1, 'day').valueOf();
        while (timestamp.valueOf() < endTime) {
            let promiseList = [];
            for (let symbol of this.symbolList) {
                for (let tf of this.timeframes) {
                    let data = this.data[symbol][tf];
                    let i = idx[symbol][tf];
                    if (i >= 0 && data[i].startTime == timestamp.valueOf()) {
                        promiseList.push(this.onCloseCandle(symbol, tf, data.slice(i, i + 300)));
                        idx[symbol][tf]--;
                    }
                }
            }
            await Promise.all(promiseList);
            await this.handleLogic();
            timestamp.add(1, 'minute');
        }
    }

    private async handleLogic() {
        
    }

    private async initData(from: string, to: string) {
        for (let symbol of this.symbolList) {
            let dataM1 = await this.getData(symbol, from, to);
            for (let item of dataM1) {
                for (let tf of this.timeframes) {
                    let rates = this.data[symbol][tf];
                    if (rates.length && rates[0].startTime == item.startTime) {
                        rates[0].high = Math.max(rates[0].high, item.high);
                        rates[0].low = Math.min(rates[0].low, item.low);
                        rates[0].close = item.close;
                        rates[0].volume += item.volume;
                        rates[0].change = (rates[0].open - rates[0].close) / rates[0].open;
                        rates[0].ampl = (rates[0].high - rates[0].low) / rates[0].open;
                    }
                    else if (util.getStartTime(tf, item.startTime) == item.startTime) {
                        rates.unshift({
                            symbol: item.symbol,
                            startTime: item.startTime,
                            timestring: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
                            open: item.open,
                            high: item.high,
                            low: item.low,
                            close: item.close,
                            volume: item.volume,
                            interval: tf,
                            isFinal: true,
                            change: (item.close - item.open) / item.open,
                            ampl: (item.high - item.low) / item.open
                        });
                    }
                }
            }
        }
    }

    private async getOHLCV(symbol: string, timeframe: string, limit: number, since: number) {
        let result = [];
        let maxCall = 1000;
        let check: { [key: number]: boolean } = {};
        while (limit > 0) {
            // if (limit > maxCall) console.log(`getOHLCV pending ${symbol} ${timeframe} ${limit}`);
            let ohlcv = await this.binance.fetchOHLCV(symbol, timeframe, since, Math.min(limit, maxCall));
            let data = ohlcv.filter(item => item[0] !== undefined && item[1] !== undefined && item[2] !== undefined && item[3] !== undefined && item[4] !== undefined && item[5] !== undefined).map(item => {
                let startTime = item[0] || 0;
                let open = item[1] || 0;
                let high = item[2] || 0;
                let low = item[3] || 0;
                let close = item[4] || 0;
                let volume = item[5] || 0;
                return { symbol, startTime, open, high, low, close, volume };
            }).filter(item => !check[item.startTime]);
            if (data.length == 0) break;
            data.sort((a, b) => a.startTime - b.startTime);
            result.push(...data);
            for (let item of data) {
                check[item.startTime] = true;
            }
            limit -= Math.min(limit, maxCall);
            since = moment(data[data.length - 1].startTime).add(1, 'minute').valueOf();
        }
        result.sort((a, b) => a.startTime - b.startTime);

        return result;
    }

    private async getData(symbol: string, from: string, to: string): Promise<Array<RateData>> {
        let startDate = moment.utc(from);
        let endDate = moment.utc(to);
        let result = [];
        while (startDate.valueOf() <= endDate.valueOf()) {
            let filename = `../data/${symbol}_${startDate.format('YYYY-MM-DD')}.data`;
            if (!fs.existsSync(filename)) {
                let data = await this.getOHLCV(symbol, '1m', 1440, startDate.valueOf());
                if (data.length == 1440 && data[0].startTime == startDate.valueOf() && data[data.length - 1].startTime + 60000 == startDate.valueOf() + 86400000) {
                    let compressData = await util.compress(JSON.stringify(data));
                    fs.writeFileSync(filename, compressData);
                    console.log(`update data ${symbol} ${startDate.format('YYYY-MM-DD')}`);
                    result.push(...data)
                }
                else {
                    // console.log('error', { symbol, startDate: startDate.format('YYYY-MM-DD'), length: data.length });
                }
                // startDate.add(1, 'day');
                while (startDate.valueOf() <= data[0].startTime) {
                    // console.log('next day', symbol, startDate.format('YYYY-MM-DD'));
                    startDate.add(1, 'day');
                }
            }
            else {
                let dataDecompress = await util.decompress(fs.readFileSync(filename));
                let data = JSON.parse(dataDecompress.toString());
                result.push(...data);
                startDate.add(1, 'day');
            }
        }
        return result.map(item => ({
            symbol: item.symbol,
            startTime: item.startTime,
            timestring: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
            interval: '1m',
            isFinal: true,
            change: (item.close - item.open) / item.open,
            ampl: (item.high - item.low) / item.open
        }));
    }
}

async function main() {
    let symbolList = await util.getSymbolList();
    let ignoreList = ['BTCDOMUSDT', 'USDCUSDT', 'COCOSUSDT'];
    symbolList = symbolList.filter(item => item.endsWith("USDT"))
        .filter(item => !ignoreList.includes(item));

    let bot = new Backtest({
        symbolList: symbolList,
        timeframes: [/*'1m', '3m', '5m',*/ '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'],
        onCloseCandle: onCloseCandle,
        onClosePosition: async (symbol: string) => { },
        onHandleError: async (err: any, symbol: string | undefined) => { },
    });
    await bot.runBacktest('2023-10-19', '2023-11-19');
}

async function onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {
    // console.log({ symbol, timeframe, timestamp: data[0].timestring });
}

main();