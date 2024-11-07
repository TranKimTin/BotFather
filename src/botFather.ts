import fs from 'fs';
import Telegram from './common/telegram';
import io from 'socket.io-client';
import { calculate } from './common/Expr';
import { BotInfo, ExprArgs, Node, NodeData, ORDER_STATUS, RateData, SocketInfo, SymbolListener, TelegramIdType, UNIT } from './common/Interface';
import * as mysql from './WebConfig/lib/mysql';
import * as util from './common/util';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../.env` });


export class BotFather {
    private socketList: Array<SocketInfo>;

    private botChildren: Array<BotInfo>;
    private telegram: Telegram;
    private botIDs: { [key: string]: number };
    private hostSocketServer: string;
    private hostWebServer: string;

    constructor() {
        this.socketList = [];

        this.botChildren = [];
        this.telegram = new Telegram(undefined, undefined, true);
        this.botIDs = {};
        this.hostSocketServer = process.env.HOST_SOCKET_SERVER || 'http://localhost';
        this.hostWebServer = process.env.HOST_WEB_SERVER || 'http://localhost';

        this.connectTradeDataServer('binance', 81);
        this.connectTradeDataServer('bybit', 82);
        this.connectTradeDataServer('okx', 83);
        this.connectTradeDataServer('bybit_future', 84);
        this.connectTradeDataServer('binance_future', 85);

        this.connectToWebConfig(8080);

        this.initBotChildren();
    }

    private connectTradeDataServer(name: string, port: number) {
        const client = io(`${this.hostSocketServer}:${port}`, {
            reconnection: true,              // Bật tính năng tự động kết nối lại (mặc định là true)
            reconnectionAttempts: Infinity,  // Số lần thử kết nối lại tối đa (mặc định là vô hạn)
            reconnectionDelay: 1000,         // Thời gian chờ ban đầu trước khi thử kết nối lại (ms)
            reconnectionDelayMax: 5000,      // Thời gian chờ tối đa giữa các lần thử kết nối lại (ms)
            randomizationFactor: 0.5         // Yếu tố ngẫu nhiên trong thời gian chờ kết nối lại
        });

        client.on('connect', () => {
            console.log(`Connected to server ${name}:${port}`);
        });

        client.on('onCloseCandle', (msg: { broker: string, symbol: string, timeframe: string, data: Array<RateData> }) => {
            try {
                const { broker, symbol, timeframe, data } = msg;
                if (!broker || !symbol || !timeframe || !data) return;
                this.onCloseCandle(broker, symbol, timeframe, data);
            }
            catch (err) {
                console.error(err);
            }
        });

        client.on('disconnect', (reason: string) => {
            console.log(`onDisconnect - Disconnected from server ${name}:${port}. reason: ${reason}`);
        });

        client.on("connect_error", (error: { message: any; }) => {
            console.log(`connect_error - Attempting to reconnect ${name}:${port}`);
            if (client.active) {
                // temporary failure, the socket will automatically try to reconnect
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                console.log(error.message);
                client.connect();
            }
        });

        this.socketList.push({ name, port, client })
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

        for (const { client, name, port } of this.socketList) {
            client.emit('update_symbol_listener', symbolListener);
            console.log('update_symbol_listener', { name, port });
        }
    }

    public async init() {
        console.log('BotFather init');
    }

    private onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
        for (const botInfo of this.botChildren) {
            const { botName, idTelegram, symbolList, timeframes, treeData, route } = botInfo;

            if (!timeframes.includes(timeframe) || !symbolList.includes(`${broker}:${symbol}`)) continue;

            // console.log("onCloseCandle", { symbol, timeframe });

            const visited: { [key: string]: boolean } = {};
            this.dfs_handleLogic(route, broker, symbol, timeframe, data, idTelegram, visited, this.botIDs[this, botName]);

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

    private calculateSubExpr(expr: string, args: ExprArgs) {
        const subExprs = [...new Set([...expr.matchAll(/\{(.*?)\}/g)].map(match => match[1]))];
        for (const subExpr of subExprs) {
            const result = calculate(subExpr, args);
            expr = expr.replaceAll(`{${subExpr}}`, result);
        }
        return expr;
    }

    private adjustParam(data: NodeData, args: ExprArgs) {
        //stop
        if (['openBuyStopMarket', 'openBuyStopLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(data.type)) {
            if (!data.stop) return false;
            let expr: string = data.stop;
            if (data.unitStop === UNIT.PERCENT) expr = `{close()} * (100 + (${expr})) / 100`;
            expr = this.calculateSubExpr(expr, args);
            data.stop = calculate(expr, args);
        }

        //entry
        if (['openBuyLimit', 'openBuyStopLimit', 'openSellLimit', 'openSellStopLimit'].includes(data.type)) {
            if (!data.entry) return false;
            let expr: string = data.entry;
            if (data.unitEntry === UNIT.PERCENT) expr = `{close()} * (100 + (${expr})) / 100`;
            expr = this.calculateSubExpr(expr, args);
            data.entry = calculate(expr, args);
        }
        else if (['openBuyMarket', 'openSellMarket'].includes(data.type)) {
            data.entry = calculate(`close()`, args);
        }

        //tp
        if (['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(data.type)) {
            if (!data.tp) return false;
            let expr: string = data.tp;
            if (data.unitTP === UNIT.PERCENT) expr = `(${data.entry}) * (100 + (${expr})) / 100`;
            expr = this.calculateSubExpr(expr, args);
            data.tp = calculate(expr, args);
        }

        //sl
        if (['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(data.type)) {
            if (!data.sl) return false;
            let expr: string = data.sl;
            if (data.unitSL === UNIT.PERCENT) expr = `(${data.entry}) * (100 + (${expr})) / 100`;
            expr = this.calculateSubExpr(expr, args);
            data.sl = calculate(expr, args);
        }

        //volume
        if (['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(data.type)) {
            if (!data.volume) return false;
            let expr: string = data.volume;
            if (data.unitVolume === UNIT.USD) expr = `(${expr}) / ${data.entry}`;
            expr = this.calculateSubExpr(expr, args);
            data.volume = calculate(expr, args);
        }

        //expired time
        if (['openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(data.type)) {
            if (!data.expiredTime) return false;
            let expr: string = data.expiredTime;
            if (data.unitExpiredTime === UNIT.MINUTE) {
                expr = `((${expr}) * 60000) + ${util.nextTime(args.data[0].startTime, args.timeframe)}`;
            }
            else if (data.unitExpiredTime === UNIT.CANDLE) {
                expr = `((${expr}) * 60000 * ${util.timeframeToNumberMinutes(args.timeframe)}) + ${util.nextTime(args.data[0].startTime, args.timeframe)}`;
            }
            expr = this.calculateSubExpr(expr, args);
            data.expiredTime = calculate(expr, args);
        }

        return true;
    }

    private async handleLogic(nodeData: NodeData, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType, botID: number): Promise<boolean> {
        if (nodeData.type === 'start') return true;

        const exprArgs: ExprArgs = {
            broker,
            symbol,
            timeframe,
            data
        };

        if (nodeData.type === 'expr') {
            if (!nodeData.value) return false;

            let expr = nodeData.value;
            expr = this.calculateSubExpr(expr, exprArgs);

            const result = calculate(expr, exprArgs);
            return Boolean(result);
        }

        if (nodeData.type === 'telegram') {
            if (!nodeData.value) return false;

            let content: string = nodeData.value.trim();
            content = this.calculateSubExpr(content, exprArgs);

            const emoji: { [key: string]: string } = {
                'binance': '🥇🥇🥇',
                'bybit': '',
                'okx': '🏁🏁🏁',
                'binance_future': '🥇🥇🥇',
                'bybit_future': ''
            }

            let mess = emoji[broker];
            mess += `\n${broker}:${symbol} ${timeframe} ${data[0].timestring}`
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

        if (node.type === 'openBuyMarket' || nodeData.type === 'openSellMarket') {
            const sql = `INSERT INTO botfather.order(symbol,broker,timeframe,orderType,volume,entry,tp,sl,status,createdTime,botID) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
            const args = [
                symbol,
                broker,
                timeframe,
                node.type,
                node.volume,
                node.entry,
                node.tp,
                node.sl,
                ORDER_STATUS.OPENED,
                util.nextTime(data[0].startTime, timeframe),
                botID
            ];
            console.log(`new order`, args);

            await mysql.query(sql, args);
            return true;
        }
        if (node.type === 'openBuyLimit' || node.type === 'openSellLimit') {

            return true;
        }
        if (node.type === 'openBuyStopMarket') {
            return true;
        }
        if (node.type === 'openBuyStopLimit') {
            return true;
        }

        if (node.type === 'openSellStopMarket') {
            return true;
        }
        if (node.type === 'openSellStopLimit') {
            return true;
        }
        if (node.type === 'closeAllOrder') {
            return true;
        }
        if (node.type === 'closeAllPosition') {
            return true;
        }

        return false;
    }
};

const botFather = new BotFather();
botFather.init();
