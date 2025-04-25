#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <queue>
#include <chrono>
#include <thread>

#include <websocketpp/config/asio_client.hpp>
#include <websocketpp/client.hpp>
#include <boost/asio/ssl/context.hpp>
#include <boost/asio/ssl.hpp>
#include <nlohmann/json.hpp>

using namespace std;

typedef websocketpp::client<websocketpp::config::asio_tls_client> WebSocket;
using websocketpp::connection_hdl;
using message_ptr = websocketpp::config::asio_tls_client::message_type::ptr;
using json = nlohmann::json;


struct RateData
{
    string symbol;
    string interval;
    deque<double> open;
    deque<double> high;
    deque<double> low;
    deque<double> close;
    deque<double> volume;
    deque<long long> timestamp;
};
