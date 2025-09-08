// #pragma one

// #include "common_type.h"
// #include "exchange.h"

// class BinanceSpot : public IExchange
// {
// public:
//     BinanceSpot(const string &encryptedApiKey, const string &encryptedSecretKey, const string &iv, const int botID);

//     string buyMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "") override;
//     string sellMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "") override;
//     string buyLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "", string expiredTime = "") override;
//     string sellLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "", string expiredTime = "") override;
//     string getOrderStatus(const string &symbol, const string &orderId) override;
//     string cancelOrderByClientId(const string &symbol, const string &clientOrderId) override;
//     bool changeLeverage(const string &symbol, int leverage) override;
//     bool changeMarginType(const string &symbol, const string &marginType) override; // marginType: "CROSSED" or "ISOLATED"

// private:
//     string encryptedApiKey;
//     string encryptedSecretKey;
//     string iv;
//     string apiKey;
//     string secretKey;
//     int botID;
//     // const string BASE_URL = "https://api.binance.com";
//     string BASE_URL = "https://testnet.binance.vision";

//     const int MAX_NUM_ALGO_ORDERS = 5;
//     const string SELL = "SELL";
//     const string BUY = "BUY";
//     const string MARKET = "MARKET";
//     const string LIMIT = "LIMIT";
//     const string STOP = "STOP";
//     const string STOP_MARKET = "STOP_MARKET";
//     const string TAKE_PROFIT = "TAKE_PROFIT";
//     const string TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET";
//     const string TRAILING_STOP_MARKET = "TRAILING_STOP_MARKET";

//     string buildQuery(const map<string, string> &params);
//     string sign(const string &query);
// };