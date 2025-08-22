#pragma one

#include "common_type.h"
#include "exchange.h"

class BinanceFuture : public IExchange
{
public:
    BinanceFuture(const string &encryptedApiKey, const string &encryptedSecretKey, const string &iv, const int botID);

    string buyMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "", bool reduceOnly = false) override;
    string sellMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "", bool reduceOnly = false) override;
    string buyLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "", string expiredTime = "") override;
    string sellLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "", string expiredTime = "") override;
    string getOrderStatus(const string &symbol, const string &orderId) override;
    string cancelOrderByClientId(const string &symbol, const string &clientOrderId) override;
    bool changeLeverage(const string &symbol, int leverage) override;
    bool changeMarginType(const string &symbol, const string &marginType) override; // marginType: "CROSSED" or "ISOLATED"

private:
    string encryptedApiKey;
    string encryptedSecretKey;
    string iv;
    string apiKey;
    string secretKey;
    int botID;
    const string BASE_URL = "https://fapi.binance.com";
    // string BASE_URL = "https://testnet.binancefuture.com";

    const int MAX_NUM_ALGO_ORDERS = 10;
    const string SELL = "SELL";
    const string BUY = "BUY";
    const string MARKET = "MARKET";
    const string LIMIT = "LIMIT";
    const string STOP = "STOP";
    const string STOP_MARKET = "STOP_MARKET";
    const string TAKE_PROFIT = "TAKE_PROFIT";
    const string TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET";
    const string TRAILING_STOP_MARKET = "TRAILING_STOP_MARKET";

    string sendOrder(const map<string, string> &params);
    string buildQuery(const map<string, string> &params);
    string sign(const string &query);

    string sendTPorSL(const string &symbol, const string &side, const string &type, string quantity, string stopPrice, string limitPrice = "");
    string placeBuyMarketTPSL(const string &symbol, string &quantity, string &takeProfit, string &stopLoss, string &clientOrderId);
    string placeSellMarketTPSL(const string &symbol, string &quantity, string &takeProfit, string &stopLoss, string &clientOrderId);

    int insertOrderToDB(const string &symbol, const string clientOrderId, const string tpID, const string slID);
    int getOpenAlgoOrdersCount(const string &symbol);
};