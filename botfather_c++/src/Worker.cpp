#include "Worker.h"
#include "custom_indicator.h"
#include "util.h"
#include "Timer.h"
#include "expr.h"

static vector<string> orderTypes = {NODE_TYPE::BUY_MARKET, NODE_TYPE::BUY_LIMIT, NODE_TYPE::BUY_STOP_MARKET, NODE_TYPE::BUY_STOP_LIMIT, NODE_TYPE::SELL_MARKET, NODE_TYPE::SELL_LIMIT, NODE_TYPE::SELL_STOP_MARKET, NODE_TYPE::SELL_STOP_LIMIT};

Worker::Worker(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime)
    : botList(botList), broker(move(broker)), symbol(move(symbol)), timeframe(move(timeframe)), open(move(open)), high(move(high)), low(move(low)), close(move(close)), volume(move(volume)), startTime(move(startTime)) {};

static int binarySearch(const vector<Symbol> &symbolList, const string &symbol)
{
    int left = 0;
    int right = symbolList.size() - 1;

    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        if (symbolList[mid].symbolName == symbol)
        {
            return mid;
        }
        else if (symbolList[mid].symbolName < symbol)
        {
            left = mid + 1;
        }
        else
        {
            right = mid - 1;
        }
    }
    return -1;
}

void Worker::run()
{
    Timer timer(StringFormat("onCloseCandle %s %s %s", broker.c_str(), symbol.c_str(), timeframe.c_str()));
    for (const shared_ptr<Bot> &bot : *botList)
    {
        try
        {            
            if (binarySearch(bot->symbolList, "binance" + ":" + symbol) == -1)
            {
                continue;
            }
            if (find(bot->timeframes.begin(), bot->timeframes.end(), timeframe) == bot->timeframes.end())
            {
                continue;
            }
            visited.clear();
            dfs_handleLogic(bot->route, bot->id);
        }
        catch (const exception &e)
        {
            LOGE("Error in bot %s: %s", bot->botName.c_str(), e.what());
            continue;
        }
    }
}

void Worker::dfs_handleLogic(Route &route, int botID)
{
    if (visited[route.id])
    {
        return;
    }
    visited[route.id] = true;
    if (handleLogic(route.data, botID))
    {
        for (Route &next : route.next)
        {
            dfs_handleLogic(next, botID);
        }
    }
}

bool Worker::handleLogic(NodeData &node, int botID)
{
    if (node.type == NODE_TYPE::START)
        return true;

    if (node.type == NODE_TYPE::EXPR)
    {
        any result = calculateExpr(node.value, broker, symbol, timeframe, open.size(),
                                   open.data(), high.data(), low.data(), close.data(), volume.data(),
                                   startTime.data());

        if (result.has_value())
        {
            if (result.type() == typeid(int))
            {
                return any_cast<int>(result) != 0;
            }
            else if (result.type() == typeid(double))
            {
                return any_cast<double>(result) != 0.0;
            }
            else if (result.type() == typeid(string))
            {
                return true;
            }
            else
            {
                LOGE("Unknown result type");
                return false;
            }
        }
        else
        {
            LOGE("No result");
            return false;
        }
    }
    if (node.type == NODE_TYPE::TELEGRAM)
    {
        string mess = calculateSubExpr(node.value, broker, symbol, timeframe, open.size(),
                                       open.data(), high.data(), low.data(), close.data(), volume.data(),
                                       startTime.data());
        LOGD("Send telegram message: %s %s %s %s", broker.c_str(), symbol.c_str(), timeframe.c_str(), mess.c_str());
        return true;
    }

    if (find(orderTypes.begin(), orderTypes.end(), node.type) != orderTypes.end())
    {
        return true;
    }

    return false;
}