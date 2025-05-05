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

    Redis::getInstance().pushBack("key", "value");
    Redis::getInstance().pushBack("key", "value");
    Redis::getInstance().pushBack("key", "value");
    Redis::getInstance().pushBack("key", "value");

    auto list = Redis::getInstance().getList("key");
    for (const auto &item : list)
    {
        LOGD("item: %s", item.c_str());
    }

    Redis::getInstance().clearList("mylist");
}