#include "botfather.h"
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
#include <minizip/unzip.h>
#include "timer.h"

using namespace std;
tbb::task_group task;

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

static void onCloseCandle1m(Rate &rate, const string &symbol, const shared_ptr<Bot> &bot)
{
    // LOGI("{} {} {} {} {} {}", toTimeString(rate.startTime), rate.open, rate.high, rate.low, rate.close, rate.volume);
}

int main()
{
    init();

    string botName = "bot_tin_11";
    BacktestTime startTime = BacktestTime(2025, 01);
    BacktestTime endTime = BacktestTime(2025, 11);

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

    for (Symbol &s : bot->symbolList)
    {
        string symbol = s.symbol;
        task.run([=]()
                 {
                    Timer t("backtest time");

                     for (BacktestTime t = startTime; t <= endTime; t++)
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
                        for(Rate &rate :  data) {
                            onCloseCandle1m(rate, symbol, bot);
                        }
                     } });
    }

    task.wait();

    destroy();
    return 0;
}