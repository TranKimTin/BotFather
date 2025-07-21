#include "order_monitor.h"
#include "util.h"
#include "mysql_connector.h"
#include "binance_future.h"
#include "exchange.h"

static void checkOrderStatus()
{
    auto &db = MySQLConnector::getInstance();
    string query = "SELECT id, symbol, entryID, tpID, slID, apiKey, secretKey, iv, botID FROM RealOrders";
    auto res = db.executeQuery(query, {});
    if (!res)
    {
        LOGE("Failed to fetch real orders from database");
        return;
    }

    const int MAX_THREAD = 10;
    mutex dbMutex;
    boost::interprocess::interprocess_semaphore semaphore(MAX_THREAD);
    vector<thread> threads;

    while (res->next())
    {
        int id = res->getInt("id");
        string entryID = res->getString("entryID");
        string tpID = res->getString("tpID");
        string slID = res->getString("slID");
        string symbol = res->getString("symbol");
        string encryptedApiKey = res->getString("apiKey");
        string encryptedSecretKey = res->getString("secretKey");
        string iv = res->getString("iv");
        int botID = res->getInt("botID");

        shared_ptr<IExchange> exchange = make_shared<BinanceFuture>(encryptedApiKey, encryptedSecretKey, iv, botID);

        semaphore.wait();
        threads.emplace_back([=, &db, &semaphore, &dbMutex]()
                             {
            try
            {
                string entryStatus = exchange->getOrderStatus(symbol, entryID);
                string tpStatus = exchange->getOrderStatus(symbol, tpID);
                string slStatus = exchange->getOrderStatus(symbol, slID);

                if (entryStatus.empty() || tpStatus.empty() || slStatus.empty())
                {
                    LOGE("Failed to get order status for entryID: {}, tpID: {}, slID: {}", entryID, tpID, slID);
                    return;
                }

                json entryJson = json::parse(entryStatus);
                json tpJson = json::parse(tpStatus);
                json slJson = json::parse(slStatus);

                entryStatus = entryJson["status"].get<string>();
                tpStatus = tpJson["status"].get<string>();
                slStatus = slJson["status"].get<string>();

                if (entryStatus == "CANCELED" || tpStatus != "NEW" || slStatus != "NEW")
                {
                    LOGI("Cancel order. entryID={}({}), tpID={}({}), slID={}({})", entryID, entryStatus, tpID, tpStatus, slID, slStatus);
                    if (entryStatus == "NEW")
                    {
                        exchange->cancelOrderByClientId(symbol, entryID);
                    }
                    if (tpStatus == "NEW")
                    {
                        exchange->cancelOrderByClientId(symbol, tpID);
                    }
                    if (slStatus == "NEW")
                    {
                        exchange->cancelOrderByClientId(symbol, slID);
                    }
                }

                if (entryStatus != "NEW" && tpStatus != "NEW" || slStatus != "NEW")
                {
                    LOGI("Order {} is completed. entryID: {}, tpID: {}, slID: {}", id, entryID, tpID, slID);
                    db.executeUpdate("DELETE FROM RealOrders WHERE id = ?", {id});
                }
            }
            catch (const exception err)
            {
                LOGE("Exception in thread: {}", err.what());
            }
             semaphore.post(); });
    }

    for (auto &t : threads)
    {
        if (t.joinable())
        {
            t.join();
        }
    }
}

static void run()
{
    while (true)
    {
        checkOrderStatus();
        SLEEP_FOR(10000);
    }
}

void startOrderMonitor()
{
    thread t(run);
    t.detach();
    LOGI("Order monitor started");
}