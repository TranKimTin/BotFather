import BinanceFuture, { RateData } from './BinanceFuture';
import Telegram from './telegram';
import * as util from './util';


let telegram = new Telegram("");
telegram.setChatID('@trankimtin');

async function main() {
    console.log('Bot warning');
    let binance = new BinanceFuture({
        apiKey: process.env.API_KEY,
        secretKey: process.env.SECRET_KEY,
        symbolList: ['BTCUSDT', 'LTCUSDT', 'ALTUSDT', 'JUPUSDT', 'ETHUSDT'],
        timeframes: ['15m'],
        onCloseCandle: onCloseCandle,
        onClosePosition: async (symbol: string) => { },
        onHandleError: async (err: any, symbol: string | undefined) => { await telegram.sendError((symbol ? symbol : '') + err.message); },
        onInitStart: async () => { await telegram.sendMessage('bot restart...') },
        onInitDone: async () => { await telegram.sendMessage('bot restart done.') },
        isReadOnly: true
    });
    await binance.init();
}

async function onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {
    let RSI = util.iRSI(data, 14);
    if (RSI.length == 0) return;

    let rsi = +RSI[0].toFixed(2);
    console.log({ symbol, timeframe, rsi });
    if (rsi >= 70 || rsi <= 30) {
        let dataTable = [
            ['Timestamp', data[0].timestring],
            ['Symbol', symbol],
            ['Price', data[0].close],
            ['RSI', rsi],
            ['Symbol', symbol],
        ];
        await telegram.sendTable(dataTable);
    }
}


main();