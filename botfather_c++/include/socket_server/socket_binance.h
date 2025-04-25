#pragma once

#include "common_type.h"

class SocketBinance
{
protected:
    string broker;
    unordered_map<string, RateData> data;
    vector<string> timeframes;
    vector<string> symbolList;
    WebSocket ws;

    void on_message(connection_hdl, message_ptr msg);

    shared_ptr<boost::asio::ssl::context> on_tls_init(connection_hdl);

    // void onCloseCandle(string &broker, string &symbol, string &timeframe, RateData &data);
    RateData getOHLCV(string &symbol, string &timeframe, int limit, long long since = 0);
    vector<string> getSymbolList();
    void connectSocket();

public:
    SocketBinance();
};