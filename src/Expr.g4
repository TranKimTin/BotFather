grammar Expr;

expr
    : expr ('*' | '/') expr     # MulDiv
    | expr ('+' | '-') expr     # AddSub
    | expr comparisonOp expr    # Comparison
    | '(' expr ')'              # Parens
    | INT                       # Int
    | FLOAT                     # Float
    | STRING                    # String
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
    | upper_shadow              # iUpperShadow
    | upper_shadowP             # iUpperShadowP
    | lower_shadow              # iLowerShadow
    | lower_shadowP             # iLowerShadowP
    | rsi                       # iRSI
    | rsi_slope                 # iRSISlope
    | ma                        # iMA
    | ema                       # iEMA
    | macd_value                # iMACD_value
    | macd_signal               # iMACD_signal
    | macd_histogram            # iMACD_histogram
    | bb_upper                  # iBB_up
    | bb_middle                 # iBB_mid
    | bb_lower                  # iBB_low
    | rsi_phan_ki               # iRSI_phan_ki
    | macd_n_dinh               # iMACD_n_dinh
    | macd_slope                # iMACD_slope
    | bullish_engulfing         # iBullish_engulfing
    | bearish_engulfing         # iBearish_engulfing
    | bullish_hammer            # iBullish_hammer
    | bearish_hammer            # iBearish_hammer
    | bullish                   # iBullish
    | bearish                   # iBearish
    | marsi                     # iMARSI
    ;

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
upper_shadow: 'upper_shadow' '(' INT? ')';
upper_shadowP: 'upper_shadow%' '(' INT? ')';
lower_shadow: 'lower_shadow' '(' INT? ')';
lower_shadowP: 'lower_shadow%' '(' INT? ')';
rsi: 'rsi' '(' INT (',' INT)? ')';
rsi_slope: 'rsi_slope' '(' INT (',' INT)? ')';
ma: 'ma' '(' INT (',' INT)? ')';
ema: 'ema' '(' INT (',' INT)? ')';
macd_value: 'macd_value' '(' INT ',' INT ',' INT (',' INT)? ')';
macd_signal: 'macd_signal' '(' INT ',' INT ',' INT (',' INT)? ')';
macd_histogram: 'macd_histogram' '(' INT ',' INT ',' INT (',' INT)? ')';
bb_upper: 'bb_upper' '(' INT ','  number (',' INT)? ')';
bb_middle: 'bb_middle' '(' INT ','  number (',' INT)? ')';
bb_lower: 'bb_lower' '(' INT ','  number (',' INT)? ')';
rsi_phan_ki: 'rsi_phan_ki' '(' INT ','  number ','  INT ','  INT ','  number ','  number (',' INT)? ')';
macd_n_dinh: 'macd_n_dinh' '(' INT ',' INT ',' INT ',' INT ',' INT ',' INT ','  number ',' INT (',' number)* ')';
macd_slope: 'macd_slope' '(' INT ',' INT ',' INT (',' INT)? ')';
bullish_engulfing: 'bullish_engulfing' '(' INT? ')';
bearish_engulfing: 'bearish_engulfing' '(' INT? ')';
bullish_hammer: 'bullish_hammer' '(' INT? ')';
bearish_hammer: 'bearish_hammer' '(' INT? ')';
bullish: 'bullish' '(' INT? ')';
bearish: 'bearish' '(' INT? ')';
marsi: 'marsi' '(' INT ',' INT (',' INT)? ')';

comparisonOp
    : '>'
    | '>='
    | '<'
    | '<='
    | '=='
    | '='
    ;

number: INT | FLOAT;

// Lexer rules
INT: '-'? [0-9]+ ;
FLOAT: '-'? [0-9]+ '.' ([0-9]+)?;
STRING: '\'' (~['\r\n])* '\'';
WS: [ \t\r\n]+ -> skip;
