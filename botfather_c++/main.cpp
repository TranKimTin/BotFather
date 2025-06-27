#include "botfather.h"
#include "common_type.h"
#include "ta_libc.h"
#include "util.h"
#include "MySQLConnector.h"

using namespace std;

void init()
{
    TA_RetCode retCode;

    // // Khởi tạo TA-Lib
    retCode = TA_Initialize();
    if (retCode != TA_SUCCESS)
    {
        LOGE("init TA - Lib fail");
        throw "init TA - Lib fail";
    }

    MySQLConnector::getInstance();
}

void destroy()
{
    TA_Shutdown();
}

int main()
{
    // std::ios::sync_with_stdio(false);
    // std::cin.tie(0);

    auto now = std::chrono::system_clock::now();
    auto duration = now.time_since_epoch();
    long long milliseconds = std::chrono::duration_cast<std::chrono::milliseconds>(duration).count();
    LOGI("Hello BotFather! %s", toTimeString(milliseconds).c_str());

    init();
    runApp();
    destroy();
    return 0;
}