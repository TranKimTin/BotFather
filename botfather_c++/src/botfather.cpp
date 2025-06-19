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
     map<string, string> env = readEnvFile();

    Redis::getInstance().connect(env["REDIS_SERVER"], stoi(env["REDIS_PORT"]), env["REDIS_PASSWORD"]);
    
    SocketBinance binance(10);
}