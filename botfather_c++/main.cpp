#include "botfather.h"
#include "common_type.h"
#include "ta_libc.h"

using namespace std;

void init()
{
    LOGI("Hello BotFather!");
    TA_RetCode retCode;

    // // Khởi tạo TA-Lib
    retCode = TA_Initialize();
    if (retCode != TA_SUCCESS)
    {
        LOGE("init TA - Lib fail");
        throw "init TA - Lib fail";
    }
}

void destroy()
{
    TA_Shutdown();
}

int main()
{
    // std::ios::sync_with_stdio(false);
    // std::cin.tie(0);

    init();
    runApp();
    destroy();
    return 0;
}