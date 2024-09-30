// Generated from src/Expr.g4 by ANTLR 4.13.1

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
    public static readonly INT = 51;
    public static readonly FLOAT = 52;
    public static readonly STRING = 53;
    public static readonly WS = 54;
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
    public static readonly RULE_comparisonOp = 39;

    public static readonly literalNames = [
        null, "'*'", "'/'", "'+'", "'-'", "'('", "')'", "'broker'", "'symbol'", 
        "'timeframe'", "'hour'", "'minute'", "'open'", "'high'", "'low'", 
        "'close'", "'volume'", "'volume24h_in_usd'", "'change'", "'change%'", 
        "'ampl'", "'ampl%'", "'upper_shadow'", "'upper_shadow%'", "'lower_shadow'", 
        "'lower_shadow%'", "'rsi'", "','", "'rsi_slope'", "'ma'", "'ema'", 
        "'macd_value'", "'macd_signal'", "'macd_histogram'", "'bb_upper'", 
        "'bb_middle'", "'bb_lower'", "'rsi_phan_ki'", "'macd_n_dinh'", "'macd_slope'", 
        "'bullish_engulfing'", "'bearish_engulfing'", "'bullish_hammer'", 
        "'bearish_hammer'", "'bullish'", "'bearish'", "'>'", "'>='", "'<'", 
        "'<='", "'='"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, "INT", "FLOAT", "STRING", 
        "WS"
    ];
    public static readonly ruleNames = [
        "expr", "broker", "symbol", "timeframe", "hour", "minute", "open", 
        "high", "low", "close", "volume", "volume24h_in_usd", "change", 
        "changeP", "ampl", "amplP", "upper_shadow", "upper_shadowP", "lower_shadow", 
        "lower_shadowP", "rsi", "rsi_slope", "ma", "ema", "macd_value", 
        "macd_signal", "macd_histogram", "bb_upper", "bb_middle", "bb_lower", 
        "rsi_phan_ki", "macd_n_dinh", "macd_slope", "bullish_engulfing", 
        "bearish_engulfing", "bullish_hammer", "bearish_hammer", "bullish", 
        "bearish", "comparisonOp",
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
            this.state = 126;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case ExprParser.T__4:
                {
                localContext = new ParensContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 81;
                this.match(ExprParser.T__4);
                this.state = 82;
                this.expr(0);
                this.state = 83;
                this.match(ExprParser.T__5);
                }
                break;
            case ExprParser.INT:
                {
                localContext = new IntContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 85;
                this.match(ExprParser.INT);
                }
                break;
            case ExprParser.FLOAT:
                {
                localContext = new FloatContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 86;
                this.match(ExprParser.FLOAT);
                }
                break;
            case ExprParser.STRING:
                {
                localContext = new StringContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 87;
                this.match(ExprParser.STRING);
                }
                break;
            case ExprParser.T__6:
                {
                localContext = new IBrokerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 88;
                this.broker();
                }
                break;
            case ExprParser.T__7:
                {
                localContext = new ISymbolContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 89;
                this.symbol_();
                }
                break;
            case ExprParser.T__8:
                {
                localContext = new ITimeframeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 90;
                this.timeframe();
                }
                break;
            case ExprParser.T__9:
                {
                localContext = new IHourContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 91;
                this.hour();
                }
                break;
            case ExprParser.T__10:
                {
                localContext = new IMinuteContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 92;
                this.minute();
                }
                break;
            case ExprParser.T__11:
                {
                localContext = new IOpenContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 93;
                this.open();
                }
                break;
            case ExprParser.T__12:
                {
                localContext = new IHighContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 94;
                this.high();
                }
                break;
            case ExprParser.T__13:
                {
                localContext = new ILowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 95;
                this.low();
                }
                break;
            case ExprParser.T__14:
                {
                localContext = new ICloseContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 96;
                this.close();
                }
                break;
            case ExprParser.T__15:
                {
                localContext = new IVolumeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 97;
                this.volume();
                }
                break;
            case ExprParser.T__16:
                {
                localContext = new IVolume24hInUSDContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 98;
                this.volume24h_in_usd();
                }
                break;
            case ExprParser.T__17:
                {
                localContext = new IChangeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 99;
                this.change();
                }
                break;
            case ExprParser.T__18:
                {
                localContext = new IChangePContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 100;
                this.changeP();
                }
                break;
            case ExprParser.T__19:
                {
                localContext = new IAmplContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 101;
                this.ampl();
                }
                break;
            case ExprParser.T__20:
                {
                localContext = new IAmplPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 102;
                this.amplP();
                }
                break;
            case ExprParser.T__21:
                {
                localContext = new IUpperShadowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 103;
                this.upper_shadow();
                }
                break;
            case ExprParser.T__22:
                {
                localContext = new IUpperShadowPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 104;
                this.upper_shadowP();
                }
                break;
            case ExprParser.T__23:
                {
                localContext = new ILowerShadowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 105;
                this.lower_shadow();
                }
                break;
            case ExprParser.T__24:
                {
                localContext = new ILowerShadowPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 106;
                this.lower_shadowP();
                }
                break;
            case ExprParser.T__25:
                {
                localContext = new IRSIContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 107;
                this.rsi();
                }
                break;
            case ExprParser.T__27:
                {
                localContext = new IRSISlopeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 108;
                this.rsi_slope();
                }
                break;
            case ExprParser.T__28:
                {
                localContext = new IMAContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 109;
                this.ma();
                }
                break;
            case ExprParser.T__29:
                {
                localContext = new IEMAContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 110;
                this.ema();
                }
                break;
            case ExprParser.T__30:
                {
                localContext = new IMACD_valueContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 111;
                this.macd_value();
                }
                break;
            case ExprParser.T__31:
                {
                localContext = new IMACD_signalContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 112;
                this.macd_signal();
                }
                break;
            case ExprParser.T__32:
                {
                localContext = new IMACD_histogramContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 113;
                this.macd_histogram();
                }
                break;
            case ExprParser.T__33:
                {
                localContext = new IBB_upContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 114;
                this.bb_upper();
                }
                break;
            case ExprParser.T__34:
                {
                localContext = new IBB_midContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 115;
                this.bb_middle();
                }
                break;
            case ExprParser.T__35:
                {
                localContext = new IBB_lowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 116;
                this.bb_lower();
                }
                break;
            case ExprParser.T__36:
                {
                localContext = new IRSI_phan_kiContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 117;
                this.rsi_phan_ki();
                }
                break;
            case ExprParser.T__37:
                {
                localContext = new IMACD_n_dinhContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 118;
                this.macd_n_dinh();
                }
                break;
            case ExprParser.T__38:
                {
                localContext = new IMACD_slopeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 119;
                this.macd_slope();
                }
                break;
            case ExprParser.T__39:
                {
                localContext = new IBullish_engulfingContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 120;
                this.bullish_engulfing();
                }
                break;
            case ExprParser.T__40:
                {
                localContext = new IBearish_engulfingContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 121;
                this.bearish_engulfing();
                }
                break;
            case ExprParser.T__41:
                {
                localContext = new IBullish_hammerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 122;
                this.bullish_hammer();
                }
                break;
            case ExprParser.T__42:
                {
                localContext = new IBearish_hammerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 123;
                this.bearish_hammer();
                }
                break;
            case ExprParser.T__43:
                {
                localContext = new IBullishContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 124;
                this.bullish();
                }
                break;
            case ExprParser.T__44:
                {
                localContext = new IBearishContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 125;
                this.bearish();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 140;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 138;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
                    case 1:
                        {
                        localContext = new MulDivContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 128;
                        if (!(this.precpred(this.context, 45))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 45)");
                        }
                        this.state = 129;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 1 || _la === 2)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 130;
                        this.expr(46);
                        }
                        break;
                    case 2:
                        {
                        localContext = new AddSubContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 131;
                        if (!(this.precpred(this.context, 44))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 44)");
                        }
                        this.state = 132;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 3 || _la === 4)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 133;
                        this.expr(45);
                        }
                        break;
                    case 3:
                        {
                        localContext = new ComparisonContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 134;
                        if (!(this.precpred(this.context, 43))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 43)");
                        }
                        this.state = 135;
                        this.comparisonOp();
                        this.state = 136;
                        this.expr(44);
                        }
                        break;
                    }
                    }
                }
                this.state = 142;
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
            this.state = 143;
            this.match(ExprParser.T__6);
            this.state = 144;
            this.match(ExprParser.T__4);
            this.state = 145;
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
            this.state = 147;
            this.match(ExprParser.T__7);
            this.state = 148;
            this.match(ExprParser.T__4);
            this.state = 149;
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
            this.state = 151;
            this.match(ExprParser.T__8);
            this.state = 152;
            this.match(ExprParser.T__4);
            this.state = 153;
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
            this.state = 155;
            this.match(ExprParser.T__9);
            this.state = 156;
            this.match(ExprParser.T__4);
            this.state = 157;
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
            this.state = 159;
            this.match(ExprParser.T__10);
            this.state = 160;
            this.match(ExprParser.T__4);
            this.state = 161;
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
            this.state = 163;
            this.match(ExprParser.T__11);
            this.state = 164;
            this.match(ExprParser.T__4);
            this.state = 166;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 165;
                this.match(ExprParser.INT);
                }
            }

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
    public high(): HighContext {
        let localContext = new HighContext(this.context, this.state);
        this.enterRule(localContext, 14, ExprParser.RULE_high);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 170;
            this.match(ExprParser.T__12);
            this.state = 171;
            this.match(ExprParser.T__4);
            this.state = 173;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 172;
                this.match(ExprParser.INT);
                }
            }

            this.state = 175;
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
            this.state = 177;
            this.match(ExprParser.T__13);
            this.state = 178;
            this.match(ExprParser.T__4);
            this.state = 180;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 179;
                this.match(ExprParser.INT);
                }
            }

            this.state = 182;
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
            this.state = 184;
            this.match(ExprParser.T__14);
            this.state = 185;
            this.match(ExprParser.T__4);
            this.state = 187;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 186;
                this.match(ExprParser.INT);
                }
            }

            this.state = 189;
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
            this.state = 191;
            this.match(ExprParser.T__15);
            this.state = 192;
            this.match(ExprParser.T__4);
            this.state = 194;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 193;
                this.match(ExprParser.INT);
                }
            }

            this.state = 196;
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
            this.state = 198;
            this.match(ExprParser.T__16);
            this.state = 199;
            this.match(ExprParser.T__4);
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
    public change(): ChangeContext {
        let localContext = new ChangeContext(this.context, this.state);
        this.enterRule(localContext, 24, ExprParser.RULE_change);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 202;
            this.match(ExprParser.T__17);
            this.state = 203;
            this.match(ExprParser.T__4);
            this.state = 205;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
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
    public changeP(): ChangePContext {
        let localContext = new ChangePContext(this.context, this.state);
        this.enterRule(localContext, 26, ExprParser.RULE_changeP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 209;
            this.match(ExprParser.T__18);
            this.state = 210;
            this.match(ExprParser.T__4);
            this.state = 212;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 211;
                this.match(ExprParser.INT);
                }
            }

            this.state = 214;
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
            this.state = 216;
            this.match(ExprParser.T__19);
            this.state = 217;
            this.match(ExprParser.T__4);
            this.state = 219;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 218;
                this.match(ExprParser.INT);
                }
            }

            this.state = 221;
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
            this.state = 223;
            this.match(ExprParser.T__20);
            this.state = 224;
            this.match(ExprParser.T__4);
            this.state = 226;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 225;
                this.match(ExprParser.INT);
                }
            }

            this.state = 228;
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
            this.state = 230;
            this.match(ExprParser.T__21);
            this.state = 231;
            this.match(ExprParser.T__4);
            this.state = 233;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 232;
                this.match(ExprParser.INT);
                }
            }

            this.state = 235;
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
            this.state = 237;
            this.match(ExprParser.T__22);
            this.state = 238;
            this.match(ExprParser.T__4);
            this.state = 240;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 239;
                this.match(ExprParser.INT);
                }
            }

            this.state = 242;
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
            this.state = 244;
            this.match(ExprParser.T__23);
            this.state = 245;
            this.match(ExprParser.T__4);
            this.state = 247;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 246;
                this.match(ExprParser.INT);
                }
            }

            this.state = 249;
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
            this.state = 251;
            this.match(ExprParser.T__24);
            this.state = 252;
            this.match(ExprParser.T__4);
            this.state = 254;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 253;
                this.match(ExprParser.INT);
                }
            }

            this.state = 256;
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
            this.state = 258;
            this.match(ExprParser.T__25);
            this.state = 259;
            this.match(ExprParser.T__4);
            this.state = 260;
            this.match(ExprParser.INT);
            this.state = 263;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 261;
                this.match(ExprParser.T__26);
                this.state = 262;
                this.match(ExprParser.INT);
                }
            }

            this.state = 265;
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
            this.state = 267;
            this.match(ExprParser.T__27);
            this.state = 268;
            this.match(ExprParser.T__4);
            this.state = 269;
            this.match(ExprParser.INT);
            this.state = 272;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 270;
                this.match(ExprParser.T__26);
                this.state = 271;
                this.match(ExprParser.INT);
                }
            }

            this.state = 274;
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
            this.state = 276;
            this.match(ExprParser.T__28);
            this.state = 277;
            this.match(ExprParser.T__4);
            this.state = 278;
            this.match(ExprParser.INT);
            this.state = 281;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 279;
                this.match(ExprParser.T__26);
                this.state = 280;
                this.match(ExprParser.INT);
                }
            }

            this.state = 283;
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
            this.state = 285;
            this.match(ExprParser.T__29);
            this.state = 286;
            this.match(ExprParser.T__4);
            this.state = 287;
            this.match(ExprParser.INT);
            this.state = 290;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 288;
                this.match(ExprParser.T__26);
                this.state = 289;
                this.match(ExprParser.INT);
                }
            }

            this.state = 292;
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
            this.state = 294;
            this.match(ExprParser.T__30);
            this.state = 295;
            this.match(ExprParser.T__4);
            this.state = 296;
            this.match(ExprParser.INT);
            this.state = 297;
            this.match(ExprParser.T__26);
            this.state = 298;
            this.match(ExprParser.INT);
            this.state = 299;
            this.match(ExprParser.T__26);
            this.state = 300;
            this.match(ExprParser.INT);
            this.state = 303;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 301;
                this.match(ExprParser.T__26);
                this.state = 302;
                this.match(ExprParser.INT);
                }
            }

            this.state = 305;
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
            this.state = 307;
            this.match(ExprParser.T__31);
            this.state = 308;
            this.match(ExprParser.T__4);
            this.state = 309;
            this.match(ExprParser.INT);
            this.state = 310;
            this.match(ExprParser.T__26);
            this.state = 311;
            this.match(ExprParser.INT);
            this.state = 312;
            this.match(ExprParser.T__26);
            this.state = 313;
            this.match(ExprParser.INT);
            this.state = 316;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 314;
                this.match(ExprParser.T__26);
                this.state = 315;
                this.match(ExprParser.INT);
                }
            }

            this.state = 318;
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
            this.state = 320;
            this.match(ExprParser.T__32);
            this.state = 321;
            this.match(ExprParser.T__4);
            this.state = 322;
            this.match(ExprParser.INT);
            this.state = 323;
            this.match(ExprParser.T__26);
            this.state = 324;
            this.match(ExprParser.INT);
            this.state = 325;
            this.match(ExprParser.T__26);
            this.state = 326;
            this.match(ExprParser.INT);
            this.state = 329;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 327;
                this.match(ExprParser.T__26);
                this.state = 328;
                this.match(ExprParser.INT);
                }
            }

            this.state = 331;
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
            this.state = 333;
            this.match(ExprParser.T__33);
            this.state = 334;
            this.match(ExprParser.T__4);
            this.state = 335;
            this.match(ExprParser.INT);
            this.state = 336;
            this.match(ExprParser.T__26);
            this.state = 337;
            this.match(ExprParser.FLOAT);
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
    public bb_middle(): Bb_middleContext {
        let localContext = new Bb_middleContext(this.context, this.state);
        this.enterRule(localContext, 56, ExprParser.RULE_bb_middle);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 344;
            this.match(ExprParser.T__34);
            this.state = 345;
            this.match(ExprParser.T__4);
            this.state = 346;
            this.match(ExprParser.INT);
            this.state = 347;
            this.match(ExprParser.T__26);
            this.state = 348;
            this.match(ExprParser.FLOAT);
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
    public bb_lower(): Bb_lowerContext {
        let localContext = new Bb_lowerContext(this.context, this.state);
        this.enterRule(localContext, 58, ExprParser.RULE_bb_lower);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 355;
            this.match(ExprParser.T__35);
            this.state = 356;
            this.match(ExprParser.T__4);
            this.state = 357;
            this.match(ExprParser.INT);
            this.state = 358;
            this.match(ExprParser.T__26);
            this.state = 359;
            this.match(ExprParser.FLOAT);
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
    public rsi_phan_ki(): Rsi_phan_kiContext {
        let localContext = new Rsi_phan_kiContext(this.context, this.state);
        this.enterRule(localContext, 60, ExprParser.RULE_rsi_phan_ki);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 366;
            this.match(ExprParser.T__36);
            this.state = 367;
            this.match(ExprParser.T__4);
            this.state = 368;
            this.match(ExprParser.INT);
            this.state = 369;
            this.match(ExprParser.T__26);
            this.state = 370;
            this.match(ExprParser.FLOAT);
            this.state = 371;
            this.match(ExprParser.T__26);
            this.state = 372;
            this.match(ExprParser.INT);
            this.state = 373;
            this.match(ExprParser.T__26);
            this.state = 374;
            this.match(ExprParser.INT);
            this.state = 375;
            this.match(ExprParser.T__26);
            this.state = 376;
            this.match(ExprParser.FLOAT);
            this.state = 377;
            this.match(ExprParser.T__26);
            this.state = 378;
            this.match(ExprParser.FLOAT);
            this.state = 381;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 379;
                this.match(ExprParser.T__26);
                this.state = 380;
                this.match(ExprParser.INT);
                }
            }

            this.state = 383;
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
            this.state = 385;
            this.match(ExprParser.T__37);
            this.state = 386;
            this.match(ExprParser.T__4);
            this.state = 387;
            this.match(ExprParser.INT);
            this.state = 388;
            this.match(ExprParser.T__26);
            this.state = 389;
            this.match(ExprParser.INT);
            this.state = 390;
            this.match(ExprParser.T__26);
            this.state = 391;
            this.match(ExprParser.INT);
            this.state = 392;
            this.match(ExprParser.T__26);
            this.state = 393;
            this.match(ExprParser.INT);
            this.state = 394;
            this.match(ExprParser.T__26);
            this.state = 395;
            this.match(ExprParser.INT);
            this.state = 396;
            this.match(ExprParser.T__26);
            this.state = 397;
            this.match(ExprParser.INT);
            this.state = 398;
            this.match(ExprParser.T__26);
            this.state = 399;
            this.match(ExprParser.FLOAT);
            this.state = 400;
            this.match(ExprParser.T__26);
            this.state = 401;
            this.match(ExprParser.INT);
            this.state = 406;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 27) {
                {
                {
                this.state = 402;
                this.match(ExprParser.T__26);
                this.state = 403;
                this.match(ExprParser.FLOAT);
                }
                }
                this.state = 408;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 409;
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
            this.state = 411;
            this.match(ExprParser.T__38);
            this.state = 412;
            this.match(ExprParser.T__4);
            this.state = 413;
            this.match(ExprParser.INT);
            this.state = 414;
            this.match(ExprParser.T__26);
            this.state = 415;
            this.match(ExprParser.INT);
            this.state = 416;
            this.match(ExprParser.T__26);
            this.state = 417;
            this.match(ExprParser.INT);
            this.state = 420;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 418;
                this.match(ExprParser.T__26);
                this.state = 419;
                this.match(ExprParser.INT);
                }
            }

            this.state = 422;
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
            this.state = 424;
            this.match(ExprParser.T__39);
            this.state = 425;
            this.match(ExprParser.T__4);
            this.state = 427;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 426;
                this.match(ExprParser.INT);
                }
            }

            this.state = 429;
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
            this.state = 431;
            this.match(ExprParser.T__40);
            this.state = 432;
            this.match(ExprParser.T__4);
            this.state = 434;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 433;
                this.match(ExprParser.INT);
                }
            }

            this.state = 436;
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
            this.state = 438;
            this.match(ExprParser.T__41);
            this.state = 439;
            this.match(ExprParser.T__4);
            this.state = 441;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 440;
                this.match(ExprParser.INT);
                }
            }

            this.state = 443;
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
            this.state = 445;
            this.match(ExprParser.T__42);
            this.state = 446;
            this.match(ExprParser.T__4);
            this.state = 448;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 447;
                this.match(ExprParser.INT);
                }
            }

            this.state = 450;
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
            this.state = 452;
            this.match(ExprParser.T__43);
            this.state = 453;
            this.match(ExprParser.T__4);
            this.state = 455;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 454;
                this.match(ExprParser.INT);
                }
            }

            this.state = 457;
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
            this.state = 459;
            this.match(ExprParser.T__44);
            this.state = 460;
            this.match(ExprParser.T__4);
            this.state = 462;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 51) {
                {
                this.state = 461;
                this.match(ExprParser.INT);
                }
            }

            this.state = 464;
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
        this.enterRule(localContext, 78, ExprParser.RULE_comparisonOp);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 466;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 46)) & ~0x1F) === 0 && ((1 << (_la - 46)) & 31) !== 0))) {
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
            return this.precpred(this.context, 45);
        case 1:
            return this.precpred(this.context, 44);
        case 2:
            return this.precpred(this.context, 43);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,54,469,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,
        7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,39,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,127,
        8,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,139,8,0,10,0,12,
        0,142,9,0,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,4,1,
        4,1,4,1,4,1,5,1,5,1,5,1,5,1,6,1,6,1,6,3,6,167,8,6,1,6,1,6,1,7,1,
        7,1,7,3,7,174,8,7,1,7,1,7,1,8,1,8,1,8,3,8,181,8,8,1,8,1,8,1,9,1,
        9,1,9,3,9,188,8,9,1,9,1,9,1,10,1,10,1,10,3,10,195,8,10,1,10,1,10,
        1,11,1,11,1,11,1,11,1,12,1,12,1,12,3,12,206,8,12,1,12,1,12,1,13,
        1,13,1,13,3,13,213,8,13,1,13,1,13,1,14,1,14,1,14,3,14,220,8,14,1,
        14,1,14,1,15,1,15,1,15,3,15,227,8,15,1,15,1,15,1,16,1,16,1,16,3,
        16,234,8,16,1,16,1,16,1,17,1,17,1,17,3,17,241,8,17,1,17,1,17,1,18,
        1,18,1,18,3,18,248,8,18,1,18,1,18,1,19,1,19,1,19,3,19,255,8,19,1,
        19,1,19,1,20,1,20,1,20,1,20,1,20,3,20,264,8,20,1,20,1,20,1,21,1,
        21,1,21,1,21,1,21,3,21,273,8,21,1,21,1,21,1,22,1,22,1,22,1,22,1,
        22,3,22,282,8,22,1,22,1,22,1,23,1,23,1,23,1,23,1,23,3,23,291,8,23,
        1,23,1,23,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,3,24,304,
        8,24,1,24,1,24,1,25,1,25,1,25,1,25,1,25,1,25,1,25,1,25,1,25,3,25,
        317,8,25,1,25,1,25,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,
        3,26,330,8,26,1,26,1,26,1,27,1,27,1,27,1,27,1,27,1,27,1,27,3,27,
        341,8,27,1,27,1,27,1,28,1,28,1,28,1,28,1,28,1,28,1,28,3,28,352,8,
        28,1,28,1,28,1,29,1,29,1,29,1,29,1,29,1,29,1,29,3,29,363,8,29,1,
        29,1,29,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,
        30,1,30,1,30,1,30,3,30,382,8,30,1,30,1,30,1,31,1,31,1,31,1,31,1,
        31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,31,1,
        31,1,31,5,31,405,8,31,10,31,12,31,408,9,31,1,31,1,31,1,32,1,32,1,
        32,1,32,1,32,1,32,1,32,1,32,1,32,3,32,421,8,32,1,32,1,32,1,33,1,
        33,1,33,3,33,428,8,33,1,33,1,33,1,34,1,34,1,34,3,34,435,8,34,1,34,
        1,34,1,35,1,35,1,35,3,35,442,8,35,1,35,1,35,1,36,1,36,1,36,3,36,
        449,8,36,1,36,1,36,1,37,1,37,1,37,3,37,456,8,37,1,37,1,37,1,38,1,
        38,1,38,3,38,463,8,38,1,38,1,38,1,39,1,39,1,39,0,1,0,40,0,2,4,6,
        8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,
        52,54,56,58,60,62,64,66,68,70,72,74,76,78,0,3,1,0,1,2,1,0,3,4,1,
        0,46,50,504,0,126,1,0,0,0,2,143,1,0,0,0,4,147,1,0,0,0,6,151,1,0,
        0,0,8,155,1,0,0,0,10,159,1,0,0,0,12,163,1,0,0,0,14,170,1,0,0,0,16,
        177,1,0,0,0,18,184,1,0,0,0,20,191,1,0,0,0,22,198,1,0,0,0,24,202,
        1,0,0,0,26,209,1,0,0,0,28,216,1,0,0,0,30,223,1,0,0,0,32,230,1,0,
        0,0,34,237,1,0,0,0,36,244,1,0,0,0,38,251,1,0,0,0,40,258,1,0,0,0,
        42,267,1,0,0,0,44,276,1,0,0,0,46,285,1,0,0,0,48,294,1,0,0,0,50,307,
        1,0,0,0,52,320,1,0,0,0,54,333,1,0,0,0,56,344,1,0,0,0,58,355,1,0,
        0,0,60,366,1,0,0,0,62,385,1,0,0,0,64,411,1,0,0,0,66,424,1,0,0,0,
        68,431,1,0,0,0,70,438,1,0,0,0,72,445,1,0,0,0,74,452,1,0,0,0,76,459,
        1,0,0,0,78,466,1,0,0,0,80,81,6,0,-1,0,81,82,5,5,0,0,82,83,3,0,0,
        0,83,84,5,6,0,0,84,127,1,0,0,0,85,127,5,51,0,0,86,127,5,52,0,0,87,
        127,5,53,0,0,88,127,3,2,1,0,89,127,3,4,2,0,90,127,3,6,3,0,91,127,
        3,8,4,0,92,127,3,10,5,0,93,127,3,12,6,0,94,127,3,14,7,0,95,127,3,
        16,8,0,96,127,3,18,9,0,97,127,3,20,10,0,98,127,3,22,11,0,99,127,
        3,24,12,0,100,127,3,26,13,0,101,127,3,28,14,0,102,127,3,30,15,0,
        103,127,3,32,16,0,104,127,3,34,17,0,105,127,3,36,18,0,106,127,3,
        38,19,0,107,127,3,40,20,0,108,127,3,42,21,0,109,127,3,44,22,0,110,
        127,3,46,23,0,111,127,3,48,24,0,112,127,3,50,25,0,113,127,3,52,26,
        0,114,127,3,54,27,0,115,127,3,56,28,0,116,127,3,58,29,0,117,127,
        3,60,30,0,118,127,3,62,31,0,119,127,3,64,32,0,120,127,3,66,33,0,
        121,127,3,68,34,0,122,127,3,70,35,0,123,127,3,72,36,0,124,127,3,
        74,37,0,125,127,3,76,38,0,126,80,1,0,0,0,126,85,1,0,0,0,126,86,1,
        0,0,0,126,87,1,0,0,0,126,88,1,0,0,0,126,89,1,0,0,0,126,90,1,0,0,
        0,126,91,1,0,0,0,126,92,1,0,0,0,126,93,1,0,0,0,126,94,1,0,0,0,126,
        95,1,0,0,0,126,96,1,0,0,0,126,97,1,0,0,0,126,98,1,0,0,0,126,99,1,
        0,0,0,126,100,1,0,0,0,126,101,1,0,0,0,126,102,1,0,0,0,126,103,1,
        0,0,0,126,104,1,0,0,0,126,105,1,0,0,0,126,106,1,0,0,0,126,107,1,
        0,0,0,126,108,1,0,0,0,126,109,1,0,0,0,126,110,1,0,0,0,126,111,1,
        0,0,0,126,112,1,0,0,0,126,113,1,0,0,0,126,114,1,0,0,0,126,115,1,
        0,0,0,126,116,1,0,0,0,126,117,1,0,0,0,126,118,1,0,0,0,126,119,1,
        0,0,0,126,120,1,0,0,0,126,121,1,0,0,0,126,122,1,0,0,0,126,123,1,
        0,0,0,126,124,1,0,0,0,126,125,1,0,0,0,127,140,1,0,0,0,128,129,10,
        45,0,0,129,130,7,0,0,0,130,139,3,0,0,46,131,132,10,44,0,0,132,133,
        7,1,0,0,133,139,3,0,0,45,134,135,10,43,0,0,135,136,3,78,39,0,136,
        137,3,0,0,44,137,139,1,0,0,0,138,128,1,0,0,0,138,131,1,0,0,0,138,
        134,1,0,0,0,139,142,1,0,0,0,140,138,1,0,0,0,140,141,1,0,0,0,141,
        1,1,0,0,0,142,140,1,0,0,0,143,144,5,7,0,0,144,145,5,5,0,0,145,146,
        5,6,0,0,146,3,1,0,0,0,147,148,5,8,0,0,148,149,5,5,0,0,149,150,5,
        6,0,0,150,5,1,0,0,0,151,152,5,9,0,0,152,153,5,5,0,0,153,154,5,6,
        0,0,154,7,1,0,0,0,155,156,5,10,0,0,156,157,5,5,0,0,157,158,5,6,0,
        0,158,9,1,0,0,0,159,160,5,11,0,0,160,161,5,5,0,0,161,162,5,6,0,0,
        162,11,1,0,0,0,163,164,5,12,0,0,164,166,5,5,0,0,165,167,5,51,0,0,
        166,165,1,0,0,0,166,167,1,0,0,0,167,168,1,0,0,0,168,169,5,6,0,0,
        169,13,1,0,0,0,170,171,5,13,0,0,171,173,5,5,0,0,172,174,5,51,0,0,
        173,172,1,0,0,0,173,174,1,0,0,0,174,175,1,0,0,0,175,176,5,6,0,0,
        176,15,1,0,0,0,177,178,5,14,0,0,178,180,5,5,0,0,179,181,5,51,0,0,
        180,179,1,0,0,0,180,181,1,0,0,0,181,182,1,0,0,0,182,183,5,6,0,0,
        183,17,1,0,0,0,184,185,5,15,0,0,185,187,5,5,0,0,186,188,5,51,0,0,
        187,186,1,0,0,0,187,188,1,0,0,0,188,189,1,0,0,0,189,190,5,6,0,0,
        190,19,1,0,0,0,191,192,5,16,0,0,192,194,5,5,0,0,193,195,5,51,0,0,
        194,193,1,0,0,0,194,195,1,0,0,0,195,196,1,0,0,0,196,197,5,6,0,0,
        197,21,1,0,0,0,198,199,5,17,0,0,199,200,5,5,0,0,200,201,5,6,0,0,
        201,23,1,0,0,0,202,203,5,18,0,0,203,205,5,5,0,0,204,206,5,51,0,0,
        205,204,1,0,0,0,205,206,1,0,0,0,206,207,1,0,0,0,207,208,5,6,0,0,
        208,25,1,0,0,0,209,210,5,19,0,0,210,212,5,5,0,0,211,213,5,51,0,0,
        212,211,1,0,0,0,212,213,1,0,0,0,213,214,1,0,0,0,214,215,5,6,0,0,
        215,27,1,0,0,0,216,217,5,20,0,0,217,219,5,5,0,0,218,220,5,51,0,0,
        219,218,1,0,0,0,219,220,1,0,0,0,220,221,1,0,0,0,221,222,5,6,0,0,
        222,29,1,0,0,0,223,224,5,21,0,0,224,226,5,5,0,0,225,227,5,51,0,0,
        226,225,1,0,0,0,226,227,1,0,0,0,227,228,1,0,0,0,228,229,5,6,0,0,
        229,31,1,0,0,0,230,231,5,22,0,0,231,233,5,5,0,0,232,234,5,51,0,0,
        233,232,1,0,0,0,233,234,1,0,0,0,234,235,1,0,0,0,235,236,5,6,0,0,
        236,33,1,0,0,0,237,238,5,23,0,0,238,240,5,5,0,0,239,241,5,51,0,0,
        240,239,1,0,0,0,240,241,1,0,0,0,241,242,1,0,0,0,242,243,5,6,0,0,
        243,35,1,0,0,0,244,245,5,24,0,0,245,247,5,5,0,0,246,248,5,51,0,0,
        247,246,1,0,0,0,247,248,1,0,0,0,248,249,1,0,0,0,249,250,5,6,0,0,
        250,37,1,0,0,0,251,252,5,25,0,0,252,254,5,5,0,0,253,255,5,51,0,0,
        254,253,1,0,0,0,254,255,1,0,0,0,255,256,1,0,0,0,256,257,5,6,0,0,
        257,39,1,0,0,0,258,259,5,26,0,0,259,260,5,5,0,0,260,263,5,51,0,0,
        261,262,5,27,0,0,262,264,5,51,0,0,263,261,1,0,0,0,263,264,1,0,0,
        0,264,265,1,0,0,0,265,266,5,6,0,0,266,41,1,0,0,0,267,268,5,28,0,
        0,268,269,5,5,0,0,269,272,5,51,0,0,270,271,5,27,0,0,271,273,5,51,
        0,0,272,270,1,0,0,0,272,273,1,0,0,0,273,274,1,0,0,0,274,275,5,6,
        0,0,275,43,1,0,0,0,276,277,5,29,0,0,277,278,5,5,0,0,278,281,5,51,
        0,0,279,280,5,27,0,0,280,282,5,51,0,0,281,279,1,0,0,0,281,282,1,
        0,0,0,282,283,1,0,0,0,283,284,5,6,0,0,284,45,1,0,0,0,285,286,5,30,
        0,0,286,287,5,5,0,0,287,290,5,51,0,0,288,289,5,27,0,0,289,291,5,
        51,0,0,290,288,1,0,0,0,290,291,1,0,0,0,291,292,1,0,0,0,292,293,5,
        6,0,0,293,47,1,0,0,0,294,295,5,31,0,0,295,296,5,5,0,0,296,297,5,
        51,0,0,297,298,5,27,0,0,298,299,5,51,0,0,299,300,5,27,0,0,300,303,
        5,51,0,0,301,302,5,27,0,0,302,304,5,51,0,0,303,301,1,0,0,0,303,304,
        1,0,0,0,304,305,1,0,0,0,305,306,5,6,0,0,306,49,1,0,0,0,307,308,5,
        32,0,0,308,309,5,5,0,0,309,310,5,51,0,0,310,311,5,27,0,0,311,312,
        5,51,0,0,312,313,5,27,0,0,313,316,5,51,0,0,314,315,5,27,0,0,315,
        317,5,51,0,0,316,314,1,0,0,0,316,317,1,0,0,0,317,318,1,0,0,0,318,
        319,5,6,0,0,319,51,1,0,0,0,320,321,5,33,0,0,321,322,5,5,0,0,322,
        323,5,51,0,0,323,324,5,27,0,0,324,325,5,51,0,0,325,326,5,27,0,0,
        326,329,5,51,0,0,327,328,5,27,0,0,328,330,5,51,0,0,329,327,1,0,0,
        0,329,330,1,0,0,0,330,331,1,0,0,0,331,332,5,6,0,0,332,53,1,0,0,0,
        333,334,5,34,0,0,334,335,5,5,0,0,335,336,5,51,0,0,336,337,5,27,0,
        0,337,340,5,52,0,0,338,339,5,27,0,0,339,341,5,51,0,0,340,338,1,0,
        0,0,340,341,1,0,0,0,341,342,1,0,0,0,342,343,5,6,0,0,343,55,1,0,0,
        0,344,345,5,35,0,0,345,346,5,5,0,0,346,347,5,51,0,0,347,348,5,27,
        0,0,348,351,5,52,0,0,349,350,5,27,0,0,350,352,5,51,0,0,351,349,1,
        0,0,0,351,352,1,0,0,0,352,353,1,0,0,0,353,354,5,6,0,0,354,57,1,0,
        0,0,355,356,5,36,0,0,356,357,5,5,0,0,357,358,5,51,0,0,358,359,5,
        27,0,0,359,362,5,52,0,0,360,361,5,27,0,0,361,363,5,51,0,0,362,360,
        1,0,0,0,362,363,1,0,0,0,363,364,1,0,0,0,364,365,5,6,0,0,365,59,1,
        0,0,0,366,367,5,37,0,0,367,368,5,5,0,0,368,369,5,51,0,0,369,370,
        5,27,0,0,370,371,5,52,0,0,371,372,5,27,0,0,372,373,5,51,0,0,373,
        374,5,27,0,0,374,375,5,51,0,0,375,376,5,27,0,0,376,377,5,52,0,0,
        377,378,5,27,0,0,378,381,5,52,0,0,379,380,5,27,0,0,380,382,5,51,
        0,0,381,379,1,0,0,0,381,382,1,0,0,0,382,383,1,0,0,0,383,384,5,6,
        0,0,384,61,1,0,0,0,385,386,5,38,0,0,386,387,5,5,0,0,387,388,5,51,
        0,0,388,389,5,27,0,0,389,390,5,51,0,0,390,391,5,27,0,0,391,392,5,
        51,0,0,392,393,5,27,0,0,393,394,5,51,0,0,394,395,5,27,0,0,395,396,
        5,51,0,0,396,397,5,27,0,0,397,398,5,51,0,0,398,399,5,27,0,0,399,
        400,5,52,0,0,400,401,5,27,0,0,401,406,5,51,0,0,402,403,5,27,0,0,
        403,405,5,52,0,0,404,402,1,0,0,0,405,408,1,0,0,0,406,404,1,0,0,0,
        406,407,1,0,0,0,407,409,1,0,0,0,408,406,1,0,0,0,409,410,5,6,0,0,
        410,63,1,0,0,0,411,412,5,39,0,0,412,413,5,5,0,0,413,414,5,51,0,0,
        414,415,5,27,0,0,415,416,5,51,0,0,416,417,5,27,0,0,417,420,5,51,
        0,0,418,419,5,27,0,0,419,421,5,51,0,0,420,418,1,0,0,0,420,421,1,
        0,0,0,421,422,1,0,0,0,422,423,5,6,0,0,423,65,1,0,0,0,424,425,5,40,
        0,0,425,427,5,5,0,0,426,428,5,51,0,0,427,426,1,0,0,0,427,428,1,0,
        0,0,428,429,1,0,0,0,429,430,5,6,0,0,430,67,1,0,0,0,431,432,5,41,
        0,0,432,434,5,5,0,0,433,435,5,51,0,0,434,433,1,0,0,0,434,435,1,0,
        0,0,435,436,1,0,0,0,436,437,5,6,0,0,437,69,1,0,0,0,438,439,5,42,
        0,0,439,441,5,5,0,0,440,442,5,51,0,0,441,440,1,0,0,0,441,442,1,0,
        0,0,442,443,1,0,0,0,443,444,5,6,0,0,444,71,1,0,0,0,445,446,5,43,
        0,0,446,448,5,5,0,0,447,449,5,51,0,0,448,447,1,0,0,0,448,449,1,0,
        0,0,449,450,1,0,0,0,450,451,5,6,0,0,451,73,1,0,0,0,452,453,5,44,
        0,0,453,455,5,5,0,0,454,456,5,51,0,0,455,454,1,0,0,0,455,456,1,0,
        0,0,456,457,1,0,0,0,457,458,5,6,0,0,458,75,1,0,0,0,459,460,5,45,
        0,0,460,462,5,5,0,0,461,463,5,51,0,0,462,461,1,0,0,0,462,463,1,0,
        0,0,463,464,1,0,0,0,464,465,5,6,0,0,465,77,1,0,0,0,466,467,7,2,0,
        0,467,79,1,0,0,0,35,126,138,140,166,173,180,187,194,205,212,219,
        226,233,240,247,254,263,272,281,290,303,316,329,340,351,362,381,
        406,420,427,434,441,448,455,462
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
    public FLOAT(): antlr.TerminalNode {
        return this.getToken(ExprParser.FLOAT, 0)!;
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
    public FLOAT(): antlr.TerminalNode {
        return this.getToken(ExprParser.FLOAT, 0)!;
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
    public FLOAT(): antlr.TerminalNode {
        return this.getToken(ExprParser.FLOAT, 0)!;
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
    public FLOAT(): antlr.TerminalNode[];
    public FLOAT(i: number): antlr.TerminalNode | null;
    public FLOAT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.FLOAT);
    	} else {
    		return this.getToken(ExprParser.FLOAT, i);
    	}
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
    public FLOAT(): antlr.TerminalNode[];
    public FLOAT(i: number): antlr.TerminalNode | null;
    public FLOAT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(ExprParser.FLOAT);
    	} else {
    		return this.getToken(ExprParser.FLOAT, i);
    	}
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
