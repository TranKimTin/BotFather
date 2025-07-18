
// Generated from src/common/Expr.g4 by ANTLR 4.13.1


#include "ExprVisitor.h"

#include "ExprParser.h"


using namespace antlrcpp;

using namespace antlr4;

namespace {

struct ExprParserStaticData final {
  ExprParserStaticData(std::vector<std::string> ruleNames,
                        std::vector<std::string> literalNames,
                        std::vector<std::string> symbolicNames)
      : ruleNames(std::move(ruleNames)), literalNames(std::move(literalNames)),
        symbolicNames(std::move(symbolicNames)),
        vocabulary(this->literalNames, this->symbolicNames) {}

  ExprParserStaticData(const ExprParserStaticData&) = delete;
  ExprParserStaticData(ExprParserStaticData&&) = delete;
  ExprParserStaticData& operator=(const ExprParserStaticData&) = delete;
  ExprParserStaticData& operator=(ExprParserStaticData&&) = delete;

  std::vector<antlr4::dfa::DFA> decisionToDFA;
  antlr4::atn::PredictionContextCache sharedContextCache;
  const std::vector<std::string> ruleNames;
  const std::vector<std::string> literalNames;
  const std::vector<std::string> symbolicNames;
  const antlr4::dfa::Vocabulary vocabulary;
  antlr4::atn::SerializedATNView serializedATN;
  std::unique_ptr<antlr4::atn::ATN> atn;
};

::antlr4::internal::OnceFlag exprParserOnceFlag;
#if ANTLR4_USE_THREAD_LOCAL_CACHE
static thread_local
#endif
ExprParserStaticData *exprParserStaticData = nullptr;

void exprParserInitialize() {
#if ANTLR4_USE_THREAD_LOCAL_CACHE
  if (exprParserStaticData != nullptr) {
    return;
  }
#else
  assert(exprParserStaticData == nullptr);
#endif
  auto staticData = std::make_unique<ExprParserStaticData>(
    std::vector<std::string>{
      "expr", "hour", "minute", "open", "high", "low", "close", "volume", 
      "change", "changeP", "ampl", "amplP", "upper_shadow", "upper_shadowP", 
      "lower_shadow", "lower_shadowP", "rsi", "rsi_slope", "ma", "ema", 
      "macd_value", "macd_signal", "macd_histogram", "bb_upper", "bb_middle", 
      "bb_lower", "macd_n_dinh", "macd_slope", "bullish_engulfing", "bearish_engulfing", 
      "bullish_hammer", "bearish_hammer", "bullish", "bearish", "marsi", 
      "doji", "avg_open", "avg_high", "avg_low", "avg_close", "avg_ampl", 
      "avg_amplP", "max_open", "max_high", "max_low", "max_close", "min_open", 
      "min_high", "min_low", "min_close", "min_rsi", "max_rsi", "min_change", 
      "max_change", "min_changeP", "max_changeP", "min_ampl", "max_ampl", 
      "min_amplP", "max_amplP", "comparisonOp", "number"
    },
    std::vector<std::string>{
      "", "'*'", "'/'", "'+'", "'-'", "'('", "')'", "'abs('", "'min('", 
      "','", "'max('", "'hour'", "'minute'", "'open'", "'high'", "'low'", 
      "'close'", "'volume'", "'change'", "'change%'", "'ampl'", "'ampl%'", 
      "'upper_shadow'", "'upper_shadow%'", "'lower_shadow'", "'lower_shadow%'", 
      "'rsi'", "'rsi_slope'", "'ma'", "'ema'", "'macd_value'", "'macd_signal'", 
      "'macd_histogram'", "'bb_upper'", "'bb_middle'", "'bb_lower'", "'macd_n_dinh'", 
      "'macd_slope'", "'bullish_engulfing'", "'bearish_engulfing'", "'bullish_hammer'", 
      "'bearish_hammer'", "'bullish'", "'bearish'", "'marsi'", "'doji'", 
      "'avg_open'", "'avg_high'", "'avg_low'", "'avg_close'", "'avg_ampl'", 
      "'avg_ampl%'", "'max_open'", "'max_high'", "'max_low'", "'max_close'", 
      "'min_open'", "'min_high'", "'min_low'", "'min_close'", "'min_rsi'", 
      "'max_rsi'", "'min_change'", "'max_change'", "'min_change%'", "'max_change%'", 
      "'min_ampl'", "'max_ampl'", "'min_ampl%'", "'max_ampl%'", "'>'", "'>='", 
      "'<'", "'<='", "'=='", "'='"
    },
    std::vector<std::string>{
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 
      "", "", "", "", "", "", "", "", "INT", "FLOAT", "STRING", "WS"
    }
  );
  static const int32_t serializedATNSegment[] = {
  	4,1,79,769,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,
  	7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,
  	14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,
  	21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,
  	28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,
  	35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,
  	42,2,43,7,43,2,44,7,44,2,45,7,45,2,46,7,46,2,47,7,47,2,48,7,48,2,49,7,
  	49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,7,53,2,54,7,54,2,55,7,55,2,56,7,
  	56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,60,2,61,7,61,1,0,1,0,1,0,1,0,
  	1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,142,8,0,10,0,
  	12,0,145,9,0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,153,8,0,10,0,12,0,156,9,0,1,
  	0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
  	1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,
  	0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
  	1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,222,8,0,1,0,1,0,1,0,1,
  	0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,234,8,0,10,0,12,0,237,9,0,1,1,1,1,1,1,1,
  	1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,3,3,250,8,3,1,3,1,3,1,4,1,4,1,4,3,4,257,
  	8,4,1,4,1,4,1,5,1,5,1,5,3,5,264,8,5,1,5,1,5,1,6,1,6,1,6,3,6,271,8,6,1,
  	6,1,6,1,7,1,7,1,7,3,7,278,8,7,1,7,1,7,1,8,1,8,1,8,3,8,285,8,8,1,8,1,8,
  	1,9,1,9,1,9,3,9,292,8,9,1,9,1,9,1,10,1,10,1,10,3,10,299,8,10,1,10,1,10,
  	1,11,1,11,1,11,3,11,306,8,11,1,11,1,11,1,12,1,12,1,12,3,12,313,8,12,1,
  	12,1,12,1,13,1,13,1,13,3,13,320,8,13,1,13,1,13,1,14,1,14,1,14,3,14,327,
  	8,14,1,14,1,14,1,15,1,15,1,15,3,15,334,8,15,1,15,1,15,1,16,1,16,1,16,
  	1,16,1,16,3,16,343,8,16,1,16,1,16,1,17,1,17,1,17,1,17,1,17,3,17,352,8,
  	17,1,17,1,17,1,18,1,18,1,18,1,18,1,18,3,18,361,8,18,1,18,1,18,1,19,1,
  	19,1,19,1,19,1,19,3,19,370,8,19,1,19,1,19,1,20,1,20,1,20,1,20,1,20,1,
  	20,1,20,1,20,1,20,3,20,383,8,20,1,20,1,20,1,21,1,21,1,21,1,21,1,21,1,
  	21,1,21,1,21,1,21,3,21,396,8,21,1,21,1,21,1,22,1,22,1,22,1,22,1,22,1,
  	22,1,22,1,22,1,22,3,22,409,8,22,1,22,1,22,1,23,1,23,1,23,1,23,1,23,1,
  	23,1,23,3,23,420,8,23,1,23,1,23,1,24,1,24,1,24,1,24,1,24,1,24,1,24,3,
  	24,431,8,24,1,24,1,24,1,25,1,25,1,25,1,25,1,25,1,25,1,25,3,25,442,8,25,
  	1,25,1,25,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,
  	1,26,1,26,1,26,1,26,1,26,1,26,1,26,5,26,465,8,26,10,26,12,26,468,9,26,
  	1,26,1,26,1,27,1,27,1,27,1,27,1,27,1,27,1,27,1,27,1,27,3,27,481,8,27,
  	1,27,1,27,1,28,1,28,1,28,3,28,488,8,28,1,28,1,28,1,29,1,29,1,29,3,29,
  	495,8,29,1,29,1,29,1,30,1,30,1,30,3,30,502,8,30,1,30,1,30,1,31,1,31,1,
  	31,3,31,509,8,31,1,31,1,31,1,32,1,32,1,32,3,32,516,8,32,1,32,1,32,1,33,
  	1,33,1,33,3,33,523,8,33,1,33,1,33,1,34,1,34,1,34,1,34,1,34,1,34,1,34,
  	3,34,534,8,34,1,34,1,34,1,35,1,35,1,35,3,35,541,8,35,1,35,1,35,1,36,1,
  	36,1,36,1,36,1,36,3,36,550,8,36,1,36,1,36,1,37,1,37,1,37,1,37,1,37,3,
  	37,559,8,37,1,37,1,37,1,38,1,38,1,38,1,38,1,38,3,38,568,8,38,1,38,1,38,
  	1,39,1,39,1,39,1,39,1,39,3,39,577,8,39,1,39,1,39,1,40,1,40,1,40,1,40,
  	1,40,3,40,586,8,40,1,40,1,40,1,41,1,41,1,41,1,41,1,41,3,41,595,8,41,1,
  	41,1,41,1,42,1,42,1,42,1,42,1,42,3,42,604,8,42,1,42,1,42,1,43,1,43,1,
  	43,1,43,1,43,3,43,613,8,43,1,43,1,43,1,44,1,44,1,44,1,44,1,44,3,44,622,
  	8,44,1,44,1,44,1,45,1,45,1,45,1,45,1,45,3,45,631,8,45,1,45,1,45,1,46,
  	1,46,1,46,1,46,1,46,3,46,640,8,46,1,46,1,46,1,47,1,47,1,47,1,47,1,47,
  	3,47,649,8,47,1,47,1,47,1,48,1,48,1,48,1,48,1,48,3,48,658,8,48,1,48,1,
  	48,1,49,1,49,1,49,1,49,1,49,3,49,667,8,49,1,49,1,49,1,50,1,50,1,50,1,
  	50,1,50,1,50,1,50,3,50,678,8,50,1,50,1,50,1,51,1,51,1,51,1,51,1,51,1,
  	51,1,51,3,51,689,8,51,1,51,1,51,1,52,1,52,1,52,1,52,1,52,3,52,698,8,52,
  	1,52,1,52,1,53,1,53,1,53,1,53,1,53,3,53,707,8,53,1,53,1,53,1,54,1,54,
  	1,54,1,54,1,54,3,54,716,8,54,1,54,1,54,1,55,1,55,1,55,1,55,1,55,3,55,
  	725,8,55,1,55,1,55,1,56,1,56,1,56,1,56,1,56,3,56,734,8,56,1,56,1,56,1,
  	57,1,57,1,57,1,57,1,57,3,57,743,8,57,1,57,1,57,1,58,1,58,1,58,1,58,1,
  	58,3,58,752,8,58,1,58,1,58,1,59,1,59,1,59,1,59,1,59,3,59,761,8,59,1,59,
  	1,59,1,60,1,60,1,61,1,61,1,61,0,1,0,62,0,2,4,6,8,10,12,14,16,18,20,22,
  	24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,
  	70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,
  	112,114,116,118,120,122,0,4,1,0,1,2,1,0,3,4,1,0,70,75,1,0,76,77,835,0,
  	221,1,0,0,0,2,238,1,0,0,0,4,242,1,0,0,0,6,246,1,0,0,0,8,253,1,0,0,0,10,
  	260,1,0,0,0,12,267,1,0,0,0,14,274,1,0,0,0,16,281,1,0,0,0,18,288,1,0,0,
  	0,20,295,1,0,0,0,22,302,1,0,0,0,24,309,1,0,0,0,26,316,1,0,0,0,28,323,
  	1,0,0,0,30,330,1,0,0,0,32,337,1,0,0,0,34,346,1,0,0,0,36,355,1,0,0,0,38,
  	364,1,0,0,0,40,373,1,0,0,0,42,386,1,0,0,0,44,399,1,0,0,0,46,412,1,0,0,
  	0,48,423,1,0,0,0,50,434,1,0,0,0,52,445,1,0,0,0,54,471,1,0,0,0,56,484,
  	1,0,0,0,58,491,1,0,0,0,60,498,1,0,0,0,62,505,1,0,0,0,64,512,1,0,0,0,66,
  	519,1,0,0,0,68,526,1,0,0,0,70,537,1,0,0,0,72,544,1,0,0,0,74,553,1,0,0,
  	0,76,562,1,0,0,0,78,571,1,0,0,0,80,580,1,0,0,0,82,589,1,0,0,0,84,598,
  	1,0,0,0,86,607,1,0,0,0,88,616,1,0,0,0,90,625,1,0,0,0,92,634,1,0,0,0,94,
  	643,1,0,0,0,96,652,1,0,0,0,98,661,1,0,0,0,100,670,1,0,0,0,102,681,1,0,
  	0,0,104,692,1,0,0,0,106,701,1,0,0,0,108,710,1,0,0,0,110,719,1,0,0,0,112,
  	728,1,0,0,0,114,737,1,0,0,0,116,746,1,0,0,0,118,755,1,0,0,0,120,764,1,
  	0,0,0,122,766,1,0,0,0,124,125,6,0,-1,0,125,126,5,4,0,0,126,222,3,0,0,
  	69,127,128,5,3,0,0,128,222,3,0,0,68,129,130,5,5,0,0,130,131,3,0,0,0,131,
  	132,5,6,0,0,132,222,1,0,0,0,133,134,5,7,0,0,134,135,3,0,0,0,135,136,5,
  	6,0,0,136,222,1,0,0,0,137,138,5,8,0,0,138,143,3,0,0,0,139,140,5,9,0,0,
  	140,142,3,0,0,0,141,139,1,0,0,0,142,145,1,0,0,0,143,141,1,0,0,0,143,144,
  	1,0,0,0,144,146,1,0,0,0,145,143,1,0,0,0,146,147,5,6,0,0,147,222,1,0,0,
  	0,148,149,5,10,0,0,149,154,3,0,0,0,150,151,5,9,0,0,151,153,3,0,0,0,152,
  	150,1,0,0,0,153,156,1,0,0,0,154,152,1,0,0,0,154,155,1,0,0,0,155,157,1,
  	0,0,0,156,154,1,0,0,0,157,158,5,6,0,0,158,222,1,0,0,0,159,222,5,76,0,
  	0,160,222,5,77,0,0,161,222,5,78,0,0,162,222,3,2,1,0,163,222,3,4,2,0,164,
  	222,3,6,3,0,165,222,3,8,4,0,166,222,3,10,5,0,167,222,3,12,6,0,168,222,
  	3,14,7,0,169,222,3,16,8,0,170,222,3,18,9,0,171,222,3,20,10,0,172,222,
  	3,22,11,0,173,222,3,24,12,0,174,222,3,26,13,0,175,222,3,28,14,0,176,222,
  	3,30,15,0,177,222,3,32,16,0,178,222,3,34,17,0,179,222,3,36,18,0,180,222,
  	3,38,19,0,181,222,3,40,20,0,182,222,3,42,21,0,183,222,3,44,22,0,184,222,
  	3,46,23,0,185,222,3,48,24,0,186,222,3,50,25,0,187,222,3,52,26,0,188,222,
  	3,54,27,0,189,222,3,56,28,0,190,222,3,58,29,0,191,222,3,60,30,0,192,222,
  	3,62,31,0,193,222,3,64,32,0,194,222,3,66,33,0,195,222,3,68,34,0,196,222,
  	3,70,35,0,197,222,3,72,36,0,198,222,3,74,37,0,199,222,3,76,38,0,200,222,
  	3,78,39,0,201,222,3,80,40,0,202,222,3,82,41,0,203,222,3,84,42,0,204,222,
  	3,86,43,0,205,222,3,88,44,0,206,222,3,90,45,0,207,222,3,92,46,0,208,222,
  	3,94,47,0,209,222,3,96,48,0,210,222,3,98,49,0,211,222,3,100,50,0,212,
  	222,3,102,51,0,213,222,3,104,52,0,214,222,3,106,53,0,215,222,3,108,54,
  	0,216,222,3,110,55,0,217,222,3,112,56,0,218,222,3,114,57,0,219,222,3,
  	116,58,0,220,222,3,118,59,0,221,124,1,0,0,0,221,127,1,0,0,0,221,129,1,
  	0,0,0,221,133,1,0,0,0,221,137,1,0,0,0,221,148,1,0,0,0,221,159,1,0,0,0,
  	221,160,1,0,0,0,221,161,1,0,0,0,221,162,1,0,0,0,221,163,1,0,0,0,221,164,
  	1,0,0,0,221,165,1,0,0,0,221,166,1,0,0,0,221,167,1,0,0,0,221,168,1,0,0,
  	0,221,169,1,0,0,0,221,170,1,0,0,0,221,171,1,0,0,0,221,172,1,0,0,0,221,
  	173,1,0,0,0,221,174,1,0,0,0,221,175,1,0,0,0,221,176,1,0,0,0,221,177,1,
  	0,0,0,221,178,1,0,0,0,221,179,1,0,0,0,221,180,1,0,0,0,221,181,1,0,0,0,
  	221,182,1,0,0,0,221,183,1,0,0,0,221,184,1,0,0,0,221,185,1,0,0,0,221,186,
  	1,0,0,0,221,187,1,0,0,0,221,188,1,0,0,0,221,189,1,0,0,0,221,190,1,0,0,
  	0,221,191,1,0,0,0,221,192,1,0,0,0,221,193,1,0,0,0,221,194,1,0,0,0,221,
  	195,1,0,0,0,221,196,1,0,0,0,221,197,1,0,0,0,221,198,1,0,0,0,221,199,1,
  	0,0,0,221,200,1,0,0,0,221,201,1,0,0,0,221,202,1,0,0,0,221,203,1,0,0,0,
  	221,204,1,0,0,0,221,205,1,0,0,0,221,206,1,0,0,0,221,207,1,0,0,0,221,208,
  	1,0,0,0,221,209,1,0,0,0,221,210,1,0,0,0,221,211,1,0,0,0,221,212,1,0,0,
  	0,221,213,1,0,0,0,221,214,1,0,0,0,221,215,1,0,0,0,221,216,1,0,0,0,221,
  	217,1,0,0,0,221,218,1,0,0,0,221,219,1,0,0,0,221,220,1,0,0,0,222,235,1,
  	0,0,0,223,224,10,71,0,0,224,225,7,0,0,0,225,234,3,0,0,72,226,227,10,70,
  	0,0,227,228,7,1,0,0,228,234,3,0,0,71,229,230,10,67,0,0,230,231,3,120,
  	60,0,231,232,3,0,0,68,232,234,1,0,0,0,233,223,1,0,0,0,233,226,1,0,0,0,
  	233,229,1,0,0,0,234,237,1,0,0,0,235,233,1,0,0,0,235,236,1,0,0,0,236,1,
  	1,0,0,0,237,235,1,0,0,0,238,239,5,11,0,0,239,240,5,5,0,0,240,241,5,6,
  	0,0,241,3,1,0,0,0,242,243,5,12,0,0,243,244,5,5,0,0,244,245,5,6,0,0,245,
  	5,1,0,0,0,246,247,5,13,0,0,247,249,5,5,0,0,248,250,5,76,0,0,249,248,1,
  	0,0,0,249,250,1,0,0,0,250,251,1,0,0,0,251,252,5,6,0,0,252,7,1,0,0,0,253,
  	254,5,14,0,0,254,256,5,5,0,0,255,257,5,76,0,0,256,255,1,0,0,0,256,257,
  	1,0,0,0,257,258,1,0,0,0,258,259,5,6,0,0,259,9,1,0,0,0,260,261,5,15,0,
  	0,261,263,5,5,0,0,262,264,5,76,0,0,263,262,1,0,0,0,263,264,1,0,0,0,264,
  	265,1,0,0,0,265,266,5,6,0,0,266,11,1,0,0,0,267,268,5,16,0,0,268,270,5,
  	5,0,0,269,271,5,76,0,0,270,269,1,0,0,0,270,271,1,0,0,0,271,272,1,0,0,
  	0,272,273,5,6,0,0,273,13,1,0,0,0,274,275,5,17,0,0,275,277,5,5,0,0,276,
  	278,5,76,0,0,277,276,1,0,0,0,277,278,1,0,0,0,278,279,1,0,0,0,279,280,
  	5,6,0,0,280,15,1,0,0,0,281,282,5,18,0,0,282,284,5,5,0,0,283,285,5,76,
  	0,0,284,283,1,0,0,0,284,285,1,0,0,0,285,286,1,0,0,0,286,287,5,6,0,0,287,
  	17,1,0,0,0,288,289,5,19,0,0,289,291,5,5,0,0,290,292,5,76,0,0,291,290,
  	1,0,0,0,291,292,1,0,0,0,292,293,1,0,0,0,293,294,5,6,0,0,294,19,1,0,0,
  	0,295,296,5,20,0,0,296,298,5,5,0,0,297,299,5,76,0,0,298,297,1,0,0,0,298,
  	299,1,0,0,0,299,300,1,0,0,0,300,301,5,6,0,0,301,21,1,0,0,0,302,303,5,
  	21,0,0,303,305,5,5,0,0,304,306,5,76,0,0,305,304,1,0,0,0,305,306,1,0,0,
  	0,306,307,1,0,0,0,307,308,5,6,0,0,308,23,1,0,0,0,309,310,5,22,0,0,310,
  	312,5,5,0,0,311,313,5,76,0,0,312,311,1,0,0,0,312,313,1,0,0,0,313,314,
  	1,0,0,0,314,315,5,6,0,0,315,25,1,0,0,0,316,317,5,23,0,0,317,319,5,5,0,
  	0,318,320,5,76,0,0,319,318,1,0,0,0,319,320,1,0,0,0,320,321,1,0,0,0,321,
  	322,5,6,0,0,322,27,1,0,0,0,323,324,5,24,0,0,324,326,5,5,0,0,325,327,5,
  	76,0,0,326,325,1,0,0,0,326,327,1,0,0,0,327,328,1,0,0,0,328,329,5,6,0,
  	0,329,29,1,0,0,0,330,331,5,25,0,0,331,333,5,5,0,0,332,334,5,76,0,0,333,
  	332,1,0,0,0,333,334,1,0,0,0,334,335,1,0,0,0,335,336,5,6,0,0,336,31,1,
  	0,0,0,337,338,5,26,0,0,338,339,5,5,0,0,339,342,5,76,0,0,340,341,5,9,0,
  	0,341,343,5,76,0,0,342,340,1,0,0,0,342,343,1,0,0,0,343,344,1,0,0,0,344,
  	345,5,6,0,0,345,33,1,0,0,0,346,347,5,27,0,0,347,348,5,5,0,0,348,351,5,
  	76,0,0,349,350,5,9,0,0,350,352,5,76,0,0,351,349,1,0,0,0,351,352,1,0,0,
  	0,352,353,1,0,0,0,353,354,5,6,0,0,354,35,1,0,0,0,355,356,5,28,0,0,356,
  	357,5,5,0,0,357,360,5,76,0,0,358,359,5,9,0,0,359,361,5,76,0,0,360,358,
  	1,0,0,0,360,361,1,0,0,0,361,362,1,0,0,0,362,363,5,6,0,0,363,37,1,0,0,
  	0,364,365,5,29,0,0,365,366,5,5,0,0,366,369,5,76,0,0,367,368,5,9,0,0,368,
  	370,5,76,0,0,369,367,1,0,0,0,369,370,1,0,0,0,370,371,1,0,0,0,371,372,
  	5,6,0,0,372,39,1,0,0,0,373,374,5,30,0,0,374,375,5,5,0,0,375,376,5,76,
  	0,0,376,377,5,9,0,0,377,378,5,76,0,0,378,379,5,9,0,0,379,382,5,76,0,0,
  	380,381,5,9,0,0,381,383,5,76,0,0,382,380,1,0,0,0,382,383,1,0,0,0,383,
  	384,1,0,0,0,384,385,5,6,0,0,385,41,1,0,0,0,386,387,5,31,0,0,387,388,5,
  	5,0,0,388,389,5,76,0,0,389,390,5,9,0,0,390,391,5,76,0,0,391,392,5,9,0,
  	0,392,395,5,76,0,0,393,394,5,9,0,0,394,396,5,76,0,0,395,393,1,0,0,0,395,
  	396,1,0,0,0,396,397,1,0,0,0,397,398,5,6,0,0,398,43,1,0,0,0,399,400,5,
  	32,0,0,400,401,5,5,0,0,401,402,5,76,0,0,402,403,5,9,0,0,403,404,5,76,
  	0,0,404,405,5,9,0,0,405,408,5,76,0,0,406,407,5,9,0,0,407,409,5,76,0,0,
  	408,406,1,0,0,0,408,409,1,0,0,0,409,410,1,0,0,0,410,411,5,6,0,0,411,45,
  	1,0,0,0,412,413,5,33,0,0,413,414,5,5,0,0,414,415,5,76,0,0,415,416,5,9,
  	0,0,416,419,3,122,61,0,417,418,5,9,0,0,418,420,5,76,0,0,419,417,1,0,0,
  	0,419,420,1,0,0,0,420,421,1,0,0,0,421,422,5,6,0,0,422,47,1,0,0,0,423,
  	424,5,34,0,0,424,425,5,5,0,0,425,426,5,76,0,0,426,427,5,9,0,0,427,430,
  	3,122,61,0,428,429,5,9,0,0,429,431,5,76,0,0,430,428,1,0,0,0,430,431,1,
  	0,0,0,431,432,1,0,0,0,432,433,5,6,0,0,433,49,1,0,0,0,434,435,5,35,0,0,
  	435,436,5,5,0,0,436,437,5,76,0,0,437,438,5,9,0,0,438,441,3,122,61,0,439,
  	440,5,9,0,0,440,442,5,76,0,0,441,439,1,0,0,0,441,442,1,0,0,0,442,443,
  	1,0,0,0,443,444,5,6,0,0,444,51,1,0,0,0,445,446,5,36,0,0,446,447,5,5,0,
  	0,447,448,5,76,0,0,448,449,5,9,0,0,449,450,5,76,0,0,450,451,5,9,0,0,451,
  	452,5,76,0,0,452,453,5,9,0,0,453,454,5,76,0,0,454,455,5,9,0,0,455,456,
  	5,76,0,0,456,457,5,9,0,0,457,458,5,76,0,0,458,459,5,9,0,0,459,460,3,122,
  	61,0,460,461,5,9,0,0,461,466,5,76,0,0,462,463,5,9,0,0,463,465,3,122,61,
  	0,464,462,1,0,0,0,465,468,1,0,0,0,466,464,1,0,0,0,466,467,1,0,0,0,467,
  	469,1,0,0,0,468,466,1,0,0,0,469,470,5,6,0,0,470,53,1,0,0,0,471,472,5,
  	37,0,0,472,473,5,5,0,0,473,474,5,76,0,0,474,475,5,9,0,0,475,476,5,76,
  	0,0,476,477,5,9,0,0,477,480,5,76,0,0,478,479,5,9,0,0,479,481,5,76,0,0,
  	480,478,1,0,0,0,480,481,1,0,0,0,481,482,1,0,0,0,482,483,5,6,0,0,483,55,
  	1,0,0,0,484,485,5,38,0,0,485,487,5,5,0,0,486,488,5,76,0,0,487,486,1,0,
  	0,0,487,488,1,0,0,0,488,489,1,0,0,0,489,490,5,6,0,0,490,57,1,0,0,0,491,
  	492,5,39,0,0,492,494,5,5,0,0,493,495,5,76,0,0,494,493,1,0,0,0,494,495,
  	1,0,0,0,495,496,1,0,0,0,496,497,5,6,0,0,497,59,1,0,0,0,498,499,5,40,0,
  	0,499,501,5,5,0,0,500,502,5,76,0,0,501,500,1,0,0,0,501,502,1,0,0,0,502,
  	503,1,0,0,0,503,504,5,6,0,0,504,61,1,0,0,0,505,506,5,41,0,0,506,508,5,
  	5,0,0,507,509,5,76,0,0,508,507,1,0,0,0,508,509,1,0,0,0,509,510,1,0,0,
  	0,510,511,5,6,0,0,511,63,1,0,0,0,512,513,5,42,0,0,513,515,5,5,0,0,514,
  	516,5,76,0,0,515,514,1,0,0,0,515,516,1,0,0,0,516,517,1,0,0,0,517,518,
  	5,6,0,0,518,65,1,0,0,0,519,520,5,43,0,0,520,522,5,5,0,0,521,523,5,76,
  	0,0,522,521,1,0,0,0,522,523,1,0,0,0,523,524,1,0,0,0,524,525,5,6,0,0,525,
  	67,1,0,0,0,526,527,5,44,0,0,527,528,5,5,0,0,528,529,5,76,0,0,529,530,
  	5,9,0,0,530,533,5,76,0,0,531,532,5,9,0,0,532,534,5,76,0,0,533,531,1,0,
  	0,0,533,534,1,0,0,0,534,535,1,0,0,0,535,536,5,6,0,0,536,69,1,0,0,0,537,
  	538,5,45,0,0,538,540,5,5,0,0,539,541,5,76,0,0,540,539,1,0,0,0,540,541,
  	1,0,0,0,541,542,1,0,0,0,542,543,5,6,0,0,543,71,1,0,0,0,544,545,5,46,0,
  	0,545,546,5,5,0,0,546,549,5,76,0,0,547,548,5,9,0,0,548,550,5,76,0,0,549,
  	547,1,0,0,0,549,550,1,0,0,0,550,551,1,0,0,0,551,552,5,6,0,0,552,73,1,
  	0,0,0,553,554,5,47,0,0,554,555,5,5,0,0,555,558,5,76,0,0,556,557,5,9,0,
  	0,557,559,5,76,0,0,558,556,1,0,0,0,558,559,1,0,0,0,559,560,1,0,0,0,560,
  	561,5,6,0,0,561,75,1,0,0,0,562,563,5,48,0,0,563,564,5,5,0,0,564,567,5,
  	76,0,0,565,566,5,9,0,0,566,568,5,76,0,0,567,565,1,0,0,0,567,568,1,0,0,
  	0,568,569,1,0,0,0,569,570,5,6,0,0,570,77,1,0,0,0,571,572,5,49,0,0,572,
  	573,5,5,0,0,573,576,5,76,0,0,574,575,5,9,0,0,575,577,5,76,0,0,576,574,
  	1,0,0,0,576,577,1,0,0,0,577,578,1,0,0,0,578,579,5,6,0,0,579,79,1,0,0,
  	0,580,581,5,50,0,0,581,582,5,5,0,0,582,585,5,76,0,0,583,584,5,9,0,0,584,
  	586,5,76,0,0,585,583,1,0,0,0,585,586,1,0,0,0,586,587,1,0,0,0,587,588,
  	5,6,0,0,588,81,1,0,0,0,589,590,5,51,0,0,590,591,5,5,0,0,591,594,5,76,
  	0,0,592,593,5,9,0,0,593,595,5,76,0,0,594,592,1,0,0,0,594,595,1,0,0,0,
  	595,596,1,0,0,0,596,597,5,6,0,0,597,83,1,0,0,0,598,599,5,52,0,0,599,600,
  	5,5,0,0,600,603,5,76,0,0,601,602,5,9,0,0,602,604,5,76,0,0,603,601,1,0,
  	0,0,603,604,1,0,0,0,604,605,1,0,0,0,605,606,5,6,0,0,606,85,1,0,0,0,607,
  	608,5,53,0,0,608,609,5,5,0,0,609,612,5,76,0,0,610,611,5,9,0,0,611,613,
  	5,76,0,0,612,610,1,0,0,0,612,613,1,0,0,0,613,614,1,0,0,0,614,615,5,6,
  	0,0,615,87,1,0,0,0,616,617,5,54,0,0,617,618,5,5,0,0,618,621,5,76,0,0,
  	619,620,5,9,0,0,620,622,5,76,0,0,621,619,1,0,0,0,621,622,1,0,0,0,622,
  	623,1,0,0,0,623,624,5,6,0,0,624,89,1,0,0,0,625,626,5,55,0,0,626,627,5,
  	5,0,0,627,630,5,76,0,0,628,629,5,9,0,0,629,631,5,76,0,0,630,628,1,0,0,
  	0,630,631,1,0,0,0,631,632,1,0,0,0,632,633,5,6,0,0,633,91,1,0,0,0,634,
  	635,5,56,0,0,635,636,5,5,0,0,636,639,5,76,0,0,637,638,5,9,0,0,638,640,
  	5,76,0,0,639,637,1,0,0,0,639,640,1,0,0,0,640,641,1,0,0,0,641,642,5,6,
  	0,0,642,93,1,0,0,0,643,644,5,57,0,0,644,645,5,5,0,0,645,648,5,76,0,0,
  	646,647,5,9,0,0,647,649,5,76,0,0,648,646,1,0,0,0,648,649,1,0,0,0,649,
  	650,1,0,0,0,650,651,5,6,0,0,651,95,1,0,0,0,652,653,5,58,0,0,653,654,5,
  	5,0,0,654,657,5,76,0,0,655,656,5,9,0,0,656,658,5,76,0,0,657,655,1,0,0,
  	0,657,658,1,0,0,0,658,659,1,0,0,0,659,660,5,6,0,0,660,97,1,0,0,0,661,
  	662,5,59,0,0,662,663,5,5,0,0,663,666,5,76,0,0,664,665,5,9,0,0,665,667,
  	5,76,0,0,666,664,1,0,0,0,666,667,1,0,0,0,667,668,1,0,0,0,668,669,5,6,
  	0,0,669,99,1,0,0,0,670,671,5,60,0,0,671,672,5,5,0,0,672,673,5,76,0,0,
  	673,674,5,9,0,0,674,677,5,76,0,0,675,676,5,9,0,0,676,678,5,76,0,0,677,
  	675,1,0,0,0,677,678,1,0,0,0,678,679,1,0,0,0,679,680,5,6,0,0,680,101,1,
  	0,0,0,681,682,5,61,0,0,682,683,5,5,0,0,683,684,5,76,0,0,684,685,5,9,0,
  	0,685,688,5,76,0,0,686,687,5,9,0,0,687,689,5,76,0,0,688,686,1,0,0,0,688,
  	689,1,0,0,0,689,690,1,0,0,0,690,691,5,6,0,0,691,103,1,0,0,0,692,693,5,
  	62,0,0,693,694,5,5,0,0,694,697,5,76,0,0,695,696,5,9,0,0,696,698,5,76,
  	0,0,697,695,1,0,0,0,697,698,1,0,0,0,698,699,1,0,0,0,699,700,5,6,0,0,700,
  	105,1,0,0,0,701,702,5,63,0,0,702,703,5,5,0,0,703,706,5,76,0,0,704,705,
  	5,9,0,0,705,707,5,76,0,0,706,704,1,0,0,0,706,707,1,0,0,0,707,708,1,0,
  	0,0,708,709,5,6,0,0,709,107,1,0,0,0,710,711,5,64,0,0,711,712,5,5,0,0,
  	712,715,5,76,0,0,713,714,5,9,0,0,714,716,5,76,0,0,715,713,1,0,0,0,715,
  	716,1,0,0,0,716,717,1,0,0,0,717,718,5,6,0,0,718,109,1,0,0,0,719,720,5,
  	65,0,0,720,721,5,5,0,0,721,724,5,76,0,0,722,723,5,9,0,0,723,725,5,76,
  	0,0,724,722,1,0,0,0,724,725,1,0,0,0,725,726,1,0,0,0,726,727,5,6,0,0,727,
  	111,1,0,0,0,728,729,5,66,0,0,729,730,5,5,0,0,730,733,5,76,0,0,731,732,
  	5,9,0,0,732,734,5,76,0,0,733,731,1,0,0,0,733,734,1,0,0,0,734,735,1,0,
  	0,0,735,736,5,6,0,0,736,113,1,0,0,0,737,738,5,67,0,0,738,739,5,5,0,0,
  	739,742,5,76,0,0,740,741,5,9,0,0,741,743,5,76,0,0,742,740,1,0,0,0,742,
  	743,1,0,0,0,743,744,1,0,0,0,744,745,5,6,0,0,745,115,1,0,0,0,746,747,5,
  	68,0,0,747,748,5,5,0,0,748,751,5,76,0,0,749,750,5,9,0,0,750,752,5,76,
  	0,0,751,749,1,0,0,0,751,752,1,0,0,0,752,753,1,0,0,0,753,754,5,6,0,0,754,
  	117,1,0,0,0,755,756,5,69,0,0,756,757,5,5,0,0,757,760,5,76,0,0,758,759,
  	5,9,0,0,759,761,5,76,0,0,760,758,1,0,0,0,760,761,1,0,0,0,761,762,1,0,
  	0,0,762,763,5,6,0,0,763,119,1,0,0,0,764,765,7,2,0,0,765,121,1,0,0,0,766,
  	767,7,3,0,0,767,123,1,0,0,0,62,143,154,221,233,235,249,256,263,270,277,
  	284,291,298,305,312,319,326,333,342,351,360,369,382,395,408,419,430,441,
  	466,480,487,494,501,508,515,522,533,540,549,558,567,576,585,594,603,612,
  	621,630,639,648,657,666,677,688,697,706,715,724,733,742,751,760
  };
  staticData->serializedATN = antlr4::atn::SerializedATNView(serializedATNSegment, sizeof(serializedATNSegment) / sizeof(serializedATNSegment[0]));

  antlr4::atn::ATNDeserializer deserializer;
  staticData->atn = deserializer.deserialize(staticData->serializedATN);

  const size_t count = staticData->atn->getNumberOfDecisions();
  staticData->decisionToDFA.reserve(count);
  for (size_t i = 0; i < count; i++) { 
    staticData->decisionToDFA.emplace_back(staticData->atn->getDecisionState(i), i);
  }
  exprParserStaticData = staticData.release();
}

}

ExprParser::ExprParser(TokenStream *input) : ExprParser(input, antlr4::atn::ParserATNSimulatorOptions()) {}

ExprParser::ExprParser(TokenStream *input, const antlr4::atn::ParserATNSimulatorOptions &options) : Parser(input) {
  ExprParser::initialize();
  _interpreter = new atn::ParserATNSimulator(this, *exprParserStaticData->atn, exprParserStaticData->decisionToDFA, exprParserStaticData->sharedContextCache, options);
}

ExprParser::~ExprParser() {
  delete _interpreter;
}

const atn::ATN& ExprParser::getATN() const {
  return *exprParserStaticData->atn;
}

std::string ExprParser::getGrammarFileName() const {
  return "Expr.g4";
}

const std::vector<std::string>& ExprParser::getRuleNames() const {
  return exprParserStaticData->ruleNames;
}

const dfa::Vocabulary& ExprParser::getVocabulary() const {
  return exprParserStaticData->vocabulary;
}

antlr4::atn::SerializedATNView ExprParser::getSerializedATN() const {
  return exprParserStaticData->serializedATN;
}


//----------------- ExprContext ------------------------------------------------------------------

ExprParser::ExprContext::ExprContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}


size_t ExprParser::ExprContext::getRuleIndex() const {
  return ExprParser::RuleExpr;
}

void ExprParser::ExprContext::copyFrom(ExprContext *ctx) {
  ParserRuleContext::copyFrom(ctx);
}

//----------------- ICloseContext ------------------------------------------------------------------

ExprParser::CloseContext* ExprParser::ICloseContext::close() {
  return getRuleContext<ExprParser::CloseContext>(0);
}

ExprParser::ICloseContext::ICloseContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::ICloseContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIClose(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinChangeContext ------------------------------------------------------------------

ExprParser::Min_changeContext* ExprParser::IMinChangeContext::min_change() {
  return getRuleContext<ExprParser::Min_changeContext>(0);
}

ExprParser::IMinChangeContext::IMinChangeContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinChangeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinChange(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMACD_signalContext ------------------------------------------------------------------

ExprParser::Macd_signalContext* ExprParser::IMACD_signalContext::macd_signal() {
  return getRuleContext<ExprParser::Macd_signalContext>(0);
}

ExprParser::IMACD_signalContext::IMACD_signalContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMACD_signalContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMACD_signal(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinAmplContext ------------------------------------------------------------------

ExprParser::Min_amplContext* ExprParser::IMinAmplContext::min_ampl() {
  return getRuleContext<ExprParser::Min_amplContext>(0);
}

ExprParser::IMinAmplContext::IMinAmplContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinAmplContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinAmpl(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBullish_hammerContext ------------------------------------------------------------------

ExprParser::Bullish_hammerContext* ExprParser::IBullish_hammerContext::bullish_hammer() {
  return getRuleContext<ExprParser::Bullish_hammerContext>(0);
}

ExprParser::IBullish_hammerContext::IBullish_hammerContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBullish_hammerContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBullish_hammer(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IHourContext ------------------------------------------------------------------

ExprParser::HourContext* ExprParser::IHourContext::hour() {
  return getRuleContext<ExprParser::HourContext>(0);
}

ExprParser::IHourContext::IHourContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IHourContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIHour(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IAvgAmplContext ------------------------------------------------------------------

ExprParser::Avg_amplContext* ExprParser::IAvgAmplContext::avg_ampl() {
  return getRuleContext<ExprParser::Avg_amplContext>(0);
}

ExprParser::IAvgAmplContext::IAvgAmplContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IAvgAmplContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIAvgAmpl(this);
  else
    return visitor->visitChildren(this);
}
//----------------- ILowerShadowContext ------------------------------------------------------------------

ExprParser::Lower_shadowContext* ExprParser::ILowerShadowContext::lower_shadow() {
  return getRuleContext<ExprParser::Lower_shadowContext>(0);
}

ExprParser::ILowerShadowContext::ILowerShadowContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::ILowerShadowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitILowerShadow(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMACD_histogramContext ------------------------------------------------------------------

ExprParser::Macd_histogramContext* ExprParser::IMACD_histogramContext::macd_histogram() {
  return getRuleContext<ExprParser::Macd_histogramContext>(0);
}

ExprParser::IMACD_histogramContext::IMACD_histogramContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMACD_histogramContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMACD_histogram(this);
  else
    return visitor->visitChildren(this);
}
//----------------- StringContext ------------------------------------------------------------------

tree::TerminalNode* ExprParser::StringContext::STRING() {
  return getToken(ExprParser::STRING, 0);
}

ExprParser::StringContext::StringContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::StringContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitString(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IAvgHighContext ------------------------------------------------------------------

ExprParser::Avg_highContext* ExprParser::IAvgHighContext::avg_high() {
  return getRuleContext<ExprParser::Avg_highContext>(0);
}

ExprParser::IAvgHighContext::IAvgHighContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IAvgHighContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIAvgHigh(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinRSIContext ------------------------------------------------------------------

ExprParser::Min_rsiContext* ExprParser::IMinRSIContext::min_rsi() {
  return getRuleContext<ExprParser::Min_rsiContext>(0);
}

ExprParser::IMinRSIContext::IMinRSIContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinRSIContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinRSI(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinuteContext ------------------------------------------------------------------

ExprParser::MinuteContext* ExprParser::IMinuteContext::minute() {
  return getRuleContext<ExprParser::MinuteContext>(0);
}

ExprParser::IMinuteContext::IMinuteContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinuteContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinute(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinHighContext ------------------------------------------------------------------

ExprParser::Min_highContext* ExprParser::IMinHighContext::min_high() {
  return getRuleContext<ExprParser::Min_highContext>(0);
}

ExprParser::IMinHighContext::IMinHighContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinHighContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinHigh(this);
  else
    return visitor->visitChildren(this);
}
//----------------- NegativeContext ------------------------------------------------------------------

ExprParser::ExprContext* ExprParser::NegativeContext::expr() {
  return getRuleContext<ExprParser::ExprContext>(0);
}

ExprParser::NegativeContext::NegativeContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::NegativeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitNegative(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IAvgAmplPContext ------------------------------------------------------------------

ExprParser::Avg_amplPContext* ExprParser::IAvgAmplPContext::avg_amplP() {
  return getRuleContext<ExprParser::Avg_amplPContext>(0);
}

ExprParser::IAvgAmplPContext::IAvgAmplPContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IAvgAmplPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIAvgAmplP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- ILowContext ------------------------------------------------------------------

ExprParser::LowContext* ExprParser::ILowContext::low() {
  return getRuleContext<ExprParser::LowContext>(0);
}

ExprParser::ILowContext::ILowContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::ILowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitILow(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IVolumeContext ------------------------------------------------------------------

ExprParser::VolumeContext* ExprParser::IVolumeContext::volume() {
  return getRuleContext<ExprParser::VolumeContext>(0);
}

ExprParser::IVolumeContext::IVolumeContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IVolumeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIVolume(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinCloseContext ------------------------------------------------------------------

ExprParser::Min_closeContext* ExprParser::IMinCloseContext::min_close() {
  return getRuleContext<ExprParser::Min_closeContext>(0);
}

ExprParser::IMinCloseContext::IMinCloseContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinCloseContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinClose(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IEMAContext ------------------------------------------------------------------

ExprParser::EmaContext* ExprParser::IEMAContext::ema() {
  return getRuleContext<ExprParser::EmaContext>(0);
}

ExprParser::IEMAContext::IEMAContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IEMAContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIEMA(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBB_lowContext ------------------------------------------------------------------

ExprParser::Bb_lowerContext* ExprParser::IBB_lowContext::bb_lower() {
  return getRuleContext<ExprParser::Bb_lowerContext>(0);
}

ExprParser::IBB_lowContext::IBB_lowContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBB_lowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBB_low(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxHighContext ------------------------------------------------------------------

ExprParser::Max_highContext* ExprParser::IMaxHighContext::max_high() {
  return getRuleContext<ExprParser::Max_highContext>(0);
}

ExprParser::IMaxHighContext::IMaxHighContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxHighContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxHigh(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMACD_n_dinhContext ------------------------------------------------------------------

ExprParser::Macd_n_dinhContext* ExprParser::IMACD_n_dinhContext::macd_n_dinh() {
  return getRuleContext<ExprParser::Macd_n_dinhContext>(0);
}

ExprParser::IMACD_n_dinhContext::IMACD_n_dinhContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMACD_n_dinhContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMACD_n_dinh(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinLowContext ------------------------------------------------------------------

ExprParser::Min_lowContext* ExprParser::IMinLowContext::min_low() {
  return getRuleContext<ExprParser::Min_lowContext>(0);
}

ExprParser::IMinLowContext::IMinLowContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinLowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinLow(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IRSIContext ------------------------------------------------------------------

ExprParser::RsiContext* ExprParser::IRSIContext::rsi() {
  return getRuleContext<ExprParser::RsiContext>(0);
}

ExprParser::IRSIContext::IRSIContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IRSIContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIRSI(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBB_midContext ------------------------------------------------------------------

ExprParser::Bb_middleContext* ExprParser::IBB_midContext::bb_middle() {
  return getRuleContext<ExprParser::Bb_middleContext>(0);
}

ExprParser::IBB_midContext::IBB_midContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBB_midContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBB_mid(this);
  else
    return visitor->visitChildren(this);
}
//----------------- FloatContext ------------------------------------------------------------------

tree::TerminalNode* ExprParser::FloatContext::FLOAT() {
  return getToken(ExprParser::FLOAT, 0);
}

ExprParser::FloatContext::FloatContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::FloatContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitFloat(this);
  else
    return visitor->visitChildren(this);
}
//----------------- MINContext ------------------------------------------------------------------

std::vector<ExprParser::ExprContext *> ExprParser::MINContext::expr() {
  return getRuleContexts<ExprParser::ExprContext>();
}

ExprParser::ExprContext* ExprParser::MINContext::expr(size_t i) {
  return getRuleContext<ExprParser::ExprContext>(i);
}

ExprParser::MINContext::MINContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::MINContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMIN(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxAmplPContext ------------------------------------------------------------------

ExprParser::Max_amplPContext* ExprParser::IMaxAmplPContext::max_amplP() {
  return getRuleContext<ExprParser::Max_amplPContext>(0);
}

ExprParser::IMaxAmplPContext::IMaxAmplPContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxAmplPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxAmplP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMAContext ------------------------------------------------------------------

ExprParser::MaContext* ExprParser::IMAContext::ma() {
  return getRuleContext<ExprParser::MaContext>(0);
}

ExprParser::IMAContext::IMAContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMAContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMA(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBearishContext ------------------------------------------------------------------

ExprParser::BearishContext* ExprParser::IBearishContext::bearish() {
  return getRuleContext<ExprParser::BearishContext>(0);
}

ExprParser::IBearishContext::IBearishContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBearishContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBearish(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IOpenContext ------------------------------------------------------------------

ExprParser::OpenContext* ExprParser::IOpenContext::open() {
  return getRuleContext<ExprParser::OpenContext>(0);
}

ExprParser::IOpenContext::IOpenContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IOpenContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIOpen(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IHighContext ------------------------------------------------------------------

ExprParser::HighContext* ExprParser::IHighContext::high() {
  return getRuleContext<ExprParser::HighContext>(0);
}

ExprParser::IHighContext::IHighContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IHighContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIHigh(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMARSIContext ------------------------------------------------------------------

ExprParser::MarsiContext* ExprParser::IMARSIContext::marsi() {
  return getRuleContext<ExprParser::MarsiContext>(0);
}

ExprParser::IMARSIContext::IMARSIContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMARSIContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMARSI(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxOpenContext ------------------------------------------------------------------

ExprParser::Max_openContext* ExprParser::IMaxOpenContext::max_open() {
  return getRuleContext<ExprParser::Max_openContext>(0);
}

ExprParser::IMaxOpenContext::IMaxOpenContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxOpenContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxOpen(this);
  else
    return visitor->visitChildren(this);
}
//----------------- MAXContext ------------------------------------------------------------------

std::vector<ExprParser::ExprContext *> ExprParser::MAXContext::expr() {
  return getRuleContexts<ExprParser::ExprContext>();
}

ExprParser::ExprContext* ExprParser::MAXContext::expr(size_t i) {
  return getRuleContext<ExprParser::ExprContext>(i);
}

ExprParser::MAXContext::MAXContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::MAXContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMAX(this);
  else
    return visitor->visitChildren(this);
}
//----------------- MulDivContext ------------------------------------------------------------------

std::vector<ExprParser::ExprContext *> ExprParser::MulDivContext::expr() {
  return getRuleContexts<ExprParser::ExprContext>();
}

ExprParser::ExprContext* ExprParser::MulDivContext::expr(size_t i) {
  return getRuleContext<ExprParser::ExprContext>(i);
}

ExprParser::MulDivContext::MulDivContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::MulDivContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMulDiv(this);
  else
    return visitor->visitChildren(this);
}
//----------------- ParensContext ------------------------------------------------------------------

ExprParser::ExprContext* ExprParser::ParensContext::expr() {
  return getRuleContext<ExprParser::ExprContext>(0);
}

ExprParser::ParensContext::ParensContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::ParensContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitParens(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxChangePContext ------------------------------------------------------------------

ExprParser::Max_changePContext* ExprParser::IMaxChangePContext::max_changeP() {
  return getRuleContext<ExprParser::Max_changePContext>(0);
}

ExprParser::IMaxChangePContext::IMaxChangePContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxChangePContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxChangeP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- ILowerShadowPContext ------------------------------------------------------------------

ExprParser::Lower_shadowPContext* ExprParser::ILowerShadowPContext::lower_shadowP() {
  return getRuleContext<ExprParser::Lower_shadowPContext>(0);
}

ExprParser::ILowerShadowPContext::ILowerShadowPContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::ILowerShadowPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitILowerShadowP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinAmplPContext ------------------------------------------------------------------

ExprParser::Min_amplPContext* ExprParser::IMinAmplPContext::min_amplP() {
  return getRuleContext<ExprParser::Min_amplPContext>(0);
}

ExprParser::IMinAmplPContext::IMinAmplPContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinAmplPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinAmplP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IAmplPContext ------------------------------------------------------------------

ExprParser::AmplPContext* ExprParser::IAmplPContext::amplP() {
  return getRuleContext<ExprParser::AmplPContext>(0);
}

ExprParser::IAmplPContext::IAmplPContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IAmplPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIAmplP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IAvgCloseContext ------------------------------------------------------------------

ExprParser::Avg_closeContext* ExprParser::IAvgCloseContext::avg_close() {
  return getRuleContext<ExprParser::Avg_closeContext>(0);
}

ExprParser::IAvgCloseContext::IAvgCloseContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IAvgCloseContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIAvgClose(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinChangePContext ------------------------------------------------------------------

ExprParser::Min_changePContext* ExprParser::IMinChangePContext::min_changeP() {
  return getRuleContext<ExprParser::Min_changePContext>(0);
}

ExprParser::IMinChangePContext::IMinChangePContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinChangePContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinChangeP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxCloseContext ------------------------------------------------------------------

ExprParser::Max_closeContext* ExprParser::IMaxCloseContext::max_close() {
  return getRuleContext<ExprParser::Max_closeContext>(0);
}

ExprParser::IMaxCloseContext::IMaxCloseContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxCloseContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxClose(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IntContext ------------------------------------------------------------------

tree::TerminalNode* ExprParser::IntContext::INT() {
  return getToken(ExprParser::INT, 0);
}

ExprParser::IntContext::IntContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IntContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitInt(this);
  else
    return visitor->visitChildren(this);
}
//----------------- ABSContext ------------------------------------------------------------------

ExprParser::ExprContext* ExprParser::ABSContext::expr() {
  return getRuleContext<ExprParser::ExprContext>(0);
}

ExprParser::ABSContext::ABSContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::ABSContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitABS(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IChangeContext ------------------------------------------------------------------

ExprParser::ChangeContext* ExprParser::IChangeContext::change() {
  return getRuleContext<ExprParser::ChangeContext>(0);
}

ExprParser::IChangeContext::IChangeContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IChangeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIChange(this);
  else
    return visitor->visitChildren(this);
}
//----------------- ComparisonContext ------------------------------------------------------------------

std::vector<ExprParser::ExprContext *> ExprParser::ComparisonContext::expr() {
  return getRuleContexts<ExprParser::ExprContext>();
}

ExprParser::ExprContext* ExprParser::ComparisonContext::expr(size_t i) {
  return getRuleContext<ExprParser::ExprContext>(i);
}

ExprParser::ComparisonOpContext* ExprParser::ComparisonContext::comparisonOp() {
  return getRuleContext<ExprParser::ComparisonOpContext>(0);
}

ExprParser::ComparisonContext::ComparisonContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::ComparisonContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitComparison(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IAmplContext ------------------------------------------------------------------

ExprParser::AmplContext* ExprParser::IAmplContext::ampl() {
  return getRuleContext<ExprParser::AmplContext>(0);
}

ExprParser::IAmplContext::IAmplContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IAmplContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIAmpl(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxAmplContext ------------------------------------------------------------------

ExprParser::Max_amplContext* ExprParser::IMaxAmplContext::max_ampl() {
  return getRuleContext<ExprParser::Max_amplContext>(0);
}

ExprParser::IMaxAmplContext::IMaxAmplContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxAmplContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxAmpl(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBullish_engulfingContext ------------------------------------------------------------------

ExprParser::Bullish_engulfingContext* ExprParser::IBullish_engulfingContext::bullish_engulfing() {
  return getRuleContext<ExprParser::Bullish_engulfingContext>(0);
}

ExprParser::IBullish_engulfingContext::IBullish_engulfingContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBullish_engulfingContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBullish_engulfing(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBB_upContext ------------------------------------------------------------------

ExprParser::Bb_upperContext* ExprParser::IBB_upContext::bb_upper() {
  return getRuleContext<ExprParser::Bb_upperContext>(0);
}

ExprParser::IBB_upContext::IBB_upContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBB_upContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBB_up(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBullishContext ------------------------------------------------------------------

ExprParser::BullishContext* ExprParser::IBullishContext::bullish() {
  return getRuleContext<ExprParser::BullishContext>(0);
}

ExprParser::IBullishContext::IBullishContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBullishContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBullish(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IRSISlopeContext ------------------------------------------------------------------

ExprParser::Rsi_slopeContext* ExprParser::IRSISlopeContext::rsi_slope() {
  return getRuleContext<ExprParser::Rsi_slopeContext>(0);
}

ExprParser::IRSISlopeContext::IRSISlopeContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IRSISlopeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIRSISlope(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IAvgLowContext ------------------------------------------------------------------

ExprParser::Avg_lowContext* ExprParser::IAvgLowContext::avg_low() {
  return getRuleContext<ExprParser::Avg_lowContext>(0);
}

ExprParser::IAvgLowContext::IAvgLowContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IAvgLowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIAvgLow(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IUpperShadowPContext ------------------------------------------------------------------

ExprParser::Upper_shadowPContext* ExprParser::IUpperShadowPContext::upper_shadowP() {
  return getRuleContext<ExprParser::Upper_shadowPContext>(0);
}

ExprParser::IUpperShadowPContext::IUpperShadowPContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IUpperShadowPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIUpperShadowP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxChangeContext ------------------------------------------------------------------

ExprParser::Max_changeContext* ExprParser::IMaxChangeContext::max_change() {
  return getRuleContext<ExprParser::Max_changeContext>(0);
}

ExprParser::IMaxChangeContext::IMaxChangeContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxChangeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxChange(this);
  else
    return visitor->visitChildren(this);
}
//----------------- AddSubContext ------------------------------------------------------------------

std::vector<ExprParser::ExprContext *> ExprParser::AddSubContext::expr() {
  return getRuleContexts<ExprParser::ExprContext>();
}

ExprParser::ExprContext* ExprParser::AddSubContext::expr(size_t i) {
  return getRuleContext<ExprParser::ExprContext>(i);
}

ExprParser::AddSubContext::AddSubContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::AddSubContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAddSub(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBearish_engulfingContext ------------------------------------------------------------------

ExprParser::Bearish_engulfingContext* ExprParser::IBearish_engulfingContext::bearish_engulfing() {
  return getRuleContext<ExprParser::Bearish_engulfingContext>(0);
}

ExprParser::IBearish_engulfingContext::IBearish_engulfingContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBearish_engulfingContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBearish_engulfing(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IChangePContext ------------------------------------------------------------------

ExprParser::ChangePContext* ExprParser::IChangePContext::changeP() {
  return getRuleContext<ExprParser::ChangePContext>(0);
}

ExprParser::IChangePContext::IChangePContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IChangePContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIChangeP(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMinOpenContext ------------------------------------------------------------------

ExprParser::Min_openContext* ExprParser::IMinOpenContext::min_open() {
  return getRuleContext<ExprParser::Min_openContext>(0);
}

ExprParser::IMinOpenContext::IMinOpenContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMinOpenContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMinOpen(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IBearish_hammerContext ------------------------------------------------------------------

ExprParser::Bearish_hammerContext* ExprParser::IBearish_hammerContext::bearish_hammer() {
  return getRuleContext<ExprParser::Bearish_hammerContext>(0);
}

ExprParser::IBearish_hammerContext::IBearish_hammerContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IBearish_hammerContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIBearish_hammer(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IAvgOpenContext ------------------------------------------------------------------

ExprParser::Avg_openContext* ExprParser::IAvgOpenContext::avg_open() {
  return getRuleContext<ExprParser::Avg_openContext>(0);
}

ExprParser::IAvgOpenContext::IAvgOpenContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IAvgOpenContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIAvgOpen(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxRSIContext ------------------------------------------------------------------

ExprParser::Max_rsiContext* ExprParser::IMaxRSIContext::max_rsi() {
  return getRuleContext<ExprParser::Max_rsiContext>(0);
}

ExprParser::IMaxRSIContext::IMaxRSIContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxRSIContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxRSI(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMACD_valueContext ------------------------------------------------------------------

ExprParser::Macd_valueContext* ExprParser::IMACD_valueContext::macd_value() {
  return getRuleContext<ExprParser::Macd_valueContext>(0);
}

ExprParser::IMACD_valueContext::IMACD_valueContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMACD_valueContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMACD_value(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMACD_slopeContext ------------------------------------------------------------------

ExprParser::Macd_slopeContext* ExprParser::IMACD_slopeContext::macd_slope() {
  return getRuleContext<ExprParser::Macd_slopeContext>(0);
}

ExprParser::IMACD_slopeContext::IMACD_slopeContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMACD_slopeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMACD_slope(this);
  else
    return visitor->visitChildren(this);
}
//----------------- PositiveContext ------------------------------------------------------------------

ExprParser::ExprContext* ExprParser::PositiveContext::expr() {
  return getRuleContext<ExprParser::ExprContext>(0);
}

ExprParser::PositiveContext::PositiveContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::PositiveContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitPositive(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IDojiContext ------------------------------------------------------------------

ExprParser::DojiContext* ExprParser::IDojiContext::doji() {
  return getRuleContext<ExprParser::DojiContext>(0);
}

ExprParser::IDojiContext::IDojiContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IDojiContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIDoji(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IMaxLowContext ------------------------------------------------------------------

ExprParser::Max_lowContext* ExprParser::IMaxLowContext::max_low() {
  return getRuleContext<ExprParser::Max_lowContext>(0);
}

ExprParser::IMaxLowContext::IMaxLowContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IMaxLowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIMaxLow(this);
  else
    return visitor->visitChildren(this);
}
//----------------- IUpperShadowContext ------------------------------------------------------------------

ExprParser::Upper_shadowContext* ExprParser::IUpperShadowContext::upper_shadow() {
  return getRuleContext<ExprParser::Upper_shadowContext>(0);
}

ExprParser::IUpperShadowContext::IUpperShadowContext(ExprContext *ctx) { copyFrom(ctx); }


std::any ExprParser::IUpperShadowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitIUpperShadow(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::ExprContext* ExprParser::expr() {
   return expr(0);
}

ExprParser::ExprContext* ExprParser::expr(int precedence) {
  ParserRuleContext *parentContext = _ctx;
  size_t parentState = getState();
  ExprParser::ExprContext *_localctx = _tracker.createInstance<ExprContext>(_ctx, parentState);
  ExprParser::ExprContext *previousContext = _localctx;
  (void)previousContext; // Silence compiler, in case the context is not used by generated code.
  size_t startState = 0;
  enterRecursionRule(_localctx, 0, ExprParser::RuleExpr, precedence);

    size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    unrollRecursionContexts(parentContext);
  });
  try {
    size_t alt;
    enterOuterAlt(_localctx, 1);
    setState(221);
    _errHandler->sync(this);
    switch (_input->LA(1)) {
      case ExprParser::T__3: {
        _localctx = _tracker.createInstance<NegativeContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;

        setState(125);
        match(ExprParser::T__3);
        setState(126);
        expr(69);
        break;
      }

      case ExprParser::T__2: {
        _localctx = _tracker.createInstance<PositiveContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(127);
        match(ExprParser::T__2);
        setState(128);
        expr(68);
        break;
      }

      case ExprParser::T__4: {
        _localctx = _tracker.createInstance<ParensContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(129);
        match(ExprParser::T__4);
        setState(130);
        expr(0);
        setState(131);
        match(ExprParser::T__5);
        break;
      }

      case ExprParser::T__6: {
        _localctx = _tracker.createInstance<ABSContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(133);
        match(ExprParser::T__6);
        setState(134);
        expr(0);
        setState(135);
        match(ExprParser::T__5);
        break;
      }

      case ExprParser::T__7: {
        _localctx = _tracker.createInstance<MINContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(137);
        match(ExprParser::T__7);
        setState(138);
        expr(0);
        setState(143);
        _errHandler->sync(this);
        _la = _input->LA(1);
        while (_la == ExprParser::T__8) {
          setState(139);
          match(ExprParser::T__8);
          setState(140);
          expr(0);
          setState(145);
          _errHandler->sync(this);
          _la = _input->LA(1);
        }
        setState(146);
        match(ExprParser::T__5);
        break;
      }

      case ExprParser::T__9: {
        _localctx = _tracker.createInstance<MAXContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(148);
        match(ExprParser::T__9);
        setState(149);
        expr(0);
        setState(154);
        _errHandler->sync(this);
        _la = _input->LA(1);
        while (_la == ExprParser::T__8) {
          setState(150);
          match(ExprParser::T__8);
          setState(151);
          expr(0);
          setState(156);
          _errHandler->sync(this);
          _la = _input->LA(1);
        }
        setState(157);
        match(ExprParser::T__5);
        break;
      }

      case ExprParser::INT: {
        _localctx = _tracker.createInstance<IntContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(159);
        match(ExprParser::INT);
        break;
      }

      case ExprParser::FLOAT: {
        _localctx = _tracker.createInstance<FloatContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(160);
        match(ExprParser::FLOAT);
        break;
      }

      case ExprParser::STRING: {
        _localctx = _tracker.createInstance<StringContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(161);
        match(ExprParser::STRING);
        break;
      }

      case ExprParser::T__10: {
        _localctx = _tracker.createInstance<IHourContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(162);
        hour();
        break;
      }

      case ExprParser::T__11: {
        _localctx = _tracker.createInstance<IMinuteContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(163);
        minute();
        break;
      }

      case ExprParser::T__12: {
        _localctx = _tracker.createInstance<IOpenContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(164);
        open();
        break;
      }

      case ExprParser::T__13: {
        _localctx = _tracker.createInstance<IHighContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(165);
        high();
        break;
      }

      case ExprParser::T__14: {
        _localctx = _tracker.createInstance<ILowContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(166);
        low();
        break;
      }

      case ExprParser::T__15: {
        _localctx = _tracker.createInstance<ICloseContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(167);
        close();
        break;
      }

      case ExprParser::T__16: {
        _localctx = _tracker.createInstance<IVolumeContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(168);
        volume();
        break;
      }

      case ExprParser::T__17: {
        _localctx = _tracker.createInstance<IChangeContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(169);
        change();
        break;
      }

      case ExprParser::T__18: {
        _localctx = _tracker.createInstance<IChangePContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(170);
        changeP();
        break;
      }

      case ExprParser::T__19: {
        _localctx = _tracker.createInstance<IAmplContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(171);
        ampl();
        break;
      }

      case ExprParser::T__20: {
        _localctx = _tracker.createInstance<IAmplPContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(172);
        amplP();
        break;
      }

      case ExprParser::T__21: {
        _localctx = _tracker.createInstance<IUpperShadowContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(173);
        upper_shadow();
        break;
      }

      case ExprParser::T__22: {
        _localctx = _tracker.createInstance<IUpperShadowPContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(174);
        upper_shadowP();
        break;
      }

      case ExprParser::T__23: {
        _localctx = _tracker.createInstance<ILowerShadowContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(175);
        lower_shadow();
        break;
      }

      case ExprParser::T__24: {
        _localctx = _tracker.createInstance<ILowerShadowPContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(176);
        lower_shadowP();
        break;
      }

      case ExprParser::T__25: {
        _localctx = _tracker.createInstance<IRSIContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(177);
        rsi();
        break;
      }

      case ExprParser::T__26: {
        _localctx = _tracker.createInstance<IRSISlopeContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(178);
        rsi_slope();
        break;
      }

      case ExprParser::T__27: {
        _localctx = _tracker.createInstance<IMAContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(179);
        ma();
        break;
      }

      case ExprParser::T__28: {
        _localctx = _tracker.createInstance<IEMAContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(180);
        ema();
        break;
      }

      case ExprParser::T__29: {
        _localctx = _tracker.createInstance<IMACD_valueContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(181);
        macd_value();
        break;
      }

      case ExprParser::T__30: {
        _localctx = _tracker.createInstance<IMACD_signalContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(182);
        macd_signal();
        break;
      }

      case ExprParser::T__31: {
        _localctx = _tracker.createInstance<IMACD_histogramContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(183);
        macd_histogram();
        break;
      }

      case ExprParser::T__32: {
        _localctx = _tracker.createInstance<IBB_upContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(184);
        bb_upper();
        break;
      }

      case ExprParser::T__33: {
        _localctx = _tracker.createInstance<IBB_midContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(185);
        bb_middle();
        break;
      }

      case ExprParser::T__34: {
        _localctx = _tracker.createInstance<IBB_lowContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(186);
        bb_lower();
        break;
      }

      case ExprParser::T__35: {
        _localctx = _tracker.createInstance<IMACD_n_dinhContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(187);
        macd_n_dinh();
        break;
      }

      case ExprParser::T__36: {
        _localctx = _tracker.createInstance<IMACD_slopeContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(188);
        macd_slope();
        break;
      }

      case ExprParser::T__37: {
        _localctx = _tracker.createInstance<IBullish_engulfingContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(189);
        bullish_engulfing();
        break;
      }

      case ExprParser::T__38: {
        _localctx = _tracker.createInstance<IBearish_engulfingContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(190);
        bearish_engulfing();
        break;
      }

      case ExprParser::T__39: {
        _localctx = _tracker.createInstance<IBullish_hammerContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(191);
        bullish_hammer();
        break;
      }

      case ExprParser::T__40: {
        _localctx = _tracker.createInstance<IBearish_hammerContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(192);
        bearish_hammer();
        break;
      }

      case ExprParser::T__41: {
        _localctx = _tracker.createInstance<IBullishContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(193);
        bullish();
        break;
      }

      case ExprParser::T__42: {
        _localctx = _tracker.createInstance<IBearishContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(194);
        bearish();
        break;
      }

      case ExprParser::T__43: {
        _localctx = _tracker.createInstance<IMARSIContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(195);
        marsi();
        break;
      }

      case ExprParser::T__44: {
        _localctx = _tracker.createInstance<IDojiContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(196);
        doji();
        break;
      }

      case ExprParser::T__45: {
        _localctx = _tracker.createInstance<IAvgOpenContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(197);
        avg_open();
        break;
      }

      case ExprParser::T__46: {
        _localctx = _tracker.createInstance<IAvgHighContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(198);
        avg_high();
        break;
      }

      case ExprParser::T__47: {
        _localctx = _tracker.createInstance<IAvgLowContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(199);
        avg_low();
        break;
      }

      case ExprParser::T__48: {
        _localctx = _tracker.createInstance<IAvgCloseContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(200);
        avg_close();
        break;
      }

      case ExprParser::T__49: {
        _localctx = _tracker.createInstance<IAvgAmplContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(201);
        avg_ampl();
        break;
      }

      case ExprParser::T__50: {
        _localctx = _tracker.createInstance<IAvgAmplPContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(202);
        avg_amplP();
        break;
      }

      case ExprParser::T__51: {
        _localctx = _tracker.createInstance<IMaxOpenContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(203);
        max_open();
        break;
      }

      case ExprParser::T__52: {
        _localctx = _tracker.createInstance<IMaxHighContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(204);
        max_high();
        break;
      }

      case ExprParser::T__53: {
        _localctx = _tracker.createInstance<IMaxLowContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(205);
        max_low();
        break;
      }

      case ExprParser::T__54: {
        _localctx = _tracker.createInstance<IMaxCloseContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(206);
        max_close();
        break;
      }

      case ExprParser::T__55: {
        _localctx = _tracker.createInstance<IMinOpenContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(207);
        min_open();
        break;
      }

      case ExprParser::T__56: {
        _localctx = _tracker.createInstance<IMinHighContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(208);
        min_high();
        break;
      }

      case ExprParser::T__57: {
        _localctx = _tracker.createInstance<IMinLowContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(209);
        min_low();
        break;
      }

      case ExprParser::T__58: {
        _localctx = _tracker.createInstance<IMinCloseContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(210);
        min_close();
        break;
      }

      case ExprParser::T__59: {
        _localctx = _tracker.createInstance<IMinRSIContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(211);
        min_rsi();
        break;
      }

      case ExprParser::T__60: {
        _localctx = _tracker.createInstance<IMaxRSIContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(212);
        max_rsi();
        break;
      }

      case ExprParser::T__61: {
        _localctx = _tracker.createInstance<IMinChangeContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(213);
        min_change();
        break;
      }

      case ExprParser::T__62: {
        _localctx = _tracker.createInstance<IMaxChangeContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(214);
        max_change();
        break;
      }

      case ExprParser::T__63: {
        _localctx = _tracker.createInstance<IMinChangePContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(215);
        min_changeP();
        break;
      }

      case ExprParser::T__64: {
        _localctx = _tracker.createInstance<IMaxChangePContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(216);
        max_changeP();
        break;
      }

      case ExprParser::T__65: {
        _localctx = _tracker.createInstance<IMinAmplContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(217);
        min_ampl();
        break;
      }

      case ExprParser::T__66: {
        _localctx = _tracker.createInstance<IMaxAmplContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(218);
        max_ampl();
        break;
      }

      case ExprParser::T__67: {
        _localctx = _tracker.createInstance<IMinAmplPContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(219);
        min_amplP();
        break;
      }

      case ExprParser::T__68: {
        _localctx = _tracker.createInstance<IMaxAmplPContext>(_localctx);
        _ctx = _localctx;
        previousContext = _localctx;
        setState(220);
        max_amplP();
        break;
      }

    default:
      throw NoViableAltException(this);
    }
    _ctx->stop = _input->LT(-1);
    setState(235);
    _errHandler->sync(this);
    alt = getInterpreter<atn::ParserATNSimulator>()->adaptivePredict(_input, 4, _ctx);
    while (alt != 2 && alt != atn::ATN::INVALID_ALT_NUMBER) {
      if (alt == 1) {
        if (!_parseListeners.empty())
          triggerExitRuleEvent();
        previousContext = _localctx;
        setState(233);
        _errHandler->sync(this);
        switch (getInterpreter<atn::ParserATNSimulator>()->adaptivePredict(_input, 3, _ctx)) {
        case 1: {
          auto newContext = _tracker.createInstance<MulDivContext>(_tracker.createInstance<ExprContext>(parentContext, parentState));
          _localctx = newContext;
          pushNewRecursionContext(newContext, startState, RuleExpr);
          setState(223);

          if (!(precpred(_ctx, 71))) throw FailedPredicateException(this, "precpred(_ctx, 71)");
          setState(224);
          _la = _input->LA(1);
          if (!(_la == ExprParser::T__0

          || _la == ExprParser::T__1)) {
          _errHandler->recoverInline(this);
          }
          else {
            _errHandler->reportMatch(this);
            consume();
          }
          setState(225);
          expr(72);
          break;
        }

        case 2: {
          auto newContext = _tracker.createInstance<AddSubContext>(_tracker.createInstance<ExprContext>(parentContext, parentState));
          _localctx = newContext;
          pushNewRecursionContext(newContext, startState, RuleExpr);
          setState(226);

          if (!(precpred(_ctx, 70))) throw FailedPredicateException(this, "precpred(_ctx, 70)");
          setState(227);
          _la = _input->LA(1);
          if (!(_la == ExprParser::T__2

          || _la == ExprParser::T__3)) {
          _errHandler->recoverInline(this);
          }
          else {
            _errHandler->reportMatch(this);
            consume();
          }
          setState(228);
          expr(71);
          break;
        }

        case 3: {
          auto newContext = _tracker.createInstance<ComparisonContext>(_tracker.createInstance<ExprContext>(parentContext, parentState));
          _localctx = newContext;
          pushNewRecursionContext(newContext, startState, RuleExpr);
          setState(229);

          if (!(precpred(_ctx, 67))) throw FailedPredicateException(this, "precpred(_ctx, 67)");
          setState(230);
          comparisonOp();
          setState(231);
          expr(68);
          break;
        }

        default:
          break;
        } 
      }
      setState(237);
      _errHandler->sync(this);
      alt = getInterpreter<atn::ParserATNSimulator>()->adaptivePredict(_input, 4, _ctx);
    }
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }
  return _localctx;
}

//----------------- HourContext ------------------------------------------------------------------

ExprParser::HourContext::HourContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}


size_t ExprParser::HourContext::getRuleIndex() const {
  return ExprParser::RuleHour;
}


std::any ExprParser::HourContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitHour(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::HourContext* ExprParser::hour() {
  HourContext *_localctx = _tracker.createInstance<HourContext>(_ctx, getState());
  enterRule(_localctx, 2, ExprParser::RuleHour);

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(238);
    match(ExprParser::T__10);
    setState(239);
    match(ExprParser::T__4);
    setState(240);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- MinuteContext ------------------------------------------------------------------

ExprParser::MinuteContext::MinuteContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}


size_t ExprParser::MinuteContext::getRuleIndex() const {
  return ExprParser::RuleMinute;
}


std::any ExprParser::MinuteContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMinute(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::MinuteContext* ExprParser::minute() {
  MinuteContext *_localctx = _tracker.createInstance<MinuteContext>(_ctx, getState());
  enterRule(_localctx, 4, ExprParser::RuleMinute);

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(242);
    match(ExprParser::T__11);
    setState(243);
    match(ExprParser::T__4);
    setState(244);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- OpenContext ------------------------------------------------------------------

ExprParser::OpenContext::OpenContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::OpenContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::OpenContext::getRuleIndex() const {
  return ExprParser::RuleOpen;
}


std::any ExprParser::OpenContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitOpen(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::OpenContext* ExprParser::open() {
  OpenContext *_localctx = _tracker.createInstance<OpenContext>(_ctx, getState());
  enterRule(_localctx, 6, ExprParser::RuleOpen);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(246);
    match(ExprParser::T__12);
    setState(247);
    match(ExprParser::T__4);
    setState(249);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(248);
      match(ExprParser::INT);
    }
    setState(251);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- HighContext ------------------------------------------------------------------

ExprParser::HighContext::HighContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::HighContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::HighContext::getRuleIndex() const {
  return ExprParser::RuleHigh;
}


std::any ExprParser::HighContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitHigh(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::HighContext* ExprParser::high() {
  HighContext *_localctx = _tracker.createInstance<HighContext>(_ctx, getState());
  enterRule(_localctx, 8, ExprParser::RuleHigh);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(253);
    match(ExprParser::T__13);
    setState(254);
    match(ExprParser::T__4);
    setState(256);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(255);
      match(ExprParser::INT);
    }
    setState(258);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- LowContext ------------------------------------------------------------------

ExprParser::LowContext::LowContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::LowContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::LowContext::getRuleIndex() const {
  return ExprParser::RuleLow;
}


std::any ExprParser::LowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitLow(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::LowContext* ExprParser::low() {
  LowContext *_localctx = _tracker.createInstance<LowContext>(_ctx, getState());
  enterRule(_localctx, 10, ExprParser::RuleLow);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(260);
    match(ExprParser::T__14);
    setState(261);
    match(ExprParser::T__4);
    setState(263);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(262);
      match(ExprParser::INT);
    }
    setState(265);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- CloseContext ------------------------------------------------------------------

ExprParser::CloseContext::CloseContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::CloseContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::CloseContext::getRuleIndex() const {
  return ExprParser::RuleClose;
}


std::any ExprParser::CloseContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitClose(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::CloseContext* ExprParser::close() {
  CloseContext *_localctx = _tracker.createInstance<CloseContext>(_ctx, getState());
  enterRule(_localctx, 12, ExprParser::RuleClose);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(267);
    match(ExprParser::T__15);
    setState(268);
    match(ExprParser::T__4);
    setState(270);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(269);
      match(ExprParser::INT);
    }
    setState(272);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- VolumeContext ------------------------------------------------------------------

ExprParser::VolumeContext::VolumeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::VolumeContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::VolumeContext::getRuleIndex() const {
  return ExprParser::RuleVolume;
}


std::any ExprParser::VolumeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitVolume(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::VolumeContext* ExprParser::volume() {
  VolumeContext *_localctx = _tracker.createInstance<VolumeContext>(_ctx, getState());
  enterRule(_localctx, 14, ExprParser::RuleVolume);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(274);
    match(ExprParser::T__16);
    setState(275);
    match(ExprParser::T__4);
    setState(277);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(276);
      match(ExprParser::INT);
    }
    setState(279);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- ChangeContext ------------------------------------------------------------------

ExprParser::ChangeContext::ChangeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::ChangeContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::ChangeContext::getRuleIndex() const {
  return ExprParser::RuleChange;
}


std::any ExprParser::ChangeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitChange(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::ChangeContext* ExprParser::change() {
  ChangeContext *_localctx = _tracker.createInstance<ChangeContext>(_ctx, getState());
  enterRule(_localctx, 16, ExprParser::RuleChange);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(281);
    match(ExprParser::T__17);
    setState(282);
    match(ExprParser::T__4);
    setState(284);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(283);
      match(ExprParser::INT);
    }
    setState(286);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- ChangePContext ------------------------------------------------------------------

ExprParser::ChangePContext::ChangePContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::ChangePContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::ChangePContext::getRuleIndex() const {
  return ExprParser::RuleChangeP;
}


std::any ExprParser::ChangePContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitChangeP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::ChangePContext* ExprParser::changeP() {
  ChangePContext *_localctx = _tracker.createInstance<ChangePContext>(_ctx, getState());
  enterRule(_localctx, 18, ExprParser::RuleChangeP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(288);
    match(ExprParser::T__18);
    setState(289);
    match(ExprParser::T__4);
    setState(291);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(290);
      match(ExprParser::INT);
    }
    setState(293);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- AmplContext ------------------------------------------------------------------

ExprParser::AmplContext::AmplContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::AmplContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::AmplContext::getRuleIndex() const {
  return ExprParser::RuleAmpl;
}


std::any ExprParser::AmplContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAmpl(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::AmplContext* ExprParser::ampl() {
  AmplContext *_localctx = _tracker.createInstance<AmplContext>(_ctx, getState());
  enterRule(_localctx, 20, ExprParser::RuleAmpl);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(295);
    match(ExprParser::T__19);
    setState(296);
    match(ExprParser::T__4);
    setState(298);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(297);
      match(ExprParser::INT);
    }
    setState(300);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- AmplPContext ------------------------------------------------------------------

ExprParser::AmplPContext::AmplPContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::AmplPContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::AmplPContext::getRuleIndex() const {
  return ExprParser::RuleAmplP;
}


std::any ExprParser::AmplPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAmplP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::AmplPContext* ExprParser::amplP() {
  AmplPContext *_localctx = _tracker.createInstance<AmplPContext>(_ctx, getState());
  enterRule(_localctx, 22, ExprParser::RuleAmplP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(302);
    match(ExprParser::T__20);
    setState(303);
    match(ExprParser::T__4);
    setState(305);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(304);
      match(ExprParser::INT);
    }
    setState(307);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Upper_shadowContext ------------------------------------------------------------------

ExprParser::Upper_shadowContext::Upper_shadowContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::Upper_shadowContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::Upper_shadowContext::getRuleIndex() const {
  return ExprParser::RuleUpper_shadow;
}


std::any ExprParser::Upper_shadowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitUpper_shadow(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Upper_shadowContext* ExprParser::upper_shadow() {
  Upper_shadowContext *_localctx = _tracker.createInstance<Upper_shadowContext>(_ctx, getState());
  enterRule(_localctx, 24, ExprParser::RuleUpper_shadow);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(309);
    match(ExprParser::T__21);
    setState(310);
    match(ExprParser::T__4);
    setState(312);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(311);
      match(ExprParser::INT);
    }
    setState(314);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Upper_shadowPContext ------------------------------------------------------------------

ExprParser::Upper_shadowPContext::Upper_shadowPContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::Upper_shadowPContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::Upper_shadowPContext::getRuleIndex() const {
  return ExprParser::RuleUpper_shadowP;
}


std::any ExprParser::Upper_shadowPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitUpper_shadowP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Upper_shadowPContext* ExprParser::upper_shadowP() {
  Upper_shadowPContext *_localctx = _tracker.createInstance<Upper_shadowPContext>(_ctx, getState());
  enterRule(_localctx, 26, ExprParser::RuleUpper_shadowP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(316);
    match(ExprParser::T__22);
    setState(317);
    match(ExprParser::T__4);
    setState(319);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(318);
      match(ExprParser::INT);
    }
    setState(321);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Lower_shadowContext ------------------------------------------------------------------

ExprParser::Lower_shadowContext::Lower_shadowContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::Lower_shadowContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::Lower_shadowContext::getRuleIndex() const {
  return ExprParser::RuleLower_shadow;
}


std::any ExprParser::Lower_shadowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitLower_shadow(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Lower_shadowContext* ExprParser::lower_shadow() {
  Lower_shadowContext *_localctx = _tracker.createInstance<Lower_shadowContext>(_ctx, getState());
  enterRule(_localctx, 28, ExprParser::RuleLower_shadow);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(323);
    match(ExprParser::T__23);
    setState(324);
    match(ExprParser::T__4);
    setState(326);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(325);
      match(ExprParser::INT);
    }
    setState(328);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Lower_shadowPContext ------------------------------------------------------------------

ExprParser::Lower_shadowPContext::Lower_shadowPContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::Lower_shadowPContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::Lower_shadowPContext::getRuleIndex() const {
  return ExprParser::RuleLower_shadowP;
}


std::any ExprParser::Lower_shadowPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitLower_shadowP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Lower_shadowPContext* ExprParser::lower_shadowP() {
  Lower_shadowPContext *_localctx = _tracker.createInstance<Lower_shadowPContext>(_ctx, getState());
  enterRule(_localctx, 30, ExprParser::RuleLower_shadowP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(330);
    match(ExprParser::T__24);
    setState(331);
    match(ExprParser::T__4);
    setState(333);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(332);
      match(ExprParser::INT);
    }
    setState(335);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- RsiContext ------------------------------------------------------------------

ExprParser::RsiContext::RsiContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::RsiContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::RsiContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::RsiContext::getRuleIndex() const {
  return ExprParser::RuleRsi;
}


std::any ExprParser::RsiContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitRsi(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::RsiContext* ExprParser::rsi() {
  RsiContext *_localctx = _tracker.createInstance<RsiContext>(_ctx, getState());
  enterRule(_localctx, 32, ExprParser::RuleRsi);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(337);
    match(ExprParser::T__25);
    setState(338);
    match(ExprParser::T__4);
    setState(339);
    match(ExprParser::INT);
    setState(342);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(340);
      match(ExprParser::T__8);
      setState(341);
      match(ExprParser::INT);
    }
    setState(344);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Rsi_slopeContext ------------------------------------------------------------------

ExprParser::Rsi_slopeContext::Rsi_slopeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Rsi_slopeContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Rsi_slopeContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Rsi_slopeContext::getRuleIndex() const {
  return ExprParser::RuleRsi_slope;
}


std::any ExprParser::Rsi_slopeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitRsi_slope(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Rsi_slopeContext* ExprParser::rsi_slope() {
  Rsi_slopeContext *_localctx = _tracker.createInstance<Rsi_slopeContext>(_ctx, getState());
  enterRule(_localctx, 34, ExprParser::RuleRsi_slope);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(346);
    match(ExprParser::T__26);
    setState(347);
    match(ExprParser::T__4);
    setState(348);
    match(ExprParser::INT);
    setState(351);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(349);
      match(ExprParser::T__8);
      setState(350);
      match(ExprParser::INT);
    }
    setState(353);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- MaContext ------------------------------------------------------------------

ExprParser::MaContext::MaContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::MaContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::MaContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::MaContext::getRuleIndex() const {
  return ExprParser::RuleMa;
}


std::any ExprParser::MaContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMa(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::MaContext* ExprParser::ma() {
  MaContext *_localctx = _tracker.createInstance<MaContext>(_ctx, getState());
  enterRule(_localctx, 36, ExprParser::RuleMa);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(355);
    match(ExprParser::T__27);
    setState(356);
    match(ExprParser::T__4);
    setState(357);
    match(ExprParser::INT);
    setState(360);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(358);
      match(ExprParser::T__8);
      setState(359);
      match(ExprParser::INT);
    }
    setState(362);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- EmaContext ------------------------------------------------------------------

ExprParser::EmaContext::EmaContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::EmaContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::EmaContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::EmaContext::getRuleIndex() const {
  return ExprParser::RuleEma;
}


std::any ExprParser::EmaContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitEma(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::EmaContext* ExprParser::ema() {
  EmaContext *_localctx = _tracker.createInstance<EmaContext>(_ctx, getState());
  enterRule(_localctx, 38, ExprParser::RuleEma);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(364);
    match(ExprParser::T__28);
    setState(365);
    match(ExprParser::T__4);
    setState(366);
    match(ExprParser::INT);
    setState(369);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(367);
      match(ExprParser::T__8);
      setState(368);
      match(ExprParser::INT);
    }
    setState(371);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Macd_valueContext ------------------------------------------------------------------

ExprParser::Macd_valueContext::Macd_valueContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Macd_valueContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Macd_valueContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Macd_valueContext::getRuleIndex() const {
  return ExprParser::RuleMacd_value;
}


std::any ExprParser::Macd_valueContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMacd_value(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Macd_valueContext* ExprParser::macd_value() {
  Macd_valueContext *_localctx = _tracker.createInstance<Macd_valueContext>(_ctx, getState());
  enterRule(_localctx, 40, ExprParser::RuleMacd_value);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(373);
    match(ExprParser::T__29);
    setState(374);
    match(ExprParser::T__4);
    setState(375);
    match(ExprParser::INT);
    setState(376);
    match(ExprParser::T__8);
    setState(377);
    match(ExprParser::INT);
    setState(378);
    match(ExprParser::T__8);
    setState(379);
    match(ExprParser::INT);
    setState(382);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(380);
      match(ExprParser::T__8);
      setState(381);
      match(ExprParser::INT);
    }
    setState(384);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Macd_signalContext ------------------------------------------------------------------

ExprParser::Macd_signalContext::Macd_signalContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Macd_signalContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Macd_signalContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Macd_signalContext::getRuleIndex() const {
  return ExprParser::RuleMacd_signal;
}


std::any ExprParser::Macd_signalContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMacd_signal(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Macd_signalContext* ExprParser::macd_signal() {
  Macd_signalContext *_localctx = _tracker.createInstance<Macd_signalContext>(_ctx, getState());
  enterRule(_localctx, 42, ExprParser::RuleMacd_signal);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(386);
    match(ExprParser::T__30);
    setState(387);
    match(ExprParser::T__4);
    setState(388);
    match(ExprParser::INT);
    setState(389);
    match(ExprParser::T__8);
    setState(390);
    match(ExprParser::INT);
    setState(391);
    match(ExprParser::T__8);
    setState(392);
    match(ExprParser::INT);
    setState(395);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(393);
      match(ExprParser::T__8);
      setState(394);
      match(ExprParser::INT);
    }
    setState(397);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Macd_histogramContext ------------------------------------------------------------------

ExprParser::Macd_histogramContext::Macd_histogramContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Macd_histogramContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Macd_histogramContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Macd_histogramContext::getRuleIndex() const {
  return ExprParser::RuleMacd_histogram;
}


std::any ExprParser::Macd_histogramContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMacd_histogram(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Macd_histogramContext* ExprParser::macd_histogram() {
  Macd_histogramContext *_localctx = _tracker.createInstance<Macd_histogramContext>(_ctx, getState());
  enterRule(_localctx, 44, ExprParser::RuleMacd_histogram);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(399);
    match(ExprParser::T__31);
    setState(400);
    match(ExprParser::T__4);
    setState(401);
    match(ExprParser::INT);
    setState(402);
    match(ExprParser::T__8);
    setState(403);
    match(ExprParser::INT);
    setState(404);
    match(ExprParser::T__8);
    setState(405);
    match(ExprParser::INT);
    setState(408);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(406);
      match(ExprParser::T__8);
      setState(407);
      match(ExprParser::INT);
    }
    setState(410);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Bb_upperContext ------------------------------------------------------------------

ExprParser::Bb_upperContext::Bb_upperContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Bb_upperContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Bb_upperContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}

ExprParser::NumberContext* ExprParser::Bb_upperContext::number() {
  return getRuleContext<ExprParser::NumberContext>(0);
}


size_t ExprParser::Bb_upperContext::getRuleIndex() const {
  return ExprParser::RuleBb_upper;
}


std::any ExprParser::Bb_upperContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBb_upper(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Bb_upperContext* ExprParser::bb_upper() {
  Bb_upperContext *_localctx = _tracker.createInstance<Bb_upperContext>(_ctx, getState());
  enterRule(_localctx, 46, ExprParser::RuleBb_upper);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(412);
    match(ExprParser::T__32);
    setState(413);
    match(ExprParser::T__4);
    setState(414);
    match(ExprParser::INT);
    setState(415);
    match(ExprParser::T__8);
    setState(416);
    number();
    setState(419);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(417);
      match(ExprParser::T__8);
      setState(418);
      match(ExprParser::INT);
    }
    setState(421);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Bb_middleContext ------------------------------------------------------------------

ExprParser::Bb_middleContext::Bb_middleContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Bb_middleContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Bb_middleContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}

ExprParser::NumberContext* ExprParser::Bb_middleContext::number() {
  return getRuleContext<ExprParser::NumberContext>(0);
}


size_t ExprParser::Bb_middleContext::getRuleIndex() const {
  return ExprParser::RuleBb_middle;
}


std::any ExprParser::Bb_middleContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBb_middle(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Bb_middleContext* ExprParser::bb_middle() {
  Bb_middleContext *_localctx = _tracker.createInstance<Bb_middleContext>(_ctx, getState());
  enterRule(_localctx, 48, ExprParser::RuleBb_middle);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(423);
    match(ExprParser::T__33);
    setState(424);
    match(ExprParser::T__4);
    setState(425);
    match(ExprParser::INT);
    setState(426);
    match(ExprParser::T__8);
    setState(427);
    number();
    setState(430);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(428);
      match(ExprParser::T__8);
      setState(429);
      match(ExprParser::INT);
    }
    setState(432);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Bb_lowerContext ------------------------------------------------------------------

ExprParser::Bb_lowerContext::Bb_lowerContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Bb_lowerContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Bb_lowerContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}

ExprParser::NumberContext* ExprParser::Bb_lowerContext::number() {
  return getRuleContext<ExprParser::NumberContext>(0);
}


size_t ExprParser::Bb_lowerContext::getRuleIndex() const {
  return ExprParser::RuleBb_lower;
}


std::any ExprParser::Bb_lowerContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBb_lower(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Bb_lowerContext* ExprParser::bb_lower() {
  Bb_lowerContext *_localctx = _tracker.createInstance<Bb_lowerContext>(_ctx, getState());
  enterRule(_localctx, 50, ExprParser::RuleBb_lower);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(434);
    match(ExprParser::T__34);
    setState(435);
    match(ExprParser::T__4);
    setState(436);
    match(ExprParser::INT);
    setState(437);
    match(ExprParser::T__8);
    setState(438);
    number();
    setState(441);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(439);
      match(ExprParser::T__8);
      setState(440);
      match(ExprParser::INT);
    }
    setState(443);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Macd_n_dinhContext ------------------------------------------------------------------

ExprParser::Macd_n_dinhContext::Macd_n_dinhContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Macd_n_dinhContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Macd_n_dinhContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}

std::vector<ExprParser::NumberContext *> ExprParser::Macd_n_dinhContext::number() {
  return getRuleContexts<ExprParser::NumberContext>();
}

ExprParser::NumberContext* ExprParser::Macd_n_dinhContext::number(size_t i) {
  return getRuleContext<ExprParser::NumberContext>(i);
}


size_t ExprParser::Macd_n_dinhContext::getRuleIndex() const {
  return ExprParser::RuleMacd_n_dinh;
}


std::any ExprParser::Macd_n_dinhContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMacd_n_dinh(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Macd_n_dinhContext* ExprParser::macd_n_dinh() {
  Macd_n_dinhContext *_localctx = _tracker.createInstance<Macd_n_dinhContext>(_ctx, getState());
  enterRule(_localctx, 52, ExprParser::RuleMacd_n_dinh);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(445);
    match(ExprParser::T__35);
    setState(446);
    match(ExprParser::T__4);
    setState(447);
    match(ExprParser::INT);
    setState(448);
    match(ExprParser::T__8);
    setState(449);
    match(ExprParser::INT);
    setState(450);
    match(ExprParser::T__8);
    setState(451);
    match(ExprParser::INT);
    setState(452);
    match(ExprParser::T__8);
    setState(453);
    match(ExprParser::INT);
    setState(454);
    match(ExprParser::T__8);
    setState(455);
    match(ExprParser::INT);
    setState(456);
    match(ExprParser::T__8);
    setState(457);
    match(ExprParser::INT);
    setState(458);
    match(ExprParser::T__8);
    setState(459);
    number();
    setState(460);
    match(ExprParser::T__8);
    setState(461);
    match(ExprParser::INT);
    setState(466);
    _errHandler->sync(this);
    _la = _input->LA(1);
    while (_la == ExprParser::T__8) {
      setState(462);
      match(ExprParser::T__8);
      setState(463);
      number();
      setState(468);
      _errHandler->sync(this);
      _la = _input->LA(1);
    }
    setState(469);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Macd_slopeContext ------------------------------------------------------------------

ExprParser::Macd_slopeContext::Macd_slopeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Macd_slopeContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Macd_slopeContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Macd_slopeContext::getRuleIndex() const {
  return ExprParser::RuleMacd_slope;
}


std::any ExprParser::Macd_slopeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMacd_slope(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Macd_slopeContext* ExprParser::macd_slope() {
  Macd_slopeContext *_localctx = _tracker.createInstance<Macd_slopeContext>(_ctx, getState());
  enterRule(_localctx, 54, ExprParser::RuleMacd_slope);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(471);
    match(ExprParser::T__36);
    setState(472);
    match(ExprParser::T__4);
    setState(473);
    match(ExprParser::INT);
    setState(474);
    match(ExprParser::T__8);
    setState(475);
    match(ExprParser::INT);
    setState(476);
    match(ExprParser::T__8);
    setState(477);
    match(ExprParser::INT);
    setState(480);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(478);
      match(ExprParser::T__8);
      setState(479);
      match(ExprParser::INT);
    }
    setState(482);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Bullish_engulfingContext ------------------------------------------------------------------

ExprParser::Bullish_engulfingContext::Bullish_engulfingContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::Bullish_engulfingContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::Bullish_engulfingContext::getRuleIndex() const {
  return ExprParser::RuleBullish_engulfing;
}


std::any ExprParser::Bullish_engulfingContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBullish_engulfing(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Bullish_engulfingContext* ExprParser::bullish_engulfing() {
  Bullish_engulfingContext *_localctx = _tracker.createInstance<Bullish_engulfingContext>(_ctx, getState());
  enterRule(_localctx, 56, ExprParser::RuleBullish_engulfing);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(484);
    match(ExprParser::T__37);
    setState(485);
    match(ExprParser::T__4);
    setState(487);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(486);
      match(ExprParser::INT);
    }
    setState(489);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Bearish_engulfingContext ------------------------------------------------------------------

ExprParser::Bearish_engulfingContext::Bearish_engulfingContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::Bearish_engulfingContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::Bearish_engulfingContext::getRuleIndex() const {
  return ExprParser::RuleBearish_engulfing;
}


std::any ExprParser::Bearish_engulfingContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBearish_engulfing(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Bearish_engulfingContext* ExprParser::bearish_engulfing() {
  Bearish_engulfingContext *_localctx = _tracker.createInstance<Bearish_engulfingContext>(_ctx, getState());
  enterRule(_localctx, 58, ExprParser::RuleBearish_engulfing);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(491);
    match(ExprParser::T__38);
    setState(492);
    match(ExprParser::T__4);
    setState(494);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(493);
      match(ExprParser::INT);
    }
    setState(496);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Bullish_hammerContext ------------------------------------------------------------------

ExprParser::Bullish_hammerContext::Bullish_hammerContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::Bullish_hammerContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::Bullish_hammerContext::getRuleIndex() const {
  return ExprParser::RuleBullish_hammer;
}


std::any ExprParser::Bullish_hammerContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBullish_hammer(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Bullish_hammerContext* ExprParser::bullish_hammer() {
  Bullish_hammerContext *_localctx = _tracker.createInstance<Bullish_hammerContext>(_ctx, getState());
  enterRule(_localctx, 60, ExprParser::RuleBullish_hammer);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(498);
    match(ExprParser::T__39);
    setState(499);
    match(ExprParser::T__4);
    setState(501);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(500);
      match(ExprParser::INT);
    }
    setState(503);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Bearish_hammerContext ------------------------------------------------------------------

ExprParser::Bearish_hammerContext::Bearish_hammerContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::Bearish_hammerContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::Bearish_hammerContext::getRuleIndex() const {
  return ExprParser::RuleBearish_hammer;
}


std::any ExprParser::Bearish_hammerContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBearish_hammer(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Bearish_hammerContext* ExprParser::bearish_hammer() {
  Bearish_hammerContext *_localctx = _tracker.createInstance<Bearish_hammerContext>(_ctx, getState());
  enterRule(_localctx, 62, ExprParser::RuleBearish_hammer);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(505);
    match(ExprParser::T__40);
    setState(506);
    match(ExprParser::T__4);
    setState(508);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(507);
      match(ExprParser::INT);
    }
    setState(510);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- BullishContext ------------------------------------------------------------------

ExprParser::BullishContext::BullishContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::BullishContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::BullishContext::getRuleIndex() const {
  return ExprParser::RuleBullish;
}


std::any ExprParser::BullishContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBullish(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::BullishContext* ExprParser::bullish() {
  BullishContext *_localctx = _tracker.createInstance<BullishContext>(_ctx, getState());
  enterRule(_localctx, 64, ExprParser::RuleBullish);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(512);
    match(ExprParser::T__41);
    setState(513);
    match(ExprParser::T__4);
    setState(515);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(514);
      match(ExprParser::INT);
    }
    setState(517);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- BearishContext ------------------------------------------------------------------

ExprParser::BearishContext::BearishContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::BearishContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::BearishContext::getRuleIndex() const {
  return ExprParser::RuleBearish;
}


std::any ExprParser::BearishContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitBearish(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::BearishContext* ExprParser::bearish() {
  BearishContext *_localctx = _tracker.createInstance<BearishContext>(_ctx, getState());
  enterRule(_localctx, 66, ExprParser::RuleBearish);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(519);
    match(ExprParser::T__42);
    setState(520);
    match(ExprParser::T__4);
    setState(522);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(521);
      match(ExprParser::INT);
    }
    setState(524);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- MarsiContext ------------------------------------------------------------------

ExprParser::MarsiContext::MarsiContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::MarsiContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::MarsiContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::MarsiContext::getRuleIndex() const {
  return ExprParser::RuleMarsi;
}


std::any ExprParser::MarsiContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMarsi(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::MarsiContext* ExprParser::marsi() {
  MarsiContext *_localctx = _tracker.createInstance<MarsiContext>(_ctx, getState());
  enterRule(_localctx, 68, ExprParser::RuleMarsi);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(526);
    match(ExprParser::T__43);
    setState(527);
    match(ExprParser::T__4);
    setState(528);
    match(ExprParser::INT);
    setState(529);
    match(ExprParser::T__8);
    setState(530);
    match(ExprParser::INT);
    setState(533);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(531);
      match(ExprParser::T__8);
      setState(532);
      match(ExprParser::INT);
    }
    setState(535);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- DojiContext ------------------------------------------------------------------

ExprParser::DojiContext::DojiContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::DojiContext::INT() {
  return getToken(ExprParser::INT, 0);
}


size_t ExprParser::DojiContext::getRuleIndex() const {
  return ExprParser::RuleDoji;
}


std::any ExprParser::DojiContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitDoji(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::DojiContext* ExprParser::doji() {
  DojiContext *_localctx = _tracker.createInstance<DojiContext>(_ctx, getState());
  enterRule(_localctx, 70, ExprParser::RuleDoji);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(537);
    match(ExprParser::T__44);
    setState(538);
    match(ExprParser::T__4);
    setState(540);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::INT) {
      setState(539);
      match(ExprParser::INT);
    }
    setState(542);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Avg_openContext ------------------------------------------------------------------

ExprParser::Avg_openContext::Avg_openContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Avg_openContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Avg_openContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Avg_openContext::getRuleIndex() const {
  return ExprParser::RuleAvg_open;
}


std::any ExprParser::Avg_openContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAvg_open(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Avg_openContext* ExprParser::avg_open() {
  Avg_openContext *_localctx = _tracker.createInstance<Avg_openContext>(_ctx, getState());
  enterRule(_localctx, 72, ExprParser::RuleAvg_open);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(544);
    match(ExprParser::T__45);
    setState(545);
    match(ExprParser::T__4);
    setState(546);
    match(ExprParser::INT);
    setState(549);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(547);
      match(ExprParser::T__8);
      setState(548);
      match(ExprParser::INT);
    }
    setState(551);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Avg_highContext ------------------------------------------------------------------

ExprParser::Avg_highContext::Avg_highContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Avg_highContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Avg_highContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Avg_highContext::getRuleIndex() const {
  return ExprParser::RuleAvg_high;
}


std::any ExprParser::Avg_highContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAvg_high(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Avg_highContext* ExprParser::avg_high() {
  Avg_highContext *_localctx = _tracker.createInstance<Avg_highContext>(_ctx, getState());
  enterRule(_localctx, 74, ExprParser::RuleAvg_high);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(553);
    match(ExprParser::T__46);
    setState(554);
    match(ExprParser::T__4);
    setState(555);
    match(ExprParser::INT);
    setState(558);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(556);
      match(ExprParser::T__8);
      setState(557);
      match(ExprParser::INT);
    }
    setState(560);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Avg_lowContext ------------------------------------------------------------------

ExprParser::Avg_lowContext::Avg_lowContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Avg_lowContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Avg_lowContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Avg_lowContext::getRuleIndex() const {
  return ExprParser::RuleAvg_low;
}


std::any ExprParser::Avg_lowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAvg_low(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Avg_lowContext* ExprParser::avg_low() {
  Avg_lowContext *_localctx = _tracker.createInstance<Avg_lowContext>(_ctx, getState());
  enterRule(_localctx, 76, ExprParser::RuleAvg_low);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(562);
    match(ExprParser::T__47);
    setState(563);
    match(ExprParser::T__4);
    setState(564);
    match(ExprParser::INT);
    setState(567);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(565);
      match(ExprParser::T__8);
      setState(566);
      match(ExprParser::INT);
    }
    setState(569);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Avg_closeContext ------------------------------------------------------------------

ExprParser::Avg_closeContext::Avg_closeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Avg_closeContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Avg_closeContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Avg_closeContext::getRuleIndex() const {
  return ExprParser::RuleAvg_close;
}


std::any ExprParser::Avg_closeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAvg_close(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Avg_closeContext* ExprParser::avg_close() {
  Avg_closeContext *_localctx = _tracker.createInstance<Avg_closeContext>(_ctx, getState());
  enterRule(_localctx, 78, ExprParser::RuleAvg_close);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(571);
    match(ExprParser::T__48);
    setState(572);
    match(ExprParser::T__4);
    setState(573);
    match(ExprParser::INT);
    setState(576);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(574);
      match(ExprParser::T__8);
      setState(575);
      match(ExprParser::INT);
    }
    setState(578);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Avg_amplContext ------------------------------------------------------------------

ExprParser::Avg_amplContext::Avg_amplContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Avg_amplContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Avg_amplContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Avg_amplContext::getRuleIndex() const {
  return ExprParser::RuleAvg_ampl;
}


std::any ExprParser::Avg_amplContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAvg_ampl(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Avg_amplContext* ExprParser::avg_ampl() {
  Avg_amplContext *_localctx = _tracker.createInstance<Avg_amplContext>(_ctx, getState());
  enterRule(_localctx, 80, ExprParser::RuleAvg_ampl);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(580);
    match(ExprParser::T__49);
    setState(581);
    match(ExprParser::T__4);
    setState(582);
    match(ExprParser::INT);
    setState(585);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(583);
      match(ExprParser::T__8);
      setState(584);
      match(ExprParser::INT);
    }
    setState(587);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Avg_amplPContext ------------------------------------------------------------------

ExprParser::Avg_amplPContext::Avg_amplPContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Avg_amplPContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Avg_amplPContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Avg_amplPContext::getRuleIndex() const {
  return ExprParser::RuleAvg_amplP;
}


std::any ExprParser::Avg_amplPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitAvg_amplP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Avg_amplPContext* ExprParser::avg_amplP() {
  Avg_amplPContext *_localctx = _tracker.createInstance<Avg_amplPContext>(_ctx, getState());
  enterRule(_localctx, 82, ExprParser::RuleAvg_amplP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(589);
    match(ExprParser::T__50);
    setState(590);
    match(ExprParser::T__4);
    setState(591);
    match(ExprParser::INT);
    setState(594);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(592);
      match(ExprParser::T__8);
      setState(593);
      match(ExprParser::INT);
    }
    setState(596);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_openContext ------------------------------------------------------------------

ExprParser::Max_openContext::Max_openContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_openContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_openContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_openContext::getRuleIndex() const {
  return ExprParser::RuleMax_open;
}


std::any ExprParser::Max_openContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_open(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_openContext* ExprParser::max_open() {
  Max_openContext *_localctx = _tracker.createInstance<Max_openContext>(_ctx, getState());
  enterRule(_localctx, 84, ExprParser::RuleMax_open);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(598);
    match(ExprParser::T__51);
    setState(599);
    match(ExprParser::T__4);
    setState(600);
    match(ExprParser::INT);
    setState(603);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(601);
      match(ExprParser::T__8);
      setState(602);
      match(ExprParser::INT);
    }
    setState(605);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_highContext ------------------------------------------------------------------

ExprParser::Max_highContext::Max_highContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_highContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_highContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_highContext::getRuleIndex() const {
  return ExprParser::RuleMax_high;
}


std::any ExprParser::Max_highContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_high(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_highContext* ExprParser::max_high() {
  Max_highContext *_localctx = _tracker.createInstance<Max_highContext>(_ctx, getState());
  enterRule(_localctx, 86, ExprParser::RuleMax_high);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(607);
    match(ExprParser::T__52);
    setState(608);
    match(ExprParser::T__4);
    setState(609);
    match(ExprParser::INT);
    setState(612);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(610);
      match(ExprParser::T__8);
      setState(611);
      match(ExprParser::INT);
    }
    setState(614);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_lowContext ------------------------------------------------------------------

ExprParser::Max_lowContext::Max_lowContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_lowContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_lowContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_lowContext::getRuleIndex() const {
  return ExprParser::RuleMax_low;
}


std::any ExprParser::Max_lowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_low(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_lowContext* ExprParser::max_low() {
  Max_lowContext *_localctx = _tracker.createInstance<Max_lowContext>(_ctx, getState());
  enterRule(_localctx, 88, ExprParser::RuleMax_low);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(616);
    match(ExprParser::T__53);
    setState(617);
    match(ExprParser::T__4);
    setState(618);
    match(ExprParser::INT);
    setState(621);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(619);
      match(ExprParser::T__8);
      setState(620);
      match(ExprParser::INT);
    }
    setState(623);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_closeContext ------------------------------------------------------------------

ExprParser::Max_closeContext::Max_closeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_closeContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_closeContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_closeContext::getRuleIndex() const {
  return ExprParser::RuleMax_close;
}


std::any ExprParser::Max_closeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_close(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_closeContext* ExprParser::max_close() {
  Max_closeContext *_localctx = _tracker.createInstance<Max_closeContext>(_ctx, getState());
  enterRule(_localctx, 90, ExprParser::RuleMax_close);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(625);
    match(ExprParser::T__54);
    setState(626);
    match(ExprParser::T__4);
    setState(627);
    match(ExprParser::INT);
    setState(630);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(628);
      match(ExprParser::T__8);
      setState(629);
      match(ExprParser::INT);
    }
    setState(632);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_openContext ------------------------------------------------------------------

ExprParser::Min_openContext::Min_openContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_openContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_openContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_openContext::getRuleIndex() const {
  return ExprParser::RuleMin_open;
}


std::any ExprParser::Min_openContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_open(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_openContext* ExprParser::min_open() {
  Min_openContext *_localctx = _tracker.createInstance<Min_openContext>(_ctx, getState());
  enterRule(_localctx, 92, ExprParser::RuleMin_open);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(634);
    match(ExprParser::T__55);
    setState(635);
    match(ExprParser::T__4);
    setState(636);
    match(ExprParser::INT);
    setState(639);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(637);
      match(ExprParser::T__8);
      setState(638);
      match(ExprParser::INT);
    }
    setState(641);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_highContext ------------------------------------------------------------------

ExprParser::Min_highContext::Min_highContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_highContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_highContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_highContext::getRuleIndex() const {
  return ExprParser::RuleMin_high;
}


std::any ExprParser::Min_highContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_high(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_highContext* ExprParser::min_high() {
  Min_highContext *_localctx = _tracker.createInstance<Min_highContext>(_ctx, getState());
  enterRule(_localctx, 94, ExprParser::RuleMin_high);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(643);
    match(ExprParser::T__56);
    setState(644);
    match(ExprParser::T__4);
    setState(645);
    match(ExprParser::INT);
    setState(648);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(646);
      match(ExprParser::T__8);
      setState(647);
      match(ExprParser::INT);
    }
    setState(650);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_lowContext ------------------------------------------------------------------

ExprParser::Min_lowContext::Min_lowContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_lowContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_lowContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_lowContext::getRuleIndex() const {
  return ExprParser::RuleMin_low;
}


std::any ExprParser::Min_lowContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_low(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_lowContext* ExprParser::min_low() {
  Min_lowContext *_localctx = _tracker.createInstance<Min_lowContext>(_ctx, getState());
  enterRule(_localctx, 96, ExprParser::RuleMin_low);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(652);
    match(ExprParser::T__57);
    setState(653);
    match(ExprParser::T__4);
    setState(654);
    match(ExprParser::INT);
    setState(657);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(655);
      match(ExprParser::T__8);
      setState(656);
      match(ExprParser::INT);
    }
    setState(659);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_closeContext ------------------------------------------------------------------

ExprParser::Min_closeContext::Min_closeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_closeContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_closeContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_closeContext::getRuleIndex() const {
  return ExprParser::RuleMin_close;
}


std::any ExprParser::Min_closeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_close(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_closeContext* ExprParser::min_close() {
  Min_closeContext *_localctx = _tracker.createInstance<Min_closeContext>(_ctx, getState());
  enterRule(_localctx, 98, ExprParser::RuleMin_close);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(661);
    match(ExprParser::T__58);
    setState(662);
    match(ExprParser::T__4);
    setState(663);
    match(ExprParser::INT);
    setState(666);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(664);
      match(ExprParser::T__8);
      setState(665);
      match(ExprParser::INT);
    }
    setState(668);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_rsiContext ------------------------------------------------------------------

ExprParser::Min_rsiContext::Min_rsiContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_rsiContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_rsiContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_rsiContext::getRuleIndex() const {
  return ExprParser::RuleMin_rsi;
}


std::any ExprParser::Min_rsiContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_rsi(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_rsiContext* ExprParser::min_rsi() {
  Min_rsiContext *_localctx = _tracker.createInstance<Min_rsiContext>(_ctx, getState());
  enterRule(_localctx, 100, ExprParser::RuleMin_rsi);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(670);
    match(ExprParser::T__59);
    setState(671);
    match(ExprParser::T__4);
    setState(672);
    match(ExprParser::INT);
    setState(673);
    match(ExprParser::T__8);
    setState(674);
    match(ExprParser::INT);
    setState(677);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(675);
      match(ExprParser::T__8);
      setState(676);
      match(ExprParser::INT);
    }
    setState(679);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_rsiContext ------------------------------------------------------------------

ExprParser::Max_rsiContext::Max_rsiContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_rsiContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_rsiContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_rsiContext::getRuleIndex() const {
  return ExprParser::RuleMax_rsi;
}


std::any ExprParser::Max_rsiContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_rsi(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_rsiContext* ExprParser::max_rsi() {
  Max_rsiContext *_localctx = _tracker.createInstance<Max_rsiContext>(_ctx, getState());
  enterRule(_localctx, 102, ExprParser::RuleMax_rsi);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(681);
    match(ExprParser::T__60);
    setState(682);
    match(ExprParser::T__4);
    setState(683);
    match(ExprParser::INT);
    setState(684);
    match(ExprParser::T__8);
    setState(685);
    match(ExprParser::INT);
    setState(688);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(686);
      match(ExprParser::T__8);
      setState(687);
      match(ExprParser::INT);
    }
    setState(690);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_changeContext ------------------------------------------------------------------

ExprParser::Min_changeContext::Min_changeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_changeContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_changeContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_changeContext::getRuleIndex() const {
  return ExprParser::RuleMin_change;
}


std::any ExprParser::Min_changeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_change(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_changeContext* ExprParser::min_change() {
  Min_changeContext *_localctx = _tracker.createInstance<Min_changeContext>(_ctx, getState());
  enterRule(_localctx, 104, ExprParser::RuleMin_change);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(692);
    match(ExprParser::T__61);
    setState(693);
    match(ExprParser::T__4);
    setState(694);
    match(ExprParser::INT);
    setState(697);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(695);
      match(ExprParser::T__8);
      setState(696);
      match(ExprParser::INT);
    }
    setState(699);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_changeContext ------------------------------------------------------------------

ExprParser::Max_changeContext::Max_changeContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_changeContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_changeContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_changeContext::getRuleIndex() const {
  return ExprParser::RuleMax_change;
}


std::any ExprParser::Max_changeContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_change(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_changeContext* ExprParser::max_change() {
  Max_changeContext *_localctx = _tracker.createInstance<Max_changeContext>(_ctx, getState());
  enterRule(_localctx, 106, ExprParser::RuleMax_change);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(701);
    match(ExprParser::T__62);
    setState(702);
    match(ExprParser::T__4);
    setState(703);
    match(ExprParser::INT);
    setState(706);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(704);
      match(ExprParser::T__8);
      setState(705);
      match(ExprParser::INT);
    }
    setState(708);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_changePContext ------------------------------------------------------------------

ExprParser::Min_changePContext::Min_changePContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_changePContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_changePContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_changePContext::getRuleIndex() const {
  return ExprParser::RuleMin_changeP;
}


std::any ExprParser::Min_changePContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_changeP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_changePContext* ExprParser::min_changeP() {
  Min_changePContext *_localctx = _tracker.createInstance<Min_changePContext>(_ctx, getState());
  enterRule(_localctx, 108, ExprParser::RuleMin_changeP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(710);
    match(ExprParser::T__63);
    setState(711);
    match(ExprParser::T__4);
    setState(712);
    match(ExprParser::INT);
    setState(715);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(713);
      match(ExprParser::T__8);
      setState(714);
      match(ExprParser::INT);
    }
    setState(717);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_changePContext ------------------------------------------------------------------

ExprParser::Max_changePContext::Max_changePContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_changePContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_changePContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_changePContext::getRuleIndex() const {
  return ExprParser::RuleMax_changeP;
}


std::any ExprParser::Max_changePContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_changeP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_changePContext* ExprParser::max_changeP() {
  Max_changePContext *_localctx = _tracker.createInstance<Max_changePContext>(_ctx, getState());
  enterRule(_localctx, 110, ExprParser::RuleMax_changeP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(719);
    match(ExprParser::T__64);
    setState(720);
    match(ExprParser::T__4);
    setState(721);
    match(ExprParser::INT);
    setState(724);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(722);
      match(ExprParser::T__8);
      setState(723);
      match(ExprParser::INT);
    }
    setState(726);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_amplContext ------------------------------------------------------------------

ExprParser::Min_amplContext::Min_amplContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_amplContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_amplContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_amplContext::getRuleIndex() const {
  return ExprParser::RuleMin_ampl;
}


std::any ExprParser::Min_amplContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_ampl(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_amplContext* ExprParser::min_ampl() {
  Min_amplContext *_localctx = _tracker.createInstance<Min_amplContext>(_ctx, getState());
  enterRule(_localctx, 112, ExprParser::RuleMin_ampl);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(728);
    match(ExprParser::T__65);
    setState(729);
    match(ExprParser::T__4);
    setState(730);
    match(ExprParser::INT);
    setState(733);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(731);
      match(ExprParser::T__8);
      setState(732);
      match(ExprParser::INT);
    }
    setState(735);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_amplContext ------------------------------------------------------------------

ExprParser::Max_amplContext::Max_amplContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_amplContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_amplContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_amplContext::getRuleIndex() const {
  return ExprParser::RuleMax_ampl;
}


std::any ExprParser::Max_amplContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_ampl(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_amplContext* ExprParser::max_ampl() {
  Max_amplContext *_localctx = _tracker.createInstance<Max_amplContext>(_ctx, getState());
  enterRule(_localctx, 114, ExprParser::RuleMax_ampl);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(737);
    match(ExprParser::T__66);
    setState(738);
    match(ExprParser::T__4);
    setState(739);
    match(ExprParser::INT);
    setState(742);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(740);
      match(ExprParser::T__8);
      setState(741);
      match(ExprParser::INT);
    }
    setState(744);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Min_amplPContext ------------------------------------------------------------------

ExprParser::Min_amplPContext::Min_amplPContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Min_amplPContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Min_amplPContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Min_amplPContext::getRuleIndex() const {
  return ExprParser::RuleMin_amplP;
}


std::any ExprParser::Min_amplPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMin_amplP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Min_amplPContext* ExprParser::min_amplP() {
  Min_amplPContext *_localctx = _tracker.createInstance<Min_amplPContext>(_ctx, getState());
  enterRule(_localctx, 116, ExprParser::RuleMin_amplP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(746);
    match(ExprParser::T__67);
    setState(747);
    match(ExprParser::T__4);
    setState(748);
    match(ExprParser::INT);
    setState(751);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(749);
      match(ExprParser::T__8);
      setState(750);
      match(ExprParser::INT);
    }
    setState(753);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- Max_amplPContext ------------------------------------------------------------------

ExprParser::Max_amplPContext::Max_amplPContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

std::vector<tree::TerminalNode *> ExprParser::Max_amplPContext::INT() {
  return getTokens(ExprParser::INT);
}

tree::TerminalNode* ExprParser::Max_amplPContext::INT(size_t i) {
  return getToken(ExprParser::INT, i);
}


size_t ExprParser::Max_amplPContext::getRuleIndex() const {
  return ExprParser::RuleMax_amplP;
}


std::any ExprParser::Max_amplPContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitMax_amplP(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::Max_amplPContext* ExprParser::max_amplP() {
  Max_amplPContext *_localctx = _tracker.createInstance<Max_amplPContext>(_ctx, getState());
  enterRule(_localctx, 118, ExprParser::RuleMax_amplP);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(755);
    match(ExprParser::T__68);
    setState(756);
    match(ExprParser::T__4);
    setState(757);
    match(ExprParser::INT);
    setState(760);
    _errHandler->sync(this);

    _la = _input->LA(1);
    if (_la == ExprParser::T__8) {
      setState(758);
      match(ExprParser::T__8);
      setState(759);
      match(ExprParser::INT);
    }
    setState(762);
    match(ExprParser::T__5);
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- ComparisonOpContext ------------------------------------------------------------------

ExprParser::ComparisonOpContext::ComparisonOpContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}


size_t ExprParser::ComparisonOpContext::getRuleIndex() const {
  return ExprParser::RuleComparisonOp;
}


std::any ExprParser::ComparisonOpContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitComparisonOp(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::ComparisonOpContext* ExprParser::comparisonOp() {
  ComparisonOpContext *_localctx = _tracker.createInstance<ComparisonOpContext>(_ctx, getState());
  enterRule(_localctx, 120, ExprParser::RuleComparisonOp);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(764);
    _la = _input->LA(1);
    if (!(((((_la - 70) & ~ 0x3fULL) == 0) &&
      ((1ULL << (_la - 70)) & 63) != 0))) {
    _errHandler->recoverInline(this);
    }
    else {
      _errHandler->reportMatch(this);
      consume();
    }
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

//----------------- NumberContext ------------------------------------------------------------------

ExprParser::NumberContext::NumberContext(ParserRuleContext *parent, size_t invokingState)
  : ParserRuleContext(parent, invokingState) {
}

tree::TerminalNode* ExprParser::NumberContext::INT() {
  return getToken(ExprParser::INT, 0);
}

tree::TerminalNode* ExprParser::NumberContext::FLOAT() {
  return getToken(ExprParser::FLOAT, 0);
}


size_t ExprParser::NumberContext::getRuleIndex() const {
  return ExprParser::RuleNumber;
}


std::any ExprParser::NumberContext::accept(tree::ParseTreeVisitor *visitor) {
  if (auto parserVisitor = dynamic_cast<ExprVisitor*>(visitor))
    return parserVisitor->visitNumber(this);
  else
    return visitor->visitChildren(this);
}

ExprParser::NumberContext* ExprParser::number() {
  NumberContext *_localctx = _tracker.createInstance<NumberContext>(_ctx, getState());
  enterRule(_localctx, 122, ExprParser::RuleNumber);
  size_t _la = 0;

#if __cplusplus > 201703L
  auto onExit = finally([=, this] {
#else
  auto onExit = finally([=] {
#endif
    exitRule();
  });
  try {
    enterOuterAlt(_localctx, 1);
    setState(766);
    _la = _input->LA(1);
    if (!(_la == ExprParser::INT

    || _la == ExprParser::FLOAT)) {
    _errHandler->recoverInline(this);
    }
    else {
      _errHandler->reportMatch(this);
      consume();
    }
   
  }
  catch (RecognitionException &e) {
    _errHandler->reportError(this, e);
    _localctx->exception = std::current_exception();
    _errHandler->recover(this, _localctx->exception);
  }

  return _localctx;
}

bool ExprParser::sempred(RuleContext *context, size_t ruleIndex, size_t predicateIndex) {
  switch (ruleIndex) {
    case 0: return exprSempred(antlrcpp::downCast<ExprContext *>(context), predicateIndex);

  default:
    break;
  }
  return true;
}

bool ExprParser::exprSempred(ExprContext *_localctx, size_t predicateIndex) {
  switch (predicateIndex) {
    case 0: return precpred(_ctx, 71);
    case 1: return precpred(_ctx, 70);
    case 2: return precpred(_ctx, 67);

  default:
    break;
  }
  return true;
}

void ExprParser::initialize() {
#if ANTLR4_USE_THREAD_LOCAL_CACHE
  exprParserInitialize();
#else
  ::antlr4::internal::call_once(exprParserOnceFlag, exprParserInitialize);
#endif
}
