#include "socket_okx.h"
#include "common_type.h"
#include "util.h"

SocketOkx::SocketOkx(const int _BATCH_SIZE) : SocketData(_BATCH_SIZE)
{
    broker = "okx";
}

void SocketOkx::on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    if (message == "pong")
        return;

    json j = json::parse(message);
    // "{\"arg\":{\"channel\":\"candle1m\",\"instId\":\"BTC-USDT\"},\"data\":[[\"1751908140000\",\"107965.4\",\"107967.9\",\"107950\",\"107950\",\"0.04083125\",\"4408.011920548\",\"4408.011920548\",\"0\"]]}"

    if (!j.contains("data") || j["arg"]["channel"].get<string>() != "candle1m")
        return;

    json jData = j["data"];
    string symbol = j["arg"]["instId"];
    string interval = "1m";

    for (auto const &candle : jData)
    {
        long long startTime = stoll(candle[0].get<string>());
        double open = stod(candle[1].get<string>());
        double high = stod(candle[2].get<string>());
        double low = stod(candle[3].get<string>());
        double close = stod(candle[4].get<string>());
        double volume = stod(candle[5].get<string>());
        bool isFinal = (candle[8].get<string>() == "1") ? true : false;

        for (auto tf : timeframes)
        {
            lock_guard<mutex> lock(mMutex);

            long long key = hashString(symbol + "_" + tf);
            RateData &rateData = data[key];
            if (rateData.startTime.empty())
                continue;

            mergeData(rateData, symbol, tf, interval, open, high, low, close, volume, startTime, isFinal, false);
        }
    }
}

void SocketOkx::onSocketConnected(connection_hdl hdl)
{
    for (size_t i = 0; i < symbolList.size(); i += 10)
    {
        json args = json::array();

        for (size_t j = i; j < i + 10 && j < symbolList.size(); ++j)
        {
            args.push_back({{"channel", "candle1m"},
                            {"instId", symbolList[j]}});
        }

        json payload = {
            {"op", "subscribe"},
            {"args", args}};

        ws.send(hdl, payload.dump(), websocketpp::frame::opcode::text);

        // SLEEP_FOR(50);
    }

    SocketData::onSocketConnected(hdl);
}

void SocketOkx::connectSocket()
{
    LOGI("socket {} init {} symbols", broker, symbolList.size());

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.start_perpetual();

    ws.set_message_handler(bind(&SocketOkx::on_message, this,
                                placeholders::_1,
                                placeholders::_2));
    ws.set_tls_init_handler(bind(&SocketOkx::on_tls_init, this, placeholders::_1));
    ws.set_open_handler(bind(&SocketOkx::onSocketConnected, this, placeholders::_1));
    ws.set_close_handler(bind(&SocketOkx::onSocketClosed, this, std::placeholders::_1));
    ws.set_fail_handler(bind(&SocketOkx::onSocketClosed, this, std::placeholders::_1));

    uri = "wss://ws.okx.com:8443/ws/v5/business";

    reconnectSocket();
    ws.run();
}

vector<string> SocketOkx::getSymbolList()
{
    return getOkxSymbolList();
}

RateData SocketOkx::getOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    RateData rateData = getOkxOHLCV(symbol, timeframe, limit, since);
    LOGD("Get OHLCV {}:{} {} - {} items", broker, symbol, timeframe, rateData.startTime.size());
    return rateData;
}

unordered_map<long long, Digit> SocketOkx::getDigit()
{
    return getOkxDigits();
}