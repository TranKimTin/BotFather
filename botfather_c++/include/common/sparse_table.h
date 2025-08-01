#pragma one

#include <vector>
using namespace std;

class SparseTable
{
private:
    vector<vector<double>> st_min;
    vector<vector<double>> st_max;
    vector<int> log2s;
    int n;

public:
    explicit SparseTable(const double *a, int length);
    double query_min(int l, int r) const;
    double query_max(int l, int r) const;
    int size();
};
