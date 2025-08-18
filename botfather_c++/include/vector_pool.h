#include <common_type.h>

class VectorDoublePool
{
public:
    vector<double> acquire()
    {
        if (!pool.empty())
        {
            vector<double> vec = move(pool.top());
            pool.pop();
            vec.clear();
            return vec;
        }
        return vector<double>();
    }

    vector<double> acquireLock()
    {
        lock_guard<mutex> lock(mMutex);
        return acquire();
    }

    // Trả vector lại vào pool
    void release(vector<double> &vec)
    {
        pool.push(move(vec));
    }

    void releaseLock(vector<double> &vec)
    {
        lock_guard<mutex> lock(mMutex);
        release(vec);
    }

    size_t cached_count() const
    {
        return pool.size();
    }

    static VectorDoublePool &getInstance()
    {
        static VectorDoublePool instance;
        return instance;
    }

private:
    stack<vector<double>> pool;
    mutable mutex mMutex;
};

class VectorLongLongPool
{
public:
    // Lấy vector từ pool hoặc tạo mới nếu hết
    vector<long long> acquire()
    {
        if (!pool.empty())
        {
            vector<long long> vec = move(pool.top());
            pool.pop();
            vec.clear();
            return vec;
        }
        return vector<long long>();
    }

    vector<long long> acquireLock()
    {
        lock_guard<mutex> lock(mMutex);
        return acquire();
    }

    // Trả vector lại vào pool
    void release(vector<long long> &vec)
    {
        pool.push(move(vec));
    }

    void releaseLock(vector<long long> &vec)
    {
        lock_guard<mutex> lock(mMutex);
        release(vec);
    }

    size_t cached_count() const
    {
        return pool.size();
    }

    static VectorLongLongPool &getInstance()
    {
        static VectorLongLongPool instance;
        return instance;
    }

private:
    stack<vector<long long>> pool;
    mutable mutex mMutex;
};

class SparseTablePool
{
public:
    // Lấy 1 SparseTable từ pool, nếu hết thì tạo mới
    unique_ptr<SparseTable> acquire()
    {
        if (!pool.empty())
        {
            auto ptr = move(pool.top());
            pool.pop();
            return ptr;
        }
        return make_unique<SparseTable>();
    }

    // Trả SparseTable về pool
    void release(unique_ptr<SparseTable> table)
    {
        pool.push(move(table));
    }

    size_t cached_count() const
    {
        return pool.size();
    }

private:
    stack<unique_ptr<SparseTable>> pool;
};