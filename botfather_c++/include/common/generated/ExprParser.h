
// Generated from src/common/Expr.g4 by ANTLR 4.13.1

#pragma once


#include "antlr4-runtime.h"




class  ExprParser : public antlr4::Parser {
public:
  enum {
    T__0 = 1, T__1 = 2, T__2 = 3, T__3 = 4, T__4 = 5, T__5 = 6, T__6 = 7, 
    T__7 = 8, T__8 = 9, T__9 = 10, T__10 = 11, T__11 = 12, T__12 = 13, T__13 = 14, 
    T__14 = 15, T__15 = 16, T__16 = 17, T__17 = 18, T__18 = 19, T__19 = 20, 
    T__20 = 21, T__21 = 22, T__22 = 23, T__23 = 24, T__24 = 25, T__25 = 26, 
    T__26 = 27, T__27 = 28, T__28 = 29, T__29 = 30, T__30 = 31, T__31 = 32, 
    T__32 = 33, T__33 = 34, T__34 = 35, T__35 = 36, T__36 = 37, T__37 = 38, 
    T__38 = 39, T__39 = 40, T__40 = 41, T__41 = 42, T__42 = 43, T__43 = 44, 
    T__44 = 45, T__45 = 46, T__46 = 47, T__47 = 48, T__48 = 49, T__49 = 50, 
    T__50 = 51, T__51 = 52, T__52 = 53, T__53 = 54, T__54 = 55, T__55 = 56, 
    T__56 = 57, T__57 = 58, T__58 = 59, T__59 = 60, T__60 = 61, T__61 = 62, 
    T__62 = 63, T__63 = 64, T__64 = 65, T__65 = 66, T__66 = 67, T__67 = 68, 
    T__68 = 69, T__69 = 70, T__70 = 71, T__71 = 72, T__72 = 73, T__73 = 74, 
    T__74 = 75, INT = 76, FLOAT = 77, STRING = 78, WS = 79
  };

  enum {
    RuleExpr = 0, RuleHour = 1, RuleMinute = 2, RuleOpen = 3, RuleHigh = 4, 
    RuleLow = 5, RuleClose = 6, RuleVolume = 7, RuleChange = 8, RuleChangeP = 9, 
    RuleAmpl = 10, RuleAmplP = 11, RuleUpper_shadow = 12, RuleUpper_shadowP = 13, 
    RuleLower_shadow = 14, RuleLower_shadowP = 15, RuleRsi = 16, RuleRsi_slope = 17, 
    RuleMa = 18, RuleEma = 19, RuleMacd_value = 20, RuleMacd_signal = 21, 
    RuleMacd_histogram = 22, RuleBb_upper = 23, RuleBb_middle = 24, RuleBb_lower = 25, 
    RuleMacd_n_dinh = 26, RuleMacd_slope = 27, RuleBullish_engulfing = 28, 
    RuleBearish_engulfing = 29, RuleBullish_hammer = 30, RuleBearish_hammer = 31, 
    RuleBullish = 32, RuleBearish = 33, RuleMarsi = 34, RuleDoji = 35, RuleAvg_open = 36, 
    RuleAvg_high = 37, RuleAvg_low = 38, RuleAvg_close = 39, RuleAvg_ampl = 40, 
    RuleAvg_amplP = 41, RuleMax_open = 42, RuleMax_high = 43, RuleMax_low = 44, 
    RuleMax_close = 45, RuleMin_open = 46, RuleMin_high = 47, RuleMin_low = 48, 
    RuleMin_close = 49, RuleMin_rsi = 50, RuleMax_rsi = 51, RuleMin_change = 52, 
    RuleMax_change = 53, RuleMin_changeP = 54, RuleMax_changeP = 55, RuleMin_ampl = 56, 
    RuleMax_ampl = 57, RuleMin_amplP = 58, RuleMax_amplP = 59, RuleComparisonOp = 60, 
    RuleNumber = 61
  };

  explicit ExprParser(antlr4::TokenStream *input);

  ExprParser(antlr4::TokenStream *input, const antlr4::atn::ParserATNSimulatorOptions &options);

  ~ExprParser() override;

  std::string getGrammarFileName() const override;

  const antlr4::atn::ATN& getATN() const override;

  const std::vector<std::string>& getRuleNames() const override;

  const antlr4::dfa::Vocabulary& getVocabulary() const override;

  antlr4::atn::SerializedATNView getSerializedATN() const override;


  class ExprContext;
  class HourContext;
  class MinuteContext;
  class OpenContext;
  class HighContext;
  class LowContext;
  class CloseContext;
  class VolumeContext;
  class ChangeContext;
  class ChangePContext;
  class AmplContext;
  class AmplPContext;
  class Upper_shadowContext;
  class Upper_shadowPContext;
  class Lower_shadowContext;
  class Lower_shadowPContext;
  class RsiContext;
  class Rsi_slopeContext;
  class MaContext;
  class EmaContext;
  class Macd_valueContext;
  class Macd_signalContext;
  class Macd_histogramContext;
  class Bb_upperContext;
  class Bb_middleContext;
  class Bb_lowerContext;
  class Macd_n_dinhContext;
  class Macd_slopeContext;
  class Bullish_engulfingContext;
  class Bearish_engulfingContext;
  class Bullish_hammerContext;
  class Bearish_hammerContext;
  class BullishContext;
  class BearishContext;
  class MarsiContext;
  class DojiContext;
  class Avg_openContext;
  class Avg_highContext;
  class Avg_lowContext;
  class Avg_closeContext;
  class Avg_amplContext;
  class Avg_amplPContext;
  class Max_openContext;
  class Max_highContext;
  class Max_lowContext;
  class Max_closeContext;
  class Min_openContext;
  class Min_highContext;
  class Min_lowContext;
  class Min_closeContext;
  class Min_rsiContext;
  class Max_rsiContext;
  class Min_changeContext;
  class Max_changeContext;
  class Min_changePContext;
  class Max_changePContext;
  class Min_amplContext;
  class Max_amplContext;
  class Min_amplPContext;
  class Max_amplPContext;
  class ComparisonOpContext;
  class NumberContext; 

  class  ExprContext : public antlr4::ParserRuleContext {
  public:
    ExprContext(antlr4::ParserRuleContext *parent, size_t invokingState);
   
    ExprContext() = default;
    void copyFrom(ExprContext *context);
    using antlr4::ParserRuleContext::copyFrom;

    virtual size_t getRuleIndex() const override;

   
  };

  class  ICloseContext : public ExprContext {
  public:
    ICloseContext(ExprContext *ctx);

    CloseContext *close();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinChangeContext : public ExprContext {
  public:
    IMinChangeContext(ExprContext *ctx);

    Min_changeContext *min_change();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMACD_signalContext : public ExprContext {
  public:
    IMACD_signalContext(ExprContext *ctx);

    Macd_signalContext *macd_signal();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinAmplContext : public ExprContext {
  public:
    IMinAmplContext(ExprContext *ctx);

    Min_amplContext *min_ampl();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBullish_hammerContext : public ExprContext {
  public:
    IBullish_hammerContext(ExprContext *ctx);

    Bullish_hammerContext *bullish_hammer();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IHourContext : public ExprContext {
  public:
    IHourContext(ExprContext *ctx);

    HourContext *hour();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IAvgAmplContext : public ExprContext {
  public:
    IAvgAmplContext(ExprContext *ctx);

    Avg_amplContext *avg_ampl();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  ILowerShadowContext : public ExprContext {
  public:
    ILowerShadowContext(ExprContext *ctx);

    Lower_shadowContext *lower_shadow();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMACD_histogramContext : public ExprContext {
  public:
    IMACD_histogramContext(ExprContext *ctx);

    Macd_histogramContext *macd_histogram();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  StringContext : public ExprContext {
  public:
    StringContext(ExprContext *ctx);

    antlr4::tree::TerminalNode *STRING();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IAvgHighContext : public ExprContext {
  public:
    IAvgHighContext(ExprContext *ctx);

    Avg_highContext *avg_high();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinRSIContext : public ExprContext {
  public:
    IMinRSIContext(ExprContext *ctx);

    Min_rsiContext *min_rsi();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinuteContext : public ExprContext {
  public:
    IMinuteContext(ExprContext *ctx);

    MinuteContext *minute();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinHighContext : public ExprContext {
  public:
    IMinHighContext(ExprContext *ctx);

    Min_highContext *min_high();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  NegativeContext : public ExprContext {
  public:
    NegativeContext(ExprContext *ctx);

    ExprContext *expr();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IAvgAmplPContext : public ExprContext {
  public:
    IAvgAmplPContext(ExprContext *ctx);

    Avg_amplPContext *avg_amplP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  ILowContext : public ExprContext {
  public:
    ILowContext(ExprContext *ctx);

    LowContext *low();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IVolumeContext : public ExprContext {
  public:
    IVolumeContext(ExprContext *ctx);

    VolumeContext *volume();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinCloseContext : public ExprContext {
  public:
    IMinCloseContext(ExprContext *ctx);

    Min_closeContext *min_close();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IEMAContext : public ExprContext {
  public:
    IEMAContext(ExprContext *ctx);

    EmaContext *ema();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBB_lowContext : public ExprContext {
  public:
    IBB_lowContext(ExprContext *ctx);

    Bb_lowerContext *bb_lower();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxHighContext : public ExprContext {
  public:
    IMaxHighContext(ExprContext *ctx);

    Max_highContext *max_high();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMACD_n_dinhContext : public ExprContext {
  public:
    IMACD_n_dinhContext(ExprContext *ctx);

    Macd_n_dinhContext *macd_n_dinh();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinLowContext : public ExprContext {
  public:
    IMinLowContext(ExprContext *ctx);

    Min_lowContext *min_low();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IRSIContext : public ExprContext {
  public:
    IRSIContext(ExprContext *ctx);

    RsiContext *rsi();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBB_midContext : public ExprContext {
  public:
    IBB_midContext(ExprContext *ctx);

    Bb_middleContext *bb_middle();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  FloatContext : public ExprContext {
  public:
    FloatContext(ExprContext *ctx);

    antlr4::tree::TerminalNode *FLOAT();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  MINContext : public ExprContext {
  public:
    MINContext(ExprContext *ctx);

    std::vector<ExprContext *> expr();
    ExprContext* expr(size_t i);

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxAmplPContext : public ExprContext {
  public:
    IMaxAmplPContext(ExprContext *ctx);

    Max_amplPContext *max_amplP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMAContext : public ExprContext {
  public:
    IMAContext(ExprContext *ctx);

    MaContext *ma();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBearishContext : public ExprContext {
  public:
    IBearishContext(ExprContext *ctx);

    BearishContext *bearish();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IOpenContext : public ExprContext {
  public:
    IOpenContext(ExprContext *ctx);

    OpenContext *open();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IHighContext : public ExprContext {
  public:
    IHighContext(ExprContext *ctx);

    HighContext *high();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMARSIContext : public ExprContext {
  public:
    IMARSIContext(ExprContext *ctx);

    MarsiContext *marsi();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxOpenContext : public ExprContext {
  public:
    IMaxOpenContext(ExprContext *ctx);

    Max_openContext *max_open();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  MAXContext : public ExprContext {
  public:
    MAXContext(ExprContext *ctx);

    std::vector<ExprContext *> expr();
    ExprContext* expr(size_t i);

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  MulDivContext : public ExprContext {
  public:
    MulDivContext(ExprContext *ctx);

    std::vector<ExprContext *> expr();
    ExprContext* expr(size_t i);

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  ParensContext : public ExprContext {
  public:
    ParensContext(ExprContext *ctx);

    ExprContext *expr();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxChangePContext : public ExprContext {
  public:
    IMaxChangePContext(ExprContext *ctx);

    Max_changePContext *max_changeP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  ILowerShadowPContext : public ExprContext {
  public:
    ILowerShadowPContext(ExprContext *ctx);

    Lower_shadowPContext *lower_shadowP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinAmplPContext : public ExprContext {
  public:
    IMinAmplPContext(ExprContext *ctx);

    Min_amplPContext *min_amplP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IAmplPContext : public ExprContext {
  public:
    IAmplPContext(ExprContext *ctx);

    AmplPContext *amplP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IAvgCloseContext : public ExprContext {
  public:
    IAvgCloseContext(ExprContext *ctx);

    Avg_closeContext *avg_close();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinChangePContext : public ExprContext {
  public:
    IMinChangePContext(ExprContext *ctx);

    Min_changePContext *min_changeP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxCloseContext : public ExprContext {
  public:
    IMaxCloseContext(ExprContext *ctx);

    Max_closeContext *max_close();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IntContext : public ExprContext {
  public:
    IntContext(ExprContext *ctx);

    antlr4::tree::TerminalNode *INT();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  ABSContext : public ExprContext {
  public:
    ABSContext(ExprContext *ctx);

    ExprContext *expr();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IChangeContext : public ExprContext {
  public:
    IChangeContext(ExprContext *ctx);

    ChangeContext *change();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  ComparisonContext : public ExprContext {
  public:
    ComparisonContext(ExprContext *ctx);

    std::vector<ExprContext *> expr();
    ExprContext* expr(size_t i);
    ComparisonOpContext *comparisonOp();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IAmplContext : public ExprContext {
  public:
    IAmplContext(ExprContext *ctx);

    AmplContext *ampl();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxAmplContext : public ExprContext {
  public:
    IMaxAmplContext(ExprContext *ctx);

    Max_amplContext *max_ampl();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBullish_engulfingContext : public ExprContext {
  public:
    IBullish_engulfingContext(ExprContext *ctx);

    Bullish_engulfingContext *bullish_engulfing();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBB_upContext : public ExprContext {
  public:
    IBB_upContext(ExprContext *ctx);

    Bb_upperContext *bb_upper();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBullishContext : public ExprContext {
  public:
    IBullishContext(ExprContext *ctx);

    BullishContext *bullish();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IRSISlopeContext : public ExprContext {
  public:
    IRSISlopeContext(ExprContext *ctx);

    Rsi_slopeContext *rsi_slope();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IAvgLowContext : public ExprContext {
  public:
    IAvgLowContext(ExprContext *ctx);

    Avg_lowContext *avg_low();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IUpperShadowPContext : public ExprContext {
  public:
    IUpperShadowPContext(ExprContext *ctx);

    Upper_shadowPContext *upper_shadowP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxChangeContext : public ExprContext {
  public:
    IMaxChangeContext(ExprContext *ctx);

    Max_changeContext *max_change();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  AddSubContext : public ExprContext {
  public:
    AddSubContext(ExprContext *ctx);

    std::vector<ExprContext *> expr();
    ExprContext* expr(size_t i);

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBearish_engulfingContext : public ExprContext {
  public:
    IBearish_engulfingContext(ExprContext *ctx);

    Bearish_engulfingContext *bearish_engulfing();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IChangePContext : public ExprContext {
  public:
    IChangePContext(ExprContext *ctx);

    ChangePContext *changeP();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMinOpenContext : public ExprContext {
  public:
    IMinOpenContext(ExprContext *ctx);

    Min_openContext *min_open();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IBearish_hammerContext : public ExprContext {
  public:
    IBearish_hammerContext(ExprContext *ctx);

    Bearish_hammerContext *bearish_hammer();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IAvgOpenContext : public ExprContext {
  public:
    IAvgOpenContext(ExprContext *ctx);

    Avg_openContext *avg_open();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxRSIContext : public ExprContext {
  public:
    IMaxRSIContext(ExprContext *ctx);

    Max_rsiContext *max_rsi();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMACD_valueContext : public ExprContext {
  public:
    IMACD_valueContext(ExprContext *ctx);

    Macd_valueContext *macd_value();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMACD_slopeContext : public ExprContext {
  public:
    IMACD_slopeContext(ExprContext *ctx);

    Macd_slopeContext *macd_slope();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  PositiveContext : public ExprContext {
  public:
    PositiveContext(ExprContext *ctx);

    ExprContext *expr();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IDojiContext : public ExprContext {
  public:
    IDojiContext(ExprContext *ctx);

    DojiContext *doji();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IMaxLowContext : public ExprContext {
  public:
    IMaxLowContext(ExprContext *ctx);

    Max_lowContext *max_low();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  class  IUpperShadowContext : public ExprContext {
  public:
    IUpperShadowContext(ExprContext *ctx);

    Upper_shadowContext *upper_shadow();

    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
  };

  ExprContext* expr();
  ExprContext* expr(int precedence);
  class  HourContext : public antlr4::ParserRuleContext {
  public:
    HourContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  HourContext* hour();

  class  MinuteContext : public antlr4::ParserRuleContext {
  public:
    MinuteContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  MinuteContext* minute();

  class  OpenContext : public antlr4::ParserRuleContext {
  public:
    OpenContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  OpenContext* open();

  class  HighContext : public antlr4::ParserRuleContext {
  public:
    HighContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  HighContext* high();

  class  LowContext : public antlr4::ParserRuleContext {
  public:
    LowContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  LowContext* low();

  class  CloseContext : public antlr4::ParserRuleContext {
  public:
    CloseContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  CloseContext* close();

  class  VolumeContext : public antlr4::ParserRuleContext {
  public:
    VolumeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  VolumeContext* volume();

  class  ChangeContext : public antlr4::ParserRuleContext {
  public:
    ChangeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  ChangeContext* change();

  class  ChangePContext : public antlr4::ParserRuleContext {
  public:
    ChangePContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  ChangePContext* changeP();

  class  AmplContext : public antlr4::ParserRuleContext {
  public:
    AmplContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  AmplContext* ampl();

  class  AmplPContext : public antlr4::ParserRuleContext {
  public:
    AmplPContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  AmplPContext* amplP();

  class  Upper_shadowContext : public antlr4::ParserRuleContext {
  public:
    Upper_shadowContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Upper_shadowContext* upper_shadow();

  class  Upper_shadowPContext : public antlr4::ParserRuleContext {
  public:
    Upper_shadowPContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Upper_shadowPContext* upper_shadowP();

  class  Lower_shadowContext : public antlr4::ParserRuleContext {
  public:
    Lower_shadowContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Lower_shadowContext* lower_shadow();

  class  Lower_shadowPContext : public antlr4::ParserRuleContext {
  public:
    Lower_shadowPContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Lower_shadowPContext* lower_shadowP();

  class  RsiContext : public antlr4::ParserRuleContext {
  public:
    RsiContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  RsiContext* rsi();

  class  Rsi_slopeContext : public antlr4::ParserRuleContext {
  public:
    Rsi_slopeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Rsi_slopeContext* rsi_slope();

  class  MaContext : public antlr4::ParserRuleContext {
  public:
    MaContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  MaContext* ma();

  class  EmaContext : public antlr4::ParserRuleContext {
  public:
    EmaContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  EmaContext* ema();

  class  Macd_valueContext : public antlr4::ParserRuleContext {
  public:
    Macd_valueContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Macd_valueContext* macd_value();

  class  Macd_signalContext : public antlr4::ParserRuleContext {
  public:
    Macd_signalContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Macd_signalContext* macd_signal();

  class  Macd_histogramContext : public antlr4::ParserRuleContext {
  public:
    Macd_histogramContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Macd_histogramContext* macd_histogram();

  class  Bb_upperContext : public antlr4::ParserRuleContext {
  public:
    Bb_upperContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);
    NumberContext *number();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Bb_upperContext* bb_upper();

  class  Bb_middleContext : public antlr4::ParserRuleContext {
  public:
    Bb_middleContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);
    NumberContext *number();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Bb_middleContext* bb_middle();

  class  Bb_lowerContext : public antlr4::ParserRuleContext {
  public:
    Bb_lowerContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);
    NumberContext *number();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Bb_lowerContext* bb_lower();

  class  Macd_n_dinhContext : public antlr4::ParserRuleContext {
  public:
    Macd_n_dinhContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);
    std::vector<NumberContext *> number();
    NumberContext* number(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Macd_n_dinhContext* macd_n_dinh();

  class  Macd_slopeContext : public antlr4::ParserRuleContext {
  public:
    Macd_slopeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Macd_slopeContext* macd_slope();

  class  Bullish_engulfingContext : public antlr4::ParserRuleContext {
  public:
    Bullish_engulfingContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Bullish_engulfingContext* bullish_engulfing();

  class  Bearish_engulfingContext : public antlr4::ParserRuleContext {
  public:
    Bearish_engulfingContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Bearish_engulfingContext* bearish_engulfing();

  class  Bullish_hammerContext : public antlr4::ParserRuleContext {
  public:
    Bullish_hammerContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Bullish_hammerContext* bullish_hammer();

  class  Bearish_hammerContext : public antlr4::ParserRuleContext {
  public:
    Bearish_hammerContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Bearish_hammerContext* bearish_hammer();

  class  BullishContext : public antlr4::ParserRuleContext {
  public:
    BullishContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  BullishContext* bullish();

  class  BearishContext : public antlr4::ParserRuleContext {
  public:
    BearishContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  BearishContext* bearish();

  class  MarsiContext : public antlr4::ParserRuleContext {
  public:
    MarsiContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  MarsiContext* marsi();

  class  DojiContext : public antlr4::ParserRuleContext {
  public:
    DojiContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  DojiContext* doji();

  class  Avg_openContext : public antlr4::ParserRuleContext {
  public:
    Avg_openContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Avg_openContext* avg_open();

  class  Avg_highContext : public antlr4::ParserRuleContext {
  public:
    Avg_highContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Avg_highContext* avg_high();

  class  Avg_lowContext : public antlr4::ParserRuleContext {
  public:
    Avg_lowContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Avg_lowContext* avg_low();

  class  Avg_closeContext : public antlr4::ParserRuleContext {
  public:
    Avg_closeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Avg_closeContext* avg_close();

  class  Avg_amplContext : public antlr4::ParserRuleContext {
  public:
    Avg_amplContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Avg_amplContext* avg_ampl();

  class  Avg_amplPContext : public antlr4::ParserRuleContext {
  public:
    Avg_amplPContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Avg_amplPContext* avg_amplP();

  class  Max_openContext : public antlr4::ParserRuleContext {
  public:
    Max_openContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_openContext* max_open();

  class  Max_highContext : public antlr4::ParserRuleContext {
  public:
    Max_highContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_highContext* max_high();

  class  Max_lowContext : public antlr4::ParserRuleContext {
  public:
    Max_lowContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_lowContext* max_low();

  class  Max_closeContext : public antlr4::ParserRuleContext {
  public:
    Max_closeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_closeContext* max_close();

  class  Min_openContext : public antlr4::ParserRuleContext {
  public:
    Min_openContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_openContext* min_open();

  class  Min_highContext : public antlr4::ParserRuleContext {
  public:
    Min_highContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_highContext* min_high();

  class  Min_lowContext : public antlr4::ParserRuleContext {
  public:
    Min_lowContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_lowContext* min_low();

  class  Min_closeContext : public antlr4::ParserRuleContext {
  public:
    Min_closeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_closeContext* min_close();

  class  Min_rsiContext : public antlr4::ParserRuleContext {
  public:
    Min_rsiContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_rsiContext* min_rsi();

  class  Max_rsiContext : public antlr4::ParserRuleContext {
  public:
    Max_rsiContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_rsiContext* max_rsi();

  class  Min_changeContext : public antlr4::ParserRuleContext {
  public:
    Min_changeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_changeContext* min_change();

  class  Max_changeContext : public antlr4::ParserRuleContext {
  public:
    Max_changeContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_changeContext* max_change();

  class  Min_changePContext : public antlr4::ParserRuleContext {
  public:
    Min_changePContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_changePContext* min_changeP();

  class  Max_changePContext : public antlr4::ParserRuleContext {
  public:
    Max_changePContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_changePContext* max_changeP();

  class  Min_amplContext : public antlr4::ParserRuleContext {
  public:
    Min_amplContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_amplContext* min_ampl();

  class  Max_amplContext : public antlr4::ParserRuleContext {
  public:
    Max_amplContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_amplContext* max_ampl();

  class  Min_amplPContext : public antlr4::ParserRuleContext {
  public:
    Min_amplPContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Min_amplPContext* min_amplP();

  class  Max_amplPContext : public antlr4::ParserRuleContext {
  public:
    Max_amplPContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    std::vector<antlr4::tree::TerminalNode *> INT();
    antlr4::tree::TerminalNode* INT(size_t i);


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  Max_amplPContext* max_amplP();

  class  ComparisonOpContext : public antlr4::ParserRuleContext {
  public:
    ComparisonOpContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  ComparisonOpContext* comparisonOp();

  class  NumberContext : public antlr4::ParserRuleContext {
  public:
    NumberContext(antlr4::ParserRuleContext *parent, size_t invokingState);
    virtual size_t getRuleIndex() const override;
    antlr4::tree::TerminalNode *INT();
    antlr4::tree::TerminalNode *FLOAT();


    virtual std::any accept(antlr4::tree::ParseTreeVisitor *visitor) override;
   
  };

  NumberContext* number();


  bool sempred(antlr4::RuleContext *_localctx, size_t ruleIndex, size_t predicateIndex) override;

  bool exprSempred(ExprContext *_localctx, size_t predicateIndex);

  // By default the static state used to implement the parser is lazily initialized during the first
  // call to the constructor. You can call this function if you wish to initialize the static state
  // ahead of time.
  static void initialize();

private:
};

