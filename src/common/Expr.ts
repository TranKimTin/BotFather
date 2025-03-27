import * as antlr from "antlr4ng";
import { BaseErrorListener, CharStream, CommonTokenStream, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { ExprLexer } from './generated/ExprLexer';
import { ABSContext, AddSubContext, AmplContext, AmplPContext, Avg_amplContext, Avg_amplPContext, Avg_closeContext, Avg_highContext, Avg_lowContext, Avg_openContext, Bb_lowerContext, Bb_middleContext, Bb_upperContext, Bearish_engulfingContext, Bearish_hammerContext, BearishContext, BrokerContext, Bull_bear_listContext, Bullish_engulfingContext, Bullish_hammerContext, BullishContext, ChangeContext, ChangePContext, CloseContext, ComparisonContext, DojiContext, EmaContext, ExprContext, ExprParser, FloatContext, HighContext, HourContext, IAvgOpenContext, IntContext, IRSIContext, LowContext, Lower_shadowContext, Lower_shadowPContext, Macd_histogramContext, Macd_n_dinhContext, Macd_signalContext, Macd_slopeContext, Macd_valueContext, MaContext, MarsiContext, Max_amplContext, Max_amplPContext, Max_changeContext, Max_changePContext, Max_closeContext, Max_highContext, Max_lowContext, Max_openContext, Max_rsiContext, MAXContext, Min_amplContext, Min_amplPContext, Min_changeContext, Min_changePContext, Min_closeContext, Min_highContext, Min_lowContext, Min_openContext, Min_rsiContext, MINContext, MinuteContext, MulDivContext, NegativeContext, NumberContext, OpenContext, ParensContext, PositiveContext, Rsi_slopeContext, RsiContext, StringContext, SymbolContext, TimeframeContext, Upper_shadowContext, Upper_shadowPContext, Volume24h_in_usdContext, VolumeContext } from './generated/ExprParser';
import { ExprVisitor } from './generated/ExprVisitor';
import * as util from '../common/util';
import moment from "moment";
import { ExprArgs, NodeData, NODE_TYPE, RateData, MAX_CANDLE, CacheIndicator } from "../common/Interface";
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
    private data: Array<RateData>;
    private cacheIndicator: CacheIndicator;

    constructor(args: ExprArgs) {
        super();
        this.broker = args.broker;
        this.symbol = args.symbol;
        this.timeframe = args.timeframe;
        this.data = args.data;
        this.cacheIndicator = args.cacheIndicator;
    }

    // visit(tree: antlr.ParseTree) {
    //     const timestamp = this.data[0]?.startTime;
    //     const treeText = tree.getText();
    //     if (timestamp && tree.getChildCount() === 1 && isNaN(Number(treeText))) {
    //         const key = `${treeText}_${this.broker}:${this.symbol}:${this.timeframe}:${timestamp / 1000}`;
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
        return change / this.data[shift].open * 100;
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
        return ampl / this.data[shift].open * 100;
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
        return diff / this.data[shift].open * 100;
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
        return diff / this.data[shift].open * 100;
    };

    visitRsi = (ctx: RsiContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const RSIs = util.iRSI(this.data, period, this.cacheIndicator);
        if (shift >= RSIs.length) throw `RSI out of range. length = ${RSIs.length}`;
        return RSIs[shift];
    };

    visitRsi_slope = (ctx: Rsi_slopeContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const RSIs = util.iRSI(this.data, period, this.cacheIndicator);
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
        const MAs = util.iMA(this.data, period, this.cacheIndicator);
        if (shift >= MAs.length) throw `ma out of range. length = ${MAs.length}`;

        return MAs[shift];
    };

    visitEma = (ctx: EmaContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const EMAs = util.iEMA(this.data, period, this.cacheIndicator);
        if (shift >= EMAs.length) throw `ema out of range. length = ${EMAs.length}`;

        return EMAs[shift];
    };

    visitMacd_value = (ctx: Macd_valueContext) => {
        const fastPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const slowPeriod = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const signalPeriod = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(3)?.getText() || "0", 10);

        const MACDs = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod, this.cacheIndicator);
        if (shift >= MACDs.length) throw `macd_value out of range. length = ${MACDs.length}`;
        if (fastPeriod >= slowPeriod) throw `macd_value period invalid`;

        return MACDs[shift].MACD;
    };

    visitMacd_signal = (ctx: Macd_signalContext) => {
        const fastPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const slowPeriod = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const signalPeriod = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(3)?.getText() || "0", 10);

        const MACDs = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod, this.cacheIndicator);
        if (shift >= MACDs.length) throw `macd_signal out of range. length = ${MACDs.length}`;
        if (fastPeriod >= slowPeriod) throw `macd_signal period invalid`;

        return MACDs[shift].signal;
    };

    visitMacd_histogram = (ctx: Macd_histogramContext) => {
        const fastPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const slowPeriod = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const signalPeriod = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const shift = parseInt(ctx.INT(3)?.getText() || "0", 10);

        const MACDs = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod, this.cacheIndicator);
        if (shift >= MACDs.length) throw `macd_histogram out of range. length = ${MACDs.length}`;
        if (fastPeriod >= slowPeriod) throw `macd_histogram period invalid`;

        return MACDs[shift].histogram;
    };

    visitBb_upper = (ctx: Bb_upperContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const multiplier = parseFloat(ctx.number()?.getText() || "0");
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const BBs = util.iBB(this.data, period, multiplier, this.cacheIndicator);
        if (shift >= BBs.length) throw `bb_upper out of range. length = ${BBs.length}`;

        return BBs[shift].upper;
    };

    visitBb_lower = (ctx: Bb_lowerContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const multiplier = parseFloat(ctx.number()?.getText() || "0");
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const BBs = util.iBB(this.data, period, multiplier, this.cacheIndicator);
        if (shift >= BBs.length) throw `bb_upper out of range. length = ${BBs.length}`;

        return BBs[shift].lower;
    };

    visitBb_middle = (ctx: Bb_middleContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const multiplier = parseFloat(ctx.number()?.getText() || "0");
        const shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const BBs = util.iBB(this.data, period, multiplier, this.cacheIndicator);
        if (shift >= BBs.length) throw `bb_upper out of range. length = ${BBs.length}`;

        return BBs[shift].middle;
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

        const values = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod, this.cacheIndicator);
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

        const MACDs = util.iMACD(this.data, fastPeriod, slowPeriod, signalPeriod, this.cacheIndicator);
        if (shift >= MACDs.length) return false;
        if (fastPeriod >= slowPeriod) return false;

        const MASignals = util.iMA(MACDs.map(item => ({ close: item.MACD } as RateData)), slowPeriod, this.cacheIndicator);
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
        const from = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(2)?.getText() || "0", 10);

        const periodMA = Math.abs(from - to);
        const shift = to;
        const avgRsis = util.iAvgRSI(this.data, periodRSI, periodMA, this.cacheIndicator);

        if (shift >= avgRsis.length) throw `avg_rsi out of range. length = ${avgRsis.length}`;

        return avgRsis[shift];
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
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const avgs = util.iAvgRate(this.data, period, 'open', this.cacheIndicator);
        if (shift >= avgs.length) throw `avg_open out of range. length = ${this.data.length}`;

        return avgs[shift];
    };
    visitAvg_high = (ctx: Avg_highContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const avgs = util.iAvgRate(this.data, period, 'high', this.cacheIndicator);
        if (shift >= avgs.length) throw `avg_high out of range. length = ${this.data.length}`;

        return avgs[shift];
    };
    visitAvg_low = (ctx: Avg_lowContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const avgs = util.iAvgRate(this.data, period, 'low', this.cacheIndicator);
        if (shift >= avgs.length) throw `avg_low out of range. length = ${this.data.length}`;

        return avgs[shift];
    };

    visitAvg_close = (ctx: Avg_closeContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const avgs = util.iAvgRate(this.data, period, 'close', this.cacheIndicator);
        if (shift >= avgs.length) throw `avg_close out of range. length = ${this.data.length}`;

        return avgs[shift];
    };

    visitAvg_ampl = (ctx: Avg_amplContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        let avgs = util.iAvgAmpl(this.data, period, false, this.cacheIndicator);
        if (shift >= avgs.length) throw `avg_ampl out of range. length = ${this.data.length}`;

        return avgs[shift];
    };

    visitAvg_amplP = (ctx: Avg_amplPContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        let avgs = util.iAvgAmpl(this.data, period, true, this.cacheIndicator);
        if (shift >= avgs.length) throw `avg_amplP out of range. length = ${this.data.length}`;

        return avgs[shift];
    };

    visitMax_open = (ctx: Max_openContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const maxs = util.iMaxRate(this.data, period, 'open', this.cacheIndicator);
        if (shift >= maxs.length) throw `max_open out of range. length = ${this.data.length}`;
        return maxs[shift];
    };

    visitMax_high = (ctx: Max_highContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const maxs = util.iMaxRate(this.data, period, 'high', this.cacheIndicator);
        if (shift >= maxs.length) throw `max_high out of range. length = ${this.data.length}`;
        return maxs[shift];
    };

    visitMax_low = (ctx: Max_lowContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const maxs = util.iMaxRate(this.data, period, 'low', this.cacheIndicator);
        if (shift >= maxs.length) throw `max_lơ out of range. length = ${this.data.length}`;
        return maxs[shift];
    };

    visitMax_close = (ctx: Max_closeContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const maxs = util.iMaxRate(this.data, period, 'close', this.cacheIndicator);
        if (shift >= maxs.length) throw `max_close out of range. length = ${this.data.length}`;
        return maxs[shift];
    };

    visitMin_open = (ctx: Min_openContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const mins = util.iMinRate(this.data, period, 'open', this.cacheIndicator);
        if (shift >= mins.length) throw `min_open out of range. length = ${this.data.length}`;
        return mins[shift];
    };

    visitMin_high = (ctx: Min_highContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const mins = util.iMinRate(this.data, period, 'high', this.cacheIndicator);
        if (shift >= mins.length) throw `min_high out of range. length = ${this.data.length}`;
        return mins[shift];
    };

    visitMin_low = (ctx: Min_lowContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const mins = util.iMinRate(this.data, period, 'low', this.cacheIndicator);
        if (shift >= mins.length) throw `min_low out of range. length = ${this.data.length}`;
        return mins[shift];
    };

    visitMin_close = (ctx: Min_closeContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const mins = util.iMinRate(this.data, period, 'close', this.cacheIndicator);
        if (shift >= mins.length) throw `min_close out of range. length = ${this.data.length}`;
        return mins[shift];
    };

    visitMin_rsi = (ctx: Min_rsiContext) => {
        const rsiPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const from = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const depth = Math.abs(from - to);
        const shift = to;

        const MinRSIs = util.iMinRSI(this.data, rsiPeriod, depth, this.cacheIndicator);
        if (shift >= MinRSIs.length) throw `min_rsi out of range. length = ${this.data.length}`;

        return MinRSIs[shift];
    };

    visitMax_rsi = (ctx: Max_rsiContext) => {
        const rsiPeriod = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const from = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(2)?.getText() || "0", 10);
        const depth = Math.abs(from - to);
        const shift = to;

        const MaxRSIs = util.iMaxRSI(this.data, rsiPeriod, depth, this.cacheIndicator);
        if (shift >= MaxRSIs.length) throw `max_rsi out of range. length = ${this.data.length}`;

        return MaxRSIs[shift];
    };

    visitMin_change = (ctx: Min_changeContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const mins = util.iMinChange(this.data, period, false, this.cacheIndicator);
        if (shift >= mins.length) throw `min_change out of range. length = ${this.data.length}`;
        return mins[shift];
    };
    visitMax_change = (ctx: Max_changeContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const maxs = util.iMaxChange(this.data, period, false, this.cacheIndicator)
        if (shift >= maxs.length) throw `max_change out of range. length = ${this.data.length}`;
        return maxs[shift];
    };

    visitMin_changeP = (ctx: Min_changePContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const mins = util.iMinChange(this.data, period, true, this.cacheIndicator);
        if (shift >= mins.length) throw `min_changeP out of range. length = ${this.data.length}`;
        return mins[shift];
    };

    visitMax_changeP = (ctx: Max_changePContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const maxs = util.iMaxChange(this.data, period, true, this.cacheIndicator)
        if (shift >= maxs.length) throw `max_changeP out of range. length = ${this.data.length}`;
        return maxs[shift];
    };

    visitMin_ampl = (ctx: Min_amplContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const mins = util.iMinAmpl(this.data, period, false, this.cacheIndicator);
        if (shift >= this.data.length) throw `min_ampl out of range. length = ${this.data.length}`;
        return mins[shift];
    };

    visitMax_ampl = (ctx: Max_amplContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const maxs = util.iMaxAmpl(this.data, period, false, this.cacheIndicator);
        if (shift >= this.data.length) throw `max_ampl out of range. length = ${this.data.length}`;
        return maxs[shift];
    };

    visitMin_amplP = (ctx: Min_amplPContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const mins = util.iMinAmpl(this.data, period, true, this.cacheIndicator);
        if (shift >= this.data.length) throw `min_amplP out of range. length = ${this.data.length}`;
        return mins[shift];
    };

    visitMax_amplP = (ctx: Max_amplPContext) => {
        const from = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const to = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const period = Math.abs(from - to);
        const shift = to;

        const maxs = util.iMaxAmpl(this.data, period, true, this.cacheIndicator);
        if (shift >= this.data.length) throw `max_amplP out of range. length = ${this.data.length}`;
        return maxs[shift];
    };
}

const cacheParseTree: { [key: string]: ExprContext } = {};

export function getParseTree(condition: string): ExprContext {
    let tree = cacheParseTree[condition];
    if (!tree) {
        const inputStream = CharStream.fromString(condition.toLowerCase());
        const lexer = new ExprLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ExprParser(tokenStream);

        lexer.removeErrorListeners();
        lexer.addErrorListener(new CustomErrorListener());

        parser.removeErrorListeners();
        parser.addErrorListener(new CustomErrorListener());

        tree = parser.expr();

        cacheParseTree[condition] = tree;
    }
    return tree;
}

export function calculate(condition: string, args: ExprArgs): any {
    try {
        // const inputStream = CharStream.fromString(condition.toLowerCase().replace(/\s+/g, ''));

        const tree = getParseTree(condition)

        const evalVisitor = new Expr(args);
        const result = evalVisitor.visit(tree);
        // console.log({ tree: tree.toStringTree(parser) });
        // console.log({ result });

        return result;
    }
    catch (err) {
        // console.error({ symbol: args.symbol, broker: args.broker, timeframe: args.timeframe, condition }, err);
        return null;
    }
}

function isValidExpr(expr: string): boolean {
    try {
        let tree = cacheParseTree[expr];
        if (!tree) {
            const inputStream = CharStream.fromString(expr);
            const lexer = new ExprLexer(inputStream);
            const tokenStream = new CommonTokenStream(lexer);
            const parser = new ExprParser(tokenStream);

            lexer.removeErrorListeners();
            lexer.addErrorListener(new CustomErrorListener());

            parser.removeErrorListeners();
            parser.addErrorListener(new CustomErrorListener());

            tree = parser.expr();

            cacheParseTree[expr] = tree;
        }


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
    let broker = 'binance_future';
    const symbol = 'BTCUSDT';
    const timeframe = '1h';
    const data = (broker == 'binance_future')
        ? await util.getBinanceFutureOHLCV(symbol, timeframe, MAX_CANDLE)
        : await util.getBinanceOHLCV(symbol, timeframe, MAX_CANDLE);
    data.shift();

    console.log(data[0]);

    const args = {
        broker: broker,
        symbol: symbol,
        timeframe: timeframe,
        data: data,
        cacheIndicator: {}
    };

    let condition = "{rsi(24)} {rsi(12)}";

    condition = calculateSubExpr(condition, args);

    console.log({ condition });

}

// test();