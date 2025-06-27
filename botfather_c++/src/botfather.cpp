#include "common_type.h"
#include <tbb/task_group.h>
#include <chrono>
#include <thread>
#include "expr.h"
#include "socket_binance.h"
#include "Redis.h"
#include "util.h"
#include "axios.h"
#include "Timer.h"

using namespace std;

void test()
{
    string broker = "binance";
    string symbol = "BTCUSDT";
    string timeframe = "1h";

    string url = "https://api.binance.com/api/v3/klines?symbol=" + symbol + "&interval=" + timeframe + "&limit=600";
    string response = Axios::get(url);
    json j = json::parse(response);

    vector<double> open, high, low, close, volume;
    vector<long long> startTime;

    for (const auto &item : j)
    {
        startTime.push_back(item[0].get<long long>());
        open.push_back(stod(item[1].get<string>()));
        high.push_back(stod(item[2].get<string>()));
        low.push_back(stod(item[3].get<string>()));
        close.push_back(stod(item[4].get<string>()));
        volume.push_back(stod(item[5].get<string>()));
    }

    startTime.pop_back();
    open.pop_back();
    high.pop_back();
    low.pop_back();
    close.pop_back();
    volume.pop_back();

    reverse(startTime.begin(), startTime.end());
    reverse(open.begin(), open.end());
    reverse(high.begin(), high.end());
    reverse(low.begin(), low.end());
    reverse(close.begin(), close.end());
    reverse(volume.begin(), volume.end());

    string exprText = "rsi(14,0)";

    Timer timer("botfather runtime");

    for (int i = 0; i < 200000; i++)
    {
        any result = calculateExpr(exprText, broker, symbol, timeframe, open.size(),
                                   open.data(), high.data(), low.data(), close.data(), volume.data(),
                                   startTime.data());
        if (i % 10000 != 0)
            continue;
        if (result.has_value())
        {
            if (result.type() == typeid(int))
            {
                LOGD("Result: %d", any_cast<int>(result));
            }
            else if (result.type() == typeid(double))
            {
                LOGD("Result: %.3f", any_cast<double>(result));
            }
            else if (result.type() == typeid(string))
            {
                LOGD("Result: %s", any_cast<string>(result).c_str());
            }
            else
            {
                LOGE("Unknown result type");
            }
        }
        else
        {
            LOGE("No result");
        }
    }
}

void runApp()
{
    // map<string, string> env = readEnvFile();

    // Redis::getInstance().connect(env["REDIS_SERVER"], stoi(env["REDIS_PORT"]), env["REDIS_PASSWORD"]);

    // SocketBinance binance(10);

    test();
}