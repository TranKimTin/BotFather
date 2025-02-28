import { RateData, RateKey } from "./Interface";

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
    private max;
    private period: number;
    private values: Array<number>;
    private key: RateKey;

    constructor(args: { period: number, key: RateKey }) {
        this.max = -Infinity;
        this.values = [];
        this.period = args.period;
        this.key = args.key;
    }

    public nextValue(rate: RateData) {
        this.max = Math.max(this.max, rate[this.key]);
        this.values.push(rate[this.key]);
        if (this.values.length > this.period) {
            const last: number = this.values.shift()!;
            if (last === this.max) {
                this.max = Math.max(...this.values);
            }
        }
        return this.max;
    }
}

export class MinRate {
    private min;
    private period: number;
    private values: Array<number>;
    private key: RateKey;

    constructor(args: { period: number, key: RateKey }) {
        this.min = Infinity;
        this.values = [];
        this.period = args.period;
        this.key = args.key;
    }

    public nextValue(rate: RateData) {
        this.min = Math.min(this.min, rate[this.key]);
        this.values.push(rate[this.key]);
        if (this.values.length > this.period) {
            const last: number = this.values.shift()!;
            if (last === this.min) {
                this.min = Math.min(...this.values);
            }
        }
        return this.min;
    }
}

export class MaxChange {
    private max;
    private period: number;
    private values: Array<number>;
    private byPercent: boolean;

    constructor(args: { period: number, byPercent: boolean }) {
        this.max = -Infinity;
        this.values = [];
        this.period = args.period;
        this.byPercent = args.byPercent;
    }

    public nextValue(rate: RateData) {
        let change = rate.close - rate.open;
        if (this.byPercent) {
            change = change / rate.open * 100;
        }
        this.max = Math.max(this.max, change);
        this.values.push(change);
        if (this.values.length > this.period) {
            const last: number = this.values.shift()!;
            if (last === this.max) {
                this.max = Math.max(...this.values);
            }
        }
        return this.max;
    }
}

export class MinChange {
    private min;
    private period: number;
    private values: Array<number>;
    private byPercent: boolean;

    constructor(args: { period: number, byPercent: boolean }) {
        this.min = Infinity;
        this.values = [];
        this.period = args.period;
        this.byPercent = args.byPercent;
    }

    public nextValue(rate: RateData) {
        let change = rate.close - rate.open;
        if (this.byPercent) {
            change = change / rate.open * 100;
        }
        this.min = Math.min(this.min, change);
        this.values.push(change);
        if (this.values.length > this.period) {
            const last: number = this.values.shift()!;
            if (last === this.min) {
                this.min = Math.min(...this.values);
            }
        }
        return this.min;
    }
}

export class MaxAmpl {
    private max;
    private period: number;
    private values: Array<number>;
    private byPercent: boolean;

    constructor(args: { period: number, byPercent: boolean }) {
        this.max = -Infinity;
        this.values = [];
        this.period = args.period;
        this.byPercent = args.byPercent;
    }

    public nextValue(rate: RateData) {
        let ampl = rate.high - rate.low;
        if (this.byPercent) {
            ampl = ampl / rate.open * 100;
        }
        this.max = Math.max(this.max, ampl);
        this.values.push(ampl);
        if (this.values.length > this.period) {
            const last: number = this.values.shift()!;
            if (last === this.max) {
                this.max = Math.max(...this.values);
            }
        }
        return this.max;
    }
}

export class MinAmpl {
    private min;
    private period: number;
    private values: Array<number>;
    private byPercent: boolean;

    constructor(args: { period: number, byPercent: boolean }) {
        this.min = Infinity;
        this.values = [];
        this.period = args.period;
        this.byPercent = args.byPercent;
    }

    public nextValue(rate: RateData) {
        let ampl = rate.high - rate.low;
        if (this.byPercent) {
            ampl = ampl / rate.open * 100;
        }
        this.min = Math.min(this.min, ampl);
        this.values.push(ampl);
        if (this.values.length > this.period) {
            const last: number = this.values.shift()!;
            if (last === this.min) {
                this.min = Math.min(...this.values);
            }
        }
        return this.min;
    }
}