#include "binance_future.h"
#include "axios.h"
#include "util.h"
#include <openssl/hmac.h>
#include <openssl/evp.h>

BinanceFuture::BinanceFuture(const string &apiKey, const string &secretKey)
    : apiKey(apiKey), secretKey(secretKey) {}

string BinanceFuture::buyMarket(const string &symbol, string quantity,
                                string takeProfit, string stopLoss)
{
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", "BUY"},
        {"type", "MARKET"},
        {"quantity", quantity},
        {"timestamp", to_string(getCurrentTime())}};

    string res = sendOrder(params);
    if (!takeProfit.empty())
        sendTPorSL(symbol, "SELL", "TAKE_PROFIT_MARKET", quantity, takeProfit);
    if (!stopLoss.empty())
        sendTPorSL(symbol, "SELL", "STOP_MARKET", quantity, stopLoss);
    return res;
}

string BinanceFuture::sellMarket(const string &symbol, string quantity,
                                 string takeProfit, string stopLoss)
{
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", "SELL"},
        {"type", "MARKET"},
        {"quantity", quantity},
        {"timestamp", to_string(getCurrentTime())}};

    string res = sendOrder(params);
    if (!takeProfit.empty())
        sendTPorSL(symbol, "BUY", "TAKE_PROFIT_MARKET", quantity, takeProfit);
    if (!stopLoss.empty())
        sendTPorSL(symbol, "BUY", "STOP_MARKET", quantity, stopLoss);
    return res;
}

string BinanceFuture::buyLimit(const string &symbol, string quantity, string price,
                               string takeProfit, string stopLoss)
{
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", "BUY"},
        {"type", "LIMIT"},
        {"quantity", quantity},
        {"price", price},
        {"timeInForce", "GTC"},
        {"timestamp", to_string(getCurrentTime())}};

    string res = sendOrder(params);
    if (!takeProfit.empty())
        sendTPorSL(symbol, "SELL", "TAKE_PROFIT_MARKET", quantity, takeProfit);
    if (!stopLoss.empty())
        sendTPorSL(symbol, "SELL", "STOP_MARKET", quantity, stopLoss);
    return res;
}

string BinanceFuture::sellLimit(const string &symbol, string quantity, string price,
                                string takeProfit, string stopLoss)
{
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", "SELL"},
        {"type", "LIMIT"},
        {"quantity", quantity},
        {"price", price},
        {"timeInForce", "GTC"},
        {"timestamp", to_string(getCurrentTime())}};

    string res = sendOrder(params);
    if (!takeProfit.empty())
        sendTPorSL(symbol, "BUY", "TAKE_PROFIT_MARKET", quantity, takeProfit);
    if (!stopLoss.empty())
        sendTPorSL(symbol, "BUY", "STOP_MARKET", quantity, stopLoss);
    return res;
}

string BinanceFuture::sendTPorSL(const string &symbol, const string &side,
                                 const string &type, string quantity, string triggerPrice)
{
    map<string, string> params = {
        {"recvWindow", "5000"},
        {"symbol", symbol},
        {"side", side},
        {"type", type},
        {"stopPrice", triggerPrice},
        {"closePosition", "true"},
        {"quantity", quantity},
        {"timestamp", to_string(getCurrentTime())}};
    return sendOrder(params);
}

string BinanceFuture::sendOrder(const map<string, string> &params)
{
    string query = buildQuery(params);
    string signature = sign(query);
    query += "&signature=" + signature;

    // string url = "https://fapi.binance.com/fapi/v1/order?" + query;
    string url = "https://testnet.binancefuture.com/fapi/v1/order?" + query;

    return Axios::post(url, "", "application/json", {"X-MBX-APIKEY: " + apiKey});
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
