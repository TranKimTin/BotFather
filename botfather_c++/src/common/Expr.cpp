#include "expr.h"

std::any Expr::visitIClose(ExprParser::ICloseContext *ctx) {
    return visit(ctx);
}