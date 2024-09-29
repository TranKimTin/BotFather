grammar Expr;

expr
    : expr ('*' | '/') expr     # MulDiv
    | expr ('+' | '-') expr     # AddSub
    | expr comparisonOp expr    # Comparison
    | '(' expr ')'              # Parens
    | INT                       # Int
    | FLOAT                     # Float
    | STRING                    # String
    | rsi                       # iRSI
    | broker                    # iBroker
    | symbol                    # iSymbol
    | timeframe                 # iTimeframe
    | hour                      # iHour
    | minute                    # iMinute
    | open                      # iOpen
    | high                      # iHigh
    | low                       # iLow
    | close                     # iClose
    | volume                    # iVolume
    | volume24h_in_usd          # iVolume24hInUSD
    | change                    # iChange
    | changeP                   # iChangeP
    | ampl                      # iAmpl
    | amplP                     # iAmplP
    ;

rsi: 'rsi' '(' INT (',' INT)? ')'     # RSI;
broker: 'broker' '(' ')';
symbol: 'symbol' '(' ')';
timeframe: 'timeframe' '(' ')';
hour: 'hour' '(' ')';
minute: 'minute' '(' ')';
open: 'open' '(' INT? ')';
high: 'high' '(' INT? ')';
low: 'low' '(' INT? ')';
close: 'close' '(' INT? ')';
volume: 'volume' '(' INT? ')';
volume24h_in_usd: 'volume24h_in_usd' '(' ')';
change: 'change' '(' INT? ')';
changeP: 'change%' '(' INT? ')';
ampl: 'ampl' '(' INT? ')';
amplP: 'ampl%' '(' INT? ')';

comparisonOp
    : '>'
    | '>='
    | '<'
    | '<='
    | '='
    ;

// Lexer rules
INT: '-'? [0-9]+ ;
FLOAT: '-'? [0-9]+ ('.' [0-9]+)? ([eE] [+\-]? [0-9]+)? ;
STRING: '\'' (~['\r\n])* '\'';
WS: [ \t\r\n]+ -> skip;
