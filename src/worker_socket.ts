import { parentPort } from 'worker_threads';
import * as mysql from './WebConfig/lib/mysql';
import { BotInfo, CacheIndicator, ExprArgs, NODE_TYPE, RateData, WorkerData } from './common/Interface';
import os from 'os';
import { SocketData } from './SocketServer/socket_data';
import { BinanceSocket } from './SocketServer/socket_binance';
import { BinanceFutureSocket } from './SocketServer/socket_binance_future';
import { BybitSocket } from './SocketServer/socket_bybit';
import { BybitFutureSocket } from './SocketServer/socket_bybit_future';
import { OkxSocket } from './SocketServer/socket_okx';
// import { StaticPool } from 'node-worker-threads-pool';
// import * as util from './common/util';
import * as worker from './worker';
import { calculate, calculateSubExpr } from './common/Expr';

let socket: SocketData;
let symbolListener: { [key: string]: boolean } = {};
// let botChildren: Array<BotInfo>;
// let lastTimeUpdated = 0;
const cacheIndicators: { [key: string]: CacheIndicator } = {};

// const worker = new StaticPool({
//     size: os.cpus().length,
//     task: './worker.js'
// });

if (parentPort) {
    parentPort.on('message', async (msg: { type: string, value: any }) => {
        const t1 = new Date().getTime();
        const { type, value } = msg;
        if (type === 'init') {
            const { broker, symbolList, id } = value;
            console.log(`init worker ${broker} ${id}`);
            initSocketData(broker, symbolList);
            // await initCache(value);
        }
        else if (type === 'update') {
            symbolListener = value.symbolListener;
            worker.setBotData(value.botChildren, value.botIDs);
        }

        const t2 = new Date().getTime();
        parentPort!.postMessage(t2 - t1);
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

async function initCache(broker: string) {
    if (broker !== 'binance_future') return;

    console.log(`${broker} init cache...`);
    const botList = await mysql.query(`SELECT * FROM Bot`);

    const setExpr: Set<string> = new Set();
    for (const bot of botList) {
        const treeData = JSON.parse(bot.treeData);

        for (let node of treeData.elements.nodes) {
            if (node.data.type === NODE_TYPE.EXPR) {
                const expr = node.data.value;
                setExpr.add(expr);
            }
        }
    }

    const exprList = Array.from(setExpr);

    const symbolList: Array<string> = socket.getSymbols();
    const timeframeList: Array<string> = socket.getTimeframes();
    for (const symbol of symbolList) {
        for (const timeframe of timeframeList) {
            const key = `${broker}_${symbol}_${timeframe}`;
            if (!symbolListener[key]) continue;

            if (!cacheIndicators[key]) {
                cacheIndicators[key] = {};
            }

            const data = socket.getData(symbol, timeframe);
            const args: ExprArgs = {
                broker,
                symbol,
                timeframe,
                data,
                cacheIndicator: cacheIndicators[key]
            }
            for (const expr of exprList) {
                const e = calculateSubExpr(expr, args);
                calculate(e, args)
            }
        }
    }

    console.log(`${broker} init cache done`);
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
