import dotenv from 'dotenv';
import * as util from './common/util';
import Telegram from './common/telegram';
import ReconnectingWebSocket from 'reconnecting-websocket';
import WebSocket from 'ws';
import moment from 'moment';

dotenv.config({ path: '../.env' });

const telegram = new Telegram(undefined, undefined, false);
let symbolList: Array<string> = [];
const volume = 15; //USDT
const spotData: { [key: string]: { price: number, lastUpdate: number } } = {};
const futureData: { [key: string]: { price: number, lastUpdate: number } } = {};
const cnt: { [key: string]: number } = {};

function connectSocketSpot() {
    const streams = symbolList.map(symbol => `${symbol.toLowerCase()}@depth5@100ms`).join("/");
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    const rws = new ReconnectingWebSocket(url, [], { WebSocket: WebSocket });
    const TAG = 'Binance';

    rws.addEventListener('open', () => {
        console.log(`${TAG}: socket connected`);
    });

    rws.addEventListener('message', (event) => {
        const mess = event.data;
        const { stream, data } = JSON.parse(mess.toString());
        const symbol = stream.split('@')[0].toUpperCase();

        let totalVol = 0;
        for (const item of data.asks) {
            const price = +item[0];
            const quantity = +item[1];
            totalVol += price * quantity;
            if (totalVol >= volume) {
                spotData[symbol].price = price;
                spotData[symbol].lastUpdate = new Date().getTime();
                check(symbol);
                return;
            }
        }
    });

    rws.addEventListener('error', (err) => {
        console.error(`${TAG}: WebSocket error`, err);
        // util.restartApp();
    });

    rws.addEventListener('close', (event) => {
        console.error(`${TAG}: WebSocket connection closed, ${event.code} ${event.reason}`);
    });
}

function connectSocketFuture() {
    const streams = symbolList.map(symbol => `${symbol.toLowerCase()}@depth5@100ms`).join("/");
    const url = `wss://fstream.binance.com/stream?streams=${streams}`;
    const rws = new ReconnectingWebSocket(url, [], { WebSocket: WebSocket });
    const TAG = 'BinanceFuture';

    rws.addEventListener('open', () => {
        console.log(`${TAG}: socket connected`);
    });

    rws.addEventListener('message', (event) => {
        const mess = event.data;
        const { data } = JSON.parse(mess.toString());

        const symbol = data.s;
        let totalVol = 0;
        for (const item of data.b) {
            const price = +item[0];
            const quantity = +item[1];
            totalVol += price * quantity;
            if (totalVol >= volume) {
                futureData[symbol].price = price;
                futureData[symbol].lastUpdate = new Date().getTime();
                check(symbol);
                return;
            }
        }
    });

    rws.addEventListener('error', (err) => {
        console.error(`${TAG}: WebSocket error`, err);
        // util.restartApp();
    });

    rws.addEventListener('close', (event) => {
        console.error(`${TAG}: WebSocket connection closed, ${event.code} ${event.reason}`);
    });
}

function check(symbol: string) {
    const spotAsk: number = spotData[symbol].price;
    const futureBid: number = futureData[symbol].price;
    const lastUpdateSpot = spotData[symbol].lastUpdate;
    const lastUpdateFuture = futureData[symbol].lastUpdate;

    if (!spotAsk || !futureBid) return;
    if (Math.abs(lastUpdateFuture - lastUpdateSpot) > 100) return;

    const diff = (futureBid - spotAsk) / spotAsk * 100;

    if (diff >= 1) {
        cnt[symbol]++;
    }
    else {
        cnt[symbol] = 0;
    }

    if (cnt[symbol] >= 3) {
        telegram.sendMessage(`${moment().format('HH:mm:ss.SSS')} ${symbol} - diff: ${+diff.toFixed(3)} %, spot: ${spotAsk}, future: ${futureBid} (${cnt[symbol]})`, 1833284254);
    }
    else if (diff > 0.5) {
        console.log(`${symbol} - diff: ${+diff.toFixed(3)} %, spot: ${spotAsk}, future: ${futureBid}`);
    }
}

async function main() {
    console.log('start arbitrage');
    const spotList = await util.getBinanceSymbolList();
    const futureList = await util.getBinanceFutureSymbolList();
    symbolList = spotList.filter(item => futureList.includes(item));

    for (const symbol of symbolList) {
        spotData[symbol] = {
            price: 0,
            lastUpdate: 0
        };
        futureData[symbol] = {
            price: 0,
            lastUpdate: 0
        };
        cnt[symbol] = 0;
    }

    connectSocketSpot();
    connectSocketFuture();

    console.log('arbitrage init done');
}


main();