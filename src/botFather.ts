import { BotInfo, CreateWebConfig, BOT_DATA_DIR, Node} from './botFatherConfig';
import { RateData } from './BinanceFuture';
import fs from 'fs';
import Telegram, { TelegramIdType } from './telegram';
import io from 'socket.io-client';
import { calculate, ExprArgs } from './Expr';

export class BotFather {
    private binanceSocketPort: number;
    private bybitSocketPort: number;
    private okxSocketPort: number;
    private bybitSocketFuturePort: number;
    private binanceSocketFuturePort: number;
    private webConfigServerPort: number;
    private botChildren: Array<BotInfo>;
    private telegram: Telegram;

    constructor() {
        this.binanceSocketPort = 81;
        this.bybitSocketPort = 82;
        this.okxSocketPort = 83;
        this.bybitSocketFuturePort = 84;
        this.binanceSocketFuturePort = 85;
        this.webConfigServerPort = 8080;
        this.botChildren = [];
        this.telegram = new Telegram(undefined, undefined, true);
        this.telegram.setChatID('@tintk_RSI_CCI'); //group chat

        this.connectTradeDataServer(this.binanceSocketPort);
        this.connectTradeDataServer(this.bybitSocketPort);
        this.connectTradeDataServer(this.okxSocketPort);
        this.connectTradeDataServer(this.binanceSocketFuturePort);
        this.connectTradeDataServer(this.bybitSocketFuturePort);


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
        condition = condition.toLowerCase().trim();

        const args: ExprArgs = {
            broker,
            symbol,
            timeframe,
            data
        };

        const subExprs = [...new Set([...condition.matchAll(/\{(.*?)\}/g)].map(match => match[1]))];
        for (const expr of subExprs) {
            const result = calculate(expr, args);
            condition = condition.replaceAll(`{${expr}}`, result);
        }

        if (condition.startsWith('telegram:')) {
            condition = condition.slice("telegram:".length).trim();

            console.log({ condition, symbol, timeframe });

            const emoji: { [key: string]: string } = {
                'binance': '🥇🥇🥇',
                'bybit': '',
                'okx': '🏁🏁🏁',
                'binance_future': '🥇🥇🥇',
                'bybit_future': ''
            }

            let mess = emoji[broker];
            mess += `\n${broker}:${symbol} ${timeframe}`
            mess += `\n${condition}`;

            if (condition === '<--->') mess = '--------------------';

            const ids = idTelegram.toString().split(',').map(item => item.trim());
            for (const id of ids) {
                this.telegram.sendMessage(mess, id);
            }
            return true;
        }
        else {
            const result = calculate(condition, args);
            return Boolean(result);
        }
    }
};

const botFather = new BotFather();
botFather.init();