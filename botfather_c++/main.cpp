#include "botfather.h"
#include "common_type.h"
#include "util.h"
#include "mysql_connector.h"
#include "telegram.h"
#include "order_monitor.h"

using namespace std;

void init()
{
#ifdef LOG_FILE
    printf("Write log to file\n");
    char exePath[PATH_MAX];
    ssize_t len = readlink("/proc/self/exe", exePath, sizeof(exePath) - 1);
    if (len == -1)
    {
        std::cerr << "readlink failed\n";
        throw "readlink failed";
    }
    exePath[len] = '\0';
    std::filesystem::path exeDir = std::filesystem::path(exePath).parent_path();
    std::filesystem::path logDir = (exeDir / ".." / "logs").lexically_normal();
    std::filesystem::create_directories(logDir);

    std::string logFilePath = (logDir / "botfather.log").string();
    auto logger = spdlog::daily_logger_mt(
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
    spdlog::flush_on(spdlog::level::info);

    MySQLConnector::getInstance();
    Telegram::getInstance();
    startOrderMonitor();
}

void destroy()
{
}

int main()
{
    // std::ios::sync_with_stdio(false);
    // std::cin.tie(0);

    auto now = std::chrono::system_clock::now();
    auto duration = now.time_since_epoch();
    long long milliseconds = std::chrono::duration_cast<std::chrono::milliseconds>(duration).count();
    LOGI("Hello BotFather! {}", toTimeString(milliseconds));

    init();
    runApp();
    destroy();
    return 0;
}