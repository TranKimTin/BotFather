#pragma one
#include "common_type.h"

struct MACD_Output {
    double macd;
    double signal;
    double histogram;
};

struct BB_Output {
    double lower;
    double middle;
    double upper;
};

double iRSI(int period, const double close[], int n);
double iRSI_slope(int period, const double close[], int n);
double iMA(int period, const double close[], int n);
double iEMA(int period, const double close[], int n);
MACD_Output iMACD(int fastPeriod, int slowPeriod,int signalPeriod, const double close[], int n);
BB_Output iBB(int period, double stdDev, const double close[], int n);
int macd_n_dinh(int fastPeriod, int slowPeriod, int signalPeriod, int redDepth, int depth, int enableDivergence, double diffCandle0, vector<double> &diffPercents, const double close[], const double open[], const double high[], int n);
double macd_slope(int fastPeriod, int slowPeriod,int signalPeriod, const double close[], int n);
double iAvg(int period, const double close[], int n);
double iMin(int period, const double close[], int n);
double iMax(int period, const double close[], int n);
double iAvg(int period, int n, function<double(int)> f);
double iMin(int period, int n, function<double(int)> f);
double iMax(int period, int n, function<double(int)> f);
double iMinRSI(int period, int k, const double close[], int n);
double iMaxRSI(int period, int k, const double close[], int n);
double iAvgRSI(int period, int k, const double close[], int n);