#pragma once

#include <common_type.h>
class ThreadPool
{
public:
    static ThreadPool& getInstance();
    
    void enqueue(function<void()> task);

    ThreadPool(size_t numThreads);
    ~ThreadPool();

private:
    vector<thread> workers;
    queue<function<void()>> tasks;

    mutex queueMutex;
    condition_variable condition;
};
