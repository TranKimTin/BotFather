import moment, { DurationInputArg2 } from 'moment';
import zlib from 'zlib';
import * as ccxt from 'ccxt'
import * as technicalindicators from 'technicalindicators';
import _ from 'lodash';
import axios from 'axios';
import { CacheIndicator, CacheIndicatorItem, FundingRate, MACD_Output, MAX_CACHE_SIZE, RateData, RateKey } from './Interface';
import pm2 from 'pm2';
import dotenv from 'dotenv';
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';
import * as customIndicator from './CustomIndicator';
import * as crypto from 'crypto';
import { pipeline } from "stream/promises";
import fs from "fs";
import path from "path";

dotenv.config({ path: `${__dirname}/../../.env` });

technicalindicators.setConfig('precision', 10);

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

export function convertDataToArrayStartTime(data: Array<RateData>) {
    const arr = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
        arr[i] = data[i].startTime;
    }
    return arr;
}

export function convertDataToArrayPricesOpen(data: Array<RateData>) {
    const arr = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
        arr[i] = data[i].open;
    }
    return arr;
}

export function convertDataToArrayPricesClose(data: Array<RateData>) {
    const arr = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
        arr[i] = data[i].close;
    }
    return arr;
}

export function convertDataToArrayPricesHigh(data: Array<RateData>) {
    const arr = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
        arr[i] = data[i].high;
    }
    return arr;
}

export function convertDataToArrayPricesLow(data: Array<RateData>) {
    const arr = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
        arr[i] = data[i].low;
    }
    return arr;
}

export function convertDataToArrayVolume(data: Array<RateData>) {
    const arr = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
        arr[i] = data[i].volume;
    }
    return arr;
}

function updateCacheIndicator(data: Array<RateData>, cached: CacheIndicatorItem, isValueCandle: boolean = false) {
    let i = (cached.lastUpdateTime === 0) ? data.length : 0;
    while (i < data.length && data[i].startTime > cached.lastUpdateTime) {
        i++;
    }
    i--;
    while (i >= 0) {
        cached.values.unshift(cached.indicator.nextValue(isValueCandle ? data[i] : data[i].close));
        if (cached.values.length > MAX_CACHE_SIZE) {
            cached.values.pop();
        }
        i--;
    }

    cached.lastUpdateTime = data[0].startTime;
}

export function iAvgRate(data: Array<RateData>, period: number, rateKey: RateKey, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `avg_${rateKey}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.AvgRate({
                period,
                key: rateKey
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iAvgAmpl(data: Array<RateData>, period: number, byPercent: boolean, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `avgampl_${byPercent}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.AvgAmpl({
                period,
                byPercent: byPercent
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMaxRate(data: Array<RateData>, period: number, rateKey: RateKey, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `max_${rateKey}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MaxRate({
                period,
                key: rateKey
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMinRate(data: Array<RateData>, period: number, rateKey: RateKey, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `min_${rateKey}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MinRate({
                period,
                key: rateKey
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMaxChange(data: Array<RateData>, period: number, byPercent: boolean, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `maxchange_${byPercent}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MaxChange({
                period,
                byPercent
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMinChange(data: Array<RateData>, period: number, byPercent: boolean, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `minchange_${byPercent}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MinChange({
                period,
                byPercent
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMaxAmpl(data: Array<RateData>, period: number, byPercent: boolean, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `maxampl_${byPercent}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MaxAmpl({
                period,
                byPercent
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMinAmpl(data: Array<RateData>, period: number, byPercent: boolean, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `minampl_${byPercent}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MinAmpl({
                period,
                byPercent
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMaxRSI(data: Array<RateData>, rsiPeriod: number, period: number, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `maxrsi_${rsiPeriod}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MaxRsi({
                period,
                rsiPeriod
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMinRSI(data: Array<RateData>, rsiPeriod: number, period: number, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `minrsi_${rsiPeriod}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MinRsi({
                period,
                rsiPeriod
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iAvgRSI(data: Array<RateData>, rsiPeriod: number, period: number, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `avgrsi_${rsiPeriod}_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.AvgRsi({
                period,
                rsiPeriod
            }),
            lastUpdateTime: 0,
            values: []
        };
    }
    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export async function getDigitsSpot() {
    const url = 'https://api.binance.com/api/v1/exchangeInfo';
    const res = await axios.get(url, { timeout: 60000 });
    const data: any = res.data;
    const digits: { [key: string]: { price: number, volume: number, minVolumeInUSD: number } } = {};
    for (const item of data.symbols) {
        digits[hashString(item.symbol)] = {
            price: +item.baseAssetPrecision,
            volume: +item.quotePrecision,
            minVolumeInUSD: +item.filters.filter((i: any) => i.filterType === 'NOTIONAL')[0].minNotional
        }
    }
    return digits;
}

export async function getDigitsFuture() {
    // const url = useFuture ? 'https://fapi.binance.com/fapi/v1/exchangeInfo' : 'https://api.binance.com/api/v1/exchangeInfo'
    const url = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
    const res = await axios.get(url, { timeout: 60000 });
    const data: any = res.data;
    const digits: { [key: string]: { price: number, volume: number, minVolumeInUSD: number } } = {};
    for (const item of data.symbols) {
        digits[hashString(item.symbol)] = {
            price: +item.pricePrecision,
            volume: +item.quantityPrecision,
            minVolumeInUSD: +item.filters.filter((i: any) => i.filterType === 'MIN_NOTIONAL')[0].notional
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
    const res = await axios.get(url, { timeout: 60000 });

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
            return { symbol, startTime, open, high, low, close, volume, interval, isFinal, change, ampl };
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
            return { symbol, startTime, open, high, low, close, volume, interval, isFinal, change, ampl };
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
        return { symbol, startTime, open, high, low, close, volume, interval, isFinal, change, ampl };
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
        return { symbol, startTime, open, high, low, close, volume, interval, isFinal, change, ampl };
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
        return { symbol, startTime, open, high, low, close, volume, interval, isFinal, change, ampl };
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
        return { symbol, startTime, open, high, low, close, volume, interval, isFinal, change, ampl };
    });
    result.sort((a, b) => b.startTime - a.startTime);
    // if (result.length) result[0].isFinal = false;
    while (result.length > 0 && result[result.length - 1].startTime < since) result.pop();

    return result;
}



export function iCCI(data: Array<RateData>, period: number, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `cci_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new technicalindicators.CCI({
                period,
                high: [],
                low: [],
                close: [],
                reversedInput: true,
                format: (val) => val
            }),
            lastUpdateTime: 0,
            values: []
        };
    }

    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}


export function iRSI(data: Array<RateData>, period: number, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `rsi_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.RSI({
                period,
                // values: [],
                // reversedInput: true,
                // format: (val) => val 
            }),
            lastUpdateTime: 0,
            values: []
        };
    }

    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMA(data: Array<RateData>, period: number, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `sma_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.SMA({
                period,
                // values: [],
                // reversedInput: true,
                // format: (val) => val 
            }),
            lastUpdateTime: 0,
            values: []
        };
    }

    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iEMA(data: Array<RateData>, period: number, cacheIndicator: CacheIndicator = {}): Array<number> {
    const key = `ema_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.EMA({
                period,
                // values: [],
                // reversedInput: true,
                // format: (val) => val 
            }),
            lastUpdateTime: 0,
            values: []
        };
    }

    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iMACD(data: Array<RateData>, fastPeriod: number, slowPeriod: number, signalPeriod: number, cacheIndicator: CacheIndicator = {}): Array<MACD_Output> {
    const key = `macd_${fastPeriod}_${slowPeriod}_${signalPeriod}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.MACD({
                // values: [],
                fastPeriod,
                slowPeriod,
                signalPeriod,
                // SimpleMAOscillator: false,
                // SimpleMASignal: false,
                // reversedInput: true,
                // format: (val) => val 
            }),
            lastUpdateTime: 0,
            values: [],
        };
    }

    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function iBB(data: Array<RateData>, period: number, multiplier: number, cacheIndicator: CacheIndicator = {}): Array<BollingerBandsOutput> {
    const key = `bb_${period}_${multiplier}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.BollingerBands({
                period,
                // values: [],
                stdDev: multiplier,
                // reversedInput: true,
                // format: (val) => val 
            }),
            lastUpdateTime: 0,
            values: []
        };
    }

    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
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

export function iATR(data: Array<RateData>, period: number, cacheIndicator: CacheIndicator = {}) {
    const key = `atr_${period}`;
    if (!cacheIndicator[key]) {
        cacheIndicator[key] = {
            indicator: new customIndicator.ATR({
                // high: [],
                // low: [],
                // close: [],
                period,
                // reversedInput: true,
                // format: (val) => val
            }),
            lastUpdateTime: 0,
            values: []
        };
    }

    updateCacheIndicator(data, cacheIndicator[key], true);
    return cacheIndicator[key].values;
}

export function isBearishEngulfing(candle1: RateData, candle2: RateData): boolean {
    const twoDayBearishInput = {
        open: [candle1.open, candle2.open],
        high: [candle1.high, candle2.high],
        close: [candle1.close, candle2.close],
        low: [candle1.low, candle2.low]
    };
    return technicalindicators.bearishengulfingpattern(twoDayBearishInput);
}

export function isBullishEngulfing(candle1: RateData, candle2: RateData): boolean {
    const twoDayBullishInput = {
        open: [candle1.open, candle2.open],
        high: [candle1.high, candle2.high],
        close: [candle1.close, candle2.close],
        low: [candle1.low, candle2.low]
    };
    return technicalindicators.bullishengulfingpattern(twoDayBullishInput);
}

export function isBullishHammer(candle: RateData): boolean {
    const singleInput = {
        open: [candle.open],
        high: [candle.high],
        close: [candle.close],
        low: [candle.low]
    };
    return technicalindicators.bullishhammerstick(singleInput);
}

export function isBearishHammer(candle: RateData): boolean {
    const singleInput = {
        open: [candle.open],
        high: [candle.high],
        close: [candle.close],
        low: [candle.low]
    };
    return technicalindicators.bearishhammerstick(singleInput);
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
    return technicalindicators.bullish(input);
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
    return technicalindicators.bearish(input);
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
    if (technicalindicators.bullishengulfingpattern(input)) list.push('BullishEngulfingPattern');
    if (technicalindicators.downsidetasukigap(input)) list.push('DownsideTasukiGap');
    if (technicalindicators.bullishharami(input)) list.push('BullishHaramiCross');
    if (technicalindicators.morningdojistar(input)) list.push('MorningDojiStar');
    if (technicalindicators.morningstar(input)) list.push('MorningStar');
    if (technicalindicators.bullishmarubozu(input)) list.push('BullishMarubozu');
    if (technicalindicators.piercingline(input)) list.push('PiercingLine');
    if (technicalindicators.threewhitesoldiers(input)) list.push('ThreeWhiteSoldiers');
    if (technicalindicators.bullishhammerstick(input)) list.push('BullishHammerStick');
    if (technicalindicators.hammerpattern(input)) list.push('HammerPattern');
    if (technicalindicators.hammerpatternunconfirmed(input)) list.push('HammerPatternUnconfirmed');
    if (technicalindicators.tweezerbottom(input)) list.push('TweezerBottom');

    //bearish
    if (technicalindicators.bearishengulfingpattern(input)) list.push('BearishEngulfingPattern');
    if (technicalindicators.bearishharami(input)) list.push('BearishHarami');
    if (technicalindicators.bearishharamicross(input)) list.push('BearishHaramiCross');
    if (technicalindicators.eveningdojistar(input)) list.push('EveningDojiStar');
    if (technicalindicators.eveningstar(input)) list.push('EveningStar');
    if (technicalindicators.bearishmarubozu(input)) list.push('BearishMarubozu');
    if (technicalindicators.threeblackcrows(input)) list.push('ThreeBlackCrows');
    if (technicalindicators.bearishhammerstick(input)) list.push('BearishHammerStick');
    if (technicalindicators.bearishinvertedhammerstick(input)) list.push('BearishInvertedHammerStick');
    if (technicalindicators.hangingman(input)) list.push('HangingMan');
    if (technicalindicators.shootingstar(input)) list.push('ShootingStar');
    if (technicalindicators.shootingstarunconfirmed(input)) list.push('ShootingStarUnconfirmed');
    if (technicalindicators.tweezertop(input)) list.push('TweezerTop');

    return list;
}

export function iDoji(candle: RateData): boolean {
    const singleInput = {
        open: [candle.open],
        high: [candle.high],
        close: [candle.close],
        low: [candle.low]
    };
    return technicalindicators.doji(singleInput);
}

export async function getOHLCVFromCacheServer(broker: string, symbol: string, timeframe: string, limit: number, since?: number): Promise<Array<RateData>> {
    const serverURL = process.env.RATE_SERVER || 'localhost';
    const url = `http://${serverURL}:8081/api/getOHLCV?broker=${broker}&symbol=${symbol}&timeframe=${timeframe}&limit=${limit}&since=${since}`;
    const res = await axios.get(url);
    const data: Array<string> = res.data;
    return data.map(item => {
        // item: startTime_open_high_low_close_volume
        const rate = item.split('_');
        return {
            symbol: symbol,
            interval: timeframe,
            startTime: parseInt(rate[0]),
            open: parseFloat(rate[1]),
            high: parseFloat(rate[2]),
            low: parseFloat(rate[3]),
            close: parseFloat(rate[4]),
            volume: parseFloat(rate[5]),
            isFinal: true
        };
    });
}

export async function getOHLCV(broker: string, symbol: string, timeframe: string, limit: number, since?: number): Promise<Array<RateData>> {
    // tinh tu thoi diem since, lay toi da limit candle
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

export function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        // hash |= 0;
    }
    return hash;
}

export function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function base64Encode(data: Uint8Array): string {
    return Buffer.from(data).toString('base64');
}

export function base64Decode(input: string): Uint8Array {
    return Buffer.from(input, 'base64');
}

export function encryptAES(plaintext: string, key: string, iv: string) {
    const keyBuf = Buffer.from(key, 'utf8');
    const ivBuf = Buffer.from(iv, 'hex');

    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuf, ivBuf);
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

export function decryptAES(ciphertextBase64: string, key: string, iv: string): string {
    const encrypted = Buffer.from(ciphertextBase64, 'base64');
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(key, 'utf8'),
        Buffer.from(iv, 'hex')
    );
    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);
    return decrypted.toString('utf8');
}

export function generateRandomIV(): string {
    const iv = crypto.randomBytes(16); // 16 bytes for AES block size
    return iv.toString('hex');
}

async function sha256File(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(filePath);

        stream.on("data", d => hash.update(d));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", reject);
    });
}

function readChecksumFile(checksumPath: string): string {
    const text = fs.readFileSync(checksumPath, "utf8").trim();
    return text.split(/\s+/)[0];
}

async function downloadFile(url: string, filePath: string) {
    const res = await fetch(url);
    if (!res.ok || !res.body) {
        throw new Error(`Download failed: ${url}`);
    }
    await pipeline(res.body as any, fs.createWriteStream(filePath));
}

export async function downloadData(symbol: string, month: string, dest: string) {
    const base = `https://data.binance.vision/data/futures/um/monthly/klines/${symbol}/1m`;
    const fileName = `${symbol}-1m-${month}.zip`;

    const zipUrl = `${base}/${fileName}`;
    const checksumUrl = `${zipUrl}.CHECKSUM`;

    fs.mkdirSync(dest, { recursive: true });

    const zipPath = path.join(dest, fileName);
    const checksumPath = `${zipPath}.CHECKSUM`;

    // nếu đã có cả zip + checksum → verify offline
    if (fs.existsSync(zipPath) && fs.existsSync(checksumPath)) {
        const expectedHash = readChecksumFile(checksumPath);
        const actualHash = await sha256File(zipPath);
        if (expectedHash === actualHash) {
            return zipPath;
        }
        fs.unlinkSync(zipPath);
    }

    // nếu chưa có checksum → tải checksum trước
    if (!fs.existsSync(checksumPath)) {
        await downloadFile(checksumUrl, checksumPath);
    }

    console.log(`Downloading ${fileName}`);
    
    // download zip
    await downloadFile(zipUrl, zipPath);

    // verify sau khi download
    const expectedHash = readChecksumFile(checksumPath);
    const actualHash = await sha256File(zipPath);

    if (expectedHash !== actualHash) {
        fs.unlinkSync(zipPath);
        throw new Error("Checksum mismatch");
    }

    return zipPath;
}