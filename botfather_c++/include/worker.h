#pragma one
#include "common_type.h"
#include "socket_data.h"

class Worker
{
protected:
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
    boost::unordered_flat_map<long long, shared_ptr<Bot>> bots;
    boost::unordered_flat_set<long long> visited;
    boost::unordered_flat_map<long long, double> cachedExpr;
    ExchangeInfo exchangeInfo;
    double fundingRate;
    boost::unordered_flat_map<long long, vector<double>> cachedIndicator;
    boost::unordered_flat_map<long long, unique_ptr<SparseTable>> cachedMinMax;
    boost::unordered_flat_map<long long, bool> cachedSignal;
    SocketData* socketData;
    bool postedSignal;
    bool onlyCheckSignal;
    string botKey;
    int shift;

    string calculateSub(string &expr);
    double calculate(string &expr);
    bool adjustParam(NodeData &data);

    void dfs_handleLogic(Route &route, const shared_ptr<Bot> &bot);
    bool handleLogic(NodeData &node, const shared_ptr<Bot> &bot);
    virtual bool getSignal(const string& botName, const string& symbol, const string& timeframe);
    virtual bool handlerNewOrder(NodeData& node, const shared_ptr<Bot> &bot);
    virtual bool sendTelegram(NodeData& node, const shared_ptr<Bot> &bot);

public:
    Worker()
    {
        visited.max_load_factor(0.5);
        cachedExpr.max_load_factor(0.5);
        cachedIndicator.max_load_factor(0.5);
        cachedMinMax.max_load_factor(0.5);
        bots.max_load_factor(0.5);
        socketData = nullptr;
        onlyCheckSignal = false;
        shift = 0;
    };
    virtual ~Worker() = default;
    void init(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime, ExchangeInfo exchangeInfo, double fundingRate, SocketData* socketData);
    virtual bool isPostedSignal(shared_ptr<Bot> bot);
    void run(const shared_ptr<Bot> &bot, int shift);
    void run();
};