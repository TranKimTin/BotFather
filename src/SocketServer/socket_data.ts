import * as util from '../common/util';
import moment from 'moment';
import delay from 'delay';
import { MAX_CANDLE, RateData } from '../common/Interface';
import * as redis from '../common/redis';

export class SocketData {
    private broker: string;
    protected gData: { [key: string]: { [key: string]: Array<RateData> } };
    protected gLastUpdated: { [key: string]: number };
    protected timeframes: Array<string>;
    protected symbolList: Array<string>;
    protected symbolLoadConcurrent: number;

    protected getSymbolList?: () => Promise<Array<string>>;
    protected onCloseCandle?: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void;
    protected getOHLCV?: (symbol: string, timeframe: string, since?: number) => Promise<Array<RateData>>;
    protected init?: () => void;

    constructor(timeframes: Array<string>, broker: string, symbolLoadConcurrent: number, onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        this.broker = broker;
        this.timeframes = timeframes;
        this.symbolLoadConcurrent = symbolLoadConcurrent;
        this.onCloseCandle = onCloseCandle;

        this.gData = {};
        this.gLastUpdated = {};
        this.symbolList = [];

        if (this.timeframes[0] !== '1m') this.timeframes.unshift('1m');
    }

    protected mergeData(data: RateData, isFinalMinute: boolean) {
        if (!this.onCloseCandle) throw 'Missing function onCloseCandle';

        const dataList = this.gData[data.symbol][data.interval];
        if (dataList.length === 0) {
            dataList.push(data);
            return;
        }

        if (dataList[0].startTime == data.startTime) {
            // dataList[0] = data;
            dataList[0].high = Math.max(dataList[0].high, data.high);
            dataList[0].low = Math.min(dataList[0].low, data.low);
            dataList[0].close = data.close;
            dataList[0].volume += isFinalMinute ? data.volume : 0;

            if (data.isFinal && !dataList[0].isFinal) {
                dataList[0].isFinal = data.isFinal;
                if (dataList.length > 15) {
                    this.onCloseCandle(this.broker, data.symbol, data.interval, [...dataList]);
                    this.cacheData(dataList);
                }
                else {
                    // console.log(`ignore onCloseCandle ${this.broker} - ${dataList.length}`, dataList[0])
                }
            }
        }
        else if (dataList[0].startTime < data.startTime) {
            dataList.unshift(data);
            while (dataList.length > MAX_CANDLE) {
                dataList.pop();
            }
            if (dataList[1] && !dataList[1].isFinal) {
                // console.log(`forces final ${this.broker}`, dataList[1]);
                if (dataList.length > 15) {
                    dataList[1].isFinal = true;
                    this.onCloseCandle(this.broker, data.symbol, data.interval, dataList.slice(1));
                    this.cacheData(dataList);
                }
            }
        }
        else {
            // console.log(`${this.broker}: merge error`);
            // console.log(dataList[0], data);
        }
    }

    protected fetchCandles(candle: RateData) {
        this.gLastUpdated[candle.symbol] = new Date().getTime();
        for (const tf of this.timeframes) {
            const data: RateData = {
                symbol: candle.symbol,
                startTime: util.getStartTime(tf, candle.startTime),
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
                volume: candle.volume,
                interval: tf,
                isFinal: candle.isFinal && util.checkFinal(tf, candle.startTime)
            };
            this.mergeData(data, candle.isFinal);
        }
    }

    protected async initCandle(symbol: string, timeframe: string): Promise<boolean> {
        if (!this.getOHLCV) throw 'Missing fundtion getOHLCV';

        const res = { fromCache: false };
        const rates: Array<RateData> = await this.getRates(symbol, timeframe, res);
        this.cacheData(rates);
        const lastData = this.gData[symbol][timeframe].reverse();
        this.gData[symbol][timeframe] = rates;

        for (const data of lastData) {
            if (this.gData[symbol][timeframe].length === 0) {
                this.gData[symbol][timeframe].push(data);
            }
            else {
                const lastRate = this.gData[symbol][timeframe][0];
                if (data.startTime >= lastRate.startTime) {
                    this.mergeData(data, data.isFinal);
                }
            }
        }
        return res.fromCache;
    }

    private mergeRates(ratesLower: Array<RateData>, ratesHigher: Array<RateData>, timeframe: string) {
        if (ratesLower.length === 0) return;
        if (util.timeframeToNumberMinutes(timeframe) % util.timeframeToNumberMinutes(ratesLower[0].interval) !== 0) return;

        const rates: Array<RateData> = [];
        for (const rate of ratesLower) { //time DESC
            if (ratesHigher.length === 0 || ratesHigher[0].startTime <= rate.startTime) {
                rates.unshift(rate);
            }
            else {
                break;
            }
        }
        for (let rate of rates) {  //time ASC
            if (ratesHigher.length === 0 || util.getStartTime(timeframe, rate.startTime) > ratesHigher[0].startTime) {
                ratesHigher.unshift({
                    symbol: rate.symbol,
                    startTime: util.getStartTime(timeframe, rate.startTime),
                    open: rate.open,
                    high: rate.high,
                    low: rate.low,
                    close: rate.close,
                    volume: rate.volume,
                    interval: timeframe,
                    isFinal: rate.isFinal && ((rate.startTime + util.timeframeToNumberMiliseconds(rate.interval) - util.getStartTime(timeframe, rate.startTime) === util.timeframeToNumberMiliseconds(timeframe)) ? true : false)
                });
            }
            else if (util.getStartTime(timeframe, rate.startTime) === ratesHigher[0].startTime) {
                ratesHigher[0].high = Math.max(ratesHigher[0].high, rate.high);
                ratesHigher[0].low = Math.min(ratesHigher[0].low, rate.low);
                ratesHigher[0].close = rate.close;
                ratesHigher[0].isFinal = rate.isFinal && ((rate.startTime + util.timeframeToNumberMiliseconds(rate.interval) - util.getStartTime(timeframe, rate.startTime) === util.timeframeToNumberMiliseconds(timeframe)) ? true : false)
            }
            else {
                console.error(`merge rate error ${this.broker}`, rate, ratesHigher[0]);
            }
        }
    }

    private isValidRates(rates: Array<RateData>): boolean {
        if (rates.length <= 1) return true;
        const timeIntervalMiliseconds = rates[0].startTime - rates[1].startTime;
        for (let i = 2; i < rates.length; i++) {
            if (rates[i - 1].startTime - rates[i].startTime !== timeIntervalMiliseconds) {
                return false;
            }
        }
        return true;
    }

    private async getRates(symbol: string, timeframe: string, res: { fromCache: boolean }): Promise<Array<RateData>> {
        res.fromCache = false;
        const key = `${this.broker}_${symbol}_${timeframe}`;

        if (timeframe === '1m') {
            await redis.remove(key);
            return this.getOHLCV!(symbol, timeframe);
        }

        const rates: Array<RateData> = (await redis.getArray(key)).map(item => JSON.parse(item));
        for (const item of rates) {
            item.isFinal = true;
            item.cached = true;
        }
        if (rates.length === 0) {
            return this.getOHLCV!(symbol, timeframe);
        }

        let idx = this.timeframes.indexOf(timeframe) - 1;
        while (idx >= 0) {
            this.mergeRates(this.gData[symbol][this.timeframes[idx]], rates, timeframe);
            idx--;
        }
        if (!this.isValidRates(rates)) {
            await redis.remove(key);
            const result = await this.getOHLCV!(symbol, timeframe);
            return result;
        }
        // console.log(`get data from cache ${key}_${rates.length}`);
        res.fromCache = true;
        return rates;
    }

    private async cacheData(data: Array<RateData>) {
        if (data.length === 0) return;
        setTimeout(() => {
            setImmediate(async () => {
                try {
                    const rates: Array<RateData> = []; //time ASC
                    for (let i = 0; i < data.length && !data[i].cached; i++) {
                        if (data[i].isFinal) {
                            rates.unshift(data[i]);
                        }
                    }
                    if (rates.length === 0) return;
                    const key = `${this.broker}_${rates[0].symbol}_${rates[0].interval}`;
                    let cnt = 0;
                    for (let rate of rates) {
                        if (!rate.cached) {
                            rate.cached = true;
                            cnt++;
                            await redis.pushFront(key, JSON.stringify(rate));
                        }
                    }
                    let cntRemove = 0;
                    let cachedLength = await redis.length(key);
                    while ((cachedLength > MAX_CANDLE)) {
                        await redis.popBack(key);
                        cntRemove++;
                        cachedLength--;
                    }
                    // console.log(`cached ${key}_${cnt}-${cntRemove}`);
                }
                catch (err) {
                    console.error(err);
                }
            });
        }, 30000);
    }

    public getData(symbol: string, timeframe: string) {
        if (!this.gData || !this.gData[symbol] || !this.gData[symbol][timeframe]) return [];
        return this.gData[symbol][timeframe];
    }

    public getSymbols() {
        return this.symbolList;
    }

    public getTimeframes() {
        return this.timeframes;
    }

    public async initData() {
        // timeframes = ['1m', '15m', '4h', '1d'];
        if (!this.getSymbolList) throw 'Missing fundtion getSymbolList';
        if (!this.init) throw 'Missing fundtion init';

        console.log(`socket ${this.broker} restart`);

        this.symbolList = await this.getSymbolList();
        console.log(`${this.broker}: Total ${this.symbolList.length} symbols`);
        console.log(`${this.broker}: init timeframe`, this.timeframes);

        for (const symbol of this.symbolList) {
            this.gData[symbol] = {};
            this.gLastUpdated[symbol] = new Date().getTime();
            for (const tf of this.timeframes) {
                this.gData[symbol][tf] = [];
            }
        }

        await this.init();


        for (const tf of this.timeframes) {
            console.log(`${this.broker}: init candle ${tf}...`);
            let promiseList = [];
            for (const symbol of this.symbolList) {
                promiseList.push(this.initCandle(symbol, tf));
                if (promiseList.length >= this.symbolLoadConcurrent) {
                    const res = await Promise.all(promiseList);
                    promiseList = [];
                    const delayTime = 5000 / this.symbolLoadConcurrent * res.filter(item => item === false).length;
                    // console.log({ broker: this.broker, symbol, tf, delayTime });
                    await delay(delayTime);
                }
            }
            const res = await Promise.all(promiseList);
            const delayTime = 5000 / this.symbolLoadConcurrent * res.filter(item => item === false).length;
            // console.log({ tf, delayTime });

            await delay(delayTime);
        }

        const timeInterval = 10 * 60 * 1000;
        setInterval(() => {
            const now = new Date().getTime();
            for (const symbol in this.gLastUpdated) {
                const lastTimeUpdated = this.gLastUpdated[symbol];
                if (now - lastTimeUpdated > timeInterval) {
                    console.error(`${this.broker}: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`);
                    util.restartApp();
                    // throw `${BinanceSocketFuture.broker}: ${symbol} not uppdated. [${new Date(lastTimeUpdated)}, ${new Date(now)}]`;
                }
            }
        }, timeInterval);
    }
}