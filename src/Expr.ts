import * as antlr from "antlr4ng";
import { BaseErrorListener, CharStream, CommonTokenStream, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { ExprLexer } from './generated/ExprLexer';
import { AddSubContext, ExprParser, MulDivContext, NumberContext, ParensContext, RSIContext } from './generated/ExprParser';
import { ExprVisitor } from './generated/ExprVisitor';

export class Expr extends ExprVisitor<any> {
    visitAddSub = (ctx: AddSubContext) => {
        const A = ctx.expr(0);
        const B = ctx.expr(1);

        if (A === null || B === null) return null;

        const left = this.visit(A);
        const right = this.visit(B);
        return ctx.children[1].getText() === '+' ? left + right : left - right;
    }

    visitMulDiv = (ctx: MulDivContext) => {
        const A = ctx.expr(0);
        const B = ctx.expr(1);

        if (A === null || B === null) return null;

        const left = this.visit(A);
        const right = this.visit(B);
        return ctx.children[1].getText() === '*' ? left * right : left / right;
    }

    visitNumber = (ctx: NumberContext) => {
        return parseInt(ctx.NUMBER().getText(), 10) || null;
    }

    visitParens = (ctx: ParensContext) => {
        return this.visit(ctx.expr());
    }

    visitRSI = (ctx: RSIContext) => {
        const period = parseFloat(ctx.NUMBER(0)?.getText() || "0");
        let shift = parseFloat(ctx.NUMBER(1)?.getText() || "0");

        return period + shift;
    };

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

const input = `1 + rsi(14,1,1) * 2`;
const inputStream = CharStream.fromString(input);
const lexer = new ExprLexer(inputStream);
const tokenStream = new CommonTokenStream(lexer);
const parser = new ExprParser(tokenStream);

parser.removeErrorListeners();
parser.addErrorListener(new CustomErrorListener());

try {
    const tree = parser.expr();

    const evalVisitor = new Expr();
    const result = evalVisitor.visit(tree);

    console.log(result);  // output: 14

}
catch (err) {
    console.log(err)
}



