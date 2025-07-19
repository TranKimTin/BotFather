#include "socket_data.h"
#include "util.h"
#include "thread_pool.h"
#include "worker.h"
#include "redis.h"
#include <tbb/task_group.h>

static tbb::task_group task;

SocketData::SocketData(const int _BATCH_SIZE) : BATCH_SIZE(_BATCH_SIZE), firstConnection(true)
{
    timeframes = {"1m", "5m", "15m", "30m", "1h", "4h", "1d"};
}

void SocketData::init()
{
    {
        lock_guard<mutex> lock(mMutex);
        symbolList = getSymbolList();
        // if (broker == "okx")
        // {
        //     symbolList = {"BTC-USDT"};
        // }
        // else
        // {
        //     symbolList = {"BTCUSDT"};
        // }

        digits = getDigit();
        for (string &symbol : symbolList)
        {
            for (string &tf : timeframes)
            {
                string key = symbol + "_" + tf;
                data[key] = RateData();
                data[key].symbol = symbol;
                data[key].interval = tf;
            }
        }
    }

    connectSocket();
}

void SocketData::onCloseCandle(const string &symbol, string &timeframe, RateData &rateData)
{
    if (timeframe == "1m")
        return;

    if (rateData.startTime.size() < 15)
        return;

    if (!botList)
        return;

    vector<double> open(rateData.open.begin(), rateData.open.end());
    vector<double> high(rateData.high.begin(), rateData.high.end());
    vector<double> low(rateData.low.begin(), rateData.low.end());
    vector<double> close(rateData.close.begin(), rateData.close.end());
    vector<double> volume(rateData.volume.begin(), rateData.volume.end());
    vector<long long> startTime(rateData.startTime.begin(), rateData.startTime.end());

    if (digits.find(symbol) == digits.end())
    {
        LOGE("No digit found for symbol {}:{}", broker, symbol);
        throw runtime_error("No digit found for symbol " + symbol);
    }

    shared_ptr<Worker> worker = make_shared<Worker>(botList, broker, symbol, timeframe, move(open), move(high), move(low), move(close), move(volume), move(startTime), digits[symbol]);

    task.run([worker, this, timeframe]()
             { worker->run(); });

    this->updateCache(this->data[symbol + "_" + timeframe]);
}

void SocketData::mergeData(RateData &rateData, const string &symbol, string &timeframe, string &currentTF, double open, double high, double low, double close, double volume, long long startTime, bool isFinal, bool ignoreClose)
{
    if (timeframeToNumberMinutes(timeframe) % timeframeToNumberMinutes(currentTF) != 0)
    {
        return;
    }

    long long rateStartTime = getStartTime(timeframe, startTime);

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

        if (!ignoreClose && isFinal && checkFinal(timeframe, startTime, currentTF))
        {
            onCloseCandle(symbol, timeframe, rateData);
        }
    }
    else if (rateStartTime > rateData.startTime[0])
    {
        // if (!ignoreClose)
        // {
        //     LOGI("Force final {} {} {}", symbol, timeframe, toTimeString(rateStartTime));
        //     onCloseCandle(symbol, timeframe, rateData);
        // }

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
        LOGI("Merge data fail {}:{} {} {}", broker, symbol, timeframe, currentTF);
    }
}

void SocketData::adjustData(RateData &rateData)
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

void SocketData::updateCache(const RateData &rateData)
{
    if (rateData.interval == "1m" || rateData.startTime.empty())
    {
        return;
    }

    ThreadPool::getInstance().enqueue([this, &rateData]()
                                      {
        string symbol = rateData.symbol;
        string timeframe = rateData.interval;

        string key = broker + "_" + symbol + "_" + timeframe;

        int size = Redis::getInstance().size(key);
        if (size == 0)
        {
            vector<string> v;
            {
                lock_guard<mutex> lock(this->mMutex);
                for (int i = 1; i < rateData.startTime.size(); ++i)
                {
                    // item: startTime_open_high_low_close_volume
                    string item = to_string(rateData.startTime[i]) + "_" +
                                to_string(rateData.open[i]) + "_" +
                                to_string(rateData.high[i]) + "_" +
                                to_string(rateData.low[i]) + "_" +
                                to_string(rateData.close[i]) + "_" +
                                to_string(rateData.volume[i]);
                    v.push_back(item);
                }
            }
            
            if (!Redis::getInstance().pushBack(key, v))
            {
                LOGE("Failed to update cache for {}:{} {}",broker, symbol, timeframe);
                return;
            };
            LOGD("Update cache {} {} {} - {} items",broker, symbol, timeframe, v.size());
        }
        else
        {
            vector<string> v;
            long long lastTime = stoll(split(Redis::getInstance().front(key), '_')[0]);
            {
                lock_guard<mutex> lock(this->mMutex);

                int i = 0;
                while (i < size && rateData.startTime[i] > lastTime)
                {
                    i++;
                }
                i--;
                while (i > 0)
                {
                    // item: startTime_open_high_low_close_volume
                    string item = to_string(rateData.startTime[i]) + "_" +
                                to_string(rateData.open[i]) + "_" +
                                to_string(rateData.high[i]) + "_" +
                                to_string(rateData.low[i]) + "_" +
                                to_string(rateData.close[i]) + "_" +
                                to_string(rateData.volume[i]);
                    v.push_back(item);
                    i--;
                }
            }
            
            if (!v.empty())
            {
                if (!Redis::getInstance().pushFront(key, v))
                {
                    LOGE("Failed to update cache for {}:{} {}",broker,  symbol, timeframe);
                    return;
                }
                LOGD("Update cache {} {} {} - {} items", broker, symbol, timeframe, v.size());
            }
        }
        while (Redis::getInstance().size(key) > MAX_CANDLE)
        {
            Redis::getInstance().popBack(key);
        } });
}

bool SocketData::isValidData(const RateData &rateData)
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

RateData SocketData::getOHLCVFromCache(const string &symbol, const string &timeframe)
{
    string key = broker + "_" + symbol + "_" + timeframe;
    vector<string> ohlcv = Redis::getInstance().getList(key);

    RateData rateData;
    rateData.symbol = symbol;
    rateData.interval = timeframe;

    for (const string &item : ohlcv)
    {
        // item: startTime_open_high_low_close_volume
        vector<string> parts = split(item, '_');
        if (parts.size() != 6)
        {
            LOGE("Invalid OHLCV data format: {}", item);
            break;
        }
        rateData.startTime.push_back(stoll(parts[0]));
        rateData.open.push_back(stod(parts[1]));
        rateData.high.push_back(stod(parts[2]));
        rateData.low.push_back(stod(parts[3]));
        rateData.close.push_back(stod(parts[4]));
        rateData.volume.push_back(stod(parts[5]));
    }

    LOGD("Get OHLCV from cache {} {} {} - {} items", broker, symbol, timeframe, rateData.startTime.size());
    return rateData;
}

shared_ptr<boost::asio::ssl::context> SocketData::on_tls_init(connection_hdl)
{
    auto ctx = make_shared<boost::asio::ssl::context>(boost::asio::ssl::context::tlsv12_client);
    ctx->set_default_verify_paths();
    return ctx;
}

void SocketData::onSocketConnected(connection_hdl hdl)
{
    if (firstConnection)
    {
        firstConnection = false;
        LOGI("Socket {} connected", broker);

        thread t([this]()
                 {
        for (int i = 0; i < symbolList.size(); i += BATCH_SIZE)
        {
            vector<future<int>> futures;
            int end = min(i + BATCH_SIZE, (int)symbolList.size());

            for (int j = i; j < end; ++j)
            {
                string symbol = symbolList[j];

                futures.emplace_back(async(launch::async, [this, symbol]()
                                                {
                    int cnt = 0;
                    for(int k=0; k<timeframes.size(); k++)
                    {
                        string tf = timeframes[k];
                        RateData rateData;
                        if(tf == "1m")
                        {
                            rateData = getOHLCV(symbol, tf, MAX_CANDLE);
                            cnt++;
                        }
                        else {
                            rateData = getOHLCVFromCache(symbol, tf);
                            if (rateData.startTime.empty()) {
                                rateData = getOHLCV(symbol, tf, MAX_CANDLE);
                                cnt++;
                                string key = broker + "_" + symbol + "_" + tf;
                                Redis::getInstance().clearList(key);
                            }
                            else{
                                for(int m = k-1; m >= 0; m--) {
                                    if(timeframeToNumberMinutes(tf) % timeframeToNumberMinutes(timeframes[m]) != 0){
                                        continue;
                                    }

                                    lock_guard<mutex> lock(mMutex);
                                    RateData &smaller = data[symbol + "_" + timeframes[m]];
                                    int size = smaller.startTime.size();
                                    if(size == 0 || smaller.startTime.back() > rateData.startTime[0]) {
                                        rateData = getOHLCV(symbol, tf, MAX_CANDLE);
                                        cnt++;
                                        break;
                                    }

                                    int l = 0;
                                    while(l < size && smaller.startTime[l] > rateData.startTime[0]) {
                                        l++;
                                    }
                                    while(l >= 0){
                                        long long startTime = smaller.startTime[l];
                                        double open = smaller.open[l];
                                        double high = smaller.high[l];
                                        double low = smaller.low[l];
                                        double close = smaller.close[l];
                                        double volume = smaller.volume[l];
                                        mergeData(rateData, symbol, tf, timeframes[m], open, high, low, close, volume, startTime, l > 0, true);
                                        l--;
                                    }
                                }
                                adjustData(rateData);
                                if (!isValidData(rateData)) {
                                    LOGE("Invalid data for {}:{} {}", broker, symbol, tf);
                                    rateData = getOHLCV(symbol, tf, MAX_CANDLE);
                                    cnt++;
                                    string key = broker + "_" + symbol + "_" + tf;
                                    Redis::getInstance().clearList(key);
                                }
                            }
                        }

                        
                        string key = symbol + "_" + tf;

                        {
                            lock_guard<mutex> lock(mMutex);
                            data[key] = rateData;
                            updateCache(data[key]);
                        }
                        
                    }
                    return cnt;
                 }));
            }

            // Chờ batch này xong
            int cnt = 0;
            for (auto &f : futures){
                try {
                    cnt += f.get();
                } 
                catch (const exception& e) {
                    cout << "Init data error: " << e.what() << "\n";
                }
            }
            
            LOGD("{}: Init {} / {}. Get from cache {} times ({:.1f}%)", broker, end, symbolList.size(), cnt, end * 100.0 / symbolList.size());

            SLEEP_FOR(cnt * 5000 / 100 + 100);
        } });

        t.detach();
    }
    else
    {
        LOGI("Socket {} reconnected", broker);
    }
}

void SocketData::reconnectSocket()
{
    websocketpp::lib::error_code ec;
    WebSocket::connection_ptr con = ws.get_connection(uri, ec);
    if (ec)
    {
        LOGE("Socket {} connect error: {}. uri={}", broker, ec.message(), uri);
        SLEEP_FOR(3000);
        reconnectSocket();
        return;
    }

    ws.connect(con);
}

void SocketData::onSocketClosed(connection_hdl hdl)
{
    LOGE("Socket {} closed.", broker);
    SLEEP_FOR(1000);
    reconnectSocket();
}

void SocketData::setBotList(shared_ptr<vector<shared_ptr<Bot>>> botList)
{
    LOGD("{}: Set bot list with size: {}", broker, botList->size());
    this->botList = botList;
}