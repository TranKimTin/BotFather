import Telegram from './common/telegram';
import io from 'socket.io-client';
import * as mysql from './WebConfig/lib/mysql';
import dotenv from 'dotenv';
import { BotInfo } from './common/Interface';
import os from 'os';
import * as util from './common/util';
import delay from 'delay';
import { Worker } from "worker_threads";


dotenv.config({ path: `${__dirname}/../.env` });


export class BotFather {
    private telegram: Telegram;
    private hostWebServer: string;
    private workerList: Array<Worker>;
    private botChildren: Array<BotInfo>;
    private botIDs: { [key: string]: number };
    private symbolListener: { [key: string]: boolean };

    constructor() {
        this.telegram = new Telegram(undefined, undefined, true);
        this.hostWebServer = process.env.HOST_WEB_SERVER || 'http://localhost';
        this.botChildren = [];
        this.botIDs = {};
        this.symbolListener = {};

        const brokers = ['binance_future', 'binance', 'bybit', 'bybit_future', 'okx'];
        this.workerList = [];
        this.updateWorker().then(() => {
            for (const broker of brokers) {
                this.initWorker(broker);
            }
        });
        this.connectToWebConfig(8080);
    }

    private createWorker(index: number, args: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./worker_socket.js');
            this.workerList[index] = worker;

            worker.on("message", (msg: any) => {
                resolve(msg);
            });

            worker.on("error", (err: any) => {
                console.error(`worker ${index} error`, err);
                reject(err);
            });

            worker.on("exit", (code: any) => {
                console.log(`worker ${index} closed code:${code}`);
                console.log(`restart worker ${index}`);
                this.createWorker(index, args);
            });

            worker.postMessage(args);
        });
    }

    private async initWorker(broker: string) {
        let symbolList: Array<string> = [];

        if (broker === 'binance_future') {
            symbolList = await util.getBinanceFutureSymbolList();
        }
        else if (broker === 'binance') {
            symbolList = await util.getBinanceSymbolList();
        }
        else if (broker === 'bybit') {
            symbolList = await util.getBybitSymbolList();
        }
        else if (broker === 'bybit_future') {
            symbolList = await util.getBybitFutureSymbolList();
        }
        else if (broker === 'okx') {
            symbolList = await util.getOkxSymbolList();
        }

        const threads = os.cpus().length;
        console.log(`initWorker ${broker} with ${threads} threads, symbolList.length = ${symbolList.length}`);

        const block = Math.ceil(symbolList.length / threads);
        this.workerList = new Array(threads);
        for (let i = 0; i < threads; i++) {
            try {
                const subSymbols = symbolList.slice(i * block, (i + 1) * block);
                const args = {
                    type: 'init',
                    value: {
                        broker,
                        symbolList: subSymbols,
                        id: `${i + 1}/${threads}`,
                        botChildren: this.botChildren,
                        botIDs: this.botIDs,
                        symbolListener: this.symbolListener
                    }
                }
                const runtime = await this.createWorker(i, args);
                console.log(`init ${broker} ${args.value.id} done runtime=${runtime}`);

                await delay(2000);
            }
            catch (err) {
                console.error(err);
            }
        }
    }

    private async updateWorker() {
        const botList: Array<any> = await mysql.query(`SELECT id, botName, idTelegram, route, symbolList, timeframes, treeData FROM Bot`);
        this.botChildren = [];
        this.botIDs = {};
        for (const bot of botList) {
            const botInfo: BotInfo = {
                botName: bot.botName,
                idTelegram: bot.idTelegram,
                route: JSON.parse(bot.route),
                symbolList: JSON.parse(bot.symbolList),
                timeframes: JSON.parse(bot.timeframes),
                treeData: JSON.parse(bot.treeData)
            };
            botInfo.symbolList.sort();
            this.botChildren.push(botInfo);
            this.botIDs[bot.botName] = bot.id;
        }

        this.symbolListener = {};
        for (const bot of this.botChildren) {
            for (const timeframe of bot.timeframes) {
                for (const s of bot.symbolList) {
                    const [broker, symbol] = s.split(':');
                    const key = `${broker}_${symbol}_${timeframe}`;
                    this.symbolListener[key] = true;
                }
            }
        }

        console.log('init bot list', this.botChildren.length);

        for (const worker of this.workerList) {
            await worker?.postMessage({ type: 'update', value: { symbolListener: this.symbolListener, botChildren: this.botChildren, botIDs: this.botIDs } });
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
            this.updateWorker();
        });

        client.on('onUpdateConfig', (botName: string) => {
            console.log('onUpdateConfig', botName);
            this.updateWorker();
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

    public async init() {
        console.log('BotFather init');
    }
};

const botFather = new BotFather();
botFather.init();
