#include "common_type.h"
#include <tbb/task_group.h>
#include <chrono>
#include <thread>
#include "expr.h"
#include "socket_binance.h"
#include "Redis.h"
#include "util.h"

using namespace std;

void runApp()
{
    // SocketBinance binance(50);

    map<string, string> env = readEnvFile();

    Redis::getInstance().connect(env["REDIS_SERVER"], stoi(env["REDIS_PORT"]), env["REDIS_PASSWORD"]);

    vector<string> list = Redis::getInstance().getList("binance_future_BTCUSDT_15m");
    LOGD("list size: %lu", list.size());
    for (int i=0; i<list.size(); i++)
    {
        string item = list[i];
        LOGD("item: %s", item.c_str());
    }
}