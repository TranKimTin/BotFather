#include "socket_binance_future.h"
#include "common_type.h"
#include "util.h"

SocketBinanceFuture::SocketBinanceFuture(const int _BATCH_SIZE) : SocketData(_BATCH_SIZE)
{
    broker = "binance_future";
}

void SocketBinanceFuture::on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    json j = json::parse(message);
    // {"stream":"slfusdt@kline_1m","data":{"e":"kline","E":1745689546800,"s":"SLFUSDT","k":{"t":1745689500000,"T":1745689559999,"s":"SLFUSDT","i":"1m","f":13562205,"L":13562210,"o":"0.20800000","c":"0.20810000","h":"0.20810000","l":"0.20800000","v":"624.60000000","n":6,"x":false,"q":"129.95848000","V":"624.60000000","Q":"129.95848000","B":"0"}}}

    // {"stream":"!markPrice@arr",
    //  "data": {
    //     "e": "markPriceUpdate",  	// Event type
    //     "E": 1562305380000,      	// Event time
    //     "s": "BTCUSDT",          	// Symbol
    //     "p": "11185.87786614",   	// Mark price
    //     "i": "11784.62659091"		// Index price
    //     "P": "11784.25641265",		// Estimated Settle Price, only useful in the last hour before the settlement starts
    //     "r": "0.00030000",       	// Funding rate
    //     "T": 1562306400000       	// Next funding time
    //  }}

    auto jdata = j["data"];
    auto jstream = j["stream"];
    if (jstream == "!markPrice@arr")
    {
        lock_guard<mutex> lock(mMutex);
        for (const auto &item : jdata)
        {
            string symbol = item["s"].get<string>();
            fundingRates[symbol] = stod(item["P"].get<string>()) * 100.0;
        }
    }
    else
    {
        auto kline = jdata["k"];

        string symbol = jdata["s"].get<string>();
        string interval = kline["i"].get<string>();
        long long startTime = kline["t"].get<long long>();
        double open = stod(kline["o"].get<string>());
        double high = stod(kline["h"].get<string>());
        double low = stod(kline["l"].get<string>());
        double close = stod(kline["c"].get<string>());
        double volume = stod(kline["v"].get<string>());
        bool isFinal = kline["x"].get<bool>();

        for (auto tf : timeframes)
        {
            lock_guard<mutex> lock(mMutex);

            string key = symbol + "_" + tf;
            RateData &rateData = data[key];
            if (rateData.startTime.empty())
                continue;

            mergeData(rateData, symbol, tf, interval, open, high, low, close, volume, startTime, isFinal, false);
        }
    }
}

void SocketBinanceFuture::connectSocket()
{
    LOGI("socket {} init {} symbols", broker, symbolList.size());

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.start_perpetual();

    ws.set_message_handler(bind(&SocketBinanceFuture::on_message, this,
                                placeholders::_1,
                                placeholders::_2));
    ws.set_tls_init_handler(bind(&SocketBinanceFuture::on_tls_init, this, placeholders::_1));
    ws.set_open_handler(bind(&SocketBinanceFuture::onSocketConnected, this, placeholders::_1));
    ws.set_close_handler(bind(&SocketBinanceFuture::onSocketClosed, this, placeholders::_1));
    ws.set_fail_handler(bind(&SocketBinanceFuture::onSocketClosed, this, placeholders::_1));

    uri = "wss://fstream.binance.com/stream?streams=!markPrice@arr/";
    for (int i = 0; i < symbolList.size(); i++)
    {
        uri += (toLowerCase(symbolList[i]) + "@kline_1m");
        if (i < symbolList.size() - 1)
        {
            uri += "/";
        }
    }
    reconnectSocket();
    ws.run();
}

vector<string> SocketBinanceFuture::getSymbolList()
{
    return getBinanceFutureSymbolList();
}

RateData SocketBinanceFuture::getOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    RateData rateData = getBinanceFuturetOHLCV(symbol, timeframe, limit, since);
    LOGD("Get OHLCV {}:{} {} - {} items", broker, symbol, timeframe, (int)rateData.startTime.size());
    return rateData;
}

unordered_map<string, Digit> SocketBinanceFuture::getDigit()
{
    return getBinanceFutureDigits();
}