#ifndef COMMON_TYPE
#define COMMON_TYPE

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>

#include <chrono>
#include <thread>

using namespace std;

struct RateData
{
    string symbol;
    long long startTime;
    double open;
    double high;
    double low;
    double close;
    double volume;
    string interval;
    bool isFinal;
    bool cached;
};

#endif
