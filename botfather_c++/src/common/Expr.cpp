#include "expr.h"
#include "util.h"
#include "custom_indicator.h"

any Expr::visitNumber(ExprParser::NumberContext *ctx)
{
    if (ctx->INT())
    {
        return visit(ctx->INT());
    }
    else if (ctx->FLOAT())
    {
        return visit(ctx->FLOAT());
    }
    else
    {
        return {};
    }
}

any Expr::visitFloat(ExprParser::FloatContext *ctx)
{
    return stod(ctx->FLOAT()->getText());
}

any Expr::visitInt(ExprParser::IntContext *ctx)
{
    return stod(ctx->INT()->getText());
}

any Expr::visitNegative(ExprParser::NegativeContext *ctx)
{
    auto value = visit(ctx->expr());
    double v = any_cast<double>(value);
    return -v;
}

any Expr::visitPositive(ExprParser::PositiveContext *ctx)
{
    return visit(ctx->expr());
}

any Expr::visitMulDiv(ExprParser::MulDivContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    return ctx->children[1]->getText() == "*" ? l * r : l / r;
}

any Expr::visitAddSub(ExprParser::AddSubContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    return ctx->children[1]->getText() == "+" ? l + r : l - r;
}

any Expr::visitComparison(ExprParser::ComparisonContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    string op = ctx->children[1]->getText();

    if (op == "==")
        return l == r ? 1.0 : 0.0;
    if (op == "=")
        return l == r ? 1.0 : 0.0;
    if (op == "<")
        return l < r ? 1.0 : 0.0;
    if (op == "<=")
        return l <= r ? 1.0 : 0.0;
    if (op == ">")
        return l > r ? 1.0 : 0.0;
    if (op == ">=")
        return l >= r ? 1.0 : 0.0;

    return {};
}

any Expr::visitParens(ExprParser::ParensContext *ctx)
{
    return visit(ctx->expr());
}

any Expr::visitABS(ExprParser::ABSContext *ctx)
{
    auto value = visit(ctx->expr());
    double v = any_cast<double>(value);
    return abs(v);
}

any Expr::visitMIN(ExprParser::MINContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    return l < r ? l : r;
}

any Expr::visitMAX(ExprParser::MAXContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    return l > r ? l : r;
}

any Expr::visitOpen(ExprParser::OpenContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return open[shift];
}

any Expr::visitHigh(ExprParser::HighContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return high[shift];
}

any Expr::visitLow(ExprParser::LowContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return low[shift];
}

any Expr::visitClose(ExprParser::CloseContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return close[shift];
}

any Expr::visitVolume(ExprParser::VolumeContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return volume[shift];
}

any Expr::visitChange(ExprParser::ChangeContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return close[shift] - open[shift];
}

any Expr::visitChangeP(ExprParser::ChangePContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return (close[shift] - open[shift]) / open[shift] * 100.0;
}

any Expr::visitAmpl(ExprParser::AmplContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return high[shift] - low[shift];
}

any Expr::visitAmplP(ExprParser::AmplPContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return (high[shift] - low[shift]) / open[shift] * 100.0;
}

any Expr::visitUpper_shadow(ExprParser::Upper_shadowContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return high[shift] - max(open[shift], close[shift]);
}
any Expr::visitUpper_shadowP(ExprParser::Upper_shadowPContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    double upperShadow = high[shift] - max(open[shift], close[shift]);
    return upperShadow / open[shift] * 100.0;
}

any Expr::visitLower_shadow(ExprParser::Lower_shadowContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return min(open[shift], close[shift]) - low[shift];
}

any Expr::visitLower_shadowP(ExprParser::Lower_shadowPContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? stoi(args->getText()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    double lowerShadow = min(open[shift], close[shift]) - low[shift];
    return lowerShadow / open[shift] * 100.0;
}

any Expr::visitRsi(ExprParser::RsiContext *ctx)
{
    int period = stoi(ctx->INT(0)->getText());
    int shift = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (period <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iRSI(period, close + shift, length - shift);
}

any Expr::visitRsi_slope(ExprParser::Rsi_slopeContext *ctx)
{
    int period = stoi(ctx->INT(0)->getText());
    int shift = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (period <= 0 || shift < 0 || shift >= length - period - 1)
        return {};

    return iRSI_slope(period, close + shift, length - shift);
}

any Expr::visitMa(ExprParser::MaContext *ctx)
{
    int period = stoi(ctx->INT(0)->getText());
    int shift = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (period <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iMA(period, close + shift, length - shift);
}

any Expr::visitEma(ExprParser::EmaContext *ctx)
{
    int period = stoi(ctx->INT(0)->getText());
    int shift = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (period <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iEMA(period, close + shift, length - shift);
}

any Expr::visitMacd_value(ExprParser::Macd_valueContext *ctx)
{
    int fastPeriod = stoi(ctx->INT(0)->getText());
    int slowPeriod = stoi(ctx->INT(1)->getText());
    int signalPeriod = stoi(ctx->INT(2)->getText());
    int shift = ctx->INT(3) ? stoi(ctx->INT(3)->getText()) : 0;

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod)
        return {};

    return iMACD(fastPeriod, slowPeriod, signalPeriod, close + shift, length - shift).macd;
}

any Expr::visitMacd_signal(ExprParser::Macd_signalContext *ctx)
{
    int fastPeriod = stoi(ctx->INT(0)->getText());
    int slowPeriod = stoi(ctx->INT(1)->getText());
    int signalPeriod = stoi(ctx->INT(2)->getText());
    int shift = ctx->INT(3) ? stoi(ctx->INT(3)->getText()) : 0;

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod)
        return {};

    return iMACD(fastPeriod, slowPeriod, signalPeriod, close + shift, length - shift).signal;
}

any Expr::visitMacd_histogram(ExprParser::Macd_histogramContext *ctx)
{
    int fastPeriod = stoi(ctx->INT(0)->getText());
    int slowPeriod = stoi(ctx->INT(1)->getText());
    int signalPeriod = stoi(ctx->INT(2)->getText());
    int shift = ctx->INT(3) ? stoi(ctx->INT(3)->getText()) : 0;

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod)
        return {};

    return iMACD(fastPeriod, slowPeriod, signalPeriod, close + shift, length - shift).histogram;
}

any Expr::visitBb_upper(ExprParser::Bb_upperContext *ctx)
{
    int period = stoi(ctx->INT(0)->getText());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iBB(period, stdDev, close + shift, length - shift).upper;
}

any Expr::visitBb_middle(ExprParser::Bb_middleContext *ctx)
{
    int period = stoi(ctx->INT(0)->getText());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iBB(period, stdDev, close + shift, length - shift).middle;
}

any Expr::visitBb_lower(ExprParser::Bb_lowerContext *ctx)
{
    int period = stoi(ctx->INT(0)->getText());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iBB(period, stdDev, close + shift, length - shift).lower;
}

any Expr::visitMacd_n_dinh(ExprParser::Macd_n_dinhContext *ctx) {
    int fastPeriod = stoi(ctx->INT(0)->getText());
    int slowPeriod = stoi(ctx->INT(1)->getText());
    int signalPeriod = stoi(ctx->INT(2)->getText());
    int redDepth = stoi(ctx->INT(3)->getText());
    int depth = stoi(ctx->INT(4)->getText());
    int enableDivergence = stoi(ctx->INT(5)->getText());
    double diffCandle0 = stod(ctx->number(0)->getText());
    int shift = ctx->INT(6) ? stoi(ctx->INT(6)->getText()) : 0;
    vector<double> diffPercents;
    
    for(int i=1; ctx->number(i); i++) {
        diffPercents.push_back(stod(ctx->number(i)->getText()));
    }

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || redDepth < 0 || depth < 0 || enableDivergence < 0 || diffCandle0 < 0 || shift < 0 || shift >= length - slowPeriod)
        return {};

    return macd_n_dinh(fastPeriod, slowPeriod, signalPeriod, redDepth, depth, enableDivergence, diffCandle0, diffPercents, close + shift, open + shift, high + shift, length - shift);
}

//////////////////////////////////////////////////////////////////
static std::unordered_map<std::string, CachedParseTree> parseCache;
static mutex parseCacheMutex;

CachedParseTree &getParseTree(const string &key)
{
    lock_guard<mutex> lock(parseCacheMutex);
    return parseCache[key];
}

any calculateExpr(const string &broker, const string &symbol, const string &timeframe, int length,
                  const double *open, const double *high, const double *low, const double *close,
                  const double *volume, long long *startTime, const string &inputText)
{
    const std::string key = toLowerCase(inputText);
    auto &entry = getParseTree(key);

    if (!entry.tree)
    {
        entry.input = std::make_unique<ANTLRInputStream>(key);
        entry.lexer = std::make_unique<ExprLexer>(entry.input.get());
        entry.tokens = std::make_unique<CommonTokenStream>(entry.lexer.get());
        entry.parser = std::make_unique<ExprParser>(entry.tokens.get());
        entry.tree = entry.parser->expr();
    }

    Expr expr(broker, symbol, timeframe, length, open, high, low, close, volume, startTime);

    return expr.visit(entry.tree);
}