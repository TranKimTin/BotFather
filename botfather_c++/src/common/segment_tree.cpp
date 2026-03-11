#include "segment_tree.h"

void SegmentTree::init(const double *a, int length)

{
    n = length;
    _size = 1;
    while (_size < n)
        _size <<= 1;

    tmin.assign(_size << 1, std::numeric_limits<double>::infinity());
    tmax.assign(_size << 1, -std::numeric_limits<double>::infinity());

    for (int i = 0; i < n; ++i)
    {
        tmin[_size + i] = a[i];
        tmax[_size + i] = a[i];
    }

    for (int i = _size - 1; i > 0; --i)
    {
        tmin[i] = std::min(tmin[i << 1], tmin[i << 1 | 1]);
        tmax[i] = std::max(tmax[i << 1], tmax[i << 1 | 1]);
    }
}