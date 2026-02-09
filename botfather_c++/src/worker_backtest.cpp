#include "worker_backtest.h"
#include "vector_pool.h"
#include "util.h"

extern thread_local VectorDoublePool vectorDoublePool;
extern thread_local SparseTablePool sparseTablePool;

void WorkerBacktest::initData(string broker, string symbol, string timeframe,
                              vector<double> open, vector<double> high, vector<double> low,
                              vector<double> close, vector<double> volume, vector<long long> startTime,
                              ExchangeInfo exchangeInfo, vector<BacktestOrder> *orderList, int startID)
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
    this->startID = startID;

    this->visited.clear();
    this->cachedExpr.clear();
    this->cachedIndicator.clear();
    this->cachedMinMax.clear();
    this->cachedSignal.clear();
}

void WorkerBacktest::setBots(shared_ptr<boost::unordered_flat_map<long long, shared_ptr<Bot>>> b)
{
    this->bots = b;
}

void WorkerBacktest::setWorker(boost::unordered_flat_map<long long, WorkerBacktest> *w)
{
    this->workers = w;
}

void WorkerBacktest::setShift(int s)
{
    this->shift = s;
}

int WorkerBacktest::getShift()
{
    return this->shift;
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
    if (workers == NULL)
        return false;

    long long workerKey = hashString(botName + "_" + symbol + "_" + timeframe);
    if (workers->find(workerKey) == workers->end())
        return false;

    long long botKey = hashString(botName);
    if (bots->find(botKey) == bots->end())
        return false;

    shared_ptr<Bot> bot = bots->at(botKey);
    WorkerBacktest &worker = workers->at(workerKey);
    int oldShift = worker.getShift();

    long long t1 = timeframeToNumberSeconds(this->originalTimeframe);
    long long t2 = timeframeToNumberSeconds(worker.timeframe);
    if (t1 < t2)
    {
        worker.setShift(this->originalShift * t1 / t2 + 1);
    }
    else if (t1 == t2)
    {
        worker.setShift(this->originalShift);
    }
    else
    {
        worker.setShift(((this->originalShift + 1) * t1 / t2) - 1);
    }
    worker.setOriginal(this->originalShift, this->originalTimeframe);
    bool result = worker.isPostedSignal(bot);
    worker.setShift(oldShift);
    return result;
}

bool WorkerBacktest::handlerNewOrder(NodeData &node, const shared_ptr<Bot> &bot)
{
    if (this->orderList == NULL)
        return true;

    BacktestOrder order;
    order.status = ORDER_STATUS::OPENED;
    order.id = startID + this->orderList->size();
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
    LOGD("{} {} {} {}", toTimeString(startTime[shift]), symbol, timeframe, calculateSub(node.value));
    return true;
}