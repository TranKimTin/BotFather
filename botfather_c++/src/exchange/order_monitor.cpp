#include "order_monitor.h"
#include "util.h"
#include "mysql_connector.h"
#include "binance_future.h"
#include "exchange.h"

static void checkOrderStatus()
{
    auto &db = MySQLConnector::getInstance();
    string query = "SELECT id, symbol, entryID, tpID, slID, apiKey, secretKey, iv, botID, side, volume, tp, sl FROM RealOrders";
    vector<map<string, any>> res = db.executeQuery(query, {});

    const int MAX_THREAD = 5;
    boost::asio::thread_pool pool(MAX_THREAD);

    for (auto &row : res)
    {
        int id = any_cast<int>(row.at("id"));
        string entryID = any_cast<string>(row.at("entryID"));
        string tpID = any_cast<string>(row.at("tpID"));
        string slID = any_cast<string>(row.at("slID"));
        string symbol = any_cast<string>(row.at("symbol"));
        string apiKey = any_cast<string>(row.at("apiKey"));
        string encryptedSecretKey = any_cast<string>(row.at("secretKey"));
        string iv = any_cast<string>(row.at("iv"));
        int botID = any_cast<int>(row.at("botID"));
        string side = any_cast<string>(row.at("side"));
        string volume = any_cast<string>(row.at("volume"));
        string tp = any_cast<string>(row.at("tp"));
        string sl = any_cast<string>(row.at("sl"));

        shared_ptr<IExchange> exchange = make_shared<BinanceFuture>(apiKey, encryptedSecretKey, iv, botID);

        boost::asio::post(pool, [=, &db]() mutable
                          {
            try
            {
                if (tpID.empty() && slID.empty())
                {
                    string entryStatus = exchange->getOrderStatus(symbol, entryID);
                    if (entryStatus.empty())
                    {
                        LOGE("Failed to get order status for entryID: {} ({}))", entryID, entryStatus);
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
                    return;
                }

                string tpStatus = exchange->getOrderStatus(symbol, tpID);
                string slStatus = exchange->getOrderStatus(symbol, slID);

                if (tpStatus.empty() || slStatus.empty())
                {
                    LOGE("Failed to get order status for entryID: {}, tpID: {} ({}), slID: {} ({})", entryID, tpID, tpStatus, slID, slStatus);
                    return;
                }

                json tpJson = json::parse(tpStatus);
                json slJson = json::parse(slStatus);

                tpStatus = tpJson["algoStatus"].get<string>();
                slStatus = slJson["algoStatus"].get<string>();

                if (tpStatus == "CANCELED" || slStatus == "CANCELED" ||  tpStatus == "FINISHED" || slStatus == "FINISHED" || tpStatus == "REJECTED" || slStatus == "REJECTED")
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

                if (tpStatus != "NEW" && slStatus != "NEW")
                {
                    LOGI("Order {} is completed. entryID: {}, tpID: {}({}), slID: {}({})", id, entryID, tpID, tpStatus, slID, slStatus);
                    db.executeUpdate("DELETE FROM RealOrders WHERE id = ?", {id});
                }
            }
            catch (const exception& err)
            {
                LOGE("Exception in thread: {}", err.what());
            }
            catch (...) {
                LOGE("Unknown exception type");
            }
            return; });
    }
    pool.join();
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
        vector<map<string, any>> res = db.executeQuery(query, {});

        string query2 = "SELECT id, symbol, entryID, tpID, slID, apiKey FROM RealOrders WHERE tpID <> '' AND slID <> ''";
        vector<map<string, any>> res2 = db.executeQuery(query2, {});

        if (res.empty() || res2.empty())
        {
            return;
        }

        for (auto &row : res)
        {
            string apiKey = any_cast<string>(row.at("apiKey"));
            string encryptedSecretKey = any_cast<string>(row.at("secretKey"));
            string iv = any_cast<string>(row.at("iv"));

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

            for (auto &row2 : res2)
            {
                string apiKey2 = any_cast<string>(row2.at("apiKey"));
                if (apiKey2 != apiKey)
                {
                    continue;
                }

                int id = any_cast<int>(row2.at("id"));
                string entryID = any_cast<string>(row2.at("entryID"));
                string tpID = any_cast<string>(row2.at("tpID"));
                string slID = any_cast<string>(row2.at("slID"));
                string symbol = any_cast<string>(row2.at("symbol"));

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

                    string tpStatus = tpJson["algoStatus"].get<string>();
                    string slStatus = slJson["algoStatus"].get<string>();

                    if (entryJson["status"] == "FILLED" && (tpStatus == "NEW" || slStatus == "NEW"))
                    {
                        if (tpStatus == "NEW")
                        {
                            exchange->cancelOrderByClientId(symbol, tpID);
                        }
                        if (slStatus == "NEW")
                        {
                            exchange->cancelOrderByClientId(symbol, slID);
                        }
                        LOGI("Position for symbol {} is closed manually. Remove order from database. entryID: {}, tpID: {}({}), slID: {}({})", symbol, entryID, tpID, tpStatus, slID, slStatus);
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

static void writeLog(const string &message)
{
    LOGI("{}", message);
    ofstream file("order_monitor.txt");
    if (file.is_open())
    {
        file << StringFormat("[{}] {}\n", toTimeString(getCurrentTime()), message);
        file.close();
    }
}

static void run()
{
    while (true)
    {
        try
        {
            SLEEP_FOR(1000);
            writeLog("Start checkPositionClosedByManual");
            checkPositionClosedByManual();

            writeLog("Checking order status");
            checkOrderStatus();

            writeLog("Finished checking orders");
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