#include "socket_binance.h"
#include "common_type.h"
#include "axios.h"
#include <tbb/task_group.h>
#include "util.h"
#include <Redis.h>

static tbb::task_group task;

void SocketBinance::on_message(connection_hdl, message_ptr msg)
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
        string key = symbol + "_" + tf;
        if (data[key].isBlocking)
        {
            continue;
        }
        mergeData(symbol, tf, interval, open, high, low, close, volume, startTime, isFinal);
    }
}

shared_ptr<boost::asio::ssl::context> SocketBinance::on_tls_init(connection_hdl)
{
    auto ctx = make_shared<boost::asio::ssl::context>(boost::asio::ssl::context::tlsv12_client);
    ctx->set_default_verify_paths();
    return ctx;
}

SocketBinance::SocketBinance(const int _BATCH_SIZE) : BATCH_SIZE(_BATCH_SIZE)
{
    broker = "binance";
    timeframes = {"1m", "5m", "15m", "30m", "1h", "4h", "1d"};
    symbolList = getSymbolList();
    symbolList.resize(1); // Chỉ lấy 1 symbol để test
    // for (const string &tf : timeframes)
    // {
    //     Redis::getInstance().clearList("c_binance_BTCUSDT_" + tf);
    // }

    for (string &symbol : symbolList)
    {
        for (string &tf : timeframes)
        {
            string key = symbol + "_" + tf;
            data[key] = RateData();
            data[key].symbol = symbol;
            data[key].interval = tf;
            data[key].isBlocking = true;
            data[key].isFinal = false;
        }
    }

    connectSocket();
}

void SocketBinance::onSocketConnected(connection_hdl hdl)
{
    LOGI("Socket %s connected", broker.c_str());

    for (int i = 0; i < symbolList.size(); i += BATCH_SIZE)
    {
        vector<std::future<void>> futures;
        int end = min(i + BATCH_SIZE, (int)symbolList.size());

        for (int j = i; j < end; ++j)
        {
            string symbol = symbolList[j];

            futures.emplace_back(std::async(std::launch::async, [this, symbol]()
                                            {
                for(int k=0; k<timeframes.size(); k++)
                {
                    string tf = timeframes[k];
                    string key = symbol + "_" + tf;
                    RateData &rateData = data[key];
                    // data[key]  = getOHLCV(symbol, tf, MAX_CANDLE);
                    if(tf == "1m")
                    {
                        rateData = getOHLCV(symbol, tf, MAX_CANDLE);
                    }
                    else {
                        rateData = getOHLCVFromCache(symbol, tf);
                        if (rateData.startTime.empty()) {
                            rateData = getOHLCV(symbol, tf, MAX_CANDLE);
                        }
                        else{
                            rateData.isBlocking = true;
                            for(int m = k-1; m >= 0; m--) {
                                if(timeframeToNumberMinutes(tf) % timeframeToNumberMinutes(timeframes[m]) != 0){
                                    continue;
                                }
                                RateData &smaller = data[symbol + "_" + timeframes[m]];
                                int size = smaller.startTime.size();
                                int l = 0;
                                while(l < size && smaller.startTime[l] >= rateData.startTime[0]) {
                                    l++;
                                }
                                l--;
                                while(l >= 0){
                                    long long startTime = smaller.startTime[l];
                                    double open = smaller.open[l];
                                    double high = smaller.high[l];
                                    double low = smaller.low[l];
                                    double close = smaller.close[l];
                                    double volume = smaller.volume[l];
                                    mergeData(symbol, tf, timeframes[m], open, high, low, close, volume, startTime, true);
                                    l--;
                                }
                            }
                            adjustData(rateData);
                            if (!isValidData(rateData)) {
                                LOGE("Invalid data for %s %s", symbol.c_str(), tf.c_str());
                                rateData = getOHLCV(symbol, tf, MAX_CANDLE);
                            }
                        }
                        rateData.isBlocking = false;
                    }
                    updateCache(rateData);

                    LOGD("Get OHLCV %s %s - %d items", symbol.c_str(), tf.c_str(), (int)rateData.startTime.size());
                } }));
        }

        // Chờ batch này xong
        for (auto &f : futures)
            f.get();

        // (Tùy chọn) nghỉ một chút để tránh rate limit
        SLEEP_FOR(5000);
    }
}

bool SocketBinance::isValidData(const RateData &rateData)
{
    int length = rateData.startTime.size();
    if (length <= 1)
    {
        return true;
    }
    long long timeIntervalMiliseconds = timeframeToNumberMiliseconds(rateData.interval);
    for (int i = 1; i < length; i++)
    {
        if (rateData.startTime[i - 1] - rateData.startTime[i] != timeIntervalMiliseconds)
        {
            return false;
        }
    }
    return true;
}

void SocketBinance::connectSocket()
{
    LOGI("socket %s init %lu symbols", broker.c_str(), symbolList.size());

    ws.set_access_channels(websocketpp::log::alevel::none);
    ws.clear_access_channels(websocketpp::log::alevel::all);

    ws.init_asio();
    ws.start_perpetual(); // important

    ws.set_message_handler(std::bind(&SocketBinance::on_message, this,
                                     std::placeholders::_1,
                                     std::placeholders::_2));
    ws.set_tls_init_handler(std::bind(&SocketBinance::on_tls_init, this, std::placeholders::_1));
    ws.set_open_handler(std::bind(&SocketBinance::onSocketConnected, this, std::placeholders::_1));

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

RateData SocketBinance::getOHLCV(const string &symbol, const string &timeframe, int limit, long long since)
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
        rateData.startTime.push_front(item[0].get<long long>());
        rateData.open.push_front(stod(item[1].get<string>()));
        rateData.high.push_front(stod(item[2].get<string>()));
        rateData.low.push_front(stod(item[3].get<string>()));
        rateData.close.push_front(stod(item[4].get<string>()));
        rateData.volume.push_front(stod(item[5].get<string>()));
    }

    return rateData;
}

RateData SocketBinance::getOHLCVFromCache(const string &symbol, const string &timeframe)
{
    string broker = "c_binance";
    string key = broker + "_" + symbol + "_" + timeframe;
    vector<string> ohlcv = Redis::getInstance().getList(key);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;
    rateData.isFinal = true;
    for (const string &item : ohlcv)
    {
        // item: startTime_open_high_low_close_volume
        vector<string> parts = split(item, '_');
        if (parts.size() != 6)
        {
            LOGE("Invalid OHLCV data format: %s", item.c_str());
            break;
        }
        rateData.startTime.push_back(stoll(parts[0]));
        rateData.open.push_back(stod(parts[1]));
        rateData.high.push_back(stod(parts[2]));
        rateData.low.push_back(stod(parts[3]));
        rateData.close.push_back(stod(parts[4]));
        rateData.volume.push_back(stod(parts[5]));
    }

    LOGD("Get OHLCV from cache %s %s - %d items", symbol.c_str(), timeframe.c_str(), (int)rateData.startTime.size());
    return rateData;
}

void SocketBinance::updateCache(const RateData &rateData)
{
    if (rateData.interval == "1m" || rateData.startTime.empty())
    {
        return;
    }

    string broker = "c_binance";
    string symbol = rateData.symbol;
    string timeframe = rateData.interval;

    string key = broker + "_" + symbol + "_" + timeframe;

    int size = Redis::getInstance().size(key);
    if (size == 0)
    {
        for (int i = rateData.startTime.size() - 1; i >= 0; i--)
        {
            // item: startTime_open_high_low_close_volume
            string item = to_string(rateData.startTime[i]) + "_" +
                          to_string(rateData.open[i]) + "_" +
                          to_string(rateData.high[i]) + "_" +
                          to_string(rateData.low[i]) + "_" +
                          to_string(rateData.close[i]) + "_" +
                          to_string(rateData.volume[i]);
            if (!Redis::getInstance().pushFront(key, item))
            {
                LOGE("Failed to update cache for %s %s", symbol.c_str(), timeframe.c_str());
                return;
            };
        }
        LOGD("Update cache %s %s - %d items", symbol.c_str(), timeframe.c_str(), (int)rateData.startTime.size());
    }
    else
    {
        long long lastTime = stoll(split(Redis::getInstance().front(key), '_')[0]);
        int i = 0;
        while (i < size && rateData.startTime[i] > lastTime)
        {
            i++;
        }
        i--;
        int cnt = 0;
        while (i >= 0)
        {
            // item: startTime_open_high_low_close_volume
            string item = to_string(rateData.startTime[i]) + "_" +
                          to_string(rateData.open[i]) + "_" +
                          to_string(rateData.high[i]) + "_" +
                          to_string(rateData.low[i]) + "_" +
                          to_string(rateData.close[i]) + "_" +
                          to_string(rateData.volume[i]);
            if (i > 0 || rateData.isFinal)
            {
                if (!Redis::getInstance().pushFront(key, item))
                {
                    LOGE("Failed to update cache for %s %s", symbol.c_str(), timeframe.c_str());
                    return;
                }

                cnt++;
            }
            i--;
        }
        LOGD("Update cache %s %s - %d items", symbol.c_str(), timeframe.c_str(), cnt);
    }
    while (Redis::getInstance().size(key) > MAX_CANDLE)
    {
        Redis::getInstance().popBack(key);
    }
}

void SocketBinance::adjustData(RateData &rateData)
{
    if (rateData.open.size() > MAX_CANDLE)
    {
        rateData.open.pop_back();
        rateData.high.pop_back();
        rateData.low.pop_back();
        rateData.close.pop_back();
        rateData.volume.pop_back();
        rateData.startTime.pop_back();
    }
}

void SocketBinance::mergeData(const string &symbol, string &timeframe, string &currentTF, double open, double high, double low, double close, double volume, long long startTime, bool isFinal)
{
    if (timeframeToNumberMinutes(timeframe) % timeframeToNumberMinutes(currentTF) != 0)
    {
        return;
    }
    string key = symbol + "_" + timeframe;

    RateData &rateData = data[key];

    long long rateStartTime = getStartTime(timeframe, startTime);
    long long timeintervalMiliseconds = timeframeToNumberMiliseconds(timeframe);

    if (rateData.open.empty())
    {
        return;
    }

    if (rateData.startTime[0] == rateStartTime)
    {
        rateData.high[0] = max(rateData.high[0], high);
        rateData.low[0] = min(rateData.low[0], low);
        rateData.close[0] = close;
        rateData.volume[0] += isFinal ? volume : 0;

        if (!rateData.isFinal && isFinal && checkFinal(timeframe, startTime, currentTF))
        {
            rateData.isFinal = true;
            onCloseCandle(symbol, timeframe, rateData);
        }
    }
    else if (rateStartTime - rateData.startTime[0] == timeintervalMiliseconds)
    {
        if (!rateData.isFinal)
        {
            rateData.isFinal = true;
            LOGI("Force final %s %s %s", symbol.c_str(), timeframe.c_str(), toTimeString(rateStartTime).c_str());
            onCloseCandle(symbol, timeframe, rateData);
        }

        rateData.open.push_front(open);
        rateData.high.push_front(high);
        rateData.low.push_front(low);
        rateData.close.push_front(close);
        rateData.volume.push_front(volume);
        rateData.startTime.push_front(rateStartTime);

        adjustData(rateData);
    }
    else
    {
        LOGI("Merge data fail");
    }
}

void SocketBinance::onCloseCandle(const string &symbol, string &timeframe, RateData &rateData)
{
    // if (rateData.startTime.size() < 15)
    //     return;

    long long startTime = rateData.startTime.back();
    double open = rateData.open.back();
    double high = rateData.high.back();
    double low = rateData.low.back();
    double close = rateData.close.back();
    double volume = rateData.volume.back();

    LOGI("%s %s %lld %f %f %f %f %f", symbol.c_str(), timeframe.c_str(), startTime, open, high, low, close, volume);

    updateCache(rateData);
}