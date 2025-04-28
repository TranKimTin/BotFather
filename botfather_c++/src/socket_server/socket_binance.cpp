#include "socket_binance.h"
#include "common_type.h"
#include "axios.h"
#include <tbb/task_group.h>
#include "util.h"

static tbb::task_group task;

void SocketBinance::on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    json j = json::parse(message);
    // {"stream":"slfusdt@kline_1m","data":{"e":"kline","E":1745689546800,"s":"SLFUSDT","k":{"t":1745689500000,"T":1745689559999,"s":"SLFUSDT","i":"1m","f":13562205,"L":13562210,"o":"0.20800000","c":"0.20810000","h":"0.20810000","l":"0.20800000","v":"624.60000000","n":6,"x":false,"q":"129.95848000","V":"624.60000000","Q":"129.95848000","B":"0"}}}
    auto data = j["data"];
    auto kline = data["k"];

    string symbol = data["s"].get<string>();
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
        mergeData(symbol, tf, interval, open, high, low, close, volume, startTime, isFinal);
    }
}

void SocketBinance::mergeData(string &symbol, string &timeframe, string &currentTF, double open, double high, double low, double close, double volume, long long startTime, bool isFinal)
{
    if (data.find(symbol) == data.end())
    {
        data[symbol] = RateData();
        data[symbol].symbol = symbol;
        data[symbol].interval = timeframe;
    }

    RateData &rateData = data[symbol];

    if (rateData.open.empty())
    {
        rateData.open.push_front(open);
        rateData.high.push_front(high);
        rateData.low.push_front(low);
        rateData.close.push_front(close);
        rateData.volume.push_front(volume);
        rateData.startTime.push_front(getStartTime(timeframe, startTime));
        rateData.isFinal = isFinal && checkFinal(timeframe, startTime, currentTF);
        return;
    }

    if (rateData.startTime[0] == startTime)
    {
        rateData.high[0] = max(rateData.high[0], high);
        rateData.low[0] = min(rateData.low[0], low);
        rateData.close[0] = close;
        rateData.volume[0] += isFinal ? volume : 0;

        if (!rateData.isFinal && isFinal && checkFinal(timeframe, startTime, currentTF))
        {
            // force onclose candle
            LOGI("force onclose candle");
        }
    }
    else if (getStartTime(timeframe, startTime) > rateData.startTime[0])
    {
        rateData.open.push_front(open);
        rateData.high.push_front(high);
        rateData.low.push_front(low);
        rateData.close.push_front(close);
        rateData.volume.push_front(volume);
        rateData.startTime.push_front(getStartTime(timeframe, startTime));
    }
    else
    {
        LOGI("Merge data fail");
    }
}

shared_ptr<boost::asio::ssl::context> SocketBinance::on_tls_init(connection_hdl)
{
    auto ctx = make_shared<boost::asio::ssl::context>(boost::asio::ssl::context::tlsv12_client);
    ctx->set_default_verify_paths();
    return ctx;
}

SocketBinance::SocketBinance()
{
    broker = "binance";
    timeframes = {"1m", "5m", "15m", "30m", "1h", "4h", "1d"};
    symbolList = getSymbolList();

    connectSocket();
}

void SocketBinance::connectSocket()
{
    LOGI("socket %s init %d symbols", broker.c_str(), symbolList.size());

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.start_perpetual(); // important

    ws.set_message_handler(std::bind(&SocketBinance::on_message, this,
                                     std::placeholders::_1,
                                     std::placeholders::_2));
    ws.set_tls_init_handler(std::bind(&SocketBinance::on_tls_init, this, std::placeholders::_1));
    ws.set_open_handler([this](connection_hdl hdl)
                        { LOGI("Socket %s connected", broker.c_str()); });

    string uri = "wss://stream.binance.com:9443/stream?streams=";
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

vector<string> SocketBinance::getSymbolList()
{
    string url = "https://api.binance.com/api/v3/exchangeInfo";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    for (const auto &s : j["symbols"])
    {
        if (!endsWith(s["symbol"], "USDT"))
            continue;
        symbols.push_back(s["symbol"]);
    }
    return symbols;
}

RateData SocketBinance::getOHLCV(string &symbol, string &timeframe, int limit, long long since)
{
    string url = "https://api.binance.com/api/v3/klines?symbol=" + symbol + "&interval=" + timeframe + "&limit=" + to_string(limit);
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
        rateData.startTime.push_back(item[0].get<long long>());
        rateData.open.push_back(item[1].get<double>());
        rateData.high.push_back(item[2].get<double>());
        rateData.low.push_back(item[3].get<double>());
        rateData.close.push_back(item[4].get<double>());
        rateData.volume.push_back(item[5].get<double>());
    }

    return rateData;
}
