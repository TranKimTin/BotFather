import fs from 'fs';
import Telegram from './common/telegram';
import io from 'socket.io-client';
import { calculate, calculateSubExpr } from './common/Expr';
import { BotInfo, ExprArgs, NODE_TYPE, Node, NodeData, ORDER_STATUS, RateData, SocketInfo, SymbolListener, TelegramIdType, UNIT } from './common/Interface';
import * as mysql from './WebConfig/lib/mysql';
import * as util from './common/util';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../.env` });


export class BotFather {
    private socketList: Array<SocketInfo>;

    private botChildren: Array<BotInfo>;
    private telegram: Telegram;
    private botIDs: { [key: string]: number };
    private hostWebServer: string;

    constructor() {
        this.socketList = [];

        this.botChildren = [];
        this.telegram = new Telegram(undefined, undefined, true);
        this.botIDs = {};
        this.hostWebServer = process.env.HOST_WEB_SERVER || 'http://localhost';

        this.connectTradeDataServer('binance');
        this.connectTradeDataServer('bybit');
        this.connectTradeDataServer('okx');
        this.connectTradeDataServer('bybit_future');
        this.connectTradeDataServer('binance_future');

        this.connectToWebConfig(8080);

        this.initBotChildren();
    }

    private connectTradeDataServer(name: string) {
        const BASE_URL = util.getSocketURL(name);
        const client = io(BASE_URL, {
            reconnection: true,              // Bật tính năng tự động kết nối lại (mặc định là true)
            reconnectionAttempts: Infinity,  // Số lần thử kết nối lại tối đa (mặc định là vô hạn)
            reconnectionDelay: 1000,         // Thời gian chờ ban đầu trước khi thử kết nối lại (ms)
            reconnectionDelayMax: 5000,      // Thời gian chờ tối đa giữa các lần thử kết nối lại (ms)
            randomizationFactor: 0.5         // Yếu tố ngẫu nhiên trong thời gian chờ kết nối lại
        });

        client.on('connect', () => {
            console.log(`Connected to server ${BASE_URL}`);
        });

        client.on('onCloseCandle', (msg: { broker: string, symbol: string, timeframe: string, data: Array<RateData> }) => {
            try {
                const { broker, symbol, timeframe, data } = msg;
                console.log(new Date(), broker, symbol, timeframe);
                return;
                if (!broker || !symbol || !timeframe || !data) return;
                this.onCloseCandle(broker, symbol, timeframe, data);
            }
            catch (err) {
                console.error(err);
            }
        });

        client.on('disconnect', (reason: string) => {
            console.log(`onDisconnect - Disconnected from server ${BASE_URL}. reason: ${reason}`);
        });

        client.on("connect_error", (error: { message: any; }) => {
            console.log(`connect_error - Attempting to reconnect ${BASE_URL}`);
            if (client.active) {
                // temporary failure, the socket will automatically try to reconnect
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                console.log(error.message);
                client.connect();
            }
        });

        this.socketList.push({ name, client })
    }

    private connectToWebConfig(port: number) {
        const client = io(`${this.hostWebServer}:${port}`, {
            reconnection: true,              // Bật tính năng tự động kết nối lại (mặc định là true)
            reconnectionAttempts: Infinity,  // Số lần thử kết nối lại tối đa (mặc định là vô hạn)
            reconnectionDelay: 1000,         // Thời gian chờ ban đầu trước khi thử kết nối lại (ms)
            reconnectionDelayMax: 5000,      // Thời gian chờ tối đa giữa các lần thử kết nối lại (ms)
            randomizationFactor: 0.5         // Yếu tố ngẫu nhiên trong thời gian chờ kết nối lại
        });

        client.on('connect', () => {
            console.log(`Connected to web config :${port}`);
            this.initBotChildren();
        });

        client.on('onUpdateConfig', (botName: string) => {
            console.log('onUpdateConfig', botName);
            this.initBotChildren(botName);
        });

        client.on('disconnect', (reason: string) => {
            console.log(`onDisconnect - Disconnected from web config :${port}. reason: ${reason}`);
        });

        client.on("connect_error", (error: { message: any; }) => {
            console.log(`connect_error - Attempting to reconnect web config :${port}`);
            if (client.active) {
            } else {
                console.log(error.message);
                client.connect();
            }
        });
    }

    private async initBotChildren(botName?: string) {
        const botList: Array<any> = await mysql.query(`SELECT id, botName, idTelegram, route, symbolList, timeframes, treeData FROM Bot`);
        this.botChildren = [];

        for (let bot of botList) {
            const botInfo: BotInfo = {
                botName: bot.botName,
                idTelegram: bot.idTelegram,
                route: JSON.parse(bot.route),
                symbolList: JSON.parse(bot.symbolList),
                timeframes: JSON.parse(bot.timeframes),
                treeData: JSON.parse(bot.treeData)
            };
            this.botChildren.push(botInfo);
            this.botIDs[bot.botName] = bot.id;
        }

        const list: Array<string> = [];
        for (const bot of this.botChildren) {
            for (const timeframe of bot.timeframes) {
                for (const s of bot.symbolList) {
                    const [broker, symbol] = s.split(':');
                    const key = `${symbol}:${broker}:${timeframe}`;
                    list.push(key);
                }
            }
        }
        const symbolListener: Array<SymbolListener> = [...new Set(list)].map(item => {
            const [symbol, broker, timeframe] = item.split(':');
            return { symbol, broker, timeframe };
        });

        for (const { client, name } of this.socketList) {
            client.emit('update_symbol_listener', symbolListener);
            console.log('update_symbol_listener', { name });
        }
    }

    public async init() {
        console.log('BotFather init');
    }

    private onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
        for (const botInfo of this.botChildren) {
            try {
                const { botName, idTelegram, symbolList, timeframes, treeData, route } = botInfo;

                if (!timeframes.includes(timeframe) || !symbolList.includes(`${broker}:${symbol}`)) continue;

                // console.log("onCloseCandle", { symbol, timeframe });

                const visited: { [key: string]: boolean } = {};
                this.dfs_handleLogic(route, broker, symbol, timeframe, data, idTelegram, visited, this.botIDs[this, botName]);
            }
            catch (err) {
                console.error({ symbol, timeframe }, err);
            }
        }
    }

    private async dfs_handleLogic(node: Node, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType, visited: { [key: string]: boolean }, botID: number) {
        const { id, next } = node;
        const nodeData = node.data;

        if (visited[id] === true) return;
        visited[id] = true;
        if (await this.handleLogic(nodeData, broker, symbol, timeframe, data, idTelegram, botID)) {
            for (const child of next) {
                await this.dfs_handleLogic(child, broker, symbol, timeframe, data, idTelegram, visited, botID);
            }
        }
    }

    private adjustParam(data: NodeData, args: ExprArgs): boolean {
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

    private async handleLogic(nodeData: NodeData, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType, botID: number): Promise<boolean> {
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
                this.telegram.sendMessage(mess, id);
            }
            return true;
        }

        const node: NodeData = { ...nodeData };
        if (!this.adjustParam(node, exprArgs)) return false;

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

            await mysql.query(sql, args);
            return true;
        }

        return false;
    }
};

const botFather = new BotFather();
botFather.init();
