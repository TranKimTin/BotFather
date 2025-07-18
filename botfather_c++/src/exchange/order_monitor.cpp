#include "order_monitor.h"
#include "util.h"
#include "mysql_connector.h"
#include "binance_future.h"
#include "exchange.h"

static void checkOrderStatus()
{
    auto &db = MySQLConnector::getInstance();
    string query = "SELECT id, symbol, entryID, tpID, slID FROM RealOrders";
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

        semaphore.wait();
        threads.emplace_back([=, &db, &exchange, &semaphore, &dbMutex]()
                             {
            try
            {
                string entryStatus = exchange->getOrderStatus(symbol, entryID);
                string tpStatus = exchange->getOrderStatus(symbol, tpID);
                string slStatus = exchange->getOrderStatus(symbol, slID);

                if (entryStatus.empty() || tpStatus.empty() || slStatus.empty())
                {
                    LOGE("Failed to get order status for entryID: %s, tpID: %s, slID: %s", entryID.c_str(), tpID.c_str(), slID.c_str());
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
                    LOGI("Cancel order. entryID=%s(%s), tpID=%s(%s), slID=%s(%s)", entryID.c_str(), entryStatus.c_str(), tpID.c_str(), tpStatus.c_str(), slID.c_str(), slStatus.c_str());
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
                    LOGI("Order %d is completed. entryID: %s, tpID: %s, slID: %s", id, entryID.c_str(), tpID.c_str(), slID.c_str());
                    db.executeUpdate("DELETE FROM RealOrders WHERE id = ?", {id});
                }
            }
            catch (const exception err)
            {
                LOGE("Exception in thread: %s", err.what());
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