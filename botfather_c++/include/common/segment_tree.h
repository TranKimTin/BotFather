#pragma once

#include <vector>
#include <algorithm>
#include <limits>

class SegmentTree
{
private:
    int n;
    int _size;
    std::vector<double> tmin;
    std::vector<double> tmax;

public:
    SegmentTree() = default;

    void init(const double *a, int length);

    inline double query_min(int l, int r) const
    {
        l += _size;
        r += _size;

        double res = std::numeric_limits<double>::infinity();

        while (l <= r)
        {
            if (l & 1)
                res = std::min(res, tmin[l++]);
            if (!(r & 1))
                res = std::min(res, tmin[r--]);
            l >>= 1;
            r >>= 1;
        }
        return res;
    }

    inline double query_max(int l, int r) const
    {
        l += _size;
        r += _size;

        double res = -std::numeric_limits<double>::infinity();

        while (l <= r)
        {
            if (l & 1)
                res = std::max(res, tmax[l++]);
            if (!(r & 1))
                res = std::max(res, tmax[r--]);
            l >>= 1;
            r >>= 1;
        }
        return res;
    }

    inline int size() const { return n; }
};