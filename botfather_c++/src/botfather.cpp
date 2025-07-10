#include "botfather.h"
#include "redis.h"
#include "Timer.h"
#include "util.h"
#include "mysql_connector.h"
#include "socket_data.h"
#include "socket_binance.h"
#include "socket_binance_future.h"
#include "socket_bybit.h"
#include "socket_bybit_future.h"
#include "socket_okx.h"

sio::client client;
vector<SocketData *> exchanges;
vector<thread> threads;
shared_ptr<vector<shared_ptr<Bot>>> botList;

// #define TEST

#ifdef TEST
#include "telegram.h"
void test()
{
    string botID = "1833284254";
    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);
    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);
    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);

    SLEEP_FOR(2000);

    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);
    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);
    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);
    SLEEP_FOR(200);
    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);
    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);
    Telegram::getInstance().sendMessage("Hello BotFather! " + toTimeString(getCurrentTime()), botID);
    SLEEP_FOR(5000);
}
#endif

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

vector<shared_ptr<Bot>> getBotList(string botName)
{
    Timer timer("getBotList");
    vector<shared_ptr<Bot>> botList;
    auto &db = MySQLConnector::getInstance();
    string mysql_query = "SELECT * FROM Bot";
    vector<any> args;

    if (botName != "")
    {
        mysql_query += " WHERE botName = ?";
        args.push_back(botName);
    }

    auto res = db.executeQuery(mysql_query, args);
    while (res->next())
    {
        shared_ptr<Bot> bot = make_shared<Bot>();

        bot->id = res->getInt("id");
        bot->botName = res->getString("botName");
        bot->treeData = res->getString("treeData");
        bot->userID = res->getInt("userID");
        bot->timeframes = convertJsonStringArrayToVector(res->getString("timeframes"));
        bot->idTelegram = split(res->getString("idTelegram"), ',');

        for (string &id : bot->idTelegram)
        {
            id = trim(id);
        }

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

void setBotList(string botName)
{
    if (botName == "")
    {
        botList = make_shared<vector<shared_ptr<Bot>>>(getBotList(botName));
    }
    else
    {
        auto list = make_shared<vector<shared_ptr<Bot>>>(getBotList(botName));

        // Xóa tất cả bot cùng tên (nếu có nhiều hơn 1)
        botList->erase(remove_if(botList->begin(), botList->end(),
                                 [&](const shared_ptr<Bot> &bot)
                                 {
                                     return bot->botName == botName;
                                 }),
                       botList->end());

        // Thêm các bot mới vào
        botList->insert(botList->end(), list->begin(), list->end());
    }

    for (SocketData *exchange : exchanges)
    {
        exchange->setBotList(botList);
    }
}

void sio_on_connected()
{
    LOGI("Connected to socket io server");
    client.socket()->emit("message", sio::string_message::create("Hello from C++"));
}

void sio_on_message(string const &event, sio::message::ptr const &data, bool isAck, sio::message::list &ack_resp)
{
    if (event == "onUpdateConfig")
    {
        string botName = data->get_string();
        LOGI("Update config for bot %s", botName.c_str());
        setBotList(botName);
    }
}

void runApp()
{
    unordered_map<string, string> env = readEnvFile();

    Redis::getInstance().connect(env["REDIS_SERVER"], stoi(env["REDIS_PORT"]), env["REDIS_PASSWORD"]);

#ifndef TEST

    exchanges.push_back(new SocketBinance(20));
    exchanges.push_back(new SocketBinanceFuture(20));
    exchanges.push_back(new SocketBybit(10));
    exchanges.push_back(new SocketBybitFuture(10));
    exchanges.push_back(new SocketOkx(5));

    for (SocketData *exchange : exchanges)
    {
        threads.emplace_back([exchange]()
                             { exchange->init(); });
    }

    setBotList();

    // connect socket_io to web config
    client.set_open_listener(sio_on_connected);
    client.socket()->on("onUpdateConfig", sio_on_message);
    client.connect(StringFormat("%s:%d", env["HOST_WEB_SERVER"].c_str(), 8080));

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