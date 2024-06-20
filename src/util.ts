import moment, { DurationInputArg2 } from 'moment';
import { RateData } from './BinanceFuture';
import zlib from 'zlib';
import fs from 'fs';
import * as ccxt from 'ccxt'
import * as indicator from 'technicalindicators';

let binance = new ccxt.binanceusdm({});

interface OHLCV {
    symbol: string,
    startTime: number,
    open: number
    high: number,
    low: number,
    close: number,
    volume: number
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
    let res = await fetch("https://fapi.binance.com/fapi/v1/exchangeInfo", {
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

export async function getSymbolList() {
    // let res = await fetch("https://fapi.binance.com/fapi/v1/ticker/24hr", {
    //     "headers": {
    //         "accept": "*/*",
    //         "content-type": "application/json",
    //     },
    //     "body": null,
    //     "method": "GET"
    // });
    // let data = await res.json() as Array<{ symbol: string }>;
    // return data.map(item => item.symbol);

    let res = await fetch("https://fapi.binance.com/fapi/v1/exchangeInfo", {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET"
    });

    let data = await res.json() as { symbols: Array<{ symbol: string; status: string }> };
    return data.symbols.filter((item: { status: string }) => item.status == 'TRADING').map((item: { symbol: any; }) => item.symbol);
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

// export function iMACD(data: Array<RateData>, fastPeriod: number, slowPeriod: number, signalPeriod: number) {
//     let values = data.map(item => item.close).reverse();
//     let EMAs = indicator.MACD.calculate({
//         values,
//         fastPeriod,
//         slowPeriod,
//         signalPeriod,
//         SimpleMAOscillator: false,
//         SimpleMASignal: false
//     });
//     return EMAs.reverse();
// }


export function iMACD(data: Array<RateData>, fastEMA: number, slowEMA: number, signalPeriod: number) {
    //Khi đường MACD cắt qua đường tín hiệu (EMA9) từ dưới lên, đó là tín hiệu mua (histogram từ âm chuyển sang dương)
    //khi đường MACD cắt qua đường tín hiệu từ trên xuống, đó là tín hiệu bán. 

    let prices = data.map(item => item.close).reverse();


    let macdValues = [];

    let slowEMAValues = getEMA(prices, slowEMA);
    let fastEMAValues = getEMA(prices, fastEMA);

    for (let i = 0; i < prices.length; i++) {
        macdValues[i] = (fastEMAValues[i] - slowEMAValues[i]);
    }

    let signalSMAValues = getEMA(macdValues, signalPeriod);

    let result = [];
    for (let i = 0; i < macdValues.length; i++) {
        result.push({
            MACD: macdValues[i],
            signal: signalSMAValues[i],
            histogram: (macdValues[i] - signalSMAValues[i])
        });
    }

    return result.reverse();
}

function getEMA(prices: Array<number>, period: number) {
    // Trong đó, prices là mảng chứa giá trị của cổ phiếu hoặc chứng khoán mà bạn muốn tính EMA
    // và period là khoảng thời gian tính EMA (thông thường là 10, 20, 50 hoặc 200). 
    // Hàm sẽ trả về một mảng chứa các giá trị EMA tương ứng với mỗi ngày trong khoảng thời gian được xem xét.
    let emaValues = [0];
    let multiplier = 2 / (period + 1);
    let ema = prices[0];
    for (let i = 1; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema;
        emaValues[i] = ema;
    }
    return emaValues;
}
