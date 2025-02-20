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

    // const urlFuture = `wss://fstream.binance.com:9443/stream?streams=${streams}`;

    connectSocketSpot();

    // client.ws.partialDepth(args, depth => {
    //     const symbol = depth.symbol.split('@')[0];
    //     let totalVol = 0;
    //     for (const data of depth.asks) {
    //         const price = +data.price;
    //         const quantity = +data.quantity;
    //         totalVol += price * quantity;
    //         if (totalVol >= volume) {
    //             spotPrice[symbol] = price;
    //             break;
    //         }
    //     }
    // });

    // client.ws.futuresPartialDepth(args, (depth: any) => {
    //     const symbol = depth.symbol;
    //     let totalVol = 0;
    //     for (const data of depth.bidDepth) {
    //         const price = +data.price;
    //         const quantity = +data.quantity;
    //         totalVol += price * quantity;
    //         if (totalVol >= volume) {
    //             futurePrice[symbol] = price;
    //             break;
    //         }
    //     }
    // });

    console.log('arbitrage init done');

    setInterval(() => {
        for (let symbol of symbolList) {
            const spotAsk = spotPrice[symbol];
            const futureBid = futurePrice[symbol];
            if (!spotAsk || !futureBid) continue;
            const diff = (futureBid - spotAsk) / spotAsk * 100;
            if (diff > 1.3) {
                telegram.sendMessage(`${symbol} - diff: ${+diff.toFixed(3)} %, spot: ${spotAsk}, future: ${futureBid}`, 1833284254);
            }
        }
    }, 1000);
}


main();