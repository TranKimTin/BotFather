#include <iostream>
#include <vector>
#include <ctime>
using namespace std;

int main()
{
    long long t1 = clock();

    for (int k = 0; k < 10; k++)
    {
        vector<int> a;
        for (int i = 0; i < 10000000; i++)
        {
            a.push_back(i);
        }
    }
    long long t2 = clock();

    cout << "runtime=" << (t2 - t1) / 1000;
    return 0;
}