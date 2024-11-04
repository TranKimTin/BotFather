import fs from 'fs';
import Telegram from './common/telegram';
import io from 'socket.io-client';
import { calculate } from './common/Expr';
import { BotInfo, ExprArgs, Node, NodeData, RateData, SocketInfo, SymbolListener, TelegramIdType } from './common/Interface';
import * as mysql from './WebConfig/lib/mysql';

export class BotFather {
    private socketList: Array<SocketInfo>;

    private botChildren: Array<BotInfo>;
    private telegram: Telegram;

    constructor() {
        this.socketList = [];

        this.botChildren = [];
        this.telegram = new Telegram(undefined, undefined, true);
        this.telegram.setChatID('@tintk_RSI_CCI'); //group chat

        this.connectTradeDataServer('binance', 81);
        this.connectTradeDataServer('bybit', 82);
        this.connectTradeDataServer('okx', 83);
        this.connectTradeDataServer('bybit_future', 84);
        this.connectTradeDataServer('binance_future', 85);

        this.connectToWebConfig(8080);

        this.initBotChildren();
    }

    private connectTradeDataServer(name: string, port: number) {
        const client = io(`http://localhost:${port}`, {
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
        const client = io(`http://localhost:${port}`, {
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
        this.botChildren = [];

        const botList: Array<any> = await mysql.query(`SELECT botName, idTelegram, route, symbolList, timeframes, treeData FROM Bot`);
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

    private async onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
        if (broker === 'binance' && symbol === 'BTCUSDT') console.log('onCloseCandle', { broker, symbol, timeframe })
        for (const botInfo of this.botChildren) {
            const { botName, idTelegram, symbolList, timeframes, treeData, route } = botInfo;

            if (!timeframes.includes(timeframe) || !symbolList.includes(`${broker}:${symbol}`)) continue;

            // console.log("onCloseCandle", { symbol, timeframe });

            const visited: { [key: string]: boolean } = {};
            this.dfs_handleLogic(route, broker, symbol, timeframe, data, idTelegram, visited);

        }
    }

    private dfs_handleLogic(node: Node, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType, visited: { [key: string]: boolean }) {
        const { id, next } = node;
        const nodeData = node.data;

        if (visited[id] === true) return;
        visited[id] = true;
        if (this.handleLogic(nodeData, broker, symbol, timeframe, data, idTelegram)) {
            for (const child of next) {
                this.dfs_handleLogic(child, broker, symbol, timeframe, data, idTelegram, visited);
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

    private handleLogic(nodeData: NodeData, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType): boolean {
        if (nodeData.type === 'start') return true;

        const args: ExprArgs = {
            broker,
            symbol,
            timeframe,
            data
        };

        if (nodeData.type === 'expr') {
            if (!nodeData.value) return false;

            let expr = nodeData.value.toLowerCase().trim();
            expr = this.calculateSubExpr(expr, args);

            const result = calculate(expr, args);
            return Boolean(result);
        }

        if (nodeData.type === 'telegram') {
            if (!nodeData.value) return false;

            let content: string = nodeData.value.trim();
            content = this.calculateSubExpr(content, args);

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
        if (nodeData.type === 'openBuyMarket') {
            return true;
        }
        if (nodeData.type === 'openBuyLimit') {
            return true;
        }
        if (nodeData.type === 'openBuyStopMarket') {
            return true;
        }
        if (nodeData.type === 'openBuyStopLimit') {
            return true;
        }
        if (nodeData.type === 'openSellMarket') {
            return true;
        }
        if (nodeData.type === 'openSellLimit') {
            return true;
        }
        if (nodeData.type === 'openSellStopMarket') {
            return true;
        }
        if (nodeData.type === 'openSellStopLimit') {
            return true;
        }
        if (nodeData.type === 'closeAllOrder') {
            return true;
        }
        if (nodeData.type === 'closeAllPosition') {
            return true;
        }

        return false;
    }
};

const botFather = new BotFather();
botFather.init();
