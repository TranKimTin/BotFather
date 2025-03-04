import { parentPort } from 'worker_threads';
import * as mysql from './WebConfig/lib/mysql';
import { BotInfo, CacheIndicator, RateData, WorkerData } from './common/Interface';
import os from 'os';
import { SocketData } from './SocketServer/socket_data';
import { BinanceSocket } from './SocketServer/socket_binance';
import { BinanceFutureSocket } from './SocketServer/socket_binance_future';
import { BybitSocket } from './SocketServer/socket_bybit';
import { BybitFutureSocket } from './SocketServer/socket_bybit_future';
import { OkxSocket } from './SocketServer/socket_okx';
// import { StaticPool } from 'node-worker-threads-pool';
import * as util from './common/util';
import * as worker from './worker';

let socket: SocketData;
let symbolListener: { [key: string]: boolean };
let botChildren: Array<BotInfo>;
let lastTimeUpdated = 0;
const cacheIndicators: { [key: string]: CacheIndicator } = {};

// const worker = new StaticPool({
//     size: os.cpus().length,
//     task: './worker.js'
// });

if (parentPort) {
    console.log('worker_socket loaded');
    parentPort.on('message', async (msg: { type: string, value: any }) => {
        const t1 = new Date().getTime();
        const { type, value } = msg;
        if (type === 'init') {
            await initBotChildren();
            await initSocketData(value);
        }
        else if (type === 'update') {
            await initBotChildren();
        }

        const t2 = new Date().getTime();
        parentPort!.postMessage(t2 - t1);
    });
}
else {
    console.error(`Worker thread error.`)
    throw 'parentPort is null';
}

async function initSocketData(broker: string) {
    if (broker === 'binance') socket = new BinanceSocket(onCloseCandle);
    else if (broker === 'binance_future') socket = new BinanceFutureSocket(onCloseCandle);
    else if (broker === 'bybit') socket = new BybitSocket(onCloseCandle);
    else if (broker === 'bybit_future') socket = new BybitFutureSocket(onCloseCandle);
    else if (broker === 'okx') socket = new OkxSocket(onCloseCandle);

    await socket.initData();
}

async function initBotChildren() {
    const botList: Array<any> = await mysql.query(`SELECT id, botName, idTelegram, route, symbolList, timeframes, treeData FROM Bot`);
    botChildren = [];
    const botIDs: { [key: string]: number } = {};

    for (let bot of botList) {
        const botInfo: BotInfo = {
            botName: bot.botName,
            idTelegram: bot.idTelegram,
            route: JSON.parse(bot.route),
            symbolList: JSON.parse(bot.symbolList),
            timeframes: JSON.parse(bot.timeframes),
            treeData: JSON.parse(bot.treeData)
        };
        botInfo.symbolList.sort();
        botChildren.push(botInfo);
        botIDs[bot.botName] = bot.id;
    }

    symbolListener = {};

    for (const bot of botChildren) {
        for (const timeframe of bot.timeframes) {
            for (const s of bot.symbolList) {
                const [broker, symbol] = s.split(':');
                const key = `${broker}_${symbol}_${timeframe}`;
                symbolListener[key] = true;
            }
        }
    }

    // lastTimeUpdated = new Date().getTime();
    worker.setBotData(botChildren, botIDs)

    console.log('init bot list', botChildren.length);
}

async function onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
    try {
        const key = `${broker}_${symbol}_${timeframe}`;
        if (!symbolListener[key]) return;

        // console.log(`onCloseCandle ${broker} ${symbol} ${timeframe} runtime = ${-1} ms`);

        // const openBuffer = new SharedArrayBuffer(data.length * 8);
        // const open = new Float64Array(openBuffer);
        // open.set(util.convertDataToArrayPricesOpen(data));

        // const highBuffer = new SharedArrayBuffer(data.length * 8);
        // const high = new Float64Array(highBuffer);
        // high.set(util.convertDataToArrayPricesHigh(data));

        // const lowBuffer = new SharedArrayBuffer(data.length * 8);
        // const low = new Float64Array(lowBuffer);
        // low.set(util.convertDataToArrayPricesLow(data));

        // const closeBuffer = new SharedArrayBuffer(data.length * 8);
        // const close = new Float64Array(closeBuffer);
        // close.set(util.convertDataToArrayPricesClose(data));

        // const volumeBuffer = new SharedArrayBuffer(data.length * 8);
        // const volume = new Float64Array(volumeBuffer);
        // volume.set(util.convertDataToArrayVolume(data));

        // const startTimeBuffer = new SharedArrayBuffer(data.length * 8);
        // const startTime = new Float64Array(startTimeBuffer);
        // startTime.set(util.convertDataToArrayStartTime(data));

        // const workerData: WorkerData = { broker, symbol, timeframe, lastTimeUpdated, startTime, open, high, low, close, volume };
        // const runtime: number = await worker.exec(workerData);

        if (!cacheIndicators[key]) {
            cacheIndicators[key] = {};
        }

        const runtime = worker.onCloseCandle(broker, symbol, timeframe, data, cacheIndicators[key]);

        console.log(`onCloseCandle ${broker} ${symbol} ${timeframe} runtime = ${runtime} ms`);
    }
    catch (err) {
        console.error('onCloseCandle error', err);
    }
}
