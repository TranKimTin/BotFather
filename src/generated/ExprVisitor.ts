// Generated from src/Expr.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


import { ICloseContext } from "./ExprParser.js";
import { IHighContext } from "./ExprParser.js";
import { IVolume24hInUSDContext } from "./ExprParser.js";
import { MulDivContext } from "./ExprParser.js";
import { AddSubContext } from "./ExprParser.js";
import { ParensContext } from "./ExprParser.js";
import { IHourContext } from "./ExprParser.js";
import { IChangePContext } from "./ExprParser.js";
import { IBrokerContext } from "./ExprParser.js";
import { StringContext } from "./ExprParser.js";
import { IAmplPContext } from "./ExprParser.js";
import { ISymbolContext } from "./ExprParser.js";
import { IntContext } from "./ExprParser.js";
import { IRSIContext } from "./ExprParser.js";
import { FloatContext } from "./ExprParser.js";
import { IMinuteContext } from "./ExprParser.js";
import { IChangeContext } from "./ExprParser.js";
import { ITimeframeContext } from "./ExprParser.js";
import { ComparisonContext } from "./ExprParser.js";
import { IAmplContext } from "./ExprParser.js";
import { ILowContext } from "./ExprParser.js";
import { IVolumeContext } from "./ExprParser.js";
import { IOpenContext } from "./ExprParser.js";
import { RSIContext } from "./ExprParser.js";
import { BrokerContext } from "./ExprParser.js";
import { SymbolContext } from "./ExprParser.js";
import { TimeframeContext } from "./ExprParser.js";
import { HourContext } from "./ExprParser.js";
import { MinuteContext } from "./ExprParser.js";
import { OpenContext } from "./ExprParser.js";
import { HighContext } from "./ExprParser.js";
import { LowContext } from "./ExprParser.js";
import { CloseContext } from "./ExprParser.js";
import { VolumeContext } from "./ExprParser.js";
import { Volume24h_in_usdContext } from "./ExprParser.js";
import { ChangeContext } from "./ExprParser.js";
import { ChangePContext } from "./ExprParser.js";
import { AmplContext } from "./ExprParser.js";
import { AmplPContext } from "./ExprParser.js";
import { ComparisonOpContext } from "./ExprParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `ExprParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class ExprVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by the `iClose`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIClose?: (ctx: ICloseContext) => Result;
    /**
     * Visit a parse tree produced by the `iHigh`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIHigh?: (ctx: IHighContext) => Result;
    /**
     * Visit a parse tree produced by the `iVolume24hInUSD`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIVolume24hInUSD?: (ctx: IVolume24hInUSDContext) => Result;
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
     * Visit a parse tree produced by the `iHour`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIHour?: (ctx: IHourContext) => Result;
    /**
     * Visit a parse tree produced by the `iChangeP`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIChangeP?: (ctx: IChangePContext) => Result;
    /**
     * Visit a parse tree produced by the `iBroker`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBroker?: (ctx: IBrokerContext) => Result;
    /**
     * Visit a parse tree produced by the `String`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitString?: (ctx: StringContext) => Result;
    /**
     * Visit a parse tree produced by the `iAmplP`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIAmplP?: (ctx: IAmplPContext) => Result;
    /**
     * Visit a parse tree produced by the `iSymbol`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitISymbol?: (ctx: ISymbolContext) => Result;
    /**
     * Visit a parse tree produced by the `Int`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitInt?: (ctx: IntContext) => Result;
    /**
     * Visit a parse tree produced by the `iRSI`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIRSI?: (ctx: IRSIContext) => Result;
    /**
     * Visit a parse tree produced by the `Float`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFloat?: (ctx: FloatContext) => Result;
    /**
     * Visit a parse tree produced by the `iMinute`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIMinute?: (ctx: IMinuteContext) => Result;
    /**
     * Visit a parse tree produced by the `iChange`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIChange?: (ctx: IChangeContext) => Result;
    /**
     * Visit a parse tree produced by the `iTimeframe`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitITimeframe?: (ctx: ITimeframeContext) => Result;
    /**
     * Visit a parse tree produced by the `Comparison`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitComparison?: (ctx: ComparisonContext) => Result;
    /**
     * Visit a parse tree produced by the `iAmpl`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIAmpl?: (ctx: IAmplContext) => Result;
    /**
     * Visit a parse tree produced by the `iLow`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitILow?: (ctx: ILowContext) => Result;
    /**
     * Visit a parse tree produced by the `iVolume`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIVolume?: (ctx: IVolumeContext) => Result;
    /**
     * Visit a parse tree produced by the `iOpen`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIOpen?: (ctx: IOpenContext) => Result;
    /**
     * Visit a parse tree produced by the `RSI`
     * labeled alternative in `ExprParser.rsi`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRSI?: (ctx: RSIContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.broker`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBroker?: (ctx: BrokerContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.symbol`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSymbol?: (ctx: SymbolContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.timeframe`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTimeframe?: (ctx: TimeframeContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.hour`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHour?: (ctx: HourContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.minute`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMinute?: (ctx: MinuteContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.open`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitOpen?: (ctx: OpenContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.high`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitHigh?: (ctx: HighContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.low`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLow?: (ctx: LowContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.close`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitClose?: (ctx: CloseContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.volume`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVolume?: (ctx: VolumeContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.volume24h_in_usd`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVolume24h_in_usd?: (ctx: Volume24h_in_usdContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.change`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitChange?: (ctx: ChangeContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.changeP`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitChangeP?: (ctx: ChangePContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.ampl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAmpl?: (ctx: AmplContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.amplP`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAmplP?: (ctx: AmplPContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.comparisonOp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitComparisonOp?: (ctx: ComparisonOpContext) => Result;
}

