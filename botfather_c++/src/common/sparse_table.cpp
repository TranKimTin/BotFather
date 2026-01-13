#include "sparse_table.h"

void SparseTable::init(const double* a, int length)
{
    n = length;
    if (n <= 0) return;

    // max_log = floor(log2(n)) + 1
    max_log = 32 - __builtin_clz(n);

    // log2 lookup
    log2s.resize(n + 1);
    log2s[1] = 0;
    for (int i = 2; i <= n; ++i)
        log2s[i] = log2s[i >> 1] + 1;

    // cấp phát theo level (cache-friendly)
    st_min.assign(max_log, std::vector<double>(n));
    st_max.assign(max_log, std::vector<double>(n));

    // level 0
    for (int i = 0; i < n; ++i)
    {
        st_min[0][i] = a[i];
        st_max[0][i] = a[i];
    }

    // build
    for (int j = 1, len = 2; len <= n; ++j, len <<= 1)
    {
        int half = len >> 1;
        int limit = n - len + 1;

        const auto& prev_min = st_min[j - 1];
        const auto& prev_max = st_max[j - 1];
        auto& cur_min = st_min[j];
        auto& cur_max = st_max[j];

        for (int i = 0; i < limit; ++i)
        {
            double a1 = prev_min[i];
            double b1 = prev_min[i + half];
            cur_min[i] = a1 < b1 ? a1 : b1;

            double a2 = prev_max[i];
            double b2 = prev_max[i + half];
            cur_max[i] = a2 > b2 ? a2 : b2;
        }
    }
}
