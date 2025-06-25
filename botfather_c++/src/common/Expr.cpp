#include "expr.h"
#include <ANTLRFileStream.h>
#include <CommonTokenStream.h>
#include "util.h"

using namespace antlr4;

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






//////////////////////////////////////////////////////////////////






any calculateExpr(const string &broker, const string &symbol, const string &timeframe, int length,
                  const double *open, const double *high, const double *low, const double *close,
                  const double *volume, long long *startTime, const string &inputText)
{
    Expr e(broker, symbol, timeframe, length, open, high, low, close, volume, startTime);

    string s = toLowerCase(inputText);
    ANTLRInputStream input(s);
    ExprLexer lexer(&input);
    CommonTokenStream tokens(&lexer);
    ExprParser parser(&tokens);

    antlr4::tree::ParseTree *tree = parser.expr();
    return e.visit(tree);
}