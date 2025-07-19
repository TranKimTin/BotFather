#pragma one
#include "common_type.h"

class Worker
{
private:
    string broker;
    string symbol;
    string timeframe;
    vector<double> open;
    vector<double> high;
    vector<double> low;
    vector<double> close;
    vector<double> volume;
    vector<long long> startTime;
    shared_ptr<vector<shared_ptr<Bot>>> botList;
    unordered_map<string, bool> visited;
    Digit digit;
    double fundingRate;

    string calculateSub(string &expr);
    any calculate(string &expr);
    bool adjustParam(NodeData &data);
    int compareStringNumber(const string &a, const string &b);

public:
    Worker(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime, Digit digit, double fundingRate);
    void run();
    void dfs_handleLogic(Route &route, Bot &bot);
    bool handleLogic(NodeData &node, Bot &bot);
};