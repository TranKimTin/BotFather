#include "botfather.h"
#include "redis.h"
#include "timer.h"
#include "util.h"
#include "mysql_connector.h"
#include "socket_data.h"
#include "socket_binance.h"
#include "socket_binance_future.h"
#include "socket_bybit.h"
#include "socket_bybit_future.h"
#include "socket_okx.h"
#include "expr.h"

sio::client client;
vector<SocketData *> exchanges;
vector<thread> threads;
shared_ptr<vector<shared_ptr<Bot>>> botList;

// #define TEST

#ifdef TEST
#include "telegram.h"
#include "binance_future.h"
#include <tbb/task_group.h>

static tbb::task_group task;

void test()
{
    auto env = readEnvFile();

    string broker = "binance_future";
    string symbol = "BTCUSDT";
    string timeframe = "1h";
    RateData rateData = getBinanceFuturetOHLCV(symbol, timeframe, 600);
    rateData.open.pop_front();
    rateData.high.pop_front();
    rateData.low.pop_front();
    rateData.close.pop_front();
    rateData.startTime.pop_front();

    vector<double> open(rateData.open.begin(), rateData.open.end());
    vector<double> high(rateData.high.begin(), rateData.high.end());
    vector<double> low(rateData.low.begin(), rateData.low.end());
    vector<double> close(rateData.close.begin(), rateData.close.end());
    vector<double> volume(rateData.volume.begin(), rateData.volume.end());
    vector<long long> startTime(rateData.startTime.begin(), rateData.startTime.end());

    string expr = "{min(11, 2, 3, 10, 4, 5)}";
    boost::unordered_flat_map<long long, vector<double>> cachedIndicator;
    boost::unordered_flat_map<long long, unique_ptr<SparseTable>> cachedMinMax;
    int shift = 0;
    string res = calculateSubExpr(expr, broker, symbol, timeframe, rateData.startTime.size(), open.data(), high.data(), low.data(), close.data(),
                                  volume.data(), startTime.data(), 0.01, &cachedIndicator, &cachedMinMax, shift);
    LOGI(res);
    // string iv = generateRandomIV();
    // string apiKey = env["API_KEY"];
    // string secretKey = encryptAES(env["SECRET_KEY"], env["ENCRYP_KEY"], iv);
    // IExchange *exchange = new BinanceFuture(apiKey, secretKey, iv, 31);

    // double p = 0.5 / 100.0;

    // string id = exchange->buyLimit("BTCUSDT", "0.01", doubleToString(close[0], 0), doubleToString(close[0] * (1 + p), 0), doubleToString(close[0] * (1 - p), 0), "");
    // string id = exchange->buyMarket("BTCUSDT", "0.01", doubleToString(close[0] * (1 + p), 0), doubleToString(close[0] * (1 - p), 0), false);

    // string id = exchange->buyLimit("BTCUSDT", "0.01", "117000", "121000", "111000", "");
    // string id = exchange->buyMarket("BTCUSDT", "0.01", "120000", "110000", false);

    // string id = exchange->sellLimit("BTCUSDT", "0.01", "117500", "115000", "121500", "");
    // string id = exchange->sellMarket("BTCUSDT", "0.01", "115000", "121500", false);

    SLEEP_FOR(1000000);
}
#endif

vector<shared_ptr<Bot>> getBotList(string botName)
{
    Timer timer("getBotList");
    vector<shared_ptr<Bot>> botList;
    auto &db = MySQLConnector::getInstance();
    string mysql_query = "SELECT id,botName,userID,timeframes,symbolList,route,idTelegram,apiKey,secretKey,iv,enableRealOrder,maxOpenOrderPerSymbolBot,maxOpenOrderAllSymbolBot,maxOpenOrderPerSymbolAccount,maxOpenOrderAllSymbolAccount FROM Bot";
    vector<any> args;

    if (botName != "")
    {
        mysql_query += " WHERE botName = ?";
        args.push_back(botName);
    }

    vector<map<string, any>> res = db.executeQuery(mysql_query, args);
    for (auto &row : res)
    {
        shared_ptr<Bot> bot = initBot(row);
        botList.push_back(bot);
    }
    return botList;
}

void setBotList(string botName)
{
    botName = "";
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
        LOGI("Update config for bot {}", botName);
        setBotList(botName);
    }
}

void runApp()
{
    boost::unordered_flat_map<string, string> env = readEnvFile();

    Redis::getInstance().connect(env["REDIS_SERVER"], stoi(env["REDIS_PORT"]), env["REDIS_PASSWORD"]);

#ifndef TEST

    exchanges.push_back(new SocketBinance(5));
    exchanges.push_back(new SocketBinanceFuture(5));
    // exchanges.push_back(new SocketBybit(5));
    // exchanges.push_back(new SocketBybitFuture(5));
    // exchanges.push_back(new SocketOkx(5));

    for (SocketData *exchange : exchanges)
    {
        threads.emplace_back([exchange]()
                             { exchange->init(); });
    }

    // connect socket_io to web config
    client.set_open_listener(sio_on_connected);
    client.socket()->on("onUpdateConfig", sio_on_message);
    client.connect(StringFormat("{}:{}", env["HOST_WEB_SERVER"], 8080));

    setBotList("");

    for (auto &t : threads)
    {
        if (t.joinable())
            t.join();
    }

    SLEEP_FOR(10000000);
#else
    test();
    LOGD("Done.");
#endif
}