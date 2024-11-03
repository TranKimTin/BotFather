// Generated from src/common/Expr.g4 by ANTLR 4.13.1

import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { ExprVisitor } from "./ExprVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class ExprParser extends antlr.Parser {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly T__4 = 5;
    public static readonly T__5 = 6;
    public static readonly T__6 = 7;
    public static readonly T__7 = 8;
    public static readonly T__8 = 9;
    public static readonly T__9 = 10;
    public static readonly T__10 = 11;
    public static readonly T__11 = 12;
    public static readonly T__12 = 13;
    public static readonly T__13 = 14;
    public static readonly T__14 = 15;
    public static readonly T__15 = 16;
    public static readonly T__16 = 17;
    public static readonly T__17 = 18;
    public static readonly T__18 = 19;
    public static readonly T__19 = 20;
    public static readonly T__20 = 21;
    public static readonly T__21 = 22;
    public static readonly T__22 = 23;
    public static readonly T__23 = 24;
    public static readonly T__24 = 25;
    public static readonly T__25 = 26;
    public static readonly T__26 = 27;
    public static readonly T__27 = 28;
    public static readonly T__28 = 29;
    public static readonly T__29 = 30;
    public static readonly T__30 = 31;
    public static readonly T__31 = 32;
    public static readonly T__32 = 33;
    public static readonly T__33 = 34;
    public static readonly T__34 = 35;
    public static readonly T__35 = 36;
    public static readonly T__36 = 37;
    public static readonly T__37 = 38;
    public static readonly T__38 = 39;
    public static readonly T__39 = 40;
    public static readonly T__40 = 41;
    public static readonly T__41 = 42;
    public static readonly T__42 = 43;
    public static readonly T__43 = 44;
    public static readonly T__44 = 45;
    public static readonly T__45 = 46;
    public static readonly T__46 = 47;
    public static readonly T__47 = 48;
    public static readonly T__48 = 49;
    public static readonly T__49 = 50;
    public static readonly T__50 = 51;
    public static readonly T__51 = 52;
    public static readonly T__52 = 53;
    public static readonly T__53 = 54;
    public static readonly INT = 55;
    public static readonly FLOAT = 56;
    public static readonly STRING = 57;
    public static readonly WS = 58;
    public static readonly RULE_expr = 0;
    public static readonly RULE_broker = 1;
    public static readonly RULE_symbol = 2;
    public static readonly RULE_timeframe = 3;
    public static readonly RULE_hour = 4;
    public static readonly RULE_minute = 5;
    public static readonly RULE_open = 6;
    public static readonly RULE_high = 7;
    public static readonly RULE_low = 8;
    public static readonly RULE_close = 9;
    public static readonly RULE_volume = 10;
    public static readonly RULE_volume24h_in_usd = 11;
    public static readonly RULE_change = 12;
    public static readonly RULE_changeP = 13;
    public static readonly RULE_ampl = 14;
    public static readonly RULE_amplP = 15;
    public static readonly RULE_upper_shadow = 16;
    public static readonly RULE_upper_shadowP = 17;
    public static readonly RULE_lower_shadow = 18;
    public static readonly RULE_lower_shadowP = 19;
    public static readonly RULE_rsi = 20;
    public static readonly RULE_rsi_slope = 21;
    public static readonly RULE_ma = 22;
    public static readonly RULE_ema = 23;
    public static readonly RULE_macd_value = 24;
    public static readonly RULE_macd_signal = 25;
    public static readonly RULE_macd_histogram = 26;
    public static readonly RULE_bb_upper = 27;
    public static readonly RULE_bb_middle = 28;
    public static readonly RULE_bb_lower = 29;
    public static readonly RULE_rsi_phan_ki = 30;
    public static readonly RULE_macd_n_dinh = 31;
    public static readonly RULE_macd_slope = 32;
    public static readonly RULE_bullish_engulfing = 33;
    public static readonly RULE_bearish_engulfing = 34;
    public static readonly RULE_bullish_hammer = 35;
    public static readonly RULE_bearish_hammer = 36;
    public static readonly RULE_bullish = 37;
    public static readonly RULE_bearish = 38;
    public static readonly RULE_marsi = 39;
    public static readonly RULE_bull_bear_list = 40;
    public static readonly RULE_doji = 41;
    public static readonly RULE_comparisonOp = 42;
    public static readonly RULE_number = 43;

    public static readonly literalNames = [
        null, "'*'", "'/'", "'+'", "'-'", "'('", "')'", "'broker'", "'symbol'", 
        "'timeframe'", "'hour'", "'minute'", "'open'", "'high'", "'low'", 
        "'close'", "'volume'", "'volume24h_in_usd'", "'change'", "'change%'", 
        "'ampl'", "'ampl%'", "'upper_shadow'", "'upper_shadow%'", "'lower_shadow'", 
        "'lower_shadow%'", "'rsi'", "','", "'rsi_slope'", "'ma'", "'ema'", 
        "'macd_value'", "'macd_signal'", "'macd_histogram'", "'bb_upper'", 
        "'bb_middle'", "'bb_lower'", "'rsi_phan_ki'", "'macd_n_dinh'", "'macd_slope'", 
        "'bullish_engulfing'", "'bearish_engulfing'", "'bullish_hammer'", 
        "'bearish_hammer'", "'bullish'", "'bearish'", "'marsi'", "'bull_bear_list'", 
        "'doji'", "'>'", "'>='", "'<'", "'<='", "'=='", "'='"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        "INT", "FLOAT", "STRING", "WS"
    ];
    public static readonly ruleNames = [
        "expr", "broker", "symbol", "timeframe", "hour", "minute", "open", 
        "high", "low", "close", "volume", "volume24h_in_usd", "change", 
        "changeP", "ampl", "amplP", "upper_shadow", "upper_shadowP", "lower_shadow", 
        "lower_shadowP", "rsi", "rsi_slope", "ma", "ema", "macd_value", 
        "macd_signal", "macd_histogram", "bb_upper", "bb_middle", "bb_lower", 
        "rsi_phan_ki", "macd_n_dinh", "macd_slope", "bullish_engulfing", 
        "bearish_engulfing", "bullish_hammer", "bearish_hammer", "bullish", 
        "bearish", "marsi", "bull_bear_list", "doji", "comparisonOp", "number",
    ];

    public get grammarFileName(): string { return "Expr.g4"; }
    public get literalNames(): (string | null)[] { return ExprParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return ExprParser.symbolicNames; }
    public get ruleNames(): string[] { return ExprParser.ruleNames; }
    public get serializedATN(): number[] { return ExprParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, ExprParser._ATN, ExprParser.decisionsToDFA, new antlr.PredictionContextCache());
    }

    public expr(): ExprContext;
    public expr(_p: number): ExprContext;
    public expr(_p?: number): ExprContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExprContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 0;
        this.enterRecursionRule(localContext, 0, ExprParser.RULE_expr, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 137;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case ExprParser.T__4:
                {
                localContext = new ParensContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 89;
                this.match(ExprParser.T__4);
                this.state = 90;
                this.expr(0);
                this.state = 91;
                this.match(ExprParser.T__5);
                }
                break;
            case ExprParser.INT:
                {
                localContext = new IntContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 93;
                this.match(ExprParser.INT);
                }
                break;
            case ExprParser.FLOAT:
                {
                localContext = new FloatContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 94;
                this.match(ExprParser.FLOAT);
                }
                break;
            case ExprParser.STRING:
                {
                localContext = new StringContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 95;
                this.match(ExprParser.STRING);
                }
                break;
            case ExprParser.T__6:
                {
                localContext = new IBrokerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 96;
                this.broker();
                }
                break;
            case ExprParser.T__7:
                {
                localContext = new ISymbolContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 97;
                this.symbol_();
                }
                break;
            case ExprParser.T__8:
                {
                localContext = new ITimeframeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 98;
                this.timeframe();
                }
                break;
            case ExprParser.T__9:
                {
                localContext = new IHourContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 99;
                this.hour();
                }
                break;
            case ExprParser.T__10:
                {
                localContext = new IMinuteContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 100;
                this.minute();
                }
                break;
            case ExprParser.T__11:
                {
                localContext = new IOpenContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 101;
                this.open();
                }
                break;
            case ExprParser.T__12:
                {
                localContext = new IHighContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 102;
                this.high();
                }
                break;
            case ExprParser.T__13:
                {
                localContext = new ILowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 103;
                this.low();
                }
                break;
            case ExprParser.T__14:
                {
                localContext = new ICloseContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 104;
                this.close();
                }
                break;
            case ExprParser.T__15:
                {
                localContext = new IVolumeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 105;
                this.volume();
                }
                break;
            case ExprParser.T__16:
                {
                localContext = new IVolume24hInUSDContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 106;
                this.volume24h_in_usd();
                }
                break;
            case ExprParser.T__17:
                {
                localContext = new IChangeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 107;
                this.change();
                }
                break;
            case ExprParser.T__18:
                {
                localContext = new IChangePContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 108;
                this.changeP();
                }
                break;
            case ExprParser.T__19:
                {
                localContext = new IAmplContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 109;
                this.ampl();
                }
                break;
            case ExprParser.T__20:
                {
                localContext = new IAmplPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 110;
                this.amplP();
                }
                break;
            case ExprParser.T__21:
                {
                localContext = new IUpperShadowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 111;
                this.upper_shadow();
                }
                break;
            case ExprParser.T__22:
                {
                localContext = new IUpperShadowPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 112;
                this.upper_shadowP();
                }
                break;
            case ExprParser.T__23:
                {
                localContext = new ILowerShadowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 113;
                this.lower_shadow();
                }
                break;
            case ExprParser.T__24:
                {
                localContext = new ILowerShadowPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 114;
                this.lower_shadowP();
                }
                break;
            case ExprParser.T__25:
                {
                localContext = new IRSIContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 115;
                this.rsi();
                }
                break;
            case ExprParser.T__27:
                {
                localContext = new IRSISlopeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 116;
                this.rsi_slope();
                }
                break;
            case ExprParser.T__28:
                {
                localContext = new IMAContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 117;
                this.ma();
                }
                break;
            case ExprParser.T__29:
                {
                localContext = new IEMAContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 118;
                this.ema();
                }
                break;
            case ExprParser.T__30:
                {
                localContext = new IMACD_valueContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 119;
                this.macd_value();
                }
                break;
            case ExprParser.T__31:
                {
                localContext = new IMACD_signalContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 120;
                this.macd_signal();
                }
                break;
            case ExprParser.T__32:
                {
                localContext = new IMACD_histogramContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 121;
                this.macd_histogram();
                }
                break;
            case ExprParser.T__33:
                {
                localContext = new IBB_upContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 122;
                this.bb_upper();
                }
                break;
            case ExprParser.T__34:
                {
                localContext = new IBB_midContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 123;
                this.bb_middle();
                }
                break;
            case ExprParser.T__35:
                {
                localContext = new IBB_lowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 124;
                this.bb_lower();
                }
                break;
            case ExprParser.T__36:
                {
                localContext = new IRSI_phan_kiContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 125;
                this.rsi_phan_ki();
                }
                break;
            case ExprParser.T__37:
                {
                localContext = new IMACD_n_dinhContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 126;
                this.macd_n_dinh();
                }
                break;
            case ExprParser.T__38:
                {
                localContext = new IMACD_slopeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 127;
                this.macd_slope();
                }
                break;
            case ExprParser.T__39:
                {
                localContext = new IBullish_engulfingContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 128;
                this.bullish_engulfing();
                }
                break;
            case ExprParser.T__40:
                {
                localContext = new IBearish_engulfingContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 129;
                this.bearish_engulfing();
                }
                break;
            case ExprParser.T__41:
                {
                localContext = new IBullish_hammerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 130;
                this.bullish_hammer();
                }
                break;
            case ExprParser.T__42:
                {
                localContext = new IBearish_hammerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 131;
                this.bearish_hammer();
                }
                break;
            case ExprParser.T__43:
                {
                localContext = new IBullishContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 132;
                this.bullish();
                }
                break;
            case ExprParser.T__44:
                {
                localContext = new IBearishContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 133;
                this.bearish();
                }
                break;
            case ExprParser.T__45:
                {
                localContext = new IMARSIContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 134;
                this.marsi();
                }
                break;
            case ExprParser.T__46:
                {
                localContext = new IBullBearListContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 135;
                this.bull_bear_list();
                }
                break;
            case ExprParser.T__47:
                {
                localContext = new IDojiContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 136;
                this.doji();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 151;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 149;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
                    case 1:
                        {
                        localContext = new MulDivContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 139;
                        if (!(this.precpred(this.context, 48))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 48)");
                        }
                        this.state = 140;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 1 || _la === 2)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 141;
                        this.expr(49);
                        }
                        break;
                    case 2:
                        {
                        localContext = new AddSubContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 142;
                        if (!(this.precpred(this.context, 47))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 47)");
                        }
                        this.state = 143;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 3 || _la === 4)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 144;
                        this.expr(48);
                        }
                        break;
                    case 3:
                        {
                        localContext = new ComparisonContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 145;
                        if (!(this.precpred(this.context, 46))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 46)");
                        }
                        this.state = 146;
                        this.comparisonOp();
                        this.state = 147;
                        this.expr(47);
                        }
                        break;
                    }
                    }
                }
                this.state = 153;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public broker(): BrokerContext {
        let localContext = new BrokerContext(this.context, this.state);
        this.enterRule(localContext, 2, ExprParser.RULE_broker);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 154;
            this.match(ExprParser.T__6);
            this.state = 155;
            this.match(ExprParser.T__4);
            this.state = 156;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public symbol_(): SymbolContext {
        let localContext = new SymbolContext(this.context, this.state);
        this.enterRule(localContext, 4, ExprParser.RULE_symbol);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 158;
            this.match(ExprParser.T__7);
            this.state = 159;
            this.match(ExprParser.T__4);
            this.state = 160;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public timeframe(): TimeframeContext {
        let localContext = new TimeframeContext(this.context, this.state);
        this.enterRule(localContext, 6, ExprParser.RULE_timeframe);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 162;
            this.match(ExprParser.T__8);
            this.state = 163;
            this.match(ExprParser.T__4);
            this.state = 164;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public hour(): HourContext {
        let localContext = new HourContext(this.context, this.state);
        this.enterRule(localContext, 8, ExprParser.RULE_hour);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 166;
            this.match(ExprParser.T__9);
            this.state = 167;
            this.match(ExprParser.T__4);
            this.state = 168;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public minute(): MinuteContext {
        let localContext = new MinuteContext(this.context, this.state);
        this.enterRule(localContext, 10, ExprParser.RULE_minute);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 170;
            this.match(ExprParser.T__10);
            this.state = 171;
            this.match(ExprParser.T__4);
            this.state = 172;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public open(): OpenContext {
        let localContext = new OpenContext(this.context, this.state);
        this.enterRule(localContext, 12, ExprParser.RULE_open);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 174;
            this.match(ExprParser.T__11);
            this.state = 175;
            this.match(ExprParser.T__4);
            this.state = 177;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 176;
                this.match(ExprParser.INT);
                }
            }

            this.state = 179;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public high(): HighContext {
        let localContext = new HighContext(this.context, this.state);
        this.enterRule(localContext, 14, ExprParser.RULE_high);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 181;
            this.match(ExprParser.T__12);
            this.state = 182;
            this.match(ExprParser.T__4);
            this.state = 184;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 183;
                this.match(ExprParser.INT);
                }
            }

            this.state = 186;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public low(): LowContext {
        let localContext = new LowContext(this.context, this.state);
        this.enterRule(localContext, 16, ExprParser.RULE_low);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 188;
            this.match(ExprParser.T__13);
            this.state = 189;
            this.match(ExprParser.T__4);
            this.state = 191;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 190;
                this.match(ExprParser.INT);
                }
            }

            this.state = 193;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public close(): CloseContext {
        let localContext = new CloseContext(this.context, this.state);
        this.enterRule(localContext, 18, ExprParser.RULE_close);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 195;
            this.match(ExprParser.T__14);
            this.state = 196;
            this.match(ExprParser.T__4);
            this.state = 198;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 197;
                this.match(ExprParser.INT);
                }
            }

            this.state = 200;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public volume(): VolumeContext {
        let localContext = new VolumeContext(this.context, this.state);
        this.enterRule(localContext, 20, ExprParser.RULE_volume);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 202;
            this.match(ExprParser.T__15);
            this.state = 203;
            this.match(ExprParser.T__4);
            this.state = 205;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 204;
                this.match(ExprParser.INT);
                }
            }

            this.state = 207;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public volume24h_in_usd(): Volume24h_in_usdContext {
        let localContext = new Volume24h_in_usdContext(this.context, this.state);
        this.enterRule(localContext, 22, ExprParser.RULE_volume24h_in_usd);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 209;
            this.match(ExprParser.T__16);
            this.state = 210;
            this.match(ExprParser.T__4);
            this.state = 211;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public change(): ChangeContext {
        let localContext = new ChangeContext(this.context, this.state);
        this.enterRule(localContext, 24, ExprParser.RULE_change);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 213;
            this.match(ExprParser.T__17);
            this.state = 214;
            this.match(ExprParser.T__4);
            this.state = 216;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 215;
                this.match(ExprParser.INT);
                }
            }

            this.state = 218;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public changeP(): ChangePContext {
        let localContext = new ChangePContext(this.context, this.state);
        this.enterRule(localContext, 26, ExprParser.RULE_changeP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 220;
            this.match(ExprParser.T__18);
            this.state = 221;
            this.match(ExprParser.T__4);
            this.state = 223;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 222;
                this.match(ExprParser.INT);
                }
            }

            this.state = 225;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ampl(): AmplContext {
        let localContext = new AmplContext(this.context, this.state);
        this.enterRule(localContext, 28, ExprParser.RULE_ampl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 227;
            this.match(ExprParser.T__19);
            this.state = 228;
            this.match(ExprParser.T__4);
            this.state = 230;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 229;
                this.match(ExprParser.INT);
                }
            }

            this.state = 232;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public amplP(): AmplPContext {
        let localContext = new AmplPContext(this.context, this.state);
        this.enterRule(localContext, 30, ExprParser.RULE_amplP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 234;
            this.match(ExprParser.T__20);
            this.state = 235;
            this.match(ExprParser.T__4);
            this.state = 237;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 236;
                this.match(ExprParser.INT);
                }
            }

            this.state = 239;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public upper_shadow(): Upper_shadowContext {
        let localContext = new Upper_shadowContext(this.context, this.state);
        this.enterRule(localContext, 32, ExprParser.RULE_upper_shadow);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 241;
            this.match(ExprParser.T__21);
            this.state = 242;
            this.match(ExprParser.T__4);
            this.state = 244;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 243;
                this.match(ExprParser.INT);
                }
            }

            this.state = 246;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public upper_shadowP(): Upper_shadowPContext {
        let localContext = new Upper_shadowPContext(this.context, this.state);
        this.enterRule(localContext, 34, ExprParser.RULE_upper_shadowP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 248;
            this.match(ExprParser.T__22);
            this.state = 249;
            this.match(ExprParser.T__4);
            this.state = 251;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 250;
                this.match(ExprParser.INT);
                }
            }

            this.state = 253;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lower_shadow(): Lower_shadowContext {
        let localContext = new Lower_shadowContext(this.context, this.state);
        this.enterRule(localContext, 36, ExprParser.RULE_lower_shadow);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 255;
            this.match(ExprParser.T__23);
            this.state = 256;
            this.match(ExprParser.T__4);
            this.state = 258;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 257;
                this.match(ExprParser.INT);
                }
            }

            this.state = 260;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public lower_shadowP(): Lower_shadowPContext {
        let localContext = new Lower_shadowPContext(this.context, this.state);
        this.enterRule(localContext, 38, ExprParser.RULE_lower_shadowP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 262;
            this.match(ExprParser.T__24);
            this.state = 263;
            this.match(ExprParser.T__4);
            this.state = 265;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 264;
                this.match(ExprParser.INT);
                }
            }

            this.state = 267;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rsi(): RsiContext {
        let localContext = new RsiContext(this.context, this.state);
        this.enterRule(localContext, 40, ExprParser.RULE_rsi);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 269;
            this.match(ExprParser.T__25);
            this.state = 270;
            this.match(ExprParser.T__4);
            this.state = 271;
            this.match(ExprParser.INT);
            this.state = 274;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 272;
                this.match(ExprParser.T__26);
                this.state = 273;
                this.match(ExprParser.INT);
                }
            }

            this.state = 276;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rsi_slope(): Rsi_slopeContext {
        let localContext = new Rsi_slopeContext(this.context, this.state);
        this.enterRule(localContext, 42, ExprParser.RULE_rsi_slope);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 278;
            this.match(ExprParser.T__27);
            this.state = 279;
            this.match(ExprParser.T__4);
            this.state = 280;
            this.match(ExprParser.INT);
            this.state = 283;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 281;
                this.match(ExprParser.T__26);
                this.state = 282;
                this.match(ExprParser.INT);
                }
            }

            this.state = 285;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ma(): MaContext {
        let localContext = new MaContext(this.context, this.state);
        this.enterRule(localContext, 44, ExprParser.RULE_ma);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 287;
            this.match(ExprParser.T__28);
            this.state = 288;
            this.match(ExprParser.T__4);
            this.state = 289;
            this.match(ExprParser.INT);
            this.state = 292;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 290;
                this.match(ExprParser.T__26);
                this.state = 291;
                this.match(ExprParser.INT);
                }
            }

            this.state = 294;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ema(): EmaContext {
        let localContext = new EmaContext(this.context, this.state);
        this.enterRule(localContext, 46, ExprParser.RULE_ema);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 296;
            this.match(ExprParser.T__29);
            this.state = 297;
            this.match(ExprParser.T__4);
            this.state = 298;
            this.match(ExprParser.INT);
            this.state = 301;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 299;
                this.match(ExprParser.T__26);
                this.state = 300;
                this.match(ExprParser.INT);
                }
            }

            this.state = 303;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public macd_value(): Macd_valueContext {
        let localContext = new Macd_valueContext(this.context, this.state);
        this.enterRule(localContext, 48, ExprParser.RULE_macd_value);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 305;
            this.match(ExprParser.T__30);
            this.state = 306;
            this.match(ExprParser.T__4);
            this.state = 307;
            this.match(ExprParser.INT);
            this.state = 308;
            this.match(ExprParser.T__26);
            this.state = 309;
            this.match(ExprParser.INT);
            this.state = 310;
            this.match(ExprParser.T__26);
            this.state = 311;
            this.match(ExprParser.INT);
            this.state = 314;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 312;
                this.match(ExprParser.T__26);
                this.state = 313;
                this.match(ExprParser.INT);
                }
            }

            this.state = 316;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public macd_signal(): Macd_signalContext {
        let localContext = new Macd_signalContext(this.context, this.state);
        this.enterRule(localContext, 50, ExprParser.RULE_macd_signal);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 318;
            this.match(ExprParser.T__31);
            this.state = 319;
            this.match(ExprParser.T__4);
            this.state = 320;
            this.match(ExprParser.INT);
            this.state = 321;
            this.match(ExprParser.T__26);
            this.state = 322;
            this.match(ExprParser.INT);
            this.state = 323;
            this.match(ExprParser.T__26);
            this.state = 324;
            this.match(ExprParser.INT);
            this.state = 327;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 325;
                this.match(ExprParser.T__26);
                this.state = 326;
                this.match(ExprParser.INT);
                }
            }

            this.state = 329;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public macd_histogram(): Macd_histogramContext {
        let localContext = new Macd_histogramContext(this.context, this.state);
        this.enterRule(localContext, 52, ExprParser.RULE_macd_histogram);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 331;
            this.match(ExprParser.T__32);
            this.state = 332;
            this.match(ExprParser.T__4);
            this.state = 333;
            this.match(ExprParser.INT);
            this.state = 334;
            this.match(ExprParser.T__26);
            this.state = 335;
            this.match(ExprParser.INT);
            this.state = 336;
            this.match(ExprParser.T__26);
            this.state = 337;
            this.match(ExprParser.INT);
            this.state = 340;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 338;
                this.match(ExprParser.T__26);
                this.state = 339;
                this.match(ExprParser.INT);
                }
            }

            this.state = 342;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bb_upper(): Bb_upperContext {
        let localContext = new Bb_upperContext(this.context, this.state);
        this.enterRule(localContext, 54, ExprParser.RULE_bb_upper);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 344;
            this.match(ExprParser.T__33);
            this.state = 345;
            this.match(ExprParser.T__4);
            this.state = 346;
            this.match(ExprParser.INT);
            this.state = 347;
            this.match(ExprParser.T__26);
            this.state = 348;
            this.number_();
            this.state = 351;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 349;
                this.match(ExprParser.T__26);
                this.state = 350;
                this.match(ExprParser.INT);
                }
            }

            this.state = 353;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bb_middle(): Bb_middleContext {
        let localContext = new Bb_middleContext(this.context, this.state);
        this.enterRule(localContext, 56, ExprParser.RULE_bb_middle);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 355;
            this.match(ExprParser.T__34);
            this.state = 356;
            this.match(ExprParser.T__4);
            this.state = 357;
            this.match(ExprParser.INT);
            this.state = 358;
            this.match(ExprParser.T__26);
            this.state = 359;
            this.number_();
            this.state = 362;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 360;
                this.match(ExprParser.T__26);
                this.state = 361;
                this.match(ExprParser.INT);
                }
            }

            this.state = 364;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bb_lower(): Bb_lowerContext {
        let localContext = new Bb_lowerContext(this.context, this.state);
        this.enterRule(localContext, 58, ExprParser.RULE_bb_lower);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 366;
            this.match(ExprParser.T__35);
            this.state = 367;
            this.match(ExprParser.T__4);
            this.state = 368;
            this.match(ExprParser.INT);
            this.state = 369;
            this.match(ExprParser.T__26);
            this.state = 370;
            this.number_();
            this.state = 373;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 371;
                this.match(ExprParser.T__26);
                this.state = 372;
                this.match(ExprParser.INT);
                }
            }

            this.state = 375;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public rsi_phan_ki(): Rsi_phan_kiContext {
        let localContext = new Rsi_phan_kiContext(this.context, this.state);
        this.enterRule(localContext, 60, ExprParser.RULE_rsi_phan_ki);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 377;
            this.match(ExprParser.T__36);
            this.state = 378;
            this.match(ExprParser.T__4);
            this.state = 379;
            this.match(ExprParser.INT);
            this.state = 380;
            this.match(ExprParser.T__26);
            this.state = 381;
            this.number_();
            this.state = 382;
            this.match(ExprParser.T__26);
            this.state = 383;
            this.match(ExprParser.INT);
            this.state = 384;
            this.match(ExprParser.T__26);
            this.state = 385;
            this.match(ExprParser.INT);
            this.state = 386;
            this.match(ExprParser.T__26);
            this.state = 387;
            this.number_();
            this.state = 388;
            this.match(ExprParser.T__26);
            this.state = 389;
            this.number_();
            this.state = 392;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 390;
                this.match(ExprParser.T__26);
                this.state = 391;
                this.match(ExprParser.INT);
                }
            }

            this.state = 394;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public macd_n_dinh(): Macd_n_dinhContext {
        let localContext = new Macd_n_dinhContext(this.context, this.state);
        this.enterRule(localContext, 62, ExprParser.RULE_macd_n_dinh);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 396;
            this.match(ExprParser.T__37);
            this.state = 397;
            this.match(ExprParser.T__4);
            this.state = 398;
            this.match(ExprParser.INT);
            this.state = 399;
            this.match(ExprParser.T__26);
            this.state = 400;
            this.match(ExprParser.INT);
            this.state = 401;
            this.match(ExprParser.T__26);
            this.state = 402;
            this.match(ExprParser.INT);
            this.state = 403;
            this.match(ExprParser.T__26);
            this.state = 404;
            this.match(ExprParser.INT);
            this.state = 405;
            this.match(ExprParser.T__26);
            this.state = 406;
            this.match(ExprParser.INT);
            this.state = 407;
            this.match(ExprParser.T__26);
            this.state = 408;
            this.match(ExprParser.INT);
            this.state = 409;
            this.match(ExprParser.T__26);
            this.state = 410;
            this.number_();
            this.state = 411;
            this.match(ExprParser.T__26);
            this.state = 412;
            this.match(ExprParser.INT);
            this.state = 417;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 27) {
                {
                {
                this.state = 413;
                this.match(ExprParser.T__26);
                this.state = 414;
                this.number_();
                }
                }
                this.state = 419;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 420;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public macd_slope(): Macd_slopeContext {
        let localContext = new Macd_slopeContext(this.context, this.state);
        this.enterRule(localContext, 64, ExprParser.RULE_macd_slope);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 422;
            this.match(ExprParser.T__38);
            this.state = 423;
            this.match(ExprParser.T__4);
            this.state = 424;
            this.match(ExprParser.INT);
            this.state = 425;
            this.match(ExprParser.T__26);
            this.state = 426;
            this.match(ExprParser.INT);
            this.state = 427;
            this.match(ExprParser.T__26);
            this.state = 428;
            this.match(ExprParser.INT);
            this.state = 431;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 429;
                this.match(ExprParser.T__26);
                this.state = 430;
                this.match(ExprParser.INT);
                }
            }

            this.state = 433;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bullish_engulfing(): Bullish_engulfingContext {
        let localContext = new Bullish_engulfingContext(this.context, this.state);
        this.enterRule(localContext, 66, ExprParser.RULE_bullish_engulfing);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 435;
            this.match(ExprParser.T__39);
            this.state = 436;
            this.match(ExprParser.T__4);
            this.state = 438;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 437;
                this.match(ExprParser.INT);
                }
            }

            this.state = 440;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bearish_engulfing(): Bearish_engulfingContext {
        let localContext = new Bearish_engulfingContext(this.context, this.state);
        this.enterRule(localContext, 68, ExprParser.RULE_bearish_engulfing);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 442;
            this.match(ExprParser.T__40);
            this.state = 443;
            this.match(ExprParser.T__4);
            this.state = 445;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 444;
                this.match(ExprParser.INT);
                }
            }

            this.state = 447;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bullish_hammer(): Bullish_hammerContext {
        let localContext = new Bullish_hammerContext(this.context, this.state);
        this.enterRule(localContext, 70, ExprParser.RULE_bullish_hammer);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 449;
            this.match(ExprParser.T__41);
            this.state = 450;
            this.match(ExprParser.T__4);
            this.state = 452;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 451;
                this.match(ExprParser.INT);
                }
            }

            this.state = 454;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bearish_hammer(): Bearish_hammerContext {
        let localContext = new Bearish_hammerContext(this.context, this.state);
        this.enterRule(localContext, 72, ExprParser.RULE_bearish_hammer);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 456;
            this.match(ExprParser.T__42);
            this.state = 457;
            this.match(ExprParser.T__4);
            this.state = 459;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 458;
                this.match(ExprParser.INT);
                }
            }

            this.state = 461;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bullish(): BullishContext {
        let localContext = new BullishContext(this.context, this.state);
        this.enterRule(localContext, 74, ExprParser.RULE_bullish);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 463;
            this.match(ExprParser.T__43);
            this.state = 464;
            this.match(ExprParser.T__4);
            this.state = 466;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 465;
                this.match(ExprParser.INT);
                }
            }

            this.state = 468;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bearish(): BearishContext {
        let localContext = new BearishContext(this.context, this.state);
        this.enterRule(localContext, 76, ExprParser.RULE_bearish);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 470;
            this.match(ExprParser.T__44);
            this.state = 471;
            this.match(ExprParser.T__4);
            this.state = 473;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 472;
                this.match(ExprParser.INT);
                }
            }

            this.state = 475;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public marsi(): MarsiContext {
        let localContext = new MarsiContext(this.context, this.state);
        this.enterRule(localContext, 78, ExprParser.RULE_marsi);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 477;
            this.match(ExprParser.T__45);
            this.state = 478;
            this.match(ExprParser.T__4);
            this.state = 479;
            this.match(ExprParser.INT);
            this.state = 480;
            this.match(ExprParser.T__26);
            this.state = 481;
            this.match(ExprParser.INT);
            this.state = 484;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 482;
                this.match(ExprParser.T__26);
                this.state = 483;
                this.match(ExprParser.INT);
                }
            }

            this.state = 486;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public bull_bear_list(): Bull_bear_listContext {
        let localContext = new Bull_bear_listContext(this.context, this.state);
        this.enterRule(localContext, 80, ExprParser.RULE_bull_bear_list);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 488;
            this.match(ExprParser.T__46);
            this.state = 489;
            this.match(ExprParser.T__4);
            this.state = 491;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 490;
                this.match(ExprParser.INT);
                }
            }

            this.state = 493;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public doji(): DojiContext {
        let localContext = new DojiContext(this.context, this.state);
        this.enterRule(localContext, 82, ExprParser.RULE_doji);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 495;
            this.match(ExprParser.T__47);
            this.state = 496;
            this.match(ExprParser.T__4);
            this.state = 498;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 497;
                this.match(ExprParser.INT);
                }
            }

            this.state = 500;
            this.match(ExprParser.T__5);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public comparisonOp(): ComparisonOpContext {
        let localContext = new ComparisonOpContext(this.context, this.state);
        this.enterRule(localContext, 84, ExprParser.RULE_comparisonOp);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 502;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 49)) & ~0x1F) === 0 && ((1 << (_la - 49)) & 63) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public number_(): NumberContext {
        let localContext = new NumberContext(this.context, this.state);
        this.enterRule(localContext, 86, ExprParser.RULE_number);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 504;
            _la = this.tokenStream.LA(1);
            if(!(_la === 55 || _la === 56)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 0:
            return this.expr_sempred(localContext as ExprContext, predIndex);
        }
        return true;
    }
    private expr_sempred(localContext: ExprContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 48);
        case 1:
            return this.precpred(this.context, 47);
        case 2:
            return this.precpred(this.context, 46);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,58,507,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,
        7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,39,
        2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,138,8,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,150,8,0,10,0,12,0,153,9,0,1,
        1,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,4,1,4,1,4,1,4,1,
        5,1,5,1,5,1,5,1,6,1,6,1,6,3,6,178,8,6,1,6,1,6,1,7,1,7,1,7,3,7,185,
        8,7,1,7,1,7,1,8,1,8,1,8,3,8,192,8,8,1,8,1,8,1,9,1,9,1,9,3,9,199,
        8,9,1,9,1,9,1,10,1,10,1,10,3,10,206,8,10,1,10,1,10,1,11,1,11,1,11,
        1,11,1,12,1,12,1,12,3,12,217,8,12,1,12,1,12,1,13,1,13,1,13,3,13,
        224,8,13,1,13,1,13,1,14,1,14,1,14,3,14,231,8,14,1,14,1,14,1,15,1,
        15,1,15,3,15,238,8,15,1,15,1,15,1,16,1,16,1,16,3,16,245,8,16,1,16,
        1,16,1,17,1,17,1,17,3,17,252,8,17,1,17,1,17,1,18,1,18,1,18,3,18,
        259,8,18,1,18,1,18,1,19,1,19,1,19,3,19,266,8,19,1,19,1,19,1,20,1,
        20,1,20,1,20,1,20,3,20,275,8,20,1,20,1,20,1,21,1,21,1,21,1,21,1,
        21,3,21,284,8,21,1,21,1,21,1,22,1,22,1,22,1,22,1,22,3,22,293,8,22,
        1,22,1,22,1,23,1,23,1,23,1,23,1,23,3,23,302,8,23,1,23,1,23,1,24,
        1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,3,24,315,8,24,1,24,1,24,
        1,25,1,25,1,25,1,25,1,25,1,25,1,25,1,25,1,25,3,25,328,8,25,1,25,
        1,25,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,3,26,341,8,26,
        1,26,1,26,1,27,1,27,1,27,1,27,1,27,1,27,1,27,3,27,352,8,27,1,27,
        1,27,1,28,1,28,1,28,1,28,1,28,1,28,1,28,3,28,363,8,28,1,28,1,28,
        1,29,1,29,1,29,1,29,1,29,1,29,1,29,3,29,374,8,29,1,29,1,29,1,30,
        1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,
        1,30,3,30,393,8,30,1,30,1,30,1,31,1,31,1,31,1,31,1,31,1,31,1,31,
        1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,5,31,
        416,8,31,10,31,12,31,419,9,31,1,31,1,31,1,32,1,32,1,32,1,32,1,32,
        1,32,1,32,1,32,1,32,3,32,432,8,32,1,32,1,32,1,33,1,33,1,33,3,33,
        439,8,33,1,33,1,33,1,34,1,34,1,34,3,34,446,8,34,1,34,1,34,1,35,1,
        35,1,35,3,35,453,8,35,1,35,1,35,1,36,1,36,1,36,3,36,460,8,36,1,36,
        1,36,1,37,1,37,1,37,3,37,467,8,37,1,37,1,37,1,38,1,38,1,38,3,38,
        474,8,38,1,38,1,38,1,39,1,39,1,39,1,39,1,39,1,39,1,39,3,39,485,8,
        39,1,39,1,39,1,40,1,40,1,40,3,40,492,8,40,1,40,1,40,1,41,1,41,1,
        41,3,41,499,8,41,1,41,1,41,1,42,1,42,1,43,1,43,1,43,0,1,0,44,0,2,
        4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,
        50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,0,4,1,0,
        1,2,1,0,3,4,1,0,49,54,1,0,55,56,544,0,137,1,0,0,0,2,154,1,0,0,0,
        4,158,1,0,0,0,6,162,1,0,0,0,8,166,1,0,0,0,10,170,1,0,0,0,12,174,
        1,0,0,0,14,181,1,0,0,0,16,188,1,0,0,0,18,195,1,0,0,0,20,202,1,0,
        0,0,22,209,1,0,0,0,24,213,1,0,0,0,26,220,1,0,0,0,28,227,1,0,0,0,
        30,234,1,0,0,0,32,241,1,0,0,0,34,248,1,0,0,0,36,255,1,0,0,0,38,262,
        1,0,0,0,40,269,1,0,0,0,42,278,1,0,0,0,44,287,1,0,0,0,46,296,1,0,
        0,0,48,305,1,0,0,0,50,318,1,0,0,0,52,331,1,0,0,0,54,344,1,0,0,0,
        56,355,1,0,0,0,58,366,1,0,0,0,60,377,1,0,0,0,62,396,1,0,0,0,64,422,
        1,0,0,0,66,435,1,0,0,0,68,442,1,0,0,0,70,449,1,0,0,0,72,456,1,0,
        0,0,74,463,1,0,0,0,76,470,1,0,0,0,78,477,1,0,0,0,80,488,1,0,0,0,
        82,495,1,0,0,0,84,502,1,0,0,0,86,504,1,0,0,0,88,89,6,0,-1,0,89,90,
        5,5,0,0,90,91,3,0,0,0,91,92,5,6,0,0,92,138,1,0,0,0,93,138,5,55,0,
        0,94,138,5,56,0,0,95,138,5,57,0,0,96,138,3,2,1,0,97,138,3,4,2,0,
        98,138,3,6,3,0,99,138,3,8,4,0,100,138,3,10,5,0,101,138,3,12,6,0,
        102,138,3,14,7,0,103,138,3,16,8,0,104,138,3,18,9,0,105,138,3,20,
        10,0,106,138,3,22,11,0,107,138,3,24,12,0,108,138,3,26,13,0,109,138,
        3,28,14,0,110,138,3,30,15,0,111,138,3,32,16,0,112,138,3,34,17,0,
        113,138,3,36,18,0,114,138,3,38,19,0,115,138,3,40,20,0,116,138,3,
        42,21,0,117,138,3,44,22,0,118,138,3,46,23,0,119,138,3,48,24,0,120,
        138,3,50,25,0,121,138,3,52,26,0,122,138,3,54,27,0,123,138,3,56,28,
        0,124,138,3,58,29,0,125,138,3,60,30,0,126,138,3,62,31,0,127,138,
        3,64,32,0,128,138,3,66,33,0,129,138,3,68,34,0,130,138,3,70,35,0,
        131,138,3,72,36,0,132,138,3,74,37,0,133,138,3,76,38,0,134,138,3,
        78,39,0,135,138,3,80,40,0,136,138,3,82,41,0,137,88,1,0,0,0,137,93,
        1,0,0,0,137,94,1,0,0,0,137,95,1,0,0,0,137,96,1,0,0,0,137,97,1,0,
        0,0,137,98,1,0,0,0,137,99,1,0,0,0,137,100,1,0,0,0,137,101,1,0,0,
        0,137,102,1,0,0,0,137,103,1,0,0,0,137,104,1,0,0,0,137,105,1,0,0,
        0,137,106,1,0,0,0,137,107,1,0,0,0,137,108,1,0,0,0,137,109,1,0,0,
        0,137,110,1,0,0,0,137,111,1,0,0,0,137,112,1,0,0,0,137,113,1,0,0,
        0,137,114,1,0,0,0,137,115,1,0,0,0,137,116,1,0,0,0,137,117,1,0,0,
        0,137,118,1,0,0,0,137,119,1,0,0,0,137,120,1,0,0,0,137,121,1,0,0,
        0,137,122,1,0,0,0,137,123,1,0,0,0,137,124,1,0,0,0,137,125,1,0,0,
        0,137,126,1,0,0,0,137,127,1,0,0,0,137,128,1,0,0,0,137,129,1,0,0,
        0,137,130,1,0,0,0,137,131,1,0,0,0,137,132,1,0,0,0,137,133,1,0,0,
        0,137,134,1,0,0,0,137,135,1,0,0,0,137,136,1,0,0,0,138,151,1,0,0,
        0,139,140,10,48,0,0,140,141,7,0,0,0,141,150,3,0,0,49,142,143,10,
        47,0,0,143,144,7,1,0,0,144,150,3,0,0,48,145,146,10,46,0,0,146,147,
        3,84,42,0,147,148,3,0,0,47,148,150,1,0,0,0,149,139,1,0,0,0,149,142,
        1,0,0,0,149,145,1,0,0,0,150,153,1,0,0,0,151,149,1,0,0,0,151,152,
        1,0,0,0,152,1,1,0,0,0,153,151,1,0,0,0,154,155,5,7,0,0,155,156,5,
        5,0,0,156,157,5,6,0,0,157,3,1,0,0,0,158,159,5,8,0,0,159,160,5,5,
        0,0,160,161,5,6,0,0,161,5,1,0,0,0,162,163,5,9,0,0,163,164,5,5,0,
        0,164,165,5,6,0,0,165,7,1,0,0,0,166,167,5,10,0,0,167,168,5,5,0,0,
        168,169,5,6,0,0,169,9,1,0,0,0,170,171,5,11,0,0,171,172,5,5,0,0,172,
        173,5,6,0,0,173,11,1,0,0,0,174,175,5,12,0,0,175,177,5,5,0,0,176,
        178,5,55,0,0,177,176,1,0,0,0,177,178,1,0,0,0,178,179,1,0,0,0,179,
        180,5,6,0,0,180,13,1,0,0,0,181,182,5,13,0,0,182,184,5,5,0,0,183,
        185,5,55,0,0,184,183,1,0,0,0,184,185,1,0,0,0,185,186,1,0,0,0,186,
        187,5,6,0,0,187,15,1,0,0,0,188,189,5,14,0,0,189,191,5,5,0,0,190,
        192,5,55,0,0,191,190,1,0,0,0,191,192,1,0,0,0,192,193,1,0,0,0,193,
        194,5,6,0,0,194,17,1,0,0,0,195,196,5,15,0,0,196,198,5,5,0,0,197,
        199,5,55,0,0,198,197,1,0,0,0,198,199,1,0,0,0,199,200,1,0,0,0,200,
        201,5,6,0,0,201,19,1,0,0,0,202,203,5,16,0,0,203,205,5,5,0,0,204,
        206,5,55,0,0,205,204,1,0,0,0,205,206,1,0,0,0,206,207,1,0,0,0,207,
        208,5,6,0,0,208,21,1,0,0,0,209,210,5,17,0,0,210,211,5,5,0,0,211,
        212,5,6,0,0,212,23,1,0,0,0,213,214,5,18,0,0,214,216,5,5,0,0,215,
        217,5,55,0,0,216,215,1,0,0,0,216,217,1,0,0,0,217,218,1,0,0,0,218,
        219,5,6,0,0,219,25,1,0,0,0,220,221,5,19,0,0,221,223,5,5,0,0,222,
        224,5,55,0,0,223,222,1,0,0,0,223,224,1,0,0,0,224,225,1,0,0,0,225,
        226,5,6,0,0,226,27,1,0,0,0,227,228,5,20,0,0,228,230,5,5,0,0,229,
        231,5,55,0,0,230,229,1,0,0,0,230,231,1,0,0,0,231,232,1,0,0,0,232,
        233,5,6,0,0,233,29,1,0,0,0,234,235,5,21,0,0,235,237,5,5,0,0,236,
        238,5,55,0,0,237,236,1,0,0,0,237,238,1,0,0,0,238,239,1,0,0,0,239,
        240,5,6,0,0,240,31,1,0,0,0,241,242,5,22,0,0,242,244,5,5,0,0,243,
        245,5,55,0,0,244,243,1,0,0,0,244,245,1,0,0,0,245,246,1,0,0,0,246,
        247,5,6,0,0,247,33,1,0,0,0,248,249,5,23,0,0,249,251,5,5,0,0,250,
        252,5,55,0,0,251,250,1,0,0,0,251,252,1,0,0,0,252,253,1,0,0,0,253,
        254,5,6,0,0,254,35,1,0,0,0,255,256,5,24,0,0,256,258,5,5,0,0,257,
        259,5,55,0,0,258,257,1,0,0,0,258,259,1,0,0,0,259,260,1,0,0,0,260,
        261,5,6,0,0,261,37,1,0,0,0,262,263,5,25,0,0,263,265,5,5,0,0,264,
        266,5,55,0,0,265,264,1,0,0,0,265,266,1,0,0,0,266,267,1,0,0,0,267,
        268,5,6,0,0,268,39,1,0,0,0,269,270,5,26,0,0,270,271,5,5,0,0,271,
        274,5,55,0,0,272,273,5,27,0,0,273,275,5,55,0,0,274,272,1,0,0,0,274,
        275,1,0,0,0,275,276,1,0,0,0,276,277,5,6,0,0,277,41,1,0,0,0,278,279,
        5,28,0,0,279,280,5,5,0,0,280,283,5,55,0,0,281,282,5,27,0,0,282,284,
        5,55,0,0,283,281,1,0,0,0,283,284,1,0,0,0,284,285,1,0,0,0,285,286,
        5,6,0,0,286,43,1,0,0,0,287,288,5,29,0,0,288,289,5,5,0,0,289,292,
        5,55,0,0,290,291,5,27,0,0,291,293,5,55,0,0,292,290,1,0,0,0,292,293,
        1,0,0,0,293,294,1,0,0,0,294,295,5,6,0,0,295,45,1,0,0,0,296,297,5,
        30,0,0,297,298,5,5,0,0,298,301,5,55,0,0,299,300,5,27,0,0,300,302,
        5,55,0,0,301,299,1,0,0,0,301,302,1,0,0,0,302,303,1,0,0,0,303,304,
        5,6,0,0,304,47,1,0,0,0,305,306,5,31,0,0,306,307,5,5,0,0,307,308,
        5,55,0,0,308,309,5,27,0,0,309,310,5,55,0,0,310,311,5,27,0,0,311,
        314,5,55,0,0,312,313,5,27,0,0,313,315,5,55,0,0,314,312,1,0,0,0,314,
        315,1,0,0,0,315,316,1,0,0,0,316,317,5,6,0,0,317,49,1,0,0,0,318,319,
        5,32,0,0,319,320,5,5,0,0,320,321,5,55,0,0,321,322,5,27,0,0,322,323,
        5,55,0,0,323,324,5,27,0,0,324,327,5,55,0,0,325,326,5,27,0,0,326,
        328,5,55,0,0,327,325,1,0,0,0,327,328,1,0,0,0,328,329,1,0,0,0,329,
        330,5,6,0,0,330,51,1,0,0,0,331,332,5,33,0,0,332,333,5,5,0,0,333,
        334,5,55,0,0,334,335,5,27,0,0,335,336,5,55,0,0,336,337,5,27,0,0,
        337,340,5,55,0,0,338,339,5,27,0,0,339,341,5,55,0,0,340,338,1,0,0,
        0,340,341,1,0,0,0,341,342,1,0,0,0,342,343,5,6,0,0,343,53,1,0,0,0,
        344,345,5,34,0,0,345,346,5,5,0,0,346,347,5,55,0,0,347,348,5,27,0,
        0,348,351,3,86,43,0,349,350,5,27,0,0,350,352,5,55,0,0,351,349,1,
        0,0,0,351,352,1,0,0,0,352,353,1,0,0,0,353,354,5,6,0,0,354,55,1,0,
        0,0,355,356,5,35,0,0,356,357,5,5,0,0,357,358,5,55,0,0,358,359,5,
        27,0,0,359,362,3,86,43,0,360,361,5,27,0,0,361,363,5,55,0,0,362,360,
        1,0,0,0,362,363,1,0,0,0,363,364,1,0,0,0,364,365,5,6,0,0,365,57,1,
        0,0,0,366,367,5,36,0,0,367,368,5,5,0,0,368,369,5,55,0,0,369,370,
        5,27,0,0,370,373,3,86,43,0,371,372,5,27,0,0,372,374,5,55,0,0,373,
        371,1,0,0,0,373,374,1,0,0,0,374,375,1,0,0,0,375,376,5,6,0,0,376,
        59,1,0,0,0,377,378,5,37,0,0,378,379,5,5,0,0,379,380,5,55,0,0,380,
        381,5,27,0,0,381,382,3,86,43,0,382,383,5,27,0,0,383,384,5,55,0,0,
        384,385,5,27,0,0,385,386,5,55,0,0,386,387,5,27,0,0,387,388,3,86,
        43,0,388,389,5,27,0,0,389,392,3,86,43,0,390,391,5,27,0,0,391,393,
        5,55,0,0,392,390,1,0,0,0,392,393,1,0,0,0,393,394,1,0,0,0,394,395,
        5,6,0,0,395,61,1,0,0,0,396,397,5,38,0,0,397,398,5,5,0,0,398,399,
        5,55,0,0,399,400,5,27,0,0,400,401,5,55,0,0,401,402,5,27,0,0,402,
        403,5,55,0,0,403,404,5,27,0,0,404,405,5,55,0,0,405,406,5,27,0,0,
        406,407,5,55,0,0,407,408,5,27,0,0,408,409,5,55,0,0,409,410,5,27,
        0,0,410,411,3,86,43,0,411,412,5,27,0,0,412,417,5,55,0,0,413,414,
        5,27,0,0,414,416,3,86,43,0,415,413,1,0,0,0,416,419,1,0,0,0,417,415,
        1,0,0,0,417,418,1,0,0,0,418,420,1,0,0,0,419,417,1,0,0,0,420,421,
        5,6,0,0,421,63,1,0,0,0,422,423,5,39,0,0,423,424,5,5,0,0,424,425,
        5,55,0,0,425,426,5,27,0,0,426,427,5,55,0,0,427,428,5,27,0,0,428,
        431,5,55,0,0,429,430,5,27,0,0,430,432,5,55,0,0,431,429,1,0,0,0,431,
        432,1,0,0,0,432,433,1,0,0,0,433,434,5,6,0,0,434,65,1,0,0,0,435,436,
        5,40,0,0,436,438,5,5,0,0,437,439,5,55,0,0,438,437,1,0,0,0,438,439,
        1,0,0,0,439,440,1,0,0,0,440,441,5,6,0,0,441,67,1,0,0,0,442,443,5,
        41,0,0,443,445,5,5,0,0,444,446,5,55,0,0,445,444,1,0,0,0,445,446,
        1,0,0,0,446,447,1,0,0,0,447,448,5,6,0,0,448,69,1,0,0,0,449,450,5,
        42,0,0,450,452,5,5,0,0,451,453,5,55,0,0,452,451,1,0,0,0,452,453,
        1,0,0,0,453,454,1,0,0,0,454,455,5,6,0,0,455,71,1,0,0,0,456,457,5,
        43,0,0,457,459,5,5,0,0,458,460,5,55,0,0,459,458,1,0,0,0,459,460,
        1,0,0,0,460,461,1,0,0,0,461,462,5,6,0,0,462,73,1,0,0,0,463,464,5,
        44,0,0,464,466,5,5,0,0,465,467,5,55,0,0,466,465,1,0,0,0,466,467,
        1,0,0,0,467,468,1,0,0,0,468,469,5,6,0,0,469,75,1,0,0,0,470,471,5,
        45,0,0,471,473,5,5,0,0,472,474,5,55,0,0,473,472,1,0,0,0,473,474,
        1,0,0,0,474,475,1,0,0,0,475,476,5,6,0,0,476,77,1,0,0,0,477,478,5,
        46,0,0,478,479,5,5,0,0,479,480,5,55,0,0,480,481,5,27,0,0,481,484,
        5,55,0,0,482,483,5,27,0,0,483,485,5,55,0,0,484,482,1,0,0,0,484,485,
        1,0,0,0,485,486,1,0,0,0,486,487,5,6,0,0,487,79,1,0,0,0,488,489,5,
        47,0,0,489,491,5,5,0,0,490,492,5,55,0,0,491,490,1,0,0,0,491,492,
        1,0,0,0,492,493,1,0,0,0,493,494,5,6,0,0,494,81,1,0,0,0,495,496,5,
        48,0,0,496,498,5,5,0,0,497,499,5,55,0,0,498,497,1,0,0,0,498,499,
        1,0,0,0,499,500,1,0,0,0,500,501,5,6,0,0,501,83,1,0,0,0,502,503,7,
        2,0,0,503,85,1,0,0,0,504,505,7,3,0,0,505,87,1,0,0,0,38,137,149,151,
        177,184,191,198,205,216,223,230,237,244,251,258,265,274,283,292,
        301,314,327,340,351,362,373,392,417,431,438,445,452,459,466,473,
        484,491,498
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!ExprParser.__ATN) {
            ExprParser.__ATN = new antlr.ATNDeserializer().deserialize(ExprParser._serializedATN);
        }

        return ExprParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(ExprParser.literalNames, ExprParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return ExprParser.vocabulary;
    }

    private static readonly decisionsToDFA = ExprParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ExprContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_expr;
    }
    public override copyFrom(ctx: ExprContext): void {
        super.copyFrom(ctx);
    }
}
export class ICloseContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public close(): CloseContext {
        return this.getRuleContext(0, CloseContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIClose) {
            return visitor.visitIClose(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IHighContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public high(): HighContext {
        return this.getRuleContext(0, HighContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIHigh) {
            return visitor.visitIHigh(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IMACD_signalContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public macd_signal(): Macd_signalContext {
        return this.getRuleContext(0, Macd_signalContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIMACD_signal) {
            return visitor.visitIMACD_signal(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IMARSIContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public marsi(): MarsiContext {
        return this.getRuleContext(0, MarsiContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIMARSI) {
            return visitor.visitIMARSI(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IVolume24hInUSDContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public volume24h_in_usd(): Volume24h_in_usdContext {
        return this.getRuleContext(0, Volume24h_in_usdContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIVolume24hInUSD) {
            return visitor.visitIVolume24hInUSD(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class MulDivContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMulDiv) {
            return visitor.visitMulDiv(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ParensContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext {
        return this.getRuleContext(0, ExprContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitParens) {
            return visitor.visitParens(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBullish_hammerContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bullish_hammer(): Bullish_hammerContext {
        return this.getRuleContext(0, Bullish_hammerContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBullish_hammer) {
            return visitor.visitIBullish_hammer(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IHourContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public hour(): HourContext {
        return this.getRuleContext(0, HourContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIHour) {
            return visitor.visitIHour(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ILowerShadowContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public lower_shadow(): Lower_shadowContext {
        return this.getRuleContext(0, Lower_shadowContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitILowerShadow) {
            return visitor.visitILowerShadow(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ILowerShadowPContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public lower_shadowP(): Lower_shadowPContext {
        return this.getRuleContext(0, Lower_shadowPContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitILowerShadowP) {
            return visitor.visitILowerShadowP(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IMACD_histogramContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public macd_histogram(): Macd_histogramContext {
        return this.getRuleContext(0, Macd_histogramContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIMACD_histogram) {
            return visitor.visitIMACD_histogram(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class StringContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public STRING(): antlr.TerminalNode {
        return this.getToken(ExprParser.STRING, 0)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitString) {
            return visitor.visitString(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IAmplPContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public amplP(): AmplPContext {
        return this.getRuleContext(0, AmplPContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIAmplP) {
            return visitor.visitIAmplP(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ISymbolContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public symbol(): SymbolContext {
        return this.getRuleContext(0, SymbolContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitISymbol) {
            return visitor.visitISymbol(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IntContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public INT(): antlr.TerminalNode {
        return this.getToken(ExprParser.INT, 0)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitInt) {
            return visitor.visitInt(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBullBearListContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bull_bear_list(): Bull_bear_listContext {
        return this.getRuleContext(0, Bull_bear_listContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBullBearList) {
            return visitor.visitIBullBearList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IMinuteContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public minute(): MinuteContext {
        return this.getRuleContext(0, MinuteContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIMinute) {
            return visitor.visitIMinute(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IChangeContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public change(): ChangeContext {
        return this.getRuleContext(0, ChangeContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIChange) {
            return visitor.visitIChange(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ComparisonContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public comparisonOp(): ComparisonOpContext {
        return this.getRuleContext(0, ComparisonOpContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitComparison) {
            return visitor.visitComparison(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IAmplContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ampl(): AmplContext {
        return this.getRuleContext(0, AmplContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIAmpl) {
            return visitor.visitIAmpl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBullish_engulfingContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bullish_engulfing(): Bullish_engulfingContext {
        return this.getRuleContext(0, Bullish_engulfingContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBullish_engulfing) {
            return visitor.visitIBullish_engulfing(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ILowContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public low(): LowContext {
        return this.getRuleContext(0, LowContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitILow) {
            return visitor.visitILow(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IVolumeContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public volume(): VolumeContext {
        return this.getRuleContext(0, VolumeContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIVolume) {
            return visitor.visitIVolume(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBB_upContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bb_upper(): Bb_upperContext {
        return this.getRuleContext(0, Bb_upperContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBB_up) {
            return visitor.visitIBB_up(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IEMAContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ema(): EmaContext {
        return this.getRuleContext(0, EmaContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIEMA) {
            return visitor.visitIEMA(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBullishContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bullish(): BullishContext {
        return this.getRuleContext(0, BullishContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBullish) {
            return visitor.visitIBullish(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IRSISlopeContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public rsi_slope(): Rsi_slopeContext {
        return this.getRuleContext(0, Rsi_slopeContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIRSISlope) {
            return visitor.visitIRSISlope(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBB_lowContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bb_lower(): Bb_lowerContext {
        return this.getRuleContext(0, Bb_lowerContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBB_low) {
            return visitor.visitIBB_low(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IUpperShadowPContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public upper_shadowP(): Upper_shadowPContext {
        return this.getRuleContext(0, Upper_shadowPContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIUpperShadowP) {
            return visitor.visitIUpperShadowP(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IRSI_phan_kiContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public rsi_phan_ki(): Rsi_phan_kiContext {
        return this.getRuleContext(0, Rsi_phan_kiContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIRSI_phan_ki) {
            return visitor.visitIRSI_phan_ki(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IMACD_n_dinhContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public macd_n_dinh(): Macd_n_dinhContext {
        return this.getRuleContext(0, Macd_n_dinhContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIMACD_n_dinh) {
            return visitor.visitIMACD_n_dinh(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class AddSubContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expr(): ExprContext[];
    public expr(i: number): ExprContext | null;
    public expr(i?: number): ExprContext[] | ExprContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExprContext);
        }

        return this.getRuleContext(i, ExprContext);
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitAddSub) {
            return visitor.visitAddSub(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBearish_engulfingContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bearish_engulfing(): Bearish_engulfingContext {
        return this.getRuleContext(0, Bearish_engulfingContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBearish_engulfing) {
            return visitor.visitIBearish_engulfing(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IChangePContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public changeP(): ChangePContext {
        return this.getRuleContext(0, ChangePContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIChangeP) {
            return visitor.visitIChangeP(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBrokerContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public broker(): BrokerContext {
        return this.getRuleContext(0, BrokerContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBroker) {
            return visitor.visitIBroker(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBearish_hammerContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bearish_hammer(): Bearish_hammerContext {
        return this.getRuleContext(0, Bearish_hammerContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBearish_hammer) {
            return visitor.visitIBearish_hammer(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IRSIContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public rsi(): RsiContext {
        return this.getRuleContext(0, RsiContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIRSI) {
            return visitor.visitIRSI(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBB_midContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bb_middle(): Bb_middleContext {
        return this.getRuleContext(0, Bb_middleContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBB_mid) {
            return visitor.visitIBB_mid(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class FloatContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FLOAT(): antlr.TerminalNode {
        return this.getToken(ExprParser.FLOAT, 0)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitFloat) {
            return visitor.visitFloat(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IMACD_valueContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public macd_value(): Macd_valueContext {
        return this.getRuleContext(0, Macd_valueContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIMACD_value) {
            return visitor.visitIMACD_value(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IMACD_slopeContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public macd_slope(): Macd_slopeContext {
        return this.getRuleContext(0, Macd_slopeContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIMACD_slope) {
            return visitor.visitIMACD_slope(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ITimeframeContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public timeframe(): TimeframeContext {
        return this.getRuleContext(0, TimeframeContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitITimeframe) {
            return visitor.visitITimeframe(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IDojiContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public doji(): DojiContext {
        return this.getRuleContext(0, DojiContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIDoji) {
            return visitor.visitIDoji(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IMAContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ma(): MaContext {
        return this.getRuleContext(0, MaContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIMA) {
            return visitor.visitIMA(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IUpperShadowContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public upper_shadow(): Upper_shadowContext {
        return this.getRuleContext(0, Upper_shadowContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIUpperShadow) {
            return visitor.visitIUpperShadow(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IBearishContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public bearish(): BearishContext {
        return this.getRuleContext(0, BearishContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIBearish) {
            return visitor.visitIBearish(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class IOpenContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public open(): OpenContext {
        return this.getRuleContext(0, OpenContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitIOpen) {
            return visitor.visitIOpen(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BrokerContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_broker;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBroker) {
            return visitor.visitBroker(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SymbolContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_symbol;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitSymbol) {
            return visitor.visitSymbol(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TimeframeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_timeframe;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitTimeframe) {
            return visitor.visitTimeframe(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class HourContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_hour;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitHour) {
            return visitor.visitHour(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MinuteContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_minute;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMinute) {
            return visitor.visitMinute(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class OpenContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_open;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitOpen) {
            return visitor.visitOpen(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class HighContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_high;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitHigh) {
            return visitor.visitHigh(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LowContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_low;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitLow) {
            return visitor.visitLow(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class CloseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_close;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitClose) {
            return visitor.visitClose(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VolumeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_volume;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitVolume) {
            return visitor.visitVolume(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Volume24h_in_usdContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_volume24h_in_usd;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitVolume24h_in_usd) {
            return visitor.visitVolume24h_in_usd(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ChangeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_change;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitChange) {
            return visitor.visitChange(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ChangePContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_changeP;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitChangeP) {
            return visitor.visitChangeP(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AmplContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_ampl;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitAmpl) {
            return visitor.visitAmpl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AmplPContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_amplP;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitAmplP) {
            return visitor.visitAmplP(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Upper_shadowContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_upper_shadow;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitUpper_shadow) {
            return visitor.visitUpper_shadow(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Upper_shadowPContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_upper_shadowP;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitUpper_shadowP) {
            return visitor.visitUpper_shadowP(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Lower_shadowContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_lower_shadow;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitLower_shadow) {
            return visitor.visitLower_shadow(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Lower_shadowPContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_lower_shadowP;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitLower_shadowP) {
            return visitor.visitLower_shadowP(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RsiContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_rsi;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitRsi) {
            return visitor.visitRsi(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Rsi_slopeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_rsi_slope;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitRsi_slope) {
            return visitor.visitRsi_slope(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MaContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_ma;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMa) {
            return visitor.visitMa(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EmaContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_ema;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitEma) {
            return visitor.visitEma(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Macd_valueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_macd_value;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMacd_value) {
            return visitor.visitMacd_value(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Macd_signalContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_macd_signal;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMacd_signal) {
            return visitor.visitMacd_signal(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Macd_histogramContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_macd_histogram;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMacd_histogram) {
            return visitor.visitMacd_histogram(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Bb_upperContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public number(): NumberContext {
        return this.getRuleContext(0, NumberContext)!;
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bb_upper;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBb_upper) {
            return visitor.visitBb_upper(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Bb_middleContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public number(): NumberContext {
        return this.getRuleContext(0, NumberContext)!;
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bb_middle;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBb_middle) {
            return visitor.visitBb_middle(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Bb_lowerContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public number(): NumberContext {
        return this.getRuleContext(0, NumberContext)!;
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bb_lower;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBb_lower) {
            return visitor.visitBb_lower(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Rsi_phan_kiContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public number_(): NumberContext[];
    public number_(i: number): NumberContext | null;
    public number_(i?: number): NumberContext[] | NumberContext | null {
        if (i === undefined) {
            return this.getRuleContexts(NumberContext);
        }

        return this.getRuleContext(i, NumberContext);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_rsi_phan_ki;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitRsi_phan_ki) {
            return visitor.visitRsi_phan_ki(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Macd_n_dinhContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public number_(): NumberContext[];
    public number_(i: number): NumberContext | null;
    public number_(i?: number): NumberContext[] | NumberContext | null {
        if (i === undefined) {
            return this.getRuleContexts(NumberContext);
        }

        return this.getRuleContext(i, NumberContext);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_macd_n_dinh;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMacd_n_dinh) {
            return visitor.visitMacd_n_dinh(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Macd_slopeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_macd_slope;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMacd_slope) {
            return visitor.visitMacd_slope(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Bullish_engulfingContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bullish_engulfing;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBullish_engulfing) {
            return visitor.visitBullish_engulfing(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Bearish_engulfingContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bearish_engulfing;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBearish_engulfing) {
            return visitor.visitBearish_engulfing(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Bullish_hammerContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bullish_hammer;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBullish_hammer) {
            return visitor.visitBullish_hammer(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Bearish_hammerContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bearish_hammer;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBearish_hammer) {
            return visitor.visitBearish_hammer(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BullishContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bullish;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBullish) {
            return visitor.visitBullish(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BearishContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bearish;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBearish) {
            return visitor.visitBearish(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MarsiContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode[];
    public INT(i: number): antlr.TerminalNode | null;
    public INT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.INT);
    	} else {
    		return this.getToken(ExprParser.INT, i);
    	}
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_marsi;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitMarsi) {
            return visitor.visitMarsi(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class Bull_bear_listContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_bull_bear_list;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitBull_bear_list) {
            return visitor.visitBull_bear_list(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DojiContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_doji;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitDoji) {
            return visitor.visitDoji(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ComparisonOpContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_comparisonOp;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitComparisonOp) {
            return visitor.visitComparisonOp(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class NumberContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.INT, 0);
    }
    public FLOAT(): antlr.TerminalNode | null {
        return this.getToken(ExprParser.FLOAT, 0);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_number;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitNumber) {
            return visitor.visitNumber(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
