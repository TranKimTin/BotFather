import dotenv from 'dotenv';
import * as util from './common/util';
import Telegram from './common/telegram';
import ReconnectingWebSocket from 'reconnecting-websocket';
import WebSocket from 'ws';
import moment from 'moment';
import Binance, { NewFuturesOrder, OrderType } from 'binance-api-node'
import axios from 'axios';
import crypto from 'crypto';

dotenv.config({ path: '../.env' });

const telegram = new Telegram(undefined, undefined, false);
let symbolList: Array<string> = [];
const volume = 11; //USDT
const volumeCheck = 100;
const spotData: { [key: string]: { price: number, lastUpdate: number } } = {};
const futureData: { [key: string]: { price: number, lastUpdate: number } } = {};
const cnt: { [key: string]: number } = {};

const client = Binance({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.SECRET_KEY,
    // httpFutures: 'https://testnet.binancefuture.com',
    // wsFutures: 'wss://stream.binancefuture.com/ws'
});

let spotDigit: Awaited<ReturnType<typeof util.getDigitsSpot>>;
let futureDigit: Awaited<ReturnType<typeof util.getDigitsFuture>>;

async function placeMarketOrder(symbol: string, side: 'BUY' | 'SELL', quantity: string) {
    try {
        const order = await client.order({
            symbol: symbol,
            side: 'BUY',
            type: OrderType.MARKET,
            quantity: quantity,
        });

        console.log('Lệnh mua thành công:', order);
    } catch (error) {
        console.error('Lỗi khi đặt lệnh:', error);
    }
}

async function futurePlaceMarketOrder(symbol: string, side: 'BUY' | 'SELL', quantity: string) {
    const baseUrl = 'https://papi.binance.com';
    const endpoint = '/papi/v1/um/order';

    const data = {
        symbol: symbol,
        side: side,
        type: 'MARKET',
        quantity: quantity,
        timestamp: Date.now().toString(),
    };

    const query = new URLSearchParams(data).toString();
    const signature = crypto.createHmac('sha256', process.env.SECRET_KEY as string).update(query).digest('hex');

    try {
        console.log(process.env.SECRET_KEY)
        console.log(`${baseUrl}${endpoint}?${query}&signature=${signature}`)
        const response = await axios.post(`${baseUrl}${endpoint}?${query}&signature=${signature}`, null, {
            headers: { 'X-MBX-APIKEY': process.env.API_KEY }
        });
        console.log('✅ Lệnh LONG UM thành công:', response.data);
    } catch (error: any) {
        console.error('❌ Lỗi đặt lệnh LONG UM:', error.response?.data || error.message);
    }
}


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
            if (totalVol >= volumeCheck) {
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
            if (totalVol >= volumeCheck) {
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

let isOrdered = false;
function check(symbol: string) {
    if (isOrdered) return;

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
        isOrdered = true;

        const quantity = (volume / futureBid).toFixed(futureDigit[symbol].volume);

        telegram.sendMessage(`${moment().format('HH:mm:ss.SSS')} ${symbol} - diff: ${+diff.toFixed(3)} %, spot: ${spotAsk}, future: ${futureBid}, volume: ${quantity} (${cnt[symbol]})`, 1833284254);



        Promise.all([
            placeMarketOrder(symbol, 'BUY', quantity),
            futurePlaceMarketOrder(symbol, 'SELL', quantity)
        ]).then(data => {
            console.log(data);
            process.exit();
        });

    }
    else if (diff > 0.5) {
        console.log(`${symbol} - diff: ${+diff.toFixed(3)} %, spot: ${spotAsk}, future: ${futureBid}`);
    }
}

async function main() {
    console.log('start arbitrage');

    spotDigit = await util.getDigitsSpot();
    futureDigit = await util.getDigitsFuture();

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

    // await placeMarketOrder('BTCUSDT', 'BUY', '0.00005');
    // await futurePlaceMarketOrder('JUPUSDT', 'SELL', '9');
}


main();