import { BotInfo, CreateWebConfig, BOT_DATA_DIR, Node, findIndicator, extractParams, checkEval, indicatorSupported, checkParams } from './botFatherConfig';
import BinanceFuture, { RateData } from './BinanceFuture';
import * as util from './util';
import moment from 'moment';
import delay from 'delay';
import fs from 'fs';
import path from 'path';
import Telegram from './telegram';
import io from 'socket.io-client';

export class BotFather {
    private sockerTradeServerPort: number;
    private webConfigServerPort: number;
    private botChildren: Array<BotInfo>;
    private telegram: Telegram;

    constructor() {
        this.sockerTradeServerPort = 8081;
        this.webConfigServerPort = 8080;
        this.botChildren = [];
        this.telegram = new Telegram();
        this.telegram.setChatID('@tintk_RSI_CCI'); //group chat

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

        client.on("connect_error", (error: { message: any; }) => {
            console.log('connect_error - Attempting to reconnect');
            if (client.active) {
                // temporary failure, the socket will automatically try to reconnect
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                console.log(error.message);
                client.connect();
            }
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
            let { botName, symbolList, timeframes, treeData, route } = botInfo;
            if (!symbolList.includes(symbol) || !timeframes.includes(timeframe)) continue;

            this.dfs_handleLogic(route, symbol, timeframe, data);

        }
    }

    private dfs_handleLogic(node: Node, symbol: string, timeframe: string, data: RateData[]) {
        let { logic, next } = node;
        if (this.handleLogic(logic, symbol, timeframe, data)) {
            for (let child of next) {
                this.dfs_handleLogic(child, symbol, timeframe, data);
            }
        }
    }

    private handleLogic(condition: string, symbol: string, timeframe: string, data: RateData[]): boolean {
        condition = condition.toLowerCase().trim().replace(/(?<![\=<>])\=(?![\=<>])/g, '==');

        // let stringRSIs = findIndicator(condition, 'rsi');

        // for (let stringRSI of stringRSIs) {
        //     let [period, shift] = extractParams(stringRSI, 'rsi');
        //     let RSIs = util.iRSI(data, period);

        //     if (RSIs.length <= period) return false;
        //     condition = condition.replaceAll(stringRSI, `${RSIs[shift]}`);
        //     // console.log({ symbol, timeframe, rsi: RSIs[shift] });
        // }

        for (let indicator of indicatorSupported) {
            let fomulas = findIndicator(condition, indicator);
            for (let f of fomulas) {
                let params = extractParams(f);
                if (!checkParams(indicator, params)) return false;

                let value = undefined;
                switch (indicator) {
                    case 'change': {
                        let [shift = 0] = params;
                        let change: number = data[shift].close - data[shift].open;
                        value = change;
                        break;
                    }
                    case 'change%': {
                        let [shift = 0] = params;
                        let change: number = data[shift].close - data[shift].open;
                        value = change / data[shift].open * 100;
                        break;
                    }
                    case 'ampl': {
                        let [shift = 0] = params;
                        let ampl: number = data[shift].high - data[shift].low;
                        value = ampl;
                        break;
                    }
                    case 'ampl%': {
                        let [shift = 0] = params;
                        let ampl: number = data[shift].high - data[shift].low;
                        value = ampl / data[shift].open * 100;
                        break;
                    }
                    case 'upper_shadow': {
                        let [shift = 0] = params;
                        let diff: number = data[shift].high - Math.max(data[shift].open, data[shift].close);
                        value = diff
                        break;
                    }
                    case 'upper_shadow%': {
                        let [shift = 0] = params;
                        let diff: number = data[shift].high - Math.max(data[shift].open, data[shift].close);
                        value = diff / data[shift].open * 100;
                        break;
                    }
                    case 'lower_shadow': {
                        let [shift = 0] = params;
                        let diff: number = Math.min(data[shift].open, data[shift].close) - data[shift].low;
                        value = diff
                        break;
                    }
                    case 'lower_shadow%': {
                        let [shift = 0] = params;
                        let diff: number = Math.min(data[shift].open, data[shift].close) - data[shift].low;
                        value = diff / data[shift].open * 100;
                        break;
                    }
                    case 'rsi': {
                        let [period, shift = 0] = params;
                        let values = util.iRSI(data, period);
                        if (shift >= values.length) return false;
                        value = values[shift];
                        break;
                    }
                    case 'ma': {
                        let [period, shift = 0] = params;
                        let values = util.iMA(data, period);
                        if (shift >= values.length) return false;
                        value = values[shift];
                        break;
                    }
                    case 'ema': {
                        let [period, shift = 0] = params;
                        let values = util.iEMA(data, period);
                        if (shift >= values.length) return false;
                        value = values[shift];
                        break;
                    }
                    case 'macd_value': {
                        let [fastPeriod, slowPeriod, signalPeriod, shift = 0] = params;
                        let values = util.iMACD(data, fastPeriod, slowPeriod, signalPeriod);
                        if (shift >= values.length) return false;
                        value = values[shift].MACD;
                        break;
                    }
                    case 'macd_signal': {
                        let [fastPeriod, slowPeriod, signalPeriod, shift = 0] = params;
                        let values = util.iMACD(data, fastPeriod, slowPeriod, signalPeriod);
                        if (shift >= values.length) return false;
                        value = values[shift].signal;
                        break;
                    }
                    case 'macd_histogram': {
                        let [fastPeriod, slowPeriod, signalPeriod, shift = 0] = params;
                        let values = util.iMACD(data, fastPeriod, slowPeriod, signalPeriod);
                        if (shift >= values.length) return false;
                        value = values[shift].histogram;
                        break;
                    }
                    case 'bb_upper': {
                        let [period, multiplier, shift = 0] = params;
                        let values = util.iBB(data, period, multiplier);
                        if (shift >= values.length) return false;
                        value = values[shift].upper;
                        break;
                    }
                    case 'bb_middle': {
                        let [period, multiplier, shift = 0] = params;
                        let values = util.iBB(data, period, multiplier);
                        if (shift >= values.length) return false;
                        value = values[shift].middle;
                        break;
                    }
                    case 'bb_lower': {
                        let [period, multiplier, shift = 0] = params;
                        let values = util.iBB(data, period, multiplier);
                        if (shift >= values.length) return false;
                        value = values[shift].lower;
                        break;
                    }
                }

                if (value === undefined) return false;


                condition = condition.replaceAll(f, `${value}`);
            }
        }


        if (condition.startsWith('telegram:')) {
            condition = condition.slice("telegram:".length).trim().replaceAll('==', '=');

            console.log({ condition, symbol, timeframe });
            let mess = `${symbol} ${timeframe}`
            mess += `\n${condition}`;
            this.telegram.sendMessage(mess);
            return true;
        }

        try {
            return checkEval(condition);
        }
        catch (err) {
            return false;
        }
    }

};

let botFather = new BotFather();
botFather.init();