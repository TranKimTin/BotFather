#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <stack>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <deque>
#include <chrono>
#include <thread>
#include <condition_variable>
#include <cctype>
#include <ctime>
#include <iomanip>
#include <sstream>
#include <mutex>
#include <shared_mutex>
#include <cstdio>
#include <memory>
#include <cmath>
#include <functional>
#include <any>
#include <filesystem>
#include <random>
#include <algorithm>

#include "sparse_table.h"

#include <websocketpp/config/asio_client.hpp>
#include <websocketpp/client.hpp>

#include <boost/interprocess/sync/interprocess_semaphore.hpp>
#include <boost/asio/ssl/context.hpp>
#include <boost/asio/ssl.hpp>
#include <boost/unordered/unordered_flat_set.hpp>
#include <boost/unordered/unordered_flat_map.hpp>

#include <nlohmann/json.hpp>

#include <spdlog/spdlog.h>
#include <spdlog/sinks/daily_file_sink.h>
#include <spdlog/async.h>
#include <spdlog/sinks/basic_file_sink.h>
#include <spdlog/sinks/stdout_color_sinks.h>
#include <fmt/format.h>
#include <fmt/core.h>

using namespace std;

// #define DEBUG_LOG 1

#ifndef DEBUG_LOG
#define LOGD(mess, ...)
#else
#define LOGD(mess, ...) spdlog::debug("[{}] {}", __func__, fmt::format(mess, ##__VA_ARGS__))
#endif

#define LOGI(mess, ...) spdlog::info("[{}] {}", __func__, fmt::format(mess, ##__VA_ARGS__))
#define LOGE(mess, ...) spdlog::error("[{}] {}", __func__, fmt::format(mess, ##__VA_ARGS__))

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

struct ORDER_STATUS
{
    inline static const string OPENED = "Mở lệnh";
    inline static const string MATCH_STOP = "Khớp stop";
    inline static const string MATCH_ENTRY = "Khớp entry";
    inline static const string MATCH_TP = "Khớp TP";
    inline static const string MATCH_SL = "Khớp SL";
    inline static const string CANCELED = "Đã hủy";
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
    // string treeData;
    int userID;
    string apiKey;
    string secretKey;
    string iv;
    bool enableRealOrder;
    boost::unordered_flat_set<long long> symbolExist;
};

struct Digit
{
    int volume;
    int prices;
};

class RequestException : public exception
{
    int code;
    string msg;

public:
    RequestException(int c, string m) : code(c), msg(move(m)) {}

    const char *what() const noexcept override
    {
        return msg.c_str();
    }

    int errorCode() const noexcept
    {
        return code;
    }
};