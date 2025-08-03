#include "socket_bybit_future.h"
#include "common_type.h"
#include "util.h"

SocketBybitFuture::SocketBybitFuture(const int _BATCH_SIZE) : SocketData(_BATCH_SIZE)
{
    broker = "bybit_future";
}

void SocketBybitFuture::on_message(connection_hdl, message_ptr msg)
{
    const string message = msg->get_payload();
    json j = json::parse(message);
    // "{\"topic\":\"kline.1.1000000BABYDOGEUSDT\",\"data\":[{\"start\":1751739720000,\"end\":1751739779999,\"interval\":\"1\",\"open\":\"0.0011086\",\"close\":\"0.00111\",\"high\":\"0.00111\",\"low\":\"0.001108\",\"volume\":\"3509500\",\"turnover\":\"3889.88484\",\"confirm\":false,\"timestamp\":1751739741199}],\"ts\":1751739741199,\"type\":\"snapshot\"}"
    // "{\"topic\":\"tickers.1000000BABYDOGEUSDT\",\"type\":\"snapshot\",\"data\":{\"symbol\":\"1000000BABYDOGEUSDT\",\"tickDirection\":\"ZeroMinusTick\",\"price24hPcnt\":\"-0.039941\",\"lastPrice\":\"0.0014470\",\"prevPrice24h\":\"0.0015072\",\"highPrice24h\":\"0.0015271\",\"lowPrice24h\":\"0.0014362\",\"prevPrice1h\":\"0.0014534\",\"markPrice\":\"0.0014470\",\"indexPrice\":\"0.0014453\",\"openInterest\":\"2319587000\",\"openInterestValue\":\"3356442.39\",\"turnover24h\":\"3790950.2832\",\"volume24h\":\"2566119900.0000\",\"nextFundingTime\":\"1752955200000\",\"fundingRate\":\"0.00005\",\"bid1Price\":\"0.0014464\",\"bid1Size\":\"36600\",\"ask1Price\":\"0.0014467\",\"ask1Size\":\"6000\",\"preOpenPrice\":\"\",\"preQty\":\"\",\"curPreListingPhase\":\"\"},\"cs\":72344544468,\"ts\":1752941629545}"
    // "{\"topic\":\"tickers.1000000BABYDOGEUSDT\",\"type\":\"delta\",\"data\":{\"symbol\":\"1000000BABYDOGEUSDT\",\"bid1Price\":\"0.0014553\",\"bid1Size\":\"39200\",\"ask1Price\":\"0.0014561\",\"ask1Size\":\"10400\"},\"cs\":72346359155,\"ts\":1752942199745}"
    if (!j.contains("type") || !j.contains("topic") || !j.contains("data"))
    {
        return;
    }

    vector<string> topic = split(j["topic"].get<string>(), '.');
    string stream = topic[0];

    string type = j["type"].get<string>();
    if (type != "snapshot" && stream != "tickers")
    {
        LOGE("Invalid message type: {}. message: {}", type, message);
        return;
    }

    json jData = j["data"];

    if (stream == "tickers")
    {
        if (jData.contains("fundingRate"))
        {
            string symbol = jData["symbol"].get<string>();
            lock_guard<mutex> lock(mMutex);
            fundingRates[hashString(symbol)] = stod(jData["fundingRate"].get<string>()) * 100.0;
        }
    }
    else
    {
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

                long long key = hashString(symbol + "_" + tf);
                RateData &rateData = data[key];
                if (rateData.startTime.empty())
                    continue;

                mergeData(rateData, symbol, tf, interval, open, high, low, close, volume, startTime, isFinal, false);
            }
        }
    }
}

void SocketBybitFuture::onSocketConnected(connection_hdl hdl)
{
    for (size_t i = 0; i < symbolList.size(); i += 10)
    {
        vector<string> args;

        for (size_t j = i; j < i + 10 && j < symbolList.size(); ++j)
        {
            args.push_back("kline.1." + symbolList[j]);
            args.push_back("tickers." + symbolList[j]);
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
    LOGI("socket {} init {} symbols", broker, symbolList.size());

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.start_perpetual();

    ws.set_message_handler(bind(&SocketBybitFuture::on_message, this,
                                placeholders::_1,
                                placeholders::_2));
    ws.set_tls_init_handler(bind(&SocketBybitFuture::on_tls_init, this, placeholders::_1));
    ws.set_open_handler(bind(&SocketBybitFuture::onSocketConnected, this, placeholders::_1));
    ws.set_close_handler(bind(&SocketBybitFuture::onSocketClosed, this, placeholders::_1));
    ws.set_fail_handler(bind(&SocketBybitFuture::onSocketClosed, this, placeholders::_1));

    uri = "wss://stream.bybit.com/v5/public/linear";

    reconnectSocket();
    ws.run();
}

vector<string> SocketBybitFuture::getSymbolList()
{
    return getBybitFutureSymbolList();
}

RateData SocketBybitFuture::getOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
{
    RateData rateData = getBybitFutureOHLCV(symbol, timeframe, limit, since);
    LOGD("Get OHLCV {}:{} {} - {} items", broker, symbol, timeframe, (int)rateData.startTime.size());
    return rateData;
}

unordered_map<long long, Digit> SocketBybitFuture::getDigit()
{
    return getBybitFutureDigits();
}