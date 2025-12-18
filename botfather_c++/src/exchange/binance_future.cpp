#include "binance_future.h"
#include "axios.h"
#include "util.h"
#include "mysql_connector.h"
#include <openssl/hmac.h>
#include <openssl/evp.h>

static void adjustClientOrderId(string &clientOrderId)
{
    constexpr size_t MAX_LEN = 36;
    if (clientOrderId.size() > MAX_LEN)
    {
        clientOrderId.resize(MAX_LEN);
    }
}

BinanceFuture::BinanceFuture(const string &apiKey, const string &encryptedSecretKey, const string &iv, shared_ptr<Bot> bot)
    : apiKey(apiKey), encryptedSecretKey(encryptedSecretKey), iv(iv), bot(bot)
{
    boost::unordered_flat_map<string, string> env = readEnvFile();
    secretKey = decryptAES(encryptedSecretKey, env["ENCRYP_KEY"], iv);
}

bool BinanceFuture::checkLimitOrder(const string &symbol, OrderCount &orderCount)
{
    int maxPerSymbolBot = bot->maxOpenOrderPerSymbolBot;
    int maxAllSymbolBot = bot->maxOpenOrderAllSymbolBot;
    int maxPerSymbolAccount = bot->maxOpenOrderPerSymbolAccount;
    int maxAllSymbolAccount = bot->maxOpenOrderAllSymbolAccount;

    if (orderCount.buyAllSymbolAccount + orderCount.sellAllSymbolAccount >= maxAllSymbolAccount)
    {
        LOGE("Max open order for all symbol in account reached ({}). Do nothing.", orderCount.buyAllSymbolAccount + orderCount.sellAllSymbolAccount);
        return false;
    }
    if (orderCount.buyOneSymbolAccount + orderCount.sellOneSymbolAccount >= maxPerSymbolAccount)
    {
        LOGE("Max open order for symbol {} in account reached ({}). Do nothing.", symbol, orderCount.buyOneSymbolAccount + orderCount.sellOneSymbolAccount);
        return false;
    }
    if (orderCount.buyAllSymbolBot + orderCount.sellAllSymbolBot >= maxAllSymbolBot)
    {
        LOGE("Max open order for all symbol in bot reached ({}). Do nothing.", orderCount.buyAllSymbolBot + orderCount.sellAllSymbolBot);
        return false;
    }
    if (orderCount.buyOneSymbolBot + orderCount.sellOneSymbolBot >= maxPerSymbolBot)
    {
        LOGE("Max open order for symbol {} in bot reached ({}). Do nothing.", symbol, orderCount.buyOneSymbolBot + orderCount.sellOneSymbolBot);
        return false;
    }
    return true;
}

string BinanceFuture::buyMarket(const string &symbol, string quantity,
                                string takeProfit, string stopLoss, bool reduceOnly)
{
    if (!takeProfit.empty() || !stopLoss.empty())
    {
        auto orderCount = getOpenOrdersCount(symbol);
        if (!checkLimitOrder(symbol, orderCount))
        {
            return "";
        }
        if (orderCount.sellOneSymbolAccount > 0)
        {
            LOGE("There are sell orders ({}). Do nothing.", orderCount.sellOneSymbolAccount);
            return "";
        }
        LOGI("openOrderCount: {}", orderCount.buyAllSymbolAccount + orderCount.sellAllSymbolAccount);
    }

    string clientOrderId = StringFormat("BFBM{}{}_{}", symbol, getCurrentTime(), bot->id);
    adjustClientOrderId(clientOrderId);

    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", BUY},
        {"type", MARKET},
        {"quantity", quantity},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    if (reduceOnly)
    {
        params["reduceOnly"] = "true";
    }

    string res = sendOrder(params);
    if (res.empty())
    {
        LOGE("Place entry error");
        return res;
    }

    if (!takeProfit.empty() || !stopLoss.empty())
    {
        insertOrderToDB(symbol, clientOrderId, BUY, quantity, takeProfit, stopLoss);
    }

    return clientOrderId;
}

string BinanceFuture::placeBuyTPSL(const string &symbol, string &quantity, string &takeProfit, string &stopLoss, string &clientOrderId)
{
    string tpID;
    string resTP = sendTPorSL(symbol, SELL, TAKE_PROFIT_MARKET, quantity, takeProfit, takeProfit);
    if (resTP.empty())
    {
        LOGI("Place TP error. Close position");
        SLEEP_FOR(1000);
        removeOrderToDB(clientOrderId);
        return sellMarket(symbol, quantity, "", "", true);
    }
    else
    {
        json j = json::parse(resTP);
        tpID = j["clientAlgoId"].get<string>();
        LOGI("TP order id: {}", tpID);
    }

    string slID;
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
        SLEEP_FOR(1000);
        removeOrderToDB(clientOrderId);
        return sellMarket(symbol, quantity, "", "", true);
    }
    else
    {
        json j = json::parse(resSL);
        slID = j["clientAlgoId"].get<string>();
        LOGI("SL order id: {}", slID);
    }

    updateOrderToDB(clientOrderId, tpID, slID);

    return clientOrderId;
}

string BinanceFuture::sellMarket(const string &symbol, string quantity, string takeProfit, string stopLoss, bool reduceOnly)
{
    if (!takeProfit.empty() || !stopLoss.empty())
    {
        auto orderCount = getOpenOrdersCount(symbol);
        if (!checkLimitOrder(symbol, orderCount))
        {
            return "";
        }
        if (orderCount.buyOneSymbolAccount > 0)
        {
            LOGE("There are buy orders ({}). Do nothing.", orderCount.buyOneSymbolAccount);
            return "";
        }
        LOGI("openOrderCount: {}", orderCount.buyAllSymbolAccount + orderCount.sellAllSymbolAccount);
    }

    string clientOrderId = StringFormat("BFSM{}{}_{}", symbol, getCurrentTime(), bot->id);
    adjustClientOrderId(clientOrderId);

    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", SELL},
        {"type", MARKET},
        {"quantity", quantity},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    if (reduceOnly)
    {
        params["reduceOnly"] = "true";
    }

    string res = sendOrder(params);
    if (res.empty())
    {
        LOGE("Place entry error");
        return res;
    }

    if (!takeProfit.empty() || !stopLoss.empty())
    {
        insertOrderToDB(symbol, clientOrderId, SELL, quantity, takeProfit, stopLoss);
    }
    return clientOrderId;
}

string BinanceFuture::placeSellTPSL(const string &symbol, string &quantity, string &takeProfit, string &stopLoss, string &clientOrderId)
{
    string tpID;
    string resTP = sendTPorSL(symbol, BUY, TAKE_PROFIT_MARKET, quantity, takeProfit, takeProfit);
    if (resTP.empty())
    {
        LOGI("Place TP error. Close position");
        SLEEP_FOR(1000);
        removeOrderToDB(clientOrderId);
        return buyMarket(symbol, quantity, "", "", true);
    }
    else
    {
        json j = json::parse(resTP);
        tpID = j["clientAlgoId"].get<string>();
        LOGI("TP order id: {}", tpID);
    }

    string slID;
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
        SLEEP_FOR(1000);
        removeOrderToDB(clientOrderId);
        return buyMarket(symbol, quantity, "", "", true);
    }
    else
    {
        json j = json::parse(resSL);
        slID = j["clientAlgoId"].get<string>();
        LOGI("SL order id: {}", slID);
    }

    updateOrderToDB(clientOrderId, tpID, slID);

    return clientOrderId;
}

string BinanceFuture::buyLimit(const string &symbol, string quantity, string price, string takeProfit, string stopLoss, string expiredTime)
{
    if (!takeProfit.empty() || !stopLoss.empty())
    {
        auto orderCount = getOpenOrdersCount(symbol);
        if (!checkLimitOrder(symbol, orderCount))
        {
            return "";
        }
        if (orderCount.sellOneSymbolAccount > 0)
        {
            LOGE("There are sell orders ({}). Do nothing.", orderCount.sellOneSymbolAccount);
            return "";
        }
        LOGI("openOrderCount: {}", orderCount.buyAllSymbolAccount + orderCount.sellAllSymbolAccount);
    }

    string clientOrderId = StringFormat("BFBL{}{}_{}", symbol, getCurrentTime(), bot->id);
    adjustClientOrderId(clientOrderId);

    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", BUY},
        {"type", LIMIT},
        {"quantity", quantity},
        {"price", price},
        {"timeInForce", "GTC"},
        // {"selfTradePreventionMode", "NONE"},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    if (!expiredTime.empty() && expiredTime != "0")
    {
        params["timeInForce"] = "GTD";
        params["goodTillDate"] = expiredTime;
    }
    if (takeProfit.empty() && stopLoss.empty())
    {
        params["reduceOnly"] = "true";
    }

    string res = sendOrder(params);
    if (res.empty())
    {
        LOGE("Place entry error");
        return res;
    }

    if (!takeProfit.empty() || !stopLoss.empty())
    {
        insertOrderToDB(symbol, clientOrderId, BUY, quantity, takeProfit, stopLoss);
    }
    return clientOrderId;
}

string BinanceFuture::sellLimit(const string &symbol, string quantity, string price, string takeProfit, string stopLoss, string expiredTime)
{
    if (!takeProfit.empty() || !stopLoss.empty())
    {
        auto orderCount = getOpenOrdersCount(symbol);
        if (!checkLimitOrder(symbol, orderCount))
        {
            return "";
        }
        if (orderCount.buyOneSymbolAccount > 0)
        {
            LOGE("There are buy orders ({}). Do nothing.", orderCount.sellOneSymbolAccount);
            return "";
        }
        LOGI("openOrderCount: {}", orderCount.buyAllSymbolAccount + orderCount.sellAllSymbolAccount);
    }

    string clientOrderId = StringFormat("BFSL{}{}_{}", symbol, getCurrentTime(), bot->id);
    adjustClientOrderId(clientOrderId);

    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"side", SELL},
        {"type", LIMIT},
        {"quantity", quantity},
        {"price", price},
        {"timeInForce", "GTC"},
        // {"selfTradePreventionMode", "NONE"},
        {"newClientOrderId", clientOrderId},
        {"timestamp", to_string(getCurrentTime())}};

    if (!expiredTime.empty() && expiredTime != "0")
    {
        params["timeInForce"] = "GTD";
        params["goodTillDate"] = expiredTime;
    }
    if (takeProfit.empty() && stopLoss.empty())
    {
        params["reduceOnly"] = "true";
    }

    string res = sendOrder(params);
    if (res.empty())
    {
        LOGE("Place entry error");
        return res;
    }

    if (!takeProfit.empty() || !stopLoss.empty())
    {
        insertOrderToDB(symbol, clientOrderId, SELL, quantity, takeProfit, stopLoss);
    }
    return clientOrderId;
}

string BinanceFuture::sendTPorSL(const string &symbol, const string &side, const string &type, string quantity, string stopPrice, string limitPrice)
{
    string clientAlgoId = (type == TAKE_PROFIT_MARKET || type == STOP || type == LIMIT)
                              ? StringFormat("BF_TP{}{}_{}", symbol, getCurrentTime(), bot->id)
                              : StringFormat("BF_SL{}{}_{}", symbol, getCurrentTime(), bot->id);
    adjustClientOrderId(clientAlgoId);

    map<string, string> params = {
        {"recvWindow", "30000"},
        {"algoType", "CONDITIONAL"},
        {"symbol", symbol},
        {"side", side},
        {"type", type},
        {"closePosition", "false"},
        {"reduceOnly", "true"},
        {"quantity", quantity},
        {"clientAlgoId", clientAlgoId},
        {"timestamp", to_string(getCurrentTime())}};

    if (type != LIMIT)
    {
        params["triggerPrice"] = stopPrice;
    }
    if (type == STOP || type == TAKE_PROFIT)
    {
        params["price"] = limitPrice;
    }
    return sendOrder(params);
}

string BinanceFuture::sendOrder(map<string, string> &params)
{
    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    bool isAlgo = params.find("algoType") != params.end();

    string url = isAlgo ? StringFormat("{}/fapi/v1/algoOrder?{}", BASE_URL, query) : StringFormat("{}/fapi/v1/order?{}", BASE_URL, query);

    try
    {
        LOGI("Sending order to Binance Future: {}", url);
        string res = Axios::post(url, "", "application/json", {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: {}", res);
        return res;
    }
    catch (RequestException &e)
    {
        LOGE("Error sending order to Binance Future: code: {}, {}", e.errorCode(), e.what());
        int errorCode = e.errorCode();
        if (errorCode == -2021) // Order would immediately trigger
        {
            LOGI("Retry order");
            string &type = params["type"];

            if (type == STOP || type == TAKE_PROFIT)
            {
                params["type"] = LIMIT;
                params["timestamp"] = to_string(getCurrentTime());
                params["timeInForce"] = "GTC";
                params.erase("triggerPrice");
                params.erase("algoType");
                return sendOrder(params);
            }
            else if (type == STOP_MARKET || type == TAKE_PROFIT_MARKET)
            {
                params["type"] = MARKET;
                params["timestamp"] = to_string(getCurrentTime());
                params.erase("triggerPrice");
                params.erase("algoType");
                return sendOrder(params);
            }
            else
            {
                return "";
            }
        }
    }
    catch (const exception &e)
    {
        LOGE("Error sending order to Binance Future: {}", e.what());
        return "";
    }
    return "";
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

// string BinanceFuture::sign(const string &query)
// {
//     unsigned char *digest;
//     digest = HMAC(EVP_sha256(),
//                   secretKey.c_str(), secretKey.length(),
//                   reinterpret_cast<const unsigned char *>(query.c_str()), query.length(),
//                   NULL, NULL);

//     ostringstream oss;
//     for (int i = 0; i < 32; ++i)
//         oss << hex << setw(2) << setfill('0') << (int)digest[i];
//     return oss.str();
// }

string BinanceFuture::sign(const string &query)
{
    string result;
    unsigned char out[EVP_MAX_MD_SIZE];
    size_t out_len = 0;

    EVP_MAC *mac = EVP_MAC_fetch(NULL, "HMAC", NULL); // lấy MAC = HMAC
    EVP_MAC_CTX *ctx = EVP_MAC_CTX_new(mac);          // tạo context

    OSSL_PARAM params[] = {
        OSSL_PARAM_construct_utf8_string("digest", const_cast<char *>("SHA256"), 0),
        OSSL_PARAM_END};

    // init với secretKey
    if (!EVP_MAC_init(ctx,
                      reinterpret_cast<const unsigned char *>(secretKey.c_str()),
                      secretKey.size(),
                      params))
    {
        EVP_MAC_CTX_free(ctx);
        EVP_MAC_free(mac);
        throw runtime_error("EVP_MAC_init failed");
    }

    // update với query
    EVP_MAC_update(ctx,
                   reinterpret_cast<const unsigned char *>(query.c_str()),
                   query.size());

    // final
    EVP_MAC_final(ctx, out, &out_len, sizeof(out));

    // cleanup
    EVP_MAC_CTX_free(ctx);
    EVP_MAC_free(mac);

    // convert sang hex string
    ostringstream oss;
    oss << hex << setfill('0');
    for (size_t i = 0; i < out_len; i++)
        oss << setw(2) << (int)out[i];
    result = oss.str();

    return result;
}

string BinanceFuture::cancelOrderByClientId(const string &symbol, const string &clientOrderId)
{
    bool isAlgo = isAlgoOrder(clientOrderId);

    map<string, string> params = {
        {"symbol", symbol},
        {"timestamp", to_string(getCurrentTime())}};

    if (isAlgo)
    {
        params["clientalgoid"] = clientOrderId;
    }
    else
    {
        params["origClientOrderId"] = clientOrderId;
    }

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = isAlgo ? StringFormat("{}/fapi/v1/algoOrder?{}", BASE_URL, query) : StringFormat("{}/fapi/v1/order?{}", BASE_URL, query);

    try
    {
        LOGI("Cancelling order by client ID on Binance Future: {}", url);
        string res = Axios::del(url, {"X-MBX-APIKEY: " + apiKey});
        LOGI("Response from Binance Future: {}", res);

        json j = json::parse(res);
        if (j.contains("status") && j["status"].get<string>() == "CANCELED")
        {
            string executedQty = j["executedQty"].get<string>();

            if (stod(executedQty) > 0)
            {
                LOGE("order partially filled {}. Try to close position", stod(executedQty));
                string side = j["side"].get<string>();
                string result = (side == BUY) ? sellMarket(symbol, executedQty, "", "", true) : buyMarket(symbol, executedQty, "", "", true);
                LOGI("Response from Binance Future: {}", result);
                return result;
            }
        }

        return res;
    }
    catch (const exception &e)
    {
        LOGE("Error cancelling order by client ID on Binance Future: {}", e.what());
        return "";
    }
    return "";
}

string BinanceFuture::getOrderStatus(const string &symbol, const string &orderId)
{
    bool isAlgo = isAlgoOrder(orderId);

    map<string, string> params = {
        {"recvWindow", "30000"},
        {"symbol", symbol},
        {"timestamp", to_string(getCurrentTime())}};

    if (isAlgo)
    {
        params["clientAlgoId"] = orderId;
    }
    else
    {
        params["origClientOrderId"] = orderId;
    }

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = isAlgo ? StringFormat("{}/fapi/v1/algoOrder?{}", BASE_URL, query) : StringFormat("{}/fapi/v1/order?{}", BASE_URL, query);

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
    return "";
}

int BinanceFuture::insertOrderToDB(const string &symbol, const string clientOrderId, const string side, const string volume, const string tp, const string sl)
{
    auto &db = MySQLConnector::getInstance();
    string query = "INSERT INTO RealOrders(broker, symbol, entryID, tpID, slID, apiKey, secretKey, iv, botID, side, volume, tp, sl) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    vector<any> params = {
        "binance_future",
        symbol,
        clientOrderId,
        "",
        "",
        apiKey,
        encryptedSecretKey,
        iv,
        bot->id,
        side,
        volume,
        tp,
        sl};
    int res = db.executeUpdate(query, params);
    if (res <= 0)
    {
        LOGE("Insert order to database error {} {} {} {}", clientOrderId, volume, tp, sl);
    }
    else
    {
        LOGI("Insert order to database success {} {} {} {}", clientOrderId, volume, tp, sl);
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
    return false;
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
    return false;
}

OrderCount BinanceFuture::getOpenOrdersCount(const string &symbol)
{
    OrderCount result = {0, 0, 0, 0, 0, 0, 0, 0};
    string sql = "SELECT symbol, side, botID, apiKey FROM RealOrders WHERE broker = ? AND (botID = ? OR apiKey = ?)";
    auto &db = MySQLConnector::getInstance();
    vector<any> params = {
        "binance_future",
        bot->id,
        apiKey};
    auto res = db.executeQuery(sql, params);
    for (auto &row : res)
    {
        string orderSymbol = any_cast<string>(row.at("symbol"));
        string orderSide = any_cast<string>(row.at("side"));
        int orderBotID = any_cast<int>(row.at("botID"));
        string orderApiKey = any_cast<string>(row.at("apiKey"));

        if (symbol == orderSymbol)
        {
            if (bot->id == orderBotID)
            {
                if (orderSide == BUY)
                {
                    result.buyOneSymbolBot++;
                }
                else if (orderSide == SELL)
                {
                    result.sellOneSymbolBot++;
                }
            }
            if (apiKey == orderApiKey)
            {
                if (orderSide == BUY)
                {
                    result.buyOneSymbolAccount++;
                }
                else if (orderSide == SELL)
                {
                    result.sellOneSymbolAccount++;
                }
            }
        }

        // all symbol
        if (bot->id == orderBotID)
        {
            if (orderSide == BUY)
            {
                result.buyAllSymbolBot++;
            }
            else if (orderSide == SELL)
            {
                result.sellAllSymbolBot++;
            }
        }
        if (apiKey == orderApiKey)
        {
            if (orderSide == BUY)
            {
                result.buyAllSymbolAccount++;
            }
            else if (orderSide == SELL)
            {
                result.sellAllSymbolAccount++;
            }
        }
    }
    return result;
}

int BinanceFuture::updateOrderToDB(const string &clientOrderId, const string &tpID, const string &slID)
{
    auto &db = MySQLConnector::getInstance();
    string query = "UPDATE RealOrders SET tpID = ?, slID = ? WHERE entryID = ?";
    vector<any> params = {
        tpID,
        slID,
        clientOrderId};
    int res = db.executeUpdate(query, params);
    if (res <= 0)
    {
        LOGE("Update order to database error {} {} {}", clientOrderId, tpID, slID);
    }
    else
    {
        LOGI("Update order to database success {} {} {}", clientOrderId, tpID, slID);
    }
    return res;
}

int BinanceFuture::removeOrderToDB(const string &clientOrderId)
{
    auto &db = MySQLConnector::getInstance();
    string query = "DELETE FROM RealOrders WHERE entryID = ?";
    vector<any> params = {
        clientOrderId};
    int res = db.executeUpdate(query, params);
    if (res <= 0)
    {
        LOGE("Remove order from database error {}", clientOrderId);
    }
    else
    {
        LOGI("Remove order from database success {}", clientOrderId);
    }
    return res;
}

string BinanceFuture::getPositionRisk()
{
    map<string, string> params = {
        {"recvWindow", "30000"},
        {"timestamp", to_string(getCurrentTime())}};

    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    string url = StringFormat("{}/fapi/v3/positionRisk?{}", BASE_URL, query);

    try
    {
        return Axios::get(url, {"X-MBX-APIKEY: " + apiKey});
    }
    catch (const exception &e)
    {
        LOGE("Error getting position risk from Binance Future: {}", e.what());
        return "";
    }
    return "";
}

bool BinanceFuture::isAlgoOrder(const string &clientOrderId)
{
    return clientOrderId[2] == '_'; // BF_TP or BF_SL
}