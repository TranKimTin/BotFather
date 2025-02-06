import fs from 'fs';
import Telegram from './common/telegram';
import io from 'socket.io-client';
import { BotInfo, RateData, WorkerData } from './common/Interface';
import * as mysql from './WebConfig/lib/mysql';
import * as util from './common/util';
import { StaticPool } from 'node-worker-threads-pool';
import { BinanceSocket } from './SocketServer/socket_binance';
import { BinanceFutureSocket } from './SocketServer/socket_binance_future';
import { BybitSocket } from './SocketServer/socket_bybit';
import { BybitFutureSocket } from './SocketServer/socket_bybit_future';
import { OkxSocket } from './SocketServer/socket_okx';
import os from 'os';
import dotenv from 'dotenv';
import { SocketData } from './SocketServer/socket_data';

dotenv.config({ path: `${__dirname}/../.env` });


export class BotFather {
    private socketList: Array<SocketData>;
    private botChildren: Array<BotInfo>;
    private telegram: Telegram;
    private botIDs: { [key: string]: number };
    private hostWebServer: string;
    private worker;
    private symbolListener: { [key: string]: boolean };


    constructor() {
        this.botChildren = [];
        this.telegram = new Telegram(undefined, undefined, true);
        this.botIDs = {};
        this.symbolListener = {};
        this.socketList = [
            new BinanceSocket(this.onCloseCandle.bind(this)),
            new BinanceFutureSocket(this.onCloseCandle.bind(this)),
            new BybitSocket(this.onCloseCandle.bind(this)),
            new BybitFutureSocket(this.onCloseCandle.bind(this)),
            new OkxSocket(this.onCloseCandle.bind(this))
        ];
        this.connectSocketServer();
        this.hostWebServer = process.env.HOST_WEB_SERVER || 'http://localhost';
        this.worker = new StaticPool({
            size: os.cpus().length,
            task: './worker.js'
        });

        this.connectToWebConfig(8080);

        this.initBotChildren();
    }

    private connectSocketServer() {
        for (let item of this.socketList) {
            item.initData();
        }
    }

    private async onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
        try {
            const key = `${broker}:${symbol}:${timeframe}`;
            if (!this.symbolListener[key]) return;

            console.log('onCloseCandle', broker, symbol, timeframe, 'runtime=', -1);

            const workerData: WorkerData = { broker, symbol, timeframe, data };
            // const runtime = await this.worker.exec(workerData);
            // console.log('onCloseCandle', broker, symbol, timeframe, 'runtime=', runtime);
        }
        catch (err) {
            console.error(err);
        }
    }

    private connectToWebConfig(port: number) {
        const client = io(`${this.hostWebServer}:${port}`, {
            reconnection: true,              // Bật tính năng tự động kết nối lại (mặc định là true)
            reconnectionAttempts: Infinity,  // Số lần thử kết nối lại tối đa (mặc định là vô hạn)
            reconnectionDelay: 1000,         // Thời gian chờ ban đầu trước khi thử kết nối lại (ms)
            reconnectionDelayMax: 5000,      // Thời gian chờ tối đa giữa các lần thử kết nối lại (ms)
            randomizationFactor: 0.5,         // Yếu tố ngẫu nhiên trong thời gian chờ kết nối lại,
            transports: ['websocket', 'polling']
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
            console.error(`connect_error - Attempting to reconnect web config :${port}`, error.message);
            if (client.active) {
            } else {
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

        this.symbolListener = {};

        for (const bot of this.botChildren) {
            for (const timeframe of bot.timeframes) {
                for (const s of bot.symbolList) {
                    const [broker, symbol] = s.split(':');
                    const key = `${broker}:${symbol}:${timeframe}`;
                    this.symbolListener[key] = true;
                }
            }
        }

        fs.writeFileSync('temp.txt', new Date().getTime().toString());
        console.log('init bot list', this.botChildren.length);
    }

    public async init() {
        console.log('BotFather init');
    }

};

const botFather = new BotFather();
botFather.init();
