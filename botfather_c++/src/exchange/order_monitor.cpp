#include "order_monitor.h"
#include "util.h"
#include "mysql_connector.h"
#include "binance_future.h"
#include "exchange.h"

static void checkOrderStatus()
{
    auto &db = MySQLConnector::getInstance();
    string query = "SELECT id, symbol, tpID, slID FROM RealOrders";
    auto res = db.executeQuery(query, {});
    if (!res)
    {
        LOGE("Failed to fetch real orders from database");
        return;
    }
    auto env = readEnvFile();
    const string API_KEY = env["API_KEY"];
    const string SECRET_KEY = env["SECRET_KEY"];
    shared_ptr<IExchange> exchange = make_shared<BinanceFuture>(API_KEY, SECRET_KEY);

    while (res->next())
    {
        int id = res->getInt("id");
        string tpID = res->getString("tpID");
        string slID = res->getString("slID");
        string symbol = res->getString("symbol");

        string tpStatus = exchange->getOrderStatus(symbol, tpID);
        string slStatus = exchange->getOrderStatus(symbol, slID);

        if (tpStatus.empty() || slStatus.empty())
        {
            LOGE("Failed to get order status for tpID: %s, slID: %s", tpID.c_str(), slID.c_str());
            continue;
        }

        json tpJson = json::parse(tpStatus);
        json slJson = json::parse(slStatus);

        tpStatus = tpJson["status"].get<string>();
        slStatus = slJson["status"].get<string>();

        if (tpStatus != "NEW" && slStatus == "NEW")
        {
            LOGI("TP order %s is filled, cancel SL order %s", tpID.c_str(), slID.c_str());
            exchange->cancelOrderByClientId(symbol, slID);
        }
        else if (tpStatus == "NEW" && slStatus != "NEW")
        {
            LOGI("SL order %s is filled, cancel TP order %s", slID.c_str(), tpID.c_str());
            exchange->cancelOrderByClientId(symbol, tpID);
        }

        if (tpStatus != "NEW" || slStatus != "NEW")
        {
            LOGI("Order %d is completed, deleting from database", id);
            db.executeUpdate("DELETE FROM RealOrders WHERE id = ?", {id});
        }
    }
}

static void run()
{
    while (true)
    {
        checkOrderStatus();
        SLEEP_FOR(10000); // Sleep for 10 seconds
    }
}

void startOrderMonitor()
{
    thread t(run);
    t.detach();
    LOGI("Order monitor started");
}