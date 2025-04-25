#include "botfather.h"
#include "common_type.h"
#include "ta_libc.h"

using namespace std;

void init()
{
    cout << "hello\n";
    TA_RetCode retCode;

    // // Khởi tạo TA-Lib
    retCode = TA_Initialize();
    if (retCode != TA_SUCCESS)
    {
        cout << "init TA-Lib fail" << endl;
        throw "init TA - Lib fail";
    }
}

void destroy()
{
    TA_Shutdown();
}

int main()
{
    init();
    runApp();
    destroy();
    return 0;
}