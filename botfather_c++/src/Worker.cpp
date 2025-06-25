#include "Worker.h"
#include "custom_indicator.h"
#include "util.h"

Worker::Worker(string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime)
    : broker(move(broker)), symbol(move(symbol)), timeframe(move(timeframe)), open(move(open)), high(move(high)), low(move(low)), close(move(close)), volume(move(volume)), startTime(move(startTime)) {};

void Worker::run()
{
    
}