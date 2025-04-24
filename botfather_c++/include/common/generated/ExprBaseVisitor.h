
// Generated from src/common/Expr.g4 by ANTLR 4.13.1

#pragma once


#include "antlr4-runtime.h"
#include "ExprVisitor.h"


/**
 * This class provides an empty implementation of ExprVisitor, which can be
 * extended to create a visitor which only needs to handle a subset of the available methods.
 */
class  ExprBaseVisitor : public ExprVisitor {
public:

  virtual std::any visitIClose(ExprParser::ICloseContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinChange(ExprParser::IMinChangeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMACD_signal(ExprParser::IMACD_signalContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinAmpl(ExprParser::IMinAmplContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBullish_hammer(ExprParser::IBullish_hammerContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIHour(ExprParser::IHourContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIAvgAmpl(ExprParser::IAvgAmplContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitILowerShadow(ExprParser::ILowerShadowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMACD_histogram(ExprParser::IMACD_histogramContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitString(ExprParser::StringContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitISymbol(ExprParser::ISymbolContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBullBearList(ExprParser::IBullBearListContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIAvgHigh(ExprParser::IAvgHighContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinRSI(ExprParser::IMinRSIContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinute(ExprParser::IMinuteContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinHigh(ExprParser::IMinHighContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitNegative(ExprParser::NegativeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIAvgAmplP(ExprParser::IAvgAmplPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitILow(ExprParser::ILowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIVolume(ExprParser::IVolumeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinClose(ExprParser::IMinCloseContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIEMA(ExprParser::IEMAContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBB_low(ExprParser::IBB_lowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxHigh(ExprParser::IMaxHighContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMACD_n_dinh(ExprParser::IMACD_n_dinhContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinLow(ExprParser::IMinLowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBroker(ExprParser::IBrokerContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIRSI(ExprParser::IRSIContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBB_mid(ExprParser::IBB_midContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitFloat(ExprParser::FloatContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMIN(ExprParser::MINContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxAmplP(ExprParser::IMaxAmplPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMA(ExprParser::IMAContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBearish(ExprParser::IBearishContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIOpen(ExprParser::IOpenContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIHigh(ExprParser::IHighContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMARSI(ExprParser::IMARSIContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxOpen(ExprParser::IMaxOpenContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMAX(ExprParser::MAXContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIVolume24hInUSD(ExprParser::IVolume24hInUSDContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMulDiv(ExprParser::MulDivContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitParens(ExprParser::ParensContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxChangeP(ExprParser::IMaxChangePContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitILowerShadowP(ExprParser::ILowerShadowPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinAmplP(ExprParser::IMinAmplPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIAmplP(ExprParser::IAmplPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIAvgClose(ExprParser::IAvgCloseContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinChangeP(ExprParser::IMinChangePContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxClose(ExprParser::IMaxCloseContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitInt(ExprParser::IntContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitABS(ExprParser::ABSContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIChange(ExprParser::IChangeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitComparison(ExprParser::ComparisonContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIAmpl(ExprParser::IAmplContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxAmpl(ExprParser::IMaxAmplContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBullish_engulfing(ExprParser::IBullish_engulfingContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBB_up(ExprParser::IBB_upContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBullish(ExprParser::IBullishContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIRSISlope(ExprParser::IRSISlopeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIAvgLow(ExprParser::IAvgLowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIUpperShadowP(ExprParser::IUpperShadowPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxChange(ExprParser::IMaxChangeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAddSub(ExprParser::AddSubContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBearish_engulfing(ExprParser::IBearish_engulfingContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIChangeP(ExprParser::IChangePContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMinOpen(ExprParser::IMinOpenContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIBearish_hammer(ExprParser::IBearish_hammerContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIAvgOpen(ExprParser::IAvgOpenContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxRSI(ExprParser::IMaxRSIContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMACD_value(ExprParser::IMACD_valueContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMACD_slope(ExprParser::IMACD_slopeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitPositive(ExprParser::PositiveContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitITimeframe(ExprParser::ITimeframeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIDoji(ExprParser::IDojiContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIMaxLow(ExprParser::IMaxLowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitIUpperShadow(ExprParser::IUpperShadowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBroker(ExprParser::BrokerContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitSymbol(ExprParser::SymbolContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitTimeframe(ExprParser::TimeframeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitHour(ExprParser::HourContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMinute(ExprParser::MinuteContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitOpen(ExprParser::OpenContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitHigh(ExprParser::HighContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitLow(ExprParser::LowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitClose(ExprParser::CloseContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitVolume(ExprParser::VolumeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitVolume24h_in_usd(ExprParser::Volume24h_in_usdContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitChange(ExprParser::ChangeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitChangeP(ExprParser::ChangePContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAmpl(ExprParser::AmplContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAmplP(ExprParser::AmplPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitUpper_shadow(ExprParser::Upper_shadowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitUpper_shadowP(ExprParser::Upper_shadowPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitLower_shadow(ExprParser::Lower_shadowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitLower_shadowP(ExprParser::Lower_shadowPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitRsi(ExprParser::RsiContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitRsi_slope(ExprParser::Rsi_slopeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMa(ExprParser::MaContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitEma(ExprParser::EmaContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMacd_value(ExprParser::Macd_valueContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMacd_signal(ExprParser::Macd_signalContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMacd_histogram(ExprParser::Macd_histogramContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBb_upper(ExprParser::Bb_upperContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBb_middle(ExprParser::Bb_middleContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBb_lower(ExprParser::Bb_lowerContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMacd_n_dinh(ExprParser::Macd_n_dinhContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMacd_slope(ExprParser::Macd_slopeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBullish_engulfing(ExprParser::Bullish_engulfingContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBearish_engulfing(ExprParser::Bearish_engulfingContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBullish_hammer(ExprParser::Bullish_hammerContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBearish_hammer(ExprParser::Bearish_hammerContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBullish(ExprParser::BullishContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBearish(ExprParser::BearishContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMarsi(ExprParser::MarsiContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitBull_bear_list(ExprParser::Bull_bear_listContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitDoji(ExprParser::DojiContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAvg_open(ExprParser::Avg_openContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAvg_high(ExprParser::Avg_highContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAvg_low(ExprParser::Avg_lowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAvg_close(ExprParser::Avg_closeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAvg_ampl(ExprParser::Avg_amplContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitAvg_amplP(ExprParser::Avg_amplPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_open(ExprParser::Max_openContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_high(ExprParser::Max_highContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_low(ExprParser::Max_lowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_close(ExprParser::Max_closeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_open(ExprParser::Min_openContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_high(ExprParser::Min_highContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_low(ExprParser::Min_lowContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_close(ExprParser::Min_closeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_rsi(ExprParser::Min_rsiContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_rsi(ExprParser::Max_rsiContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_change(ExprParser::Min_changeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_change(ExprParser::Max_changeContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_changeP(ExprParser::Min_changePContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_changeP(ExprParser::Max_changePContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_ampl(ExprParser::Min_amplContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_ampl(ExprParser::Max_amplContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMin_amplP(ExprParser::Min_amplPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitMax_amplP(ExprParser::Max_amplPContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitComparisonOp(ExprParser::ComparisonOpContext *ctx) override {
    return visitChildren(ctx);
  }

  virtual std::any visitNumber(ExprParser::NumberContext *ctx) override {
    return visitChildren(ctx);
  }


};

