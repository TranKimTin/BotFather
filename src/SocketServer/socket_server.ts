import http from 'http';
import { Server } from "socket.io";
import { RateData, SymbolListener } from '../common/Interface';
import express from "express";
import cors from "cors";
import body_parser from "body-parser";
export class SocketServer {
    private broker;
    private port: number;
    private getData;
    private getOHLCV;
    private app;
    private server;
    private io;
    private symbolListener: { [key: string]: { [key: string]: boolean } };

    constructor(broker: string, port: number, getData: (symbol: string, timeframe: string) => Array<RateData>, getOHLCV: (symbol: string, timeframe: string, limit: number, since?: number) => Promise<Array<RateData>>) {
        this.broker = broker;
        this.port = port;
        this.getData = getData;
        this.getOHLCV = getOHLCV;
        this.symbolListener = {};
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            pingInterval: 25000,
            pingTimeout: 60000,
            maxHttpBufferSize: 200 * 1024 * 1024, //100MB
            // perMessageDeflate: {
            //     threshold: 2048, // defaults to 1024

            //     zlibDeflateOptions: {
            //         chunkSize: 8 * 1024, // defaults to 16 * 1024
            //     },

            //     zlibInflateOptions: {
            //         windowBits: 14, // defaults to 15
            //         memLevel: 7, // defaults to 8
            //     },

            //     clientNoContextTakeover: false, // defaults to negotiated value.
            //     serverNoContextTakeover: false, // defaults to negotiated value.
            //     serverMaxWindowBits: 10, // defaults to negotiated value.

            //     concurrencyLimit: 20, // defaults to 10
            // }
        });

        this.createServer();
    }

    private createServer() {
        this.app.disable("x-powered-by");
        this.app.set("trust proxy", true);
        this.app.use(cors());
        this.app.use(body_parser.json({ limit: "50mb" }));
        this.app.use(body_parser.urlencoded({ extended: false, limit: "50mb" }));
        this.app.get('/api/getOHLCV', async (req: any, res) => {
            try {
                const { symbol, timeframe } = req.query;
                const since = parseInt(req.query.since);
                const limit = parseInt(req.query.limit || 299);

                let data: Array<RateData> = this.getData(symbol, timeframe);

                while (data.length > 0 && data[data.length - 1].startTime < since) data.pop();

                if (data.length === 0 || data[data.length - 1].startTime > since) {
                    data = await this.getOHLCV(symbol, timeframe, limit + 1, since);
                }
                while (data.length > 0 && data[data.length - 1].startTime < since) data.pop();
                if (data.length > limit) data = data.slice(data.length - limit);

                res.json(data);
            }
            catch (err) {
                console.error(err);
                res.json([]);
            }
        });

        this.app.get('/api/getData', (req: any, res) => {
            try {
                const { symbol, timeframe } = req.query;
                const data: Array<RateData> = this.getData(symbol, timeframe);
                res.json(data);
            }
            catch (err) {
                console.error(err);
                res.json([]);
            }
        });

        this.io.on('connection', client => {
            console.log(`${this.broker}: client connected. total: ${this.io.sockets.sockets.size} connection`);

            this.symbolListener[client.id] = {};

            client.on('subscribe', (data: Array<SymbolListener>) => {
                const clientID = client.id;
                this.symbolListener[clientID] = {};
                for (const { symbol, timeframe, broker } of data) {
                    if (broker !== this.broker) continue;
                    const key = `${symbol}:${timeframe}`;
                    this.symbolListener[clientID][key] = true;
                }
                console.log(`${this.broker} on subscribe. clientID = ${clientID}, length = ${Object.keys(this.symbolListener[clientID]).length}`);
            });

            client.on('unsubscribe', (data: Array<SymbolListener>) => {
                const clientID = client.id;

                for (const { symbol, timeframe, broker } of data) {
                    if (broker !== this.broker) continue;
                    const key = `${symbol}:${timeframe}`;
                    delete this.symbolListener[clientID][key];
                }
                console.log(`${this.broker} on unsubscribe. clientID = ${clientID}, length = ${Object.keys(this.symbolListener[clientID]).length}`);
            });

            client.on('disconnect', () => {
                const clientID = client.id;
                delete this.symbolListener[clientID];
                console.log(`${this.broker}: onDisconnect - Client ${clientID} disconnected. total: ${this.io.sockets.sockets.size} connection`);
            });
        });

        this.server.listen(this.port);
    }

    public onCloseCandle(broker: string, symbol: string, timeframe: string, data: Array<RateData>) {
        if (data.length <= 15) return;

        for (const client of this.io.sockets.sockets.values()) {
            const clientID = client.id;
            const key = `${symbol}:${timeframe}`;
            if (this.symbolListener[clientID][key]) {
                console.log('onCloseCandle', broker, symbol, timeframe);

                // client.emit('onCloseCandle', { broker, symbol, timeframe, data });
            }
        }
    }
}