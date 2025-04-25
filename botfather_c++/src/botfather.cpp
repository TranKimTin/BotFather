#include "commonType.h"
#include <tbb/task_group.h>
#include <chrono>
#include <thread>
#include "Expr.h"

#include "ta_libc.h"

using namespace std;

tbb::task_group task;

int runApp()
{
    cout << "hello\n";
     TA_RetCode retCode;

    // // Khởi tạo TA-Lib
    retCode = TA_Initialize();
    if (retCode != TA_SUCCESS) {
        std::cerr << "Lỗi khởi tạo TA-Lib" << std::endl;
        return 1;
    }

    // Dữ liệu đầu vào
    double closePrice[5] = { 81.59, 81.06, 82.87, 83.00, 83.61 };
    int    startIdx = 0;
    int    endIdx = 4;
    int    outBeg, outNb;
    double out[5];

    // Gọi hàm tính trung bình động đơn giản (SMA)
    retCode = TA_SMA(startIdx, endIdx, closePrice, 3, &outBeg, &outNb, out);

    if (retCode == TA_SUCCESS) {
        std::cout << "SMA output:\n";
        for (int i = 0; i < outNb; ++i) {
            std::cout << out[i] << std::endl;
        }
    } else {
        std::cerr << "Lỗi khi tính SMA" << std::endl;
    }

    // Giải phóng
    TA_Shutdown();
    return 0;
}