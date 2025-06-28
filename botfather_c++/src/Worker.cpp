#include "Worker.h"
#include "custom_indicator.h"
#include "util.h"
#include "Timer.h"
#include "expr.h"

Worker::Worker(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime)
    : botList(botList), broker(move(broker)), symbol(move(symbol)), timeframe(move(timeframe)), open(move(open)), high(move(high)), low(move(low)), close(move(close)), volume(move(volume)), startTime(move(startTime)) {};

void Worker::run()
{
    Timer timer(StringFormat("onCloseCandle %s %s %s", broker.c_str(), symbol.c_str(), timeframe.c_str()));
    for (const shared_ptr<Bot> &bot : *botList)
    {
        
    }
}