import moment, { DurationInputArg2 } from 'moment';
import { RateData } from './BinanceFuture';
import zlib from 'zlib';
import fs from 'fs';
import * as ccxt from 'ccxt'
import * as indicator from 'technicalindicators';
import _ from 'lodash';

let useFuture = true;
let binance: ccxt.binance | ccxt.binanceusdm = new ccxt.binanceusdm({ 'timeout': 30000 });

interface OHLCV {
    symbol: string,
    startTime: number,
    open: number
    high: number,
    low: number,
    close: number,
    volume: number
}

export function useSport() {
    useFuture = false;
    binance = new ccxt.binance({ 'timeout': 30000 });
}

export function isFuture() {
    return useFuture;
}

export function iCCI(data: Array<RateData>, period: number) {
    let prices = data.map(item => ({ high: item.high, low: item.low, close: item.close })).reverse();
    const sma = (data: Array<number>) => data.reduce((sum, value) => sum + value, 0) / data.length;

    let typicalPrices = [];
    for (let i = 0; i < prices.length; i++) {
        let { high, low, close } = prices[i];
        typicalPrices.push((high + low + close) / 3);
    }

    let ccis = [];
    for (let i = 0; i <= typicalPrices.length - period; i++) {
        let slice = typicalPrices.slice(i, i + period);
        let avg = sma(slice);
        let meanDeviation = sma(slice.map(tp => Math.abs(tp - avg)));
        ccis.push((typicalPrices[i + period - 1] - avg) / (0.015 * meanDeviation));
    }

    return ccis.reverse();
}

export function iRSI(data: Array<RateData>, period: number) {
    let prices = data.map(item => item.close).reverse();
    let gains = [];
    let losses = [];
    let avgGain = 0;
    let avgLoss = 0;
    let rs = 0;
    let RSI: Array<number> = [];

    for (let i = 1; i < prices.length; i++) {
        let delta = prices[i] - prices[i - 1];

        if (delta > 0) {
            gains.push(delta);
            losses.push(0);
        } else {
            gains.push(0);
            losses.push(Math.abs(delta));
        }

        if (i >= period) {
            if (i === period) {
                avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
                avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
            } else {
                avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
                avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
            }

            rs = (avgGain / avgLoss) || 0;
            const rsi = 100 - (100 / (1 + rs));
            RSI[i] = rsi;
        }
    }

    return RSI.reverse().map(item => +item.toFixed(2));
}

export async function getDigitsFuture() {
    let url = useFuture ? 'https://fapi.binance.com/fapi/v1/exchangeInfo' : 'https://api.binance.com/api/v1/exchangeInfo'
    let res = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });
    let data: any = await res.json();
    let digits: { [key: string]: { price: number, volume: number } } = {};
    for (let item of data.symbols) {
        digits[item.symbol] = {
            price: item.pricePrecision,
            volume: item.quantityPrecision
        }
    }
    return digits;
}

export async function getBinanceSymbolList() {
    let url = useFuture ? 'https://fapi.binance.com/fapi/v1/exchangeInfo' : 'https://api.binance.com/api/v1/exchangeInfo';
    let res = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });

    let data = await res.json() as { symbols: Array<{ symbol: string; status: string }> };
    return data.symbols
        .filter((item: { status: string }) => item.status == 'TRADING')
        .map((item: { symbol: any; }) => item.symbol)
        .filter(item => item.endsWith('USDT'));
}

export async function getBybitSymbolList() {
    let url = `https://api.bybit.com/v5/market/tickers?category=spot`;
    let res = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });

    let data = await res.json() as { result: { list: Array<{ symbol: string }> } };
    return data.result.list
        .map((item: { symbol: string; }) => item.symbol)
        .filter(item => item.endsWith('USDT'));
}

export async function getOkxSymbolList() {
    let url = `https://www.okx.com/api/v5/public/instruments?instType=SPOT`;
    let res = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });

    let data = await res.json() as { data: Array<{ baseCcy: string, quoteCcy: string, instId: string }> };
    return data.data
        .filter(item => item.quoteCcy === 'USDT')
        .map((item) => item.instId);
}

export function checkFinal(tf: string, startTime: number) {
    let nextTime = startTime / 1000 + 60;
    switch (tf) {
        case '1m': return nextTime % 60 == 0;
        case '3m': return nextTime % 180 == 0;
        case '5m': return nextTime % 300 == 0;
        case '15m': return nextTime % 900 == 0;
        case '30m': return nextTime % 1800 == 0;
        case '1h': return nextTime % 3600 == 0;
        case '2h': return nextTime % 7200 == 0;
        case '4h': return nextTime % 14400 == 0;
        case '6h': return nextTime % 21600 == 0;
        case '8h': return nextTime % 28800 == 0;
        case '12h': return nextTime % 43200 == 0;
        case '1d': return nextTime % 86400 == 0;
        default: return false;
    }
};

export function getStartTime(tf: string, currentTime: number) {
    switch (tf) {
        case '1m': return currentTime - currentTime % 60000;
        case '3m': return currentTime - currentTime % 180000;
        case '5m': return currentTime - currentTime % 300000;
        case '15m': return currentTime - currentTime % 900000;
        case '30m': return currentTime - currentTime % 1800000;
        case '1h': return currentTime - currentTime % 3600000;
        case '2h': return currentTime - currentTime % 7200000;
        case '4h': return currentTime - currentTime % 14400000;
        case '6h': return currentTime - currentTime % 21600000;
        case '8h': return currentTime - currentTime % 28800000;
        case '12h': return currentTime - currentTime % 43200000;
        case '1d': return currentTime - currentTime % 86400000;
        default: return currentTime;
    }
}

export function timeframeToNumberMinutes(tf: string) {
    switch (tf) {
        case '1m': return 1;
        case '3m': return 3;
        case '5m': return 5;
        case '15m': return 15;
        case '30m': return 30;
        case '1h': return 60;
        case '2h': return 120;
        case '4h': return 240;
        case '6h': return 360;
        case '8h': return 480;
        case '12h': return 720;
        case '1d': return 1440;
        default: return 1;
    }
}

export async function compress(data: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        zlib.deflate(data, { level: 9 }, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    });
}

export async function decompress(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        zlib.inflate(data, { level: 9 }, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    });
}

export async function getOHLCV(symbol: string, timeframe: string, limit: number): Promise<Array<RateData>> {
    let result = [];
    let maxCall = 1000;
    let check: { [key: number]: boolean } = {};
    let since: number | undefined = undefined;
    while (limit > 0) {
        if (limit > maxCall) console.log(`getOHLCV pending ${symbol} ${timeframe} ${limit}`);
        let ohlcv = await binance.fetchOHLCV(symbol, timeframe, since, Math.min(limit, maxCall));
        let data = ohlcv.filter(item => item[0] !== undefined && item[1] !== undefined && item[2] !== undefined && item[3] !== undefined && item[4] !== undefined && item[5] !== undefined).map(item => {
            let startTime = item[0] || 0;
            let open = item[1] || 0;
            let high = item[2] || 0;
            let low = item[3] || 0;
            let close = item[4] || 0;
            let volume = item[5] || 0;
            let interval = timeframe;
            let isFinal = true;
            let change = (close - open) / open;
            let ampl = (high - low) / open;
            let timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
            return { symbol, startTime, timestring, open, high, low, close, volume, interval, isFinal, change, ampl };
        }).filter(item => !check[item.startTime]);
        if (data.length == 0) break;
        data.sort((a, b) => a.startTime - b.startTime);
        result.push(...data);
        for (let item of data) {
            check[item.startTime] = true;
        }
        limit -= Math.min(limit, maxCall);
        since = moment(data[0].startTime).subtract(Math.min(limit, maxCall) * (+timeframe.slice(0, timeframe.length - 1)), <DurationInputArg2>timeframe[timeframe.length - 1]).valueOf();
    }
    result.sort((a, b) => b.startTime - a.startTime);

    if (result.length) result[0].isFinal = false;
    return result;
}

export async function getBybitOHLCV(symbol: string, timeframe: string, limit: number): Promise<Array<RateData>> {
    // https://bybit-exchange.github.io/docs/v5/market/kline
    let tf: string | number = timeframe;
    switch (timeframe) {
        case '1m':
        case '3m':
        case '5m':
        case '15m':
        case '30m':
            tf = timeframe.slice(0, timeframe.length - 1);
            break;
        case '1h':
        case '2h':
        case '4h':
        case '6h':
        case '8h':
        case '12h':
            tf = +timeframe.slice(0, timeframe.length - 1) * 60;
            break;
        case '1d': tf = 'D';
            break;
        default:
            break;
    }

    let url = `https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol}&interval=${tf}&limit=${limit}`;
    let res = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });

    let data = await res.json() as { result: { list: Array<string> } };
    let result = data.result.list.map(item => {
        let startTime = +item[0] || 0;
        let open = +item[1] || 0;
        let high = +item[2] || 0;
        let low = +item[3] || 0;
        let close = +item[4] || 0;
        let volume = +item[5] || 0;
        let interval = timeframe;
        let isFinal = true;
        let change = (close - open) / open;
        let ampl = (high - low) / open;
        let timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
        return { symbol, startTime, timestring, open, high, low, close, volume, interval, isFinal, change, ampl };
    });
    result.sort((a, b) => b.startTime - a.startTime);
    if (result.length) result[0].isFinal = false;

    return result;
}

export async function getOkxOHLCV(symbol: string, timeframe: string, limit: number): Promise<Array<RateData>> {
    //max limit: 300
    let tf: string = timeframe;
    switch (timeframe) {
        case '1m':
        case '3m':
        case '5m':
        case '15m':
        case '30m':
            break;
        case '1h':
        case '2h':
        case '4h':
            tf = timeframe.replace('h', 'H');
            break;
        case '6h':
        case '8h':
        case '12h':
            tf = timeframe.replace('h', 'Hutc');
            break;
        case '1d':
            tf = timeframe.replace('d', 'Dutc');
            break;
        default:
            break;
    }

    let url = `https://www.okx.com/api/v5/market/candles?instId=${symbol}&bar=${tf}&limit=${limit}`;
    let res = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });

    let data = await res.json() as { data: Array<string> };
    let result = data.data.map(item => {
        let startTime = +item[0] || 0;
        let open = +item[1] || 0;
        let high = +item[2] || 0;
        let low = +item[3] || 0;
        let close = +item[4] || 0;
        let volume = +item[5] || 0;
        let interval = timeframe;
        let isFinal = true;
        let change = (close - open) / open;
        let ampl = (high - low) / open;
        let timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
        return { symbol, startTime, timestring, open, high, low, close, volume, interval, isFinal, change, ampl };
    });
    result.sort((a, b) => b.startTime - a.startTime);
    if (result.length) result[0].isFinal = false;

    return result;
}

export async function getOHLCVFromCache(symbol: string, timeframe: string, limit: number): Promise<Array<RateData>> {
    let date = moment.utc();
    let dataM1: Array<RateData> = [];
    while (dataM1.length < limit * timeframeToNumberMinutes(timeframe)) {
        let data = await getData_m1(symbol, date.format('YYYY-MM-DD'));
        if (data.length == 0) break;
        dataM1.unshift(...data);
        date.subtract(1, 'day');
    }

    dataM1.sort((a, b) => a.startTime - b.startTime);

    let data: Array<RateData> = [];
    for (let candle of dataM1) {
        candle.timestring = moment(getStartTime(timeframe, candle.startTime)).format('YYYY-MM-DD HH:mm:SS');
        candle.startTime = getStartTime(timeframe, candle.startTime);

        candle.interval = timeframe;
        candle.isFinal = true;

        if (data.length == 0 || data[0].startTime != candle.startTime) {
            data.unshift(candle);
        }
        else {
            data[0].high = Math.max(data[0].high, candle.high);
            data[0].low = Math.min(data[0].low, candle.low);
            data[0].close = candle.close;
            data[0].volume += candle.isFinal ? candle.volume : 0;
            data[0].change = (data[0].open - data[0].close) / data[0].open;
            data[0].ampl = (data[0].high - data[0].low) / data[0].open;
        }
    }
    data = data.slice(0, limit);
    if (data.length) data[0].isFinal = false;

    return data;
}

async function getOHLCV_m1(symbol: string, limit: number, since: number): Promise<Array<OHLCV>> {
    let result = [];
    let maxCall = 1000;
    let check: { [key: number]: boolean } = {};
    while (limit > 0) {
        // if (limit > maxCall) console.log(`getOHLCV pending ${symbol} ${timeframe} ${limit}`);
        let ohlcv = await binance.fetchOHLCV(symbol, '1m', since, Math.min(limit, maxCall));
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

export async function getData_m1(symbol: string, date: string): Promise<Array<RateData>> {
    let startDate = moment.utc(date);
    let data: Array<OHLCV> = [];

    let filename = `../data/${symbol}_${startDate.format('YYYY-MM-DD')}.data`;
    if (!fs.existsSync(filename)) {
        data = await getOHLCV_m1(symbol, 1440, startDate.valueOf());
        if (data.length == 1440 && data[0].startTime == startDate.valueOf() && data[data.length - 1].startTime + 60000 == startDate.valueOf() + 86400000) {
            let compressData = await compress(JSON.stringify(data));
            fs.writeFileSync(filename, compressData);
            console.log(`update data ${symbol} ${startDate.format('YYYY-MM-DD')}`);
        }
        if (data[0].startTime == startDate.valueOf()) {
            if (startDate.format('YYYY-MM-DD') != moment.utc().format('YYYY-MM-DD')) {
                // console.log('error', { symbol, startDate: startDate.format('YYYY-MM-DD'), length: data.length });
                // console.log(data[0], data[data.length - 1])
            }
        }
        else {
            data = [];
        }
    }
    else {
        let dataDecompress = await decompress(fs.readFileSync(filename));
        data = JSON.parse(dataDecompress.toString());
    }

    return data.map(item => ({
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

export function iMA(data: Array<RateData>, period: number) {
    let values = data.map(item => item.close).reverse();
    let MAs = indicator.SMA.calculate({
        period,
        values
    });
    return MAs.reverse();
}

export function iEMA(data: Array<RateData>, period: number) {
    let values = data.map(item => item.close).reverse();
    let EMAs = indicator.EMA.calculate({
        period,
        values
    });
    return EMAs.reverse();
}

export function iMACD(data: Array<RateData>, fastPeriod: number, slowPeriod: number, signalPeriod: number) {
    let values = data.map(item => item.close).reverse();
    let EMAs = indicator.MACD.calculate({
        values,
        fastPeriod,
        slowPeriod,
        signalPeriod,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    });
    return EMAs.reverse();
}

export function iBB(data: Array<RateData>, period: number, multiplier: number) {
    let values = data.map(item => item.close).reverse();
    let EMAs = indicator.BollingerBands.calculate({
        period,
        values,
        stdDev: multiplier
    });
    return EMAs.reverse();
}

export function iZigZag(data: Array<RateData>, deviation: number, depth: number, byPercent: boolean) {
    if (data.length == 0) return [];

    const NO_TREND = null;
    const UP_TREND = 1;
    const DOWN_TREND = -1;

    let trend: typeof NO_TREND | typeof UP_TREND | typeof DOWN_TREND = NO_TREND;
    let result: Array<{ trend: typeof NO_TREND | typeof UP_TREND | typeof DOWN_TREND, highIndex: number, lowIndex: number }> = [];

    let lastHighIndex = data.length - 1;
    let lastLowIndex = data.length - 1;
    let lastHigh = data[lastHighIndex].high;
    let lastLow = data[lastLowIndex].low;


    for (let i = data.length - 2; i >= 0; i--) {
        let rate = data[i];

        if (trend == NO_TREND) {
            if (rate.high > lastHigh) {
                lastHigh = rate.high;
                lastHighIndex = i;
            }
            if (rate.low < lastLow) {
                lastLow = rate.low;
                lastLowIndex = i;
            }

            let diff = lastHigh - lastLow;
            if (byPercent && lastHighIndex < lastLowIndex) diff = diff / lastHigh * 100; //down
            if (byPercent && lastHighIndex > lastLowIndex) diff = diff / lastLow * 100; //up

            if (Math.abs(diff) >= deviation && Math.abs(lastHighIndex - lastLowIndex) >= depth) {
                trend = lastHighIndex < lastLowIndex ? DOWN_TREND : UP_TREND;
                result.unshift({
                    trend: trend,
                    highIndex: lastHighIndex,
                    lowIndex: lastLowIndex
                });
            }
        }
        else {
            if (trend == UP_TREND && rate.high > lastHigh) {
                lastHigh = rate.high;
                lastHighIndex = i;
                result[0].highIndex = lastHighIndex;
            }
            else if (trend == DOWN_TREND && rate.low < lastLow) {
                lastLow = rate.low;
                lastLowIndex = i;
                result[0].lowIndex = lastLowIndex;
            }
            else {
                if (trend == UP_TREND) {
                    let diff = lastHigh - rate.low;
                    if (byPercent) diff = diff / lastHigh * 100; //down

                    if (Math.abs(diff) >= deviation && Math.abs(lastHighIndex - i) >= depth) {
                        trend = DOWN_TREND;
                        lastLow = rate.low;
                        lastLowIndex = i;
                        result.unshift({
                            trend: trend,
                            highIndex: lastHighIndex,
                            lowIndex: lastLowIndex
                        });
                    }
                }
                else {
                    let diff = rate.high - lastLow;
                    if (byPercent) diff = diff / lastLow * 100; //up

                    if (Math.abs(diff) >= deviation && Math.abs(lastLowIndex - i) >= depth) {
                        trend = UP_TREND;
                        lastHigh = rate.high;
                        lastHighIndex = i;
                        result.unshift({
                            trend: trend,
                            highIndex: lastHighIndex,
                            lowIndex: lastLowIndex
                        });
                    }
                }
            }
        }

    }

    return result;
}