#include "worker_backtest.h"
#include "vector_pool.h"
#include "util.h"

extern thread_local VectorDoublePool vectorDoublePool;
extern thread_local SparseTablePool sparseTablePool;

void WorkerBacktest::initData(string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime, ExchangeInfo exchangeInfo, vector<BacktestOrder> *orderList)
{
    this->broker = broker;
    this->symbol = symbol;
    this->timeframe = timeframe;
    this->open = move(open);
    this->high = move(high);
    this->low = move(low);
    this->close = move(close);
    this->volume = move(volume);
    this->startTime = move(startTime);
    this->exchangeInfo = exchangeInfo;
    this->fundingRate = 0.01f;
    this->orderList = orderList;
    this->shift = 0;

    this->visited.clear();
    this->cachedExpr.clear();
    this->cachedIndicator.clear();
    this->cachedMinMax.clear();
    this->cachedSignal.clear();
}

void WorkerBacktest::release(RateDataV &rateData)
{
    startTime.clear();
    open.clear();
    high.clear();
    low.clear();
    close.clear();
    volume.clear();
    
    rateData.startTime = move(startTime);
    rateData.open = move(open);
    rateData.high = move(high);
    rateData.low = move(low);
    rateData.close = move(close);
    rateData.volume = move(volume);
}

bool WorkerBacktest::getSignal(const string &botName, const string &symbol, const string &timeframe)
{
    return true;
}

bool WorkerBacktest::isPostedSignal(shared_ptr<Bot> bot)
{
    return true;
};

bool WorkerBacktest::handlerNewOrder(NodeData &node, const shared_ptr<Bot> &bot)
{
    BacktestOrder order;
    order.status = ORDER_STATUS::OPENED;
    order.id = this->orderList->size();
    order.orderType = node.type;
    order.entry = stod(node.entry);
    order.volume = stod(node.volume);
    order.tp = stod(node.tp);
    order.sl = stod(node.sl);
    order.createdTime = startTime[shift] + timeframeToNumberMiliseconds(timeframe);
    order.expiredTime = (node.expiredTime.empty() ? 0 : stoll(node.expiredTime));

    this->orderList->push_back(order);
    return true;
}

bool WorkerBacktest::sendTelegram(NodeData &node, const shared_ptr<Bot> &bot)
{
    return true;
}