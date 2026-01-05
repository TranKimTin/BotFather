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
#include <fstream>

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
    deque<long long> startTime;
    deque<double> open;
    deque<double> high;
    deque<double> low;
    deque<double> close;
    deque<double> volume;

    void clear()
    {
        startTime.clear();
        open.clear();
        high.clear();
        low.clear();
        close.clear();
        volume.clear();
    }

    void adjustData()
    {
        if (open.size() > MAX_CANDLE)
        {
            open.pop_back();
            high.pop_back();
            low.pop_back();
            close.pop_back();
            volume.pop_back();
            startTime.pop_back();
        }
    }
};

struct RateDataV
{
    string symbol;
    string interval;
    vector<long long> startTime;
    vector<double> open;
    vector<double> high;
    vector<double> low;
    vector<double> close;
    vector<double> volume;

    void clear()
    {
        startTime.clear();
        open.clear();
        high.clear();
        low.clear();
        close.clear();
        volume.clear();
    }

    void reverse()
    {
        std::reverse(startTime.begin(), startTime.end());
        std::reverse(open.begin(), open.end());
        std::reverse(high.begin(), high.end());
        std::reverse(low.begin(), low.end());
        std::reverse(close.begin(), close.end());
        std::reverse(volume.begin(), volume.end());
    }
};

struct Rate
{
    long long startTime;
    double open;
    double high;
    double low;
    double close;
    double volume;
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
    inline static const string GET_SIGNAL = "getSignal";
    inline static const string POST_SIGNAL = "postSignal";
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
    string botName;
    string symbol;
    string timeframe;
};

struct BacktestOrder
{
    int id;
    double priority;
    string orderType;
    double entry;
    double volume;
    double tp;
    double sl;
    long long createdTime;
    long long expiredTime;
    long long matchTime;
    double profit;
    string status;

    bool operator<(const BacktestOrder &other) const
    {
        return priority < other.priority; // max-heap based on priority
    }

    BacktestOrder() : id(0), priority(0.0), orderType(""), entry(0.0), volume(0.0), tp(0.0), sl(0.0), createdTime(0), expiredTime(0), matchTime(0), profit(0.0), status("") {}
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
    int maxOpenOrderPerSymbolBot;
    int maxOpenOrderAllSymbolBot;
    int maxOpenOrderPerSymbolAccount;
    int maxOpenOrderAllSymbolAccount;
    boost::unordered_flat_set<long long> symbolExist;
};

struct ExchangeInfo
{
    int digitVolume;
    int digitPrices;
    double minPrice;
    double maxPrice;
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

struct BacktestTime
{
    int year;
    int month;

    BacktestTime(int y = 0, int m = 0) : year(y), month(m) {}

    bool operator<(const BacktestTime &t) const
    {
        return year < t.year || (year == t.year && month < t.month);
    }
    bool operator==(const BacktestTime &t) const
    {
        return year == t.year && month == t.month;
    }
    bool operator<=(const BacktestTime &t) const
    {
        return *this < t || *this == t;
    }
    BacktestTime &operator++(int)
    {
        month++;
        if (month == 13)
        {
            month = 1;
            year++;
        }
        return *this;
    }

    BacktestTime operator+(int m) const
    {
        BacktestTime r = *this;
        int total = r.year * 12 + (r.month - 1) + m;
        r.year = total / 12;
        r.month = total % 12 + 1;
        return r;
    }

    BacktestTime operator-(int m) const
    {
        return *this + (-m);
    }

    string toString() const
    {
        string s = to_string(year);
        s.push_back('-');
        if (month <= 9)
        {
            s.push_back('0');
        }
        s += to_string(month);
        return s;
    }

    long long toMillisecondsUTC() const
    {
        std::tm tm{};
        tm.tm_year = year - 1900; // years since 1900
        tm.tm_mon = month - 1;    // 0-based
        tm.tm_mday = 1;
        tm.tm_hour = 0;
        tm.tm_min = 0;
        tm.tm_sec = 0;
        tm.tm_isdst = 0;

        std::time_t t = timegm(&tm);

        return std::chrono::duration_cast<std::chrono::milliseconds>(
                   std::chrono::system_clock::from_time_t(t).time_since_epoch())
            .count();
    }
};