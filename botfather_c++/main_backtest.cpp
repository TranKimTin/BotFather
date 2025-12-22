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

using namespace std;

void init()
{
    auto logger = spdlog::stdout_color_mt("console");
    spdlog::set_default_logger(logger);

    spdlog::set_pattern("[%Y-%m-%d %H:%M:%S.%e] [%t] [%^%l%$] %v");
    spdlog::set_level(spdlog::level::debug);
    spdlog::flush_on(spdlog::level::err);
    spdlog::flush_every(chrono::seconds(3));

    LOGI("Hello backtest!");

    MySQLConnector::getInstance();

    srand(time(NULL));
}

void destroy()
{
    spdlog::shutdown();
    LOGI("Goodbye backtest!");
}

int main()
{
    init();
    LOGI("Hello world");
    destroy();
    return 0;
}