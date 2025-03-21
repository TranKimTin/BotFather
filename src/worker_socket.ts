import { parentPort } from 'worker_threads';
import { CacheIndicator, RateData } from './common/Interface';
import { SocketData } from './SocketServer/socket_data';
import { BinanceSocket } from './SocketServer/socket_binance';
import { BinanceFutureSocket } from './SocketServer/socket_binance_future';
import { BybitSocket } from './SocketServer/socket_bybit';
import { BybitFutureSocket } from './SocketServer/socket_bybit_future';
import { OkxSocket } from './SocketServer/socket_okx';
// import * as util from './common/util';
import * as worker from './worker';

let socket: SocketData;
let symbolListener: { [key: string]: boolean } = {};
const cacheIndicators: { [key: string]: CacheIndicator } = {};

if (parentPort) {
    parentPort.on('message', async (msg: { type: string, value: any }) => {
        const { type, value } = msg;
        if (type === 'init') {
            const t1 = new Date().getTime();

            const { broker, symbolList, id } = value;
            console.log(`init worker ${broker} ${id}`);

            symbolListener = value.symbolListener;
            worker.setBotData(value.botChildren, value.botIDs);

            await initSocketData(broker, symbolList);
            initCache(broker);
            const t2 = new Date().getTime();
            parentPort!.postMessage(t2 - t1);
        }
        else if (type === 'update') {
            symbolListener = value.symbolListener;
            worker.setBotData(value.botChildren, value.botIDs);
        }
    });
}
else {
    console.error(`Worker thread error.`)
    throw 'parentPort is null';
}

async function initSocketData(broker: string, symbolList: Array<string>) {
    if (broker === 'binance') socket = new BinanceSocket(onCloseCandle, symbolList);
    else if (broker === 'binance_future') socket = new BinanceFutureSocket(onCloseCandle, symbolList);
    else if (broker === 'bybit') socket = new BybitSocket(onCloseCandle, symbolList);
    else if (broker === 'bybit_future') socket = new BybitFutureSocket(onCloseCandle, symbolList);
    else if (broker === 'okx') socket = new OkxSocket(onCloseCandle, symbolList);

    await socket.initData();
}

function initCache(broker: string) {
    console.log(`${broker} init cache...`);

    const t1 = new Date().getTime();
    let cnt = 0;
    const symbolList: Array<string> = socket.getSymbols();
    const timeframeList: Array<string> = socket.getTimeframes();
    for (const symbol of symbolList) {
        for (const timeframe of timeframeList) {
            const data = socket.getData(symbol, timeframe);
            const key = `${broker}_${symbol}_${timeframe}`;

            if (!symbolListener[key]) continue;

            if (!cacheIndicators[key]) {
                cacheIndicators[key] = {};
            }

            const runtime = worker.onCloseCandle(broker, symbol, timeframe, data, cacheIndicators[key], true);
            console.log(`init cache ${broker} ${symbol} ${timeframe} runtime = ${runtime} ms`);
            cnt += Object.keys(cacheIndicators[key]).length;
        }
    }

    const t2 = new Date().getTime();
    console.log(`${broker} init cache done ${cnt} indicators, runtime=${t2 - t1} ms`);
}

function onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
    try {
        const key = `${broker}_${symbol}_${timeframe}`;
        if (!symbolListener[key]) return;

        if (!cacheIndicators[key]) {
            cacheIndicators[key] = {};
        }

        const runtime = worker.onCloseCandle(broker, symbol, timeframe, data, cacheIndicators[key], false);

        console.log(`onCloseCandle ${broker} ${symbol} ${timeframe} runtime = ${runtime} ms`);
    }
    catch (err) {
        console.error('onCloseCandle error', err);
    }
}
