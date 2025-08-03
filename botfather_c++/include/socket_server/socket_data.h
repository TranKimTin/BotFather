#pragma once
#include "common_type.h"

class SocketData
{
protected:
    string broker;
    unordered_map<long long, RateData> data; // key = symbol + "_" + timeframe;
    vector<string> timeframes;
    vector<string> symbolList;
    WebSocket ws;
    const int BATCH_SIZE;
    std::mutex mMutex;
    shared_ptr<vector<shared_ptr<Bot>>> botList;
    shared_ptr<boost::asio::ssl::context> on_tls_init(connection_hdl);
    unordered_map<long long, Digit> digits;
    unordered_map<long long, double> fundingRates;
    bool firstConnection;
    string uri;

    virtual void onSocketConnected(connection_hdl hdl);
    void reconnectSocket();
    void onSocketClosed(connection_hdl hdl);

    void onCloseCandle(const string &symbol, string &timeframe, RateData &data);
    void adjustData(RateData &rateData);
    void updateCache(const RateData &rateData);
    void mergeData(RateData &rateData, const string &symbol, string &timeframe, string &currentTF, double open, double high, double low, double close, double volume, long long timestamp, bool isFinal, bool ignoreClose);
    bool isValidData(const RateData &rateData);
    RateData getOHLCVFromCache(const string &symbol, const string &timeframe);

    virtual void on_message(connection_hdl, message_ptr msg) = 0;
    virtual vector<string> getSymbolList() = 0;
    virtual unordered_map<long long, Digit> getDigit() = 0;
    virtual RateData getOHLCV(const string &symbol, const string &timeframe, int limit, long long since = 0) = 0; // from since, get limit candle

public:
    SocketData(const int _BATCH_SIZE);
    void setBotList(shared_ptr<vector<shared_ptr<Bot>>> botList);
    void init();

    virtual void connectSocket() = 0;
};