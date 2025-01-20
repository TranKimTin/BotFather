import fs from 'fs';
import Telegram from './common/telegram';
import io from 'socket.io-client';
import { calculate, calculateSubExpr } from './common/Expr';
import { BotInfo, ExprArgs, NODE_TYPE, Node, NodeData, ORDER_STATUS, RateData, SocketInfo, SymbolListener, TelegramIdType, UNIT } from './common/Interface';
import * as mysql from './WebConfig/lib/mysql';
import * as util from './common/util';
import { StaticPool } from 'node-worker-threads-pool';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../.env` });


export class BotFather {
    private socketList: Array<SocketInfo>;

    private botChildren: Array<BotInfo>;
    private telegram: Telegram;
    private botIDs: { [key: string]: number };
    private hostWebServer: string;
    private worker;


    constructor() {
        this.socketList = [];

        this.botChildren = [];
        this.telegram = new Telegram(undefined, undefined, true);
        this.botIDs = {};
        this.hostWebServer = process.env.HOST_WEB_SERVER || 'http://localhost';
        this.worker = new StaticPool({
            size: os.cpus().length,
            task: './worker.js'
        });

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
                if (!broker || !symbol || !timeframe || !data) return;

                const startTime = new Date().getTime();
                this.onCloseCandle(broker, symbol, timeframe, data);
                const endTime = new Date().getTime();
                console.log('onCloseCandle', broker, symbol, timeframe, 'runtime=', endTime - startTime);

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
        }

        fs.writeFileSync('temp.txt', new Date().getTime().toString());
        console.log('init bot list', this.botChildren.length);
    }

    public async init() {
        console.log('BotFather init');
    }

    private onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
        this.worker.exec(broker, symbol, timeframe, data);
    }

};

const botFather = new BotFather();
botFather.init();
