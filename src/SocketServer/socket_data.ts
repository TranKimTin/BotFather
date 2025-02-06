import * as util from '../common/util';
import moment from 'moment';
import delay from 'delay';
import { RateData } from '../common/Interface';
import * as mysql from '../WebConfig/lib/mysql';

export class SocketData {
    private broker: string;
    protected gData: { [key: string]: { [key: string]: Array<RateData> } };
    protected gLastPrice: { [key: string]: number };
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
        this.gLastPrice = {};
        this.gLastUpdated = {};
        this.symbolList = [];

        if (this.timeframes[0] !== '1m') this.timeframes.unshift('1m');
    }

    protected mergeData(data: RateData, isFinalMinute: boolean) {
        if (!this.onCloseCandle) throw 'Missing function onCloseCandle';

        this.gLastPrice[data.symbol] = data.close;

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
                this.onCloseCandle(this.broker, data.symbol, data.interval, dataList);
            }
        }
        else if (dataList[0].startTime < data.startTime) {
            dataList.unshift(data);
            if (dataList.length > 300) {
                dataList.pop();
            }
            // if (dataList[1] && !dataList[1].isFinal) {
            //     dataList[1].isFinal = true;
            //     console.log('forces final', dataList[1]);
            //     this.onCloseCandle(this.broker, data.symbol, data.interval, dataList.slice(1));
            // }
        }
        else {
            console.log(`${this.broker}: merge error`);
            console.log(dataList[0], data);
        }
    }

    protected fetchCandles(candle: RateData) {
        this.gLastUpdated[candle.symbol] = new Date().getTime();
        for (const tf of this.timeframes) {
            const data: RateData = {
                symbol: candle.symbol,
                startTime: util.getStartTime(tf, candle.startTime),
                timestring: moment(util.getStartTime(tf, candle.startTime)).format('YYYY-MM-DD HH:mm:SS'),
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

    protected async initCandle(symbol: string, timeframe: string) {
        if (!this.getOHLCV) throw 'Missing fundtion getOHLCV';

        const rates: Array<RateData> = await this.getRates(symbol, timeframe);
        this.cacheData(rates);
        const lastData = this.gData[symbol][timeframe].reverse();
        this.gData[symbol][timeframe] = rates;
        this.gLastPrice[symbol] = this.gData[symbol][timeframe][0]?.close || 0;

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
    }

    private mergeRates(ratesLower: Array<RateData>, ratesHigher: Array<RateData>, timeframe: string) {
        console.log('merge rate');
        if (ratesLower.length === 0) return;
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
            if (ratesHigher.length === 0 || rate.startTime > ratesHigher[0].startTime) {
                rates.unshift({
                    symbol: rate.symbol,
                    startTime: util.getStartTime(timeframe, rate.startTime),
                    timestring: moment(util.getStartTime(timeframe, rate.startTime)).format('YYYY-MM-DD HH:mm:SS'),
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
            }
            else {
                console.log('merge rate error', rate, ratesHigher[0]);
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

    private async getRates(symbol: string, timeframe: string): Promise<Array<RateData>> {
        if (timeframe === '1m') return this.getOHLCV!(symbol, timeframe);
        const sql = `SELECT id, symbol, \`interval\`, startTime, open, high, low, close, volume
                        FROM CacheRates
                        WHERE symbol = ? AND \`interval\` = ? AND broker = ?
                        ORDER BY startTime DESC
                        LIMIT 300`;
        const rates: Array<RateData> = await mysql.query(sql, [symbol, timeframe, this.broker]);
        for (let item of rates) {
            item.timestring = moment(item.startTime).format('YYYY-MM-DD HH:mm:SS');
            item.isFinal = true;
        }
        if (rates.length === 0) {
            return this.getOHLCV!(symbol, timeframe);
        }

        let idx = this.timeframes.indexOf(timeframe) - 1;
        while (idx >= 0) {
            this.mergeRates(this.gData[symbol][this.timeframes[idx]], this.gData[symbol][timeframe], timeframe);
            console.log('merge rate ok');
            idx--;
        }
        if (!this.isValidRates(rates)) return this.getOHLCV!(symbol, timeframe);
        console.log('get from cache', this.broker, symbol, timeframe);
        return rates;
    }

    private cacheData(rates: Array<RateData>) {
        if (rates.length === 0 || rates[0].interval === '1m') return;
        setImmediate(async () => {
            try {
                rates = rates.filter(item => item.isFinal && !item.id);
                if (rates.length === 0) return;
                const sql = `INSERT INTO CacheRates(broker, symbol, \`interval\`, startTime, open, high, low, close, volume) VALUES ${Array(rates.length).fill('(?,?,?,?,?,?,?,?,?)').join(',')}`;
                const args: Array<string | number> = [];
                for (let item of rates) {
                    args.push(this.broker);
                    args.push(item.symbol);
                    args.push(item.interval);
                    args.push(item.startTime);
                    args.push(item.open);
                    args.push(item.high);
                    args.push(item.low);
                    args.push(item.close);
                    args.push(item.volume);
                }
                await mysql.query(sql, args);
                console.log(`cached ${this.broker} ${rates[0].symbol}  ${rates[0].interval} - ${rates.length}`);
            }
            catch (err) {
                console.error(err);
            }
        });
    }

    public getData(symbol: string, timeframe: string) {
        if (!this.gData || !this.gData[symbol] || !this.gData[symbol][timeframe]) return [];
        return this.gData[symbol][timeframe];
    }

    public async initData() {
        // timeframes = ['1m', '15m', '4h', '1d'];
        if (!this.getSymbolList) throw 'Missing fundtion getSymbolList';
        if (!this.init) throw 'Missing fundtion init';

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
                    await Promise.all(promiseList);
                    promiseList = [];
                    await delay(5000);
                }
            }
            await Promise.all(promiseList);

            await delay(1000);
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