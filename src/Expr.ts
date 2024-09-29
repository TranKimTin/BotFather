import * as antlr from "antlr4ng";
import { BaseErrorListener, CharStream, CommonTokenStream, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { ExprLexer } from './generated/ExprLexer';
import { AddSubContext, AmplContext, AmplPContext, BrokerContext, ChangeContext, ChangePContext, CloseContext, ComparisonContext, ExprParser, FloatContext, HighContext, HourContext, IntContext, IRSIContext, LowContext, MinuteContext, MulDivContext, OpenContext, ParensContext, RSIContext, StringContext, SymbolContext, TimeframeContext, Volume24h_in_usdContext, VolumeContext } from './generated/ExprParser';
import { ExprVisitor } from './generated/ExprVisitor';
import * as util from './util';
import Telegram, { TelegramIdType } from './telegram';
import { RateData } from "./BinanceFuture";
import moment from "moment";

export interface ExprArgs {
    telegram: Telegram;
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

export function checkCondition(condition: string, args: ExprArgs): boolean {
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

        // console.log(result);

        return Boolean(result);
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

export class Expr extends ExprVisitor<any> {
    private telegram: Telegram;
    private broker: string;
    private symbol: string;
    private timeframe: string;
    private data: Array<RateData>

    constructor(args: ExprArgs) {
        super();
        this.telegram = args.telegram;
        this.broker = args.broker;
        this.symbol = args.symbol;
        this.timeframe = args.timeframe;
        this.data = args.data;
    }

    visitAddSub = (ctx: AddSubContext) => {
        const A = ctx.expr(0);
        const B = ctx.expr(1);

        if (A === null || B === null) return null;

        console.log({ A, B });

        const left = this.visit(A);
        const right = this.visit(B);
        console.log({ left, right });
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
                return left == right;
            default:
                return null;
        }
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

    visitRSI = (ctx: RSIContext) => {
        const period = parseInt(ctx.INT(0)?.getText() || "0", 10);
        let shift = parseInt(ctx.INT(1)?.getText() || "0", 10);

        const RSIs = util.iRSI(this.data, period);
        if (shift >= RSIs.length) throw `RSI out of range. length = ${RSIs.length}`;
        return RSIs[shift];
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
}