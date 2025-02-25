import { parentPort } from 'worker_threads';
import * as mysql from './WebConfig/lib/mysql';
import { calculate, calculateSubExpr } from './common/Expr';
import { BotInfo, ExprArgs, NODE_TYPE, Node, NodeData, ORDER_STATUS, RateData, TelegramIdType, UNIT, WorkerData } from './common/Interface';
import Telegram from './common/telegram';
import * as util from './common/util';

let botChildren: Array<BotInfo> = [];
const telegram = new Telegram(undefined, undefined, false);
let botIDs: { [key: string]: number } = {};
function onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
    for (const botInfo of botChildren) {
        try {
            const { botName, idTelegram, symbolList, timeframes, route } = botInfo;
            if (!timeframes.includes(timeframe) || !symbolList.includes(`${broker}:${symbol}`)) continue;

            // console.log("onCloseCandle", { symbol, timeframe });

            const visited: { [key: string]: boolean } = {};
            dfs_handleLogic(route, broker, symbol, timeframe, data, idTelegram, visited, botIDs[botName]);
        }
        catch (err) {
            console.error({ symbol, timeframe }, err);
        }
    }
}

function binarySearch(arr: Array<string>, target: string): boolean {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return true;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return false;
}


function dfs_handleLogic(node: Node, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType, visited: { [key: string]: boolean }, botID: number) {
    const { id, next } = node;
    const nodeData = node.data;

    if (visited[id] === true) return;
    visited[id] = true;
    if (handleLogic(nodeData, broker, symbol, timeframe, data, idTelegram, botID)) {
        for (const child of next) {
            dfs_handleLogic(child, broker, symbol, timeframe, data, idTelegram, visited, botID);
        }
    }
}

function handleLogic(nodeData: NodeData, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType, botID: number): boolean {
    if (nodeData.type === NODE_TYPE.START) return true;

    const exprArgs: ExprArgs = {
        broker,
        symbol,
        timeframe,
        data
    };

    if (nodeData.type === NODE_TYPE.EXPR) {
        if (!nodeData.value) return false;

        let expr = nodeData.value;
        expr = calculateSubExpr(expr, exprArgs);

        const result = calculate(expr, exprArgs);
        return Boolean(result);
    }

    if (nodeData.type === NODE_TYPE.TELEGRAM) {
        if (!nodeData.value) return false;

        let content: string = nodeData.value.trim();
        content = calculateSubExpr(content, exprArgs);

        const emoji: { [key: string]: string } = {
            'binance': '🥇🥇🥇',
            'bybit': '',
            'okx': '🏁🏁🏁',
            'binance_future': '🥇🥇🥇',
            'bybit_future': ''
        }
        const url: { [key: string]: string } = {
            'binance': `https://www.binance.com/en/trade/${symbol}?_from=markets&type=spot`,
            'bybit': `https://www.bybit.com/vi-VN/trade/spot/${symbol.replace('USDT', '')}/USDT`,
            'okx': `https://www.okx.com/vi/trade-spot/${symbol}`,
            'binance_future': `https://www.binance.com/en/futures/${symbol}?_from=markets`,
            'bybit_future': `https://www.bybit.com/trade/usdt/${symbol}`
        }

        let mess = emoji[broker];
        mess += `\n<a href="${url[broker]}"><b>${symbol}</b></a>`;
        mess += `\n${broker}`;
        mess += `\n${timeframe} ${data[0].timestring}`;
        mess += `\n${content}`;

        if (content === '<--->') mess = '--------------------';

        const ids = idTelegram.toString().split(',').map(item => item.trim()).filter(item => item !== '');
        for (const id of ids) {
            telegram.sendMessage(mess, id);
        }
        return true;
    }

    const node: NodeData = { ...nodeData };
    if (!adjustParam(node, exprArgs)) return false;

    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(node.type)) {
        const sql = `INSERT INTO Orders(symbol,broker,timeframe,orderType,volume,stop,entry,tp,sl,status,createdTime,expiredTime,botID) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const args = [
            symbol,
            broker,
            timeframe,
            node.type,
            node.volume,
            node.stop,
            node.entry,
            node.tp,
            node.sl,
            ORDER_STATUS.OPENED,
            util.nextTime(data[0].startTime, timeframe),
            node.expiredTime,
            botID
        ];
        console.log(`new order`, args);

        mysql.query(sql, args).catch(err => {
            console.error('mysql query error in worker thread', sql, args, err);
        });
        return true;
    }

    return false;
}

function adjustParam(data: NodeData, args: ExprArgs): boolean {
    //stop
    if ([NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT].includes(data.type)) {
        if (!data.stop) return false;
        let expr: string = data.stop;
        expr = calculateSubExpr(expr, args);
        if (data.unitStop === UNIT.PERCENT) expr = `close() * (100 + abs(${expr})) / 100`;
        data.stop = calculate(expr, args);
        if (data.stop === null) return false;
    }
    else if ([NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.stop) return false;
        let expr: string = data.stop;
        expr = calculateSubExpr(expr, args);
        if (data.unitStop === UNIT.PERCENT) expr = `close() * (100 - abs(${expr})) / 100`;
        data.stop = calculate(expr, args);
        if (data.stop === null) return false;
    }
    else {
        data.stop = undefined;
    }

    //entry
    if ([NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_LIMIT].includes(data.type)) {
        if (!data.entry) return false;
        let expr: string = data.entry;
        expr = calculateSubExpr(expr, args);
        if (data.unitEntry === UNIT.PERCENT) expr = `close() * (100 - abs(${expr})) / 100`;
        data.entry = calculate(expr, args);
        if (data.entry === null) return false;
    }
    else if ([NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.entry) return false;
        let expr: string = data.entry;
        expr = calculateSubExpr(expr, args);
        if (data.unitEntry === UNIT.PERCENT) expr = `close() * (100 + abs(${expr})) / 100`;
        data.entry = calculate(expr, args);
        if (data.entry === null) return false;
    }
    else if ([NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.SELL_STOP_MARKET].includes(data.type)) {
        data.entry = data.stop;
    }
    else if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.SELL_MARKET].includes(data.type)) {
        data.entry = args.data[0].close;
    }

    const closePrice: number = args.data[0].close;
    const entry: number = parseFloat(data.entry);
    const stop: number = parseFloat(data.stop);

    // match entry immediately
    if (data.type === NODE_TYPE.BUY_LIMIT && closePrice <= entry) {
        data.entry = closePrice;
    }
    else if (data.type === NODE_TYPE.BUY_STOP_LIMIT && closePrice <= entry && closePrice >= stop) {
        data.entry = closePrice;
    }
    else if (data.type === NODE_TYPE.SELL_LIMIT && closePrice >= entry) {
        data.entry = closePrice;
    }
    else if (data.type === NODE_TYPE.SELL_STOP_LIMIT && closePrice >= entry && closePrice <= stop) {
        data.entry = closePrice;
    }

    //sl
    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT].includes(data.type)) {
        if (!data.sl) return false;
        let expr: string = data.sl;
        expr = calculateSubExpr(expr, args);
        if (data.unitSL === UNIT.PERCENT) expr = `(${data.entry}) * (100 - abs(${expr})) / 100`;
        data.sl = calculate(expr, args);
        if (data.sl === null) return false;
    }
    else if ([NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.sl) return false;
        let expr: string = data.sl;
        expr = calculateSubExpr(expr, args);
        if (data.unitSL === UNIT.PERCENT) expr = `(${data.entry}) * (100 + abs(${expr})) / 100`;
        data.sl = calculate(expr, args);
        if (data.sl === null) return false;
    }
    else {
        data.sl = undefined;
    }

    //tp
    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT].includes(data.type)) {
        if (!data.tp) return false;
        let expr: string = data.tp;
        expr = calculateSubExpr(expr, args);
        if (data.unitTP === UNIT.PERCENT) expr = `(${data.entry}) * (100 + abs(${expr})) / 100`;
        else if (data.unitTP === UNIT.RR) expr = `(${data.entry} + abs(${data.entry} - ${data.sl}) * abs(${expr}))`;
        data.tp = calculate(expr, args);
        if (data.tp === null) return false;
    }
    else if ([NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.tp) return false;
        let expr: string = data.tp;
        expr = calculateSubExpr(expr, args);
        if (data.unitTP === UNIT.PERCENT) expr = `(${data.entry}) * (100 - abs(${expr})) / 100`;
        else if (data.unitTP === UNIT.RR) expr = `(${data.entry} - abs(${data.entry} - ${data.sl}) * abs(${expr}))`;
        data.tp = calculate(expr, args);
        if (data.tp === null) return false;
    }
    else {
        data.tp = undefined;
    }

    //volume
    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.volume) return false;
        let expr: string = data.volume;
        expr = calculateSubExpr(expr, args);
        if (data.unitVolume === UNIT.USD) expr = `(${expr}) / ${data.entry}`;
        data.volume = calculate(expr, args);
        if (data.volume === null) return false;
    }
    else {
        data.volume = undefined;
    }

    //expired time
    if ([NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.expiredTime) return false;
        let expr: string = data.expiredTime;
        expr = calculateSubExpr(expr, args);
        if (data.unitExpiredTime === UNIT.MINUTE) {
            expr = `((${expr}) * 60000) + ${util.nextTime(args.data[0].startTime, args.timeframe)}`;
        }
        else if (data.unitExpiredTime === UNIT.CANDLE) {
            expr = `((${expr}) * 60000 * ${util.timeframeToNumberMinutes(args.timeframe)}) + ${util.nextTime(args.data[0].startTime, args.timeframe)}`;
        }
        data.expiredTime = calculate(expr, args);
        if (data.expiredTime === null) return false;
    }
    else {
        data.expiredTime = undefined;
    }

    // match TP, SL immediately
    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT].includes(data.type)) {
        if (data.entry <= data.sl) data.sl = data.entry;
        if (data.entry >= data.tp) data.tp = data.entry;
    }
    else if ([NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (data.entry >= data.sl) data.sl = data.entry;
        if (data.entry <= data.tp) data.tp = data.entry;
    }

    return true;
}

if (parentPort) {
    console.log('worker loaded');
    parentPort.on('message', async (msg: { type: string, value: any }) => {
        const t1 = new Date().getTime();
        if (msg.type === 'onCloseCandle') {
            const workerData: WorkerData = msg.value;
            const { broker, symbol, timeframe, data } = workerData;

            onCloseCandle(broker, symbol, timeframe, data);
        }
        else if (msg.type === 'setBotChildren') {
            botChildren = msg.value;
        }
        else if (msg.type === 'setBotIDs') {
            botIDs = msg.value;
        }

        const t2 = new Date().getTime();
        parentPort!.postMessage(t2 - t1);
    });
}
else {
    console.error(`Worker thread error.`)
    throw 'parentPort is null';
}