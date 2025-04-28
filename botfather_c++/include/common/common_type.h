#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <queue>
#include <chrono>
#include <thread>
#include <cctype>

#include <websocketpp/config/asio_client.hpp>
#include <websocketpp/client.hpp>
#include <boost/asio/ssl/context.hpp>
#include <boost/asio/ssl.hpp>
#include <nlohmann/json.hpp>

#define DEBUG 1

// #define endl "\n"

#ifndef DEBUG
#define LOGD(s, ...)
#else
#define LOGD(s, ...) std::printf("[DEBUG]: " s "\n", ##__VA_ARGS__);
#endif

#define LOGI(s, ...) std::printf("[INFO]: " s "\n", ##__VA_ARGS__);
#define LOGE(s, ...) std::fprintf(stderr, "[ERROR]: " s "\n", ##__VA_ARGS__);

using namespace std;

typedef websocketpp::client<websocketpp::config::asio_tls_client> WebSocket;
using websocketpp::connection_hdl;
using message_ptr = websocketpp::config::asio_tls_client::message_type::ptr;
using json = nlohmann::json;

struct RateData
{
    string symbol;
    string interval;
    bool isFinal;
    deque<double> open;
    deque<double> high;
    deque<double> low;
    deque<double> close;
    deque<double> volume;
    deque<long long> startTime;
};
