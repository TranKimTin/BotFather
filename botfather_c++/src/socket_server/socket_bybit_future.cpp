#include "socket_bybit_future.h"
#include "common_type.h"
#include "axios.h"
#include "util.h"
#include "Redis.h"
#include "ThreadPool.h"
#include "Worker.h"
#include "MySQLConnector.h"
#include "Timer.h"

SocketBybitFuture::SocketBybitFuture(const int _BATCH_SIZE) : SocketData(_BATCH_SIZE)
{
    broker = "bybit_future";
}

void SocketBybitFuture::on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    json j = json::parse(message);
    // "{\"topic\":\"kline.1.1000000BABYDOGEUSDT\",\"data\":[{\"start\":1751739720000,\"end\":1751739779999,\"interval\":\"1\",\"open\":\"0.0011086\",\"close\":\"0.00111\",\"high\":\"0.00111\",\"low\":\"0.001108\",\"volume\":\"3509500\",\"turnover\":\"3889.88484\",\"confirm\":false,\"timestamp\":1751739741199}],\"ts\":1751739741199,\"type\":\"snapshot\"}"

    string type = j["type"].get<string>();
    if (type != "snapshot")
    {
        LOGE("Invalid message type: %s", type.c_str());
        return;
    }

    vector<string> topic = split(j["topic"].get<string>(), '.');
    json jData = j["data"];
    string symbol = topic[2];

    for (json &candle : jData)
    {
        string interval = candle["interval"].get<string>();
        interval.push_back('m'); // Ensure interval is in minutes format

        long long startTime = candle["start"].get<long long>();
        double open = stod(candle["open"].get<string>());
        double high = stod(candle["high"].get<string>());
        double low = stod(candle["low"].get<string>());
        double close = stod(candle["close"].get<string>());
        double volume = stod(candle["volume"].get<string>());
        bool isFinal = candle["confirm"].get<bool>();

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

void SocketBybitFuture::onSocketConnected(connection_hdl hdl)
{
    for (size_t i = 0; i < symbolList.size(); i += 10)
    {
        std::vector<std::string> args;

        for (size_t j = i; j < i + 10 && j < symbolList.size(); ++j)
        {
            args.push_back("kline.1." + symbolList[j]);
        }

        json payload = {
            {"op", "subscribe"},
            {"args", args}};

        ws.send(hdl, payload.dump(), websocketpp::frame::opcode::text);

        // SLEEP_FOR(50);
    }

    SocketData::onSocketConnected(hdl);
}

void SocketBybitFuture::connectSocket()
{
    LOGI("socket %s init %lu symbols", broker.c_str(), symbolList.size());

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.start_perpetual();

    ws.set_message_handler(bind(&SocketBybitFuture::on_message, this,
                                placeholders::_1,
                                placeholders::_2));
    ws.set_tls_init_handler(bind(&SocketBybitFuture::on_tls_init, this, placeholders::_1));
    ws.set_open_handler(bind(&SocketBybitFuture::onSocketConnected, this, placeholders::_1));

    string uri = "wss://stream.bybit.com/v5/public/linear";

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

vector<string> SocketBybitFuture::getSymbolList()
{
    string url = "https://api.bybit.com/v5/market/tickers?category=linear";
    string response = Axios::get(url);
    json j = json::parse(response);
    vector<string> symbols;
    auto list = j["result"]["list"];
    for (const auto &s : list)
    {
        double volume24h = stod(s["volume24h"].get<string>());
        string symbol = s["symbol"].get<string>();

        if (volume24h <= 0 || !endsWith(symbol, "USDT") || symbol == "USDCUSDT" || symbol == "TUSDUSDT" || symbol == "DAIUSDT")
            continue;

        symbols.push_back(symbol);
    }
    return symbols;
}

RateData SocketBybitFuture::getOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    string tf = timeframe;
    if (timeframe == "1m" || timeframe == "3m" || timeframe == "5m" || timeframe == "15m" || timeframe == "30m")
    {
        tf.pop_back();
    }
    else if (timeframe == "1h" || timeframe == "2h" || timeframe == "4h" || timeframe == "6h" || timeframe == "8h" || timeframe == "12h")
    {
        tf.pop_back();
        tf = to_string(stoi(tf) * 60);
    }
    else if (timeframe == "1d")
    {
        tf = "D";
    }

    string url = StringFormat("https://api.bybit.com/v5/market/kline?category=linear&symbol=%s&interval=%s&limit=%d", symbol.c_str(), tf.c_str(), limit);
    if (since)
        url += StringFormat("&start=%lld", since);

    string response = Axios::get(url);
    json j = json::parse(response);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;

    auto list = j["result"]["list"];
    for (const auto &item : list)
    {
        rateData.startTime.push_back(stoll(item[0].get<string>()));
        rateData.open.push_back(stod(item[1].get<string>()));
        rateData.high.push_back(stod(item[2].get<string>()));
        rateData.low.push_back(stod(item[3].get<string>()));
        rateData.close.push_back(stod(item[4].get<string>()));
        rateData.volume.push_back(stod(item[5].get<string>()));
    }

    LOGD("Get OHLCV %s:%s %s - %d items", broker.c_str(), symbol.c_str(), timeframe.c_str(), (int)rateData.startTime.size());

    return rateData;
}
