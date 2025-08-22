#include "binance_future.h"
#include "axios.h"
#include "util.h"
#include "mysql_connector.h"
#include <openssl/hmac.h>
#include <openssl/evp.h>

BinanceFuture::BinanceFuture(const string &encryptedApiKey, const string &encryptedSecretKey, const string &iv, const int botID)
    : encryptedApiKey(encryptedApiKey), encryptedSecretKey(encryptedSecretKey), iv(iv), botID(botID)
{
    unordered_map<string, string> env = readEnvFile();
    apiKey = decryptAES(encryptedApiKey, env["ENCRYP_KEY"], iv);
    secretKey = decryptAES(encryptedSecretKey, env["ENCRYP_KEY"], iv);
}

string BinanceFuture::buyMarket(const string &symbol, string quantity,
                                string takeProfit, string stopLoss)
{
    if (!takeProfit.empty() || !stopLoss.empty())
    {
        int openOrderAlgoCount = getOpenAlgoOrdersCount(symbol);
        if (openOrderAlgoCount == -1 || openOrderAlgoCount >= MAX_NUM_ALGO_ORDERS)
        {
            LOGE("Max number of algo orders reached ({}). Do nothing.", openOrderAlgoCount);
            return "";
        }
        LOGI("openOrderAlgoCount: {}", openOrderAlgoCount);
    }

    string clientOrderId = StringFormat("BFBM{}{}", symbol, getCurrentTime());
    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", BUY},
        {"type", MARKET},
        {"quantity", quantity},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    // if (takeProfit.empty() && stopLoss.empty())
    // {
    //     params["reduceOnly"] = "true";
    // }

    string res = sendOrder(params);
    if (res.empty())
        return res;

    return placeBuyMarketTPSL(symbol, quantity, takeProfit, stopLoss, clientOrderId);
}

string BinanceFuture::placeBuyMarketTPSL(const string &symbol, string &quantity, string &takeProfit, string &stopLoss, string &clientOrderId)
{
    string tpID;

    if (!takeProfit.empty())
    {
        string resTP = sendTPorSL(symbol, SELL, LIMIT, quantity, takeProfit, takeProfit);
        if (resTP.empty())
        {
            LOGI("Place TP error. Close position");
            return sellMarket(symbol, quantity, "", "");
        }
        else
        {
            json j = json::parse(resTP);
            tpID = j["clientOrderId"].get<string>();
            LOGI("TP order id: {}", tpID);
        }
    }
    string slID;
    if (!stopLoss.empty())
    {
        string resSL = sendTPorSL(symbol, SELL, STOP_MARKET, quantity, stopLoss);
        if (resSL.empty())
        {
            LOGI("Place SL error");
            if (!tpID.empty())
            {
                LOGI("Cancel TP order {}", tpID);
                cancelOrderByClientId(symbol, tpID);
            }
            LOGI("Close position");
            return sellMarket(symbol, quantity, "", "");
        }
        else
        {
            json j = json::parse(resSL);
            slID = j["clientOrderId"].get<string>();
            LOGI("SL order id: {}", slID);
        }
    }
    if (!tpID.empty() && !slID.empty())
    {
        insertOrderToDB(symbol, clientOrderId, tpID, slID);
    }
    return clientOrderId;
}

string BinanceFuture::sellMarket(const string &symbol, string quantity, string takeProfit, string stopLoss)
{
    if (!takeProfit.empty() || !stopLoss.empty())
    {
        int openOrderAlgoCount = getOpenAlgoOrdersCount(symbol);
        if (openOrderAlgoCount == -1 || openOrderAlgoCount >= MAX_NUM_ALGO_ORDERS)
        {
            LOGE("Max number of algo orders reached ({}). Do nothing.", openOrderAlgoCount);
            return "";
        }
        LOGI("openOrderAlgoCount: {}", openOrderAlgoCount);
    }

    string clientOrderId = StringFormat("BFSM{}{}", symbol, getCurrentTime());
    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", SELL},
        {"type", MARKET},
        {"quantity", quantity},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    // if (takeProfit.empty() && stopLoss.empty())
    // {
    //     params["reduceOnly"] = "true";
    // }

    string res = sendOrder(params);
    if (res.empty())
        return res;

    return placeSellMarketTPSL(symbol, quantity, takeProfit, stopLoss, clientOrderId);
}

string BinanceFuture::placeSellMarketTPSL(const string &symbol, string &quantity, string &takeProfit, string &stopLoss, string &clientOrderId)
{
    string tpID;
    if (!takeProfit.empty())
    {
        string resTP = sendTPorSL(symbol, BUY, LIMIT, quantity, takeProfit, takeProfit);
        if (resTP.empty())
        {
            LOGI("Place TP error. Close position");
            return buyMarket(symbol, quantity, "", "");
        }
        else
        {
            json j = json::parse(resTP);
            tpID = j["clientOrderId"].get<string>();
            LOGI("TP order id: {}", tpID);
        }
    }

    string slID;
    if (!stopLoss.empty())
    {
        string resSL = sendTPorSL(symbol, BUY, STOP_MARKET, quantity, stopLoss);
        if (resSL.empty())
        {
            LOGI("Place SL error");
            if (!tpID.empty())
            {
                LOGI("Cancel TP order {}", tpID);
                cancelOrderByClientId(symbol, tpID);
            }
            LOGI("Close position");
            return buyMarket(symbol, quantity, "", "");
        }
        else
        {
            json j = json::parse(resSL);
            slID = j["clientOrderId"].get<string>();
            LOGI("SL order id: {}", slID);
        }
    }
    if (!tpID.empty() && !slID.empty())
    {
        insertOrderToDB(symbol, clientOrderId, tpID, slID);
    }
    return clientOrderId;
}

string BinanceFuture::buyLimit(const string &symbol, string quantity, string price, string takeProfit, string stopLoss, string expiredTime)
{
    if (!takeProfit.empty() || !stopLoss.empty())
    {
        int openOrderAlgoCount = getOpenAlgoOrdersCount(symbol);
        if (openOrderAlgoCount == -1 || openOrderAlgoCount >= MAX_NUM_ALGO_ORDERS - 1)
        {
            LOGE("Max number of algo orders reached ({}). Do nothing.", openOrderAlgoCount);
            return "";
        }
        LOGI("openOrderAlgoCount: {}", openOrderAlgoCount);
    }

    string clientOrderId = StringFormat("BFBL{}{}", symbol, getCurrentTime());
    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", BUY},
        {"type", LIMIT},
        {"quantity", quantity},
        {"price", price},
        {"timeInForce", "GTC"},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    if (!expiredTime.empty() && expiredTime != "0")
    {
        params["timeInForce"] = "GTD";
        params["goodTillDate"] = expiredTime;
    }

    // if (takeProfit.empty() && stopLoss.empty())
    // {
    //     params["reduceOnly"] = "true";
    // }

    string res = sendOrder(params);
    if (res.empty())
        return res;

    string resEntry = getOrderStatus(symbol, clientOrderId);
    if (!resEntry.empty())
    {
        json entryJson = json::parse(resEntry);
        string entryStatus = entryJson["status"].get<string>();
        if (entryStatus != "NEW")
        {
            LOGI("Entry match immediately");
            return placeBuyMarketTPSL(symbol, quantity, takeProfit, stopLoss, clientOrderId);
        }
    }

    string tpID;

    if (!takeProfit.empty())
    {
        string resTP = sendTPorSL(symbol, SELL, STOP, quantity, price, takeProfit);
        if (resTP.empty())
        {
            string resEntry = getOrderStatus(symbol, clientOrderId);
            if (resEntry.empty())
                return sellMarket(symbol, quantity, "", "");

            json entryJson = json::parse(resEntry);
            string entryStatus = entryJson["status"].get<string>();
            if (entryStatus != "NEW")
            {
                LOGI("Entry match immediately.");
                return placeBuyMarketTPSL(symbol, quantity, takeProfit, stopLoss, clientOrderId);
            }
            else
            {
                LOGI("Place TP error. Close position");
                string resCancel = cancelOrderByClientId(symbol, clientOrderId);
                if (resCancel.empty())
                {
                    LOGI("Cancel order {} error", clientOrderId);
                    LOGI("Close position");
                    return sellMarket(symbol, quantity, "", "");
                }
            }
            return resTP;
        }
        else
        {
            json j = json::parse(resTP);
            tpID = j["clientOrderId"].get<string>();
            LOGI("TP order id: {}", tpID);
        }
    }

    string slID;
    if (!stopLoss.empty())
    {
        string resSL = sendTPorSL(symbol, SELL, STOP_MARKET, quantity, stopLoss);
        if (resSL.empty())
        {
            LOGI("Place SL error");
            if (!tpID.empty())
            {
                LOGI("Cancel TP order {}", tpID);
                cancelOrderByClientId(symbol, tpID);
            }

            LOGI("Close position");
            string resCancel = cancelOrderByClientId(symbol, clientOrderId);
            if (resCancel.empty())
            {
                LOGI("Cancel order {} error", clientOrderId);
                return sellMarket(symbol, quantity, "", "");
            }
        }
        else
        {
            json j = json::parse(resSL);
            slID = j["clientOrderId"].get<string>();
            LOGI("SL order id: {}", slID);
        }
    }

    if (!tpID.empty() && !slID.empty())
    {
        insertOrderToDB(symbol, clientOrderId, tpID, slID);
    }

    return clientOrderId;
}

string BinanceFuture::sellLimit(const string &symbol, string quantity, string price, string takeProfit, string stopLoss, string expiredTime)
{
    if (!takeProfit.empty() || !stopLoss.empty())
    {
        int openOrderAlgoCount = getOpenAlgoOrdersCount(symbol);
        if (openOrderAlgoCount == -1 || openOrderAlgoCount >= MAX_NUM_ALGO_ORDERS)
        {
            LOGE("Max number of algo orders reached ({}). Do nothing.", openOrderAlgoCount);
            return "";
        }
        LOGI("openOrderAlgoCount: {}", openOrderAlgoCount);
    }

    string clientOrderId = StringFormat("BFSL{}{}", symbol, getCurrentTime());
    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", SELL},
        {"type", LIMIT},
        {"quantity", quantity},
        {"price", price},
        {"timeInForce", "GTC"},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    if (!expiredTime.empty() && expiredTime != "0")
    {
        params["timeInForce"] = "GTD";
        params["goodTillDate"] = expiredTime;
    }

    // if (takeProfit.empty() && stopLoss.empty())
    // {
    //     params["reduceOnly"] = "true";
    // }

    string res = sendOrder(params);
    if (res.empty())
        return res;

    string resEntry = getOrderStatus(symbol, clientOrderId);
    if (!resEntry.empty())
    {
        json entryJson = json::parse(resEntry);
        string entryStatus = entryJson["status"].get<string>();
        if (entryStatus != "NEW")
        {
            LOGI("Entry match immediately");
            return placeSellMarketTPSL(symbol, quantity, takeProfit, stopLoss, clientOrderId);
        }
    }

    string tpID;

    if (!takeProfit.empty())
    {
        string resTP = sendTPorSL(symbol, BUY, STOP, quantity, price, takeProfit);
        if (resTP.empty())
        {
            string resEntry = getOrderStatus(symbol, clientOrderId);
            if (resEntry.empty())
                return buyMarket(symbol, quantity, "", "");

            json entryJson = json::parse(resEntry);
            string entryStatus = entryJson["status"].get<string>();
            if (entryStatus != "NEW")
            {
                LOGI("Entry match immediately.");
                return placeSellMarketTPSL(symbol, quantity, takeProfit, stopLoss, clientOrderId);
            }
            else
            {
                LOGI("Place TP error. Close position");
                string resCancel = cancelOrderByClientId(symbol, clientOrderId);
                if (resCancel.empty())
                {
                    LOGI("Cancel order {} error", clientOrderId);
                    LOGI("Close position");
                    return buyMarket(symbol, quantity, "", "");
                }
                return resTP;
            }
        }
        else
        {
            json j = json::parse(resTP);
            tpID = j["clientOrderId"].get<string>();
            LOGI("TP order id: {}", tpID);
        }
    }

    string slID;
    if (!stopLoss.empty())
    {
        string resSL = sendTPorSL(symbol, BUY, STOP_MARKET, quantity, stopLoss);
        if (resSL.empty())
        {
            LOGI("Place SL error");
            if (!tpID.empty())
            {
                LOGI("Cancel TP order {}", tpID);
                cancelOrderByClientId(symbol, tpID);
            }

            LOGI("Close position");
            string resCancel = cancelOrderByClientId(symbol, clientOrderId);
            if (resCancel.empty())
            {
                LOGI("Cancel order {} error", clientOrderId);
                return buyMarket(symbol, quantity, "", "");
            }
        }
        else
        {
            json j = json::parse(resSL);
            slID = j["clientOrderId"].get<string>();
            LOGI("SL order id: {}", slID);
        }
    }
    if (!tpID.empty() && !slID.empty())
    {
        insertOrderToDB(symbol, clientOrderId, tpID, slID);
    }
    return clientOrderId;
}

string BinanceFuture::sendTPorSL(const string &symbol, const string &side, const string &type, string quantity, string stopPrice, string limitPrice)
{
    string clientOrderId = (type == TAKE_PROFIT_MARKET || type == STOP || type == LIMIT)
                               ? StringFormat("BFTP{}{}", symbol, getCurrentTime())
                               : StringFormat("BFSL{}{}", symbol, getCurrentTime());

    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", side},
        {"type", type},
        {"closePosition", "false"},
        // {"reduceOnly", "true"},
        {"quantity", quantity},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    if (type == LIMIT)
    {
        params["timeInForce"] = "GTC";
        params["price"] = limitPrice;
    }
    if (type != LIMIT)
    {
        params["stopPrice"] = stopPrice;
    }
    if (type == STOP)
    {
        params["price"] = limitPrice;
    }
    return sendOrder(params);
}

string BinanceFuture::sendOrder(const map<string, string> &params)
{
    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("{}/fapi/v1/order?{}", BASE_URL, query);

    try
    {
        LOGI("Sending order to Binance Future: {}", url);
        string res = Axios::post(url, "", "application/json", {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: {}", res);
        return res;
    }
    catch (const exception &e)
    {
        LOGE("Error sending order to Binance Future: {}", e.what());
        return "";
    }
}

string BinanceFuture::buildQuery(const map<string, string> &params)
{
    ostringstream oss;
    bool first = true;
    for (const auto &[k, v] : params)
    {
        if (!first)
            oss << "&";
        oss << k << "=" << v;
        first = false;
    }
    return oss.str();
}

string BinanceFuture::sign(const string &query)
{
    unsigned char *digest;
    digest = HMAC(EVP_sha256(),
                  secretKey.c_str(), secretKey.length(),
                  reinterpret_cast<const unsigned char *>(query.c_str()), query.length(),
                  NULL, NULL);

    ostringstream oss;
    for (int i = 0; i < 32; ++i)
        oss << hex << setw(2) << setfill('0') << (int)digest[i];
    return oss.str();
}

string BinanceFuture::cancelOrderByClientId(const string &symbol, const string &clientOrderId)
{
    map<string, string> params = {
        {"symbol", symbol},
        {"origClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("{}/fapi/v1/order?{}", BASE_URL, query);

    try
    {
        LOGI("Cancelling order by client ID on Binance Future: {}", url);
        string res = Axios::del(url, {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: {}", res);
        return res;
    }
    catch (const exception &e)
    {
        LOGE("Error cancelling order by client ID on Binance Future: {}", e.what());
        return "";
    }
}

string BinanceFuture::getOrderStatus(const string &symbol, const string &orderId)
{
    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"origClientOrderId", orderId},
        {"timestamp", to_string(getCurrentTime())}};

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("{}/fapi/v1/order?{}", BASE_URL, query);

    try
    {
        string res = Axios::get(url, {"X-MBX-APIKEY: " + apiKey});
        return res;
    }
    catch (const exception &e)
    {
        LOGE("Error getting order status from Binance Future: {}", e.what());
        return "";
    }
}

int BinanceFuture::insertOrderToDB(const string &symbol, const string clientOrderId, const string tpID, const string slID)
{
    auto &db = MySQLConnector::getInstance();
    string query = "INSERT INTO RealOrders(broker, symbol, entryID, tpID, slID, apiKey, secretKey, iv, botID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    vector<any> params = {
        "binance_future",
        symbol,
        clientOrderId,
        tpID,
        slID,
        encryptedApiKey,
        encryptedSecretKey,
        iv,
        botID};
    int res = db.executeUpdate(query, params);
    if (res <= 0)
    {
        LOGE("Insert order to database error");
    }
    else
    {
        LOGI("Insert order to database success {} {} {}", clientOrderId, tpID, slID);
    }
    return res;
}

bool BinanceFuture::changeLeverage(const string &symbol, int leverage)
{
    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"leverage", to_string(leverage)},
        {"timestamp", to_string(getCurrentTime())}};

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("{}/fapi/v1/leverage?{}", BASE_URL, query);

    try
    {
        LOGI("Changing leverage on Binance Future: {}", url);
        string res = Axios::post(url, "", "application/json", {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: {}", res);
        return true;
    }
    catch (const exception &e)
    {
        LOGE("Error changing leverage on Binance Future: {}", e.what());
        return false;
    }
}

bool BinanceFuture::changeMarginType(const string &symbol, const string &marginType)
{
    // marginType: "CROSSED" or "ISOLATED"
    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"marginType", marginType},
        {"timestamp", to_string(getCurrentTime())}};

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("{}/fapi/v1/marginType?{}", BASE_URL, query);

    try
    {
        LOGI("Changing margin type on Binance Future: {}", url);
        string res = Axios::post(url, "", "application/json", {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: {}", res);
        return true;
    }
    catch (const exception &e)
    {
        LOGE("Error changing margin type on Binance Future: {}", e.what());
        return false;
    }
}

int BinanceFuture::getOpenAlgoOrdersCount(const string &symbol)
{
    map<string, string> params = {
        {"symbol", symbol},
        {"recvWindow", "30000"},
        {"timestamp", to_string(getCurrentTime())}};

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("{}/fapi/v1/openOrders?{}", BASE_URL, query);

    try
    {
        LOGI("Fetching open orders from Binance Future: {}", url);
        string res = Axios::get(url, {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: {}", res);

        auto json = nlohmann::json::parse(res);
        int count = 0;

        for (const auto &order : json)
        {
            string type = order["origType"].get<string>();
            if (type == STOP ||
                type == STOP_MARKET ||
                type == TAKE_PROFIT ||
                type == TAKE_PROFIT_MARKET ||
                type == TRAILING_STOP_MARKET)
            {
                ++count;
            }
        }

        return count;
    }
    catch (const exception &e)
    {
        LOGE("Error getting open algo orders: {}", e.what());
        return -1;
    }
}