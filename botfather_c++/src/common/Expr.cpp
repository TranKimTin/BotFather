#include "expr.h"
#include "util.h"
#include "custom_indicator.h"
#include "Timer.h"

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

    if (!value.has_value())
        return {};

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

    if (!left.has_value() || !right.has_value())
        return {};

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    return ctx->children[1]->getText() == "*" ? l * r : l / r;
}

any Expr::visitAddSub(ExprParser::AddSubContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    if (!left.has_value() || !right.has_value())
        return {};

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    return ctx->children[1]->getText() == "+" ? l + r : l - r;
}

any Expr::visitComparison(ExprParser::ComparisonContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    if (!left.has_value() || !right.has_value())
        return {};

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    string op = ctx->comparisonOp()->getText();

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

any Expr::visitMacd_n_dinh(ExprParser::Macd_n_dinhContext *ctx)
{
    int fastPeriod = stoi(ctx->INT(0)->getText());
    int slowPeriod = stoi(ctx->INT(1)->getText());
    int signalPeriod = stoi(ctx->INT(2)->getText());
    int redDepth = stoi(ctx->INT(3)->getText());
    int depth = stoi(ctx->INT(4)->getText());
    int enableDivergence = stoi(ctx->INT(5)->getText());
    double diffCandle0 = stod(ctx->number(0)->getText());
    int shift = ctx->INT(6) ? stoi(ctx->INT(6)->getText()) : 0;
    vector<double> diffPercents;

    for (int i = 1; ctx->number(i); i++)
    {
        diffPercents.push_back(stod(ctx->number(i)->getText()));
    }

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || redDepth < 0 || depth < 0 || enableDivergence < 0 || diffCandle0 < 0 || shift < 0 || shift >= length - slowPeriod)
        return {};

    int result = macd_n_dinh(fastPeriod, slowPeriod, signalPeriod, redDepth, depth, enableDivergence, diffCandle0, diffPercents, close + shift, open + shift, high + shift, length - shift);
    return (double)result;
}

any Expr::visitMacd_slope(ExprParser::Macd_slopeContext *ctx)
{
    int fastPeriod = stoi(ctx->INT(0)->getText());
    int slowPeriod = stoi(ctx->INT(1)->getText());
    int signalPeriod = stoi(ctx->INT(2)->getText());
    int shift = ctx->INT(3) ? stoi(ctx->INT(3)->getText()) : 0;

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod - 1)
        return {};

    return macd_slope(fastPeriod, slowPeriod, signalPeriod, close + shift, length - shift);
}

any Expr::visitAvg_open(ExprParser::Avg_openContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, open + from, length - from);
}

any Expr::visitAvg_high(ExprParser::Avg_highContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, high + from, length - from);
}

any Expr::visitAvg_low(ExprParser::Avg_lowContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, low + from, length - from);
}

any Expr::visitAvg_close(ExprParser::Avg_closeContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, close + from, length - from);
}

any Expr::visitAvg_ampl(ExprParser::Avg_amplContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, length - from, [this, from](int i)
                { return this->high[from + i] - this->low[from + i]; });
}

any Expr::visitAvg_amplP(ExprParser::Avg_amplPContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, length - from, [this, from](int i)
                { return (this->high[from + i] - this->low[from + i]) / this->open[from + i] * 100.0; });
}

any Expr::visitMin_open(ExprParser::Min_openContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMin(period, open + from, length - from);
}

any Expr::visitMin_high(ExprParser::Min_highContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMin(period, high + from, length - from);
}
any Expr::visitMin_low(ExprParser::Min_lowContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMin(period, low + from, length - from);
}
any Expr::visitMin_close(ExprParser::Min_closeContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMin(period, close + from, length - from);
}

any Expr::visitMin_change(ExprParser::Min_changeContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMin(period, length - from, [this, from](int i)
                { return this->close[from + i] - this->open[from + i]; });
}

any Expr::visitMin_changeP(ExprParser::Min_changePContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMin(period, length - from, [this, from](int i)
                { return (this->close[from + i] - this->open[from + i]) / this->open[from + i] * 100.0; });
}

any Expr::visitMin_ampl(ExprParser::Min_amplContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMin(period, length - from, [this, from](int i)
                { return this->high[from + i] - this->low[from + i]; });
}
any Expr::visitMin_amplP(ExprParser::Min_amplPContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMin(period, length - from, [this, from](int i)
                { return (this->high[from + i] - this->low[from + i]) / this->open[from + i] * 100.0; });
}

any Expr::visitMax_open(ExprParser::Max_openContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMax(period, open + from, length - from);
}

any Expr::visitMax_high(ExprParser::Max_highContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMax(period, high + from, length - from);
}

any Expr::visitMax_low(ExprParser::Max_lowContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMax(period, low + from, length - from);
}

any Expr::visitMax_close(ExprParser::Max_closeContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMax(period, close + from, length - from);
}
any Expr::visitMax_change(ExprParser::Max_changeContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMax(period, length - from, [this, from](int i)
                { return this->close[from + i] - this->open[from + i]; });
}

any Expr::visitMax_changeP(ExprParser::Max_changePContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMax(period, length - from, [this, from](int i)
                { return (this->close[from + i] - this->open[from + i]) / this->open[from + i] * 100.0; });
}

any Expr::visitMax_ampl(ExprParser::Max_amplContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMax(period, length - from, [this, from](int i)
                { return this->high[from + i] - this->low[from + i]; });
}

any Expr::visitMax_amplP(ExprParser::Max_amplPContext *ctx)
{
    int from = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 0;
    int to = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iMax(period, length - from, [this, from](int i)
                { return (this->high[from + i] - this->low[from + i]) / this->open[from + i] * 100.0; });
}

any Expr::visitMin_rsi(ExprParser::Min_rsiContext *ctx)
{
    int period = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 14;
    int from = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;
    int to = ctx->INT(2) ? stoi(ctx->INT(2)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (period <= 0 || from < 0 || to >= length - period)
        return {};

    int k = to - from + 1;
    return iMinRSI(period, k, close + from, length - from);
}

any Expr::visitMax_rsi(ExprParser::Max_rsiContext *ctx)
{
    int period = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 14;
    int from = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;
    int to = ctx->INT(2) ? stoi(ctx->INT(2)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (period <= 0 || from < 0 || to >= length - period)
        return {};

    int k = to - from + 1;
    return iMaxRSI(period, k, close + from, length - from);
}

any Expr::visitMarsi(ExprParser::MarsiContext *ctx)
{
    int period = ctx->INT(0) ? stoi(ctx->INT(0)->getText()) : 14;
    int from = ctx->INT(1) ? stoi(ctx->INT(1)->getText()) : 0;
    int to = ctx->INT(2) ? stoi(ctx->INT(2)->getText()) : 0;

    if (to < from)
        swap(from, to);

    if (period <= 0 || from < 0 || to >= length - period)
        return {};

    int k = to - from + 1;
    return iAvgRSI(period, k, close + from, length - from);
}

//////////////////////////////////////////////////////////////////
static std::unordered_map<std::string, CachedParseTree> parseCache;
static mutex parseCacheMutex;

CachedParseTree &getParseTree(const string &key)
{
    lock_guard<mutex> lock(parseCacheMutex);
    auto &entry = parseCache[key];
    if (!entry.tree)
    {
        entry.input = std::make_unique<ANTLRInputStream>(key);
        entry.lexer = std::make_unique<ExprLexer>(entry.input.get());
        entry.tokens = std::make_unique<CommonTokenStream>(entry.lexer.get());
        entry.parser = std::make_unique<ExprParser>(entry.tokens.get());
        entry.tree = entry.parser->expr();
    }
    return entry;
}

any calculateExpr(const string &inputText, const string &broker, const string &symbol, const string &timeframe, int length,
                  const double *open, const double *high, const double *low, const double *close,
                  const double *volume, long long *startTime)
{
    const std::string key = toLowerCase(inputText);
    auto &entry = getParseTree(key);

    Expr expr(broker, symbol, timeframe, length, open, high, low, close, volume, startTime);

    return expr.visit(entry.tree);
}

string calculateSubExpr(string expr, const string &broker, const string &symbol, const string &timeframe, int length,
                        const double *open, const double *high, const double *low, const double *close,
                        const double *volume, long long *startTime)
{
    stack<string> st;
    string s;
    for (char i : expr)
    {
        if (i == '{')
        {
            st.push(s);
            s = "";
        }
        else if (i == '}')
        {
            if (st.size() == 0 || s == "")
            {
                LOGE("Invalid expr %s", expr.c_str());
                return "";
            }
            string lastS = st.top();
            st.pop();
            any result = calculateExpr(s, broker, symbol, timeframe, length, open, high, low, close, volume, startTime);
            s = lastS + " ";
            if (result.type() == typeid(double))
            {
                s += to_string(any_cast<double>(result));
            }
            else if (result.type() == typeid(int))
            {
                s += to_string(any_cast<int>(result));
            }
            else if (result.type() == typeid(string))
            {
                s += any_cast<string>(result);
            }
            else
            {
                LOGE("Invalid result type %s for expr %s", result.type().name(), expr.c_str());
                return "";
            }
        }
        else
        {
            s.push_back(i);
        }
    }
    if (st.size() > 1)
    {
        LOGE("Invalid expr %s", expr.c_str());
        return "";
    }
    return (st.size() == 0 ? "" : st.top()) + s;
}