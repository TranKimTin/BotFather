import express from "express";
import cors from "cors";
import morgan from "morgan";
import body_parser from "body-parser";
import path from "path";
import http from 'http';
import dotenv from 'dotenv';
import * as redis from '../common/redis';
import { getOHLCV } from "../common/util";

dotenv.config({ path: `${__dirname}/../../.env` });

import { ChildProcess, fork } from 'child_process';

const child = fork('./SocketServer.js', {
    execArgv: ['--max-old-space-size=32768']
});

(async () => {
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

        let key = `${broker}_${symbol}_${timeframe}`;

        let rates = (await redis.getArray(key)).map(item => {
            let parts = item.split('_');
            return {
                startTime: parseInt(parts[0]),
                open: parseFloat(parts[1]),
                high: parseFloat(parts[2]),
                low: parseFloat(parts[3]),
                close: parseFloat(parts[4]),
                volume: parseFloat(parts[5])
            };
        });
        if (rates.length === 0) {
            return res.json([]);
        }
        let lastRate = (await redis.get(`lastRate_${broker}_${symbol}_${timeframe}`) as string || '').split('_');
        if (lastRate.length === 6 && +lastRate[0] > rates[0].startTime) {
            rates.unshift({
                startTime: parseInt(lastRate[0]),
                open: parseFloat(lastRate[1]),
                high: parseFloat(lastRate[2]),
                low: parseFloat(lastRate[3]),
                close: parseFloat(lastRate[4]),
                volume: parseFloat(lastRate[5])
            });
        }

        for (let i = 2; i < rates.length; i++) {
            if (rates[i].startTime - rates[i - 1].startTime != rates[1].startTime - rates[0].startTime) {
                console.error(`Data is not continuous for ${broker} ${symbol} ${timeframe}`);
                child.send({ type: 'update', broker, symbol, timeframe });
                return await getOHLCV(broker, symbol, timeframe, limit)
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