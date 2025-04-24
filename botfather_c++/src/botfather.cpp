#include "common/common.h"
#include <tbb/task_group.h>
#include <chrono>
#include <thread>
#include "common/Expr.h"

tbb::task_group task;

void runApp()
{
    Expr e;
    cout << "Hellooooo";
}