#pragma once

#include "common_type.h"
#include "socket_data.h"

class SocketOkx : public SocketData
{
protected:
    void on_message(connection_hdl, message_ptr msg) override;
    RateData getOHLCV(const string &symbol, const string &timeframe, int limit, long long since = 0) override;
    vector<string> getSymbolList() override;
    void onSocketConnected(connection_hdl hdl) override;
    unordered_map<string, Digit> getDigit() override;

public:
    SocketOkx(const int _BATCH_SIZE);
    void connectSocket() override;
};