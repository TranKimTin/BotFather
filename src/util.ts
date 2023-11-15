import moment from 'moment';
import { RateData } from './BinanceFuture';

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
    let RSI = [];

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

    return RSI.reverse();
}

export async function getDigitsFuture() {
    let res = await fetch("https://fapi.binance.com/fapi/v1/exchangeInfo", {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });
    let data = await res.json();
    let digits: { [key: string]: { price: number, volume: number } } = {};
    for (let item of data.symbols) {
        digits[item.symbol] = {
            price: item.pricePrecision,
            volume: item.quantityPrecision
        }
    }
    return digits;
}

export async function getSymbolList() {
    let res = await fetch("https://fapi.binance.com/fapi/v1/ticker/24hr", {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });
    let data = await res.json() as Array<{ symbol: string }>;
    return data.map(item => item.symbol);
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