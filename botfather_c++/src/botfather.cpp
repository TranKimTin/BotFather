#include "common/common.h"
#include <tbb/task_group.h>
#include <chrono>
#include <thread>

tbb::task_group task;

void runApp()
{
    for (int i = 0; i < 10; ++i)
    {
        task.run([i]
               {
            this_thread::sleep_for(chrono::milliseconds(100));
            cout << "Task " << i << " running in thread "
                      << std::this_thread::get_id() << " → " << (i * i) << "\n"; });
    }

    task.wait(); // Đợi tất cả task hoàn thàn

    std::cout << "All tasks finished!\n";
     std::cout << "CPU threads available: "
              << std::thread::hardware_concurrency() << "\n";
}