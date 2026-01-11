#include "expr.h"
#include "util.h"
#include "custom_indicator.h"
#include "timer.h"
#include "vector_pool.h"

#define EMIT_NUMBER(v) instr->push_back({OP_TYPE::NUMBER, static_cast<double>(v)})
#define EMIT_OP(op) instr->push_back({OP_TYPE::op, 0.0})
#define POP_DOUBLE() st[--sp]
#define POP_INT() static_cast<int>(st[--sp])
#define PUSH(v) st[sp++] = static_cast<double>(v)

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
static const long long ID_MM_CHANGE = 11;
static const long long ID_MM_CHANGE_P = 12;
static const long long ID_MM_AMPL = 13;
static const long long ID_MM_AMPL_P = 14;
static const long long ID_AVG_OPEN = 15;
static const long long ID_AVG_HIGH = 16;
static const long long ID_AVG_LOW = 17;
static const long long ID_AVG_CLOSE = 18;
static const long long ID_AVG_AMPL = 19;
static const long long ID_AVG_AMPL_P = 20;
static const long long ID_AVG_RSI = 20;
static const long long ID_AVG_MACD_VALUE = 21;
static const long long ID_AVG_MACD_SIGNAL = 22;
static const long long ID_AVG_MACD_HISTOGRAM = 23;

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
    EMIT_NUMBER(stod(static_cast<antlr4::tree::TerminalNode *>(ctx->children[0])->getSymbol()->getText()));
    return {};
}

any Expr::visitInt(ExprParser::IntContext *ctx)
{
    EMIT_NUMBER(static_cast<double>(stoll(static_cast<antlr4::tree::TerminalNode *>(ctx->children[0])->getSymbol()->getText())));
    return {};
}

any Expr::visitString(ExprParser::StringContext *ctx)
{
    return ctx->STRING()->getText();
}

any Expr::visitNegative(ExprParser::NegativeContext *ctx)
{
    auto value = visit(ctx->expr());
    EMIT_OP(NEG);
    return {};
}

any Expr::visitPositive(ExprParser::PositiveContext *ctx)
{
    return visit(ctx->expr());
}

any Expr::visitMulDiv(ExprParser::MulDivContext *ctx)
{
    visit(ctx->expr(0));
    visit(ctx->expr(1));
    int t = static_cast<antlr4::tree::TerminalNode *>(ctx->children[1])->getSymbol()->getType();
    if (t == ExprParser::MUL)
    {
        EMIT_OP(MUL);
    }
    else
    {
        EMIT_OP(DIV);
    }
    return {};
}

any Expr::visitAddSub(ExprParser::AddSubContext *ctx)
{
    visit(ctx->expr(0));
    visit(ctx->expr(1));
    int t = static_cast<antlr4::tree::TerminalNode *>(ctx->children[1])->getSymbol()->getType();
    if (t == ExprParser::PLUS)
    {
        EMIT_OP(ADD);
    }
    else
    {
        EMIT_OP(SUB);
    }
    return {};
}

any Expr::visitComparison(ExprParser::ComparisonContext *ctx)
{
    visit(ctx->expr(0));
    visit(ctx->expr(1));

    int type = ctx->comparisonOp()->getStart()->getType();

    // comparisonOp : GT | GE | LT | LE | EQ | NEQ | ASSIGN ;

    switch (type)
    {
    case ExprParser::GT:
        EMIT_OP(GT);
        break;
    case ExprParser::GE:
        EMIT_OP(GE);
        break;
    case ExprParser::LT:
        EMIT_OP(LT);
        break;
    case ExprParser::LE:
        EMIT_OP(LE);
        break;
    case ExprParser::EQ:
        EMIT_OP(EQ);
        break;
    case ExprParser::NEQ:
        EMIT_OP(NEQ);
        break;
    case ExprParser::ASSIGN:
        EMIT_OP(ASSIGN);
        break;
    }

    return {};
}

any Expr::visitParens(ExprParser::ParensContext *ctx)
{
    return visit(ctx->expr());
}

any Expr::visitABS(ExprParser::ABSContext *ctx)
{
    visit(ctx->expr());
    EMIT_OP(ABS);
    return {};
}

any Expr::visitMIN(ExprParser::MINContext *ctx)
{
    int size = 0;
    for (int i = 0; ctx->expr(i); i++)
    {
        visit(ctx->expr(i));
        size++;
    }
    EMIT_NUMBER(size);
    EMIT_OP(MIN);
    return {};
}

any Expr::visitMAX(ExprParser::MAXContext *ctx)
{
    int size = 0;
    for (int i = 0; ctx->expr(i); i++)
    {
        visit(ctx->expr(i));
        size++;
    }
    EMIT_NUMBER(size);
    EMIT_OP(MAX);
    return {};
}

any Expr::visitOpen(ExprParser::OpenContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(OPEN);

    return {};
}

any Expr::visitHigh(ExprParser::HighContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(HIGH);

    return {};
}

any Expr::visitLow(ExprParser::LowContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;
    EMIT_NUMBER(shift);
    EMIT_OP(LOW);

    return {};
}

any Expr::visitClose(ExprParser::CloseContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(CLOSE);

    return {};
}

any Expr::visitVolume(ExprParser::VolumeContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(VOLUME);

    return {};
}

any Expr::visitChange(ExprParser::ChangeContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(CHANGE);

    return {};
}

any Expr::visitChangeP(ExprParser::ChangePContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(CHANGE_P);

    return {};
}

any Expr::visitAmpl(ExprParser::AmplContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(AMPL);

    return {};
}

any Expr::visitAmplP(ExprParser::AmplPContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(AMPL_P);

    return {};
}

any Expr::visitUpper_shadow(ExprParser::Upper_shadowContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(UPPER_SHADOW);

    return {};
}
any Expr::visitUpper_shadowP(ExprParser::Upper_shadowPContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(UPPER_SHADOW_P);

    return {};
}

any Expr::visitLower_shadow(ExprParser::Lower_shadowContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(LOWER_SHADOW);

    return {};
}

any Expr::visitLower_shadowP(ExprParser::Lower_shadowPContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(LOWER_SHADOW_P);

    return {};
}

any Expr::visitRsi(ExprParser::RsiContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int shift = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(period);
    EMIT_OP(RSI);

    return {};
}

any Expr::visitRsi_slope(ExprParser::Rsi_slopeContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int shift = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(period);
    EMIT_OP(RSI_SLOPE);

    return {};
}

any Expr::visitMa(ExprParser::MaContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int shift = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(period);
    EMIT_OP(MA);

    return {};
}

any Expr::visitEma(ExprParser::EmaContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int shift = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(period);
    EMIT_OP(EMA);

    return {};
}

any Expr::visitMacd_value(ExprParser::Macd_valueContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int shift = ctx->children.size() > 8 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MACD_VALUE);

    return {};
}

any Expr::visitMacd_signal(ExprParser::Macd_signalContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int shift = ctx->children.size() > 8 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MACD_SIGNAL);

    return {};
}

any Expr::visitMacd_histogram(ExprParser::Macd_histogramContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int shift = ctx->children.size() > 8 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MACD_HISTOGRAM);

    return {};
}

any Expr::visitBb_upper(ExprParser::Bb_upperContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->children.size() > 6 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(stdDev);
    EMIT_NUMBER(period);
    EMIT_OP(BB_UPPER);

    return {};
}

any Expr::visitBb_middle(ExprParser::Bb_middleContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->children.size() > 6 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(stdDev);
    EMIT_NUMBER(period);
    EMIT_OP(BB_MIDDLE);

    return {};
}

any Expr::visitBb_lower(ExprParser::Bb_lowerContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    double stdDev = stod(ctx->number()->getText());
    int shift = ctx->children.size() > 6 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(stdDev);
    EMIT_NUMBER(period);
    EMIT_OP(BB_LOWER);

    return {};
}

any Expr::visitMacd_n_dinh(ExprParser::Macd_n_dinhContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int redDepth = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int depth = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str());
    int enableDivergence = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[12])->getSymbol()->getText().c_str());
    double diffCandle0 = stod(ctx->number(0)->getText());
    int shift = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[16])->getSymbol()->getText().c_str());

    EMIT_NUMBER(shift);
    EMIT_NUMBER(diffCandle0);
    EMIT_NUMBER(enableDivergence);
    EMIT_NUMBER(depth);
    EMIT_NUMBER(redDepth);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);

    vector<double> diffPercents = vectorDoublePool.acquire();

    for (int i = 1; ctx->number(i); i++)
    {
        diffPercents.push_back(stod(ctx->number(i)->getText()));
    }
    for (int i = diffPercents.size() - 1; i >= 0; i--)
    {
        EMIT_NUMBER(diffPercents[i]);
    }
    EMIT_NUMBER(diffPercents.size());
    EMIT_OP(MACD_N_DINH);

    vectorDoublePool.release(diffPercents);
    return {};
}

any Expr::visitMacd_slope(ExprParser::Macd_slopeContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int shift = ctx->children.size() > 8 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MACD_SLOPE);

    return {};
}

any Expr::visitAvg_open(ExprParser::Avg_openContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(AVG_OPEN);

    return {};
}

any Expr::visitAvg_high(ExprParser::Avg_highContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(AVG_HIGH);

    return {};
}

any Expr::visitAvg_low(ExprParser::Avg_lowContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(AVG_LOW);

    return {};
}

any Expr::visitAvg_close(ExprParser::Avg_closeContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(AVG_CLOSE);

    return {};
}

any Expr::visitAvg_ampl(ExprParser::Avg_amplContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(AVG_AMPL);

    return {};
}

any Expr::visitAvg_amplP(ExprParser::Avg_amplPContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(AVG_AMPL_P);

    return {};
}

any Expr::visitMin_open(ExprParser::Min_openContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MIN_OPEN);

    return {};
}

any Expr::visitMin_high(ExprParser::Min_highContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MIN_HIGH);

    return {};
}
any Expr::visitMin_low(ExprParser::Min_lowContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MIN_LOW);

    return {};
}

any Expr::visitMin_close(ExprParser::Min_closeContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MIN_CLOSE);

    return {};
}

any Expr::visitMin_change(ExprParser::Min_changeContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MIN_CHANGE);

    return {};
}

any Expr::visitMin_changeP(ExprParser::Min_changePContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MIN_CHANGE_P);

    return {};
}

any Expr::visitMin_ampl(ExprParser::Min_amplContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MIN_AMPL);

    return {};
}
any Expr::visitMin_amplP(ExprParser::Min_amplPContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MIN_AMPL_P);

    return {};
}

any Expr::visitMax_open(ExprParser::Max_openContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MAX_OPEN);

    return {};
}

any Expr::visitMax_high(ExprParser::Max_highContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MAX_HIGH);

    return {};
}

any Expr::visitMax_low(ExprParser::Max_lowContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MAX_LOW);

    return {};
}

any Expr::visitMax_close(ExprParser::Max_closeContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MAX_CLOSE);

    return {};
}
any Expr::visitMax_change(ExprParser::Max_changeContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MAX_CHANGE);

    return {};
}

any Expr::visitMax_changeP(ExprParser::Max_changePContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MAX_CHANGE_P);

    return {};
}

any Expr::visitMax_ampl(ExprParser::Max_amplContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MAX_AMPL);

    return {};
}

any Expr::visitMax_amplP(ExprParser::Max_amplPContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 4 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(MAX_AMPL_P);

    return {};
}

any Expr::visitMin_rsi(ExprParser::Min_rsiContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 6 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(period);
    EMIT_OP(MIN_RSI);

    return {};
}

any Expr::visitMax_rsi(ExprParser::Max_rsiContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 6 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(period);
    EMIT_OP(MAX_RSI);

    return {};
}

any Expr::visitMarsi(ExprParser::MarsiContext *ctx)
{
    int period = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 6 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(period);
    EMIT_OP(AVG_RSI);

    return {};
}

any Expr::visitMin_macd_value(ExprParser::Min_macd_valueContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MIN_MACD_VALUE);

    return {};
}

any Expr::visitMax_macd_value(ExprParser::Max_macd_valueContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MAX_MACD_VALUE);

    return {};
}
any Expr::visitAvg_macd_value(ExprParser::Avg_macd_valueContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(AVG_MACD_VALUE);

    return {};
}

any Expr::visitMax_macd_signal(ExprParser::Max_macd_signalContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MAX_MACD_SIGNAL);

    return {};
}
any Expr::visitMin_macd_signal(ExprParser::Min_macd_signalContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MIN_MACD_SIGNAL);

    return {};
}
any Expr::visitAvg_macd_signal(ExprParser::Avg_macd_signalContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(AVG_MACD_SIGNAL);

    return {};
}
any Expr::visitMin_macd_histogram(ExprParser::Min_macd_histogramContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MIN_MACD_HISTOGRAM);

    return {};
}
any Expr::visitMax_macd_histogram(ExprParser::Max_macd_histogramContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(MAX_MACD_HISTOGRAM);

    return {};
}

any Expr::visitAvg_macd_histogram(ExprParser::Avg_macd_histogramContext *ctx)
{
    int fastPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int slowPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());
    int signalPeriod = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[6])->getSymbol()->getText().c_str());
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[8])->getSymbol()->getText().c_str());
    int to = ctx->children.size() > 10 ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[10])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_NUMBER(signalPeriod);
    EMIT_NUMBER(slowPeriod);
    EMIT_NUMBER(fastPeriod);
    EMIT_OP(AVG_MACD_HISTOGRAM);

    return {};
}

any Expr::visitRandom(ExprParser::RandomContext *ctx)
{
    int from = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str());
    int to = fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[4])->getSymbol()->getText().c_str());

    EMIT_NUMBER(to);
    EMIT_NUMBER(from);
    EMIT_OP(RANDOM);

    return {};
}

any Expr::visitHour(ExprParser::HourContext *ctx)
{
    EMIT_OP(HOUR);
    return {};
}

any Expr::visitMinute(ExprParser::MinuteContext *ctx)
{
    EMIT_OP(MINUTE);
    return {};
}

any Expr::visitFunding_rate(ExprParser::Funding_rateContext *ctx)
{
    EMIT_OP(FUNDING);
    return {};
}

any Expr::visitBullish_engulfing(ExprParser::Bullish_engulfingContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;
    EMIT_NUMBER(shift);
    EMIT_OP(BULLISH_ENGULFING);
    return {};
}
any Expr::visitBearish_engulfing(ExprParser::Bearish_engulfingContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(BEARISH_ENGULFING);

    return {};
}

any Expr::visitBullish_hammer(ExprParser::Bullish_hammerContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(BULLISH_HAMMER);

    return {};
}

any Expr::visitBearish_hammer(ExprParser::Bearish_hammerContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(BEARISH_HAMMER);

    return {};
}

any Expr::visitDoji(ExprParser::DojiContext *ctx)
{
    int shift = (ctx->children.size() == 4) ? fast_stoi(static_cast<antlr4::tree::TerminalNode *>(ctx->children[2])->getSymbol()->getText().c_str()) : 0;

    EMIT_NUMBER(shift);
    EMIT_OP(DOJI);

    return {};
}

static vector<double> &getRSI(int period, boost::unordered_flat_map<long long, vector<double>> *cachedIndicator, const double *close, int length)
{
    long long key = ID_RSI | (static_cast<long long>(period) << 10);

    auto it = cachedIndicator->find(key);
    if (it == cachedIndicator->end())
    {
        it = cachedIndicator->emplace(key, iRSI(period, close, length)).first;
    }
    return it->second;
}

static vector<double> &getMACD(int fastPeriod, int slowPeriod, int signalPeriod, boost::unordered_flat_map<long long, vector<double>> *cachedIndicator, const double *close, int length)
{
    long long key = ID_MACD | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);

    auto it = cachedIndicator->find(key);
    if (it == cachedIndicator->end())
    {
        it = cachedIndicator->emplace(key, iMACD(fastPeriod, slowPeriod, signalPeriod, close, length)).first;
    }
    return it->second;
}

static double getAVG(const double arr[], int l, int r, int length, long long key, boost::unordered_flat_map<long long, vector<double>> *cachedIndicator)
{
    auto it = cachedIndicator->find(key);
    if (it == cachedIndicator->end())
    {
        vector<double> prefixSum = vectorDoublePool.acquire();
        prefixSum.resize(length + 1);
        prefixSum[0] = 0.0;
        for (int i = 0; i < length; i++)
        {
            prefixSum[i + 1] = prefixSum[i] + arr[i];
        }
        it = cachedIndicator->emplace(key, prefixSum).first;
    }
    const vector<double> &prefixSum = it->second;
    return (prefixSum[r + 1] - prefixSum[l]) / (r - l + 1);
}

static double eval(const std::vector<Instr> &instr, int length,
                   const double *open, const double *high, const double *low, const double *close, const double *volume,
                   long long *startTime, double fundingRate, boost::unordered_flat_map<long long, vector<double>> *cachedIndicator, boost::unordered_flat_map<long long, unique_ptr<SparseTable>> *cachedMinMax, int offset)
{
    double st[32];
    int sp = 0;

    for (const Instr &ins : instr)
    {
        switch (ins.type)
        {
        case OP_TYPE::NUMBER:
        {
            PUSH(ins.value);
            break;
        }
        case OP_TYPE::GT:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a > b);
            break;
        }
        case OP_TYPE::GE:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a >= b);
            break;
        }
        case OP_TYPE::LT:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a < b);
            break;
        }
        case OP_TYPE::LE:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a <= b);
            break;
        }
        case OP_TYPE::EQ:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a == b);
            break;
        }
        case OP_TYPE::NEQ:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a != b);
            break;
        }

        case OP_TYPE::ASSIGN:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a == b);
            break;
        }
        case OP_TYPE::NEG:
        {
            double a = POP_DOUBLE();
            PUSH(-a);
            break;
        }
        case OP_TYPE::MUL:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a * b);
            break;
        }
        case OP_TYPE::DIV:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a / b);
            break;
        }
        case OP_TYPE::ADD:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a + b);
            break;
        }
        case OP_TYPE::SUB:
        {
            double b = POP_DOUBLE();
            double a = POP_DOUBLE();
            PUSH(a - b);
            break;
        }
        case OP_TYPE::ABS:
        {
            double a = POP_DOUBLE();
            PUSH(abs(a));
            break;
        }
        case OP_TYPE::HOUR:
        {
            long long timestamp_ms = startTime[0];
            long long seconds = timestamp_ms / 1000;
            long long seconds_in_day = seconds % 86400;

            int hour = seconds_in_day / 3600;

            PUSH(hour);
            break;
        }
        case OP_TYPE::MINUTE:
        {
            long long timestamp_ms = startTime[0];
            long long seconds = timestamp_ms / 1000;
            long long seconds_in_day = seconds % 86400;

            int hour = seconds_in_day / 3600;
            int minute = (seconds_in_day % 3600) / 60;

            PUSH(minute);
            break;
        }
        case OP_TYPE::FUNDING:
        {
            PUSH(fundingRate);
            break;
        }
        case OP_TYPE::MIN:
        {
            int size = POP_INT();
            double m = INF;
            while (size--)
            {
                m = min(m, POP_DOUBLE());
            }
            PUSH(m);
            break;
        }

        case OP_TYPE::MAX:
        {
            int size = POP_INT();
            double m = -INF;
            while (size--)
            {
                m = max(m, POP_DOUBLE());
            }
            PUSH(m);
            break;
        }

        case OP_TYPE::OPEN:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(open[shift]);
            break;
        }

        case OP_TYPE::HIGH:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(high[shift]);
            break;
        }

        case OP_TYPE::LOW:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(low[shift]);
            break;
        }

        case OP_TYPE::CLOSE:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(close[shift]);
            break;
        }

        case OP_TYPE::VOLUME:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(volume[shift]);
            break;
        }

        case OP_TYPE::CHANGE:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(close[shift] - open[shift]);
            break;
        }

        case OP_TYPE::CHANGE_P:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH((close[shift] - open[shift]) / open[shift] * 100.0);
            break;
        }

        case OP_TYPE::AMPL:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(high[shift] - low[shift]);
            break;
        }

        case OP_TYPE::AMPL_P:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH((high[shift] - low[shift]) / open[shift] * 100.0);
            break;
        }

        case OP_TYPE::UPPER_SHADOW:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(high[shift] - max(open[shift], close[shift]));
            break;
        }

        case OP_TYPE::UPPER_SHADOW_P:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            double upperShadow = high[shift] - max(open[shift], close[shift]);
            PUSH(upperShadow / open[shift] * 100.0);
            break;
        }

        case OP_TYPE::LOWER_SHADOW:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            PUSH(min(open[shift], close[shift]) - low[shift]);
            break;
        }

        case OP_TYPE::LOWER_SHADOW_P:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift < 0 || shift >= length)
                return 0.0;

            double lowerShadow = min(open[shift], close[shift]) - low[shift];
            PUSH(lowerShadow / open[shift] * 100.0);
            break;
        }

        case OP_TYPE::RSI:
        {
            int period = POP_INT();
            int shift = POP_INT();
            shift += offset;

            if (period <= 0 || shift < 0 || shift >= length - period)
                return 0.0;

            const vector<double> &cached = getRSI(period, cachedIndicator, close, length);

            if (shift >= cached.size())
            {
                return 0.0;
            }

            PUSH(cached[shift]);
            break;
        }

        case OP_TYPE::RSI_SLOPE:
        {
            int period = POP_INT();
            int shift = POP_INT();
            shift += offset;

            if (period <= 0 || shift < 0 || shift >= length - period - 1)
                return 0.0;

            PUSH(iRSI_slope(period, close + shift, length - shift));
            break;
        }

        case OP_TYPE::MA:
        {
            int period = POP_INT();
            int shift = POP_INT();
            shift += offset;

            if (period <= 0 || shift < 0 || shift >= length - period)
                return 0.0;

            PUSH(iMA(period, close + shift, length - shift));
            break;
        }

        case OP_TYPE::EMA:
        {
            int period = POP_INT();
            int shift = POP_INT();
            shift += offset;

            if (period <= 0 || shift < 0 || shift >= length - period)
                return 0.0;

            PUSH(iEMA(period, close + shift, length - shift));
            break;
        }

        case OP_TYPE::MACD_VALUE:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int shift = POP_INT();
            shift += offset;

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod)
                return 0.0;

            const vector<double> &cached = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);

            if (shift * 3 >= cached.size())
            {
                return 0.0;
            }
            PUSH(cached[shift * 3]);
            break;
        }

        case OP_TYPE::MACD_SIGNAL:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int shift = POP_INT();
            shift += offset;

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod)
                return 0.0;

            const vector<double> &cached = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);

            if (shift * 3 + 1 >= cached.size())
            {
                return 0.0;
            }
            PUSH(cached[shift * 3 + 1]);
            break;
        }

        case OP_TYPE::MACD_HISTOGRAM:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int shift = POP_INT();
            shift += offset;

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod)
                return 0.0;

            const vector<double> &cached = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);

            if (shift * 3 + 2 >= cached.size())
            {
                return 0.0;
            }
            PUSH(cached[shift * 3 + 2]);
            break;
        }

        case OP_TYPE::BB_UPPER:
        {
            int period = POP_INT();
            double stdDev = POP_DOUBLE();
            int shift = POP_INT();
            shift += offset;

            if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
                return 0.0;

            PUSH(iBB(period, stdDev, close + shift, length - shift).upper);
            break;
        }

        case OP_TYPE::BB_MIDDLE:
        {
            int period = POP_INT();
            double stdDev = POP_DOUBLE();
            int shift = POP_INT();
            shift += offset;

            if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
                return 0.0;

            PUSH(iBB(period, stdDev, close + shift, length - shift).middle);
            break;
        }

        case OP_TYPE::BB_LOWER:
        {
            int period = POP_INT();
            double stdDev = POP_DOUBLE();
            int shift = POP_INT();
            shift += offset;

            if (period <= 0 || stdDev <= 0 || shift < 0 || shift >= length - period)
                return 0.0;

            PUSH(iBB(period, stdDev, close + shift, length - shift).lower);
            break;
        }

        case OP_TYPE::MACD_N_DINH:
        {
            vector<double> diffPercents = vectorDoublePool.acquire();
            int diffSize = POP_INT();
            while (diffSize--)
            {
                diffPercents.push_back(POP_DOUBLE());
            }

            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int redDepth = POP_INT();
            int depth = POP_INT();
            int enableDivergence = POP_INT();
            double diffCandle0 = POP_DOUBLE();
            int shift = POP_INT();
            shift += offset;

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || redDepth < 0 || depth < 0 || enableDivergence < 0 || diffCandle0 < 0 || shift < 0 || shift >= length - slowPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            int result = macd_n_dinh(fastPeriod, slowPeriod, signalPeriod, redDepth, depth, enableDivergence, diffCandle0, diffPercents, close + shift, open + shift, high + shift, length - shift, cachedMACD.data() + shift * 3, (cachedMACD.size() - shift) / 3);

            vectorDoublePool.release(diffPercents);
            PUSH(static_cast<double>(result));
            break;
        }

        case OP_TYPE::MACD_SLOPE:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int shift = POP_INT();
            shift += offset;

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || shift < 0 || shift >= length - slowPeriod - 1)
                return 0.0;

            PUSH(macd_slope(fastPeriod, slowPeriod, signalPeriod, close + shift, length - shift));
            break;
        }

        case OP_TYPE::AVG_OPEN:
        {
            int from = POP_INT();
            int to = POP_INT();
            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            PUSH(getAVG(open, from, to, length, ID_AVG_OPEN, cachedIndicator));
            break;
        }

        case OP_TYPE::AVG_HIGH:
        {
            int from = POP_INT();
            int to = POP_INT();
            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            PUSH(getAVG(high, from, to, length, ID_AVG_HIGH, cachedIndicator));
            break;
        }

        case OP_TYPE::AVG_LOW:
        {
            int from = POP_INT();
            int to = POP_INT();
            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            PUSH(getAVG(low, from, to, length, ID_AVG_LOW, cachedIndicator));
            break;
        }

        case OP_TYPE::AVG_CLOSE:
        {
            int from = POP_INT();
            int to = POP_INT();
            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            PUSH(getAVG(close, from, to, length, ID_AVG_CLOSE, cachedIndicator));
            break;
        }

        case OP_TYPE::AVG_AMPL:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            vector<double> v = vectorDoublePool.acquire();
            v.resize(length);
            for (int i = 0; i < length; i++)
            {
                v[i] = (high[i] - low[i]);
            }
            double result = getAVG(v.data(), from, to, length, ID_AVG_AMPL, cachedIndicator);
            vectorDoublePool.release(v);
            PUSH(result);
            break;
        }

        case OP_TYPE::AVG_AMPL_P:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            vector<double> v = vectorDoublePool.acquire();
            v.resize(length);
            for (int i = 0; i < length; i++)
            {
                v[i] = (high[i] - low[i]) / open[i] * 100.0;
            }
            double result = getAVG(v.data(), from, to, length, ID_AVG_AMPL_P, cachedIndicator);
            vectorDoublePool.release(v);
            PUSH(result);
            break;
        }

        case OP_TYPE::MIN_OPEN:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_OPEN;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(open, length);

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_min(from, to));
            break;
        }

        case OP_TYPE::MIN_HIGH:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_HIGH;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(high, length);

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_min(from, to));
            break;
        }

        case OP_TYPE::MIN_LOW:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_LOW;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(low, length);

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MIN_CLOSE:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_CLOSE;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(close, length);

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MIN_CHANGE:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_CHANGE;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                vector<double> v = vectorDoublePool.acquire();
                v.resize(length);
                for (int i = 0; i < length; i++)
                {
                    v[i] = close[i] - open[i];
                }
                st->init(v.data(), length);
                it = cachedMinMax->emplace(key, move(st)).first;
                vectorDoublePool.release(v);
            }
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MIN_CHANGE_P:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_CHANGE_P;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                vector<double> v = vectorDoublePool.acquire();
                v.resize(length);
                for (int i = 0; i < length; i++)
                {
                    v[i] = (close[i] - open[i]) / open[i] * 100.0;
                }
                st->init(v.data(), length);
                it = cachedMinMax->emplace(key, move(st)).first;
                vectorDoublePool.release(v);
            }
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MIN_AMPL:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_AMPL;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                vector<double> v = vectorDoublePool.acquire();
                v.resize(length);
                for (int i = 0; i < length; i++)
                {
                    v[i] = high[i] - low[i];
                }
                st->init(v.data(), length);
                it = cachedMinMax->emplace(key, move(st)).first;
                vectorDoublePool.release(v);
            }
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MIN_AMPL_P:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_AMPL_P;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                vector<double> v = vectorDoublePool.acquire();
                v.resize(length);
                for (int i = 0; i < length; i++)
                {
                    v[i] = (high[i] - low[i]) / open[i] * 100.0;
                }
                st->init(v.data(), length);
                it = cachedMinMax->emplace(key, move(st)).first;
                vectorDoublePool.release(v);
            }
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MAX_OPEN:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_OPEN;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(open, length);

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::MAX_HIGH:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_HIGH;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(high, length);

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::MAX_LOW:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_LOW;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(low, length);

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::MAX_CLOSE:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_CLOSE;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(close, length);

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::MAX_CHANGE:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_CHANGE;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                vector<double> v = vectorDoublePool.acquire();
                v.resize(length);
                for (int i = 0; i < length; i++)
                {
                    v[i] = close[i] - open[i];
                }
                st->init(v.data(), length);
                it = cachedMinMax->emplace(key, move(st)).first;
                vectorDoublePool.release(v);
            }
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::MAX_CHANGE_P:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_CHANGE_P;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                vector<double> v = vectorDoublePool.acquire();
                v.resize(length);
                for (int i = 0; i < length; i++)
                {
                    v[i] = (close[i] - open[i]) / open[i] * 100.0;
                }
                st->init(v.data(), length);
                it = cachedMinMax->emplace(key, move(st)).first;
                vectorDoublePool.release(v);
            }
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::MAX_AMPL:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_AMPL;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                vector<double> v = vectorDoublePool.acquire();
                v.resize(length);
                for (int i = 0; i < length; i++)
                {
                    v[i] = high[i] - low[i];
                }
                st->init(v.data(), length);
                it = cachedMinMax->emplace(key, move(st)).first;
                vectorDoublePool.release(v);
            }
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::MAX_AMPL_P:
        {
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (from < 0 || to >= length)
                return 0.0;

            long long key = ID_MM_AMPL_P;

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                vector<double> v = vectorDoublePool.acquire();
                v.resize(length);
                for (int i = 0; i < length; i++)
                {
                    v[i] = (high[i] - low[i]) / open[i] * 100.0;
                }
                st->init(v.data(), length);
                it = cachedMinMax->emplace(key, move(st)).first;
                vectorDoublePool.release(v);
            }
            PUSH(it->second->query_max(from, to));
            break;
        }

        case OP_TYPE::MIN_RSI:
        {
            int period = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (period <= 0 || from < 0 || to >= length - period)
                return 0.0;

            vector<double> &cachedRSI = getRSI(period, cachedIndicator, close, length);
            if (from >= cachedRSI.size() || to >= cachedRSI.size())
            {
                return 0.0;
            }

            long long key = ID_MM_RSI | (static_cast<long long>(period) << 10);

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(cachedRSI.data(), cachedRSI.size());

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_min(from, to));
            break;
        }

        case OP_TYPE::MAX_RSI:
        {
            int period = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (period <= 0 || from < 0 || to >= length - period)
                return 0.0;

            vector<double> &cachedRSI = getRSI(period, cachedIndicator, close, length);
            if (from >= cachedRSI.size() || to >= cachedRSI.size())
            {
                return 0.0;
            }

            long long key = ID_MM_RSI | (static_cast<long long>(period) << 10);

            auto it = cachedMinMax->find(key);
            if (it == cachedMinMax->end())
            {
                auto st = sparseTablePool.acquire();
                st->init(cachedRSI.data(), cachedRSI.size());

                it = cachedMinMax->emplace(key, move(st)).first;
            }
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::AVG_RSI:
        {
            int period = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            vector<double> &cachedRSI = getRSI(period, cachedIndicator, close, length);
            if (from >= cachedRSI.size() || to >= cachedRSI.size())
            {
                return 0.0;
            }
            long long key = ID_AVG_RSI | (static_cast<long long>(period) << 10);
            PUSH(getAVG(cachedRSI.data(), from, to, cachedRSI.size(), key, cachedIndicator));
            break;
        }
        case OP_TYPE::MIN_MACD_VALUE:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);

            if (from * 3 >= cachedMACD.size() || to * 3 >= cachedMACD.size())
            {
                return 0.0;
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
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MAX_MACD_VALUE:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            if (from * 3 >= cachedMACD.size() || to * 3 >= cachedMACD.size())
            {
                return 0.0;
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
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::AVG_MACD_VALUE:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            if (from * 3 >= cachedMACD.size() || to * 3 >= cachedMACD.size())
            {
                return 0.0;
            }
            long long key = ID_AVG_MACD_VALUE | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);
            if (cachedIndicator->find(key) == cachedIndicator->end())
            {
                vector<double> v = vectorDoublePool.acquire();
                v.resize(cachedMACD.size() / 3);
                for (int i = 0; i < v.size(); ++i)
                {
                    v[i] = cachedMACD[i * 3];
                }
                double result = getAVG(v.data(), from, to, v.size(), key, cachedIndicator);
                vectorDoublePool.release(v);
                PUSH(result);
                break;
            }
            PUSH(getAVG(NULL, from, to, length, key, cachedIndicator));
            break;
        }
        case OP_TYPE::MIN_MACD_SIGNAL:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            if (from * 3 + 1 >= cachedMACD.size() || to * 3 + 1 >= cachedMACD.size())
            {
                return 0.0;
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
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MAX_MACD_SIGNAL:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            if (from * 3 + 1 >= cachedMACD.size() || to * 3 + 1 >= cachedMACD.size())
            {
                return 0.0;
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
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::AVG_MACD_SIGNAL:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return {};

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            if (from * 3 >= cachedMACD.size() || to * 3 >= cachedMACD.size())
            {
                return {};
            }

            long long key = ID_AVG_MACD_SIGNAL | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);
            if (cachedIndicator->find(key) == cachedIndicator->end())
            {
                vector<double> v = vectorDoublePool.acquire();
                v.resize(cachedMACD.size() / 3);
                for (int i = 0; i < v.size(); ++i)
                {
                    v[i] = cachedMACD[i * 3 + 1];
                }
                double result = getAVG(v.data(), from, to, v.size(), key, cachedIndicator);
                vectorDoublePool.release(v);
                PUSH(result);
                break;
            }
            PUSH(getAVG(NULL, from, to, length, key, cachedIndicator));
            break;
        }
        case OP_TYPE::MIN_MACD_HISTOGRAM:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            if (from * 3 + 2 >= cachedMACD.size() || to * 3 + 2 >= cachedMACD.size())
            {
                return 0.0;
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
            PUSH(it->second->query_min(from, to));
            break;
        }
        case OP_TYPE::MAX_MACD_HISTOGRAM:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            if (from * 3 + 2 >= cachedMACD.size() || to * 3 + 2 >= cachedMACD.size())
            {
                return 0.0;
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
            PUSH(it->second->query_max(from, to));
            break;
        }
        case OP_TYPE::AVG_MACD_HISTOGRAM:
        {
            int fastPeriod = POP_INT();
            int slowPeriod = POP_INT();
            int signalPeriod = POP_INT();
            int from = POP_INT();
            int to = POP_INT();

            from += offset;
            to += offset;

            if (to < from)
                swap(from, to);

            if (fastPeriod <= 0 || slowPeriod <= 0 || signalPeriod <= 0 || from < 0 || to >= length - slowPeriod || to >= length - signalPeriod)
                return 0.0;

            vector<double> &cachedMACD = getMACD(fastPeriod, slowPeriod, signalPeriod, cachedIndicator, close, length);
            if (from * 3 >= cachedMACD.size() || to * 3 >= cachedMACD.size())
            {
                return 0.0;
            }

            long long key = ID_AVG_MACD_HISTOGRAM | (static_cast<long long>(fastPeriod) << 10) | (static_cast<long long>(slowPeriod) << 20) | (static_cast<long long>(signalPeriod) << 30);
            if (cachedIndicator->find(key) == cachedIndicator->end())
            {
                vector<double> v = vectorDoublePool.acquire();
                v.resize(cachedMACD.size() / 3);
                for (int i = 0; i < v.size(); ++i)
                {
                    v[i] = cachedMACD[i * 3 + 2];
                }
                double result = getAVG(v.data(), from, to, v.size(), key, cachedIndicator);
                vectorDoublePool.release(v);
                PUSH(result);
                break;
            }
            PUSH(getAVG(NULL, from, to, length, key, cachedIndicator));
            break;
        }
        case OP_TYPE::RANDOM:
        {
            int from = POP_INT();
            int to = POP_INT();

            if (from > to)
            {
                swap(from, to);
            }

            int randomNumber = rand() % (to - from + 1) + from;
            PUSH(randomNumber);
            break;
        }

        case OP_TYPE::BULLISH_ENGULFING:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift + 1 >= length)
            {
                return 0.0;
            }

            // Nến trước phải là nến đỏ (giảm)
            if (close[shift + 1] >= open[shift + 1])
                PUSH(0.0);
            // Nến hiện tại phải là nến xanh (tăng)
            else if (close[shift] <= open[shift])
                PUSH(0.0);
            else // Thân nến hiện tại phải bao trùm thân nến trước
                PUSH((open[shift] < close[shift + 1] && close[shift] > open[shift + 1]) ? 1.0 : 0.0);
            break;
        }
        case OP_TYPE::BEARISH_ENGULFING:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift + 1 >= length)
            {
                return 0.0;
            }

            // Nến trước phải là nến xanh (tăng)
            if (close[shift + 1] <= open[shift + 1])
                PUSH(0.0);

            // Nến hiện tại phải là nến đỏ (giảm)
            else if (close[shift] >= open[shift])
                PUSH(0.0);

            // Thân nến hiện tại phải bao trùm thân nến trước
            else
                PUSH((open[shift] > close[shift + 1] && close[shift] < open[shift + 1]) ? 1.0 : 0.0);
            break;
        }
        case OP_TYPE::BULLISH_HAMMER:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift >= length)
                return 0.0;

            double o = open[shift], c = close[shift], h = high[shift], l = low[shift];

            // phải xuất hiện ở cuối xu hướng giảm (đáy của 10 nến gần nhất)
            double minLow = iMin(10, low + shift, length - shift);
            if (l > minLow)
            {
                PUSH(0.0);
                break;
            }

            double body = abs(c - o);
            double lowerWick = min(o, c) - l;
            double upperWick = h - max(o, c);

            // Tránh chia cho 0
            if (body == 0)
                body = 0.0001;

            // bóng dưới ≥ 2 * thân và bóng trên nhỏ
            PUSH((lowerWick >= 2 * body && upperWick <= body) ? 1.0 : 0.0);
            break;
        }
        case OP_TYPE::BEARISH_HAMMER:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift >= length)
                return 0.0;

            double o = open[shift], c = close[shift], h = high[shift], l = low[shift];

            // phải xuất hiện ở cuối xu hướng tăng (đỉnh của 10 nến gần nhất)
            double maxHigh = iMax(10, high + shift, length - shift);
            if (h < maxHigh)
            {
                PUSH(0.0);
                break;
            }

            double body = abs(c - o);
            double lowerWick = min(o, c) - l;
            double upperWick = h - max(o, c);

            // Tránh chia cho 0
            if (body == 0)
                body = 0.0001;

            // bóng dưới ≥ 2 * thân và bóng trên nhỏ
            PUSH((lowerWick >= 2 * body && upperWick <= body) ? 1.0 : 0.0);
            break;
        }
        case OP_TYPE::DOJI:
        {
            int shift = POP_INT();
            shift += offset;

            if (shift >= length)
                return 0.0;

            double o = open[shift], c = close[shift], h = high[shift], l = low[shift];
            double range = h - l;
            double body = abs(c - o);

            // tránh chia 0 nếu range quá nhỏ
            if (range == 0)
                PUSH(0);
            // thân nhỏ hơn 10% tổng chiều dài nến => doji
            else
                PUSH((body / range <= 0.1) ? 1.0 : 0.0);
            break;
        }

        default:
            return 0.0;
        }
    }

    return st[0];
}

//////////////////////////////////////////////////////////////////
static thread_local boost::unordered_flat_map<long long, vector<Instr>> instrCache;

void cacheInstr(const string &inputText)
{
    long long key = hashString(inputText);
    vector<Instr> &instr = instrCache[key];
    if (instr.empty())
    {
        Expr expr(&instr);

        auto input = make_unique<ANTLRInputStream>(inputText);
        auto lexer = make_unique<ExprLexer>(input.get());
        auto tokens = make_unique<CommonTokenStream>(lexer.get());
        auto parser = make_unique<ExprParser>(tokens.get());
        auto tree = parser->expr();
        expr.visit(tree);
    }
}

double calculateExpr(const string &inputText, int length, const double *open, const double *high, const double *low, const double *close,
                     const double *volume, long long *startTime, double fundingRate, boost::unordered_flat_map<long long, vector<double>> *cachedIndicator, boost::unordered_flat_map<long long, unique_ptr<SparseTable>> *cachedMinMax, int shift)
{
    const long long key = hashString(inputText);
    // LOGD("Calculating expr: {}", inputText);
    vector<Instr> &instr = instrCache[key];
    if (instr.empty())
    {
        Expr expr(&instr);

        auto input = make_unique<ANTLRInputStream>(inputText);
        auto lexer = make_unique<ExprLexer>(input.get());
        auto tokens = make_unique<CommonTokenStream>(lexer.get());
        auto parser = make_unique<ExprParser>(tokens.get());
        auto tree = parser->expr();
        expr.visit(tree);
    }
    return eval(instr, length, open, high, low, close, volume, startTime, fundingRate, cachedIndicator, cachedMinMax, shift);
}

string calculateSubExpr(string &expr, int length, const double *open, const double *high, const double *low, const double *close,
                        const double *volume, long long *startTime, double fundingRate, boost::unordered_flat_map<long long, vector<double>> *cachedIndicator, boost::unordered_flat_map<long long, unique_ptr<SparseTable>> *cachedMinMax, int shift)
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
            double result = calculateExpr(toLowerCase(s), length, open, high, low, close, volume, startTime, fundingRate, cachedIndicator, cachedMinMax, shift);
            s = lastS + " ";
            s += to_string(result);
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