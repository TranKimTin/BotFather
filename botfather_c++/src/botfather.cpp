#include "commonType.h"
#include <tbb/task_group.h>
#include <chrono>
#include <thread>
#include "Expr.h"

tbb::task_group task;

void runApp()
{
    Expr e;
    cout << "Hellooooo";
}