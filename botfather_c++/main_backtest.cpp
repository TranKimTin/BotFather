#include "common_type.h"
#include "util.h"
#include "mysql_connector.h"
#include "telegram.h"
#include "order_monitor.h"
#include <csignal>
#include <execinfo.h> // backtrace
#include <unistd.h>   // write
#include <cstdlib>    // abort, exit
#include <tbb/task_group.h>
#include "timer.h"
#include "thread_pool.h"
#include "vector_pool.h"
#include "worker_backtest.h"

using namespace std;
tbb::task_group task;

extern thread_local VectorDoublePool vectorDoublePool;
extern thread_local SparseTablePool sparseTablePool;
const int MAX_TIMEFRAME = 12;
thread_local RateDataV rates[MAX_TIMEFRAME];
string currentTF = "1m";
boost::unordered_flat_map<long long, ExchangeInfo> exchangeInfo;
thread_local WorkerBacktest workerBacktest;

void init()
{
    auto logger = spdlog::stdout_color_mt("console");
    spdlog::set_default_logger(logger);

    spdlog::set_pattern("[%Y-%m-%d %H:%M:%S.%e] [%t] [%^%l%$] %v");
    spdlog::set_level(spdlog::level::debug);
    spdlog::flush_on(spdlog::level::err);
    spdlog::flush_every(chrono::seconds(3));

    MySQLConnector::getInstance().initializePool(2);

    srand(time(NULL));
}

void destroy()
{
    spdlog::shutdown();
}

static void backtest(const RateDataV &rateData, const string &timeframe, const shared_ptr<Bot> &bot)
{
    for (int i = rateData.startTime.size() - 1; i >= 0; i--)
    {
        // LOGI("{} {}", toTimeString(rateData.startTime[i]), timeframe);
    }
}

static void onCloseCandle1m(Rate &rate, const string &symbol, const shared_ptr<Bot> &bot)
{
    for (int i = 0; i < bot->timeframes.size(); i++)
    {
        string &timeframe = bot->timeframes[i];
        long long rateStartTime = getStartTime(timeframe, rate.startTime);
        RateDataV &rateData = rates[i];

        if (rateData.open.empty())
        {
            rateData.open.push_back(rate.open);
            rateData.high.push_back(rate.high);
            rateData.low.push_back(rate.low);
            rateData.close.push_back(rate.close);
            rateData.volume.push_back(rate.volume);
            rateData.startTime.push_back(rateStartTime);
            continue;
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
            LOGE("merge error");
        }
    }
}

int main()
{
    init();

    exchangeInfo = getBinanceFutureInfo();
    exchangeInfo.max_load_factor(0.5);
    Timer *t = new Timer("backtest time");

    string botName = "bot_tin_11";
    BacktestTime from = BacktestTime(2025, 01);
    BacktestTime to = BacktestTime(2025, 11);

    string sql = "SELECT id,botName,userID,timeframes,symbolList,route,idTelegram,apiKey,secretKey,iv,enableRealOrder,maxOpenOrderPerSymbolBot,maxOpenOrderAllSymbolBot,maxOpenOrderPerSymbolAccount,maxOpenOrderAllSymbolAccount FROM Bot WHERE botName = ?";
    vector<any> args = {botName};
    auto &db = MySQLConnector::getInstance();
    vector<map<string, any>> res = db.executeQuery(sql, args);
    if (res.size() != 1)
    {
        LOGE("Can't not find bot {}", botName);
        return 0;
    }
    shared_ptr<Bot> bot = initBot(res[0], false);
    vector<shared_ptr<Bot>> botList = {bot};

    bot->symbolList = {{"binance_future", "BTCUSDT", "binance_future:BTCUSDT"}};
    bot->timeframes = {"15m"};

    for (Symbol &s : bot->symbolList)
    {
        string symbol = s.symbol;
        task.run([=]()
                 {
                    for(int i = 0; i < bot->timeframes.size(); i++) {
                        rates[i].clear();
                    }

                     for (BacktestTime t = from; t <= to; t++)
                     {
                        string filePath = (exeDir() / ".." / ".." / "data" / StringFormat("{}-1m-{}.bin", symbol, t.toString())).lexically_normal().c_str();
                        ifstream file(filePath, std::ios::binary | std::ios::ate);
                        if (!file) {
                            LOGE("Cant not open file {}", filePath);
                            return;
                        }
                        size_t size = file.tellg();
                        file.seekg(0);

                        if (size % sizeof(Rate) != 0) {
                            LOGE("File size not aligned with Rate {}", filePath);
                            return;
                        }

                        vector<Rate> data(size / sizeof(Rate));
                        file.read(reinterpret_cast<char*>(data.data()), size);
                        for(Rate &rate : data) {
                            onCloseCandle1m(rate, symbol, bot);
                        }
                        for(int i = 0; i < bot->timeframes.size(); i++) {
                            rates[i].reverse();
                        }
                        for(int i = 0; i < bot->timeframes.size(); i++) {
                            backtest(rates[i], symbol, bot);
                        }
                     } });
    }

    task.wait();
    delete t;
    destroy();
    return 0;
}