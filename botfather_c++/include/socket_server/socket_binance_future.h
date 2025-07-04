#pragma once

#include "common_type.h"
#include "socket_data.h"

class SocketBinanceFuture : public SocketData
{
protected:
    void on_message(connection_hdl, message_ptr msg) override;
    RateData getOHLCV(const string &symbol, const string &timeframe, int limit, long long since = 0) override;
    vector<string> getSymbolList() override;

public:
    SocketBinanceFuture(const int _BATCH_SIZE);
    void connectSocket() override;
};