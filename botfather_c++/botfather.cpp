#define _CRT_SECURE_NO_DEPRECATE
#include <iostream>
#include <vector>
using namespace std;

int main()
{

    auto t1 = clock();

    for (int k = 0; k < 10; k++)
    {
        vector<int> a;
        long long x = 1;
        for (int i = 0; i < 10000000; i++)
        {
            a.push_back(i);
        }
    }
    auto t2 = clock();
    cout << "time=" << (t2 - t1) / 1000 << endl;
    return 0;
}
