#include "botfather.h"
#include "common_type.h"
#include "util.h"
#include "mysql_connector.h"
#include "telegram.h"
#include <csignal>
#include <execinfo.h> // backtrace
#include <unistd.h>   // write
#include <cstdlib>    // abort, exit

using namespace std;

void signal_handler(int signum)
{
    const int max_frames = 50;
    void *array[max_frames];
    int size = backtrace(array, max_frames);
    char **messages = backtrace_symbols(array, size);

    LOGE("==== Fatal caught signal {} ====", signum);

    for (int i = 0; i < size; ++i)
    {
        LOGE("  [{}] {}", i, messages[i]);
    }

    LOGE("===================================");

    free(messages);

    spdlog::shutdown();

    exit(EXIT_FAILURE);
}

void init()
{
#ifdef LOG_FILE
    printf("Write log to file\n");
    filesystem::path logDir = (exeDir() / ".." / "logs").lexically_normal();
    filesystem::create_directories(logDir);

    string logFilePath = (logDir / "botfather.log").string();

    spdlog::init_thread_pool(65536, 1);
    auto logger = spdlog::daily_logger_mt<spdlog::async_factory>(
        "botfather_daily_logger", // tên logger
        logFilePath,              // file log
        0, 0,                     // 00:00 mỗi ngày
        false,                    // không ghi đè
        7                         // giữ 7 file
    );
    spdlog::set_default_logger(logger);
#else
    printf("Write log to console\n");
    auto logger = spdlog::stdout_color_mt("console");
    spdlog::set_default_logger(logger);
#endif

    spdlog::set_pattern("[%Y-%m-%d %H:%M:%S.%e] [%t] [%^%l%$] %v");
    spdlog::set_level(spdlog::level::debug);
    spdlog::flush_on(spdlog::level::err);
    spdlog::flush_every(chrono::seconds(3));

    LOGI("Hello BotFather!");

    MySQLConnector::getInstance().initializePool(30);
    Telegram::getInstance();

    signal(SIGSEGV, signal_handler);
    signal(SIGABRT, signal_handler);
    signal(SIGILL, signal_handler);
    signal(SIGTERM, signal_handler);

    srand(time(NULL));
}

void destroy()
{
    spdlog::shutdown();
    LOGI("Goodbye BotFather!");
}

int main()
{
    // ios::sync_with_stdio(false);
    // cin.tie(0);
    init();
    runApp();
    destroy();
    return 0;
}