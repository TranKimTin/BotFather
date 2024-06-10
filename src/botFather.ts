import { BotInfo, CreateWebConfig, BOT_DATA_DIR } from './botFatherConfig';
import BinanceFuture, { RateData } from './BinanceFuture';
import * as util from './util';
import moment from 'moment';
import delay from 'delay';
import fs from 'fs';
import path from 'path';
const io = require('socket.io-client');

export class BotFather {
    private sockerTradeServerPort: number;
    private webConfigServerPort: number;
    private botChildren: Array<BotInfo>;

    constructor() {
        this.sockerTradeServerPort = 8081;
        this.webConfigServerPort = 8080;
        this.botChildren = [];

        this.connectTradeDataServer(this.sockerTradeServerPort);
        CreateWebConfig(this.webConfigServerPort, this.initBotChildren.bind(this));
        this.initBotChildren();
    }

    private connectTradeDataServer(port: number) {
        let client = io(`http://localhost:${port}`, {
            reconnection: true,              // Bật tính năng tự động kết nối lại (mặc định là true)
            reconnectionAttempts: Infinity,  // Số lần thử kết nối lại tối đa (mặc định là vô hạn)
            reconnectionDelay: 1000,         // Thời gian chờ ban đầu trước khi thử kết nối lại (ms)
            reconnectionDelayMax: 5000,      // Thời gian chờ tối đa giữa các lần thử kết nối lại (ms)
            randomizationFactor: 0.5         // Yếu tố ngẫu nhiên trong thời gian chờ kết nối lại
        });

        client.on('connect', () => {
            console.log('Connected to server');

            client.on('disconnect', (reason: string) => {
                console.log(`onDisconnect - Disconnected from server. reason: ${reason}`);
                if (reason === 'io server disconnect') {
                    // Server ngắt kết nối, cần phải kết nối lại thủ công
                    client.connect();
                }
            });

            client.on('reconnect', () => {
                console.log('Attempting to reconnect');
            });

            client.on('onCloseCandle', (msg: string) => {
                try {
                    let { symbol, timeframe, data } = JSON.parse(msg.toString());
                    this.onCloseCandle(symbol, timeframe, data);
                }
                catch (err) {
                    console.log(err);
                }
            })
        });
    }

    private initBotChildren(botName?: string) {
        this.botChildren = [];
        let botFileList = fs.readdirSync(BOT_DATA_DIR);
        for (let botFile of botFileList) {
            if (botFile.endsWith('.json')) {
                let botInfo: BotInfo = JSON.parse(fs.readFileSync(`${BOT_DATA_DIR}/${botFile}`).toString());
                this.botChildren.push(botInfo);
            }
        }
    }

    public async init() {
        console.log('BotFather init');
    }

    private async onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {
        for (let botInfo of this.botChildren) {
            let { botName, symbolList, timeframes, treeData } = botInfo;
            if (!symbolList.includes(symbol) || !timeframes.includes(timeframe)) continue;
        }
    }

};

let botFather = new BotFather();
botFather.init();