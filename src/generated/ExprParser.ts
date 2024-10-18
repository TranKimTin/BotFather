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
    public static readonly T__50 = 51;
    public static readonly T__51 = 52;
    public static readonly T__52 = 53;
    public static readonly T__53 = 54;
    public static readonly INT = 55;
    public static readonly FLOAT = 56;
    public static readonly STRING = 57;
    public static readonly WS = 58;
    public static readonly RULE_expr = 0;
    public static readonly RULE_telegram = 1;
    public static readonly RULE_telegramContent = 2;
    public static readonly RULE_textContent = 3;
    public static readonly RULE_broker = 4;
    public static readonly RULE_symbol = 5;
    public static readonly RULE_timeframe = 6;
    public static readonly RULE_hour = 7;
    public static readonly RULE_minute = 8;
    public static readonly RULE_open = 9;
    public static readonly RULE_high = 10;
    public static readonly RULE_low = 11;
    public static readonly RULE_close = 12;
    public static readonly RULE_volume = 13;
    public static readonly RULE_volume24h_in_usd = 14;
    public static readonly RULE_change = 15;
    public static readonly RULE_changeP = 16;
    public static readonly RULE_ampl = 17;
    public static readonly RULE_amplP = 18;
    public static readonly RULE_upper_shadow = 19;
    public static readonly RULE_upper_shadowP = 20;
    public static readonly RULE_lower_shadow = 21;
    public static readonly RULE_lower_shadowP = 22;
    public static readonly RULE_rsi = 23;
    public static readonly RULE_rsi_slope = 24;
    public static readonly RULE_ma = 25;
    public static readonly RULE_ema = 26;
    public static readonly RULE_macd_value = 27;
    public static readonly RULE_macd_signal = 28;
    public static readonly RULE_macd_histogram = 29;
    public static readonly RULE_bb_upper = 30;
    public static readonly RULE_bb_middle = 31;
    public static readonly RULE_bb_lower = 32;
    public static readonly RULE_rsi_phan_ki = 33;
    public static readonly RULE_macd_n_dinh = 34;
    public static readonly RULE_macd_slope = 35;
    public static readonly RULE_bullish_engulfing = 36;
    public static readonly RULE_bearish_engulfing = 37;
    public static readonly RULE_bullish_hammer = 38;
    public static readonly RULE_bearish_hammer = 39;
    public static readonly RULE_bullish = 40;
    public static readonly RULE_bearish = 41;
    public static readonly RULE_marsi = 42;
    public static readonly RULE_comparisonOp = 43;

    public static readonly literalNames = [
        null, "'*'", "'/'", "'+'", "'-'", "'('", "')'", "'telegram:'", "'{'", 
        "'}'", "'broker'", "'symbol'", "'timeframe'", "'hour'", "'minute'", 
        "'open'", "'high'", "'low'", "'close'", "'volume'", "'volume24h_in_usd'", 
        "'change'", "'change%'", "'ampl'", "'ampl%'", "'upper_shadow'", 
        "'upper_shadow%'", "'lower_shadow'", "'lower_shadow%'", "'rsi'", 
        "','", "'rsi_slope'", "'ma'", "'ema'", "'macd_value'", "'macd_signal'", 
        "'macd_histogram'", "'bb_upper'", "'bb_middle'", "'bb_lower'", "'rsi_phan_ki'", 
        "'macd_n_dinh'", "'macd_slope'", "'bullish_engulfing'", "'bearish_engulfing'", 
        "'bullish_hammer'", "'bearish_hammer'", "'bullish'", "'bearish'", 
        "'>'", "'>='", "'<'", "'<='", "'=='", "'='"
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
        "expr", "telegram", "telegramContent", "textContent", "broker", 
        "symbol", "timeframe", "hour", "minute", "open", "high", "low", 
        "close", "volume", "volume24h_in_usd", "change", "changeP", "ampl", 
        "amplP", "upper_shadow", "upper_shadowP", "lower_shadow", "lower_shadowP", 
        "rsi", "rsi_slope", "ma", "ema", "macd_value", "macd_signal", "macd_histogram", 
        "bb_upper", "bb_middle", "bb_lower", "rsi_phan_ki", "macd_n_dinh", 
        "macd_slope", "bullish_engulfing", "bearish_engulfing", "bullish_hammer", 
        "bearish_hammer", "bullish", "bearish", "marsi", "comparisonOp",
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
            this.state = 136;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 0, this.context) ) {
            case 1:
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
            case 2:
                {
                localContext = new IntContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 93;
                this.match(ExprParser.INT);
                }
                break;
            case 3:
                {
                localContext = new FloatContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 94;
                this.match(ExprParser.FLOAT);
                }
                break;
            case 4:
                {
                localContext = new StringContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 95;
                this.match(ExprParser.STRING);
                }
                break;
            case 5:
                {
                localContext = new SendTelegramContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 96;
                this.telegram();
                }
                break;
            case 6:
                {
                localContext = new IBrokerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 97;
                this.broker();
                }
                break;
            case 7:
                {
                localContext = new ISymbolContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 98;
                this.symbol_();
                }
                break;
            case 8:
                {
                localContext = new ITimeframeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 99;
                this.timeframe();
                }
                break;
            case 9:
                {
                localContext = new IHourContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 100;
                this.hour();
                }
                break;
            case 10:
                {
                localContext = new IMinuteContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 101;
                this.minute();
                }
                break;
            case 11:
                {
                localContext = new IOpenContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 102;
                this.open();
                }
                break;
            case 12:
                {
                localContext = new IHighContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 103;
                this.high();
                }
                break;
            case 13:
                {
                localContext = new ILowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 104;
                this.low();
                }
                break;
            case 14:
                {
                localContext = new ICloseContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 105;
                this.close();
                }
                break;
            case 15:
                {
                localContext = new IVolumeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 106;
                this.volume();
                }
                break;
            case 16:
                {
                localContext = new IVolume24hInUSDContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 107;
                this.volume24h_in_usd();
                }
                break;
            case 17:
                {
                localContext = new IChangeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 108;
                this.change();
                }
                break;
            case 18:
                {
                localContext = new IChangePContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 109;
                this.changeP();
                }
                break;
            case 19:
                {
                localContext = new IAmplContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 110;
                this.ampl();
                }
                break;
            case 20:
                {
                localContext = new IAmplPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 111;
                this.amplP();
                }
                break;
            case 21:
                {
                localContext = new IUpperShadowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 112;
                this.upper_shadow();
                }
                break;
            case 22:
                {
                localContext = new IUpperShadowPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 113;
                this.upper_shadowP();
                }
                break;
            case 23:
                {
                localContext = new ILowerShadowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 114;
                this.lower_shadow();
                }
                break;
            case 24:
                {
                localContext = new ILowerShadowPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 115;
                this.lower_shadowP();
                }
                break;
            case 25:
                {
                localContext = new IRSIContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 116;
                this.rsi();
                }
                break;
            case 26:
                {
                localContext = new IRSISlopeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 117;
                this.rsi_slope();
                }
                break;
            case 27:
                {
                localContext = new IMAContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 118;
                this.ma();
                }
                break;
            case 28:
                {
                localContext = new IEMAContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 119;
                this.ema();
                }
                break;
            case 29:
                {
                localContext = new IMACD_valueContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 120;
                this.macd_value();
                }
                break;
            case 30:
                {
                localContext = new IMACD_signalContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 121;
                this.macd_signal();
                }
                break;
            case 31:
                {
                localContext = new IMACD_histogramContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 122;
                this.macd_histogram();
                }
                break;
            case 32:
                {
                localContext = new IBB_upContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 123;
                this.bb_upper();
                }
                break;
            case 33:
                {
                localContext = new IBB_midContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 124;
                this.bb_middle();
                }
                break;
            case 34:
                {
                localContext = new IBB_lowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 125;
                this.bb_lower();
                }
                break;
            case 35:
                {
                localContext = new IRSI_phan_kiContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 126;
                this.rsi_phan_ki();
                }
                break;
            case 36:
                {
                localContext = new IMACD_n_dinhContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 127;
                this.macd_n_dinh();
                }
                break;
            case 37:
                {
                localContext = new IMACD_slopeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 128;
                this.macd_slope();
                }
                break;
            case 38:
                {
                localContext = new IBullish_engulfingContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 129;
                this.bullish_engulfing();
                }
                break;
            case 39:
                {
                localContext = new IBearish_engulfingContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 130;
                this.bearish_engulfing();
                }
                break;
            case 40:
                {
                localContext = new IBullish_hammerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 131;
                this.bullish_hammer();
                }
                break;
            case 41:
                {
                localContext = new IBearish_hammerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 132;
                this.bearish_hammer();
                }
                break;
            case 42:
                {
                localContext = new IBullishContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 133;
                this.bullish();
                }
                break;
            case 43:
                {
                localContext = new IBearishContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 134;
                this.bearish();
                }
                break;
            case 44:
                {
                localContext = new IMARSIContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 135;
                this.marsi();
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 150;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 148;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
                    case 1:
                        {
                        localContext = new MulDivContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 138;
                        if (!(this.precpred(this.context, 47))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 47)");
                        }
                        this.state = 139;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 1 || _la === 2)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 140;
                        this.expr(48);
                        }
                        break;
                    case 2:
                        {
                        localContext = new AddSubContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 141;
                        if (!(this.precpred(this.context, 46))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 46)");
                        }
                        this.state = 142;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 3 || _la === 4)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 143;
                        this.expr(47);
                        }
                        break;
                    case 3:
                        {
                        localContext = new ComparisonContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 144;
                        if (!(this.precpred(this.context, 45))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 45)");
                        }
                        this.state = 145;
                        this.comparisonOp();
                        this.state = 146;
                        this.expr(46);
                        }
                        break;
                    }
                    }
                }
                this.state = 152;
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
    public telegram(): TelegramContext {
        let localContext = new TelegramContext(this.context, this.state);
        this.enterRule(localContext, 2, ExprParser.RULE_telegram);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 153;
            this.match(ExprParser.T__6);
            this.state = 157;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 3, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 154;
                    this.telegramContent();
                    }
                    }
                }
                this.state = 159;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 3, this.context);
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
    public telegramContent(): TelegramContentContext {
        let localContext = new TelegramContentContext(this.context, this.state);
        this.enterRule(localContext, 4, ExprParser.RULE_telegramContent);
        try {
            this.state = 165;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case ExprParser.T__7:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 160;
                this.match(ExprParser.T__7);
                this.state = 161;
                this.expr(0);
                this.state = 162;
                this.match(ExprParser.T__8);
                }
                break;
            case ExprParser.T__0:
            case ExprParser.T__1:
            case ExprParser.T__2:
            case ExprParser.T__3:
            case ExprParser.T__4:
            case ExprParser.T__5:
            case ExprParser.T__6:
            case ExprParser.T__9:
            case ExprParser.T__10:
            case ExprParser.T__11:
            case ExprParser.T__12:
            case ExprParser.T__13:
            case ExprParser.T__14:
            case ExprParser.T__15:
            case ExprParser.T__16:
            case ExprParser.T__17:
            case ExprParser.T__18:
            case ExprParser.T__19:
            case ExprParser.T__20:
            case ExprParser.T__21:
            case ExprParser.T__22:
            case ExprParser.T__23:
            case ExprParser.T__24:
            case ExprParser.T__25:
            case ExprParser.T__26:
            case ExprParser.T__27:
            case ExprParser.T__28:
            case ExprParser.T__29:
            case ExprParser.T__30:
            case ExprParser.T__31:
            case ExprParser.T__32:
            case ExprParser.T__33:
            case ExprParser.T__34:
            case ExprParser.T__35:
            case ExprParser.T__36:
            case ExprParser.T__37:
            case ExprParser.T__38:
            case ExprParser.T__39:
            case ExprParser.T__40:
            case ExprParser.T__41:
            case ExprParser.T__42:
            case ExprParser.T__43:
            case ExprParser.T__44:
            case ExprParser.T__45:
            case ExprParser.T__46:
            case ExprParser.T__47:
            case ExprParser.T__48:
            case ExprParser.T__49:
            case ExprParser.T__50:
            case ExprParser.T__51:
            case ExprParser.T__52:
            case ExprParser.T__53:
            case ExprParser.INT:
            case ExprParser.FLOAT:
            case ExprParser.STRING:
            case ExprParser.WS:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 164;
                this.textContent();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
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
    public textContent(): TextContentContext {
        let localContext = new TextContentContext(this.context, this.state);
        this.enterRule(localContext, 6, ExprParser.RULE_textContent);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 168;
            this.errorHandler.sync(this);
            alternative = 1;
            do {
                switch (alternative) {
                case 1:
                    {
                    {
                    this.state = 167;
                    _la = this.tokenStream.LA(1);
                    if(_la<=0 || _la === 8 || _la === 9) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                this.state = 170;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 5, this.context);
            } while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER);
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
    public broker(): BrokerContext {
        let localContext = new BrokerContext(this.context, this.state);
        this.enterRule(localContext, 8, ExprParser.RULE_broker);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 172;
            this.match(ExprParser.T__9);
            this.state = 173;
            this.match(ExprParser.T__4);
            this.state = 174;
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
        this.enterRule(localContext, 10, ExprParser.RULE_symbol);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 176;
            this.match(ExprParser.T__10);
            this.state = 177;
            this.match(ExprParser.T__4);
            this.state = 178;
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
        this.enterRule(localContext, 12, ExprParser.RULE_timeframe);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 180;
            this.match(ExprParser.T__11);
            this.state = 181;
            this.match(ExprParser.T__4);
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
    public hour(): HourContext {
        let localContext = new HourContext(this.context, this.state);
        this.enterRule(localContext, 14, ExprParser.RULE_hour);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 184;
            this.match(ExprParser.T__12);
            this.state = 185;
            this.match(ExprParser.T__4);
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
    public minute(): MinuteContext {
        let localContext = new MinuteContext(this.context, this.state);
        this.enterRule(localContext, 16, ExprParser.RULE_minute);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 188;
            this.match(ExprParser.T__13);
            this.state = 189;
            this.match(ExprParser.T__4);
            this.state = 190;
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
        this.enterRule(localContext, 18, ExprParser.RULE_open);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 192;
            this.match(ExprParser.T__14);
            this.state = 193;
            this.match(ExprParser.T__4);
            this.state = 195;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 194;
                this.match(ExprParser.INT);
                }
            }

            this.state = 197;
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
        this.enterRule(localContext, 20, ExprParser.RULE_high);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 199;
            this.match(ExprParser.T__15);
            this.state = 200;
            this.match(ExprParser.T__4);
            this.state = 202;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 201;
                this.match(ExprParser.INT);
                }
            }

            this.state = 204;
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
        this.enterRule(localContext, 22, ExprParser.RULE_low);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 206;
            this.match(ExprParser.T__16);
            this.state = 207;
            this.match(ExprParser.T__4);
            this.state = 209;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 208;
                this.match(ExprParser.INT);
                }
            }

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
    public close(): CloseContext {
        let localContext = new CloseContext(this.context, this.state);
        this.enterRule(localContext, 24, ExprParser.RULE_close);
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
    public volume(): VolumeContext {
        let localContext = new VolumeContext(this.context, this.state);
        this.enterRule(localContext, 26, ExprParser.RULE_volume);
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
    public volume24h_in_usd(): Volume24h_in_usdContext {
        let localContext = new Volume24h_in_usdContext(this.context, this.state);
        this.enterRule(localContext, 28, ExprParser.RULE_volume24h_in_usd);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 227;
            this.match(ExprParser.T__19);
            this.state = 228;
            this.match(ExprParser.T__4);
            this.state = 229;
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
        this.enterRule(localContext, 30, ExprParser.RULE_change);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 231;
            this.match(ExprParser.T__20);
            this.state = 232;
            this.match(ExprParser.T__4);
            this.state = 234;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 233;
                this.match(ExprParser.INT);
                }
            }

            this.state = 236;
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
        this.enterRule(localContext, 32, ExprParser.RULE_changeP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 238;
            this.match(ExprParser.T__21);
            this.state = 239;
            this.match(ExprParser.T__4);
            this.state = 241;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 240;
                this.match(ExprParser.INT);
                }
            }

            this.state = 243;
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
        this.enterRule(localContext, 34, ExprParser.RULE_ampl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 245;
            this.match(ExprParser.T__22);
            this.state = 246;
            this.match(ExprParser.T__4);
            this.state = 248;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 247;
                this.match(ExprParser.INT);
                }
            }

            this.state = 250;
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
        this.enterRule(localContext, 36, ExprParser.RULE_amplP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 252;
            this.match(ExprParser.T__23);
            this.state = 253;
            this.match(ExprParser.T__4);
            this.state = 255;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 254;
                this.match(ExprParser.INT);
                }
            }

            this.state = 257;
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
        this.enterRule(localContext, 38, ExprParser.RULE_upper_shadow);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 259;
            this.match(ExprParser.T__24);
            this.state = 260;
            this.match(ExprParser.T__4);
            this.state = 262;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 261;
                this.match(ExprParser.INT);
                }
            }

            this.state = 264;
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
        this.enterRule(localContext, 40, ExprParser.RULE_upper_shadowP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 266;
            this.match(ExprParser.T__25);
            this.state = 267;
            this.match(ExprParser.T__4);
            this.state = 269;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 268;
                this.match(ExprParser.INT);
                }
            }

            this.state = 271;
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
        this.enterRule(localContext, 42, ExprParser.RULE_lower_shadow);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 273;
            this.match(ExprParser.T__26);
            this.state = 274;
            this.match(ExprParser.T__4);
            this.state = 276;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 275;
                this.match(ExprParser.INT);
                }
            }

            this.state = 278;
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
        this.enterRule(localContext, 44, ExprParser.RULE_lower_shadowP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 280;
            this.match(ExprParser.T__27);
            this.state = 281;
            this.match(ExprParser.T__4);
            this.state = 283;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
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
    public rsi(): RsiContext {
        let localContext = new RsiContext(this.context, this.state);
        this.enterRule(localContext, 46, ExprParser.RULE_rsi);
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
            if (_la === 30) {
                {
                this.state = 290;
                this.match(ExprParser.T__29);
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
    public rsi_slope(): Rsi_slopeContext {
        let localContext = new Rsi_slopeContext(this.context, this.state);
        this.enterRule(localContext, 48, ExprParser.RULE_rsi_slope);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 296;
            this.match(ExprParser.T__30);
            this.state = 297;
            this.match(ExprParser.T__4);
            this.state = 298;
            this.match(ExprParser.INT);
            this.state = 301;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 299;
                this.match(ExprParser.T__29);
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
    public ma(): MaContext {
        let localContext = new MaContext(this.context, this.state);
        this.enterRule(localContext, 50, ExprParser.RULE_ma);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 305;
            this.match(ExprParser.T__31);
            this.state = 306;
            this.match(ExprParser.T__4);
            this.state = 307;
            this.match(ExprParser.INT);
            this.state = 310;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 308;
                this.match(ExprParser.T__29);
                this.state = 309;
                this.match(ExprParser.INT);
                }
            }

            this.state = 312;
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
        this.enterRule(localContext, 52, ExprParser.RULE_ema);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 314;
            this.match(ExprParser.T__32);
            this.state = 315;
            this.match(ExprParser.T__4);
            this.state = 316;
            this.match(ExprParser.INT);
            this.state = 319;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 317;
                this.match(ExprParser.T__29);
                this.state = 318;
                this.match(ExprParser.INT);
                }
            }

            this.state = 321;
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
        this.enterRule(localContext, 54, ExprParser.RULE_macd_value);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 323;
            this.match(ExprParser.T__33);
            this.state = 324;
            this.match(ExprParser.T__4);
            this.state = 325;
            this.match(ExprParser.INT);
            this.state = 326;
            this.match(ExprParser.T__29);
            this.state = 327;
            this.match(ExprParser.INT);
            this.state = 328;
            this.match(ExprParser.T__29);
            this.state = 329;
            this.match(ExprParser.INT);
            this.state = 332;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 330;
                this.match(ExprParser.T__29);
                this.state = 331;
                this.match(ExprParser.INT);
                }
            }

            this.state = 334;
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
        this.enterRule(localContext, 56, ExprParser.RULE_macd_signal);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 336;
            this.match(ExprParser.T__34);
            this.state = 337;
            this.match(ExprParser.T__4);
            this.state = 338;
            this.match(ExprParser.INT);
            this.state = 339;
            this.match(ExprParser.T__29);
            this.state = 340;
            this.match(ExprParser.INT);
            this.state = 341;
            this.match(ExprParser.T__29);
            this.state = 342;
            this.match(ExprParser.INT);
            this.state = 345;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 343;
                this.match(ExprParser.T__29);
                this.state = 344;
                this.match(ExprParser.INT);
                }
            }

            this.state = 347;
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
        this.enterRule(localContext, 58, ExprParser.RULE_macd_histogram);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 349;
            this.match(ExprParser.T__35);
            this.state = 350;
            this.match(ExprParser.T__4);
            this.state = 351;
            this.match(ExprParser.INT);
            this.state = 352;
            this.match(ExprParser.T__29);
            this.state = 353;
            this.match(ExprParser.INT);
            this.state = 354;
            this.match(ExprParser.T__29);
            this.state = 355;
            this.match(ExprParser.INT);
            this.state = 358;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 356;
                this.match(ExprParser.T__29);
                this.state = 357;
                this.match(ExprParser.INT);
                }
            }

            this.state = 360;
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
        this.enterRule(localContext, 60, ExprParser.RULE_bb_upper);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 362;
            this.match(ExprParser.T__36);
            this.state = 363;
            this.match(ExprParser.T__4);
            this.state = 364;
            this.match(ExprParser.INT);
            this.state = 365;
            this.match(ExprParser.T__29);
            this.state = 366;
            this.match(ExprParser.FLOAT);
            this.state = 369;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 367;
                this.match(ExprParser.T__29);
                this.state = 368;
                this.match(ExprParser.INT);
                }
            }

            this.state = 371;
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
        this.enterRule(localContext, 62, ExprParser.RULE_bb_middle);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 373;
            this.match(ExprParser.T__37);
            this.state = 374;
            this.match(ExprParser.T__4);
            this.state = 375;
            this.match(ExprParser.INT);
            this.state = 376;
            this.match(ExprParser.T__29);
            this.state = 377;
            this.match(ExprParser.FLOAT);
            this.state = 380;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 378;
                this.match(ExprParser.T__29);
                this.state = 379;
                this.match(ExprParser.INT);
                }
            }

            this.state = 382;
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
        this.enterRule(localContext, 64, ExprParser.RULE_bb_lower);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 384;
            this.match(ExprParser.T__38);
            this.state = 385;
            this.match(ExprParser.T__4);
            this.state = 386;
            this.match(ExprParser.INT);
            this.state = 387;
            this.match(ExprParser.T__29);
            this.state = 388;
            this.match(ExprParser.FLOAT);
            this.state = 391;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 389;
                this.match(ExprParser.T__29);
                this.state = 390;
                this.match(ExprParser.INT);
                }
            }

            this.state = 393;
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
        this.enterRule(localContext, 66, ExprParser.RULE_rsi_phan_ki);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 395;
            this.match(ExprParser.T__39);
            this.state = 396;
            this.match(ExprParser.T__4);
            this.state = 397;
            this.match(ExprParser.INT);
            this.state = 398;
            this.match(ExprParser.T__29);
            this.state = 399;
            this.match(ExprParser.FLOAT);
            this.state = 400;
            this.match(ExprParser.T__29);
            this.state = 401;
            this.match(ExprParser.INT);
            this.state = 402;
            this.match(ExprParser.T__29);
            this.state = 403;
            this.match(ExprParser.INT);
            this.state = 404;
            this.match(ExprParser.T__29);
            this.state = 405;
            this.match(ExprParser.FLOAT);
            this.state = 406;
            this.match(ExprParser.T__29);
            this.state = 407;
            this.match(ExprParser.FLOAT);
            this.state = 410;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 408;
                this.match(ExprParser.T__29);
                this.state = 409;
                this.match(ExprParser.INT);
                }
            }

            this.state = 412;
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
        this.enterRule(localContext, 68, ExprParser.RULE_macd_n_dinh);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 414;
            this.match(ExprParser.T__40);
            this.state = 415;
            this.match(ExprParser.T__4);
            this.state = 416;
            this.match(ExprParser.INT);
            this.state = 417;
            this.match(ExprParser.T__29);
            this.state = 418;
            this.match(ExprParser.INT);
            this.state = 419;
            this.match(ExprParser.T__29);
            this.state = 420;
            this.match(ExprParser.INT);
            this.state = 421;
            this.match(ExprParser.T__29);
            this.state = 422;
            this.match(ExprParser.INT);
            this.state = 423;
            this.match(ExprParser.T__29);
            this.state = 424;
            this.match(ExprParser.INT);
            this.state = 425;
            this.match(ExprParser.T__29);
            this.state = 426;
            this.match(ExprParser.INT);
            this.state = 427;
            this.match(ExprParser.T__29);
            this.state = 428;
            this.match(ExprParser.FLOAT);
            this.state = 429;
            this.match(ExprParser.T__29);
            this.state = 430;
            this.match(ExprParser.INT);
            this.state = 435;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 30) {
                {
                {
                this.state = 431;
                this.match(ExprParser.T__29);
                this.state = 432;
                this.match(ExprParser.FLOAT);
                }
                }
                this.state = 437;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 438;
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
        this.enterRule(localContext, 70, ExprParser.RULE_macd_slope);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 440;
            this.match(ExprParser.T__41);
            this.state = 441;
            this.match(ExprParser.T__4);
            this.state = 442;
            this.match(ExprParser.INT);
            this.state = 443;
            this.match(ExprParser.T__29);
            this.state = 444;
            this.match(ExprParser.INT);
            this.state = 445;
            this.match(ExprParser.T__29);
            this.state = 446;
            this.match(ExprParser.INT);
            this.state = 449;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 447;
                this.match(ExprParser.T__29);
                this.state = 448;
                this.match(ExprParser.INT);
                }
            }

            this.state = 451;
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
        this.enterRule(localContext, 72, ExprParser.RULE_bullish_engulfing);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 453;
            this.match(ExprParser.T__42);
            this.state = 454;
            this.match(ExprParser.T__4);
            this.state = 456;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 455;
                this.match(ExprParser.INT);
                }
            }

            this.state = 458;
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
        this.enterRule(localContext, 74, ExprParser.RULE_bearish_engulfing);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 460;
            this.match(ExprParser.T__43);
            this.state = 461;
            this.match(ExprParser.T__4);
            this.state = 463;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 462;
                this.match(ExprParser.INT);
                }
            }

            this.state = 465;
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
        this.enterRule(localContext, 76, ExprParser.RULE_bullish_hammer);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 467;
            this.match(ExprParser.T__44);
            this.state = 468;
            this.match(ExprParser.T__4);
            this.state = 470;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 469;
                this.match(ExprParser.INT);
                }
            }

            this.state = 472;
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
        this.enterRule(localContext, 78, ExprParser.RULE_bearish_hammer);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 474;
            this.match(ExprParser.T__45);
            this.state = 475;
            this.match(ExprParser.T__4);
            this.state = 477;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
                this.state = 476;
                this.match(ExprParser.INT);
                }
            }

            this.state = 479;
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
        this.enterRule(localContext, 80, ExprParser.RULE_bullish);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 481;
            this.match(ExprParser.T__46);
            this.state = 482;
            this.match(ExprParser.T__4);
            this.state = 484;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 55) {
                {
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
    public bearish(): BearishContext {
        let localContext = new BearishContext(this.context, this.state);
        this.enterRule(localContext, 82, ExprParser.RULE_bearish);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 488;
            this.match(ExprParser.T__47);
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
    public marsi(): MarsiContext {
        let localContext = new MarsiContext(this.context, this.state);
        this.enterRule(localContext, 84, ExprParser.RULE_marsi);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 495;
            this.match(ExprParser.T__28);
            this.state = 496;
            this.match(ExprParser.T__4);
            this.state = 497;
            this.match(ExprParser.INT);
            this.state = 498;
            this.match(ExprParser.T__29);
            this.state = 499;
            this.match(ExprParser.INT);
            this.state = 502;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 30) {
                {
                this.state = 500;
                this.match(ExprParser.T__29);
                this.state = 501;
                this.match(ExprParser.INT);
                }
            }

            this.state = 504;
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
        this.enterRule(localContext, 86, ExprParser.RULE_comparisonOp);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 506;
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
            return this.precpred(this.context, 47);
        case 1:
            return this.precpred(this.context, 46);
        case 2:
            return this.precpred(this.context, 45);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,58,509,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,
        7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,39,
        2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,137,8,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,149,8,0,10,0,12,0,152,9,0,1,1,1,
        1,5,1,156,8,1,10,1,12,1,159,9,1,1,2,1,2,1,2,1,2,1,2,3,2,166,8,2,
        1,3,4,3,169,8,3,11,3,12,3,170,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,
        6,1,6,1,6,1,6,1,7,1,7,1,7,1,7,1,8,1,8,1,8,1,8,1,9,1,9,1,9,3,9,196,
        8,9,1,9,1,9,1,10,1,10,1,10,3,10,203,8,10,1,10,1,10,1,11,1,11,1,11,
        3,11,210,8,11,1,11,1,11,1,12,1,12,1,12,3,12,217,8,12,1,12,1,12,1,
        13,1,13,1,13,3,13,224,8,13,1,13,1,13,1,14,1,14,1,14,1,14,1,15,1,
        15,1,15,3,15,235,8,15,1,15,1,15,1,16,1,16,1,16,3,16,242,8,16,1,16,
        1,16,1,17,1,17,1,17,3,17,249,8,17,1,17,1,17,1,18,1,18,1,18,3,18,
        256,8,18,1,18,1,18,1,19,1,19,1,19,3,19,263,8,19,1,19,1,19,1,20,1,
        20,1,20,3,20,270,8,20,1,20,1,20,1,21,1,21,1,21,3,21,277,8,21,1,21,
        1,21,1,22,1,22,1,22,3,22,284,8,22,1,22,1,22,1,23,1,23,1,23,1,23,
        1,23,3,23,293,8,23,1,23,1,23,1,24,1,24,1,24,1,24,1,24,3,24,302,8,
        24,1,24,1,24,1,25,1,25,1,25,1,25,1,25,3,25,311,8,25,1,25,1,25,1,
        26,1,26,1,26,1,26,1,26,3,26,320,8,26,1,26,1,26,1,27,1,27,1,27,1,
        27,1,27,1,27,1,27,1,27,1,27,3,27,333,8,27,1,27,1,27,1,28,1,28,1,
        28,1,28,1,28,1,28,1,28,1,28,1,28,3,28,346,8,28,1,28,1,28,1,29,1,
        29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,3,29,359,8,29,1,29,1,29,1,
        30,1,30,1,30,1,30,1,30,1,30,1,30,3,30,370,8,30,1,30,1,30,1,31,1,
        31,1,31,1,31,1,31,1,31,1,31,3,31,381,8,31,1,31,1,31,1,32,1,32,1,
        32,1,32,1,32,1,32,1,32,3,32,392,8,32,1,32,1,32,1,33,1,33,1,33,1,
        33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,1,33,3,33,411,
        8,33,1,33,1,33,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
        1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,1,34,5,34,434,8,34,10,34,
        12,34,437,9,34,1,34,1,34,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,
        1,35,3,35,450,8,35,1,35,1,35,1,36,1,36,1,36,3,36,457,8,36,1,36,1,
        36,1,37,1,37,1,37,3,37,464,8,37,1,37,1,37,1,38,1,38,1,38,3,38,471,
        8,38,1,38,1,38,1,39,1,39,1,39,3,39,478,8,39,1,39,1,39,1,40,1,40,
        1,40,3,40,485,8,40,1,40,1,40,1,41,1,41,1,41,3,41,492,8,41,1,41,1,
        41,1,42,1,42,1,42,1,42,1,42,1,42,1,42,3,42,503,8,42,1,42,1,42,1,
        43,1,43,1,43,0,1,0,44,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,
        32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,
        76,78,80,82,84,86,0,4,1,0,1,2,1,0,3,4,1,0,8,9,1,0,49,54,546,0,136,
        1,0,0,0,2,153,1,0,0,0,4,165,1,0,0,0,6,168,1,0,0,0,8,172,1,0,0,0,
        10,176,1,0,0,0,12,180,1,0,0,0,14,184,1,0,0,0,16,188,1,0,0,0,18,192,
        1,0,0,0,20,199,1,0,0,0,22,206,1,0,0,0,24,213,1,0,0,0,26,220,1,0,
        0,0,28,227,1,0,0,0,30,231,1,0,0,0,32,238,1,0,0,0,34,245,1,0,0,0,
        36,252,1,0,0,0,38,259,1,0,0,0,40,266,1,0,0,0,42,273,1,0,0,0,44,280,
        1,0,0,0,46,287,1,0,0,0,48,296,1,0,0,0,50,305,1,0,0,0,52,314,1,0,
        0,0,54,323,1,0,0,0,56,336,1,0,0,0,58,349,1,0,0,0,60,362,1,0,0,0,
        62,373,1,0,0,0,64,384,1,0,0,0,66,395,1,0,0,0,68,414,1,0,0,0,70,440,
        1,0,0,0,72,453,1,0,0,0,74,460,1,0,0,0,76,467,1,0,0,0,78,474,1,0,
        0,0,80,481,1,0,0,0,82,488,1,0,0,0,84,495,1,0,0,0,86,506,1,0,0,0,
        88,89,6,0,-1,0,89,90,5,5,0,0,90,91,3,0,0,0,91,92,5,6,0,0,92,137,
        1,0,0,0,93,137,5,55,0,0,94,137,5,56,0,0,95,137,5,57,0,0,96,137,3,
        2,1,0,97,137,3,8,4,0,98,137,3,10,5,0,99,137,3,12,6,0,100,137,3,14,
        7,0,101,137,3,16,8,0,102,137,3,18,9,0,103,137,3,20,10,0,104,137,
        3,22,11,0,105,137,3,24,12,0,106,137,3,26,13,0,107,137,3,28,14,0,
        108,137,3,30,15,0,109,137,3,32,16,0,110,137,3,34,17,0,111,137,3,
        36,18,0,112,137,3,38,19,0,113,137,3,40,20,0,114,137,3,42,21,0,115,
        137,3,44,22,0,116,137,3,46,23,0,117,137,3,48,24,0,118,137,3,50,25,
        0,119,137,3,52,26,0,120,137,3,54,27,0,121,137,3,56,28,0,122,137,
        3,58,29,0,123,137,3,60,30,0,124,137,3,62,31,0,125,137,3,64,32,0,
        126,137,3,66,33,0,127,137,3,68,34,0,128,137,3,70,35,0,129,137,3,
        72,36,0,130,137,3,74,37,0,131,137,3,76,38,0,132,137,3,78,39,0,133,
        137,3,80,40,0,134,137,3,82,41,0,135,137,3,84,42,0,136,88,1,0,0,0,
        136,93,1,0,0,0,136,94,1,0,0,0,136,95,1,0,0,0,136,96,1,0,0,0,136,
        97,1,0,0,0,136,98,1,0,0,0,136,99,1,0,0,0,136,100,1,0,0,0,136,101,
        1,0,0,0,136,102,1,0,0,0,136,103,1,0,0,0,136,104,1,0,0,0,136,105,
        1,0,0,0,136,106,1,0,0,0,136,107,1,0,0,0,136,108,1,0,0,0,136,109,
        1,0,0,0,136,110,1,0,0,0,136,111,1,0,0,0,136,112,1,0,0,0,136,113,
        1,0,0,0,136,114,1,0,0,0,136,115,1,0,0,0,136,116,1,0,0,0,136,117,
        1,0,0,0,136,118,1,0,0,0,136,119,1,0,0,0,136,120,1,0,0,0,136,121,
        1,0,0,0,136,122,1,0,0,0,136,123,1,0,0,0,136,124,1,0,0,0,136,125,
        1,0,0,0,136,126,1,0,0,0,136,127,1,0,0,0,136,128,1,0,0,0,136,129,
        1,0,0,0,136,130,1,0,0,0,136,131,1,0,0,0,136,132,1,0,0,0,136,133,
        1,0,0,0,136,134,1,0,0,0,136,135,1,0,0,0,137,150,1,0,0,0,138,139,
        10,47,0,0,139,140,7,0,0,0,140,149,3,0,0,48,141,142,10,46,0,0,142,
        143,7,1,0,0,143,149,3,0,0,47,144,145,10,45,0,0,145,146,3,86,43,0,
        146,147,3,0,0,46,147,149,1,0,0,0,148,138,1,0,0,0,148,141,1,0,0,0,
        148,144,1,0,0,0,149,152,1,0,0,0,150,148,1,0,0,0,150,151,1,0,0,0,
        151,1,1,0,0,0,152,150,1,0,0,0,153,157,5,7,0,0,154,156,3,4,2,0,155,
        154,1,0,0,0,156,159,1,0,0,0,157,155,1,0,0,0,157,158,1,0,0,0,158,
        3,1,0,0,0,159,157,1,0,0,0,160,161,5,8,0,0,161,162,3,0,0,0,162,163,
        5,9,0,0,163,166,1,0,0,0,164,166,3,6,3,0,165,160,1,0,0,0,165,164,
        1,0,0,0,166,5,1,0,0,0,167,169,8,2,0,0,168,167,1,0,0,0,169,170,1,
        0,0,0,170,168,1,0,0,0,170,171,1,0,0,0,171,7,1,0,0,0,172,173,5,10,
        0,0,173,174,5,5,0,0,174,175,5,6,0,0,175,9,1,0,0,0,176,177,5,11,0,
        0,177,178,5,5,0,0,178,179,5,6,0,0,179,11,1,0,0,0,180,181,5,12,0,
        0,181,182,5,5,0,0,182,183,5,6,0,0,183,13,1,0,0,0,184,185,5,13,0,
        0,185,186,5,5,0,0,186,187,5,6,0,0,187,15,1,0,0,0,188,189,5,14,0,
        0,189,190,5,5,0,0,190,191,5,6,0,0,191,17,1,0,0,0,192,193,5,15,0,
        0,193,195,5,5,0,0,194,196,5,55,0,0,195,194,1,0,0,0,195,196,1,0,0,
        0,196,197,1,0,0,0,197,198,5,6,0,0,198,19,1,0,0,0,199,200,5,16,0,
        0,200,202,5,5,0,0,201,203,5,55,0,0,202,201,1,0,0,0,202,203,1,0,0,
        0,203,204,1,0,0,0,204,205,5,6,0,0,205,21,1,0,0,0,206,207,5,17,0,
        0,207,209,5,5,0,0,208,210,5,55,0,0,209,208,1,0,0,0,209,210,1,0,0,
        0,210,211,1,0,0,0,211,212,5,6,0,0,212,23,1,0,0,0,213,214,5,18,0,
        0,214,216,5,5,0,0,215,217,5,55,0,0,216,215,1,0,0,0,216,217,1,0,0,
        0,217,218,1,0,0,0,218,219,5,6,0,0,219,25,1,0,0,0,220,221,5,19,0,
        0,221,223,5,5,0,0,222,224,5,55,0,0,223,222,1,0,0,0,223,224,1,0,0,
        0,224,225,1,0,0,0,225,226,5,6,0,0,226,27,1,0,0,0,227,228,5,20,0,
        0,228,229,5,5,0,0,229,230,5,6,0,0,230,29,1,0,0,0,231,232,5,21,0,
        0,232,234,5,5,0,0,233,235,5,55,0,0,234,233,1,0,0,0,234,235,1,0,0,
        0,235,236,1,0,0,0,236,237,5,6,0,0,237,31,1,0,0,0,238,239,5,22,0,
        0,239,241,5,5,0,0,240,242,5,55,0,0,241,240,1,0,0,0,241,242,1,0,0,
        0,242,243,1,0,0,0,243,244,5,6,0,0,244,33,1,0,0,0,245,246,5,23,0,
        0,246,248,5,5,0,0,247,249,5,55,0,0,248,247,1,0,0,0,248,249,1,0,0,
        0,249,250,1,0,0,0,250,251,5,6,0,0,251,35,1,0,0,0,252,253,5,24,0,
        0,253,255,5,5,0,0,254,256,5,55,0,0,255,254,1,0,0,0,255,256,1,0,0,
        0,256,257,1,0,0,0,257,258,5,6,0,0,258,37,1,0,0,0,259,260,5,25,0,
        0,260,262,5,5,0,0,261,263,5,55,0,0,262,261,1,0,0,0,262,263,1,0,0,
        0,263,264,1,0,0,0,264,265,5,6,0,0,265,39,1,0,0,0,266,267,5,26,0,
        0,267,269,5,5,0,0,268,270,5,55,0,0,269,268,1,0,0,0,269,270,1,0,0,
        0,270,271,1,0,0,0,271,272,5,6,0,0,272,41,1,0,0,0,273,274,5,27,0,
        0,274,276,5,5,0,0,275,277,5,55,0,0,276,275,1,0,0,0,276,277,1,0,0,
        0,277,278,1,0,0,0,278,279,5,6,0,0,279,43,1,0,0,0,280,281,5,28,0,
        0,281,283,5,5,0,0,282,284,5,55,0,0,283,282,1,0,0,0,283,284,1,0,0,
        0,284,285,1,0,0,0,285,286,5,6,0,0,286,45,1,0,0,0,287,288,5,29,0,
        0,288,289,5,5,0,0,289,292,5,55,0,0,290,291,5,30,0,0,291,293,5,55,
        0,0,292,290,1,0,0,0,292,293,1,0,0,0,293,294,1,0,0,0,294,295,5,6,
        0,0,295,47,1,0,0,0,296,297,5,31,0,0,297,298,5,5,0,0,298,301,5,55,
        0,0,299,300,5,30,0,0,300,302,5,55,0,0,301,299,1,0,0,0,301,302,1,
        0,0,0,302,303,1,0,0,0,303,304,5,6,0,0,304,49,1,0,0,0,305,306,5,32,
        0,0,306,307,5,5,0,0,307,310,5,55,0,0,308,309,5,30,0,0,309,311,5,
        55,0,0,310,308,1,0,0,0,310,311,1,0,0,0,311,312,1,0,0,0,312,313,5,
        6,0,0,313,51,1,0,0,0,314,315,5,33,0,0,315,316,5,5,0,0,316,319,5,
        55,0,0,317,318,5,30,0,0,318,320,5,55,0,0,319,317,1,0,0,0,319,320,
        1,0,0,0,320,321,1,0,0,0,321,322,5,6,0,0,322,53,1,0,0,0,323,324,5,
        34,0,0,324,325,5,5,0,0,325,326,5,55,0,0,326,327,5,30,0,0,327,328,
        5,55,0,0,328,329,5,30,0,0,329,332,5,55,0,0,330,331,5,30,0,0,331,
        333,5,55,0,0,332,330,1,0,0,0,332,333,1,0,0,0,333,334,1,0,0,0,334,
        335,5,6,0,0,335,55,1,0,0,0,336,337,5,35,0,0,337,338,5,5,0,0,338,
        339,5,55,0,0,339,340,5,30,0,0,340,341,5,55,0,0,341,342,5,30,0,0,
        342,345,5,55,0,0,343,344,5,30,0,0,344,346,5,55,0,0,345,343,1,0,0,
        0,345,346,1,0,0,0,346,347,1,0,0,0,347,348,5,6,0,0,348,57,1,0,0,0,
        349,350,5,36,0,0,350,351,5,5,0,0,351,352,5,55,0,0,352,353,5,30,0,
        0,353,354,5,55,0,0,354,355,5,30,0,0,355,358,5,55,0,0,356,357,5,30,
        0,0,357,359,5,55,0,0,358,356,1,0,0,0,358,359,1,0,0,0,359,360,1,0,
        0,0,360,361,5,6,0,0,361,59,1,0,0,0,362,363,5,37,0,0,363,364,5,5,
        0,0,364,365,5,55,0,0,365,366,5,30,0,0,366,369,5,56,0,0,367,368,5,
        30,0,0,368,370,5,55,0,0,369,367,1,0,0,0,369,370,1,0,0,0,370,371,
        1,0,0,0,371,372,5,6,0,0,372,61,1,0,0,0,373,374,5,38,0,0,374,375,
        5,5,0,0,375,376,5,55,0,0,376,377,5,30,0,0,377,380,5,56,0,0,378,379,
        5,30,0,0,379,381,5,55,0,0,380,378,1,0,0,0,380,381,1,0,0,0,381,382,
        1,0,0,0,382,383,5,6,0,0,383,63,1,0,0,0,384,385,5,39,0,0,385,386,
        5,5,0,0,386,387,5,55,0,0,387,388,5,30,0,0,388,391,5,56,0,0,389,390,
        5,30,0,0,390,392,5,55,0,0,391,389,1,0,0,0,391,392,1,0,0,0,392,393,
        1,0,0,0,393,394,5,6,0,0,394,65,1,0,0,0,395,396,5,40,0,0,396,397,
        5,5,0,0,397,398,5,55,0,0,398,399,5,30,0,0,399,400,5,56,0,0,400,401,
        5,30,0,0,401,402,5,55,0,0,402,403,5,30,0,0,403,404,5,55,0,0,404,
        405,5,30,0,0,405,406,5,56,0,0,406,407,5,30,0,0,407,410,5,56,0,0,
        408,409,5,30,0,0,409,411,5,55,0,0,410,408,1,0,0,0,410,411,1,0,0,
        0,411,412,1,0,0,0,412,413,5,6,0,0,413,67,1,0,0,0,414,415,5,41,0,
        0,415,416,5,5,0,0,416,417,5,55,0,0,417,418,5,30,0,0,418,419,5,55,
        0,0,419,420,5,30,0,0,420,421,5,55,0,0,421,422,5,30,0,0,422,423,5,
        55,0,0,423,424,5,30,0,0,424,425,5,55,0,0,425,426,5,30,0,0,426,427,
        5,55,0,0,427,428,5,30,0,0,428,429,5,56,0,0,429,430,5,30,0,0,430,
        435,5,55,0,0,431,432,5,30,0,0,432,434,5,56,0,0,433,431,1,0,0,0,434,
        437,1,0,0,0,435,433,1,0,0,0,435,436,1,0,0,0,436,438,1,0,0,0,437,
        435,1,0,0,0,438,439,5,6,0,0,439,69,1,0,0,0,440,441,5,42,0,0,441,
        442,5,5,0,0,442,443,5,55,0,0,443,444,5,30,0,0,444,445,5,55,0,0,445,
        446,5,30,0,0,446,449,5,55,0,0,447,448,5,30,0,0,448,450,5,55,0,0,
        449,447,1,0,0,0,449,450,1,0,0,0,450,451,1,0,0,0,451,452,5,6,0,0,
        452,71,1,0,0,0,453,454,5,43,0,0,454,456,5,5,0,0,455,457,5,55,0,0,
        456,455,1,0,0,0,456,457,1,0,0,0,457,458,1,0,0,0,458,459,5,6,0,0,
        459,73,1,0,0,0,460,461,5,44,0,0,461,463,5,5,0,0,462,464,5,55,0,0,
        463,462,1,0,0,0,463,464,1,0,0,0,464,465,1,0,0,0,465,466,5,6,0,0,
        466,75,1,0,0,0,467,468,5,45,0,0,468,470,5,5,0,0,469,471,5,55,0,0,
        470,469,1,0,0,0,470,471,1,0,0,0,471,472,1,0,0,0,472,473,5,6,0,0,
        473,77,1,0,0,0,474,475,5,46,0,0,475,477,5,5,0,0,476,478,5,55,0,0,
        477,476,1,0,0,0,477,478,1,0,0,0,478,479,1,0,0,0,479,480,5,6,0,0,
        480,79,1,0,0,0,481,482,5,47,0,0,482,484,5,5,0,0,483,485,5,55,0,0,
        484,483,1,0,0,0,484,485,1,0,0,0,485,486,1,0,0,0,486,487,5,6,0,0,
        487,81,1,0,0,0,488,489,5,48,0,0,489,491,5,5,0,0,490,492,5,55,0,0,
        491,490,1,0,0,0,491,492,1,0,0,0,492,493,1,0,0,0,493,494,5,6,0,0,
        494,83,1,0,0,0,495,496,5,29,0,0,496,497,5,5,0,0,497,498,5,55,0,0,
        498,499,5,30,0,0,499,502,5,55,0,0,500,501,5,30,0,0,501,503,5,55,
        0,0,502,500,1,0,0,0,502,503,1,0,0,0,503,504,1,0,0,0,504,505,5,6,
        0,0,505,85,1,0,0,0,506,507,7,3,0,0,507,87,1,0,0,0,39,136,148,150,
        157,165,170,195,202,209,216,223,234,241,248,255,262,269,276,283,
        292,301,310,319,332,345,358,369,380,391,410,435,449,456,463,470,
        477,484,491,502
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
export class SendTelegramContext extends ExprContext {
    public constructor(ctx: ExprContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public telegram(): TelegramContext {
        return this.getRuleContext(0, TelegramContext)!;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitSendTelegram) {
            return visitor.visitSendTelegram(this);
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


export class TelegramContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public telegramContent(): TelegramContentContext[];
    public telegramContent(i: number): TelegramContentContext | null;
    public telegramContent(i?: number): TelegramContentContext[] | TelegramContentContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TelegramContentContext);
        }

        return this.getRuleContext(i, TelegramContentContext);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_telegram;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitTelegram) {
            return visitor.visitTelegram(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TelegramContentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expr(): ExprContext | null {
        return this.getRuleContext(0, ExprContext);
    }
    public textContent(): TextContentContext | null {
        return this.getRuleContext(0, TextContentContext);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_telegramContent;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitTelegramContent) {
            return visitor.visitTelegramContent(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TextContentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_textContent;
    }
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitTextContent) {
            return visitor.visitTextContent(this);
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
