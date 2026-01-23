#include "common_type.h"
#include "util.h"
#include "mysql_connector.h"
#include <tbb/task_group.h>
#include "timer.h"
#include "worker_backtest.h"

#undef LOGI
#define LOGI(mess, ...) spdlog::info(mess, ##__VA_ARGS__)

using namespace std;
tbb::task_group task;

thread_local RateDataV rateData;
thread_local WorkerBacktest workerBacktest;
thread_local vector<bool> orderClosed;
thread_local priority_queue<BacktestOrder> pendingBuy;
thread_local priority_queue<BacktestOrder> pendingSell;
thread_local priority_queue<BacktestOrder> pendingTPBuy;
thread_local priority_queue<BacktestOrder> pendingSLBuy;
thread_local priority_queue<BacktestOrder> pendingTPSell;
thread_local priority_queue<BacktestOrder> pendingSLSell;
thread_local int maxID;
thread_local boost::unordered_flat_map<long long, RateDataV> gData;
thread_local shared_ptr<boost::unordered_flat_map<long long, shared_ptr<Bot>>> bots;
thread_local boost::unordered_flat_map<long long, WorkerBacktest> workers;

string currentTF = "1m";
boost::unordered_flat_map<long long, ExchangeInfo> exchangeInfo;
atomic<int> cnt{0};
int totalSymbol;
const int blockMonth = 6;

void init()
{
    auto logger = spdlog::stdout_color_mt("console");
    spdlog::set_default_logger(logger);

    spdlog::set_pattern("%v");
    spdlog::set_level(spdlog::level::debug);
    spdlog::flush_on(spdlog::level::err);
    spdlog::flush_every(chrono::seconds(1));

    MySQLConnector::getInstance().initializePool(1);

    srand(time(NULL));
}

void destroy()
{
    spdlog::shutdown();
}

static void handleRemainOrder(Rate rate)
{
    if (rate.close == -1)
        return;
    vector<BacktestOrder> result;
    while (!pendingBuy.empty())
    {
        BacktestOrder order = pendingBuy.top();
        pendingBuy.pop();
        order.profit = 0.0;

        if (order.expiredTime != 0 && order.expiredTime <= rate.startTime)
        {
            order.status = ORDER_STATUS::CANCELED;
            result.push_back(order);
            continue;
        }

        result.push_back(order);
    }
    while (!pendingSell.empty())
    {
        BacktestOrder order = pendingSell.top();
        pendingSell.pop();

        order.profit = 0.0;
        if (order.expiredTime != 0 && order.expiredTime <= rate.startTime)
        {
            order.status = ORDER_STATUS::CANCELED;
            result.push_back(order);
            continue;
        }

        result.push_back(order);
    }

    while (!pendingTPBuy.empty())
    {
        BacktestOrder order = pendingTPBuy.top();
        pendingTPBuy.pop();
        if (orderClosed[order.id])
        {
            continue;
        }

        orderClosed[order.id] = true;
        order.profit = (rate.close - order.entry) * order.volume;
        result.push_back(order);
    }
    while (!pendingSLBuy.empty())
    {
        BacktestOrder order = pendingSLBuy.top();
        pendingSLBuy.pop();
        if (orderClosed[order.id])
        {
            continue;
        }

        orderClosed[order.id] = true;
        order.profit = (rate.close - order.entry) * order.volume;
        result.push_back(order);
    }
    while (!pendingTPSell.empty())
    {
        BacktestOrder order = pendingTPSell.top();
        pendingTPSell.pop();
        if (orderClosed[order.id])
        {
            continue;
        }
        orderClosed[order.id] = true;
        order.profit = (order.entry - rate.close) * order.volume;
        result.push_back(order);
    }
    while (!pendingSLSell.empty())
    {
        BacktestOrder order = pendingSLSell.top();
        pendingSLSell.pop();
        if (orderClosed[order.id])
        {
            continue;
        }
        orderClosed[order.id] = true;
        order.profit = (order.entry - rate.close) * order.volume;
        result.push_back(order);
    }
    for (BacktestOrder &order : result)
    {
        LOGI("NewOrder_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}",
             rateData.symbol, order.orderType, order.entry, order.volume, order.tp, order.sl, order.createdTime, order.expiredTime, order.matchTime, order.profit, order.status);
    }
}

static void handleOrder(double price, long long startTime, vector<BacktestOrder> &result)
{
    while (!pendingBuy.empty() && pendingBuy.top().entry >= price)
    {
        BacktestOrder order = pendingBuy.top();
        pendingBuy.pop();

        if (order.expiredTime != 0 && order.expiredTime <= startTime)
        {
            order.status = ORDER_STATUS::CANCELED;
            order.profit = 0.0;
            result.push_back(order);
            continue;
        }

        order.status = ORDER_STATUS::MATCH_ENTRY;

        order.priority = -order.tp;
        pendingTPBuy.push(order);

        order.priority = order.sl;
        pendingSLBuy.push(order);
    }
    while (!pendingSell.empty() && pendingSell.top().entry <= price)
    {
        BacktestOrder order = pendingSell.top();
        pendingSell.pop();

        if (order.expiredTime != 0 && order.expiredTime <= startTime)
        {
            order.status = ORDER_STATUS::CANCELED;
            order.profit = 0.0;
            result.push_back(order);
            continue;
        }

        order.status = ORDER_STATUS::MATCH_ENTRY;

        order.priority = order.tp;
        pendingTPSell.push(order);

        order.priority = -order.sl;
        pendingSLSell.push(order);
    }

    while (!pendingSLBuy.empty() && pendingSLBuy.top().sl >= price)
    {
        BacktestOrder order = pendingSLBuy.top();
        pendingSLBuy.pop();
        if (orderClosed[order.id])
        {
            continue;
        }

        orderClosed[order.id] = true;

        order.status = ORDER_STATUS::MATCH_SL;
        order.matchTime = startTime;
        order.profit = (order.sl - order.entry) * order.volume;

        result.push_back(order);
    }

    while (!pendingTPBuy.empty() && pendingTPBuy.top().tp <= price)
    {
        BacktestOrder order = pendingTPBuy.top();
        pendingTPBuy.pop();
        if (orderClosed[order.id])
        {
            continue;
        }

        orderClosed[order.id] = true;

        order.status = ORDER_STATUS::MATCH_TP;
        order.matchTime = startTime;
        order.profit = (order.tp - order.entry) * order.volume;

        result.push_back(order);
    }

    while (!pendingSLSell.empty() && pendingSLSell.top().sl <= price)
    {
        BacktestOrder order = pendingSLSell.top();
        pendingSLSell.pop();
        if (orderClosed[order.id])
        {
            continue;
        }
        orderClosed[order.id] = true;

        order.status = ORDER_STATUS::MATCH_SL;
        order.matchTime = startTime;
        order.profit = (order.entry - order.sl) * order.volume;

        result.push_back(order);
    }

    while (!pendingTPSell.empty() && pendingTPSell.top().tp >= price)
    {
        BacktestOrder order = pendingTPSell.top();
        pendingTPSell.pop();
        if (orderClosed[order.id])
        {
            continue;
        }
        orderClosed[order.id] = true;

        order.status = ORDER_STATUS::MATCH_TP;
        order.matchTime = startTime;
        order.profit = (order.entry - order.tp) * order.volume;

        result.push_back(order);
    }
}

static void backtest(const shared_ptr<Bot> &bot, long long backTestStartTime, vector<Rate> &data1m)
{
    // data1m is in ascending order
    vector<BacktestOrder> orderList;
    workerBacktest.initData("binance_future", rateData.symbol, rateData.interval, rateData.open, rateData.high, rateData.low, rateData.close, rateData.volume, rateData.startTime, exchangeInfo[hashString(rateData.symbol)], &orderList, maxID);
    workerBacktest.setWorker(&workers);
    workerBacktest.setBots(bots);
    for (int i = rateData.startTime.size() - 30; i >= 0; i--)
    {
        if (rateData.startTime[i] < backTestStartTime)
        {
            continue;
        }
        int shift = i;
        workerBacktest.run(bot, shift);
    }
    workerBacktest.release(rateData);

    maxID += orderList.size();
    if (orderClosed.size() < maxID)
    {
        orderClosed.resize(maxID);
    }

    // orderList is in ascending order

    int j = 0;
    vector<BacktestOrder> result;

    int i = (backTestStartTime <= data1m[0].startTime ? 0 : (backTestStartTime - data1m[0].startTime) / 60000);
    while (i > 0 && data1m[i].startTime > backTestStartTime)
    {
        i--;
    }
    while (i < data1m.size() && data1m[i].startTime < backTestStartTime)
    {
        i++;
    }

    for (; i < data1m.size(); i++)
    {
        Rate &rate = data1m[i];
        while (j < orderList.size() && orderList[j].createdTime <= rate.startTime)
        {
            BacktestOrder &order = orderList[j];

            if (order.orderType == NODE_TYPE::BUY_MARKET)
            {
                order.status = ORDER_STATUS::MATCH_ENTRY;

                order.priority = -order.tp;
                pendingTPBuy.push(order);

                order.priority = order.sl;
                pendingSLBuy.push(order);
            }
            else if (order.orderType == NODE_TYPE::SELL_MARKET)
            {
                order.status = ORDER_STATUS::MATCH_ENTRY;

                order.priority = order.tp;
                pendingTPSell.push(order);

                order.priority = -order.sl;
                pendingSLSell.push(order);
            }
            else if (order.orderType == NODE_TYPE::BUY_LIMIT)
            {
                order.priority = order.entry;
                pendingBuy.push(order);
            }
            else if (order.orderType == NODE_TYPE::SELL_LIMIT)
            {
                order.priority = -order.entry;
                pendingSell.push(order);
            }
            j++;
        }

        double lastClose = (i > 0 ? data1m[i - 1].close : data1m[i].open);
        if (rate.open > rate.close) // nến đỏ
        {
            if (lastClose >= rate.low && lastClose <= rate.high)
            {
                handleOrder(lastClose, rate.startTime, result);
            }
            handleOrder(rate.high, rate.startTime, result);
            handleOrder(rate.low, rate.startTime, result);
            handleOrder(rate.close, rate.startTime, result);
        }
        else // nến xanh
        {
            if (lastClose >= rate.low && lastClose <= rate.high)
            {
                handleOrder(lastClose, rate.startTime, result);
            }
            handleOrder(rate.low, rate.startTime, result);
            handleOrder(rate.high, rate.startTime, result);
            handleOrder(rate.close, rate.startTime, result);
        }
    }

    for (BacktestOrder &order : result)
    {
        LOGI("NewOrder_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}_{}",
             rateData.symbol, order.orderType, order.entry, order.volume, order.tp, order.sl, order.createdTime, order.expiredTime, order.matchTime, order.profit, order.status);
    }
}

static void mergeCandle1m(RateDataV &rateData, Rate &rate, const string &symbol, const string &timeframe)
{
    long long rateStartTime = getStartTime(timeframe, rate.startTime);

    if (rateData.open.empty())
    {
        rateData.open.push_back(rate.open);
        rateData.high.push_back(rate.high);
        rateData.low.push_back(rate.low);
        rateData.close.push_back(rate.close);
        rateData.volume.push_back(rate.volume);
        rateData.startTime.push_back(rateStartTime);
        return;
    }

    if (rateData.startTime.back() == rateStartTime)
    {
        rateData.high.back() = max(rateData.high.back(), rate.high);
        rateData.low.back() = min(rateData.low.back(), rate.low);
        rateData.close.back() = rate.close;
        rateData.volume.back() += rate.volume;
    }
    else if (rateStartTime > rateData.startTime.back())
    {
        rateData.open.push_back(rate.open);
        rateData.high.push_back(rate.high);
        rateData.low.push_back(rate.low);
        rateData.close.push_back(rate.close);
        rateData.volume.push_back(rate.volume);
        rateData.startTime.push_back(rateStartTime);
    }
    else
    {
    }
}

static shared_ptr<Bot> getBotInfo(const string &botName)
{
    long long key = hashString(botName);
    if (bots->find(key) == bots->end())
    {
        string sql = "SELECT id,botName,userID,timeframes,symbolList,route,idTelegram,apiKey,secretKey,iv,enableRealOrder,maxOpenOrderPerSymbolBot,maxOpenOrderAllSymbolBot,maxOpenOrderPerSymbolAccount,maxOpenOrderAllSymbolAccount FROM Bot WHERE botName = ?";
        vector<any> args = {botName};
        auto &db = MySQLConnector::getInstance();
        vector<map<string, any>> res = db.executeQuery(sql, args);
        if (res.size() != 1)
        {
            throw std::runtime_error(StringFormat("Can't not find bot {}.", botName));
        }
        (*bots)[key] = initBot(res[0]);
    }
    return bots->at(key);
}

static vector<Rate> getData1m(const string &symbol, BacktestTime fr, BacktestTime to)
{
    vector<Rate> data;

    for (BacktestTime t = fr - 3; t <= to && t < fr + blockMonth; t++)
    {
        string filePath = (exeDir() / ".." / ".." / "data" / StringFormat("{}-1m-{}.bin", symbol, t.toString())).lexically_normal().c_str();
        ifstream file(filePath, std::ios::binary | std::ios::ate);
        if (!file)
        {
            if (data.empty())
            {
                continue;
            }
            LOGI("File not found {}", filePath);
            break;
        }
        size_t size = file.tellg();
        file.seekg(0);

        if (size % sizeof(Rate) != 0)
        {
            LOGI("File size not aligned with Rate {}", filePath);
            break;
        }

        int appendSize = size / sizeof(Rate);
        data.resize(data.size() + appendSize);

        file.read(reinterpret_cast<char *>(data.data() + data.size() - appendSize), size);
        file.close();
    }
    return move(data);
}

static void initSignalData(const string &s, shared_ptr<Bot> b, BacktestTime fr, BacktestTime to)
{
    gData.clear();
    workers.clear();
    queue<pair<shared_ptr<Bot>, string>> q;
    queue<Route *> qRoute;

    q.push({b, s});
    while (!q.empty())
    {
        auto [bot, symbol] = q.front();
        q.pop();

        qRoute.push(&bot->route);
        while (!qRoute.empty())
        {
            Route *route = qRoute.front();
            qRoute.pop();
            if (route->data.type == NODE_TYPE::GET_SIGNAL)
            {
                string symbolSignal = (route->data.symbol == "Symbol hiện tại" ? symbol : route->data.symbol);
                long long key = hashString(symbolSignal + "_" + route->data.timeframe);
                if (gData.find(key) == gData.end())
                {
                    vector<Rate> data = getData1m(symbolSignal, fr, to);

                    for (Rate &rate : data)
                    {
                        mergeCandle1m(gData[key], rate, symbolSignal, route->data.timeframe);
                    }
                    gData[key].reverse();
                    gData[key].symbol = symbolSignal;
                    gData[key].interval = route->data.timeframe;
                }
                shared_ptr<Bot> botSignal = getBotInfo(route->data.botName);
                q.push({botSignal, symbolSignal});

                RateDataV &wData = gData[key];
                long long workerKey = hashString(route->data.botName + "_" + wData.symbol + "_" + wData.interval);
                if (workers.find(workerKey) == workers.end())
                {
                    workers[workerKey].initData("binance_future", wData.symbol, wData.interval, wData.open, wData.high, wData.low, wData.close, wData.volume, wData.startTime, exchangeInfo[hashString(wData.symbol)], NULL, 0);
                    workers[workerKey].setWorker(&workers);
                    workers[workerKey].setBots(bots);
                }
            }
            for (Route &r : route->next)
            {
                qRoute.push(&r);
            }
        }
    }
}

int main(int argc, char *argv[])
{
#ifndef DEBUG_LOG
    if (argc < 7)
    {
        throw std::runtime_error("Invalid arguments.");
        return 0;
    }
    string botName = argv[1];
    string timeframe = argv[2];

    BacktestTime from = BacktestTime(stoi(argv[3]), stoi(argv[4]));
    BacktestTime to = BacktestTime(stoi(argv[5]), stoi(argv[6]));
#else
    string botName = "test1";
    string timeframe = "30m";

    BacktestTime from = BacktestTime(2025, 05);
    BacktestTime to = BacktestTime(2025, 12);
#endif
    init();
    LOGI("Progress_1");

    bots = make_shared<boost::unordered_flat_map<long long, shared_ptr<Bot>>>();
    exchangeInfo = getBinanceFutureInfo();
    exchangeInfo.max_load_factor(0.5);

    Timer *t = new Timer(StringFormat("Backtest {} {} {} {}", botName, timeframe, from.toString(), to.toString()));
    shared_ptr<Bot> bot = getBotInfo(botName);

    // bot->symbolList = {{"binance_future", "CLANKERUSDT", "binance_future:CLANKERUSDT"}};
    vector<string> symbolList;
    for (Symbol &s : bot->symbolList)
    {
        if (s.broker == "binance_future")
        {
            symbolList.push_back(s.symbol);
        }
    }
    totalSymbol = symbolList.size();

    for (string symbol : symbolList)
    {
        task.run([=]()
                 {
            orderClosed.clear();
            pendingBuy = priority_queue<BacktestOrder>();
            pendingSell = priority_queue<BacktestOrder>();
            pendingTPBuy = priority_queue<BacktestOrder>();
            pendingSLBuy = priority_queue<BacktestOrder>();
            pendingTPSell = priority_queue<BacktestOrder>();
            pendingSLSell = priority_queue<BacktestOrder>();
            maxID = 1;
            BacktestTime fr = from;
            Rate lastRate;
            lastRate.close = -1;
            rateData.symbol = symbol;
            rateData.interval = timeframe;
            for(; fr <= to; fr = fr + blockMonth) {
                rateData.clear();
                vector<Rate> data = getData1m(symbol, fr, to);
                if (data.empty())
                {
                    continue;
                }

                for (Rate &rate : data)
                {
                    mergeCandle1m(rateData, rate, symbol, timeframe);
                }
                rateData.reverse();

                initSignalData(symbol, bot, fr, to);
                backtest(bot, fr.toMillisecondsUTC(), data);
                lastRate = data.back();
            }
            handleRemainOrder(lastRate);

            int oldProgress = (cnt.load() * 100) / totalSymbol;
            cnt++;
            int progress = (cnt.load() * 100) / totalSymbol;
            if (progress > oldProgress)
            {
                LOGI("Progress_{}", progress);
            } });
    }

    task.wait();
    delete t;
    destroy();
    return 0;
}