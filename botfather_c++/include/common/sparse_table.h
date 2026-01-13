#pragma once

#include <vector>
#include <algorithm>

class SparseTable
{
private:
    int n = 0;
    int max_log = 0;

    // st_min[j][i], st_max[j][i]
    std::vector<std::vector<double>> st_min;
    std::vector<std::vector<double>> st_max;

    std::vector<int> log2s;

public:
    SparseTable() = default;

    void init(const double* a, int length);

    inline double query_min(int l, int r) const
    {
        int k = log2s[r - l + 1];
        return std::min(st_min[k][l],
                        st_min[k][r - (1 << k) + 1]);
    }

    inline double query_max(int l, int r) const
    {
        int k = log2s[r - l + 1];
        return std::max(st_max[k][l],
                        st_max[k][r - (1 << k) + 1]);
    }

    inline int size() const { return n; }
};
