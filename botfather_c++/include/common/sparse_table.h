#pragma once

#include <vector>
using namespace std;

class SparseTable
{
private:
    vector<double> st_min; // mảng phẳng
    vector<double> st_max; // mảng phẳng
    vector<int> log2s;
    int n;
    int max_log;

    inline int idx(int i, int j) const { return j * n + i; }

public:
    SparseTable() = default;                // Cho phép tạo qua pool
    void init(const double *a, int length); // Dùng thay constructor
    double query_min(int l, int r) const;
    double query_max(int l, int r) const;
    int size();
};
