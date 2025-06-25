#include "common_type.h"
#include <tbb/task_group.h>
#include <chrono>
#include <thread>
#include "expr.h"
#include "socket_binance.h"
#include "Redis.h"
#include "util.h"

using namespace std;

void test()
{
    vector<double> open = {1.0, 2.0, 3.0, 4.0, 5.0};
    vector<double> high = {1.1, 2.1, 3.1, 4.1, 5.1};
    vector<double> low = {0.9, 1.9, 2.9, 3.9, 4.9};
    vector<double> close = {1.05, 2.05, 3.05, 4.05, 5.05};
    vector<double> volume = {100, 200, 300, 400, 500};
    vector<long long> startTime = {1622505600000, 1622509200000, 1622512800000, 1622516400000, 1622520000000};
    string broker = "binance";
    string symbol = "BTCUSDT";
    string timeframe = "1h";

    string exprText = "change%(0)";

    any result = calculateExpr(broker, symbol, timeframe, open.size(),
                               open.data(), high.data(), low.data(), close.data(), volume.data(),
                               startTime.data(), exprText);

    if (result.has_value())
    {
        cout << "Result: " << any_cast<double>(result) << endl;
    }
    else
    {
        cout << "No result" << endl;
    }
}

void runApp()
{
    // map<string, string> env = readEnvFile();

    // Redis::getInstance().connect(env["REDIS_SERVER"], stoi(env["REDIS_PORT"]), env["REDIS_PASSWORD"]);

    // SocketBinance binance(10);

    test();
}