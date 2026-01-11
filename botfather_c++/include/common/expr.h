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

enum OP_TYPE
{
    NUMBER,
    GT,
    GE,
    LT,
    LE,
    EQ,
    NEQ,
    ASSIGN,
    NEG,
    MUL,
    DIV,
    ADD,
    SUB,
    ABS,
    HOUR,
    MINUTE,
    FUNDING,
    MIN,
    MAX,
    OPEN,
    HIGH,
    LOW,
    CLOSE,
    VOLUME,
    CHANGE,
    CHANGE_P,
    AMPL,
    AMPL_P,
    UPPER_SHADOW,
    UPPER_SHADOW_P,
    LOWER_SHADOW,
    LOWER_SHADOW_P,
    RSI,
    RSI_SLOPE,
    MA,
    EMA,
    MACD_VALUE,
    MACD_SIGNAL,
    MACD_HISTOGRAM,
    BB_UPPER,
    BB_MIDDLE,
    BB_LOWER,
    MACD_N_DINH,
    MACD_SLOPE,
    AVG_OPEN,
    AVG_HIGH,
    AVG_LOW,
    AVG_CLOSE,
    AVG_AMPL,
    AVG_AMPL_P,
    MIN_OPEN,
    MIN_HIGH,
    MIN_LOW,
    MIN_CLOSE,
    MIN_CHANGE,
    MIN_CHANGE_P,
    MIN_AMPL,
    MIN_AMPL_P,
    MAX_OPEN,
    MAX_HIGH,
    MAX_LOW,
    MAX_CLOSE,
    MAX_CHANGE,
    MAX_CHANGE_P,
    MAX_AMPL,
    MAX_AMPL_P,
    MIN_RSI,
    MAX_RSI,
    AVG_RSI,
    MIN_MACD_VALUE,
    MAX_MACD_VALUE,
    AVG_MACD_VALUE,
    MIN_MACD_SIGNAL,
    MAX_MACD_SIGNAL,
    AVG_MACD_SIGNAL,
    MIN_MACD_HISTOGRAM,
    MAX_MACD_HISTOGRAM,
    AVG_MACD_HISTOGRAM,
    RANDOM,
    BULLISH_ENGULFING,
    BEARISH_ENGULFING,
    BULLISH_HAMMER,
    BEARISH_HAMMER,
    DOJI
};
struct Instr
{
    OP_TYPE type;
    double value;
};

class Expr : public ExprBaseVisitor
{
private:
    vector<Instr> *instr;

public:
    Expr(vector<Instr> *instr = NULL) : instr(instr)
    {
    }

    // any visit(antlr4::tree::ParseTree *tree) override;
    any visitNumber(ExprParser::NumberContext *ctx) override;
    any visitFloat(ExprParser::FloatContext *ctx) override;
    any visitInt(ExprParser::IntContext *ctx) override;
    any visitString(ExprParser::StringContext *ctx) override;
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

    any visitMin_macd_value(ExprParser::Min_macd_valueContext *ctx) override;
    any visitMax_macd_value(ExprParser::Max_macd_valueContext *ctx) override;
    any visitAvg_macd_value(ExprParser::Avg_macd_valueContext *ctx) override;
    any visitMax_macd_signal(ExprParser::Max_macd_signalContext *ctx) override;
    any visitMin_macd_signal(ExprParser::Min_macd_signalContext *ctx) override;
    any visitAvg_macd_signal(ExprParser::Avg_macd_signalContext *ctx) override;
    any visitMin_macd_histogram(ExprParser::Min_macd_histogramContext *ctx) override;
    any visitMax_macd_histogram(ExprParser::Max_macd_histogramContext *ctx) override;
    any visitAvg_macd_histogram(ExprParser::Avg_macd_histogramContext *ctx) override;

    any visitRandom(ExprParser::RandomContext *ctx) override;

    any visitHour(ExprParser::HourContext *ctx) override;
    any visitMinute(ExprParser::MinuteContext *ctx) override;
    any visitFunding_rate(ExprParser::Funding_rateContext *ctx) override;

    // candlestick
    any visitBullish_engulfing(ExprParser::Bullish_engulfingContext *ctx) override;
    any visitBearish_engulfing(ExprParser::Bearish_engulfingContext *ctx) override;
    any visitBullish_hammer(ExprParser::Bullish_hammerContext *ctx) override;
    any visitBearish_hammer(ExprParser::Bearish_hammerContext *ctx) override;
    any visitDoji(ExprParser::DojiContext *ctx) override;
};

double calculateExpr(const string &inputText, const string &broker, const string &symbol, const string &timeframe, int length,
                  const double *open, const double *high, const double *low, const double *close,
                  const double *volume, long long *startTime, double fundingRate, boost::unordered_flat_map<long long, vector<double>> *cachedIndicator, boost::unordered_flat_map<long long, unique_ptr<SparseTable>> *cachedMinMax, int shift);

string calculateSubExpr(string &expr, const string &broker, const string &symbol, const string &timeframe, int length,
                        const double *open, const double *high, const double *low, const double *close,
                        const double *volume, long long *startTime, double fundingRate, boost::unordered_flat_map<long long, vector<double>> *cachedIndicator, boost::unordered_flat_map<long long, unique_ptr<SparseTable>> *cachedMinMax, int shift);

void cacheInstr(const string &key);
