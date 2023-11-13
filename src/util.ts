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