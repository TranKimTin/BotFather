#include "binance_future.h"
#include "axios.h"
#include "util.h"
#include "mysql_connector.h"
#include <openssl/hmac.h>
#include <openssl/evp.h>

BinanceFuture::BinanceFuture(const string &apiKey, const string &secretKey)
    : apiKey(apiKey), secretKey(secretKey) {}

string BinanceFuture::buyMarket(const string &symbol, string quantity,
                                string takeProfit, string stopLoss)
{
    string clientOrderId = StringFormat("BFBM%s%lld", symbol.c_str(), getCurrentTime());
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", "BUY"},
        {"type", "MARKET"},
        {"quantity", quantity},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    string res = sendOrder(params);
    if (res == "")
        return res;

    string tpID;

    if (!takeProfit.empty())
    {
        string resTP = sendTPorSL(symbol, "SELL", "TAKE_PROFIT_MARKET", quantity, takeProfit);
        if (resTP == "")
        {
            LOGI("Place TP error. Close position");
            return sellMarket(symbol, quantity, "", "");
        }
        else
        {
            json j = json::parse(resTP);
            tpID = j["clientOrderId"].get<string>();
            LOGI("TP order id: %s", tpID.c_str());
        }
    }
    string slID;
    if (!stopLoss.empty())
    {
        string resSL = sendTPorSL(symbol, "SELL", "STOP_MARKET", quantity, stopLoss);
        if (resSL == "")
        {
            LOGI("Place SL error");
            if (!tpID.empty())
            {
                LOGI("Cancel TP order %s", tpID.c_str());
                cancelOrderByClientId(symbol, tpID);
            }
            LOGI("Close position");
            return sellMarket(symbol, quantity, "", "");
        }
        else
        {
            json j = json::parse(resSL);
            slID = j["clientOrderId"].get<string>();
            LOGI("SL order id: %s", slID.c_str());
        }
    }
    if (!tpID.empty() && !slID.empty())
    {
        auto &db = MySQLConnector::getInstance();
        string query = "INSERT INTO RealOrders(broker, symbol, entryID, tpID, slID) VALUES(?, ?, ?, ?, ?)";
        vector<any> params = {
            "binance_future",
            symbol,
            clientOrderId,
            tpID,
            slID};
        auto res = db.executeUpdate(query, params);
        if (res <= 0)
        {
            LOGE("Insert order to database error");
        }
        else
        {
            LOGI("Insert order to database success %s %s %s", clientOrderId.c_str(), tpID.c_str(), slID.c_str());
        }
    }
    return res;
}

string BinanceFuture::sellMarket(const string &symbol, string quantity,
                                 string takeProfit, string stopLoss)
{
    string clientOrderId = StringFormat("BFSM%s%lld", symbol.c_str(), getCurrentTime());
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", "SELL"},
        {"type", "MARKET"},
        {"quantity", quantity},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    string res = sendOrder(params);
    if (res == "")
        return res;

    string tpID;
    if (!takeProfit.empty())
    {
        string resTP = sendTPorSL(symbol, "BUY", "TAKE_PROFIT_MARKET", quantity, takeProfit);
        if (resTP == "")
        {
            LOGI("Place TP error. Close position");
            return buyMarket(symbol, quantity, "", "");
        }
        else
        {
            json j = json::parse(resTP);
            tpID = j["clientOrderId"].get<string>();
            LOGI("TP order id: %s", tpID.c_str());
        }
    }

    string slID;
    if (!stopLoss.empty())
    {
        string resSL = sendTPorSL(symbol, "BUY", "STOP_MARKET", quantity, stopLoss);
        if (resSL == "")
        {
            LOGI("Place SL error");
            if (!tpID.empty())
            {
                LOGI("Cancel TP order %s", tpID.c_str());
                cancelOrderByClientId(symbol, tpID);
            }
            LOGI("Close position");
            return buyMarket(symbol, quantity, "", "");
        }
        else
        {
            json j = json::parse(resSL);
            slID = j["clientOrderId"].get<string>();
            LOGI("SL order id: %s", slID.c_str());
        }
    }
    if (!tpID.empty() && !slID.empty())
    {
        auto &db = MySQLConnector::getInstance();
        string query = "INSERT INTO RealOrders(broker, symbol, entryID, tpID, slID) VALUES(?, ?, ?, ?, ?)";
        vector<any> params = {
            "binance_future",
            symbol,
            clientOrderId,
            tpID,
            slID};
        auto res = db.executeUpdate(query, params);
        if (res <= 0)
        {
            LOGE("Insert order to database error");
        }
        else
        {
            LOGI("Insert order to database success %s %s %s", clientOrderId.c_str(), tpID.c_str(), slID.c_str());
        }
    }
    return res;
}

string BinanceFuture::buyLimit(const string &symbol, string quantity, string price,
                               string takeProfit, string stopLoss)
{
    string clientOrderId = StringFormat("BFBL%s%lld", symbol.c_str(), getCurrentTime());
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", "BUY"},
        {"type", "LIMIT"},
        {"quantity", quantity},
        {"price", price},
        {"timeInForce", "GTC"},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    string res = sendOrder(params);
    if (res == "")
        return res;

    string tpID;

    if (!takeProfit.empty())
    {
        string resTP = sendTPorSL(symbol, "SELL", "TAKE_PROFIT_MARKET", quantity, takeProfit);
        if (resTP == "")
        {
            LOGI("Place TP error. Close position");
            string resCancel = cancelOrderByClientId(symbol, clientOrderId);
            if (resCancel == "")
            {
                LOGI("Cancel order %s error", clientOrderId.c_str());
                LOGI("Close position");
                return sellMarket(symbol, quantity, "", "");
            }
            return resTP;
        }
        else
        {
            json j = json::parse(resTP);
            tpID = j["clientOrderId"].get<string>();
            LOGI("TP order id: %s", tpID.c_str());
        }
    }

    string slID;
    if (!stopLoss.empty())
    {
        string resSL = sendTPorSL(symbol, "SELL", "STOP_MARKET", quantity, stopLoss);
        if (resSL == "")
        {
            LOGI("Place SL error");
            if (!tpID.empty())
            {
                LOGI("Cancel TP order %s", tpID.c_str());
                cancelOrderByClientId(symbol, tpID);
            }

            LOGI("Close position");
            string resCancel = cancelOrderByClientId(symbol, clientOrderId);
            if (resCancel == "")
            {
                LOGI("Cancel order %s error", clientOrderId.c_str());
                return sellMarket(symbol, quantity, "", "");
            }
        }
        else
        {
            json j = json::parse(resSL);
            slID = j["clientOrderId"].get<string>();
            LOGI("SL order id: %s", slID.c_str());
        }
    }

    if (!tpID.empty() && !slID.empty())
    {
        auto &db = MySQLConnector::getInstance();
        string query = "INSERT INTO RealOrders(broker, symbol, entryID, tpID, slID) VALUES(?, ?, ?, ?, ?)";
        vector<any> params = {
            "binance_future",
            symbol,
            clientOrderId,
            tpID,
            slID};
        auto res = db.executeUpdate(query, params);
        if (res <= 0)
        {
            LOGE("Insert order to database error");
        }
        else
        {
            LOGI("Insert order to database success %s %s %s", clientOrderId.c_str(), tpID.c_str(), slID.c_str());
        }
    }

    return res;
}

string BinanceFuture::sellLimit(const string &symbol, string quantity, string price,
                                string takeProfit, string stopLoss)
{
    string clientOrderId = StringFormat("BFSL%s%lld", symbol.c_str(), getCurrentTime());
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", "SELL"},
        {"type", "LIMIT"},
        {"quantity", quantity},
        {"price", price},
        {"timeInForce", "GTC"},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    string res = sendOrder(params);
    if (res == "")
        return res;

    string tpID;

    if (!takeProfit.empty())
    {
        string resTP = sendTPorSL(symbol, "BUY", "TAKE_PROFIT_MARKET", quantity, takeProfit);
        if (resTP == "")
        {
            LOGI("Place TP error. Close position");
            string resCancel = cancelOrderByClientId(symbol, clientOrderId);
            if (resCancel == "")
            {
                LOGI("Cancel order %s error", clientOrderId.c_str());
                LOGI("Close position");
                return buyMarket(symbol, quantity, "", "");
            }
            return resTP;
        }
        else
        {
            json j = json::parse(resTP);
            tpID = j["clientOrderId"].get<string>();
            LOGI("TP order id: %s", tpID.c_str());
        }
    }

    string slID;
    if (!stopLoss.empty())
    {
        string resSL = sendTPorSL(symbol, "BUY", "STOP_MARKET", quantity, stopLoss);
        if (resSL == "")
        {
            LOGI("Place SL error");
            if (!tpID.empty())
            {
                LOGI("Cancel TP order %s", tpID.c_str());
                cancelOrderByClientId(symbol, tpID);
            }

            LOGI("Close position");
            string resCancel = cancelOrderByClientId(symbol, clientOrderId);
            if (resCancel == "")
            {
                LOGI("Cancel order %s error", clientOrderId.c_str());
                return buyMarket(symbol, quantity, "", "");
            }
        }
        else
        {
            json j = json::parse(resSL);
            slID = j["clientOrderId"].get<string>();
            LOGI("SL order id: %s", slID.c_str());
        }
    }
    if (!tpID.empty() && !slID.empty())
    {
        auto &db = MySQLConnector::getInstance();
        string query = "INSERT INTO RealOrders(broker, symbol, entryID, tpID, slID) VALUES(?, ?, ?, ?, ?)";
        vector<any> params = {
            "binance_future",
            symbol,
            clientOrderId,
            tpID,
            slID};
        auto res = db.executeUpdate(query, params);
        if (res <= 0)
        {
            LOGE("Insert order to database error");
        }
        else
        {
            LOGI("Insert order to database success %s %s %s", clientOrderId.c_str(), tpID.c_str(), slID.c_str());
        }
    }
    return res;
}

string BinanceFuture::sendTPorSL(const string &symbol, const string &side, const string &type, string quantity, string triggerPrice)
{
    string clientOrderId = (type == "TAKE_PROFIT_MARKET")
                               ? StringFormat("BFTP%s%lld", symbol.c_str(), getCurrentTime())
                               : StringFormat("BFSL%s%lld", symbol.c_str(), getCurrentTime());

    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", side},
        {"type", type},
        {"stopPrice", triggerPrice},
        {"closePosition", "false"},
        {"reduceOnly", "true"},
        {"quantity", quantity},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};
    return sendOrder(params);
}

string BinanceFuture::sendOrder(const map<string, string> &params)
{
    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("%s/fapi/v1/order?%s", BASE_URL.c_str(), query.c_str());

    try
    {
        LOGI("Sending order to Binance Future: %s", url.c_str());
        string res = Axios::post(url, "", "application/json", {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: %s", res.c_str());
        return res;
    }
    catch (const exception &e)
    {
        LOGE("Error sending order to Binance Future: %s", e.what());
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

    string url = StringFormat("%s/fapi/v1/order?%s", BASE_URL.c_str(), query.c_str());

    try
    {
        LOGI("Cancelling order by client ID on Binance Future: %s", url.c_str());
        string res = Axios::del(url, {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: %s", res.c_str());
        return res;
    }
    catch (const exception &e)
    {
        LOGE("Error cancelling order by client ID on Binance Future: %s", e.what());
        return "";
    }
}

string BinanceFuture::getOrderStatus(const string &symbol, const string &orderId)
{
    map<string, string> params = {
        {"symbol", symbol},
        {"origClientOrderId", orderId},
        {"timestamp", to_string(getCurrentTime())}};

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("%s/fapi/v1/order?%s", BASE_URL.c_str(), query.c_str());

    try
    {
        string res = Axios::get(url, {"X-MBX-APIKEY: " + apiKey});
        return res;
    }
    catch (const exception &e)
    {
        LOGE("Error getting order status from Binance Future: %s", e.what());
        return "";
    }
}