#include "order_monitor.h"
#include "util.h"
#include "mysql_connector.h"
#include "binance_future.h"
#include "exchange.h"

static void checkOrderStatus()
{
    auto &db = MySQLConnector::getInstance();
    string query = "SELECT id, symbol, entryID, tpID, slID, apiKey, secretKey, iv, botID, side, volume, tp, sl FROM RealOrders";
    auto res = db.executeQuery(query, {});
    if (!res)
    {
        LOGE("Failed to fetch real orders from database");
        return;
    }

    const int MAX_THREAD = 5;
    boost::interprocess::interprocess_semaphore semaphore(MAX_THREAD);
    vector<thread> threads;

    while (res->next())
    {
        int id = res->getInt("id");
        string entryID = res->getString("entryID");
        string tpID = res->getString("tpID");
        string slID = res->getString("slID");
        string symbol = res->getString("symbol");
        string apiKey = res->getString("apiKey");
        string encryptedSecretKey = res->getString("secretKey");
        string iv = res->getString("iv");
        int botID = res->getInt("botID");
        string side = res->getString("side");
        string volume = res->getString("volume");
        string tp = res->getString("tp");
        string sl = res->getString("sl");

        shared_ptr<IExchange> exchange = make_shared<BinanceFuture>(apiKey, encryptedSecretKey, iv, botID);

        semaphore.wait();
        threads.emplace_back([=, &db, &semaphore]() mutable
                             {
            try
            {
                if (tpID.empty() && slID.empty())
                {
                    string entryStatus = exchange->getOrderStatus(symbol, entryID);
                    if (entryStatus.empty())
                    {
                        LOGE("Failed to get order status for entryID: {} ({}))", entryID, entryStatus);
                        semaphore.post();
                        return;
                    }
                    
                    // pending order
                    json entryJson = json::parse(entryStatus);
                    string status = entryJson["status"].get<string>();
                    string executedQty = entryJson["executedQty"].get<string>();
                    string origQty = entryJson["origQty"].get<string>();

                    // cancel, filled partially, filled, expired, 
                    if (status == "CANCELED" || status == "EXPIRED") {
                        if (stod(executedQty) > 0)
                        {
                            LOGE("Order {} is partially filled. Try to close position.", entryJson.dump());
                            string side = entryJson["side"].get<string>();
                            string result = (side == "BUY") ? exchange->sellMarket(symbol, executedQty, "", "", true) : exchange->buyMarket(symbol, executedQty, "", "", true);
                            LOGI("Response from Binance Future: {}", result);
                        }
                        db.executeUpdate("DELETE FROM RealOrders WHERE id = ?", {id});
                    }
                    else if (status == "FILLED" && executedQty == origQty) {
                        LOGI("Order {} is filled. Place TP/SL orders.", entryStatus);
                        if(side == "BUY") 
                        {
                            exchange->placeBuyTPSL(symbol, volume, tp, sl, entryID);
                        } 
                        else 
                        {
                            exchange->placeSellTPSL(symbol, volume, tp, sl, entryID);
                        }
                    }
                    semaphore.post();
                    return;
                }

                string tpStatus = exchange->getOrderStatus(symbol, tpID);
                string slStatus = exchange->getOrderStatus(symbol, slID);

                if (tpStatus.empty() || slStatus.empty())
                {
                    LOGE("Failed to get order status for entryID: {}, tpID: {} ({}), slID: {} ({})", entryID, tpID, tpStatus, slID, slStatus);
                    semaphore.post();
                    return;
                }

                json tpJson = json::parse(tpStatus);
                json slJson = json::parse(slStatus);

                tpStatus = tpJson["status"].get<string>();
                slStatus = slJson["status"].get<string>();

                if (tpStatus == "CANCELED" || slStatus == "CANCELED" ||  tpStatus == "FILLED" || slStatus == "FILLED")
                {
                    LOGI("Cancel order. entryID={}, tpID={}({}), slID={}({})", entryID, tpID, tpStatus, slID, slStatus);
                    if (tpStatus == "NEW")
                    {
                        exchange->cancelOrderByClientId(symbol, tpID);
                    }
                    if (slStatus == "NEW")
                    {
                        exchange->cancelOrderByClientId(symbol, slID);
                    }
                }

                if (tpStatus != "NEW" || slStatus != "NEW")
                {
                    LOGI("Order {} is completed. entryID: {}, tpID: {}, slID: {}", id, entryID, tpID, slID);
                    db.executeUpdate("DELETE FROM RealOrders WHERE id = ?", {id});
                }
            }
            catch (const exception err)
            {
                LOGE("Exception in thread: {}", err.what());
            }
            catch (...) {
                LOGE("Unknown exception type");
            }
            semaphore.post(); 
            return; });
    }

    for (auto &t : threads)
    {
        if (t.joinable())
        {
            t.join();
        }
    }
}
static void checkPositionClosedByManual()
{
    try
    {
        auto &db = MySQLConnector::getInstance();
        string query = R"(
        SELECT r.apiKey, r.secretKey, r.iv
        FROM RealOrders r
        JOIN (
            SELECT apiKey, MAX(id) AS max_id
            FROM RealOrders
            GROUP BY apiKey
        ) t
            ON r.apiKey = t.apiKey
        AND r.id = t.max_id;
        )";
        auto res = db.executeQuery(query, {});
        if (!res)
        {
            LOGE("Failed to fetch real orders from database");
            return;
        }
        while (res->next())
        {
            string apiKey = res->getString("apiKey");
            string encryptedSecretKey = res->getString("secretKey");
            string iv = res->getString("iv");

            shared_ptr<IExchange> exchange = make_shared<BinanceFuture>(apiKey, encryptedSecretKey, iv, 0);
            string s = exchange->getPositionRisk();
            if (s.empty())
            {
                LOGE("Failed to get position risk");
                continue;
            }
            json positionRisk = json::parse(s);

            vector<string> symbols;
            for (const auto &item : positionRisk)
            {
                string symbol = item["symbol"].get<string>();
                string positionAmt = item["positionAmt"].get<string>();
                if (stod(positionAmt) != 0)
                {
                    symbols.push_back(symbol);
                }
            }
            string query = "SELECT id, symbol, entryID, tpID, slID FROM RealOrders WHERE apiKey = ? AND tpID <> '' AND slID <> ''";
            auto res2 = db.executeQuery(query, {apiKey});
            if (!res2)
            {
                LOGE("Failed to fetch real orders from database");
                continue;
            }
            while (res2->next())
            {
                int id = res2->getInt("id");
                string entryID = res2->getString("entryID");
                string tpID = res2->getString("tpID");
                string slID = res2->getString("slID");
                string symbol = res2->getString("symbol");

                if (find(symbols.begin(), symbols.end(), symbol) == symbols.end())
                {
                    string entry = exchange->getOrderStatus(symbol, entryID);
                    string tp = exchange->getOrderStatus(symbol, tpID);
                    string sl = exchange->getOrderStatus(symbol, slID);

                    if (entry.empty() || tp.empty() || sl.empty())
                    {
                        LOGE("Failed to get order status for entryID: {} ({}), tpID: {} ({}), slID: {} ({})", entryID, entry, tpID, tp, slID, sl);
                        continue;
                    }

                    json entryJson = json::parse(entry);
                    json tpJson = json::parse(tp);
                    json slJson = json::parse(sl);

                    if (entryJson["status"] == "FILLED" && (tpJson["status"] == "NEW" || slJson["status"] == "NEW"))
                    {
                        exchange->cancelOrderByClientId(symbol, entryID);
                        exchange->cancelOrderByClientId(symbol, tpID);
                        exchange->cancelOrderByClientId(symbol, slID);
                        LOGI("Position for symbol {} is closed manually. Remove order from database. entryID: {}, tpID: {}, slID: {}", symbol, entryID, tpID, slID);
                        db.executeUpdate("DELETE FROM RealOrders WHERE id = ?", {id});
                    }
                }
            }
        }
    }
    catch (const exception &err)
    {
        LOGE("Exception in checkPositionClosedByManual: {}", err.what());
    }
    catch (...)
    {
        LOGE("Unknown exception type");
    }
}
static void run()
{
    long long lastTime = 0;
    int cnt = 0;
    while (true)
    {
        long long now = getCurrentTime();
        cnt++;

        if (now - lastTime > 300000) // 5 minute
        {
            LOGI("Order monitor is running... {}", cnt);
            lastTime = now;

            ofstream file("order_monitor.txt");
            if (file.is_open())
            {
                file << StringFormat("timestamp:{}\ncnt: {}\n", toTimeString(now), cnt);
                file.close(); // đóng file
            }
        }

        try
        {
            checkPositionClosedByManual();
            SLEEP_FOR(1000);
            checkOrderStatus();
            SLEEP_FOR(10000);
        }
        catch (const exception &err)
        {
            LOGE("Exception in order monitor: {}", err.what());
            SLEEP_FOR(10000);
        }
        catch (...)
        {
            LOGE("Unknown exception type");
        }
    }
}

void startOrderMonitor()
{
    static thread t(run);
    LOGI("Order monitor started");
}