#include "sparse_table.h"
#include <cmath>
#include <algorithm>

void SparseTable::init(const double *a, int length)
{
    n = length;
    int max_log = log2(n) + 1;

    log2s.resize(n + 1);
    log2s[1] = 0;
    for (int i = 2; i <= n; ++i)
        log2s[i] = log2s[i / 2] + 1;

    st_min.resize(n);
    for (auto &row : st_min)
        row.resize(max_log);

    st_max.resize(n);
    for (auto &row : st_max)
        row.resize(max_log);

    for (int i = 0; i < n; ++i)
    {
        st_min[i][0] = a[i];
        st_max[i][0] = a[i];
    }

    for (int j = 1; (1 << j) <= n; ++j)
    {
        for (int i = 0; i + (1 << j) <= n; ++i)
        {
            st_min[i][j] = min(st_min[i][j - 1], st_min[i + (1 << (j - 1))][j - 1]);
            st_max[i][j] = max(st_max[i][j - 1], st_max[i + (1 << (j - 1))][j - 1]);
        }
    }
}

double SparseTable::query_min(int l, int r) const
{
    int k = log2s[r - l + 1];
    return min(st_min[l][k], st_min[r - (1 << k) + 1][k]);
}

double SparseTable::query_max(int l, int r) const
{
    int k = log2s[r - l + 1];
    return max(st_max[l][k], st_max[r - (1 << k) + 1][k]);
}

int SparseTable::size()
{
    return n;
}