#pragma once

#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <atomic>

using namespace std;

class ThreadPool
{
public:
    static ThreadPool& getInstance();
    
    void enqueue(function<void()> task);

private:
    ThreadPool(size_t numThreads);
    ~ThreadPool();

    vector<thread> workers;
    queue<function<void()>> tasks;

    mutex queueMutex;
    condition_variable condition;
    atomic<bool> stop;
};
