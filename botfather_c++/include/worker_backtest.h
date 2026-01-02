#pragma one
#include "worker.h"
class WorkerBacktest : public Worker
{
private:
    bool getSignal(const string& botName, const string& symbol, const string& timeframe) override;
    bool isPostedSignal(shared_ptr<Bot> bot) override;

public:
    WorkerBacktest() : Worker()
    {
    }

    void initData(string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime, ExchangeInfo exchangeInfor);
    void release(RateDataV &rateData);

    bool handlerNewOrder(NodeData &node, const shared_ptr<Bot> &bot) override;
    bool sendTelegram(NodeData &node, const shared_ptr<Bot> &bot) override;
};