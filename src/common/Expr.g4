grammar Expr;

expr
    : expr ('*' | '/') expr     # MulDiv
    | expr ('+' | '-') expr     # AddSub
    | '-' expr                  # Negative
    | '+' expr                  # Positive
    | expr comparisonOp expr    # Comparison
    | '(' expr ')'              # Parens
    | 'abs(' expr ')'           # ABS
    | 'min(' expr (',' expr)*  ')' # MIN
    | 'max(' expr (',' expr)*  ')' # MAX
    | INT                       # Int
    | FLOAT                     # Float
    | STRING                    # String
    | hour                      # iHour
    | minute                    # iMinute
    | open                      # iOpen
    | high                      # iHigh
    | low                       # iLow
    | close                     # iClose
    | volume                    # iVolume
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
    | macd_n_dinh               # iMACD_n_dinh
    | macd_slope                # iMACD_slope
    | bullish_engulfing         # iBullish_engulfing
    | bearish_engulfing         # iBearish_engulfing
    | bullish_hammer            # iBullish_hammer
    | bearish_hammer            # iBearish_hammer
    | marsi                     # iMARSI
    | doji                      # iDoji
    | avg_open                  # iAvgOpen
    | avg_high                  # iAvgHigh
    | avg_low                   # iAvgLow
    | avg_close                 # iAvgClose    
    | avg_ampl                  # iAvgAmpl    
    | avg_amplP                 # iAvgAmplP
    | max_open                  # iMaxOpen
    | max_high                  # iMaxHigh
    | max_low                   # iMaxLow
    | max_close                 # iMaxClose   
    | min_open                  # iMinOpen
    | min_high                  # iMinHigh
    | min_low                   # iMinLow
    | min_close                 # iMinClose
    | min_rsi                   # iMinRSI
    | max_rsi                   # iMaxRSI  
    | min_change                # iMinChange
    | max_change                # iMaxChange
    | min_changeP               # iMinChangeP
    | max_changeP               # iMaxChangeP
    | min_ampl                  # iMinAmpl
    | max_ampl                  # iMaxAmpl
    | min_amplP                 # iMinAmplP
    | max_amplP                 # iMaxAmplP
    | funding_rate              # iFundingRate
    ;

hour: 'hour' '(' ')';
minute: 'minute' '(' ')';
open: 'open' '(' INT? ')';
high: 'high' '(' INT? ')';
low: 'low' '(' INT? ')';
close: 'close' '(' INT? ')';
volume: 'volume' '(' INT? ')';
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
macd_n_dinh: 'macd_n_dinh' '(' INT ',' INT ',' INT ',' INT ',' INT ',' INT ','  number ',' INT (',' number)* ')';
macd_slope: 'macd_slope' '(' INT ',' INT ',' INT (',' INT)? ')';
bullish_engulfing: 'bullish_engulfing' '(' INT? ')';
bearish_engulfing: 'bearish_engulfing' '(' INT? ')';
bullish_hammer: 'bullish_hammer' '(' INT? ')';
bearish_hammer: 'bearish_hammer' '(' INT? ')';
marsi: 'marsi' '(' INT ',' INT (',' INT)? ')';
doji: 'doji' '(' INT? ')';
avg_open: 'avg_open' '(' INT (',' INT)? ')';
avg_high: 'avg_high' '(' INT (',' INT)? ')';
avg_low: 'avg_low' '(' INT (',' INT)? ')';
avg_close: 'avg_close' '(' INT (',' INT)? ')';
avg_ampl: 'avg_ampl' '(' INT (',' INT)? ')';
avg_amplP: 'avg_ampl%' '(' INT (',' INT)? ')';
max_open: 'max_open' '(' INT (',' INT)? ')';
max_high: 'max_high' '(' INT (',' INT)? ')';
max_low: 'max_low' '(' INT (',' INT)? ')';
max_close: 'max_close' '(' INT (',' INT)? ')';
min_open: 'min_open' '(' INT (',' INT)? ')';
min_high: 'min_high' '(' INT (',' INT)? ')';
min_low: 'min_low' '(' INT (',' INT)? ')';
min_close: 'min_close' '(' INT (',' INT)? ')';
min_rsi: 'min_rsi' '(' INT ',' INT (',' INT)? ')';
max_rsi: 'max_rsi' '(' INT ',' INT (',' INT)? ')';
min_change: 'min_change' '(' INT (',' INT)? ')';
max_change: 'max_change' '(' INT (',' INT)? ')';
min_changeP: 'min_change%' '(' INT (',' INT)? ')';
max_changeP: 'max_change%' '(' INT (',' INT)? ')';
min_ampl: 'min_ampl' '(' INT (',' INT)? ')';
max_ampl: 'max_ampl' '(' INT (',' INT)? ')';
min_amplP: 'min_ampl%' '(' INT (',' INT)? ')';
max_amplP: 'max_ampl%' '(' INT (',' INT)? ')';
funding_rate: 'funding_rate' '(' ')';

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
