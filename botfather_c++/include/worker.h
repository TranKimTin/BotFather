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
    boost::unordered_flat_set<long long> visited;
    boost::unordered_flat_map<long long, any> cachedExpr;
    ExchangeInfo exchangeInfo;
    double fundingRate;
    boost::unordered_flat_map<long long, vector<double>> cachedIndicator;
    boost::unordered_flat_map<long long, unique_ptr<SparseTable>> cachedMinMax;

    string calculateSub(string &expr);
    any calculate(string &expr);
    bool adjustParam(NodeData &data);

public:
    Worker()
    {
        visited.max_load_factor(0.5);
        cachedExpr.max_load_factor(0.5);
        cachedIndicator.max_load_factor(0.5);
        cachedMinMax.max_load_factor(0.5);
    };
    void init(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime, ExchangeInfo exchangeInfo, double fundingRate);
    void run();
    void dfs_handleLogic(Route &route, const shared_ptr<Bot> &bot);
    bool handleLogic(NodeData &node, const shared_ptr<Bot> &bot);
};