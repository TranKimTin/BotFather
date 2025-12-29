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

static void onCloseCandle1m(const string &line, const string &symbol, const shared_ptr<Bot> &bot)
{
    // open_time,open,high,low,close,volume,close_time,quote_volume,count,taker_buy_volume,taker_buy_quote_volume,ignore
    // 1736351700000,95261.80,95291.60,95196.20,95223.10,180.760,1736351759999,17214864.01220,3401,124.045,11813167.63560,0
    vector<string> candle = split(line, ',');
    LOGI("{}",line);
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
                         string zipPath = (exeDir() / ".." / ".." / "data" / StringFormat("{}-1m-{}.zip", symbol, t.toString())).lexically_normal().c_str();
                         unzFile zip = unzOpen(zipPath.c_str());
                         if (!zip) {
                            LOGE("Can not open {}", zipPath);
                            continue;
                        }

                        if (unzGoToFirstFile(zip) != UNZ_OK) {
                            LOGE("{} is empty", zipPath);
                            unzClose(zip);
                            continue;
                        }

                        if (unzOpenCurrentFile(zip) != UNZ_OK) {
                            LOGE("Can not open csv in {}", zipPath);
                            unzClose(zip);
                            continue;
                        }
                        char buffer[8192];
                        int bytes;
                        bool firstLine = true;
                        string leftover;
                        
                        while (int bytes = unzReadCurrentFile(zip, buffer, sizeof(buffer))) {
                            string chunk = leftover + string(buffer, bytes);
                            string line;
                            size_t pos = 0;
                            while (true) {
                                size_t newline = chunk.find('\n', pos);
                                if (newline == std::string::npos)
                                            break;

                                line = chunk.substr(pos, newline - pos);
                                pos = newline + 1;

                                if (!line.empty() && line.back() == '\r') {
                                    line.pop_back();
                                }
                                    
                                if (firstLine) {
                                    firstLine = false;   // skip header
                                    continue;
                                }

                                onCloseCandle1m(line, symbol, bot);
                            }
                            leftover = chunk.substr(pos);
                        }
                        if(!leftover.empty()) {
                            // last line
                            onCloseCandle1m(leftover, symbol, bot);
                        }

                        unzCloseCurrentFile(zip);
                        unzClose(zip);
                     } });
    }

    task.wait();

    destroy();
    return 0;
}