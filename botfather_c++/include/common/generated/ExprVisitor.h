
// Generated from src/common/Expr.g4 by ANTLR 4.13.1

#pragma once


#include "antlr4-runtime.h"
#include "ExprParser.h"



/**
 * This class defines an abstract visitor for a parse tree
 * produced by ExprParser.
 */
class  ExprVisitor : public antlr4::tree::AbstractParseTreeVisitor {
public:

  /**
   * Visit parse trees produced by ExprParser.
   */
    virtual std::any visitIClose(ExprParser::ICloseContext *context) = 0;

    virtual std::any visitIMinChange(ExprParser::IMinChangeContext *context) = 0;

    virtual std::any visitIMACD_signal(ExprParser::IMACD_signalContext *context) = 0;

    virtual std::any visitIMinAmpl(ExprParser::IMinAmplContext *context) = 0;

    virtual std::any visitIBullish_hammer(ExprParser::IBullish_hammerContext *context) = 0;

    virtual std::any visitIHour(ExprParser::IHourContext *context) = 0;

    virtual std::any visitIAvgAmpl(ExprParser::IAvgAmplContext *context) = 0;

    virtual std::any visitILowerShadow(ExprParser::ILowerShadowContext *context) = 0;

    virtual std::any visitIMACD_histogram(ExprParser::IMACD_histogramContext *context) = 0;

    virtual std::any visitString(ExprParser::StringContext *context) = 0;

    virtual std::any visitIAvgHigh(ExprParser::IAvgHighContext *context) = 0;

    virtual std::any visitIMinRSI(ExprParser::IMinRSIContext *context) = 0;

    virtual std::any visitIMinute(ExprParser::IMinuteContext *context) = 0;

    virtual std::any visitIMinHigh(ExprParser::IMinHighContext *context) = 0;

    virtual std::any visitNegative(ExprParser::NegativeContext *context) = 0;

    virtual std::any visitIAvgAmplP(ExprParser::IAvgAmplPContext *context) = 0;

    virtual std::any visitILow(ExprParser::ILowContext *context) = 0;

    virtual std::any visitIVolume(ExprParser::IVolumeContext *context) = 0;

    virtual std::any visitIMinClose(ExprParser::IMinCloseContext *context) = 0;

    virtual std::any visitIEMA(ExprParser::IEMAContext *context) = 0;

    virtual std::any visitIBB_low(ExprParser::IBB_lowContext *context) = 0;

    virtual std::any visitIMaxHigh(ExprParser::IMaxHighContext *context) = 0;

    virtual std::any visitIMACD_n_dinh(ExprParser::IMACD_n_dinhContext *context) = 0;

    virtual std::any visitIMinLow(ExprParser::IMinLowContext *context) = 0;

    virtual std::any visitIRSI(ExprParser::IRSIContext *context) = 0;

    virtual std::any visitIBB_mid(ExprParser::IBB_midContext *context) = 0;

    virtual std::any visitFloat(ExprParser::FloatContext *context) = 0;

    virtual std::any visitMIN(ExprParser::MINContext *context) = 0;

    virtual std::any visitIMaxAmplP(ExprParser::IMaxAmplPContext *context) = 0;

    virtual std::any visitIMA(ExprParser::IMAContext *context) = 0;

    virtual std::any visitIBearish(ExprParser::IBearishContext *context) = 0;

    virtual std::any visitIOpen(ExprParser::IOpenContext *context) = 0;

    virtual std::any visitIHigh(ExprParser::IHighContext *context) = 0;

    virtual std::any visitIMARSI(ExprParser::IMARSIContext *context) = 0;

    virtual std::any visitIMaxOpen(ExprParser::IMaxOpenContext *context) = 0;

    virtual std::any visitMAX(ExprParser::MAXContext *context) = 0;

    virtual std::any visitMulDiv(ExprParser::MulDivContext *context) = 0;

    virtual std::any visitParens(ExprParser::ParensContext *context) = 0;

    virtual std::any visitIMaxChangeP(ExprParser::IMaxChangePContext *context) = 0;

    virtual std::any visitILowerShadowP(ExprParser::ILowerShadowPContext *context) = 0;

    virtual std::any visitIMinAmplP(ExprParser::IMinAmplPContext *context) = 0;

    virtual std::any visitIAmplP(ExprParser::IAmplPContext *context) = 0;

    virtual std::any visitIAvgClose(ExprParser::IAvgCloseContext *context) = 0;

    virtual std::any visitIMinChangeP(ExprParser::IMinChangePContext *context) = 0;

    virtual std::any visitIMaxClose(ExprParser::IMaxCloseContext *context) = 0;

    virtual std::any visitInt(ExprParser::IntContext *context) = 0;

    virtual std::any visitABS(ExprParser::ABSContext *context) = 0;

    virtual std::any visitIChange(ExprParser::IChangeContext *context) = 0;

    virtual std::any visitComparison(ExprParser::ComparisonContext *context) = 0;

    virtual std::any visitIAmpl(ExprParser::IAmplContext *context) = 0;

    virtual std::any visitIMaxAmpl(ExprParser::IMaxAmplContext *context) = 0;

    virtual std::any visitIBullish_engulfing(ExprParser::IBullish_engulfingContext *context) = 0;

    virtual std::any visitIBB_up(ExprParser::IBB_upContext *context) = 0;

    virtual std::any visitIBullish(ExprParser::IBullishContext *context) = 0;

    virtual std::any visitIRSISlope(ExprParser::IRSISlopeContext *context) = 0;

    virtual std::any visitIAvgLow(ExprParser::IAvgLowContext *context) = 0;

    virtual std::any visitIUpperShadowP(ExprParser::IUpperShadowPContext *context) = 0;

    virtual std::any visitIMaxChange(ExprParser::IMaxChangeContext *context) = 0;

    virtual std::any visitAddSub(ExprParser::AddSubContext *context) = 0;

    virtual std::any visitIBearish_engulfing(ExprParser::IBearish_engulfingContext *context) = 0;

    virtual std::any visitIChangeP(ExprParser::IChangePContext *context) = 0;

    virtual std::any visitIMinOpen(ExprParser::IMinOpenContext *context) = 0;

    virtual std::any visitIBearish_hammer(ExprParser::IBearish_hammerContext *context) = 0;

    virtual std::any visitIAvgOpen(ExprParser::IAvgOpenContext *context) = 0;

    virtual std::any visitIMaxRSI(ExprParser::IMaxRSIContext *context) = 0;

    virtual std::any visitIMACD_value(ExprParser::IMACD_valueContext *context) = 0;

    virtual std::any visitIMACD_slope(ExprParser::IMACD_slopeContext *context) = 0;

    virtual std::any visitPositive(ExprParser::PositiveContext *context) = 0;

    virtual std::any visitIDoji(ExprParser::IDojiContext *context) = 0;

    virtual std::any visitIMaxLow(ExprParser::IMaxLowContext *context) = 0;

    virtual std::any visitIUpperShadow(ExprParser::IUpperShadowContext *context) = 0;

    virtual std::any visitHour(ExprParser::HourContext *context) = 0;

    virtual std::any visitMinute(ExprParser::MinuteContext *context) = 0;

    virtual std::any visitOpen(ExprParser::OpenContext *context) = 0;

    virtual std::any visitHigh(ExprParser::HighContext *context) = 0;

    virtual std::any visitLow(ExprParser::LowContext *context) = 0;

    virtual std::any visitClose(ExprParser::CloseContext *context) = 0;

    virtual std::any visitVolume(ExprParser::VolumeContext *context) = 0;

    virtual std::any visitChange(ExprParser::ChangeContext *context) = 0;

    virtual std::any visitChangeP(ExprParser::ChangePContext *context) = 0;

    virtual std::any visitAmpl(ExprParser::AmplContext *context) = 0;

    virtual std::any visitAmplP(ExprParser::AmplPContext *context) = 0;

    virtual std::any visitUpper_shadow(ExprParser::Upper_shadowContext *context) = 0;

    virtual std::any visitUpper_shadowP(ExprParser::Upper_shadowPContext *context) = 0;

    virtual std::any visitLower_shadow(ExprParser::Lower_shadowContext *context) = 0;

    virtual std::any visitLower_shadowP(ExprParser::Lower_shadowPContext *context) = 0;

    virtual std::any visitRsi(ExprParser::RsiContext *context) = 0;

    virtual std::any visitRsi_slope(ExprParser::Rsi_slopeContext *context) = 0;

    virtual std::any visitMa(ExprParser::MaContext *context) = 0;

    virtual std::any visitEma(ExprParser::EmaContext *context) = 0;

    virtual std::any visitMacd_value(ExprParser::Macd_valueContext *context) = 0;

    virtual std::any visitMacd_signal(ExprParser::Macd_signalContext *context) = 0;

    virtual std::any visitMacd_histogram(ExprParser::Macd_histogramContext *context) = 0;

    virtual std::any visitBb_upper(ExprParser::Bb_upperContext *context) = 0;

    virtual std::any visitBb_middle(ExprParser::Bb_middleContext *context) = 0;

    virtual std::any visitBb_lower(ExprParser::Bb_lowerContext *context) = 0;

    virtual std::any visitMacd_n_dinh(ExprParser::Macd_n_dinhContext *context) = 0;

    virtual std::any visitMacd_slope(ExprParser::Macd_slopeContext *context) = 0;

    virtual std::any visitBullish_engulfing(ExprParser::Bullish_engulfingContext *context) = 0;

    virtual std::any visitBearish_engulfing(ExprParser::Bearish_engulfingContext *context) = 0;

    virtual std::any visitBullish_hammer(ExprParser::Bullish_hammerContext *context) = 0;

    virtual std::any visitBearish_hammer(ExprParser::Bearish_hammerContext *context) = 0;

    virtual std::any visitBullish(ExprParser::BullishContext *context) = 0;

    virtual std::any visitBearish(ExprParser::BearishContext *context) = 0;

    virtual std::any visitMarsi(ExprParser::MarsiContext *context) = 0;

    virtual std::any visitDoji(ExprParser::DojiContext *context) = 0;

    virtual std::any visitAvg_open(ExprParser::Avg_openContext *context) = 0;

    virtual std::any visitAvg_high(ExprParser::Avg_highContext *context) = 0;

    virtual std::any visitAvg_low(ExprParser::Avg_lowContext *context) = 0;

    virtual std::any visitAvg_close(ExprParser::Avg_closeContext *context) = 0;

    virtual std::any visitAvg_ampl(ExprParser::Avg_amplContext *context) = 0;

    virtual std::any visitAvg_amplP(ExprParser::Avg_amplPContext *context) = 0;

    virtual std::any visitMax_open(ExprParser::Max_openContext *context) = 0;

    virtual std::any visitMax_high(ExprParser::Max_highContext *context) = 0;

    virtual std::any visitMax_low(ExprParser::Max_lowContext *context) = 0;

    virtual std::any visitMax_close(ExprParser::Max_closeContext *context) = 0;

    virtual std::any visitMin_open(ExprParser::Min_openContext *context) = 0;

    virtual std::any visitMin_high(ExprParser::Min_highContext *context) = 0;

    virtual std::any visitMin_low(ExprParser::Min_lowContext *context) = 0;

    virtual std::any visitMin_close(ExprParser::Min_closeContext *context) = 0;

    virtual std::any visitMin_rsi(ExprParser::Min_rsiContext *context) = 0;

    virtual std::any visitMax_rsi(ExprParser::Max_rsiContext *context) = 0;

    virtual std::any visitMin_change(ExprParser::Min_changeContext *context) = 0;

    virtual std::any visitMax_change(ExprParser::Max_changeContext *context) = 0;

    virtual std::any visitMin_changeP(ExprParser::Min_changePContext *context) = 0;

    virtual std::any visitMax_changeP(ExprParser::Max_changePContext *context) = 0;

    virtual std::any visitMin_ampl(ExprParser::Min_amplContext *context) = 0;

    virtual std::any visitMax_ampl(ExprParser::Max_amplContext *context) = 0;

    virtual std::any visitMin_amplP(ExprParser::Min_amplPContext *context) = 0;

    virtual std::any visitMax_amplP(ExprParser::Max_amplPContext *context) = 0;

    virtual std::any visitComparisonOp(ExprParser::ComparisonOpContext *context) = 0;

    virtual std::any visitNumber(ExprParser::NumberContext *context) = 0;


};

