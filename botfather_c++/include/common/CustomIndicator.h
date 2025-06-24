#pragma one
#include "common_type.h"

class RSI
{
private:
    int period;
    int count;
    double prevClose;
    vector<double> gains;
    vector<double> losses;
    double avgGain;
    double avgLoss;

public:
    explicit RSI(int period);
    double nextValue(double close);
};