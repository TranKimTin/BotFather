// server
import * as net from 'net';
import BinanceFuture, { RateData } from './BinanceFuture';
import * as util from './util';

const port = 8081;
let clientList: Array<net.Socket> = [];

async function main() {
    let symbolList = await util.getSymbolList();
    // console.log(symbolList.join(' '));
    console.log(`Total ${symbolList.length} symbols`);

    let timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];


    let binance = new BinanceFuture({
        apiKey: process.env.API_KEY,
        secretKey: process.env.SECRET_KEY,
        symbolList: symbolList,
        timeframes: timeframes,
        onCloseCandle: onCloseCandle,
        onClosePosition: async (symbol: string) => { },
        onHandleError: async (err: any, symbol: string | undefined) => { },
        onInitStart: async () => { },
        onInitDone: async () => { },
        isReadOnly: true
    });

    await binance.init();
}
main();


function onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {
    let stringData = JSON.stringify({ symbol, timeframe, data });
    for (let client of clientList) {
        client.write(stringData);
    }
}

net.createServer((client) => {
    console.log("client connected");
    console.log(clientList.length)

    clientList.push(client);

    client.on('data', function (data) {
        console.log(data.toString());
    });

    client.on('close', () => {
        console.log('onClose - Client disconnected');
        clientList = clientList.filter(s => s !== client);
    });

    client.on('end', () => {
        console.log('onEnd - Client disconnected');
        clientList = clientList.filter(s => s !== client);
    });

    client.on('error', error => {
        console.error('Error:', error);
        clientList = clientList.filter(s => s !== client);
        client.destroy();
    });


}).listen(port);






// client
// var s = new net.Socket();
// s.connect(8080);
// s.on('data', data => {
//     console.log('a', data.toString());
// })