#pragma one

#include "common_type.h"
#include "exchange.h"

class BinanceFuture : public IExchange
{
public:
    BinanceFuture(const string &apiKey, const string &secretKey);

    string buyMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "") override;
    string sellMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "") override;
    string buyLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "") override;
    string sellLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "") override;
    string getOrderStatus(const string &symbol, const string &orderId) override;
    string cancelOrderByClientId(const string &symbol, const string &clientOrderId) override;

private:
    string apiKey;
    string secretKey;
    // string BASE_URL = "https://fapi.binance.com";
    string BASE_URL = "https://testnet.binancefuture.com";

    string sendOrder(const map<string, string> &params);
    string buildQuery(const map<string, string> &params);
    string sign(const string &query);

    string sendTPorSL(const string &symbol, const string &side, const string &type, string quantity, string triggerPrice);
};