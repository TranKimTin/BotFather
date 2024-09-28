// Generated from src/Expr.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


import { NumberContext } from "./ExprParser.js";
import { MulDivContext } from "./ExprParser.js";
import { AddSubContext } from "./ExprParser.js";
import { ParensContext } from "./ExprParser.js";
import { IRSIContext } from "./ExprParser.js";
import { RSIContext } from "./ExprParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `ExprParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class ExprVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by the `Number`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNumber?: (ctx: NumberContext) => Result;
    /**
     * Visit a parse tree produced by the `MulDiv`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMulDiv?: (ctx: MulDivContext) => Result;
    /**
     * Visit a parse tree produced by the `AddSub`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAddSub?: (ctx: AddSubContext) => Result;
    /**
     * Visit a parse tree produced by the `Parens`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParens?: (ctx: ParensContext) => Result;
    /**
     * Visit a parse tree produced by the `iRSI`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIRSI?: (ctx: IRSIContext) => Result;
    /**
     * Visit a parse tree produced by the `RSI`
     * labeled alternative in `ExprParser.rsi`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRSI?: (ctx: RSIContext) => Result;
}

