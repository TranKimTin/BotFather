// Generated from src/Expr.g4 by ANTLR 4.13.1

import { AbstractParseTreeVisitor } from "antlr4ng";


import { ICloseContext } from "./ExprParser.js";
import { IHighContext } from "./ExprParser.js";
import { IMACD_signalContext } from "./ExprParser.js";
import { IVolume24hInUSDContext } from "./ExprParser.js";
import { MulDivContext } from "./ExprParser.js";
import { ParensContext } from "./ExprParser.js";
import { IBullish_hammerContext } from "./ExprParser.js";
import { IHourContext } from "./ExprParser.js";
import { ILowerShadowContext } from "./ExprParser.js";
import { ILowerShadowPContext } from "./ExprParser.js";
import { IMACD_histogramContext } from "./ExprParser.js";
import { StringContext } from "./ExprParser.js";
import { IAmplPContext } from "./ExprParser.js";
import { ISymbolContext } from "./ExprParser.js";
import { IntContext } from "./ExprParser.js";
import { IMinuteContext } from "./ExprParser.js";
import { IChangeContext } from "./ExprParser.js";
import { ComparisonContext } from "./ExprParser.js";
import { IAmplContext } from "./ExprParser.js";
import { IBullish_engulfingContext } from "./ExprParser.js";
import { ILowContext } from "./ExprParser.js";
import { IVolumeContext } from "./ExprParser.js";
import { IBB_upContext } from "./ExprParser.js";
import { IEMAContext } from "./ExprParser.js";
import { IBullishContext } from "./ExprParser.js";
import { IRSISlopeContext } from "./ExprParser.js";
import { IBB_lowContext } from "./ExprParser.js";
import { IUpperShadowPContext } from "./ExprParser.js";
import { IRSI_phan_kiContext } from "./ExprParser.js";
import { IMACD_n_dinhContext } from "./ExprParser.js";
import { AddSubContext } from "./ExprParser.js";
import { IBearish_engulfingContext } from "./ExprParser.js";
import { IChangePContext } from "./ExprParser.js";
import { IBrokerContext } from "./ExprParser.js";
import { IBearish_hammerContext } from "./ExprParser.js";
import { IRSIContext } from "./ExprParser.js";
import { IBB_midContext } from "./ExprParser.js";
import { FloatContext } from "./ExprParser.js";
import { IMACD_valueContext } from "./ExprParser.js";
import { IMACD_slopeContext } from "./ExprParser.js";
import { ITimeframeContext } from "./ExprParser.js";
import { IMAContext } from "./ExprParser.js";
import { IUpperShadowContext } from "./ExprParser.js";
import { IBearishContext } from "./ExprParser.js";
import { IOpenContext } from "./ExprParser.js";
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
import { Upper_shadowContext } from "./ExprParser.js";
import { Upper_shadowPContext } from "./ExprParser.js";
import { Lower_shadowContext } from "./ExprParser.js";
import { Lower_shadowPContext } from "./ExprParser.js";
import { RsiContext } from "./ExprParser.js";
import { Rsi_slopeContext } from "./ExprParser.js";
import { MaContext } from "./ExprParser.js";
import { EmaContext } from "./ExprParser.js";
import { Macd_valueContext } from "./ExprParser.js";
import { Macd_signalContext } from "./ExprParser.js";
import { Macd_histogramContext } from "./ExprParser.js";
import { Bb_upperContext } from "./ExprParser.js";
import { Bb_middleContext } from "./ExprParser.js";
import { Bb_lowerContext } from "./ExprParser.js";
import { Rsi_phan_kiContext } from "./ExprParser.js";
import { Macd_n_dinhContext } from "./ExprParser.js";
import { Macd_slopeContext } from "./ExprParser.js";
import { Bullish_engulfingContext } from "./ExprParser.js";
import { Bearish_engulfingContext } from "./ExprParser.js";
import { Bullish_hammerContext } from "./ExprParser.js";
import { Bearish_hammerContext } from "./ExprParser.js";
import { BullishContext } from "./ExprParser.js";
import { BearishContext } from "./ExprParser.js";
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
     * Visit a parse tree produced by the `iMACD_signal`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIMACD_signal?: (ctx: IMACD_signalContext) => Result;
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
     * Visit a parse tree produced by the `Parens`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParens?: (ctx: ParensContext) => Result;
    /**
     * Visit a parse tree produced by the `iBullish_hammer`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBullish_hammer?: (ctx: IBullish_hammerContext) => Result;
    /**
     * Visit a parse tree produced by the `iHour`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIHour?: (ctx: IHourContext) => Result;
    /**
     * Visit a parse tree produced by the `iLowerShadow`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitILowerShadow?: (ctx: ILowerShadowContext) => Result;
    /**
     * Visit a parse tree produced by the `iLowerShadowP`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitILowerShadowP?: (ctx: ILowerShadowPContext) => Result;
    /**
     * Visit a parse tree produced by the `iMACD_histogram`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIMACD_histogram?: (ctx: IMACD_histogramContext) => Result;
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
     * Visit a parse tree produced by the `iBullish_engulfing`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBullish_engulfing?: (ctx: IBullish_engulfingContext) => Result;
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
     * Visit a parse tree produced by the `iBB_up`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBB_up?: (ctx: IBB_upContext) => Result;
    /**
     * Visit a parse tree produced by the `iEMA`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIEMA?: (ctx: IEMAContext) => Result;
    /**
     * Visit a parse tree produced by the `iBullish`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBullish?: (ctx: IBullishContext) => Result;
    /**
     * Visit a parse tree produced by the `iRSISlope`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIRSISlope?: (ctx: IRSISlopeContext) => Result;
    /**
     * Visit a parse tree produced by the `iBB_low`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBB_low?: (ctx: IBB_lowContext) => Result;
    /**
     * Visit a parse tree produced by the `iUpperShadowP`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIUpperShadowP?: (ctx: IUpperShadowPContext) => Result;
    /**
     * Visit a parse tree produced by the `iRSI_phan_ki`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIRSI_phan_ki?: (ctx: IRSI_phan_kiContext) => Result;
    /**
     * Visit a parse tree produced by the `iMACD_n_dinh`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIMACD_n_dinh?: (ctx: IMACD_n_dinhContext) => Result;
    /**
     * Visit a parse tree produced by the `AddSub`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAddSub?: (ctx: AddSubContext) => Result;
    /**
     * Visit a parse tree produced by the `iBearish_engulfing`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBearish_engulfing?: (ctx: IBearish_engulfingContext) => Result;
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
     * Visit a parse tree produced by the `iBearish_hammer`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBearish_hammer?: (ctx: IBearish_hammerContext) => Result;
    /**
     * Visit a parse tree produced by the `iRSI`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIRSI?: (ctx: IRSIContext) => Result;
    /**
     * Visit a parse tree produced by the `iBB_mid`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBB_mid?: (ctx: IBB_midContext) => Result;
    /**
     * Visit a parse tree produced by the `Float`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFloat?: (ctx: FloatContext) => Result;
    /**
     * Visit a parse tree produced by the `iMACD_value`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIMACD_value?: (ctx: IMACD_valueContext) => Result;
    /**
     * Visit a parse tree produced by the `iMACD_slope`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIMACD_slope?: (ctx: IMACD_slopeContext) => Result;
    /**
     * Visit a parse tree produced by the `iTimeframe`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitITimeframe?: (ctx: ITimeframeContext) => Result;
    /**
     * Visit a parse tree produced by the `iMA`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIMA?: (ctx: IMAContext) => Result;
    /**
     * Visit a parse tree produced by the `iUpperShadow`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIUpperShadow?: (ctx: IUpperShadowContext) => Result;
    /**
     * Visit a parse tree produced by the `iBearish`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIBearish?: (ctx: IBearishContext) => Result;
    /**
     * Visit a parse tree produced by the `iOpen`
     * labeled alternative in `ExprParser.expr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIOpen?: (ctx: IOpenContext) => Result;
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
     * Visit a parse tree produced by `ExprParser.upper_shadow`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUpper_shadow?: (ctx: Upper_shadowContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.upper_shadowP`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUpper_shadowP?: (ctx: Upper_shadowPContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.lower_shadow`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLower_shadow?: (ctx: Lower_shadowContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.lower_shadowP`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLower_shadowP?: (ctx: Lower_shadowPContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.rsi`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRsi?: (ctx: RsiContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.rsi_slope`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRsi_slope?: (ctx: Rsi_slopeContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.ma`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMa?: (ctx: MaContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.ema`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEma?: (ctx: EmaContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.macd_value`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMacd_value?: (ctx: Macd_valueContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.macd_signal`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMacd_signal?: (ctx: Macd_signalContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.macd_histogram`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMacd_histogram?: (ctx: Macd_histogramContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bb_upper`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBb_upper?: (ctx: Bb_upperContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bb_middle`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBb_middle?: (ctx: Bb_middleContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bb_lower`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBb_lower?: (ctx: Bb_lowerContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.rsi_phan_ki`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRsi_phan_ki?: (ctx: Rsi_phan_kiContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.macd_n_dinh`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMacd_n_dinh?: (ctx: Macd_n_dinhContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.macd_slope`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMacd_slope?: (ctx: Macd_slopeContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bullish_engulfing`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBullish_engulfing?: (ctx: Bullish_engulfingContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bearish_engulfing`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBearish_engulfing?: (ctx: Bearish_engulfingContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bullish_hammer`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBullish_hammer?: (ctx: Bullish_hammerContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bearish_hammer`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBearish_hammer?: (ctx: Bearish_hammerContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bullish`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBullish?: (ctx: BullishContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.bearish`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBearish?: (ctx: BearishContext) => Result;
    /**
     * Visit a parse tree produced by `ExprParser.comparisonOp`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitComparisonOp?: (ctx: ComparisonOpContext) => Result;
}

