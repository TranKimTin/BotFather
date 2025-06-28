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

public:
    Worker(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime);
    void run();
    void dfs_handleLogic(Route &route, int botID, unordered_map<string, bool> &visited);
    bool handleLogic(NodeData &node, int botID);
};