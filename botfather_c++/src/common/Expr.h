#include "../antlr/include/antlr4-runtime/antlr4-runtime.h"
#include "generated/ExprBaseVisitor.h"
#include "generated/ExprLexer.h"
#include "generated/ExprParser.h"
#include "generated/ExprVisitor.h"

class Expr : public ExprBaseVisitor
{
public:
    std::any visitIClose(ExprParser::ICloseContext *ctx) override
    {
        return visitChildren(ctx);
    }
    
};