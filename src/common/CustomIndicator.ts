import { DequeItem, MACD_Output, RateData, RateKey } from "./Interface";

export class AvgRate {
    private sum;
    private period: number;
    private values: Array<number>;
    private key: RateKey;

    constructor(args: { period: number, key: RateKey }) {
        this.sum = 0;
        this.values = [];
        this.period = args.period;
        this.key = args.key;
    }

    public nextValue(rate: RateData) {
        this.sum += rate[this.key];
        this.values.push(rate[this.key]);
        if (this.values.length > this.period) {
            this.sum -= this.values.shift()!;
        }
        return this.sum / this.period;
    }
}

export class AvgAmpl {
    private sum;
    private period: number;
    private values: Array<number>;
    private byPercent: boolean;

    constructor(args: { period: number, byPercent: boolean }) {
        this.sum = 0;
        this.values = [];
        this.period = args.period;
        this.byPercent = args.byPercent;
    }

    public nextValue(rate: RateData) {
        let ampl = rate.high - rate.low;
        if (this.byPercent) ampl = ampl / rate.open * 100;

        this.sum += ampl;
        this.values.push(ampl);
        if (this.values.length > this.period) {
            this.sum -= this.values.shift()!;
        }
        return this.sum / this.period;
    }
}


export class MaxRate {
    private period: number;
    private key: RateKey;
    private deque: DequeItem[];
    private currentIndex: number;

    constructor(args: { period: number; key: RateKey }) {
        this.period = args.period;
        this.key = args.key;
        this.deque = [];
        this.currentIndex = -1;
    }


    public nextValue(rate: RateData): number {
        const value = rate[this.key] as number;
        this.currentIndex++;

        while (this.deque.length > 0 && this.deque[0].index <= this.currentIndex - this.period) {
            this.deque.shift();
        }

        while (this.deque.length > 0 && this.deque[this.deque.length - 1].value <= value) {
            this.deque.pop();
        }

        this.deque.push({ value, index: this.currentIndex });

        return this.deque[0].value;
    }
}


export class MinRate {
    private period: number;
    private key: RateKey;
    private deque: DequeItem[];
    private currentIndex: number;

    constructor(args: { period: number; key: RateKey }) {
        this.period = args.period;
        this.key = args.key;
        this.deque = [];
        this.currentIndex = -1;
    }

    public nextValue(rate: RateData): number {
        const value = rate[this.key] as number;
        this.currentIndex++;

        while (this.deque.length > 0 && this.deque[0].index <= this.currentIndex - this.period) {
            this.deque.shift();
        }

        while (this.deque.length > 0 && this.deque[this.deque.length - 1].value >= value) {
            this.deque.pop();
        }

        this.deque.push({ value, index: this.currentIndex });

        return this.deque[0].value;
    }
}

export class MaxChange {
    private period: number;
    private byPercent: boolean;
    private deque: DequeItem[];
    private currentIndex: number;

    constructor(args: { period: number; byPercent: boolean }) {
        this.period = args.period;
        this.byPercent = args.byPercent;
        this.deque = [];
        this.currentIndex = -1;
    }

    public nextValue(rate: RateData): number {
        let change = rate.close - rate.open;
        if (this.byPercent) {
            change = (change / rate.open) * 100;
        }

        this.currentIndex++;

        while (this.deque.length > 0 && this.deque[0].index <= this.currentIndex - this.period) {
            this.deque.shift();
        }

        while (this.deque.length > 0 && this.deque[this.deque.length - 1].value <= change) {
            this.deque.pop();
        }

        this.deque.push({ value: change, index: this.currentIndex });

        return this.deque[0].value;
    }
}

export class MinChange {
    private period: number;
    private byPercent: boolean;
    private deque: DequeItem[];
    private currentIndex: number;

    constructor(args: { period: number; byPercent: boolean }) {
        this.period = args.period;
        this.byPercent = args.byPercent;
        this.deque = [];
        this.currentIndex = -1;
    }

    public nextValue(rate: RateData): number {
        let change = rate.close - rate.open;
        if (this.byPercent) {
            change = (change / rate.open) * 100;
        }
        this.currentIndex++;

        while (this.deque.length > 0 && this.deque[0].index <= this.currentIndex - this.period) {
            this.deque.shift();
        }

        while (this.deque.length > 0 && this.deque[this.deque.length - 1].value >= change) {
            this.deque.pop();
        }

        this.deque.push({ value: change, index: this.currentIndex });

        return this.deque[0].value;
    }
}

export class MaxAmpl {
    private period: number;
    private byPercent: boolean;
    private deque: DequeItem[];
    private currentIndex: number;

    constructor(args: { period: number; byPercent: boolean }) {
        this.period = args.period;
        this.byPercent = args.byPercent;
        this.deque = [];
        this.currentIndex = -1; // Nến đầu tiên có index = 0
    }

    public nextValue(rate: RateData): number {
        let ampl = rate.high - rate.low;
        if (this.byPercent) {
            ampl = (ampl / rate.open) * 100;
        }
        this.currentIndex++;

        while (this.deque.length > 0 && this.deque[0].index <= this.currentIndex - this.period) {
            this.deque.shift();
        }

        while (this.deque.length > 0 && this.deque[this.deque.length - 1].value <= ampl) {
            this.deque.pop();
        }

        this.deque.push({ value: ampl, index: this.currentIndex });

        return this.deque[0].value;
    }
}

export class MinAmpl {
    private period: number;
    private byPercent: boolean;
    private deque: DequeItem[];
    private currentIndex: number;

    constructor(args: { period: number; byPercent: boolean }) {
        this.period = args.period;
        this.byPercent = args.byPercent;
        this.deque = [];
        this.currentIndex = -1;
    }

    public nextValue(rate: RateData): number {
        let ampl = rate.high - rate.low;
        if (this.byPercent) {
            ampl = (ampl / rate.open) * 100;
        }
        this.currentIndex++;

        while (this.deque.length > 0 && this.deque[0].index <= this.currentIndex - this.period) {
            this.deque.shift();
        }

        while (this.deque.length > 0 && this.deque[this.deque.length - 1].value >= ampl) {
            this.deque.pop();
        }

        this.deque.push({ value: ampl, index: this.currentIndex });

        return this.deque[0].value;
    }
}

export class RSI {
    private period: number;
    private count: number;
    private prevClose: number | null;
    private gains: number[];
    private losses: number[];
    private avgGain: number;
    private avgLoss: number;

    constructor(args: { period: number }) {
        this.period = args.period;
        this.count = 0;
        this.prevClose = null;
        this.gains = [];
        this.losses = [];
        this.avgGain = 0;
        this.avgLoss = 0;
    }

    public nextValue(rate: RateData): number {
        const close = rate.close;

        if (this.prevClose === null) {
            this.prevClose = close;
            this.count++;
            return 0;
        }

        const delta = close - this.prevClose;
        this.prevClose = close;

        const gain = delta > 0 ? delta : 0;
        const loss = delta < 0 ? Math.abs(delta) : 0;

        this.gains.push(gain);
        this.losses.push(loss);
        this.count++;

        if (this.count < this.period + 1) {
            return 0;
        }
        else if (this.count === this.period + 1) {
            this.avgGain = this.gains.reduce((acc, val) => acc + val, 0) / this.period;
            this.avgLoss = this.losses.reduce((acc, val) => acc + val, 0) / this.period;
        }
        else {
            this.avgGain = (this.avgGain * (this.period - 1) + gain) / this.period;
            this.avgLoss = (this.avgLoss * (this.period - 1) + loss) / this.period;
        }

        let rsi: number;
        if (this.avgLoss === 0) {
            rsi = 100;
        } else {
            const rs = this.avgGain / this.avgLoss;
            rsi = 100 - (100 / (1 + rs));
        }
        return rsi;
    }
}

export class SMA {
    private period: number;
    private values: number[];
    private sum: number;

    constructor(args: { period: number }) {
        this.period = args.period;
        this.values = [];
        this.sum = 0;
    }

    public nextValue(rate: RateData): number {
        const close = rate.close;
        this.values.push(close);
        this.sum += close;

        if (this.values.length < this.period) {
            return 0;
        }
        else if (this.values.length > this.period) {
            this.sum -= this.values.shift()!;
        }

        const ma = this.sum / this.period;
        return ma;
    }
}

export class EMA {
    private period: number;
    private multiplier: number;
    private ema: number;
    private values: number[];

    constructor(args: { period: number }) {
        this.period = args.period;
        this.multiplier = 2 / (args.period + 1);
        this.ema = 0;
        this.values = [];
    }

    public nextValue(rate: RateData): number {
        const close = rate.close;

        if (this.ema === 0) {
            this.values.push(close);
            if (this.values.length < this.period) {
                return 0;
            }
            const sum = this.values.reduce((acc, val) => acc + val, 0);
            this.ema = sum / this.period;
        } else {
            this.ema = (close - this.ema) * this.multiplier + this.ema;
        }

        return this.ema;
    }
}

export class MACD {
    private shortEma: EMA;
    private longEma: EMA;
    private signalEma: EMA;

    constructor(args: {
        fastPeriod: number;
        slowPeriod: number;
        signalPeriod: number;
    }) {
        this.shortEma = new EMA({ period: args.fastPeriod });
        this.longEma = new EMA({ period: args.slowPeriod });
        this.signalEma = new EMA({ period: args.signalPeriod });
    }

    public nextValue(rate: RateData): MACD_Output {
        const shortVal = this.shortEma.nextValue(rate);
        const longVal = this.longEma.nextValue(rate);

        if (shortVal === 0 || longVal === 0) {
            return { MACD: 0, signal: 0, histogram: 0 };
        }

        const macd = shortVal - longVal;

        const signal = this.signalEma.nextValue({ close: macd } as RateData);
        if (signal === 0) {
            return { MACD: 0, signal: 0, histogram: 0 };
        }

        const histogram = macd - signal;

        return {
            MACD: macd,
            signal: signal,
            histogram: histogram,
        };
    }
}

export class BollingerBands {
    private period: number;
    private multiplier: number;
    private values: number[];

    constructor(args: { period: number; stdDev: number }) {
        this.period = args.period;
        this.multiplier = args.stdDev;
        this.values = [];
    }

    public nextValue(rate: RateData): { middle: number; upper: number; lower: number } {
        const close = rate.close;
        this.values.push(close);

        if (this.values.length > this.period) {
            this.values.shift();
        }

        if (this.values.length < this.period) {
            return { middle: 0, upper: 0, lower: 0 };
        }

        const sum = this.values.reduce((acc, val) => acc + val, 0);
        const middle = sum / this.period;

        const variance = this.values.reduce((acc, val) => acc + Math.pow(val - middle, 2), 0) / this.period;
        const stdDev = Math.sqrt(variance);

        const upper = middle + this.multiplier * stdDev;
        const lower = middle - this.multiplier * stdDev;

        return {
            middle: middle,
            upper: upper,
            lower: lower
        };
    }
}

export class ATR {
    private period: number;
    private trValues: number[];
    private atr: number;
    private previousClose: number;

    constructor(args: { period: number }) {
        this.period = args.period;
        this.trValues = [];
        this.atr = 0;
        this.previousClose = 0;
    }

    public nextValue(rate: RateData): number {
        let tr: number;

        if (this.previousClose === 0) {
            tr = rate.high - rate.low;
        }
        else {
            tr = Math.max(
                rate.high - rate.low,
                Math.abs(rate.high - this.previousClose),
                Math.abs(rate.low - this.previousClose)
            );
        }

        this.previousClose = rate.close;

        if (this.atr === 0) {
            this.trValues.push(tr);
            if (this.trValues.length < this.period) {
                return 0;
            }
            if (this.trValues.length === this.period) {
                this.atr = this.trValues.reduce((acc, val) => acc + val, 0) / this.period;
            }
        } else {
            this.atr = ((this.atr * (this.period - 1)) + tr) / this.period;
        }

        return this.atr;
    }
}

export class MaxRsi {
    private maxPeriod: number;
    private rsiCalculator: RSI;
    private deque: DequeItem[];
    private currentIndex: number;

    constructor(args: { period: number; rsiPeriod: number }) {
        this.maxPeriod = args.period;
        this.rsiCalculator = new RSI({ period: args.rsiPeriod });
        this.deque = [];
        this.currentIndex = -1;
    }

    public nextValue(rate: RateData): number {
        const rsi = this.rsiCalculator.nextValue(rate);
        if (rsi === 0) return 0;

        this.currentIndex++;

        while (this.deque.length > 0 && this.deque[0].index <= this.currentIndex - this.maxPeriod) {
            this.deque.shift();
        }

        while (this.deque.length > 0 && this.deque[this.deque.length - 1].value <= rsi) {
            this.deque.pop();
        }

        this.deque.push({ value: rsi, index: this.currentIndex });

        return this.deque[0].value;
    }
}

export class MinRsi {
    private minPeriod: number;
    private rsiCalculator: RSI;
    private deque: DequeItem[];
    private currentIndex: number;

    constructor(args: { period: number; rsiPeriod: number }) {
        this.minPeriod = args.period;
        this.rsiCalculator = new RSI({ period: args.rsiPeriod });
        this.deque = [];
        this.currentIndex = -1;
    }

    public nextValue(rate: RateData): number {
        const rsi = this.rsiCalculator.nextValue(rate);
        if (rsi === 0) return 0;

        this.currentIndex++;

        while (this.deque.length > 0 && this.deque[0].index <= this.currentIndex - this.minPeriod) {
            this.deque.shift();
        }

        while (this.deque.length > 0 && this.deque[this.deque.length - 1].value >= rsi) {
            this.deque.pop();
        }

        this.deque.push({ value: rsi, index: this.currentIndex });

        return this.deque[0].value;
    }
}

export class AvgRsi {
    private avgPeriod: number;
    private rsiCalculator: RSI;
    private values: number[];
    private sum: number;

    constructor(args: { period: number; rsiPeriod: number }) {
        this.avgPeriod = args.period;
        this.rsiCalculator = new RSI({ period: args.rsiPeriod });
        this.values = [];
        this.sum = 0;
    }

    public nextValue(rate: RateData): number {
        const rsi = this.rsiCalculator.nextValue(rate);
        if (rsi === 0) return 0;

        this.values.push(rsi);
        this.sum += rsi;

        if (this.values.length > this.avgPeriod) {
            this.sum -= this.values.shift()!;
        }

        if (this.values.length < this.avgPeriod) return 0;
        return this.sum / this.values.length;
    }
}