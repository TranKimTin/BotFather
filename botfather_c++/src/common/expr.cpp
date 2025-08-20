#include "expr.h"
#include "util.h"
#include "custom_indicator.h"
#include "timer.h"
#include "vector_pool.h"

extern thread_local VectorDoublePool vectorDoublePool;
extern thread_local SparseTablePool sparseTablePool;

static const long long ID_RSI = 1;
static const long long ID_MACD = 2;
static const long long ID_MM_OPEN = 3;
static const long long ID_MM_HIGH = 4;
static const long long ID_MM_LOW = 5;
static const long long ID_MM_CLOSE = 6;
static const long long ID_MM_RSI = 7;
static const long long ID_MM_MACD_VALUE = 8;
static const long long ID_MM_MACD_SIGNAL = 9;
static const long long ID_MM_MACD_HISTOGRAM = 10;

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
    return static_cast<double>(fast_stoi(ctx->INT()->getText().c_str()));
}

any Expr::visitString(ExprParser::StringContext *ctx)
{
    return ctx->STRING()->getText();
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

    int t = static_cast<antlr4::tree::TerminalNode *>(ctx->children[1])->getSymbol()->getType();
    return (t == ExprParser::MUL) ? l * r : l / r;
}

any Expr::visitAddSub(ExprParser::AddSubContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    if (!left.has_value() || !right.has_value())
        return {};

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    int t = static_cast<antlr4::tree::TerminalNode *>(ctx->children[1])->getSymbol()->getType();
    return (t == ExprParser::PLUS) ? l + r : l - r;
}

any Expr::visitComparison(ExprParser::ComparisonContext *ctx)
{
    auto left = visit(ctx->expr(0));
    auto right = visit(ctx->expr(1));

    if (!left.has_value() || !right.has_value())
        return {};

    double l = any_cast<double>(left);
    double r = any_cast<double>(right);

    int type = ctx->comparisonOp()->getStart()->getType();

    // comparisonOp : GT | GE | LT | LE | EQ | ASSIGN ;

    switch (type)
    {
    case ExprParser::GT:
        return l > r ? 1.0 : 0.0;
    case ExprParser::GE:
        return l >= r ? 1.0 : 0.0;
    case ExprParser::LT:
        return l < r ? 1.0 : 0.0;
    case ExprParser::LE:
        return l <= r ? 1.0 : 0.0;
    case ExprParser::EQ:
        return l == r ? 1.0 : 0.0;
    case ExprParser::ASSIGN:
        return l == r ? 1.0 : 0.0;
    default:
        return {};
    }

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
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return open[shift];
}

any Expr::visitHigh(ExprParser::HighContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return high[shift];
}

any Expr::visitLow(ExprParser::LowContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return low[shift];
}

any Expr::visitClose(ExprParser::CloseContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return close[shift];
}

any Expr::visitVolume(ExprParser::VolumeContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return volume[shift];
}

any Expr::visitChange(ExprParser::ChangeContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return close[shift] - open[shift];
}

any Expr::visitChangeP(ExprParser::ChangePContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return (close[shift] - open[shift]) / open[shift] * 100.0;
}

any Expr::visitAmpl(ExprParser::AmplContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return high[shift] - low[shift];
}

any Expr::visitAmplP(ExprParser::AmplPContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return (high[shift] - low[shift]) / open[shift] * 100.0;
}

any Expr::visitUpper_shadow(ExprParser::Upper_shadowContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return high[shift] - max(open[shift], close[shift]);
}
any Expr::visitUpper_shadowP(ExprParser::Upper_shadowPContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    double upperShadow = high[shift] - max(open[shift], close[shift]);
    return upperShadow / open[shift] * 100.0;
}

any Expr::visitLower_shadow(ExprParser::Lower_shadowContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    return min(open[shift], close[shift]) - low[shift];
}

any Expr::visitLower_shadowP(ExprParser::Lower_shadowPContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;
    if (shift < 0 || shift >= length)
        return {};

    double lowerShadow = min(open[shift], close[shift]) - low[shift];
    return lowerShadow / open[shift] * 100.0;
}

vector<double> &Expr::getRSI(int period)
{
    long long key = ID_RSI | (static_cast<long long>(period) << 10);

    auto it = cachedIndicator->find(key);
    if (it == cachedIndicator->end())
    {
        it = cachedIndicator->emplace(key, iRSI(period, close, length)).first;
    }
    return it->second;
}

any Expr::visitRsi(ExprParser::RsiContext *ctx)
{
    int period = fast_stoi(ctx->INT(0)->getText().c_str());
    int shift = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (period <= 0 || shift < 0 || shift >= length - period)
        return {};

    const vector<double> &cached = getRSI(period);

    if (shift >= cached.size())
    {
        return {};
    }

    return cached[shift];
}

any Expr::visitRsi_slope(ExprParser::Rsi_slopeContext *ctx)
{
    int period = fast_stoi(ctx->INT(0)->getText().c_str());
    int shift = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (period <= 0 || shift < 0 || shift >= length - period - 1)
        return {};

    return iRSI_slope(period, close + shift, length - shift);
}

any Expr::visitMa(ExprParser::MaContext *ctx)
{
    int period = fast_stoi(ctx->INT(0)->getText().c_str());
    int shift = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (period <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iMA(period, close + shift, length - shift);
}

any Expr::visitEma(ExprParser::EmaContext *ctx)
{
    int period = fast_stoi(ctx->INT(0)->getText().c_str());
    int shift = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (period <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iEMA(period, close + shift, length - shift);
}

vector<double> &Expr::getMACD(int fastPeriod, int slowPeriod, int signalPeriod)
{
    long long key = ID_MACD | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);

    auto it = cachedIndicator->find(key);
    if (it == cachedIndicator->end())
    {
        it = cachedIndicator->emplace(key, iMACD(fastPeriod, slowPeriod, signalPeriod, close, length)).first;
    }
    return it->second;
}
any Expr::visitMacd_value(ExprParser::Macd_valueContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int shift = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod)
        return {};

    const vector<double> &cached = getMACD(fastPeriod, slowPeriod, signalPeriod);

    if (shift * 3 >= cached.size())
    {
        return {};
    }
    return cached[shift * 3];
}

any Expr::visitMacd_signal(ExprParser::Macd_signalContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int shift = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod)
        return {};

    const vector<double> &cached = getMACD(fastPeriod, slowPeriod, signalPeriod);

    if (shift * 3 + 1 >= cached.size())
    {
        return {};
    }
    return cached[shift * 3 + 1];
}

any Expr::visitMacd_histogram(ExprParser::Macd_histogramContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int shift = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;

    const vector<double> &cached = getMACD(fastPeriod, slowPeriod, signalPeriod);

    if (shift * 3 + 2 >= cached.size())
    {
        return {};
    }
    return cached[shift * 3 + 2];
}

any Expr::visitBb_upper(ExprParser::Bb_upperContext *ctx)
{
    int period = fast_stoi(ctx->INT(0)->getText().c_str());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iBB(period, stdDev, close + shift, length - shift).upper;
}

any Expr::visitBb_middle(ExprParser::Bb_middleContext *ctx)
{
    int period = fast_stoi(ctx->INT(0)->getText().c_str());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iBB(period, stdDev, close + shift, length - shift).middle;
}

any Expr::visitBb_lower(ExprParser::Bb_lowerContext *ctx)
{
    int period = fast_stoi(ctx->INT(0)->getText().c_str());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
        return {};

    return iBB(period, stdDev, close + shift, length - shift).lower;
}

any Expr::visitMacd_n_dinh(ExprParser::Macd_n_dinhContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int redDepth = fast_stoi(ctx->INT(3)->getText().c_str());
    int depth = fast_stoi(ctx->INT(4)->getText().c_str());
    int enableDivergence = fast_stoi(ctx->INT(5)->getText().c_str());
    double diffCandle0 = stod(ctx->number(0)->getText());
    int shift = ctx->INT(6) ? fast_stoi(ctx->INT(6)->getText().c_str()) : 0;
    vector<double> diffPercents = vectorDoublePool.acquire();

    for (int i = 1; ctx->number(i); i++)
    {
        diffPercents.push_back(stod(ctx->number(i)->getText()));
    }

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || redDepth < 0 || depth < 0 || enableDivergence < 0 || diffCandle0 < 0 || shift < 0 || shift >= length - slowPeriod)
        return {};

    vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod);
    int result = macd_n_dinh(fastPeriod, slowPeriod, signalPeriod, redDepth, depth, enableDivergence, diffCandle0, diffPercents, close + shift, open + shift, high + shift, length - shift, cachedMACD);

    vectorDoublePool.release(diffPercents);
    return static_cast<double>(result);
}

any Expr::visitMacd_slope(ExprParser::Macd_slopeContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int shift = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod - 1)
        return {};

    return macd_slope(fastPeriod, slowPeriod, signalPeriod, close + shift, length - shift);
}

any Expr::visitAvg_open(ExprParser::Avg_openContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, open + from, length - from);
}

any Expr::visitAvg_high(ExprParser::Avg_highContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, high + from, length - from);
}

any Expr::visitAvg_low(ExprParser::Avg_lowContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, low + from, length - from);
}

any Expr::visitAvg_close(ExprParser::Avg_closeContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    int period = to - from + 1;

    return iAvg(period, close + from, length - from);
}

any Expr::visitAvg_ampl(ExprParser::Avg_amplContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    long long key = ID_MM_OPEN;

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(open, length);

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_min(from, to);
}

any Expr::visitMin_high(ExprParser::Min_highContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    long long key = ID_MM_HIGH;

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(high, length);

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_min(from, to);
}
any Expr::visitMin_low(ExprParser::Min_lowContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    long long key = ID_MM_LOW;

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(low, length);

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_min(from, to);
}
any Expr::visitMin_close(ExprParser::Min_closeContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    long long key = ID_MM_CLOSE;

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(close, length);

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_min(from, to);
}

any Expr::visitMin_change(ExprParser::Min_changeContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    long long key = ID_MM_OPEN;

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(open, length);

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_max(from, to);
}

any Expr::visitMax_high(ExprParser::Max_highContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    long long key = ID_MM_HIGH;

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(high, length);

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_max(from, to);
}

any Expr::visitMax_low(ExprParser::Max_lowContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    long long key = ID_MM_LOW;

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(low, length);

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_max(from, to);
}

any Expr::visitMax_close(ExprParser::Max_closeContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (from < 0 || to >= length)
        return {};

    long long key = ID_MM_CLOSE;

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(close, length);

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_max(from, to);
}
any Expr::visitMax_change(ExprParser::Max_changeContext *ctx)
{
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int from = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 0;
    int to = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;

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
    int period = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 14;
    int from = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;
    int to = ctx->INT(2) ? fast_stoi(ctx->INT(2)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (period <= 0 || from < 0 || to >= length - period)
        return {};

    vector<double> &cachedRSI = getRSI(period);
    if (from >= cachedRSI.size() || to >= cachedRSI.size())
    {
        return {};
    }

    long long key = ID_MM_RSI | (static_cast<long long>(period) << 10);

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(cachedRSI.data(), cachedRSI.size());

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_min(from, to);
}

any Expr::visitMax_rsi(ExprParser::Max_rsiContext *ctx)
{
    int period = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 14;
    int from = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;
    int to = ctx->INT(2) ? fast_stoi(ctx->INT(2)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (period <= 0 || from < 0 || to >= length - period)
        return {};

    vector<double> &cachedRSI = getRSI(period);
    if (from >= cachedRSI.size() || to >= cachedRSI.size())
    {
        return {};
    }

    long long key = ID_MM_RSI | (static_cast<long long>(period) << 10);

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        auto st = sparseTablePool.acquire();
        st->init(cachedRSI.data(), cachedRSI.size());

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_max(from, to);
}

any Expr::visitMarsi(ExprParser::MarsiContext *ctx)
{
    int period = ctx->INT(0) ? fast_stoi(ctx->INT(0)->getText().c_str()) : 14;
    int from = ctx->INT(1) ? fast_stoi(ctx->INT(1)->getText().c_str()) : 0;
    int to = ctx->INT(2) ? fast_stoi(ctx->INT(2)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (period <= 0 || from < 0 || to >= length - period)
        return {};

    int k = to - from + 1;
    return iAvgRSI(period, k, close + from, length - from);
}

any Expr::visitMin_macd_value(ExprParser::Min_macd_valueContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod);

    if (from * 3 >= cachedMACD.size() || to * 3 >= cachedMACD.size())
    {
        return {};
    }

    long long key = ID_MM_MACD_VALUE | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        vector<double> v(cachedMACD.size() / 3);
        for (int i = 0; i < v.size(); ++i)
        {
            v[i] = cachedMACD[i * 3];
        }

        auto st = sparseTablePool.acquire();
        st->init(v.data(), v.size());

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_min(from, to);
}

any Expr::visitMax_macd_value(ExprParser::Max_macd_valueContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod);
    if (from * 3 >= cachedMACD.size() || to * 3 >= cachedMACD.size())
    {
        return {};
    }
    long long key = ID_MM_MACD_VALUE | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        vector<double> v(cachedMACD.size() / 3);
        for (int i = 0; i < v.size(); ++i)
        {
            v[i] = cachedMACD[i * 3];
        }
        auto st = sparseTablePool.acquire();
        st->init(v.data(), v.size());

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_max(from, to);
}
any Expr::visitAvg_macd_value(ExprParser::Avg_macd_valueContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    int k = to - from + 1;
    return iAvgMACD(fastPeriod, slowPeriod, signalPeriod, k, close + from, length - from, [](MACD_Output output)
                    { return output.macd; });
}

any Expr::visitMax_macd_signal(ExprParser::Max_macd_signalContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod);
    if (from * 3 + 1 >= cachedMACD.size() || to * 3 + 1 >= cachedMACD.size())
    {
        return {};
    }
    long long key = ID_MM_MACD_SIGNAL | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        vector<double> v(cachedMACD.size() / 3);
        for (int i = 0; i < v.size(); ++i)
        {
            v[i] = cachedMACD[i * 3 + 1];
        }
        auto st = sparseTablePool.acquire();
        st->init(v.data(), v.size());

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_max(from, to);
}
any Expr::visitMin_macd_signal(ExprParser::Min_macd_signalContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod);
    if (from * 3 + 1 >= cachedMACD.size() || to * 3 + 1 >= cachedMACD.size())
    {
        return {};
    }
    long long key = ID_MM_MACD_SIGNAL | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        vector<double> v(cachedMACD.size() / 3);
        for (int i = 0; i < v.size(); ++i)
        {
            v[i] = cachedMACD[i * 3 + 1];
        }
        auto st = sparseTablePool.acquire();
        st->init(v.data(), v.size());

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_min(from, to);
}
any Expr::visitAvg_macd_signal(ExprParser::Avg_macd_signalContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    int k = to - from + 1;
    return iAvgMACD(fastPeriod, slowPeriod, signalPeriod, k, close + from, length - from, [](MACD_Output output)
                    { return output.signal; });
}
any Expr::visitMin_macd_histogram(ExprParser::Min_macd_histogramContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod);
    if (from * 3 + 2 >= cachedMACD.size() || to * 3 + 2 >= cachedMACD.size())
    {
        return {};
    }
    long long key = ID_MM_MACD_HISTOGRAM | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        vector<double> v(cachedMACD.size() / 3);
        for (int i = 0; i < v.size(); ++i)
        {
            v[i] = cachedMACD[i * 3 + 2];
        }
        auto st = sparseTablePool.acquire();
        st->init(v.data(), v.size());

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_min(from, to);
}
any Expr::visitMax_macd_histogram(ExprParser::Max_macd_histogramContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod);
    if (from * 3 + 2 >= cachedMACD.size() || to * 3 + 2 >= cachedMACD.size())
    {
        return {};
    }
    long long key = ID_MM_MACD_HISTOGRAM | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);

    auto it = cachedMinMax->find(key);
    if (it == cachedMinMax->end())
    {
        vector<double> v(cachedMACD.size() / 3);
        for (int i = 0; i < v.size(); ++i)
        {
            v[i] = cachedMACD[i * 3 + 2];
        }
        auto st = sparseTablePool.acquire();
        st->init(v.data(), v.size());

        it = cachedMinMax->emplace(key, move(st)).first;
    }
    return it->second->query_max(from, to);
}

any Expr::visitAvg_macd_histogram(ExprParser::Avg_macd_histogramContext *ctx)
{
    int fastPeriod = fast_stoi(ctx->INT(0)->getText().c_str());
    int slowPeriod = fast_stoi(ctx->INT(1)->getText().c_str());
    int signalPeriod = fast_stoi(ctx->INT(2)->getText().c_str());
    int from = ctx->INT(3) ? fast_stoi(ctx->INT(3)->getText().c_str()) : 0;
    int to = ctx->INT(4) ? fast_stoi(ctx->INT(4)->getText().c_str()) : 0;

    if (to < from)
        swap(from, to);

    if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
        return {};

    int k = to - from + 1;
    return iAvgMACD(fastPeriod, slowPeriod, signalPeriod, k, close + from, length - from, [](MACD_Output output)
                    { return output.histogram; });
}

any Expr::visitHour(ExprParser::HourContext *ctx)
{
    long long timestamp_ms = startTime[0];
    long long seconds = timestamp_ms / 1000;
    long long seconds_in_day = seconds % 86400;

    int hour = seconds_in_day / 3600;

    return hour;
}

any Expr::visitMinute(ExprParser::MinuteContext *ctx)
{
    long long timestamp_ms = startTime[0];
    long long seconds = timestamp_ms / 1000;
    long long seconds_in_day = seconds % 86400;

    int hour = seconds_in_day / 3600;
    int minute = (seconds_in_day % 3600) / 60;

    return minute;
}

any Expr::visitFunding_rate(ExprParser::Funding_rateContext *ctx)
{
    return fundingRate;
}

any Expr::visitBullish_engulfing(ExprParser::Bullish_engulfingContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;

    if (shift + 1 >= length)
    {
        return {};
    }

    // Nến trước phải là nến đỏ (giảm)
    if (close[shift + 1] >= open[shift + 1])
        return 0.0;

    // Nến hiện tại phải là nến xanh (tăng)
    if (close[shift] <= open[shift])
        return 0.0;

    // Thân nến hiện tại phải bao trùm thân nến trước
    return (open[shift] < close[shift + 1] && close[shift] > open[shift + 1]) ? 1.0 : 0.0;
}
any Expr::visitBearish_engulfing(ExprParser::Bearish_engulfingContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;

    if (shift + 1 >= length)
    {
        return {};
    }

    // Nến trước phải là nến xanh (tăng)
    if (close[shift + 1] <= open[shift + 1])
        return 0.0;

    // Nến hiện tại phải là nến đỏ (giảm)
    if (close[shift] >= open[shift])
        return 0.0;

    // Thân nến hiện tại phải bao trùm thân nến trước
    return (open[shift] > close[shift + 1] && close[shift] < open[shift + 1]) ? 1.0 : 0.0;
}

any Expr::visitBullish_hammer(ExprParser::Bullish_hammerContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;

    if (shift >= length)
        return {};

    double o = open[shift], c = close[shift], h = high[shift], l = low[shift];

    // phải xuất hiện ở cuối xu hướng giảm (đáy của 10 nến gần nhất)
    double minLow = iMin(10, low + shift, length - shift);
    if (l > minLow)
        return {};

    double body = abs(c - o);
    double lowerWick = min(o, c) - l;
    double upperWick = h - max(o, c);

    // Tránh chia cho 0
    if (body == 0)
        body = 0.0001;

    // bóng dưới ≥ 2 * thân và bóng trên nhỏ
    return (lowerWick >= 2 * body && upperWick <= body) ? 1.0 : 0.0;
}

any Expr::visitBearish_hammer(ExprParser::Bearish_hammerContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;

    if (shift >= length)
        return {};

    double o = open[shift], c = close[shift], h = high[shift], l = low[shift];

    // phải xuất hiện ở cuối xu hướng tăng (đỉnh của 10 nến gần nhất)
    double maxHigh = iMax(10, high + shift, length - shift);
    if (h < maxHigh)
        return {};

    double body = abs(c - o);
    double lowerWick = min(o, c) - l;
    double upperWick = h - max(o, c);

    // Tránh chia cho 0
    if (body == 0)
        body = 0.0001;

    // bóng dưới ≥ 2 * thân và bóng trên nhỏ
    return (lowerWick >= 2 * body && upperWick <= body) ? 1.0 : 0.0;
}

any Expr::visitDoji(ExprParser::DojiContext *ctx)
{
    auto args = ctx->INT();
    int shift = args ? fast_stoi(args->getText().c_str()) : 0;

    if (shift >= length)
        return {};

    double o = open[shift], c = close[shift], h = high[shift], l = low[shift];
    double range = h - l;
    double body = abs(c - o);

    // tránh chia 0 nếu range quá nhỏ
    if (range == 0)
        return 0.0;

    // thân nhỏ hơn 10% tổng chiều dài nến => doji
    return (body / range <= 0.1) ? 1.0 : 0.0;
}

//////////////////////////////////////////////////////////////////
static unordered_map<long long, cachedIndicatorParseTree> parseCache;

void cacheParseTree(const string &expr)
{
    long long key = hashString(expr);
    auto it = parseCache.find(key);
    if (it != parseCache.end() && it->second.tree)
        return;

    auto &entry = parseCache[key];
    if (!entry.tree)
    {
        entry.input = make_unique<ANTLRInputStream>(expr);
        entry.lexer = make_unique<ExprLexer>(entry.input.get());
        entry.tokens = make_unique<CommonTokenStream>(entry.lexer.get());
        entry.parser = make_unique<ExprParser>(entry.tokens.get());
        entry.tree = entry.parser->expr();
    }
}

any calculateExpr(const string &inputText, const string &broker, const string &symbol, const string &timeframe, int length,
                  const double *open, const double *high, const double *low, const double *close,
                  const double *volume, long long *startTime, double fundingRate, unordered_map<long long, vector<double>> *cachedIndicator, unordered_map<long long, unique_ptr<SparseTable>> *cachedMinMax)
{
    const string text = toLowerCase(inputText);
    const long long key = hashString(text);
    Expr expr(broker, symbol, timeframe, length, open, high, low, close, volume, startTime, fundingRate, cachedIndicator, cachedMinMax);

    auto it = parseCache.find(key);
    if (it != parseCache.end() && it->second.tree)
    {
        return expr.visit(it->second.tree);
    }
    else
    {
        ANTLRInputStream input(text);
        ExprLexer lexer(&input);
        CommonTokenStream tokens(&lexer);
        ExprParser parser(&tokens);
        antlr4::tree::ParseTree *tree = parser.expr();
        return expr.visit(tree);
    }
}

string calculateSubExpr(string &expr, const string &broker, const string &symbol, const string &timeframe, int length,
                        const double *open, const double *high, const double *low, const double *close,
                        const double *volume, long long *startTime, double fundingRate, unordered_map<long long, vector<double>> *cachedIndicator, unordered_map<long long, unique_ptr<SparseTable>> *cachedMinMax)
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
                LOGE("Invalid expr {}", expr);
                return "";
            }
            string lastS = st.top();
            st.pop();
            any result = calculateExpr(s, broker, symbol, timeframe, length, open, high, low, close, volume, startTime, fundingRate, cachedIndicator, cachedMinMax);
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
                LOGE("Invalid result type {} for expr {}", result.type().name(), expr);
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
        LOGE("Invalid expr {}", expr);
        return "";
    }
    return (st.size() == 0 ? "" : st.top()) + s;
}