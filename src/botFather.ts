import { BotInfo, CreateWebConfig, BOT_DATA_DIR, Node, NodeData } from './botFatherConfig';
import { RateData } from './BinanceFuture';
import fs from 'fs';
import Telegram, { TelegramIdType } from './telegram';
import io, { Socket } from 'socket.io-client';
import { calculate, ExprArgs } from './Expr';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface SocketInfo {
    name: string;
    port: number;
    client: Socket<DefaultEventsMap, DefaultEventsMap>,
}

export interface SymbolListener {
    symbol: string,
    broker: string
    timeframe: string,
}

export class BotFather {
    private socketList: Array<SocketInfo>;

    private webConfigServerPort: number;
    private botChildren: Array<BotInfo>;
    private telegram: Telegram;

    constructor() {
        this.socketList = [];
        this.webConfigServerPort = 8080;

        this.botChildren = [];
        this.telegram = new Telegram(undefined, undefined, true);
        this.telegram.setChatID('@tintk_RSI_CCI'); //group chat

        this.connectTradeDataServer('binance', 81);
        this.connectTradeDataServer('bybit', 82);
        this.connectTradeDataServer('okx', 83);
        this.connectTradeDataServer('bybit_future', 84);
        this.connectTradeDataServer('binance_future', 85);

        CreateWebConfig(this.webConfigServerPort, this.initBotChildren.bind(this));
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

    private initBotChildren(botName?: string) {
        this.botChildren = [];
        const botFileList = fs.readdirSync(BOT_DATA_DIR);
        for (const botFile of botFileList) {
            if (botFile.endsWith('.json')) {
                const botInfo: BotInfo = JSON.parse(fs.readFileSync(`${BOT_DATA_DIR}/${botFile}`).toString());
                this.botChildren.push(botInfo);
            }
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
            mess += `\n${broker}:${symbol} ${timeframe}`
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