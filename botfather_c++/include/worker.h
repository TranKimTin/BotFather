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
    unordered_map<string, any> cachedExpr;
    Digit digit;
    double fundingRate;
    unordered_map<string, vector<double>> cachedIndicator;
    unordered_map<string, unique_ptr<SparseTable>> cachedMinMax;

    string calculateSub(string &expr);
    any calculate(string &expr);
    bool adjustParam(NodeData &data);

public:
    Worker() {};
    void init(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime, Digit digit, double fundingRate);
    void run();
    void dfs_handleLogic(Route &route, const shared_ptr<Bot> &bot);
    bool handleLogic(NodeData &node, const shared_ptr<Bot> &bot);
};