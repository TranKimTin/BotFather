#pragma one

#include "common_type.h"
#include "antlr4-runtime.h"
#include "ExprBaseVisitor.h"
#include "ExprLexer.h"
#include "ExprParser.h"
#include "ExprVisitor.h"
#include <ANTLRFileStream.h>
#include <CommonTokenStream.h>
using namespace antlr4;

struct CachedParseTree
{
    std::unique_ptr<ANTLRInputStream> input;
    std::unique_ptr<ExprLexer> lexer;
    std::unique_ptr<CommonTokenStream> tokens;
    std::unique_ptr<ExprParser> parser;
    antlr4::tree::ParseTree *tree = nullptr;
};
class Expr : public ExprBaseVisitor
{
private:
    string broker;
    string symbol;
    string timeframe;
    int length;
    const double *open;
    const double *high;
    const double *low;
    const double *close;
    const double *volume;
    long long *startTime;

public:
    Expr(const string &broker, const string &symbol, const string &timeframe, int length,
         const double *open, const double *high, const double *low, const double *close, const double *volume,
         long long *startTime)
        : broker(broker), symbol(symbol), timeframe(timeframe), length(length), open(open), high(high), low(low),
          close(close), volume(volume), startTime(startTime) {}

    any visitNumber(ExprParser::NumberContext *ctx) override;
    any visitFloat(ExprParser::FloatContext *ctx) override;
    any visitInt(ExprParser::IntContext *ctx) override;
    any visitNegative(ExprParser::NegativeContext *ctx) override;
    any visitPositive(ExprParser::PositiveContext *ctx) override;
    any visitMulDiv(ExprParser::MulDivContext *ctx) override;
    any visitAddSub(ExprParser::AddSubContext *ctx) override;
    any visitComparison(ExprParser::ComparisonContext *ctx) override;
    any visitParens(ExprParser::ParensContext *ctx) override;
    any visitABS(ExprParser::ABSContext *ctx) override;
    any visitMIN(ExprParser::MINContext *ctx) override;
    any visitMAX(ExprParser::MAXContext *ctx) override;

    any visitOpen(ExprParser::OpenContext *ctx) override;
    any visitHigh(ExprParser::HighContext *ctx) override;
    any visitLow(ExprParser::LowContext *ctx) override;
    any visitClose(ExprParser::CloseContext *ctx) override;
    any visitVolume(ExprParser::VolumeContext *ctx) override;

    any visitChange(ExprParser::ChangeContext *context) override;
    any visitChangeP(ExprParser::ChangePContext *context) override;
    any visitAmpl(ExprParser::AmplContext *ctx) override;
    any visitAmplP(ExprParser::AmplPContext *ctx) override;
    any visitUpper_shadow(ExprParser::Upper_shadowContext *ctx) override;
    any visitUpper_shadowP(ExprParser::Upper_shadowPContext *ctx) override;
    any visitLower_shadow(ExprParser::Lower_shadowContext *ctx) override;
    any visitLower_shadowP(ExprParser::Lower_shadowPContext *ctx) override;

    // indicator
    any visitRsi(ExprParser::RsiContext *ctx) override;
    any visitRsi_slope(ExprParser::Rsi_slopeContext *ctx) override;
    any visitMa(ExprParser::MaContext *ctx) override;
    any visitEma(ExprParser::EmaContext *ctx) override;
    any visitMacd_value(ExprParser::Macd_valueContext *ctx) override;
    any visitMacd_signal(ExprParser::Macd_signalContext *ctx) override;
    any visitMacd_histogram(ExprParser::Macd_histogramContext *ctx) override;
    any visitBb_upper(ExprParser::Bb_upperContext *ctx) override;
    any visitBb_middle(ExprParser::Bb_middleContext *ctx) override;
    any visitBb_lower(ExprParser::Bb_lowerContext *ctx) override;
    any visitMacd_n_dinh(ExprParser::Macd_n_dinhContext *ctx) override;
    any visitMacd_slope(ExprParser::Macd_slopeContext *ctx) override;

    // avg min max
    any visitAvg_open(ExprParser::Avg_openContext *ctx) override;
    any visitAvg_high(ExprParser::Avg_highContext *ctx) override;
    any visitAvg_low(ExprParser::Avg_lowContext *ctx) override;
    any visitAvg_close(ExprParser::Avg_closeContext *ctx) override;
    any visitAvg_ampl(ExprParser::Avg_amplContext *ctx) override;
    any visitAvg_amplP(ExprParser::Avg_amplPContext *ctx) override;
    //avg_change 
    //avg_changeP

    any visitMin_open(ExprParser::Min_openContext *ctx) override;
    any visitMin_high(ExprParser::Min_highContext *ctx) override;
    any visitMin_low(ExprParser::Min_lowContext *ctx) override;
    any visitMin_close(ExprParser::Min_closeContext *ctx) override;
    any visitMin_change(ExprParser::Min_changeContext *ctx) override;
    any visitMin_changeP(ExprParser::Min_changePContext *ctx) override;
    any visitMin_ampl(ExprParser::Min_amplContext *ctx) override;
    any visitMin_amplP(ExprParser::Min_amplPContext *ctx) override;

    any visitMax_open(ExprParser::Max_openContext *ctx) override;
    any visitMax_high(ExprParser::Max_highContext *ctx) override;
    any visitMax_low(ExprParser::Max_lowContext *ctx) override;
    any visitMax_close(ExprParser::Max_closeContext *ctx) override;
    any visitMax_change(ExprParser::Max_changeContext *ctx) override;
    any visitMax_changeP(ExprParser::Max_changePContext *ctx) override;
    any visitMax_ampl(ExprParser::Max_amplContext *ctx) override;
    any visitMax_amplP(ExprParser::Max_amplPContext *ctx) override;

    any visitMin_rsi(ExprParser::Min_rsiContext *ctx) override;
    any visitMax_rsi(ExprParser::Max_rsiContext *ctx) override;
    any visitMarsi(ExprParser::MarsiContext *ctx) override;

    // candlestick
    // any visitBullish_engulfing(ExprParser::Bullish_engulfingContext *ctx) override;
    // any visitBearish_engulfing(ExprParser::Bearish_engulfingContext *ctx) override;
    // any visitBullish_hammer(ExprParser::Bullish_hammerContext *ctx) override;
    // any visitBearish_hammer(ExprParser::Bearish_hammerContext *ctx) override;
    // any visitBullish(ExprParser::BullishContext *ctx) override;
    // any visitBearish(ExprParser::BearishContext *ctx) override;
    // any visitBull_bear_list(ExprParser::Bull_bear_listContext *ctx) override;
    // any visitDoji(ExprParser::DojiContext *ctx) override;

    // any visitIHour(ExprParser::IHourContext *ctx) override;
    // any visitString(ExprParser::StringContext *ctx) override;
    // any visitISymbol(ExprParser::ISymbolContext *ctx) override;
    // any visitIBullBearList(ExprParser::IBullBearListContext *ctx) override;
    // any visitIMinute(ExprParser::IMinuteContext *ctx) override;
    // any visitIBroker(ExprParser::IBrokerContext *ctx) override;
    // any visitIVolume24hInUSD(ExprParser::IVolume24hInUSDContext *ctx) override;
    // any visitITimeframe(ExprParser::ITimeframeContext *ctx) override;
    // any visitBroker(ExprParser::BrokerContext *ctx) override;
    // any visitSymbol(ExprParser::SymbolContext *ctx) override;
    // any visitTimeframe(ExprParser::TimeframeContext *ctx) override;
    // any visitHour(ExprParser::HourContext *ctx) override;
    // any visitMinute(ExprParser::MinuteContext *ctx) override;
    // any visitVolume24h_in_usd(ExprParser::Volume24h_in_usdContext *ctx) override;

    // any visitComparisonOp(ExprParser::ComparisonOpContext *ctx) override;
};

any calculateExpr(const string &broker, const string &symbol, const string &timeframe, int length,
                  const double *open, const double *high, const double *low, const double *close,
                  const double *volume, long long *startTime, const string &inputText);