import http from 'http';
import fs from 'fs';
import * as util from './util';
import { RateData } from './BinanceFuture';

export default class ServerData {
    private queue: { [key: string]: Array<(data: Array<RateData>) => {}> };

    constructor(port: number | string | undefined) {
        this.queue = {};

        let server = http.createServer(async (req, res) => {
            let query = req.url?.split('?')[1];
            if (query) {
                let { symbol, timeframe, limit } = JSON.parse('{"' + query.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) })
                if (symbol && timeframe && limit) {
                    let key = `${symbol}_${timeframe}_${limit}`;
                    this.queue[key] = this.queue[key] || [];
                    if (this.queue[key].length == 0) {
                        util.getOHLCV(symbol, timeframe, limit).then(data => {
                            for (let fun of this.queue[key]) {
                                fun(data);
                            }
                            this.queue[key] = [];
                        });
                    }
                    this.queue[key].push((data: Array<RateData>) => res.end(JSON.stringify(data)));

                }
            }
            else {
                return res.end("[]");
            }

        });

        server.timeout = 1800000;

        server.on('error', (err) => {
            console.log(err.message);
        });

        server.listen(port);
        console.log(`server data listen port ${port}`);

    }
}
