#include "Worker.h"
#include "custom_indicator.h"
#include "util.h"
#include "Timer.h"
#include "expr.h"

static vector<string> orderTypes = {NODE_TYPE::BUY_MARKET, NODE_TYPE::BUY_LIMIT, NODE_TYPE::BUY_STOP_MARKET, NODE_TYPE::BUY_STOP_LIMIT, NODE_TYPE::SELL_MARKET, NODE_TYPE::SELL_LIMIT, NODE_TYPE::SELL_STOP_MARKET, NODE_TYPE::SELL_STOP_LIMIT};

Worker::Worker(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime)
    : botList(botList), broker(move(broker)), symbol(move(symbol)), timeframe(move(timeframe)), open(move(open)), high(move(high)), low(move(low)), close(move(close)), volume(move(volume)), startTime(move(startTime)), precision(5) {};

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
            if (binarySearch(bot->symbolList, broker + ":" + symbol) == -1)
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

string Worker::calculateSub(string &expr)
{
    return calculateSubExpr(expr, broker, symbol, timeframe, open.size(),
                            open.data(), high.data(), low.data(), close.data(), volume.data(),
                            startTime.data());
}

any Worker::calculate(string &expr)
{
    return calculateExpr(expr, broker, symbol, timeframe, open.size(),
                         open.data(), high.data(), low.data(), close.data(), volume.data(),
                         startTime.data());
}

bool Worker::adjustParam(NodeData &node)
{
    // stop
    if (node.type == NODE_TYPE::BUY_STOP_MARKET || node.type == NODE_TYPE::BUY_STOP_LIMIT)
    {
        if (node.stop.empty())
            return false;

        string expr = node.stop;
        expr = calculateSub(expr);
        if (node.unitStop == UNIT::PERCENT)
        {
            expr = StringFormat("close() * (100 + abs(%s)) / 100", expr.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate stop error. expr=%s", node.stop.c_str());
            return false;
        }

        node.stop = doubleToString(any_cast<double>(result), precision);
    }
    else if (node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.stop.empty())
            return false;

        string expr = node.stop;
        expr = calculateSub(expr);
        if (node.unitStop == UNIT::PERCENT)
        {
            expr = StringFormat("close() * (100 - abs(%s)) / 100", expr.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate stop error. expr=%s", node.stop.c_str());
            return false;
        }

        node.stop = doubleToString(any_cast<double>(result), precision);
    }
    else
    {
        node.stop = "";
    }

    // entry
    if (node.type == NODE_TYPE::BUY_LIMIT || node.type == NODE_TYPE::BUY_STOP_LIMIT)
    {
        if (node.entry.empty())
            return false;

        string expr = node.entry;
        expr = calculateSub(expr);
        if (node.unitEntry == UNIT::PERCENT)
        {
            expr = StringFormat("close() * (100 - abs(%s)) / 100", expr.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate entry error. expr=%s", node.entry.c_str());
            return false;
        }

        node.entry = doubleToString(any_cast<double>(result), precision);
    }
    else if (node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.entry.empty())
            return false;

        string expr = node.entry;
        expr = calculateSub(expr);
        if (node.unitEntry == UNIT::PERCENT)
        {
            expr = StringFormat("close() * (100 + abs(%s)) / 100", expr.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate entry error. expr=%s", node.entry.c_str());
            return false;
        }

        node.entry = doubleToString(any_cast<double>(result), precision);
    }
    else if (node.type == NODE_TYPE::BUY_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_MARKET)
    {
        node.entry = node.stop;
    }
    else if (node.type == NODE_TYPE::BUY_MARKET || node.type == NODE_TYPE::SELL_MARKET)
    {
        node.entry = doubleToString(close[0], precision);
    }

    double closePrice = close[0];
    double entry = stod(node.entry);
    double stop = node.stop.empty() ? 0 : stod(node.stop);
    // match entry immediately
    if (node.type == NODE_TYPE::BUY_LIMIT && closePrice <= entry)
    {
        node.entry = doubleToString(closePrice, precision);
    }
    else if (node.type == NODE_TYPE::BUY_STOP_LIMIT && closePrice <= entry && closePrice >= stop)
    {
        node.entry = doubleToString(closePrice, precision);
    }
    else if (node.type == NODE_TYPE::SELL_LIMIT && closePrice >= entry)
    {
        node.entry = doubleToString(closePrice, precision);
    }
    else if (node.type == NODE_TYPE::SELL_STOP_LIMIT && closePrice >= entry && closePrice <= stop)
    {
        node.entry = doubleToString(closePrice, precision);
    }

    // sl
    if (node.type == NODE_TYPE::BUY_MARKET || node.type == NODE_TYPE::BUY_LIMIT || node.type == NODE_TYPE::BUY_STOP_MARKET || node.type == NODE_TYPE::BUY_STOP_LIMIT)
    {
        if (node.sl.empty())
            return false;

        string expr = node.sl;
        expr = calculateSub(expr);
        if (node.unitSL == UNIT::PERCENT)
        {
            expr = StringFormat("(%s) * (100 - abs(%s)) / 100", node.entry.c_str(), expr.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate SL error. expr=%s", node.sl.c_str());
            return false;
        }

        node.sl = doubleToString(any_cast<double>(result), precision);
    }
    else if (node.type == NODE_TYPE::SELL_MARKET || node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.sl.empty())
            return false;

        string expr = node.sl;
        expr = calculateSub(expr);
        if (node.unitSL == UNIT::PERCENT)
        {
            expr = StringFormat("(%s) * (100 + abs(%s)) / 100", node.entry.c_str(), expr.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate SL error. expr=%s", node.sl.c_str());
            return false;
        }

        node.sl = doubleToString(any_cast<double>(result), precision);
    }
    else
    {
        node.sl = "";
    }

    // tp
    if (node.type == NODE_TYPE::BUY_MARKET || node.type == NODE_TYPE::BUY_LIMIT || node.type == NODE_TYPE::BUY_STOP_MARKET || node.type == NODE_TYPE::BUY_STOP_LIMIT)
    {
        if (node.tp.empty())
            return false;

        string expr = node.tp;
        expr = calculateSub(expr);
        if (node.unitTP == UNIT::PERCENT)
        {
            expr = StringFormat("(%s) * (100 + abs(%s)) / 100", node.entry.c_str(), expr.c_str());
        }
        else if (node.unitTP == UNIT::RR)
        {
            expr = StringFormat("(%s + abs(%s - %s) * abs(%s))", node.entry.c_str(), node.entry.c_str(), node.sl.c_str(), expr.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate TP error. expr=%s", node.tp.c_str());
            return false;
        }

        node.tp = doubleToString(any_cast<double>(result), precision);
    }
    else if (node.type == NODE_TYPE::SELL_MARKET || node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.tp.empty())
            return false;

        string expr = node.tp;
        expr = calculateSub(expr);
        if (node.unitTP == UNIT::PERCENT)
        {
            expr = StringFormat("(%s) * (100 - abs(%s)) / 100", node.entry.c_str(), expr.c_str());
        }
        else if (node.unitTP == UNIT::RR)
        {
            expr = StringFormat("(%s - abs(%s - %s) * abs(%s))", node.entry.c_str(), node.entry.c_str(), node.sl.c_str(), expr.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate TP error. expr=%s", node.tp.c_str());
            return false;
        }

        node.tp = doubleToString(any_cast<double>(result), precision);
    }
    else
    {
        node.tp = "";
    }

    // volume
    if (find(orderTypes.begin(), orderTypes.end(), node.type) != orderTypes.end())
    {
        if (node.volume.empty())
            return false;

        string expr = node.volume;
        expr = calculateSub(expr);
        if (node.unitVolume == UNIT::USD)
        {
            expr = StringFormat("(%s) / %s", expr.c_str(), node.entry.c_str());
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate volume error. expr=%s", node.volume.c_str());
            return false;
        }

        node.volume = doubleToString(any_cast<double>(result), precision);
    }
    else
    {
        node.volume = "";
    }

    // expired time
    if (node.type == NODE_TYPE::BUY_LIMIT || node.type == NODE_TYPE::BUY_STOP_MARKET || node.type == NODE_TYPE::BUY_STOP_LIMIT || node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.expiredTime.empty() || node.expiredTime == "0")
            return false;

        string expr = node.expiredTime;
        expr = calculateSub(expr);
        if (node.unitExpiredTime == UNIT::MINUTE)
        {
            expr = StringFormat("((%s) * 60000) + %lld", expr.c_str(), nextTime(startTime[0], timeframe));
        }
        else if (node.unitExpiredTime == UNIT::CANDLE)
        {
            expr = StringFormat("((%s) * 60000 * %d) + %lld", expr.c_str(), timeframeToNumberMinutes(timeframe), nextTime(startTime[0], timeframe));
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate expiredTime error. expr=%s", node.expiredTime.c_str());
            return false;
        }

        node.expiredTime = doubleToString(any_cast<double>(result), precision);
    }
    else
    {
        node.expiredTime = "";
    }

    // match TP, SL immediately
    entry = stod(node.entry);
    double sl = stod(node.sl);
    double tp = stod(node.tp);
    if (node.type == NODE_TYPE::BUY_MARKET || node.type == NODE_TYPE::BUY_LIMIT || node.type == NODE_TYPE::BUY_STOP_MARKET || node.type == NODE_TYPE::BUY_STOP_LIMIT)
    {
        if (entry <= sl)
            node.sl = node.entry;
        if (entry >= tp)
            node.tp = node.entry;
    }
    else if (node.type == NODE_TYPE::SELL_MARKET || node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (entry >= sl)
            node.sl = node.entry;
        if (entry <= tp)
            node.tp = node.entry;
    }

    return true;
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
        string mess = calculateSub(node.value);
        LOGD("Send telegram message: %s %s %s %s", broker.c_str(), symbol.c_str(), timeframe.c_str(), mess.c_str());
        return true;
    }

    // new order
    if (!adjustParam(node))
    {
        return false;
    }

    if (find(orderTypes.begin(), orderTypes.end(), node.type) != orderTypes.end())
    {
        LOGI("New order - BotID: %d, Type: %s, Broker: %s, Symbol: %s, Timeframe: %s, Entry: %s, Stop: %s, TP: %s, SL: %s, Volume: %s, ExpiredTime: %s",
             botID, node.type.c_str(), broker.c_str(), symbol.c_str(), timeframe.c_str(),
             node.entry.c_str(), node.stop.c_str(), node.tp.c_str(), node.sl.c_str(),
             node.volume.c_str(), node.expiredTime.c_str());

        return true;
    }

    return false;
}