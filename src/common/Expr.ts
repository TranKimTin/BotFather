import * as antlr from "antlr4ng";
import { BaseErrorListener, CharStream, CommonTokenStream, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { ExprLexer } from './generated/ExprLexer';
import { ABSContext, AddSubContext, AmplContext, AmplPContext, Avg_amplContext, Avg_amplPContext, Avg_closeContext, Avg_highContext, Avg_lowContext, Avg_openContext, Bb_lowerContext, Bb_middleContext, Bb_upperContext, Bearish_engulfingContext, Bearish_hammerContext, BearishContext, BrokerContext, Bull_bear_listContext, Bullish_engulfingContext, Bullish_hammerContext, BullishContext, ChangeContext, ChangePContext, CloseContext, ComparisonContext, DojiContext, EmaContext, ExprParser, FloatContext, HighContext, HourContext, IAvgOpenContext, IntContext, IRSIContext, LowContext, Lower_shadowContext, Lower_shadowPContext, Macd_histogramContext, Macd_n_dinhContext, Macd_signalContext, Macd_slopeContext, Macd_valueContext, MaContext, MarsiContext, Max_amplContext, Max_amplPContext, Max_changeContext, Max_changePContext, Max_closeContext, Max_highContext, Max_lowContext, Max_openContext, Max_rsiContext, MAXContext, Min_amplContext, Min_amplPContext, Min_changeContext, Min_changePContext, Min_closeContext, Min_highContext, Min_lowContext, Min_openContext, Min_rsiContext, MINContext, MinuteContext, MulDivContext, NegativeContext, NumberContext, OpenContext, ParensContext, PositiveContext, Rsi_phan_kiContext, Rsi_slopeContext, RsiContext, StringContext, SymbolContext, TimeframeContext, Upper_shadowContext, Upper_shadowPContext, Volume24h_in_usdContext, VolumeContext } from './generated/ExprParser';
import { ExprVisitor } from './generated/ExprVisitor';
import * as util from '../common/util';
import moment from "moment";
import { ExprArgs, NodeData, NODE_TYPE, RateData } from "../common/Interface";
import * as Cache from './Cache';

export class CustomErrorListener extends BaseErrorListener {
    syntaxError<S extends Token, T extends antlr.ATNSimulator>(recognizer: Recognizer<T>, offendingSymbol: S | null, line: number, column: number, msg: string, e: RecognitionException | null): void {
        let message = `Error encountered at line ${line}, column ${column}\n`;
        message += `${msg}\n`;
        if (offendingSymbol) {
            message += `Offending symbol: ${offendingSymbol.text}`;
        }
        throw message;
    }
}

export class Expr extends ExprVisitor<any> {
    private broker: string;
    private symbol: string;
    private timeframe: string;
    private data: Array<RateData>

    constructor(args: ExprArgs) {
        super();
        this.broker = args.broker;
        this.symbol = args.symbol;
        this.timeframe = args.timeframe;
        this.data = args.data;
    }

    // visit(tree: antlr.ParseTree) {
    //     const timestamp = this.data[0]?.startTime;
    //     const treeText = tree.getText();
    //     if (timestamp && tree.getChildCount() === 1 && isNaN(Number(treeText))) {
    //         const key = `${this.broker}:${this.symbol}:${this.timeframe}:${timestamp / 1000}_${treeText}`;
    //         const cacheValue = Cache.get(key);
    //         if (cacheValue) {
    //             return cacheValue;
    //         }
    //         //else
    //         const value = super.visit(tree);
    //         Cache.set(key, value, 180000);
    //         return value;
    //     }
    //     return super.visit(tree);
    // }

    visitAddSub = (ctx: AddSubContext) => {
        const A = ctx.expr(0);
        const B = ctx.expr(1);

        if (A === null || B === null) return null;

        const left = this.visit(A);
        const right = this.visit(B);
        // console.log({ left, right });
        return ctx.children[1].getText() === '+' ? left + right : left - right;
    };

    visitMulDiv = (ctx: MulDivContext) => {
        const A = ctx.expr(0);
        const B = ctx.expr(1);

        if (A === null || B === null) return null;

        const left = this.visit(A);
        const right = this.visit(B);
        return ctx.children[1].getText() === '*' ? left * right : left / right;
    };

    visitNegative = (ctx: NegativeContext) => {
        return -this.visit(ctx.expr());
    };

    visitPositive = (ctx: PositiveContext) => {
        return +this.visit(ctx.expr());
    };

    visitComparison = (ctx: ComparisonContext) => {
        const A = ctx.expr(0);
        const B = ctx.expr(1);

        if (A === null || B === null) return null;

        const left = this.visit(A);
        const right = this.visit(B);

        switch (ctx.children[1].getText()) {
            case '>':
                return left > right;
            case '>=':
                return left >= right;
            case '<':
                return left < right;
            case '<=':
                return left <= right;
            case '=':
            case '==':
                return left == right;
            default:
                return null;
        }
    };

    visitNumber = (ctx: NumberContext) => {
        const value = parseFloat(ctx.toString());
        return isNaN(value) ? null : value;
    };

    visitInt = (ctx: IntContext) => {
        const value = parseInt(ctx.INT().getText(), 10);
        return isNaN(value) ? null : value;
    };

    visitFloat = (ctx: FloatContext) => {
        const value = parseFloat(ctx.FLOAT().getText());
        return isNaN(value) ? null : value;
    };

    visitString = (ctx: StringContext) => {
        return ctx.STRING().getText();
    };

    visitParens = (ctx: ParensContext) => {
        return this.visit(ctx.expr());
    };

    visitABS = (ctx: ABSContext) => {
        return Math.abs(this.visit(ctx.expr()));
    };

    visitMIN = (ctx: MINContext) => {
        const parmas = [];

        let i = 0;
        while (1) {
            const expr = ctx.expr(i);
            if (expr === null) break;
            const value = this.visit(expr);
            parmas.push(value);
            i++;
        }

        return Math.min(...parmas);
    };

    visitMAX = (ctx: MAXContext) => {
        const parmas = [];

        let i = 0;
        while (1) {
            const expr = ctx.expr(i);
            if (expr === null) break;
            const value = this.visit(expr);
            parmas.push(value);
            i++;
        }

        return Math.max(...parmas);
    };

    visitBroker = (ctx: BrokerContext) => {
        return this.broker;
    };

    visitSymbol = (ctx: SymbolContext) => {
        return this.symbol;
    };

    visitTimeframe = (ctx: TimeframeContext) => {
        return this.timeframe;
    };

    visitHour = (ctx: HourContext) => {
        return parseInt(moment.utc(this.data[0].startTime).format('HH'), 10);
    };

    visitMinute = (ctx: MinuteContext) => {
        return parseInt(moment.utc(this.data[0].startTime).format('mm'), 10);
    };

    visitOpen = (ctx: OpenContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `open out of range. length = ${this.data.length}`;

        return this.data[shift].open;
    };

    visitHigh = (ctx: HighContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `high out of range. length = ${this.data.length}`;

        return this.data[shift].high;
    };

    visitLow = (ctx: LowContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `low out of range. length = ${this.data.length}`;

        return this.data[shift].low;
    };

    visitClose = (ctx: CloseContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `close out of range. length = ${this.data.length}`;

        return this.data[shift].close;
    };

    visitVolume = (ctx: VolumeContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `volume out of range. length = ${this.data.length}`;

        return this.data[shift].volume;
    };

    visitVolume24h_in_usd = (ctx: Volume24h_in_usdContext) => {
        let volume: number = 0;
        for (let i = 0; i < this.data.length; i++) {
            volume += this.data[i].volume * this.data[i].close;
            if ((this.data[i].startTime - this.data[0].startTime) / (60 * 60 * 1000) >= 24) {
                break;
            }
        }
        return volume;
    };

    visitChange = (ctx: ChangeContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `change out of range. length = ${this.data.length}`;

        const change: number = this.data[shift].close - this.data[shift].open;
        return change;
    };

    visitChangeP = (ctx: ChangePContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `change% out of range. length = ${this.data.length}`;

        const change: number = this.data[shift].close - this.data[shift].open;
        return parseFloat((change / this.data[shift].open * 100).toFixed(2));
    };

    visitAmpl = (ctx: AmplContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `ampl out of range. length = ${this.data.length}`;

        const ampl: number = this.data[shift].high - this.data[shift].low;
        return ampl;
    };

    visitAmplP = (ctx: AmplPContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `ampl% out of range. length = ${this.data.length}`;

        const ampl: number = this.data[shift].high - this.data[shift].low;
        return parseFloat((ampl / this.data[shift].open * 100).toFixed(2));
    };

    visitUpper_shadow = (ctx: Upper_shadowContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `upper shadow out of range. length = ${this.data.length}`;

        const diff: number = this.data[shift].high - Math.max(this.data[shift].open, this.data[shift].close);
        return diff;
    };

    visitUpper_shadowP = (ctx: Upper_shadowPContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `upper shadow % out of range. length = ${this.data.length}`;

        const diff: number = this.data[shift].high - Math.max(this.data[shift].open, this.data[shift].close);
        return parseFloat((diff / this.data[shift].open * 100).toFixed(2));
    };

    visitLower_shadow = (ctx: Lower_shadowContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `lower shadow % out of range. length = ${this.data.length}`;

        const diff: number = Math.min(this.data[shift].open, this.data[shift].close) - this.data[shift].low;
        return diff;
    };

    visitLower_shadowP = (ctx: Lower_shadowPContext) => {
        const shift = parseInt(ctx.INT()?.getText() || '0');
        if (shift >= this.data.length) throw `lower shadow % out of range. length = ${this.data.length}`;

        const diff: number = Math.min(this.data[shift].open, this.data[shift].close) - this.data[shift].low;
        return parseFloat((diff / this.data[shift].open * 100).toFixed(2));
    };

    visitRsi = (ctx: RsiContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const RSIs = util.iRSI(this.data, period);
        if (shift >= RSIs.length) throw `RSI out of range. length = ${RSIs.length}`;
        return RSIs[shift];
    };

    visitRsi_slope = (ctx: Rsi_slopeContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const RSIs = util.iRSI(this.data, period);
        if (shift >= RSIs.length - 1) throw `rsi_slope out of range. length = ${RSIs.length}`;

        const diffRSI = RSIs[shift] - RSIs[shift + 1];
        const wide = 3;

        const tan = diffRSI / wide;
        const slope = Math.atan(tan);
        return Math.round(slope / Math.PI * 180);
    };

    visitMa = (ctx: MaContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const MAs = util.iMA(this.data, period);
        if (shift >= MAs.length) throw `ma out of range. length = ${MAs.length}`;

        return MAs[shift];
    };

    visitEMa = (ctx: EmaContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const EMAs = util.iEMA(this.data, period);
        if (shift >= EMAs.length) throw `ema out of range. length = ${EMAs.length}`;

        return EMAs[shift];
    };

    visitMacd_value = (ctx: Macd_valueContext) => {
        const fastPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const slowPeriod = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const signalPeriod = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(3)?.getText() || "0", 10);

        const MACDs = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod);
        if (shift >= MACDs.length) throw `macd_value out of range. length = ${MACDs.length}`;
        if (fastPeriod >= slowPeriod) throw `macd_value period invalid`;

        return MACDs[shift].MACD;
    };

    visitMacd_signal = (ctx: Macd_signalContext) => {
        const fastPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const slowPeriod = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const signalPeriod = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(3)?.getText() || "0", 10);

        const MACDs = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod);
        if (shift >= MACDs.length) throw `macd_signal out of range. length = ${MACDs.length}`;
        if (fastPeriod >= slowPeriod) throw `macd_signal period invalid`;

        return MACDs[shift].signal;
    };

    visitMacd_histogram = (ctx: Macd_histogramContext) => {
        const fastPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const slowPeriod = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const signalPeriod = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(3)?.getText() || "0", 10);

        const MACDs = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod);
        if (shift >= MACDs.length) throw `macd_histogram out of range. length = ${MACDs.length}`;
        if (fastPeriod >= slowPeriod) throw `macd_histogram period invalid`;

        return MACDs[shift].histogram;
    };

    visitBb_upper = (ctx: Bb_upperContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const multiplier = parseFloat(ctx.number()?.getText() || "0");
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const BBs = util.iBB(this.data, period, multiplier);
        if (shift >= BBs.length) throw `bb_upper out of range. length = ${BBs.length}`;

        return BBs[shift].upper;
    };

    visitBb_lower = (ctx: Bb_lowerContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const multiplier = parseFloat(ctx.number()?.getText() || "0");
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const BBs = util.iBB(this.data, period, multiplier);
        if (shift >= BBs.length) throw `bb_upper out of range. length = ${BBs.length}`;

        return BBs[shift].lower;
    };

    visitBb_middle = (ctx: Bb_middleContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const multiplier = parseFloat(ctx.number()?.getText() || "0");
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const BBs = util.iBB(this.data, period, multiplier);
        if (shift >= BBs.length) throw `bb_upper out of range. length = ${BBs.length}`;

        return BBs[shift].middle;
    };

    visitRsi_phan_ki = (ctx: Rsi_phan_kiContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const deviation = parseFloat(ctx.number_(0)?.getText() || "0");
        const depth = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const numberOfPeaks = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const minhDiff = parseFloat(ctx.number_(1)?.getText() || "0");
        const maxRSI = parseFloat(ctx.number_(2)?.getText() || "0");
        const shift = parseInt(ctx.INT(3)?.getText() || "0", 10);

        const rates = this.data.slice(shift);
        const RSIs = util.iRSI(this.data, period);
        const fakeData = RSIs.filter(item => item).map(item => ({ high: item, low: item } as RateData));

        let zigzag = util.iZigZag(fakeData, deviation, depth, false);

        //downtrend
        //rsi đáy sau cao hơn đáy trước
        //giá sau thấp hơn giá trước
        //tạo đủ numberOfPeaks đáy thỏa mãn
        //rsi <= 30
        if (zigzag.length < numberOfPeaks * 2) return 0;
        if (zigzag[0].trend != -1) return 0;
        if (zigzag[0].lowIndex != 1) return 0;

        for (let i = 0; i < numberOfPeaks - 1; i++) {
            const lowIndex = zigzag[i * 2].lowIndex;
            const preLowIndex = zigzag[(i + 1) * 2].lowIndex;
            if (RSIs[lowIndex] - RSIs[preLowIndex] <= minhDiff) return 0;
            if (RSIs[lowIndex] > maxRSI) return 0;
            if (RSIs[preLowIndex] > maxRSI) return 0;
            if (rates[lowIndex].close >= rates[preLowIndex].close) return 0;
        }
        return 1;
    };

    visitMacd_n_dinh = (ctx: Macd_n_dinhContext) => {
        //macd sau < macd trước
        //giá sai > giá trước
        // const [fastPeriod, slowPeriod, signalPeriod, redDepth, depth, enableDivergence, diffCandle0, shift] = params;
        // const diffPercents = params.slice(7);
        // if (diffPercents.length === 0) diffPercents.push(-99999);

        const fastPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const slowPeriod = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const signalPeriod = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const redDepth = parseInt(ctx.INT(3)?.getText() || "0", 10);
        const depth = parseInt(ctx.INT(4)?.getText() || "0", 10);
        const enableDivergence = parseInt(ctx.INT(5)?.getText() || "0", 10);
        const diffCandle0 = parseFloat(ctx.number_(0)?.getText() || "0");
        const shift = parseInt(ctx.INT(6)?.getText() || "0", 10);
        const diffPercents: Array<number> = [];

        for (let i = 1; ctx.number_(i) !== null; i++) {
            diffPercents.push(parseFloat(ctx.number_(i)?.getText() || '0'));
        }

        const values = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod);
        if (shift >= values.length - 1) throw `macd_n_dinh out of range. length = ${values.length}`;
        if (fastPeriod >= slowPeriod) throw `macd_n_dinh period invalid`;

        let i = shift;
        let cnt = 0;
        let n = 0;
        let indexMaxMACD = i, preIndexMaxMACD = i;
        let indexMaxPrice = i, preIndexMaxPrice = i;

        {
            while (i < values.length - 1) {
                if (values[i].MACD <= 0) { break; };
                if (values[i].signal <= 0) { break; };
                if (values[i].histogram >= 0) break;
                if (values[i].MACD > values[indexMaxMACD].MACD) {
                    indexMaxMACD = i;
                }
                if (this.data[i].high > this.data[indexMaxPrice].high) {
                    indexMaxPrice = i;
                }

                const topCandle = Math.max(this.data[i].open, this.data[i].close);

                if (i != shift && (topCandle - this.data[shift].high) / topCandle > diffCandle0 / 100) {
                    return 0;
                }

                i++;
            }

            cnt = 0;
            let check = 0;
            while (i < values.length - 1) {
                if (values[i].MACD <= 0) { check = 3; break; }
                if (values[i].signal <= 0) { check = 3; break; }
                if (values[i].histogram < 0) break;
                if (values[i].MACD > values[indexMaxMACD].MACD) {
                    indexMaxMACD = i;
                }
                if (this.data[i].high > this.data[indexMaxPrice].high) {
                    indexMaxPrice = i;
                }

                const topCandle = Math.max(this.data[i].open, this.data[i].close);

                if (i != shift && (topCandle - this.data[shift].high) / topCandle > diffCandle0 / 100) {
                    return 0;
                }

                cnt++;
                i++;

            }
            if (check === 3) {
                while (i < values.length - 1) {
                    if (values[i].histogram < 0) break;
                    cnt++;
                    if (values[i].MACD > values[indexMaxMACD].MACD) {
                        indexMaxMACD = i;
                    }
                    if (this.data[i].high > this.data[indexMaxPrice].high) {
                        indexMaxPrice = i;
                    }

                    const topCandle = Math.max(this.data[i].open, this.data[i].close);

                    if (i != shift && (topCandle - this.data[shift].high) / topCandle > diffCandle0 / 100) {
                        return 0;
                    }

                    i++;
                }
            }

            n++;
            if (cnt < depth) {
                n--;
            }
            if (check === 3) {
                return n;
            }
        }


        preIndexMaxMACD = i;
        preIndexMaxPrice = i;
        for (; i < values.length - 1; i++) {
            cnt = 0;
            let cntRed = 0;
            let check = 0;
            while (i < values.length - 1) {
                if (values[i].MACD <= 0) { check = 1; break; };
                if (values[i].signal <= 0) { check = 1; break; };
                if (values[i].histogram >= 0) break;
                if (values[i].MACD > values[preIndexMaxMACD].MACD) {
                    preIndexMaxMACD = i;
                }
                if (this.data[i].high > this.data[preIndexMaxPrice].high) {
                    preIndexMaxPrice = i;
                }

                cntRed++;
                i++;

            }

            if (check === 1) {
                return n;
            }
            // if (check === 2) {
            //     value = 0;
            //     break;
            // }

            cnt = 0;
            while (i < values.length - 1) {
                if (values[i].MACD <= 0) { check = 3; break; }
                if (values[i].signal <= 0) { check = 3; break; }
                if (values[i].histogram < 0) break;
                if (values[i].MACD > values[preIndexMaxMACD].MACD) {
                    preIndexMaxMACD = i;
                }
                if (this.data[i].high > this.data[preIndexMaxPrice].high) {
                    preIndexMaxPrice = i;
                }

                cnt++;
                i++;

            }

            if (check === 3) {
                while (i < values.length - 1) {
                    if (values[i].histogram < 0) break;
                    if (values[i].MACD > values[preIndexMaxMACD].MACD) {
                        preIndexMaxMACD = i;
                    }
                    if (this.data[i].high > this.data[preIndexMaxPrice].high) {
                        preIndexMaxPrice = i;
                    }

                    cnt++;
                    i++;
                }
            }
            // console.log({ enableDivergence, preIndexMaxMACD, indexMaxMACD, m1: values[preIndexMaxMACD], m2: values[indexMaxMACD], indexMaxPrice, preIndexMaxPrice, p: data[preIndexMaxPrice], p2: data[indexMaxPrice], diff: diffPercents[0] });

            if (enableDivergence === 1 && values[preIndexMaxMACD].MACD <= values[indexMaxMACD].MACD) {
                return n;
            }
            if (this.data[indexMaxPrice].high - this.data[preIndexMaxPrice].high <= this.data[preIndexMaxPrice].high * diffPercents[0] / 100) {
                return n;
            }
            if (diffPercents.length > 1) diffPercents.shift();
            indexMaxMACD = preIndexMaxMACD;
            indexMaxPrice = preIndexMaxPrice;

            preIndexMaxMACD = i;
            preIndexMaxPrice = i;

            n++;
            if (cnt < depth || cntRed < redDepth) {
                n--;
            }

            if (check === 3) {
                return n;
            }
        }
    };

    visitMacd_slope = (ctx: Macd_slopeContext) => {
        const fastPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const slowPeriod = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const signalPeriod = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(3)?.getText() || "0", 10);

        const MACDs = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod);
        if (shift >= MACDs.length) return false;
        if (fastPeriod >= slowPeriod) return false;

        const MASignals = util.iMA(MACDs.map(item => ({ close: item.MACD } as RateData)), slowPeriod);
        if (shift >= MASignals.length - 1) return false;

        const diffMACD = MACDs[shift].MACD - MACDs[shift + 1].MACD;
        const diffMASignal = Math.abs(MASignals[shift] - MASignals[shift + 1])

        const tan = diffMACD / diffMASignal;
        const slope = Math.atan(tan);

        return Math.round(slope / Math.PI * 180);
    };

    visitBullish_engulfing = (ctx: Bullish_engulfingContext) => {
        const shift = parseInt(ctx.INT()?.getText() || "0", 10);
        if (shift >= this.data.length - 2) return 0;

        return util.isBullishEngulfing(this.data[shift + 1], this.data[shift]) ? 1 : 0;
    };

    visitBearish_engulfing = (ctx: Bearish_engulfingContext) => {
        const shift = parseInt(ctx.INT()?.getText() || "0", 10);
        if (shift >= this.data.length - 2) return 0;

        return util.isBearishEngulfing(this.data[shift + 1], this.data[shift]) ? 1 : 0;
    };

    visitBullish_hammer = (ctx: Bullish_hammerContext) => {
        const shift = parseInt(ctx.INT()?.getText() || "0", 10);
        if (shift >= this.data.length - 1) return 0;

        return util.isBullishHammer(this.data[shift]) ? 1 : 0;
    };

    visitBearish_hammer = (ctx: Bearish_hammerContext) => {
        const shift = parseInt(ctx.INT()?.getText() || "0", 10);
        if (shift >= this.data.length - 1) return 0;

        return util.isBearishHammer(this.data[shift]) ? 1 : 0;
    };

    visitBullish = (ctx: BullishContext) => {
        const shift = parseInt(ctx.INT()?.getText() || "0", 10);
        if (shift > this.data.length - 5) return 0;

        return util.isBullish(this.data, shift) ? 1 : 0;
    };

    visitBearish = (ctx: BearishContext) => {
        const shift = parseInt(ctx.INT()?.getText() || "0", 10);
        if (shift > this.data.length - 5) return 0;

        return util.isBearish(this.data, shift) ? 1 : 0;
    };

    visitMarsi = (ctx: MarsiContext) => {
        const periodRSI = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const periodMA = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(2)?.getText() || "0", 10);

        const RSIs = util.iRSI(this.data, periodRSI);
        const fakeData = RSIs.map(item => ({ close: item } as RateData));
        const MARSIs = util.iMA(fakeData, periodMA);

        if (shift >= MARSIs.length) return false;
        return parseFloat(MARSIs[shift].toFixed(2));
    };

    visitBull_bear_list = (ctx: Bull_bear_listContext) => {
        const shift = parseInt(ctx.INT()?.getText() || "0", 10);
        if (shift > this.data.length - 5) return 0;

        const list = util.listBullBear(this.data, shift);
        return list.join(',');
    };

    visitDoji = (ctx: DojiContext) => {
        const shift = parseInt(ctx.INT()?.getText() || "0", 10);
        if (shift >= this.data.length) return 0;

        return util.iDoji(this.data[shift]) ? 1 : 0;
    };

    visitAvg_open = (ctx: Avg_openContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `avg_open out of range. length = ${this.data.length}`;

        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += this.data[shift + i].open;
        }
        sum /= period;
        return sum;
    };
    visitAvg_high = (ctx: Avg_highContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `avg_high out of range. length = ${this.data.length}`;

        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += this.data[shift + i].high;
        }
        sum /= period;
        return sum;
    };
    visitAvg_low = (ctx: Avg_lowContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `avg_low out of range. length = ${this.data.length}`;

        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += this.data[shift + i].low;
        }
        sum /= period;
        return sum;
    };

    visitAvg_close = (ctx: Avg_closeContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `avg_close out of range. length = ${this.data.length}`;

        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += this.data[shift + i].close;
        }
        sum /= period;
        return sum;
    };

    visitAvg_ampl = (ctx: Avg_amplContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `avg_ampl out of range. length = ${this.data.length}`;

        let sum = 0;
        for (let i = 0; i < period; i++) {
            const ampl = this.data[shift + i].high - this.data[shift + i].low;
            sum += ampl;
        }
        sum /= period;
        return sum;
    };

    visitAvg_amplP = (ctx: Avg_amplPContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `avg_ampl out of range. length = ${this.data.length}`;

        let sum = 0;
        for (let i = 0; i < period; i++) {
            const ampl = this.data[shift + i].high - this.data[shift + i].low;
            sum += (ampl / this.data[shift + i].open * 100);
        }
        sum /= period;
        return sum;
    };

    visitMax_open = (ctx: Max_openContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `max_open out of range. length = ${this.data.length}`;

        let max = this.data[shift].open;
        for (let i = 1; i < period; i++) {
            max = Math.max(max, this.data[shift + i].open);
        }
        return max;
    };

    visitMax_high = (ctx: Max_highContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `max_high out of range. length = ${this.data.length}`;

        let max = this.data[shift].high;
        for (let i = 1; i < period; i++) {
            max = Math.max(max, this.data[shift + i].high);
        }
        return max;
    };

    visitMax_low = (ctx: Max_lowContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `max_low out of range. length = ${this.data.length}`;

        let max = this.data[shift].low;
        for (let i = 1; i < period; i++) {
            max = Math.max(max, this.data[shift + i].low);
        }
        return max;
    };

    visitMax_close = (ctx: Max_closeContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `max_close out of range. length = ${this.data.length}`;

        let max = this.data[shift].close;
        for (let i = 1; i < period; i++) {
            max = Math.max(max, this.data[shift + i].close);
        }
        return max;
    };

    visitMin_open = (ctx: Min_openContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `min_open out of range. length = ${this.data.length}`;

        let min = this.data[shift].open;
        for (let i = 1; i < period; i++) {
            min = Math.min(min, this.data[shift + i].open);
        }
        return min;
    };

    visitMin_high = (ctx: Min_highContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `min_high out of range. length = ${this.data.length}`;

        let min = this.data[shift].high;
        for (let i = 1; i < period; i++) {
            min = Math.min(min, this.data[shift + i].high);
        }
        return min;
    };

    visitMin_low = (ctx: Min_lowContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `min_low out of range. length = ${this.data.length}`;

        let min = this.data[shift].low;
        for (let i = 1; i < period; i++) {
            min = Math.min(min, this.data[shift + i].low);
        }
        return min;
    };

    visitMin_close = (ctx: Min_closeContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `min_close out of range. length = ${this.data.length}`;

        let min = this.data[shift].close;
        for (let i = 1; i < period; i++) {
            min = Math.min(min, this.data[shift + i].close);
        }
        return min;
    };

    visitMin_rsi = (ctx: Min_rsiContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const depth = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(2)?.getText() || "0", 10);

        const RSIs = util.iRSI(this.data, period);

        if (shift + depth >= RSIs.length) throw `min_crsi out of range. length = ${this.data.length}`;

        let min = RSIs[shift];
        for (let i = 1; i < depth; i++) {
            min = Math.min(min, RSIs[shift + i]);
        }
        return min;
    };

    visitMax_rsi = (ctx: Max_rsiContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const depth = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(2)?.getText() || "0", 10);

        const RSIs = util.iRSI(this.data, period);

        if (shift + depth >= RSIs.length) throw `min_crsi out of range. length = ${this.data.length}`;

        let max = RSIs[shift];
        for (let i = 1; i < depth; i++) {
            max = Math.max(max, RSIs[shift + i]);
        }
        return max;
    };

    visitMin_change = (ctx: Min_changeContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `min_change out of range. length = ${this.data.length}`;

        let min = this.data[shift].close - this.data[shift].open;
        for (let i = 1; i < period; i++) {
            const change = this.data[shift + i].close - this.data[shift + i].open;
            min = Math.min(min, change);
        }
        return min;
    };
    visitMax_change = (ctx: Max_changeContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `max_change out of range. length = ${this.data.length}`;

        let max = this.data[shift].close - this.data[shift].open;
        for (let i = 1; i < period; i++) {
            const change = this.data[shift + i].close - this.data[shift + i].open;
            max = Math.max(max, change);
        }
        return max;
    };

    visitMin_changeP = (ctx: Min_changePContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `min_changeP out of range. length = ${this.data.length}`;

        let min = (this.data[shift].close - this.data[shift].open) / this.data[shift].open * 100;
        for (let i = 1; i < period; i++) {
            const change = (this.data[shift + i].close - this.data[shift + i].open) / this.data[shift + i].open * 100;
            min = Math.min(min, change);
        }
        return min;
    };

    visitMax_changeP = (ctx: Max_changePContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `max_changeP out of range. length = ${this.data.length}`;

        let max = (this.data[shift].close - this.data[shift].open) / this.data[shift].open * 100;
        for (let i = 1; i < period; i++) {
            const change = (this.data[shift + i].close - this.data[shift + i].open) / this.data[shift + i].open * 100;
            max = Math.max(max, change);
        }
        return max;
    };

    visitMin_ampl = (ctx: Min_amplContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `min_ampl out of range. length = ${this.data.length}`;

        let min = this.data[shift].high - this.data[shift].low;
        for (let i = 1; i < period; i++) {
            const ampl = this.data[shift + i].high - this.data[shift + i].low;
            min = Math.min(min, ampl);
        }
        return min;
    };

    visitMax_ampl = (ctx: Max_amplContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `max_ampl out of range. length = ${this.data.length}`;

        let max = this.data[shift].high - this.data[shift].low;
        for (let i = 1; i < period; i++) {
            const ampl = this.data[shift + i].high - this.data[shift + i].low;
            max = Math.max(max, ampl);
        }
        return max;
    };

    visitMin_amplP = (ctx: Min_amplPContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `min_amplP out of range. length = ${this.data.length}`;

        let min = (this.data[shift].high - this.data[shift].low) / this.data[shift].open * 100;
        for (let i = 1; i < period; i++) {
            const ampl = (this.data[shift + i].high - this.data[shift + i].low) / this.data[shift + i].open * 100;
            min = Math.min(min, ampl);
        }
        return min;
    };

    visitMax_amplP = (ctx: Max_amplPContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        if (shift + period >= this.data.length) throw `max_amplP out of range. length = ${this.data.length}`;

        let max = (this.data[shift].high - this.data[shift].low) / this.data[shift].open * 100;
        for (let i = 1; i < period; i++) {
            const ampl = (this.data[shift + i].high - this.data[shift + i].low) / this.data[shift + i].open * 100;
            max = Math.max(max, ampl);
        }
        return max;
    };
}


export function calculate(condition: string, args: ExprArgs): any {
    try {
        // const inputStream = CharStream.fromString(condition.toLowerCase().replace(/\s+/g, ''));
        const inputStream = CharStream.fromString(condition.toLowerCase());
        const lexer = new ExprLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ExprParser(tokenStream);

        lexer.removeErrorListeners();
        lexer.addErrorListener(new CustomErrorListener());

        parser.removeErrorListeners();
        parser.addErrorListener(new CustomErrorListener());

        const tree = parser.expr();

        const evalVisitor = new Expr(args);
        const result = evalVisitor.visit(tree);

        // console.log({ tree: tree.toStringTree(parser) });
        // console.log({ result });

        return result;
    }
    catch (err) {
        console.error({ symbol: args.symbol, broker: args.broker, timeframe: args.timeframe, condition }, err);
        return null;
    }
}

function isValidExpr(expr: string): boolean {
    try {
        const inputStream = CharStream.fromString(expr);
        const lexer = new ExprLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ExprParser(tokenStream);

        lexer.removeErrorListeners();
        lexer.addErrorListener(new CustomErrorListener());

        parser.removeErrorListeners();
        parser.addErrorListener(new CustomErrorListener());

        const tree = parser.expr();

        return true;
    }
    catch (err) {
        console.error('expr invalid', { expr }, err);
        return false;
    }
}

function replaceSubExprs(expr: string) {
    const stack: Array<string> = [];
    let s = '';
    for (const i of expr) {
        if (i === '{') {
            stack.push(s);
            s = '';
        }
        else if (i === '}') {
            if (stack.length == 0 || s === '') return '';
            const lastS = stack.pop();
            s = lastS + ' ' + 1;
        }
        else {
            s += i;
        }
    }
    if (stack.length > 1) return '';
    return (stack[0] || '') + s;
}

export function isValidCondition(data: NodeData) {
    if (data.type == NODE_TYPE.START) return true;

    //expr
    if (data.type === NODE_TYPE.EXPR) {
        if (!data.value) return false;

        let expr = data.value.toLowerCase().trim();
        expr = replaceSubExprs(expr);
        if (!expr) return false;

        return isValidExpr(expr);
    }

    //telegram
    if (data.type === NODE_TYPE.TELEGRAM) {
        if (!data.value) return false;

        let expr = data.value.toLowerCase().trim();
        expr = replaceSubExprs(expr);
        if (!expr) return false;

        return true;
    }

    //stop
    if ([NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.stop) return false;
        let expr: string = data.stop;
        expr = replaceSubExprs(expr);
        if (!expr) return false;
        if (!isValidExpr(expr)) return false;
    }

    //entry
    if ([NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.entry) return false;
        let expr: string = data.entry;
        expr = replaceSubExprs(expr);
        if (!expr) return false;
        if (!isValidExpr(expr)) return false;
    }

    //tp
    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.tp) return false;
        let expr: string = data.tp;
        expr = replaceSubExprs(expr);
        if (!expr) return false;
        if (!isValidExpr(expr)) return false;
    }

    //sl
    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.sl) return false;
        let expr: string = data.sl;
        expr = replaceSubExprs(expr);
        if (!expr) return false;
        if (!isValidExpr(expr)) return false;
    }

    //volume
    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.volume) return false;
        let expr: string = data.volume;
        expr = replaceSubExprs(expr);
        if (!expr) return false;
        if (!isValidExpr(expr)) return false;
    }

    //expired time
    if ([NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(data.type)) {
        if (!data.expiredTime) return false;
        let expr: string = data.expiredTime;
        expr = replaceSubExprs(expr);
        if (!expr) return false;
        if (!isValidExpr(expr)) return false;
    }

    if ([NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT, NODE_TYPE.CLOSE_ALL_ORDER, NODE_TYPE.CLOSE_ALL_POSITION].includes(data.type)) {
        return true;
    }
    else {
        return false;
    }
}

export function calculateSubExpr(expr: string, args: ExprArgs) {
    const stack: Array<string> = [];
    let s = '';
    for (const i of expr) {
        if (i === '{') {
            stack.push(s);
            s = '';
        }
        else if (i === '}') {
            if (stack.length == 0 || s === '') throw `Invalid expr ${expr}`;
            const lastS = stack.pop();
            s = lastS + ' ' + calculate(s, args);
        }
        else {
            s += i;
        }
    }
    if (stack.length > 1) throw `Invalid expr ${expr}`;
    return (stack[0] || '') + s;
}

async function test() {
    let broker = 'binance';
    const symbol = 'BTCUSDT';
    const timeframe = '1h';
    const data = (broker == 'binance_future')
        ? await util.getBinanceFutureOHLCV(symbol, timeframe, 300)
        : await util.getBinanceOHLCV(symbol, timeframe, 300);
    data.shift();

    console.log(data[0]);

    const args = {
        broker: broker,
        symbol: symbol,
        timeframe: timeframe,
        data: data
    };

    let condition = "{1+2+3+rsi(14)}";

    condition = calculateSubExpr(condition, args);

    console.log({ condition });

}

// test();