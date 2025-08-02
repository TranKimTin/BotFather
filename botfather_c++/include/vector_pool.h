#include <vector>
#include "sparse_table.h"
#include <stack>
using namespace std;

class VectorDoublePool
{
public:
    // Lấy vector từ pool hoặc tạo mới nếu hết
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

    // Trả vector lại vào pool
    void release(vector<double> &vec)
    {
        pool.push(move(vec));
    }

private:
    stack<vector<double>> pool;
};

class SparseTablePool {
public:
    // Lấy 1 SparseTable từ pool, nếu hết thì tạo mới
    unique_ptr<SparseTable> acquire() {
        if (!pool.empty()) {
            auto ptr = move(pool.top());
            pool.pop();
            return ptr;
        }
        return make_unique<SparseTable>();
    }

    // Trả SparseTable về pool
    void release(unique_ptr<SparseTable> table) {
        pool.push(move(table));
    }

    // Kiểm tra số lượng đang cache trong pool (tùy mục đích debug)
    size_t cached_count() const {
        return pool.size();
    }

private:
    stack<unique_ptr<SparseTable>> pool;
};