import { parentPort, workerData } from 'worker_threads';
import * as mysql from './WebConfig/lib/mysql';
import { calculate, calculateSubExpr } from './common/Expr';
import { BotInfo, ExprArgs, NODE_TYPE, Node, NodeData, ORDER_STATUS, RateData, SocketInfo, SymbolListener, TelegramIdType, UNIT } from './common/Interface';
import Telegram from './common/telegram';
import * as util from './common/util';
import fs from 'fs';

let botChildren: Array<BotInfo> = [];
const telegram = new Telegram(undefined, undefined, false);
const botIDs: { [key: string]: number } = {};
function onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
    console.log('worker onCloseCandle');
    for (const botInfo of botChildren) {
        try {
            const { botName, idTelegram, symbolList, timeframes, treeData, route } = botInfo;
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

        const ids = idTelegram.toString().split(',').map(item => item.trim());
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

async function initBotChildren() {
    const botList: Array<any> = await mysql.query(`SELECT id, botName, idTelegram, route, symbolList, timeframes, treeData FROM Bot`);
    botChildren = [];

    for (let bot of botList) {
        const botInfo: BotInfo = {
            botName: bot.botName,
            idTelegram: bot.idTelegram,
            route: JSON.parse(bot.route),
            symbolList: JSON.parse(bot.symbolList),
            timeframes: JSON.parse(bot.timeframes),
            treeData: JSON.parse(bot.treeData)
        };
        botChildren.push(botInfo);
        botIDs[bot.botName] = bot.id;
    }
    console.log('initBotChildren', botChildren.length);
}

let lastTimeUpdatedBotList = '-';
const tempFile = 'temp.txt';
if (parentPort) {
    console.log('worker loaded');
    initBotChildren();
    parentPort.on('message', async (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => {
        console.log('worker message', broker, symbol, timeframe);
        if (!broker || !symbol || !timeframe || !data) throw 'worker data error';
        const t1 = new Date().getTime();
        let lastTime = fs.existsSync(tempFile) ? fs.readFileSync(tempFile).toString() : '';
        if (lastTime !== lastTimeUpdatedBotList) {
            lastTimeUpdatedBotList = lastTime;
            await initBotChildren();
        }
        onCloseCandle(broker, symbol, timeframe, data);
        const t2 = new Date().getTime();
        console.log('worker runtime', t2 - t1);
        parentPort?.postMessage(t2 - t1);
    });
}
else {
    console.error(`Worker thread error.`)
    throw 'parentPort is null';
}