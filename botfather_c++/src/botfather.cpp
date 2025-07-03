#include <tbb/task_group.h>
#include <chrono>
#include <thread>
#include "expr.h"
#include "Redis.h"
#include "util.h"
#include "axios.h"
#include "Timer.h"
#include "MySQLConnector.h"
#include "botfather.h"
#include "socket_data.h"
#include "socket_binance.h"

// #define TEST

void test()
{
    string broker = "binance";
    string symbol = "BTCUSDT";
    string timeframe = "1h";

    string url = "https://api.binance.com/api/v3/klines?symbol=" + symbol + "&interval=" + timeframe + "&limit=600";
    string response = Axios::get(url);
    json j = json::parse(response);

    vector<double> open, high, low, close, volume;
    vector<long long> startTime;

    for (const auto &item : j)
    {
        startTime.push_back(item[0].get<long long>());
        open.push_back(stod(item[1].get<string>()));
        high.push_back(stod(item[2].get<string>()));
        low.push_back(stod(item[3].get<string>()));
        close.push_back(stod(item[4].get<string>()));
        volume.push_back(stod(item[5].get<string>()));
    }

    startTime.pop_back();
    open.pop_back();
    high.pop_back();
    low.pop_back();
    close.pop_back();
    volume.pop_back();

    reverse(startTime.begin(), startTime.end());
    reverse(open.begin(), open.end());
    reverse(high.begin(), high.end());
    reverse(low.begin(), low.end());
    reverse(close.begin(), close.end());
    reverse(volume.begin(), volume.end());

    string exprText = "ampl(0) >= avg_ampl(50, 1) * 10";

    Timer timer("botfather runtime");

    for (int i = 0; i < 200000; i++)
    {
        any result = calculateExpr(exprText, broker, symbol, timeframe, open.size(),
                                   open.data(), high.data(), low.data(), close.data(), volume.data(),
                                   startTime.data());
        if (i % 10000 != 0)
            continue;
        if (result.has_value())
        {
            if (result.type() == typeid(int))
            {
                LOGD("Result: %d", any_cast<int>(result));
            }
            else if (result.type() == typeid(double))
            {
                LOGD("Result: %.3f", any_cast<double>(result));
            }
            else if (result.type() == typeid(string))
            {
                LOGD("Result: %s", any_cast<string>(result).c_str());
            }
            else
            {
                LOGE("Unknown result type");
            }
        }
        else
        {
            LOGE("No result");
        }
    }
}

static Route getRoute(const json &j)
{
    // j: {"data":{"id":"1744877970451","value":"Start","type":"start"},"id":"1744877970451","next":[{"data":{"id":"1744877970452","value":"max_rsi(14, 70, 48) >= 80","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970452","next":[{"data":{"id":"1744877982563","value":"macd_n_dinh(12, 26, 9, 6, 8, 0, 2, 0, 5) >= 3","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877982563","next":[{"data":{"id":"1744877970453","value":"ampl(1) >= avg_ampl(25, 0) * 1.8","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970453","next":[{"data":{"id":"1744877970454","value":"change(1) > 0","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970454","next":[{"data":{"id":"1744877970455","value":"change(0) < 0","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970455","next":[{"data":{"id":"1744877970456","value":"close(1) > max_high(100, 2)","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970456","next":[{"data":{"id":"1744877970457","value":"high(0) > max_high(100, 0)","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970457","next":[{"data":{"id":"1744877970458","value":"close(0) >= (open(1) + close(1))/2","type":"expr","unitVolume":"usd","unitEntry":"price","unitTP":"price","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"0"},"id":"1744877970458","next":[{"data":{"id":"1744877970459","value":"","type":"openSellLimit","unitVolume":"usd","unitEntry":"price","unitTP":"rr","unitSL":"price","unitStop":"price","unitExpiredTime":"candle","expiredTime":"1","volume":"5000","entry":"(close(0) + open(0))/2","sl":"high(0)","tp":"3.3","display":"Open SELL Limit. Volume=5000 (USD), Entry=(close(0) + open(0))/2 (USD), TP=3.3 (R), SL=high(0) (USD)"},"id":"1744877970459","next":[]}]}]}]}]}]}]}]}]}]}
    Route route;

    if (j.contains("id"))
        route.id = j["id"].get<string>();

    if (j.contains("data"))
    {
        auto jData = j["data"];
        if (jData.contains("id"))
            route.data.id = jData["id"].get<string>();
        if (jData.contains("type"))
            route.data.type = jData["type"].get<string>();
        if (jData.contains("unitEntry"))
            route.data.unitEntry = jData["unitEntry"].get<string>();
        if (jData.contains("unitExpiredTime"))
            route.data.unitExpiredTime = jData["unitExpiredTime"].get<string>();
        if (jData.contains("unitSL"))
            route.data.unitSL = jData["unitSL"].get<string>();
        if (jData.contains("unitTP"))
            route.data.unitTP = jData["unitTP"].get<string>();
        if (jData.contains("unitStop"))
            route.data.unitStop = jData["unitStop"].get<string>();
        if (jData.contains("unitVolume"))
            route.data.unitVolume = jData["unitVolume"].get<string>();
        if (jData.contains("expiredTime"))
            route.data.expiredTime = jData["expiredTime"].get<string>();
        if (jData.contains("value"))
            route.data.value = jData["value"].get<string>();
        if (jData.contains("stop"))
            route.data.stop = jData["stop"].get<string>();
        if (jData.contains("entry"))
            route.data.entry = jData["entry"].get<string>();
        if (jData.contains("tp"))
            route.data.tp = jData["tp"].get<string>();
        if (jData.contains("sl"))
            route.data.sl = jData["sl"].get<string>();
        if (jData.contains("volume"))
            route.data.volume = jData["volume"].get<string>();
    }

    if (j.contains("next"))
    {
        for (const auto &nextNode : j["next"])
        {
            route.next.push_back(getRoute(nextNode));
        }
    }

    return route;
}

vector<shared_ptr<Bot>> getBotList()
{
    Timer timer("getBotList");
    vector<shared_ptr<Bot>> botList;
    auto &db = MySQLConnector::getInstance();
    auto res = db.executeQuery("SELECT * FROM Bot");
    while (res->next())
    {
        shared_ptr<Bot> bot = make_shared<Bot>();

        bot->id = res->getInt("id");
        bot->botName = res->getString("botName");
        bot->idTelegram = split(res->getString("idTelegram"), ',');
        bot->treeData = res->getString("treeData");
        bot->userID = res->getInt("userID");
        bot->timeframes = convertJsonStringArrayToVector(res->getString("timeframes"));

        bot->symbolList.clear();
        vector<string> symbolList = convertJsonStringArrayToVector(res->getString("symbolList"));
        for (const string &symbol : symbolList)
        {
            Symbol s;
            vector<string> parts = split(symbol, ':');

            s.broker = parts[0];
            s.symbol = parts[1];
            s.symbolName = symbol;

            bot->symbolList.push_back(s);
        }
        sort(bot->symbolList.begin(), bot->symbolList.end(),
             [](const Symbol &a, const Symbol &b)
             {
                 return a.symbolName < b.symbolName;
             });

        string routeString = res->getString("route");
        json j = json::parse(routeString);
        bot->route = getRoute(j);

        botList.push_back(bot);
    }
    return botList;
}

void runApp()
{
    map<string, string> env = readEnvFile();

    Redis::getInstance().connect(env["REDIS_SERVER"], stoi(env["REDIS_PORT"]), env["REDIS_PASSWORD"]);

#ifndef TEST
    vector<SocketData *> exchanges;
    vector<thread> threads;

    exchanges.push_back(new SocketBinance(50));

    for (SocketData *exchange : exchanges)
    {
        threads.emplace_back([exchange]()
                             { exchange->init(); });
    }

    shared_ptr<vector<shared_ptr<Bot>>> botList = make_shared<vector<shared_ptr<Bot>>>(getBotList());
    for (SocketData *exchange : exchanges)
    {
        exchange->setBotList(botList);
    }

    for (auto &t : threads)
    {
        if (t.joinable())
            t.join();
    }
#else
    test();
    LOGD("Done.");
#endif
}