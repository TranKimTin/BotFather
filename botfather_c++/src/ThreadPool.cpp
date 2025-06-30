#include "ThreadPool.h"

ThreadPool::ThreadPool(size_t numThreads) : stop(false)
{
    for (size_t i = 0; i < numThreads; ++i)
    {
        workers.emplace_back([this]()
                             {
            while (true) {
                function<void()> task;

                {
                    unique_lock<mutex> lock(this->queueMutex);
                    this->condition.wait(lock, [this]() {
                        return this->stop || !this->tasks.empty();
                    });

                    if (this->stop && this->tasks.empty())
                        return;

                    task = move(this->tasks.front());
                    this->tasks.pop();
                }

                task();
            } });
    }
}

void ThreadPool::enqueue(function<void()> task)
{
    {
        lock_guard<mutex> lock(queueMutex);
        tasks.push(move(task));
    }
    condition.notify_one();
}

ThreadPool::~ThreadPool()
{
    stop = true;
    condition.notify_all();
    for (thread &worker : workers)
        worker.join();
}

ThreadPool &ThreadPool::getInstance()
{
    static ThreadPool instance(2);
    return instance;
}

ThreadPool &ThreadPool::getCacheInstance()
{
    static ThreadPool cacheInstance(2);
    return cacheInstance;
}
