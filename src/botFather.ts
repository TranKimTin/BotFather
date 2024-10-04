import { BotInfo, CreateWebConfig, BOT_DATA_DIR, Node, findIndicator, extractParams, checkEval, indicatorSupported, checkParams } from './botFatherConfig';
import { RateData } from './BinanceFuture';
import * as util from './util';
import fs from 'fs';
import Telegram, { TelegramIdType } from './telegram';
import io from 'socket.io-client';
import moment from 'moment';

export class BotFather {
    private binanceSocketPort: number;
    private bybitSocketPort: number;
    private okxSocketPort: number;
    private webConfigServerPort: number;
    private botChildren: Array<BotInfo>;
    private telegram: Telegram;

    constructor() {
        this.binanceSocketPort = 81;
        this.bybitSocketPort = 82;
        this.okxSocketPort = 83;
        this.webConfigServerPort = 8080;
        this.botChildren = [];
        this.telegram = new Telegram(undefined, undefined, true);
        this.telegram.setChatID('@tintk_RSI_CCI'); //group chat

        this.connectTradeDataServer(this.binanceSocketPort);
        this.connectTradeDataServer(this.bybitSocketPort);
        this.connectTradeDataServer(this.okxSocketPort);

        CreateWebConfig(this.webConfigServerPort, this.initBotChildren.bind(this));
        this.initBotChildren();
    }

    private connectTradeDataServer(port: number) {
        const client = io(`http://localhost:${port}`, {
            reconnection: true,              // Bật tính năng tự động kết nối lại (mặc định là true)
            reconnectionAttempts: Infinity,  // Số lần thử kết nối lại tối đa (mặc định là vô hạn)
            reconnectionDelay: 1000,         // Thời gian chờ ban đầu trước khi thử kết nối lại (ms)
            reconnectionDelayMax: 5000,      // Thời gian chờ tối đa giữa các lần thử kết nối lại (ms)
            randomizationFactor: 0.5         // Yếu tố ngẫu nhiên trong thời gian chờ kết nối lại
        });

        client.on('connect', () => {
            console.log(`Connected to server ${port}`);
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
            console.log(`onDisconnect - Disconnected from server ${port}. reason: ${reason}`);
        });

        client.on("connect_error", (error: { message: any; }) => {
            console.log(`connect_error - Attempting to reconnect ${port}`);
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
        const botFileList = fs.readdirSync(BOT_DATA_DIR);
        for (const botFile of botFileList) {
            if (botFile.endsWith('.json')) {
                const botInfo: BotInfo = JSON.parse(fs.readFileSync(`${BOT_DATA_DIR}/${botFile}`).toString());
                this.botChildren.push(botInfo);
            }
        }
    }

    public async init() {
        console.log('BotFather init');
    }

    private async onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
        for (const botInfo of this.botChildren) {
            const { botName, idTelegram, symbolList, timeframes, treeData, route } = botInfo;

            if (!timeframes.includes(timeframe) || !symbolList.includes(`${broker}:${symbol}`)) continue;

            // console.log("onCloseCandle", { symbol, timeframe });

            const visited: { [key: string]: boolean } = {};
            this.dfs_handleLogic(route, broker, symbol, timeframe, data, idTelegram, visited);

        }
    }

    private dfs_handleLogic(node: Node, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType, visited: { [key: string]: boolean }) {
        const { logic, id, next } = node;
        if (visited[id] === true) return;
        visited[id] = true;
        if (this.handleLogic(logic, broker, symbol, timeframe, data, idTelegram)) {
            for (const child of next) {
                this.dfs_handleLogic(child, broker, symbol, timeframe, data, idTelegram, visited);
            }
        }
    }

    private handleLogic(condition: string, broker: string, symbol: string, timeframe: string, data: RateData[], idTelegram: TelegramIdType): boolean {
        condition = condition.toLowerCase().trim().replace(/(?<![\=<>])\=(?![\=<>])/g, '==');

        for (let indicator of indicatorSupported) {
            const fomulas = findIndicator(condition, indicator);

            for (const f of fomulas) {
                const params = extractParams(f);

                if (!checkParams(indicator, params)) {
                    if (condition.startsWith('telegram:')) {
                        continue;
                    }
                    else {
                        return false;
                    }
                }

                let value = undefined;
                switch (indicator) {
                    case 'broker': {
                        value = `'${broker.toLocaleLowerCase()}'`;
                        break;
                    }
                    case 'symbol': {
                        value = `'${symbol.toLocaleLowerCase()}'`;
                        break;
                    }
                    case 'timeframe': {
                        value = `'${timeframe.toLocaleLowerCase()}'`;
                        break;
                    }
                    case 'hour': {
                        value = +moment.utc(data[0].startTime).format('HH');
                        break;
                    }
                    case 'minute': {
                        value = +moment.utc(data[0].startTime).format('mm');
                        break;
                    }
                    case 'open': {
                        const [shift = 0] = params;
                        value = data[shift].open;
                        break;
                    }
                    case 'high': {
                        const [shift = 0] = params;
                        value = data[shift].high;
                        break;
                    }
                    case 'low': {
                        const [shift = 0] = params;
                        value = data[shift].low;
                        break;
                    }
                    case 'close': {
                        const [shift = 0] = params;
                        value = data[shift].close;
                        break;
                    }
                    case 'volume': {
                        const [shift = 0] = params;
                        value = data[shift].volume;
                        break;
                    }
                    case 'volume24h_in_usd': {
                        let volume: number = 0;
                        for (let i = 0; i < data.length; i++) {
                            volume += data[i].volume * data[i].close;
                            if ((data[i].startTime - data[0].startTime) / (60 * 60 * 1000) >= 24) {
                                break;
                            }
                        }
                        value = volume;
                        break;
                    }
                    case 'change': {
                        const [shift = 0] = params;
                        const change: number = data[shift].close - data[shift].open;
                        value = change;
                        break;
                    }
                    case 'change%': {
                        const [shift = 0] = params;
                        const change: number = data[shift].close - data[shift].open;
                        value = +(change / data[shift].open * 100).toFixed(2);
                        break;
                    }
                    case 'ampl': {
                        const [shift = 0] = params;
                        const ampl: number = data[shift].high - data[shift].low;
                        value = ampl;
                        break;
                    }
                    case 'ampl%': {
                        const [shift = 0] = params;
                        const ampl: number = data[shift].high - data[shift].low;
                        value = +(ampl / data[shift].open * 100).toFixed(2);
                        break;
                    }
                    case 'upper_shadow': {
                        const [shift = 0] = params;
                        const diff: number = data[shift].high - Math.max(data[shift].open, data[shift].close);
                        value = diff
                        break;
                    }
                    case 'upper_shadow%': {
                        const [shift = 0] = params;
                        const diff: number = data[shift].high - Math.max(data[shift].open, data[shift].close);
                        value = +(diff / data[shift].open * 100).toFixed(2);
                        break;
                    }
                    case 'lower_shadow': {
                        const [shift = 0] = params;
                        const diff: number = Math.min(data[shift].open, data[shift].close) - data[shift].low;
                        value = diff
                        break;
                    }
                    case 'lower_shadow%': {
                        const [shift = 0] = params;
                        const diff: number = Math.min(data[shift].open, data[shift].close) - data[shift].low;
                        value = +(diff / data[shift].open * 100).toFixed(2);
                        break;
                    }
                    case 'rsi': {
                        const [period, shift = 0] = params;
                        const values = util.iRSI(data, period);
                        if (shift >= values.length) return false;
                        value = values[shift];
                        break;
                    }
                    case 'rsi_slope': {
                        const [period, shift = 0] = params;
                        const RSIs = util.iRSI(data, period);
                        if (shift >= RSIs.length - 1) return false;

                        const diffRSI = RSIs[shift] - RSIs[shift + 1];
                        const wide = 3;

                        const tan = diffRSI / wide;
                        const slope = Math.atan(tan);
                        value = Math.round(slope / Math.PI * 180);

                        break;
                    }
                    case 'ma': {
                        const [period, shift = 0] = params;
                        const values = util.iMA(data, period);
                        if (shift >= values.length) return false;
                        value = values[shift];
                        break;
                    }
                    case 'ema': {
                        const [period, shift = 0] = params;
                        const values = util.iEMA(data, period);
                        if (shift >= values.length) return false;
                        value = values[shift];
                        break;
                    }
                    case 'macd_value': {
                        const [fastPeriod, slowPeriod, signalPeriod, shift = 0] = params;
                        const values = util.iMACD(data, fastPeriod, slowPeriod, signalPeriod);
                        if (shift >= values.length) return false;
                        if (fastPeriod >= slowPeriod) return false;
                        value = values[shift].MACD;
                        break;
                    }
                    case 'macd_signal': {
                        const [fastPeriod, slowPeriod, signalPeriod, shift = 0] = params;
                        const values = util.iMACD(data, fastPeriod, slowPeriod, signalPeriod);
                        if (shift >= values.length) return false;
                        if (fastPeriod >= slowPeriod) return false;
                        value = values[shift].signal;
                        break;
                    }
                    case 'macd_histogram': {
                        const [fastPeriod, slowPeriod, signalPeriod, shift = 0] = params;
                        const values = util.iMACD(data, fastPeriod, slowPeriod, signalPeriod);
                        if (shift >= values.length) return false;
                        if (fastPeriod >= slowPeriod) return false;
                        value = values[shift].histogram;
                        break;
                    }
                    case 'bb_upper': {
                        const [period, multiplier, shift = 0] = params;
                        const values = util.iBB(data, period, multiplier);
                        if (shift >= values.length) return false;
                        value = values[shift].upper;
                        break;
                    }
                    case 'bb_middle': {
                        const [period, multiplier, shift = 0] = params;
                        const values = util.iBB(data, period, multiplier);
                        if (shift >= values.length) return false;
                        value = values[shift].middle;
                        break;
                    }
                    case 'bb_lower': {
                        const [period, multiplier, shift = 0] = params;
                        const values = util.iBB(data, period, multiplier);
                        if (shift >= values.length) return false;
                        value = values[shift].lower;
                        break;
                    }
                    case 'rsi_phan_ki': {
                        const [period, deviation, depth, numberOfPeaks, minhDiff, maxRSI, shift = 0] = params;
                        const rates = data.slice(shift);
                        const RSIs = util.iRSI(data, period);
                        const fakeData = RSIs.filter(item => item).map(item => ({ high: item, low: item } as RateData));

                        let zigzag = util.iZigZag(fakeData, deviation, depth, false);

                        //downtrend
                        //rsi đáy sau cao hơn đáy trước
                        //giá sau thấp hơn giá trước
                        //tạo đủ numberOfPeaks đáy thỏa mãn
                        //rsi <= 30
                        if (zigzag.length < numberOfPeaks * 2) return false;
                        if (zigzag[0].trend != -1) return false;
                        if (zigzag[0].lowIndex != 1) return false;
                        for (let i = 0; i < numberOfPeaks - 1; i++) {
                            const lowIndex = zigzag[i * 2].lowIndex;
                            const preLowIndex = zigzag[(i + 1) * 2].lowIndex;
                            if (RSIs[lowIndex] - RSIs[preLowIndex] <= minhDiff) return false;
                            if (RSIs[lowIndex] > maxRSI) return false;
                            if (RSIs[preLowIndex] > maxRSI) return false;
                            if (rates[lowIndex].close >= rates[preLowIndex].close) return false;
                        }
                        value = 1;
                        console.log('rsi phan ki', { symbol, timeframe });
                        for (let i = 0; i < numberOfPeaks; i++) {
                            const lowIndex = zigzag[i].lowIndex;
                            const highIndex = zigzag[i].highIndex;
                            if (zigzag[i].trend == 1) {
                                console.log(`${rates[lowIndex].timestring} => ${rates[highIndex].timestring}`);
                            }
                            else {
                                console.log(`${rates[highIndex].timestring} => ${rates[lowIndex].timestring}`);
                            }
                        }
                        break;
                    }

                    case 'macd_n_dinh': {
                        //macd sau < macd trước
                        //giá sai > giá trước
                        const [fastPeriod, slowPeriod, signalPeriod, redDepth, depth, enableDivergence, diffCandle0, shift] = params;
                        const diffPercents = params.slice(7);
                        if (diffPercents.length === 0) diffPercents.push(-99999);

                        const values = util.iMACD(data, fastPeriod, slowPeriod, signalPeriod);
                        if (shift >= values.length - 1) return false;
                        if (fastPeriod >= slowPeriod) return false;

                        let i = shift;
                        let cnt = 0;
                        let n = 0;
                        let indexMaxMACD = i, preIndexMaxMACD = i;
                        let indexMaxPrice = i, preIndexMaxPrice = i;

                        {
                            while (i < values.length - 1) {
                                if (values[i].MACD <= 0) { break; };
                                if (values[i].signal <= 0) { break; };
                                if (values[i].histogram >= 0) break;
                                if (values[i].MACD > values[indexMaxMACD].MACD) {
                                    indexMaxMACD = i;
                                }
                                if (data[i].high > data[indexMaxPrice].high) {
                                    indexMaxPrice = i;
                                }
                                i++;
                            }

                            cnt = 0;
                            let check = 0;
                            while (i < values.length - 1) {
                                if (values[i].MACD <= 0) { check = 3; break; }
                                if (values[i].signal <= 0) { check = 3; break; }
                                if (values[i].histogram < 0) break;
                                if (values[i].MACD > values[indexMaxMACD].MACD) {
                                    indexMaxMACD = i;
                                }
                                if (data[i].high > data[indexMaxPrice].high) {
                                    indexMaxPrice = i;
                                }

                                cnt++;
                                i++;

                            }
                            if (check === 3) {
                                while (i < values.length - 1) {
                                    if (values[i].histogram < 0) break;
                                    cnt++;
                                    if (values[i].MACD > values[indexMaxMACD].MACD) {
                                        indexMaxMACD = i;
                                    }
                                    if (data[i].high > data[indexMaxPrice].high) {
                                        indexMaxPrice = i;
                                    }
                                    i++;
                                }
                            }

                            const topCandle = Math.max(data[indexMaxPrice].open, data[indexMaxPrice].close);

                            if (indexMaxPrice != shift && (topCandle - data[shift].high) / topCandle > diffCandle0 / 100) {
                                value = 0;
                                break;
                            }

                            n++;
                            if (cnt < depth) {
                                n--;
                            }
                            if (check === 3) {
                                value = n;
                                break;
                            }
                        }


                        preIndexMaxMACD = i;
                        preIndexMaxPrice = i;
                        for (; i < values.length - 1; i++) {
                            cnt = 0;
                            let cntRed = 0;
                            let check = 0;
                            while (i < values.length - 1) {
                                if (values[i].MACD <= 0) { check = 1; break; };
                                if (values[i].signal <= 0) { check = 1; break; };
                                if (values[i].histogram >= 0) break;
                                if (values[i].MACD > values[preIndexMaxMACD].MACD) {
                                    preIndexMaxMACD = i;
                                }
                                if (data[i].high > data[preIndexMaxPrice].high) {
                                    preIndexMaxPrice = i;
                                }

                                cntRed++;
                                i++;

                            }

                            if (check === 1) {
                                value = n;
                                break;
                            }
                            // if (check === 2) {
                            //     value = 0;
                            //     break;
                            // }

                            cnt = 0;
                            while (i < values.length - 1) {
                                if (values[i].MACD <= 0) { check = 3; break; }
                                if (values[i].signal <= 0) { check = 3; break; }
                                if (values[i].histogram < 0) break;
                                if (values[i].MACD > values[preIndexMaxMACD].MACD) {
                                    preIndexMaxMACD = i;
                                }
                                if (data[i].high > data[preIndexMaxPrice].high) {
                                    preIndexMaxPrice = i;
                                }

                                cnt++;
                                i++;

                            }

                            if (check === 3) {
                                while (i < values.length - 1) {
                                    if (values[i].histogram < 0) break;
                                    if (values[i].MACD > values[preIndexMaxMACD].MACD) {
                                        preIndexMaxMACD = i;
                                    }
                                    if (data[i].high > data[preIndexMaxPrice].high) {
                                        preIndexMaxPrice = i;
                                    }

                                    cnt++;
                                    i++;
                                }
                            }
                            // console.log({ enableDivergence, preIndexMaxMACD, indexMaxMACD, m1: values[preIndexMaxMACD], m2: values[indexMaxMACD], indexMaxPrice, preIndexMaxPrice, p: data[preIndexMaxPrice], p2: data[indexMaxPrice], diff: diffPercents[0] });

                            if (enableDivergence === 1 && values[preIndexMaxMACD].MACD <= values[indexMaxMACD].MACD) {
                                value = n;
                                break;
                            }
                            if (data[indexMaxPrice].high - data[preIndexMaxPrice].high <= data[preIndexMaxPrice].high * diffPercents[0] / 100) {
                                value = n;
                                break;
                            }
                            if (diffPercents.length > 1) diffPercents.shift();
                            indexMaxMACD = preIndexMaxMACD;
                            indexMaxPrice = preIndexMaxPrice;

                            preIndexMaxMACD = i;
                            preIndexMaxPrice = i;

                            n++;
                            if (cnt < depth || cntRed < redDepth) {
                                n--;
                            }

                            if (check === 3) {
                                value = n;
                                break;
                            }
                        }

                        break;
                    }
                    case 'macd_slope': {
                        const [fastPeriod, slowPeriod, signalPeriod, shift = 0] = params;
                        const MACDs = util.iMACD(data, fastPeriod, slowPeriod, signalPeriod);
                        if (shift >= MACDs.length) return false;
                        if (fastPeriod >= slowPeriod) return false;

                        const MASignals = util.iMA(MACDs.map(item => ({ close: item.MACD } as RateData)), slowPeriod);
                        if (shift >= MASignals.length - 1) return false;

                        const diffMACD = MACDs[shift].MACD - MACDs[shift + 1].MACD;
                        const diffMASignal = Math.abs(MASignals[shift] - MASignals[shift + 1])

                        const tan = diffMACD / diffMASignal;
                        const slope = Math.atan(tan);
                        value = Math.round(slope / Math.PI * 180);

                        break;
                    }

                    case 'bearish_engulfing': {
                        const [shift = 0] = params;
                        if (shift >= data.length - 2) return false;
                        value = util.isBearishEngulfing(data[shift + 1], data[shift]) ? 1 : 0;
                        break;
                    }
                    case 'bullish_engulfing': {
                        const [shift = 0] = params;
                        if (shift >= data.length - 1) return false;
                        value = util.isBullishEngulfing(data[shift + 1], data[shift]) ? 1 : 0;
                        break;
                    }
                    case 'bullish_hammer': {
                        const [shift = 0] = params;
                        if (shift >= data.length - 1) return false;
                        value = util.isBullishHammer(data[shift]) ? 1 : 0;
                        break;
                    }
                    case 'bearish_hammer': {
                        const [shift = 0] = params;
                        if (shift >= data.length - 1) return false;
                        value = util.isBearishHammer(data[shift]) ? 1 : 0;
                        break;
                    }
                    case 'bullish': {
                        const [shift = 0] = params;
                        if (shift > data.length - 5) return false;
                        value = util.isBullish(data, shift) ? 1 : 0;
                        break;
                    }
                    case 'bearish': {
                        const [shift = 0] = params;
                        if (shift > data.length - 5) return false;
                        value = util.isBearish(data, shift) ? 1 : 0;
                        break;
                    }
                    case 'marsi': {
                        const [periodRSI, periodMA, shift = 0] = params;
                        const RSIs = util.iRSI(data, periodRSI);
                        const fakeData = RSIs.map(item => ({ close: item } as RateData));
                        const MARSIs = util.iMA(fakeData, periodMA);

                        if (shift >= MARSIs.length) return false;
                        value = MARSIs[shift];
                        break;
                    }
                    default:
                        break;
                }

                if (value === undefined) return false;


                condition = condition.replaceAll(f, `${value}`);
            }
        }


        if (condition.startsWith('telegram:')) {
            condition = condition.slice("telegram:".length).trim().replaceAll('==', '=');

            console.log({ condition, symbol, timeframe });

            const emoji: { [key: string]: string } = {
                'binance': '🥇🥇🥇',
                'bybit': '',
                'okx': '🏁🏁🏁'
            }

            let mess = emoji[broker];
            mess += `\n${broker}:${symbol} ${timeframe}`
            mess += `\n${condition}`;

            if (condition === '<--->') mess = '--------------------';
            this.telegram.sendMessage(mess, idTelegram);
            return true;
        }

        try {
            return checkEval(condition);
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }

};

const botFather = new BotFather();
botFather.init();