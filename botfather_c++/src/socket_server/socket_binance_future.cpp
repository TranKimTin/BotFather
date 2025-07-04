#include "socket_binance_future.h"
#include "common_type.h"
#include "axios.h"
#include "util.h"
#include "Redis.h"
#include "ThreadPool.h"
#include "Worker.h"
#include "MySQLConnector.h"
#include "Timer.h"

SocketBinanceFuture::SocketBinanceFuture(const int _BATCH_SIZE) : SocketData(_BATCH_SIZE)
{
    broker = "binance_future";
}

void SocketBinanceFuture::on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    json j = json::parse(message);
    // {"stream":"slfusdt@kline_1m","data":{"e":"kline","E":1745689546800,"s":"SLFUSDT","k":{"t":1745689500000,"T":1745689559999,"s":"SLFUSDT","i":"1m","f":13562205,"L":13562210,"o":"0.20800000","c":"0.20810000","h":"0.20810000","l":"0.20800000","v":"624.60000000","n":6,"x":false,"q":"129.95848000","V":"624.60000000","Q":"129.95848000","B":"0"}}}
    auto jdata = j["data"];
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

void SocketBinanceFuture::connectSocket()
{
    LOGI("socket %s init %lu symbols", broker.c_str(), symbolList.size());

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.start_perpetual();

    ws.set_message_handler(bind(&SocketBinanceFuture::on_message, this,
                                placeholders::_1,
                                placeholders::_2));
    ws.set_tls_init_handler(bind(&SocketBinanceFuture::on_tls_init, this, placeholders::_1));
    ws.set_open_handler(bind(&SocketBinanceFuture::onSocketConnected, this, placeholders::_1));

    string uri = "wss://fstream.binance.com/stream?streams=";
    for (int i = 0; i < symbolList.size(); i++)
    {
        uri += (toLowerCase(symbolList[i]) + "@kline_1m");
        if (i < symbolList.size() - 1)
        {
            uri += "/";
        }
    }

    websocketpp::lib::error_code ec;
    WebSocket::connection_ptr con = ws.get_connection(uri, ec);
    if (ec)
    {
        LOGE("Socket %s connect error: %s", broker.c_str(), ec.message().c_str());
        return;
    }

    ws.connect(con);
    ws.run();
}

vector<string> SocketBinanceFuture::getSymbolList()
{
    string url = "https://fapi.binance.com/fapi/v1/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    for (const auto &s : j["symbols"])
    {
        string symbol = s["symbol"];
        string status = s["status"];

        if (status != "TRADING" || !endsWith(symbol, "USDT") || symbol == "USDCUSDT" || symbol == "TUSDUSDT" || symbol == "DAIUSDT")
            continue;
        symbols.push_back(symbol);
    }
    return symbols;
}

RateData SocketBinanceFuture::getOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    string url = "https://fapi.binance.com/fapi/v1/klines?symbol=" + symbol + "&interval=" + timeframe + "&limit=" + to_string(limit);
    if (since > 0)
    {
        url += "&startTime=" + to_string(since);
    }
    string response = Axios::get(url);
    json j = json::parse(response);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;

    for (const auto &item : j)
    {
        rateData.startTime.push_front(item[0].get<long long>());
        rateData.open.push_front(stod(item[1].get<string>()));
        rateData.high.push_front(stod(item[2].get<string>()));
        rateData.low.push_front(stod(item[3].get<string>()));
        rateData.close.push_front(stod(item[4].get<string>()));
        rateData.volume.push_front(stod(item[5].get<string>()));
    }

    LOGD("Get OHLCV %s %s - %d items", symbol.c_str(), timeframe.c_str(), (int)rateData.startTime.size());
    return rateData;
}
