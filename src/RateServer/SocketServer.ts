import { SocketData } from '../SocketServer/socket_data';
import { BinanceSocket } from '../SocketServer/socket_binance';
import { BinanceFutureSocket } from '../SocketServer/socket_binance_future';
import { BybitSocket } from '../SocketServer/socket_bybit';
import { BybitFutureSocket } from '../SocketServer/socket_bybit_future';
import { OkxSocket } from '../SocketServer/socket_okx';
import * as util from '../common/util';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });


const exchange: { [key: string]: SocketData } = {};
(async () => {
    const binanceSymbolList = await util.getBinanceSymbolList();
    const binanceFutureSymbolList = await util.getBinanceFutureSymbolList();
    // const bybitSymbolList = await util.getBybitSymbolList();
    // const bybitFutureSymbolList = await util.getBybitFutureSymbolList();
    // const okxSymbolList = await util.getOkxSymbolList();

    console.log(`Binance symbols: ${binanceSymbolList.length}`);
    console.log(`Binance Future symbols: ${binanceFutureSymbolList.length}`);
    // console.log(`Bybit symbols: ${bybitSymbolList.length}`);
    // console.log(`Bybit Future symbols: ${bybitFutureSymbolList.length}`);
    // console.log(`Okx symbols: ${okxSymbolList.length}`);

    exchange['binance'] = new BinanceSocket(() => { }, binanceSymbolList);
    exchange['binance_future'] = new BinanceFutureSocket(() => { }, binanceFutureSymbolList);
    // exchange['bybit'] = new BybitSocket(() => { }, bybitSymbolList);
    // exchange['bybit_future'] = new BybitFutureSocket(() => { }, bybitFutureSymbolList);
    // exchange['okx'] = new OkxSocket(() => { }, okxSymbolList);

    exchange['binance'].initData();
    exchange['binance_future'].initData();
    // exchange['bybit'].initData();
    // exchange['bybit_future'].initData();
    // exchange['okx'].initData();

    const queue: {
        broker: string;
        symbol: string;
        timeframe: string;
    }[] = [];

    let processing = false;

    const processQueue = async function () {
        if (processing) return;
        processing = true;

        while (queue.length > 0) {
            const { broker, symbol, timeframe } = queue.shift()!;
            console.log("update data for", broker, symbol, timeframe);
            try {
                await exchange[broker].setData(symbol, timeframe);
            } catch (err) {
                console.error("update error:", err);
            }
        }

        processing = false;
    }

    process.on('message', async (msg: any) => {
        if (msg.type === "update") {
            queue.push({
                broker: msg.broker,
                symbol: msg.symbol,
                timeframe: msg.timeframe,
            });
            processQueue();
        }
    });
})();