#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <queue>
#include <chrono>
#include <thread>
#include <cctype>
#include <ctime>
#include <iomanip>
#include <sstream>
#include <mutex>
#include <cstdio>
#include <memory>
#include <cmath>
#include <functional>


#include <websocketpp/config/asio_client.hpp>
#include <websocketpp/client.hpp>
#include <boost/asio/ssl/context.hpp>
#include <boost/asio/ssl.hpp>
#include <nlohmann/json.hpp>

using namespace std;

#define DEBUG 1

inline string current_timestamp()
{
    auto now = chrono::system_clock::now();
    auto now_t = chrono::system_clock::to_time_t(now);
    tm local_tm = *localtime(&now_t);

    ostringstream oss;
    oss << put_time(&local_tm, "%Y-%m-%d %H:%M:%S");
    return oss.str();
}

#ifndef DEBUG
#define LOGD(mess, ...)
#else
#define LOGD(mess, ...) printf("[%s] [DEBUG] %s " mess "\n", current_timestamp().c_str(), __func__, ##__VA_ARGS__);
#endif

#define LOGI(mess, ...) printf("[%s] [INFO] %s " mess "\n", current_timestamp().c_str(), __func__, ##__VA_ARGS__);
#define LOGE(mess, ...) fprintf(stderr, "[%s] [ERROR] %s " mess "\n", current_timestamp().c_str(), __func__, ##__VA_ARGS__);

#define SLEEP_FOR(ms) this_thread::sleep_for(chrono::milliseconds(ms))

using namespace std;

typedef websocketpp::client<websocketpp::config::asio_tls_client> WebSocket;
using websocketpp::connection_hdl;
using message_ptr = websocketpp::config::asio_tls_client::message_type::ptr;
using json = nlohmann::json;

const int MAX_CANDLE = 600;
struct RateData
{
    string symbol;
    string interval;
    deque<double> open;
    deque<double> high;
    deque<double> low;
    deque<double> close;
    deque<double> volume;
    deque<long long> startTime;
};

struct UNIT
{
    inline static const string PRICE = "price";
    inline static const string PERCENT = "percent";
    inline static const string RR = "rr";
    inline static const string USD = "usd";
    inline static const string TOKEN = "token";
    inline static const string CANDLE = "candle";
    inline static const string MINUTE = "minute";
};
struct NODE_TYPE
{
    inline static const string START = "start";
    inline static const string EXPR = "expr";
    inline static const string TELEGRAM = "telegram";
    inline static const string BUY_MARKET = "openBuyMarket";
    inline static const string BUY_LIMIT = "openBuyLimit";
    inline static const string BUY_STOP_MARKET = "openBuyStopMarket";
    inline static const string BUY_STOP_LIMIT = "openBuyStopLimit";
    inline static const string SELL_MARKET = "openSellMarket";
    inline static const string SELL_LIMIT = "openSellLimit";
    inline static const string SELL_STOP_MARKET = "openSellStopMarket";
    inline static const string SELL_STOP_LIMIT = "openSellStopLimit";
    inline static const string CLOSE_ALL_ORDER = "closeAllOrder";
    inline static const string CLOSE_ALL_POSITION = "closeAllPosition";
};

struct NodeData
{
    string id;
    string type;
    string unitEntry;
    string unitExpiredTime;
    string unitSL;
    string unitStop;
    string unitTP;
    string unitVolume;
    string value;
    string stop;
    string entry;
    string tp;
    string sl;
    string volume;
    string expiredTime;
};

struct Route
{
    string id;
    NodeData data;
    vector<Route> next;
};

struct Symbol
{
    string broker;
    string symbol;
    string symbolName;
};

struct Bot
{
    int id;
    string botName;
    vector<string> idTelegram;
    Route route;
    vector<Symbol> symbolList;
    vector<string> timeframes;
    string treeData;
    int userID;
};

struct Digit{
    int volume;
    int prices;
};