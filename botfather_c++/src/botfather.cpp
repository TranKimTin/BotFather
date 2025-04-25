#include "commonType.h"
#include <tbb/task_group.h>
#include <chrono>
#include <thread>
#include "Expr.h"

using namespace std;

tbb::task_group task;

void runApp()
{
    long long s1 = 0, s2 = 0;
    auto t1 = clock();
    {
        deque<int> a;
        for (int j = 0; j < 100000; j++)
        {
            for (int i = 0; i < 600; i++)
            {
                a.push_back(i);
                a.push_front(i);
                s1 += a[i + i];
            }
        }
    }
    auto t2 = clock();

    {
        vector<int> a;
        for (int j = 0; j < 100000; j++)
        {
            for (int i = 0; i < 600; i++)
            {
                a.push_back(i);
                a.push_back(i);
                s2 += a[i + i];
            }
        }
    }
    auto t3 = clock();
    cout << s1 << endl
         << s2 << endl;
    cout << "Time1: " << (t2 - t1) / 1000 << endl;
    cout << "Time2: " << (t3 - t2) / 1000 << endl;
}