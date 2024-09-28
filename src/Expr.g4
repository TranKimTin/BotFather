grammar Expr;

expr
    : expr ('*' | '/') expr    # MulDiv
    | expr ('+' | '-') expr    # AddSub
    | '(' expr ')'             # Parens
    | NUMBER                   # Number
    | rsi                      # iRSI
    ;
    
rsi: 'rsi' '(' NUMBER (',' NUMBER)? ')'     # RSI;

// Lexer rules
NUMBER: [0-9]+;
WS: [ \t\r\n]+ -> skip;
