#include "Worker.h"
#include "CustomIndicator.h"
#include "util.h"

Worker::Worker(string broker, string symbol, string timeframe, vector<double> &open, vector<double> &high, vector<double> &low, vector<double> &close, vector<double> &volume, vector<long long> &startTime)
    : broker(move(broker)), symbol(move(symbol)), timeframe(move(timeframe)), open(move(open)), high(move(high)), low(move(low)), close(move(close)), volume(move(volume)), startTime(move(startTime)) {};

void Worker::run()
{
    RSI rsi(14);
    LOGI("length %s %s %s: %d", broker.c_str(), symbol.c_str(), timeframe.c_str(), (int)close.size());
    for (int i = close.size() - 1; i >= 0; i--)
    {
        double rsiValue = rsi.nextValue(close[i]);
        LOGI("RSI %s %s %s: %.2f", broker.c_str(), symbol.c_str(), toTimeString(startTime[i]).c_str(), rsiValue);
    }
}