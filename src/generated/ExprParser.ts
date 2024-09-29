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
    public static readonly INT = 29;
    public static readonly FLOAT = 30;
    public static readonly STRING = 31;
    public static readonly WS = 32;
    public static readonly RULE_expr = 0;
    public static readonly RULE_rsi = 1;
    public static readonly RULE_broker = 2;
    public static readonly RULE_symbol = 3;
    public static readonly RULE_timeframe = 4;
    public static readonly RULE_hour = 5;
    public static readonly RULE_minute = 6;
    public static readonly RULE_open = 7;
    public static readonly RULE_high = 8;
    public static readonly RULE_low = 9;
    public static readonly RULE_close = 10;
    public static readonly RULE_volume = 11;
    public static readonly RULE_volume24h_in_usd = 12;
    public static readonly RULE_change = 13;
    public static readonly RULE_changeP = 14;
    public static readonly RULE_ampl = 15;
    public static readonly RULE_amplP = 16;
    public static readonly RULE_comparisonOp = 17;

    public static readonly literalNames = [
        null, "'*'", "'/'", "'+'", "'-'", "'('", "')'", "'rsi'", "','", 
        "'broker'", "'symbol'", "'timeframe'", "'hour'", "'minute'", "'open'", 
        "'high'", "'low'", "'close'", "'volume'", "'volume24h_in_usd'", 
        "'change'", "'change%'", "'ampl'", "'ampl%'", "'>'", "'>='", "'<'", 
        "'<='", "'='"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, null, null, null, null, 
        null, null, null, null, null, null, null, "INT", "FLOAT", "STRING", 
        "WS"
    ];
    public static readonly ruleNames = [
        "expr", "rsi", "broker", "symbol", "timeframe", "hour", "minute", 
        "open", "high", "low", "close", "volume", "volume24h_in_usd", "change", 
        "changeP", "ampl", "amplP", "comparisonOp",
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
            this.state = 60;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case ExprParser.T__4:
                {
                localContext = new ParensContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 37;
                this.match(ExprParser.T__4);
                this.state = 38;
                this.expr(0);
                this.state = 39;
                this.match(ExprParser.T__5);
                }
                break;
            case ExprParser.INT:
                {
                localContext = new IntContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 41;
                this.match(ExprParser.INT);
                }
                break;
            case ExprParser.FLOAT:
                {
                localContext = new FloatContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 42;
                this.match(ExprParser.FLOAT);
                }
                break;
            case ExprParser.STRING:
                {
                localContext = new StringContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 43;
                this.match(ExprParser.STRING);
                }
                break;
            case ExprParser.T__6:
                {
                localContext = new IRSIContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 44;
                this.rsi();
                }
                break;
            case ExprParser.T__8:
                {
                localContext = new IBrokerContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 45;
                this.broker();
                }
                break;
            case ExprParser.T__9:
                {
                localContext = new ISymbolContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 46;
                this.symbol_();
                }
                break;
            case ExprParser.T__10:
                {
                localContext = new ITimeframeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 47;
                this.timeframe();
                }
                break;
            case ExprParser.T__11:
                {
                localContext = new IHourContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 48;
                this.hour();
                }
                break;
            case ExprParser.T__12:
                {
                localContext = new IMinuteContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 49;
                this.minute();
                }
                break;
            case ExprParser.T__13:
                {
                localContext = new IOpenContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 50;
                this.open();
                }
                break;
            case ExprParser.T__14:
                {
                localContext = new IHighContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 51;
                this.high();
                }
                break;
            case ExprParser.T__15:
                {
                localContext = new ILowContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 52;
                this.low();
                }
                break;
            case ExprParser.T__16:
                {
                localContext = new ICloseContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 53;
                this.close();
                }
                break;
            case ExprParser.T__17:
                {
                localContext = new IVolumeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 54;
                this.volume();
                }
                break;
            case ExprParser.T__18:
                {
                localContext = new IVolume24hInUSDContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 55;
                this.volume24h_in_usd();
                }
                break;
            case ExprParser.T__19:
                {
                localContext = new IChangeContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 56;
                this.change();
                }
                break;
            case ExprParser.T__20:
                {
                localContext = new IChangePContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 57;
                this.changeP();
                }
                break;
            case ExprParser.T__21:
                {
                localContext = new IAmplContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 58;
                this.ampl();
                }
                break;
            case ExprParser.T__22:
                {
                localContext = new IAmplPContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 59;
                this.amplP();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 74;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 72;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
                    case 1:
                        {
                        localContext = new MulDivContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 62;
                        if (!(this.precpred(this.context, 23))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 23)");
                        }
                        this.state = 63;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 1 || _la === 2)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 64;
                        this.expr(24);
                        }
                        break;
                    case 2:
                        {
                        localContext = new AddSubContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 65;
                        if (!(this.precpred(this.context, 22))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 22)");
                        }
                        this.state = 66;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 3 || _la === 4)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 67;
                        this.expr(23);
                        }
                        break;
                    case 3:
                        {
                        localContext = new ComparisonContext(new ExprContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, ExprParser.RULE_expr);
                        this.state = 68;
                        if (!(this.precpred(this.context, 21))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 21)");
                        }
                        this.state = 69;
                        this.comparisonOp();
                        this.state = 70;
                        this.expr(22);
                        }
                        break;
                    }
                    }
                }
                this.state = 76;
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
    public rsi(): RsiContext {
        let localContext = new RsiContext(this.context, this.state);
        this.enterRule(localContext, 2, ExprParser.RULE_rsi);
        let _la: number;
        try {
            localContext = new RSIContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 77;
            this.match(ExprParser.T__6);
            this.state = 78;
            this.match(ExprParser.T__4);
            this.state = 79;
            this.match(ExprParser.INT);
            this.state = 82;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 8) {
                {
                this.state = 80;
                this.match(ExprParser.T__7);
                this.state = 81;
                this.match(ExprParser.INT);
                }
            }

            this.state = 84;
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
    public broker(): BrokerContext {
        let localContext = new BrokerContext(this.context, this.state);
        this.enterRule(localContext, 4, ExprParser.RULE_broker);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 86;
            this.match(ExprParser.T__8);
            this.state = 87;
            this.match(ExprParser.T__4);
            this.state = 88;
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
        this.enterRule(localContext, 6, ExprParser.RULE_symbol);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 90;
            this.match(ExprParser.T__9);
            this.state = 91;
            this.match(ExprParser.T__4);
            this.state = 92;
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
        this.enterRule(localContext, 8, ExprParser.RULE_timeframe);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 94;
            this.match(ExprParser.T__10);
            this.state = 95;
            this.match(ExprParser.T__4);
            this.state = 96;
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
        this.enterRule(localContext, 10, ExprParser.RULE_hour);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 98;
            this.match(ExprParser.T__11);
            this.state = 99;
            this.match(ExprParser.T__4);
            this.state = 100;
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
        this.enterRule(localContext, 12, ExprParser.RULE_minute);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 102;
            this.match(ExprParser.T__12);
            this.state = 103;
            this.match(ExprParser.T__4);
            this.state = 104;
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
        this.enterRule(localContext, 14, ExprParser.RULE_open);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 106;
            this.match(ExprParser.T__13);
            this.state = 107;
            this.match(ExprParser.T__4);
            this.state = 109;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 108;
                this.match(ExprParser.INT);
                }
            }

            this.state = 111;
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
        this.enterRule(localContext, 16, ExprParser.RULE_high);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 113;
            this.match(ExprParser.T__14);
            this.state = 114;
            this.match(ExprParser.T__4);
            this.state = 116;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 115;
                this.match(ExprParser.INT);
                }
            }

            this.state = 118;
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
        this.enterRule(localContext, 18, ExprParser.RULE_low);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 120;
            this.match(ExprParser.T__15);
            this.state = 121;
            this.match(ExprParser.T__4);
            this.state = 123;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 122;
                this.match(ExprParser.INT);
                }
            }

            this.state = 125;
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
        this.enterRule(localContext, 20, ExprParser.RULE_close);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 127;
            this.match(ExprParser.T__16);
            this.state = 128;
            this.match(ExprParser.T__4);
            this.state = 130;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 129;
                this.match(ExprParser.INT);
                }
            }

            this.state = 132;
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
        this.enterRule(localContext, 22, ExprParser.RULE_volume);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 134;
            this.match(ExprParser.T__17);
            this.state = 135;
            this.match(ExprParser.T__4);
            this.state = 137;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 136;
                this.match(ExprParser.INT);
                }
            }

            this.state = 139;
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
        this.enterRule(localContext, 24, ExprParser.RULE_volume24h_in_usd);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 141;
            this.match(ExprParser.T__18);
            this.state = 142;
            this.match(ExprParser.T__4);
            this.state = 143;
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
        this.enterRule(localContext, 26, ExprParser.RULE_change);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 145;
            this.match(ExprParser.T__19);
            this.state = 146;
            this.match(ExprParser.T__4);
            this.state = 148;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 147;
                this.match(ExprParser.INT);
                }
            }

            this.state = 150;
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
        this.enterRule(localContext, 28, ExprParser.RULE_changeP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 152;
            this.match(ExprParser.T__20);
            this.state = 153;
            this.match(ExprParser.T__4);
            this.state = 155;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 154;
                this.match(ExprParser.INT);
                }
            }

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
    public ampl(): AmplContext {
        let localContext = new AmplContext(this.context, this.state);
        this.enterRule(localContext, 30, ExprParser.RULE_ampl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 159;
            this.match(ExprParser.T__21);
            this.state = 160;
            this.match(ExprParser.T__4);
            this.state = 162;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 161;
                this.match(ExprParser.INT);
                }
            }

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
    public amplP(): AmplPContext {
        let localContext = new AmplPContext(this.context, this.state);
        this.enterRule(localContext, 32, ExprParser.RULE_amplP);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 166;
            this.match(ExprParser.T__22);
            this.state = 167;
            this.match(ExprParser.T__4);
            this.state = 169;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 168;
                this.match(ExprParser.INT);
                }
            }

            this.state = 171;
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
        this.enterRule(localContext, 34, ExprParser.RULE_comparisonOp);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 173;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 520093696) !== 0))) {
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
            return this.precpred(this.context, 23);
        case 1:
            return this.precpred(this.context, 22);
        case 2:
            return this.precpred(this.context, 21);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,32,176,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
        1,0,1,0,3,0,61,8,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,73,
        8,0,10,0,12,0,76,9,0,1,1,1,1,1,1,1,1,1,1,3,1,83,8,1,1,1,1,1,1,2,
        1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,6,
        1,6,1,6,1,6,1,7,1,7,1,7,3,7,110,8,7,1,7,1,7,1,8,1,8,1,8,3,8,117,
        8,8,1,8,1,8,1,9,1,9,1,9,3,9,124,8,9,1,9,1,9,1,10,1,10,1,10,3,10,
        131,8,10,1,10,1,10,1,11,1,11,1,11,3,11,138,8,11,1,11,1,11,1,12,1,
        12,1,12,1,12,1,13,1,13,1,13,3,13,149,8,13,1,13,1,13,1,14,1,14,1,
        14,3,14,156,8,14,1,14,1,14,1,15,1,15,1,15,3,15,163,8,15,1,15,1,15,
        1,16,1,16,1,16,3,16,170,8,16,1,16,1,16,1,17,1,17,1,17,0,1,0,18,0,
        2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,0,3,1,0,1,2,1,0,3,
        4,1,0,24,28,189,0,60,1,0,0,0,2,77,1,0,0,0,4,86,1,0,0,0,6,90,1,0,
        0,0,8,94,1,0,0,0,10,98,1,0,0,0,12,102,1,0,0,0,14,106,1,0,0,0,16,
        113,1,0,0,0,18,120,1,0,0,0,20,127,1,0,0,0,22,134,1,0,0,0,24,141,
        1,0,0,0,26,145,1,0,0,0,28,152,1,0,0,0,30,159,1,0,0,0,32,166,1,0,
        0,0,34,173,1,0,0,0,36,37,6,0,-1,0,37,38,5,5,0,0,38,39,3,0,0,0,39,
        40,5,6,0,0,40,61,1,0,0,0,41,61,5,29,0,0,42,61,5,30,0,0,43,61,5,31,
        0,0,44,61,3,2,1,0,45,61,3,4,2,0,46,61,3,6,3,0,47,61,3,8,4,0,48,61,
        3,10,5,0,49,61,3,12,6,0,50,61,3,14,7,0,51,61,3,16,8,0,52,61,3,18,
        9,0,53,61,3,20,10,0,54,61,3,22,11,0,55,61,3,24,12,0,56,61,3,26,13,
        0,57,61,3,28,14,0,58,61,3,30,15,0,59,61,3,32,16,0,60,36,1,0,0,0,
        60,41,1,0,0,0,60,42,1,0,0,0,60,43,1,0,0,0,60,44,1,0,0,0,60,45,1,
        0,0,0,60,46,1,0,0,0,60,47,1,0,0,0,60,48,1,0,0,0,60,49,1,0,0,0,60,
        50,1,0,0,0,60,51,1,0,0,0,60,52,1,0,0,0,60,53,1,0,0,0,60,54,1,0,0,
        0,60,55,1,0,0,0,60,56,1,0,0,0,60,57,1,0,0,0,60,58,1,0,0,0,60,59,
        1,0,0,0,61,74,1,0,0,0,62,63,10,23,0,0,63,64,7,0,0,0,64,73,3,0,0,
        24,65,66,10,22,0,0,66,67,7,1,0,0,67,73,3,0,0,23,68,69,10,21,0,0,
        69,70,3,34,17,0,70,71,3,0,0,22,71,73,1,0,0,0,72,62,1,0,0,0,72,65,
        1,0,0,0,72,68,1,0,0,0,73,76,1,0,0,0,74,72,1,0,0,0,74,75,1,0,0,0,
        75,1,1,0,0,0,76,74,1,0,0,0,77,78,5,7,0,0,78,79,5,5,0,0,79,82,5,29,
        0,0,80,81,5,8,0,0,81,83,5,29,0,0,82,80,1,0,0,0,82,83,1,0,0,0,83,
        84,1,0,0,0,84,85,5,6,0,0,85,3,1,0,0,0,86,87,5,9,0,0,87,88,5,5,0,
        0,88,89,5,6,0,0,89,5,1,0,0,0,90,91,5,10,0,0,91,92,5,5,0,0,92,93,
        5,6,0,0,93,7,1,0,0,0,94,95,5,11,0,0,95,96,5,5,0,0,96,97,5,6,0,0,
        97,9,1,0,0,0,98,99,5,12,0,0,99,100,5,5,0,0,100,101,5,6,0,0,101,11,
        1,0,0,0,102,103,5,13,0,0,103,104,5,5,0,0,104,105,5,6,0,0,105,13,
        1,0,0,0,106,107,5,14,0,0,107,109,5,5,0,0,108,110,5,29,0,0,109,108,
        1,0,0,0,109,110,1,0,0,0,110,111,1,0,0,0,111,112,5,6,0,0,112,15,1,
        0,0,0,113,114,5,15,0,0,114,116,5,5,0,0,115,117,5,29,0,0,116,115,
        1,0,0,0,116,117,1,0,0,0,117,118,1,0,0,0,118,119,5,6,0,0,119,17,1,
        0,0,0,120,121,5,16,0,0,121,123,5,5,0,0,122,124,5,29,0,0,123,122,
        1,0,0,0,123,124,1,0,0,0,124,125,1,0,0,0,125,126,5,6,0,0,126,19,1,
        0,0,0,127,128,5,17,0,0,128,130,5,5,0,0,129,131,5,29,0,0,130,129,
        1,0,0,0,130,131,1,0,0,0,131,132,1,0,0,0,132,133,5,6,0,0,133,21,1,
        0,0,0,134,135,5,18,0,0,135,137,5,5,0,0,136,138,5,29,0,0,137,136,
        1,0,0,0,137,138,1,0,0,0,138,139,1,0,0,0,139,140,5,6,0,0,140,23,1,
        0,0,0,141,142,5,19,0,0,142,143,5,5,0,0,143,144,5,6,0,0,144,25,1,
        0,0,0,145,146,5,20,0,0,146,148,5,5,0,0,147,149,5,29,0,0,148,147,
        1,0,0,0,148,149,1,0,0,0,149,150,1,0,0,0,150,151,5,6,0,0,151,27,1,
        0,0,0,152,153,5,21,0,0,153,155,5,5,0,0,154,156,5,29,0,0,155,154,
        1,0,0,0,155,156,1,0,0,0,156,157,1,0,0,0,157,158,5,6,0,0,158,29,1,
        0,0,0,159,160,5,22,0,0,160,162,5,5,0,0,161,163,5,29,0,0,162,161,
        1,0,0,0,162,163,1,0,0,0,163,164,1,0,0,0,164,165,5,6,0,0,165,31,1,
        0,0,0,166,167,5,23,0,0,167,169,5,5,0,0,168,170,5,29,0,0,169,168,
        1,0,0,0,169,170,1,0,0,0,170,171,1,0,0,0,171,172,5,6,0,0,172,33,1,
        0,0,0,173,174,7,2,0,0,174,35,1,0,0,0,13,60,72,74,82,109,116,123,
        130,137,148,155,162,169
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


export class RsiContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return ExprParser.RULE_rsi;
    }
    public override copyFrom(ctx: RsiContext): void {
        super.copyFrom(ctx);
    }
}
export class RSIContext extends RsiContext {
    public constructor(ctx: RsiContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
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
    public override accept<Result>(visitor: ExprVisitor<Result>): Result | null {
        if (visitor.visitRSI) {
            return visitor.visitRSI(this);
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
