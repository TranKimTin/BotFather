#include "socket_bybit.h"
#include "common_type.h"
#include "util.h"

SocketBybit::SocketBybit(const int _BATCH_SIZE) : SocketData(_BATCH_SIZE)
{
    broker = "bybit";
}

void SocketBybit::on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    json j = json::parse(message);
    // "{\"topic\":\"kline.1.1000000BABYDOGEUSDT\",\"data\":[{\"start\":1751739720000,\"end\":1751739779999,\"interval\":\"1\",\"open\":\"0.0011086\",\"close\":\"0.00111\",\"high\":\"0.00111\",\"low\":\"0.001108\",\"volume\":\"3509500\",\"turnover\":\"3889.88484\",\"confirm\":false,\"timestamp\":1751739741199}],\"ts\":1751739741199,\"type\":\"snapshot\"}"

    if (!j.contains("type") || !j.contains("topic") || !j.contains("data"))
    {
        return;
    }

    string type = j["type"].get<string>();
    if (type != "snapshot")
    {
        LOGE("Invalid message type: {}", type);
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

void SocketBybit::onSocketConnected(connection_hdl hdl)
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

void SocketBybit::connectSocket()
{
    LOGI("socket {} init {} symbols", broker, symbolList.size());

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.start_perpetual();

    ws.set_message_handler(bind(&SocketBybit::on_message, this,
                                placeholders::_1,
                                placeholders::_2));
    ws.set_tls_init_handler(bind(&SocketBybit::on_tls_init, this, placeholders::_1));
    ws.set_open_handler(bind(&SocketBybit::onSocketConnected, this, placeholders::_1));
    ws.set_close_handler(bind(&SocketBybit::onSocketClosed, this, std::placeholders::_1));
    ws.set_fail_handler(bind(&SocketBybit::onSocketClosed, this, std::placeholders::_1));

    uri = "wss://stream.bybit.com/v5/public/spot";

    reconnectSocket();
    ws.run();
}

vector<string> SocketBybit::getSymbolList()
{
    return getBybitSymbolList();
}

RateData SocketBybit::getOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    RateData rateData = getBybitOHLCV(symbol, timeframe, limit, since);
    LOGD("Get OHLCV {}:{} {} - {} items", broker, symbol, timeframe, rateData.startTime.size());
    return rateData;
}

unordered_map<string, Digit> SocketBybit::getDigit()
{
    return getBybitDigits();
}