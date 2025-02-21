import moment, { DurationInputArg2 } from 'moment';
import zlib from 'zlib';
import fs from 'fs';
import * as ccxt from 'ccxt'
import * as indicator from 'technicalindicators';
import _ from 'lodash';
import axios from 'axios';
import { FundingRate, RateData } from './Interface';
import pm2 from 'pm2';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });


let binance = new ccxt.binance({ 'timeout': 30000 });
let binanceFuture = new ccxt.binanceusdm({ 'timeout': 30000 });

const LogError = console.error.bind(console);
console.error = function () {
    if (arguments.length) {
        LogError('APP_ERROR', ...arguments);
        console.log('APP_ERROR', ...arguments);
    }
};

export function restartApp() {
    pm2.connect((err) => {
        if (err) {
            console.error('Error connecting to PM2:', err);
            return;
        }

        const pmId = process.env.pm_id;
        console.log('Restart app', { pmId });
        if (pmId !== undefined) {
            pm2.restart(pmId, (err) => {
                pm2.disconnect();
                if (err) {
                    console.error('Error restarting app:', err);
                } else {
                    console.log('App restarted successfully!');
                }
            });
        } else {
            console.error('PM2 ID not found. Are you running this app with PM2?');
            pm2.disconnect();
        }
    });
}

export function iCCI(data: Array<RateData>, period: number) {
    const prices = data.map(item => ({ high: item.high, low: item.low, close: item.close })).reverse();
    const sma = (data: Array<number>) => data.reduce((sum, value) => sum + value, 0) / data.length;

    const typicalPrices = [];
    for (let i = 0; i < prices.length; i++) {
        const { high, low, close } = prices[i];
        typicalPrices.push((high + low + close) / 3);
    }

    const ccis = [];
    for (let i = 0; i <= typicalPrices.length - period; i++) {
        const slice = typicalPrices.slice(i, i + period);
        const avg = sma(slice);
        const meanDeviation = sma(slice.map(tp => Math.abs(tp - avg)));
        ccis.push((typicalPrices[i + period - 1] - avg) / (0.015 * meanDeviation));
    }

    return ccis.reverse();
}

export function iRSI(data: Array<RateData>, period: number) {
    const prices = data.map(item => item.close);
    const gains = [];
    const losses = [];
    let avgGain = 0;
    let avgLoss = 0;
    let rs = 0;
    const RSI: Array<number> = [];

    for (let i = 1; i < prices.length; i++) {
        const delta = prices[prices.length - i - 1] - prices[prices.length - i];

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
            RSI[prices.length - i - 1] = +rsi.toFixed(2);
        }
    }

    return RSI;
}

export async function getDigitsFuture() {
    // const url = useFuture ? 'https://fapi.binance.com/fapi/v1/exchangeInfo' : 'https://api.binance.com/api/v1/exchangeInfo'
    const url = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
    const res = await axios.get(url, { timeout: 60000 });
    const data: any = res.data;
    const digits: { [key: string]: { price: number, volume: number } } = {};
    for (const item of data.symbols) {
        digits[item.symbol] = {
            price: item.pricePrecision,
            volume: item.quantityPrecision
        }
    }
    return digits;
}

export async function getBinanceSymbolList() {
    const url = 'https://api.binance.com/api/v1/exchangeInfo';
    const res = await axios.get(url, { timeout: 60000 });

    const data = res.data as { symbols: Array<{ symbol: string; status: string }> };
    return data.symbols
        .filter((item: { status: string }) => item.status == 'TRADING')
        .map((item: { symbol: any; }) => item.symbol)
        .filter(item => item.endsWith('USDT'))
        .filter(item => !['USDCUSDT', 'TUSDUSDT', 'DAIUSDT'].includes(item));
}

export async function getBinanceFutureSymbolList() {
    const url = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
    const res = await axios.get(url, { timeout: 60000 });

    const data = res.data as { symbols: Array<{ symbol: string; status: string }> };
    return data.symbols
        .filter((item: { status: string }) => item.status == 'TRADING')
        .map((item: { symbol: string; }) => item.symbol)
        .filter(item => item.endsWith('USDT'))
        .filter(item => !['USDCUSDT', 'TUSDUSDT', 'DAIUSDT'].includes(item));
}

export async function getBybitSymbolList() {
    const url = `https://api.bybit.com/v5/market/tickers?category=spot`;
    // const url = `https://api.bybit.com/spot/v3/public/symbols`;
    const res = await axios.get(url,{ timeout: 60000 });

    // const data = await res.data as { result: { list: Array<{ name: string, quoteCoin: string }> } };
    // return data.result.list
    //     .filter(item => item.quoteCoin === 'USDT')
    //     .map((item) => item.name);

    const data = res.data as { result: { list: Array<{ symbol: string, volume24h: string }> } };
    return data.result.list
        .filter(item => +item.volume24h > 0)
        .map((item: { symbol: string; }) => item.symbol)
        .filter(item => item.endsWith('USDT'))
        .filter(item => !['USDCUSDT', 'TUSDUSDT', 'DAIUSDT'].includes(item));
}

export async function getBybitFutureSymbolList() {
    // const url = `https://api.bybit.com/v2/public/symbols`;
    // const res = await axios.get(url, { timeout: 60000 });

    // const data = res.data as { result: Array<{ name: string, quote_currency: string, status: string }> };
    // return data.result
    //     .filter(item => item.status === 'Trading')
    //     .filter(item => item.quote_currency === 'USDT')
    //     .map((item) => item.name);

    const url = `https://api.bybit.com/v5/market/tickers?category=linear`;
    const res = await axios.get(url, { timeout: 60000 });


    const data = res.data as { result: { list: Array<{ symbol: string, volume24h: string }> } };
    return data.result.list
        .filter(item => +item.volume24h > 0)
        .map((item: { symbol: string; }) => item.symbol)
        .filter(item => item.endsWith('USDT'))
        .filter(item => !['USDCUSDT', 'TUSDUSDT', 'DAIUSDT'].includes(item));
}

export async function getOkxSymbolList() {
    const url = `https://www.okx.com/api/v5/public/instruments?instType=SPOT`;
    const res = await axios.get(url, { timeout: 60000 });

    const data = await res.data as { data: Array<{ baseCcy: string, quoteCcy: string, instId: string, listTime: string }> };
    return data.data
        .filter(item => item.quoteCcy === 'USDT')
        .filter(item => !['USDC', 'TUSD', 'BUSD', 'DAI'].includes(item.baseCcy))
        .filter(item => new Date().getTime() > new Date(parseInt(item.listTime)).getTime())
        .map((item) => item.instId);
}

export function checkFinal(tf: string, startTime: number) {
    const nextTime = startTime / 1000 + 60;
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

export function timeframeToNumberMiliseconds(tf: string) {
    return timeframeToNumberMinutes(tf) * 60000;
}

export function nextTime(timestamp: number, timeframe: string) {
    const startTime = getStartTime(timeframe, timestamp);
    const offsetTime = timeframeToNumberMiliseconds(timeframe);
    return startTime + offsetTime;
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

export async function getBinanceOHLCV(symbol: string, timeframe: string, limit: number, since?: number): Promise<Array<RateData>> {
    const result = [];
    const maxCall = 1000;
    const check: { [key: number]: boolean } = {};
    while (limit > 0) {
        if (limit > maxCall) console.log(`getBinanceOHLCV pending ${symbol} ${timeframe} ${limit}`);
        const ohlcv = await binance.fetchOHLCV(symbol, timeframe, since, Math.min(limit, maxCall));
        const data = ohlcv.filter(item => item[0] !== undefined && item[1] !== undefined && item[2] !== undefined && item[3] !== undefined && item[4] !== undefined && item[5] !== undefined).map(item => {
            const startTime = item[0] || 0;
            const open = item[1] || 0;
            const high = item[2] || 0;
            const low = item[3] || 0;
            const close = item[4] || 0;
            const volume = item[5] || 0;
            const interval = timeframe;
            const isFinal = true;
            const change = (close - open) / open;
            const ampl = (high - low) / open;
            const timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
            return { symbol, startTime, timestring, open, high, low, close, volume, interval, isFinal, change, ampl };
        }).filter(item => !check[item.startTime]);
        if (data.length == 0) break;
        data.sort((a, b) => a.startTime - b.startTime);
        result.push(...data);
        for (const item of data) {
            check[item.startTime] = true;
        }
        limit -= Math.min(limit, maxCall);
        since = moment(data[0].startTime).subtract(Math.min(limit, maxCall) * (+timeframe.slice(0, timeframe.length - 1)), <DurationInputArg2>timeframe[timeframe.length - 1]).valueOf();
    }
    result.sort((a, b) => b.startTime - a.startTime);

    if (result.length) result[0].isFinal = false;
    return result;
}

export async function getBinanceFutureOHLCV(symbol: string, timeframe: string, limit: number, since?: number): Promise<Array<RateData>> {
    const result = [];
    const maxCall = 1000;
    const check: { [key: number]: boolean } = {};
    while (limit > 0) {
        if (limit > maxCall) console.log(`getBinanceFutureOHLCV pending ${symbol} ${timeframe} ${limit}`);
        const ohlcv = await binanceFuture.fetchOHLCV(symbol, timeframe, since, Math.min(limit, maxCall));
        const data = ohlcv.filter(item => item[0] !== undefined && item[1] !== undefined && item[2] !== undefined && item[3] !== undefined && item[4] !== undefined && item[5] !== undefined).map(item => {
            const startTime = item[0] || 0;
            const open = item[1] || 0;
            const high = item[2] || 0;
            const low = item[3] || 0;
            const close = item[4] || 0;
            const volume = item[5] || 0;
            const interval = timeframe;
            const isFinal = true;
            const change = (close - open) / open;
            const ampl = (high - low) / open;
            const timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
            return { symbol, startTime, timestring, open, high, low, close, volume, interval, isFinal, change, ampl };
        }).filter(item => !check[item.startTime]);
        if (data.length == 0) break;
        data.sort((a, b) => a.startTime - b.startTime);
        result.push(...data);
        for (const item of data) {
            check[item.startTime] = true;
        }
        limit -= Math.min(limit, maxCall);
        since = moment(data[0].startTime).subtract(Math.min(limit, maxCall) * (+timeframe.slice(0, timeframe.length - 1)), <DurationInputArg2>timeframe[timeframe.length - 1]).valueOf();
    }
    result.sort((a, b) => b.startTime - a.startTime);

    if (result.length) result[0].isFinal = false;
    return result;
}

export async function getBybitOHLCV(symbol: string, timeframe: string, limit: number, since?: number): Promise<Array<RateData>> {
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
    if (since) url += `&start=${since}`;
    const res = await axios.get(url, { timeout: 60000 });

    const data = res.data as { result: { list: Array<string> } };
    const result = data.result.list.map(item => {
        const startTime = +item[0] || 0;
        const open = +item[1] || 0;
        const high = +item[2] || 0;
        const low = +item[3] || 0;
        const close = +item[4] || 0;
        const volume = +item[5] || 0;
        const interval = timeframe;
        const isFinal = true;
        const change = (close - open) / open;
        const ampl = (high - low) / open;
        const timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
        return { symbol, startTime, timestring, open, high, low, close, volume, interval, isFinal, change, ampl };
    });
    result.sort((a, b) => b.startTime - a.startTime);
    if (result.length) result[0].isFinal = false;

    return result;
}

export async function getBybitFutureOHLCV(symbol: string, timeframe: string, limit: number, since?: number): Promise<Array<RateData>> {
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

    let url = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=${tf}&limit=${limit}`;
    if (since) url += `&start=${since}`;
    const res = await axios.get(url, { timeout: 60000 });

    const data = res.data as { result: { list: Array<string> } };
    const result = data.result.list.map(item => {
        const startTime = +item[0] || 0;
        const open = +item[1] || 0;
        const high = +item[2] || 0;
        const low = +item[3] || 0;
        const close = +item[4] || 0;
        const volume = +item[5] || 0;
        const interval = timeframe;
        const isFinal = true;
        const change = (close - open) / open;
        const ampl = (high - low) / open;
        const timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
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

    const url = `https://www.okx.com/api/v5/market/candles?instId=${symbol}&bar=${tf}&limit=${limit}`;
    const res = await axios.get(url, { timeout: 60000 });

    const data = res.data as { data: Array<string> };
    const result = data.data.map(item => {
        const startTime = +item[0] || 0;
        const open = +item[1] || 0;
        const high = +item[2] || 0;
        const low = +item[3] || 0;
        const close = +item[4] || 0;
        const volume = +item[5] || 0;
        const interval = timeframe;
        const isFinal = !!+item[8];
        const change = (close - open) / open;
        const ampl = (high - low) / open;
        const timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
        return { symbol, startTime, timestring, open, high, low, close, volume, interval, isFinal, change, ampl };
    });
    result.sort((a, b) => b.startTime - a.startTime);
    // if (result.length) result[0].isFinal = false;

    return result;
}

export async function getOkxOHLCVHistory(symbol: string, timeframe: string, limit: number, since: number): Promise<Array<RateData>> {
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

    const url = `https://www.okx.com/api/v5/market/history-candles?instId=${symbol}&bar=${tf}&limit=${limit}&after=${since + limit * timeframeToNumberMiliseconds(timeframe)}`;
    const res = await axios.get(url, { timeout: 60000 });

    const data = res.data as { data: Array<string> };
    const result = data.data.map(item => {
        const startTime = +item[0] || 0;
        const open = +item[1] || 0;
        const high = +item[2] || 0;
        const low = +item[3] || 0;
        const close = +item[4] || 0;
        const volume = +item[5] || 0;
        const interval = timeframe;
        const isFinal = !!+item[8];
        const change = (close - open) / open;
        const ampl = (high - low) / open;
        const timestring = moment(startTime).format('YYYY-MM-DD HH:mm:SS');
        return { symbol, startTime, timestring, open, high, low, close, volume, interval, isFinal, change, ampl };
    });
    result.sort((a, b) => b.startTime - a.startTime);
    // if (result.length) result[0].isFinal = false;
    while (result.length > 0 && result[result.length - 1].startTime < since) result.pop();

    return result;
}

export function iMA(data: Array<RateData>, period: number) {
    const values = data.map(item => item.close);
    const MAs = indicator.SMA.calculate({
        period,
        values,
        reversedInput: true
    });
    return MAs;
}

export function iEMA(data: Array<RateData>, period: number) {
    const values = data.map(item => item.close);
    const EMAs = indicator.EMA.calculate({
        period,
        values,
        reversedInput: true
    });
    return EMAs;
}

export function iMACD(data: Array<RateData>, fastPeriod: number, slowPeriod: number, signalPeriod: number) {
    const values = data.map(item => item.close);
    const EMAs = indicator.MACD.calculate({
        values,
        fastPeriod,
        slowPeriod,
        signalPeriod,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
        reversedInput: true
    });
    return EMAs.map(item => ({
        MACD: item.MACD || 0,
        signal: item.signal || 0,
        histogram: item.histogram || 0
    }));
}

export function iBB(data: Array<RateData>, period: number, multiplier: number) {
    const values = data.map(item => item.close);
    const EMAs = indicator.BollingerBands.calculate({
        period,
        values,
        stdDev: multiplier,
        reversedInput: true
    });
    return EMAs;
}

export function iZigZag(data: Array<RateData>, deviation: number, depth: number, byPercent: boolean) {
    if (data.length == 0) return [];

    const NO_TREND = null;
    const UP_TREND = 1;
    const DOWN_TREND = -1;

    let trend: typeof NO_TREND | typeof UP_TREND | typeof DOWN_TREND = NO_TREND;
    const result: Array<{ trend: typeof NO_TREND | typeof UP_TREND | typeof DOWN_TREND, highIndex: number, lowIndex: number }> = [];

    let lastHighIndex = data.length - 1;
    let lastLowIndex = data.length - 1;
    let lastHigh = data[lastHighIndex].high;
    let lastLow = data[lastLowIndex].low;


    for (let i = data.length - 2; i >= 0; i--) {
        const rate = data[i];

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

export function iATR(data: Array<RateData>, period: number) {
    const values = data;
    const ATRs = indicator.ATR.calculate({
        high: values.map(item => item.high),
        low: values.map(item => item.low),
        close: values.map(item => item.close),
        period,
        reversedInput: true
    });
    return ATRs;
}

export function isBearishEngulfing(candle1: RateData, candle2: RateData): boolean {
    const twoDayBearishInput = {
        open: [candle1.open, candle2.open],
        high: [candle1.high, candle2.high],
        close: [candle1.close, candle2.close],
        low: [candle1.low, candle2.low]
    };
    return indicator.bearishengulfingpattern(twoDayBearishInput);
}

export function isBullishEngulfing(candle1: RateData, candle2: RateData): boolean {
    const twoDayBullishInput = {
        open: [candle1.open, candle2.open],
        high: [candle1.high, candle2.high],
        close: [candle1.close, candle2.close],
        low: [candle1.low, candle2.low]
    };
    return indicator.bullishengulfingpattern(twoDayBullishInput);
}

export function isBullishHammer(candle: RateData): boolean {
    const singleInput = {
        open: [candle.open],
        high: [candle.high],
        close: [candle.close],
        low: [candle.low]
    };
    return indicator.bullishhammerstick(singleInput);
}

export function isBearishHammer(candle: RateData): boolean {
    const singleInput = {
        open: [candle.open],
        high: [candle.high],
        close: [candle.close],
        low: [candle.low]
    };
    return indicator.bearishhammerstick(singleInput);
}

export function isBullish(data: Array<RateData>, shift: number): boolean {
    //BullishEngulfingPattern, DownsideTasukiGap, BullishHarami, BullishHaramiCross, MorningDojiStar, MorningStar,
    //BullishMarubozu, PiercingLine, ThreeWhiteSoldiers, BullishHammerStick, BullishInvertedHammerStick, HammerPattern,
    //HammerPatternUnconfirmed, TweezerBottom
    const rates = data.slice(shift, shift + 5).reverse();
    const input = {
        open: rates.map(candle => candle.open),
        close: rates.map(candle => candle.close),
        high: rates.map(candle => candle.high),
        low: rates.map(candle => candle.low)
    };
    return indicator.bullish(input);
}

export function isBearish(data: Array<RateData>, shift: number): boolean {
    //BearishEngulfingPattern, BearishHarami, BearishHaramiCross, EveningDojiStar, EveningStar, BearishMarubozu,
    //ThreeBlackCrows, BearishHammerStick, BearishInvertedHammerStick, HangingMan, HangingManUnconfirmed,
    //ShootingStar, ShootingStarUnconfirmed, TweezerTop
    const rates = data.slice(shift, shift + 5).reverse();
    const input = {
        open: rates.map(candle => candle.open),
        close: rates.map(candle => candle.close),
        high: rates.map(candle => candle.high),
        low: rates.map(candle => candle.low)
    };
    return indicator.bearish(input);
}


export function listBullBear(data: Array<RateData>, shift: number): Array<string> {
    const rates = data.slice(shift, shift + 5).reverse();
    const input = {
        open: rates.map(candle => candle.open),
        close: rates.map(candle => candle.close),
        high: rates.map(candle => candle.high),
        low: rates.map(candle => candle.low)
    };

    const list: Array<string> = [];

    //bullish
    if (indicator.bullishengulfingpattern(input)) list.push('BullishEngulfingPattern');
    if (indicator.downsidetasukigap(input)) list.push('DownsideTasukiGap');
    if (indicator.bullishharami(input)) list.push('BullishHaramiCross');
    if (indicator.morningdojistar(input)) list.push('MorningDojiStar');
    if (indicator.morningstar(input)) list.push('MorningStar');
    if (indicator.bullishmarubozu(input)) list.push('BullishMarubozu');
    if (indicator.piercingline(input)) list.push('PiercingLine');
    if (indicator.threewhitesoldiers(input)) list.push('ThreeWhiteSoldiers');
    if (indicator.bullishhammerstick(input)) list.push('BullishHammerStick');
    if (indicator.hammerpattern(input)) list.push('HammerPattern');
    if (indicator.hammerpatternunconfirmed(input)) list.push('HammerPatternUnconfirmed');
    if (indicator.tweezerbottom(input)) list.push('TweezerBottom');

    //bearish
    if (indicator.bearishengulfingpattern(input)) list.push('BearishEngulfingPattern');
    if (indicator.bearishharami(input)) list.push('BearishHarami');
    if (indicator.bearishharamicross(input)) list.push('BearishHaramiCross');
    if (indicator.eveningdojistar(input)) list.push('EveningDojiStar');
    if (indicator.eveningstar(input)) list.push('EveningStar');
    if (indicator.bearishmarubozu(input)) list.push('BearishMarubozu');
    if (indicator.threeblackcrows(input)) list.push('ThreeBlackCrows');
    if (indicator.bearishhammerstick(input)) list.push('BearishHammerStick');
    if (indicator.bearishinvertedhammerstick(input)) list.push('BearishInvertedHammerStick');
    if (indicator.hangingman(input)) list.push('HangingMan');
    if (indicator.shootingstar(input)) list.push('ShootingStar');
    if (indicator.shootingstarunconfirmed(input)) list.push('ShootingStarUnconfirmed');
    if (indicator.tweezertop(input)) list.push('TweezerTop');

    return list;
}

export function iDoji(candle: RateData): boolean {
    const singleInput = {
        open: [candle.open],
        high: [candle.high],
        close: [candle.close],
        low: [candle.low]
    };
    return indicator.doji(singleInput);
}

export async function getOHLCV(broker: string, symbol: string, timeframe: string, limit: number, since?: number): Promise<Array<RateData>> {
    //tinh tu thoi diem since, lay toi da limit candle
    // if (since)
    // console.log(since + timeframeToNumberMiliseconds(timeframe) < new Date().getTime())
    if (since && !checkFinal(timeframe, since - 60000)) since = nextTime(since, timeframe);
    if (broker === 'binance') return getBinanceOHLCV(symbol, timeframe, limit, since);
    if (broker === 'binance_future') return getBinanceFutureOHLCV(symbol, timeframe, limit, since);
    if (broker === 'bybit') return getBybitOHLCV(symbol, timeframe, limit, since);
    if (broker === 'bybitFuture') return getBybitFutureOHLCV(symbol, timeframe, limit, since);
    if (broker === 'okx' && !since) return getOkxOHLCV(symbol, timeframe, limit);
    if (broker === 'okx' && since) return (since + timeframeToNumberMiliseconds(timeframe) * (limit) < new Date().getTime())
        ? getOkxOHLCVHistory(symbol, timeframe, limit, since)
        : getOkxOHLCV(symbol, timeframe, Math.ceil((new Date().getTime() - since) / timeframeToNumberMiliseconds(timeframe)));

    return [];
}

export async function getBinanceFundingRate(symbol: string, limit: number, page: number = 1): Promise<Array<FundingRate>> {
    const url = `https://www.binance.com/bapi/futures/v1/public/future/common/get-funding-rate-history`;
    const body = {
        symbol,
        page,
        rows: limit
    }
    const res = await axios.post(url, body);
    const data: Array<FundingRate> = res.data.data;

    for (let item of data) {
        item.lastFundingRate = +item.lastFundingRate;
        item.markPrice = +item.markPrice;
    }

    return data;
}