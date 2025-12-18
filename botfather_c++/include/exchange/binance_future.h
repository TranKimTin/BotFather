#pragma one

#include "common_type.h"
#include "exchange.h"

struct OrderCount{
    int buyOneSymbolBot;
    int sellOneSymbolBot;
    int buyAllSymbolBot;
    int sellAllSymbolBot;

    int buyOneSymbolAccount;
    int sellOneSymbolAccount;
    int buyAllSymbolAccount;
    int sellAllSymbolAccount;
};

class BinanceFuture : public IExchange
{
public:
    BinanceFuture(const string &apiKey, const string &encryptedSecretKey, const string &iv, shared_ptr<Bot> bot);

    string buyMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "", bool reduceOnly = false) override;
    string sellMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "", bool reduceOnly = false) override;
    string buyLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "", string expiredTime = "") override;
    string sellLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "", string expiredTime = "") override;
    string getOrderStatus(const string &symbol, const string &orderId) override;
    string cancelOrderByClientId(const string &symbol, const string &clientOrderId) override;
    bool changeLeverage(const string &symbol, int leverage) override;
    bool changeMarginType(const string &symbol, const string &marginType) override; // marginType: "CROSSED" or "ISOLATED"
    string placeBuyTPSL(const string &symbol, string &quantity, string &takeProfit, string &stopLoss, string &clientOrderId) override;
    string placeSellTPSL(const string &symbol, string &quantity, string &takeProfit, string &stopLoss, string &clientOrderId) override;
    string getPositionRisk() override;

private:
    string encryptedSecretKey;
    string iv;
    string apiKey;
    string secretKey;
    shared_ptr<Bot> bot;
    const string BASE_URL = "https://fapi.binance.com";
    
    // string BASE_URL = "https://demo-fapi.binance.com";
    // https://demo-fapi.binance.com
    // https://demo-dapi.binance.com
    // wss://fstream.binancefuture.com
    // wss://dstream.binancefuture.com
    // wss://testnet.binancefuture.com/ws-fapi/v1
    // wss://testnet.binancefuture.com/ws-dapi/v1

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

    string sendOrder(map<string, string> &params);
    string buildQuery(const map<string, string> &params);
    string sign(const string &query);

    string sendTPorSL(const string &symbol, const string &side, const string &type, string quantity, string stopPrice, string limitPrice = "");

    int insertOrderToDB(const string &symbol, const string clientOrderId, const string side, const string volume, const string tp, const string sl);
    int updateOrderToDB(const string &clientOrderId, const string &tpID, const string &slID);
    int removeOrderToDB(const string &clientOrderId);
    OrderCount getOpenOrdersCount(const string &symbol);
    bool isAlgoOrder(const string& clientOrderId);
    bool checkLimitOrder(const string& symbol, OrderCount& orderCount);
};