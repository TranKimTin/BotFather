import dotenv from 'dotenv';
import * as util from './common/util';
import Telegram from './common/telegram';
import ReconnectingWebSocket from 'reconnecting-websocket';
import WebSocket from 'ws';

dotenv.config({ path: '../.env' });

const telegram = new Telegram(undefined, undefined, false);
let symbolList: Array<string> = [];
const volume = 15; //USDT
const spotPrice: { [key: string]: number } = {};
const futurePrice: { [key: string]: number } = {};

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
                spotPrice[symbol] = price;
                break;
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
                futurePrice[symbol] = price;
                break;
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
async function main() {
    console.log('start arbitrage');
    const spotList = await util.getBinanceSymbolList();
    const futureList = await util.getBinanceFutureSymbolList();
    symbolList = spotList.filter(item => futureList.includes(item));

    for (const symbol of symbolList) {
        spotPrice[symbol] = 0;
        futurePrice[symbol] = 0;
    }

    connectSocketSpot();
    connectSocketFuture();

    console.log('arbitrage init done');

    setInterval(() => {
        for (let symbol of symbolList) {
            const spotAsk = spotPrice[symbol];
            const futureBid = futurePrice[symbol];
            if (!spotAsk || !futureBid) continue;
            const diff = (futureBid - spotAsk) / spotAsk * 100;
            if (diff > 0.5) {
                telegram.sendMessage(`${symbol} - diff: ${+diff.toFixed(3)} %, spot: ${spotAsk}, future: ${futureBid}`, 1833284254);
            }
        }
    }, 1000);
}


main();