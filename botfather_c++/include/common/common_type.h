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

#include <websocketpp/config/asio_client.hpp>
#include <websocketpp/client.hpp>
#include <boost/asio/ssl/context.hpp>
#include <boost/asio/ssl.hpp>
#include <nlohmann/json.hpp>

#define DEBUG 1

inline std::string current_timestamp() {
    auto now = std::chrono::system_clock::now();
    auto now_t = std::chrono::system_clock::to_time_t(now);
    std::tm local_tm = *std::localtime(&now_t);

    std::ostringstream oss;
    oss << std::put_time(&local_tm, "%Y-%m-%d %H:%M:%S"); 
    return oss.str();
}

#ifndef DEBUG
#define LOGD(mess, ...)
#else
#define LOGD(mess, ...) std::printf("[%s] [DEBUG] %s " mess "\n", current_timestamp().c_str(), __func__, ##__VA_ARGS__);
#endif

#define LOGI(mess, ...) std::printf("[%s] [INFO] %s " mess "\n", current_timestamp().c_str(), __func__, ##__VA_ARGS__);
#define LOGE(mess, ...) std::fprintf(stderr, "[%s] [ERROR] %s " mess "\n", current_timestamp().c_str(), __func__, ##__VA_ARGS__);

#define SLEEP_FOR(ms) std::this_thread::sleep_for(std::chrono::milliseconds(ms))

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
