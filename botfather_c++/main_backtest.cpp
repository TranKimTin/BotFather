#include "common_type.h"
#include "util.h"
#include "mysql_connector.h"
#include <tbb/task_group.h>
#include "timer.h"
#include "worker_backtest.h"

using namespace std;
tbb::task_group task;

thread_local RateDataV rateData;
thread_local WorkerBacktest workerBacktest;
string currentTF = "1m";
boost::unordered_flat_map<long long, ExchangeInfo> exchangeInfo;

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

static void backtest(const shared_ptr<Bot> &bot, long long backTestStartTime, vector<Rate> &data1m)
{
    // data1m is in ascending order
    LOGD("Backtest {} {} size: {}. from {}", rateData.symbol, rateData.interval, rateData.startTime.size(), toTimeString(backTestStartTime));
    vector<BacktestOrder> orderList;
    workerBacktest.initData("binance_future", rateData.symbol, rateData.interval, rateData.open, rateData.high, rateData.low, rateData.close, rateData.volume, rateData.startTime, exchangeInfo[hashString(rateData.symbol)], &orderList);
    for (int i = rateData.startTime.size() - 30; i >= 0; i--)
    {
        if (rateData.startTime[i] < backTestStartTime)
        {
            continue;
        }
        int shift = i;
        workerBacktest.run(bot, shift);
        // LOGI("{} {}", toTimeString(rateData.startTime[i]), rateData.interval);
    }
    workerBacktest.release(rateData);
    LOGD("Backtest {} {} finished. total orders: {}", rateData.symbol, rateData.interval, orderList.size());
    for (const BacktestOrder &order : orderList)
    {
        LOGD("Order: type {} volume {} entry {} tp {} sl {} createdTime {}", order.type, order.volume, order.entry, order.tp, order.sl, toTimeString(stoll(order.entry)));
    }
}

static void mergeCandle1m(Rate &rate, const string &symbol, const string &timeframe, const shared_ptr<Bot> &bot)
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
        LOGE("merge error");
    }
}

int main()
{
    init();

    exchangeInfo = getBinanceFutureInfo();
    exchangeInfo.max_load_factor(0.5);
    Timer *t = new Timer("backtest time");

    string botName = "bot_tin_01";
    BacktestTime from = BacktestTime(2025, 12);
    BacktestTime to = BacktestTime(2025, 12);

    string sql = "SELECT id,botName,userID,timeframes,symbolList,route,idTelegram,apiKey,secretKey,iv,enableRealOrder,maxOpenOrderPerSymbolBot,maxOpenOrderAllSymbolBot,maxOpenOrderPerSymbolAccount,maxOpenOrderAllSymbolAccount FROM Bot WHERE botName = ?";
    vector<any> args = {botName};
    auto &db = MySQLConnector::getInstance();
    vector<map<string, any>> res = db.executeQuery(sql, args);
    if (res.size() != 1)
    {
        LOGE("Can't not find bot {}", botName);
        return 0;
    }
    shared_ptr<Bot> bot = initBot(res[0]);
    vector<shared_ptr<Bot>> botList = {bot};

    bot->symbolList = {{"binance_future", "BTCUSDT", "binance_future:BTCUSDT"}};
    string timeframe = "4h";

    for (Symbol &s : bot->symbolList)
    {
        string symbol = s.symbol;
        task.run([=]()
                 {
                    rateData.clear();
                    rateData.symbol = symbol;
                    rateData.interval = timeframe;
                    vector<Rate> data;

                    for (BacktestTime t = from - 3; t <= to; t++)
                    {
                        string filePath = (exeDir() / ".." / ".." / "data" / StringFormat("{}-1m-{}.bin", symbol, t.toString())).lexically_normal().c_str();
                        ifstream file(filePath, std::ios::binary | std::ios::ate);
                        if (!file)
                        {
                            if(rateData.startTime.empty()){
                                continue;
                            }
                            break;
                        }
                        size_t size = file.tellg();
                        file.seekg(0);

                        if (size % sizeof(Rate) != 0)
                        {
                            LOGE("File size not aligned with Rate {}", filePath);
                            return;
                        }

                        int appendSize = size / sizeof(Rate);
                        data.resize(data.size() + appendSize);

                        file.read(reinterpret_cast<char *>(data.data() + data.size() - appendSize), size);
                        file.close();
                    }

                    for (Rate &rate : data)
                    {
                        mergeCandle1m(rate, symbol, timeframe, bot);
                    }
                    rateData.reverse();
                    backtest(bot, from.toMillisecondsUTC(), data); });
    }

    task.wait();
    delete t;
    destroy();
    return 0;
}