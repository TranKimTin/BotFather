import BinanceFuture from "./BinanceFuture";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function main() {
    let binance = new BinanceFuture({
        apiKey: process.env.API_KEY,
        secretKey: process.env.SECRET_KEY,
        symbolList: ['BNBUSDT'],
        timeframes: ['15m'],
        onCloseCandle: () => { },
        onClosePosition: () => { },
        onHandleError: () => { },
        onInitStart: () => { },
        onInitDone: () => { },
        isReadOnly: true
    });

    await binance.init(1);

}

main();