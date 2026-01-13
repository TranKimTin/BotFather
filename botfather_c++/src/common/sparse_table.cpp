#include "sparse_table.h"
#include <cmath>
#include <algorithm>

void SparseTable::init(const double *a, int length)
{
    n = length;
    max_log = 32 - __builtin_clz(n);

    log2s.resize(n + 1);
    log2s[1] = 0;
    for (int i = 2; i <= n; ++i)
        log2s[i] = log2s[i / 2] + 1;

    st_min.resize(n * max_log);
    st_max.resize(n * max_log);

    for (int i = 0; i < n; ++i)
    {
        st_min[idx(i, 0)] = a[i];
        st_max[idx(i, 0)] = a[i];
    }

    for (int j = 1, len = 2; len <= n; ++j, len <<= 1)
    {
        int half = len >> 1;
        int cur = j * n;
        int prev = (j - 1) * n;

        for (int i = 0; i + len <= n; ++i)
        {
            st_min[cur + i] =
                std::min(st_min[prev + i], st_min[prev + i + half]);

            st_max[cur + i] =
                std::max(st_max[prev + i], st_max[prev + i + half]);
        }
    }
}

double SparseTable::query_min(int l, int r) const
{
    int k = log2s[r - l + 1];
    return min(st_min[idx(l, k)], st_min[idx(r - (1 << k) + 1, k)]);
}

double SparseTable::query_max(int l, int r) const
{
    int k = log2s[r - l + 1];
    return max(st_max[idx(l, k)], st_max[idx(r - (1 << k) + 1, k)]);
}

int SparseTable::size()
{
    return n;
}
