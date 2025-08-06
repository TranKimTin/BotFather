import { SocketData } from './SocketServer/socket_data';
import { BinanceSocket } from './SocketServer/socket_binance';
import { BinanceFutureSocket } from './SocketServer/socket_binance_future';
import { BybitSocket } from './SocketServer/socket_bybit';
import { BybitFutureSocket } from './SocketServer/socket_bybit_future';
import { OkxSocket } from './SocketServer/socket_okx';
import * as util from './common/util';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import body_parser from "body-parser";
import path from "path";
import http from 'http';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });


const exchange: { [key: string]: SocketData } = {};
(async () => {
    const binanceSymbolList = await util.getBinanceSymbolList();
    const binanceFutureSymbolList = await util.getBinanceFutureSymbolList();
    const bybitSymbolList = await util.getBybitSymbolList();
    const bybitFutureSymbolList = await util.getBybitFutureSymbolList();
    const okxSymbolList = await util.getOkxSymbolList();

    console.log(`Binance symbols: ${binanceSymbolList.length}`);
    console.log(`Binance Future symbols: ${binanceFutureSymbolList.length}`);
    console.log(`Bybit symbols: ${bybitSymbolList.length}`);
    console.log(`Bybit Future symbols: ${bybitFutureSymbolList.length}`);
    console.log(`Okx symbols: ${okxSymbolList.length}`);

    exchange['binance'] = new BinanceSocket(() => { }, binanceSymbolList);
    exchange['binance_future'] = new BinanceFutureSocket(() => { }, binanceFutureSymbolList);
    exchange['bybit'] = new BybitSocket(() => { }, bybitSymbolList);
    exchange['bybit_future'] = new BybitFutureSocket(() => { }, bybitFutureSymbolList);
    exchange['okx'] = new OkxSocket(() => { }, okxSymbolList);

    exchange['binance'].initData();
    exchange['binance_future'].initData();
    exchange['bybit'].initData();
    exchange['bybit_future'].initData();
    exchange['okx'].initData();

    const app = express();
    const server = http.createServer(app);

    app.disable("x-powered-by");
    app.set("trust proxy", true);
    app.use(cors());
    app.use(
        morgan(
            ":remote-addr :remote-user :user-agent :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"
        )
    );
    app.use(body_parser.json({ limit: "50mb" }));
    app.use(body_parser.urlencoded({ extended: false, limit: "50mb" }));
    app.use(express.static(path.join(__dirname, 'public')));


    app.get('/api/getOHLCV', async (req: any, res: any) => {
        let { broker, symbol, timeframe, limit } = req.query;
        console.log(`Request OHLCV: ${broker} ${symbol} ${timeframe} ${limit}`);

        if (!broker || !symbol || !timeframe || !limit) {
            return res.json([]);
        }

        let rates = exchange[broker].getData(symbol, timeframe);

        for (let i = 2; i < rates.length; i++) {
            if (rates[i].startTime - rates[i - 1].startTime != rates[1].startTime - rates[0].startTime) {
                console.error(`Data is not continuous for ${broker} ${symbol} ${timeframe}`);
                rates = await exchange[broker].setData(symbol, timeframe);
                break;
            }
        }
        while (rates.length > limit) {
            rates.pop();
        }

        res.json(rates.map(item => `${item.startTime}_${item.open}_${item.high}_${item.low}_${item.close}_${item.volume}`));
    });

    const port = 8081;
    server.listen(port, () => {
        console.log(`\nStart server at: ${new Date()}
                    HTTP server is listening at: ${"localhost"}:${port}
        `);
    });
})();