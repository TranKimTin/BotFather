import * as antlr from "antlr4ng";
import { BaseErrorListener, CharStream, CommonTokenStream, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { ExprLexer } from './generated/ExprLexer';
import { AddSubContext, AmplContext, AmplPContext, Bb_lowerContext, Bb_middleContext, Bb_upperContext, Bearish_engulfingContext, Bearish_hammerContext, BearishContext, BrokerContext, Bullish_engulfingContext, Bullish_hammerContext, BullishContext, ChangeContext, ChangePContext, CloseContext, ComparisonContext, EmaContext, ExprParser, FloatContext, HighContext, HourContext, IntContext, IRSIContext, LowContext, Lower_shadowContext, Lower_shadowPContext, Macd_histogramContext, Macd_n_dinhContext, Macd_signalContext, Macd_slopeContext, Macd_valueContext, MaContext, MarsiContext, MinuteContext, MulDivContext, NumberContext, OpenContext, ParensContext, Rsi_phan_kiContext, Rsi_slopeContext, RsiContext, StringContext, SymbolContext, TimeframeContext, Upper_shadowContext, Upper_shadowPContext, Volume24h_in_usdContext, VolumeContext } from './generated/ExprParser';
import { ExprVisitor } from './generated/ExprVisitor';
import * as util from './util';
import { RateData } from "./BinanceFuture";
import moment from "moment";

export interface ExprArgs {
    broker: string;
    symbol: string;
    timeframe: string;
    data: Array<RateData>
}

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

export function calculate(condition: string, args: ExprArgs): any {
    // console.log({ condition });
    const inputStream = CharStream.fromString(condition);
    const lexer = new ExprLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new ExprParser(tokenStream);

    parser.removeErrorListeners();
    parser.addErrorListener(new CustomErrorListener());

    try {
        const tree = parser.expr();

        const evalVisitor = new Expr(args);
        const result = evalVisitor.visit(tree);

        // console.log({ tree: tree.toStringTree(parser) });
        // console.log({ result });

        return result;
    }
    catch (err) {
        console.error({ condition }, err);
        return null;
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
        return parseFloat(ctx.toString()) || null;
    };

    visitInt = (ctx: IntContext) => {
        return parseInt(ctx.INT().getText(), 10) || null;
    };

    visitFloat = (ctx: FloatContext) => {
        return parseFloat(ctx.FLOAT().getText()) || null;
    };

    visitString = (ctx: StringContext) => {
        return ctx.STRING().getText();
    };

    visitParens = (ctx: ParensContext) => {
        return this.visit(ctx.expr());
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
                    i++;
                }
            }

            const topCandle = Math.max(this.data[indexMaxPrice].open, this.data[indexMaxPrice].close);

            if (indexMaxPrice != shift && (topCandle - this.data[shift].high) / topCandle > diffCandle0 / 100) {
                return 0;
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
        const shift = parseInt(ctx.INT(0)?.getText() || "0", 10);
        const periodRSI = parseInt(ctx.INT(1)?.getText() || "0", 10);
        const periodMA = parseInt(ctx.INT(2)?.getText() || "0", 10);

        const RSIs = util.iRSI(this.data, periodRSI);
        const fakeData = RSIs.map(item => ({ close: item } as RateData));
        const MARSIs = util.iMA(fakeData, periodMA);

        if (shift >= MARSIs.length) return false;
        return parseFloat(MARSIs[shift].toFixed(2));
    };
}