// server
import http from 'http';
import { Server, Socket } from "socket.io";
import BinanceFuture, { RateData } from './BinanceFuture';
import * as util from './util';
import IBinance, { Binance } from 'binance-api-node';
import moment from 'moment';
import delay from 'delay';

const port = 8081;
// let clientList: Array<Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> = [];
let gBinance: Binance = IBinance({});
let gData: { [key: string]: { [key: string]: Array<RateData> } } = {};
let gLastPrice: { [key: string]: number } = {};


async function main(numbler_candle_load = 300) {
    let symbolList = await util.getSymbolList();
    // console.log(symbolList.join(' '));
    console.log(`Total ${symbolList.length} symbols`);

    let timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
    for (let symbol of symbolList) {
        gData[symbol] = {};
        for (let tf of timeframes) {
            gData[symbol][tf] = [];
        }
    }

    console.log('init timeframe', timeframes);
    gBinance.ws.futuresCandles(symbolList, '1m', candle => {
        for (let tf of timeframes) {
            let data = {
                symbol: candle.symbol,
                startTime: util.getStartTime(tf, candle.startTime),
                timestring: moment(util.getStartTime(tf, candle.startTime)).format('YYYY-MM-DD HH:mm:SS'),
                open: +candle.open,
                high: +candle.high,
                low: +candle.low,
                close: +candle.close,
                volume: +candle.volume,
                interval: tf,
                isFinal: candle.isFinal && util.checkFinal(tf, candle.startTime),
                change: (+candle.close - +candle.open) / +candle.open,
                ampl: (+candle.high - +candle.low) / +candle.open
            };
            gLastPrice[data.symbol] = data.close;

            let dataList = gData[data.symbol][data.interval];
            if (!dataList[0]) return;

            if (dataList[0].startTime == data.startTime) {
                // dataList[0] = data;
                dataList[0].high = Math.max(dataList[0].high, data.high);
                dataList[0].low = Math.min(dataList[0].low, data.low);
                dataList[0].close = data.close;
                dataList[0].volume += candle.isFinal ? data.volume : 0;
                dataList[0].isFinal = data.isFinal;
                dataList[0].change = (dataList[0].close - dataList[0].open) / dataList[0].open;
                dataList[0].ampl = (dataList[0].high - dataList[0].low) / dataList[0].open;

                if (data.isFinal) {
                    onCloseCandle(data.symbol, data.interval, [...dataList]);
                }
            }
            else {
                dataList.unshift(data);
                if (dataList[1] && !dataList[1].isFinal) {
                    onCloseCandle(data.symbol, data.interval, dataList.slice(1));
                }
            }
        }
    });

    for (let tf of timeframes) {
        console.log(`init candle ${tf}...`);
        let promiseList = [];
        for (let symbol of symbolList) {
            promiseList.push(util.getOHLCV(symbol, tf, numbler_candle_load));
            // promiseList.push(util.getOHLCVFromCache(symbol, tf, numbler_candle_load));
            // promiseList.push(fetch(`http://localhost:${process.env.PORT_DATA_SERVER}/?symbol=${symbol}&timeframe=${tf}&limit=${numbler_candle_load}`));
        }
        // let responses = await Promise.all(promiseList);
        // let rates = await Promise.all(responses.map(item => item.json()));
        let rates = await Promise.all(promiseList);
        let i = 0;
        for (let symbol of symbolList) {
            gData[symbol][tf] = rates[i++];
            gLastPrice[symbol] = gData[symbol][tf][0]?.close || 0;
        }
        await delay(5000);
    }
}



function onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {
    let stringData = JSON.stringify({ symbol, timeframe, data });
    io.emit('onCloseCandle', stringData);
}

const server = http.createServer();
const io = new Server(server);

let cnt = 0;
io.on('connection', client => {
    cnt++;
    console.log(`client connected. total: ${cnt} connection`);

    client.on('disconnect', () => {
        cnt--;
        console.log(`onDisconnect - Client disconnected. total: ${cnt} connection`);
    });
});
server.listen(port);
main();
