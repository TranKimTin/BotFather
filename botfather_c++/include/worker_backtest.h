#pragma one
#include "worker.h"
class WorkerBacktest : public Worker
{
private:
    vector<BacktestOrder> *orderList;
    int startID;
    boost::unordered_flat_map<long long, WorkerBacktest> *workers;
    long long backtestTime;

    bool getSignal(const string &botName, const string &symbol, const string &timeframe) override;

public:
    WorkerBacktest() : Worker()
    {
    }

    void initData(string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime, ExchangeInfo exchangeInfor, vector<BacktestOrder> *orderList, int startID);
    void release(RateDataV &rateData);

    bool handlerNewOrder(NodeData &node, const shared_ptr<Bot> &bot) override;
    bool sendTelegram(NodeData &node, const shared_ptr<Bot> &bot) override;
    void setBots(shared_ptr<boost::unordered_flat_map<long long, shared_ptr<Bot>>> b);
    void setWorker(boost::unordered_flat_map<long long, WorkerBacktest> *w);
    void setShift(int s);
    int getShift();
    void setBacktestTime(long long t);
};