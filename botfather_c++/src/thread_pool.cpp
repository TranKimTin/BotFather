#include "thread_pool.h"

ThreadPool::ThreadPool(size_t numThreads)
{
    LOGI("Creating thread pool with {} threads", numThreads);

    for (size_t i = 0; i < numThreads; ++i)
    {
        workers.emplace_back([this]()
                             {
            while (true) {
                function<void()> task;

                {
                    unique_lock<mutex> lock(this->queueMutex);
                    this->condition.wait(lock, [this]() {
                        return !this->tasks.empty();
                    });

                    if (this->tasks.empty())
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
    condition.notify_all();
    for (thread &worker : workers)
        worker.join();
}

ThreadPool &ThreadPool::getInstance()
{
    static ThreadPool instance(1);
    return instance;
}
