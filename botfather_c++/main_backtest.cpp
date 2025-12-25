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

int main()
{
    init();

    string botName = "bot_tin_11";
    long long startTime = 1756684800000;
    long long endTime = getCurrentTime();

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

    for (Symbol &symbol : bot->symbolList)
    {
        task.run([=]()
                 {
        for (string &timeframe : bot->timeframes)
        {
            LOGI("backtest {} {}", symbol.symbol, timeframe);
        } });
    }
    
    task.wait();

    destroy();
    return 0;
}