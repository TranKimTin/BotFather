#pragma once

#include <string>
using namespace std;

class IExchange
{
public:
    virtual ~IExchange() = default;

    virtual string buyMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "") = 0;
    virtual string sellMarket(const string &symbol, string quantity, string takeProfit = "", string stopLoss = "") = 0;
    virtual string buyLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "", string expiredTime = "") = 0;
    virtual string sellLimit(const string &symbol, string quantity, string price, string takeProfit = "", string stopLoss = "", string expiredTime = "") = 0;
    virtual string getOrderStatus(const string &symbol, const string &orderId) = 0;
    virtual string cancelOrderByClientId(const string &symbol, const string &clientOrderId) = 0;
    virtual bool changeLeverage(const string &symbol, int leverage) = 0;
    virtual bool changeMarginType(const string &symbol, const string &marginType) = 0; 
};