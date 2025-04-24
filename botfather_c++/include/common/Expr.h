#include "antlr4-runtime.h"
#include "ExprBaseVisitor.h"
#include "ExprLexer.h"
#include "ExprParser.h"
#include "ExprVisitor.h"

class Expr : public ExprBaseVisitor
{
public:
    std::any visitIClose(ExprParser::ICloseContext *ctx) override
    {
        return visitChildren(ctx);
    }
    
};