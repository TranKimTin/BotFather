import BinanceFuture, { RateData } from "./BinanceFuture";
import dotenv from 'dotenv';
import * as util from './util';
dotenv.config({ path: '../.env' });

async function main() {
    let binance = new BinanceFuture({
        apiKey: process.env.API_KEY,
        secretKey: process.env.SECRET_KEY,
        symbolList: ['BTCUSDT'],
        timeframes: ['5m'],
        onCloseCandle: onCloseCandle,
        onClosePosition: () => { },
        onHandleError: () => { },
        onInitStart: () => { },
        onInitDone: () => { },
        isReadOnly: true
    });

    await binance.init();
}

async function onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {
    console.log(data.length)
    let rsi = util.iRSI(data, 14);
    console.log({ rsi: rsi.slice(0, 5) });
}

main();