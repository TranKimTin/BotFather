import { BotInfo, CreateWebConfig, BOT_DATA_DIR } from './botFatherConfig';
import BinanceFuture, { RateData } from './BinanceFuture';
import * as util from './util';
import moment from 'moment';
import delay from 'delay';
import fs from 'fs';
import path from 'path';

// export class BotFather {
//     private binance?: BinanceFuture;
//     private isReadOnly: boolean;
//     private botChildren: Array<BotInfo>;

//     constructor() {
//         this.isReadOnly = true;
//         this.botChildren = [];

//         let fileList = fs.readdirSync(BOT_DATA_DIR);
//         for (let botFile of fileList) {
//             let botPath = path.join(BOT_DATA_DIR, botFile);
//             let botInfo: BotInfo = JSON.parse(fs.readFileSync(botPath).toString());
//             this.botChildren.push(botInfo);
//         }

//         this.botChildren = this.botChildren.filter(item => item.timeframes.length > 0);

//         CreateWebConfig(8080, (botName: string) => {
//             let botPath = path.join(BOT_DATA_DIR, `${botName}.json`);
//             let botInfo: BotInfo = JSON.parse(fs.readFileSync(botPath).toString());

//             this.botChildren = this.botChildren.filter(item => item.botName != botName);

//             if (botInfo.timeframes.length > 0) {
//                 this.botChildren.push(botInfo);
//             }
//         });

//     }

//     async init() {
//         let symbolList = await util.getSymbolList();
//         let ignoreList = ['BTCDOMUSDT', 'USDCUSDT', 'BTCUSDT', 'COCOSUSDT'];
//         symbolList = symbolList.filter(item => item.endsWith("USDT"))
//             .filter(item => !ignoreList.includes(item));
//         // console.log(symbolList.join(' '));
//         console.log(`Total ${symbolList.length} symbols`);

//         let timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
//         // timeframes = [];


//         this.binance = new BinanceFuture({
//             apiKey: process.env.API_KEY,
//             secretKey: process.env.SECRET_KEY,
//             symbolList: symbolList,
//             timeframes: timeframes,
//             onCloseCandle: this.onCloseCandle.bind(this),
//             onClosePosition: async (symbol: string) => { },
//             onHandleError: async (err: any, symbol: string | undefined) => { },
//             onInitStart: async () => { },
//             onInitDone: async () => { },
//             isReadOnly: this.isReadOnly
//         });

//         await this.binance.init();
//     }

//     async onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {

//     }
// }

// let botFather = new BotFather();
// botFather.init();

// client
import net from 'net';
interface ParsedData {
    cmd: string;
    data: {
        symbol: string;
        timeframe: string;
        data: Array<RateData>;
    };
}

let timeout: NodeJS.Timeout;
function connectTradeDataServer() {
    let client = new net.Socket();

    client.connect(8081, "localhost", () => {
        console.log('connected to server');
    });

    client.on('end', () => {
        console.log('onEnd - Server ended the connection');
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log('reconect...');
            connectTradeDataServer();
        }, 2000);
    });

    client.on('error', () => {
        console.log('onError - Disconnected socket server');
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log('reconect...');
            connectTradeDataServer();
        }, 2000);
    });

    client.on('data', stringData => {
        try {
            let { cmd, data } = JSON.parse(stringData.toString()) as ParsedData;
            switch (cmd) {
                case 'onCloseCandle':
                    break;
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
connectTradeDataServer();