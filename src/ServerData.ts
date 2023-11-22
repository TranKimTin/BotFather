import http from 'http';
import fs from 'fs';
import * as util from './util';
import { RateData } from './BinanceFuture';

export default class ServerData {
    private queue: { [key: string]: Promise<Array<RateData>> };
    private refCount: { [key: string]: number };

    constructor(port: number | string | undefined) {
        this.queue = {};
        this.refCount = {};

        http.createServer(async (req, res) => {
            let query = req.url?.split('?')[1];
            console.log({ query });
            if (query) {
                let { symbol, timeframe, limit } = JSON.parse('{"' + query.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) })
                if (symbol && timeframe && limit) {
                    let key = `${symbol}_${timeframe}_${limit}`;
                    this.refCount[key] = this.refCount[key] || 0;
                    if (!this.queue[key]) {
                        this.queue[key] = util.getOHLCV(symbol, timeframe, limit);
                        this.refCount[key] = 1;
                    }
                    else {
                        this.refCount[key]++;
                    }
                    let data = await this.queue[key];
                    this.refCount[key]--;
                    if (this.refCount[key] <= 0) {
                        delete this.queue[key];
                        this.refCount[key] = 0;
                    }
                    return res.end(JSON.stringify(data));
                }
            }

        }).listen(port);
        console.log(`server data listen port ${port}`);

    }
}
