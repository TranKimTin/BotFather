#pragma one
#include "common_type.h"

class Worker
{
private:
    string broker;
    string symbol;
    string timeframe;
    vector<double> open;
    vector<double> high;
    vector<double> low;
    vector<double> close;
    vector<double> volume;
    vector<long long> startTime;

public:
    Worker(string broker, string symbol, string timeframe, vector<double> &open, vector<double> &high, vector<double> &low, vector<double> &close, vector<double> &volume, vector<long long> &startTime);
    void run();

};