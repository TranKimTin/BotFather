import { parentPort } from 'worker_threads';
import * as mysql from './WebConfig/lib/mysql';
import { BotInfo, CacheIndicator, ExprArgs, NODE_TYPE, RateData, WorkerData, WorkerResult } from './common/Interface';
import os from 'os';
import { SocketData } from './SocketServer/socket_data';
import { BinanceSocket } from './SocketServer/socket_binance';
import { BinanceFutureSocket } from './SocketServer/socket_binance_future';
import { BybitSocket } from './SocketServer/socket_bybit';
import { BybitFutureSocket } from './SocketServer/socket_bybit_future';
import { OkxSocket } from './SocketServer/socket_okx';
import * as worker from './worker';
import { calculate, calculateSubExpr, getParseTree } from './common/Expr';
import exp from 'constants';
// import { StaticPool } from 'node-worker-threads-pool';

let socket: SocketData;
let symbolListener: { [key: string]: boolean };
let botChildren: Array<BotInfo>;
let lastTimeUpdated = 0;
// const worker = new StaticPool({
//     size: os.cpus().length,
//     task: './worker.js'
// });
const cacheIndicators: { [key: string]: CacheIndicator } = {}

if (parentPort) {
    console.log('worker_socket loaded');
    parentPort.on('message', async (msg: { type: string, value: any }) => {
        const t1 = new Date().getTime();
        const { type, value } = msg;
        if (type === 'init') {
            await initBotChildren();
            await initSocketData(value);
            await initCache(value);
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


async function initCache(broker: string) {
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

    for (const expr of exprList) {
        if (!expr.includes('{')) {
            getParseTree(expr);
        }
    }

    console.log(`${broker} init cache done`);

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

    lastTimeUpdated = new Date().getTime();
    worker.setBot(botChildren, botIDs)

    console.log('init bot list', botChildren.length);
}

async function onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
    try {
        const key = `${broker}_${symbol}_${timeframe}`;
        if (!symbolListener[key]) return;

        if (!cacheIndicators[key]) {
            cacheIndicators[key] = {};
        }

        // console.log(`onCloseCandle ${broker} ${symbol} ${timeframe} runtime = ${-1} ms`);

        // const workerData: WorkerData = { broker, symbol, timeframe, data, lastTimeUpdated, cacheIndicator: cacheIndicators[key] || {} };
        // const result: WorkerResult = await worker.exec(workerData);
        // cacheIndicators[key] = result.cacheIndicator;
        // console.log(`onCloseCandle ${broker} ${symbol} ${timeframe} runtime = ${result.runtime} ms`);
        // console.log(result)

        const runtime = worker.onCloseCandle(broker, symbol, timeframe, data, cacheIndicators[key]);

        console.log(`onCloseCandle ${broker} ${symbol} ${timeframe} runtime = ${runtime} ms`);
    }
    catch (err) {
        console.error('onCloseCandle error', err);
    }
}
