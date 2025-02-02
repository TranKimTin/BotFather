import * as util from '../common/util';
import moment from 'moment';
import delay from 'delay';
import { RateData } from '../common/Interface';

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
    protected getOHLCV?: (symbol: string, timeframe: string) => Promise<Array<RateData>>;
    protected init?: () => void;
    

    constructor(timeframes: Array<string>, broker: string, symbolLoadConcurrent: number) {
        this.broker = broker;
        this.timeframes = timeframes;
        this.symbolLoadConcurrent = symbolLoadConcurrent;

        this.gData = {};
        this.gLastPrice = {};
        this.gLastUpdated = {};
        this.symbolList = [];
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
            if (dataList[1] && !dataList[1].isFinal) {
                dataList[1].isFinal = true;
                console.log('forces final', dataList[1]);
                this.onCloseCandle(this.broker, data.symbol, data.interval, dataList.slice(1));
            }
        }
        else {
            console.log('merge error');
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

        const rates = await this.getOHLCV(symbol, timeframe);;
        const lastData = this.gData[symbol][timeframe].reverse();
        this.gData[symbol][timeframe] = rates;
        this.gLastPrice[symbol] = this.gData[symbol][timeframe][0]?.close || 0;

        for (const data of lastData) {
            const lastRate = this.gData[symbol][timeframe][0];
            if (data.startTime >= lastRate.startTime) {
                this.mergeData(data, data.isFinal);
            }
        }
    }

    public getData(symbol: string, timeframe: string) {
        if (!this.gData || !this.gData[symbol] || !this.gData[symbol][timeframe]) return [];
        return this.gData[symbol][timeframe];
    }

    public SetOnCloseCandle(onCloseCandle: (broker: string, symbol: string, timeframe: string, data: Array<RateData>) => void) {
        this.onCloseCandle = onCloseCandle;
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