#include "worker.h"
#include "custom_indicator.h"
#include "util.h"
#include "timer.h"
#include "expr.h"
#include "mysql_connector.h"
#include "telegram.h"
#include "exchange.h"
#include "binance_future.h"
#include "thread_pool.h"
#include "vector_pool.h"

static vector<string> orderTypes = {NODE_TYPE::BUY_MARKET, NODE_TYPE::BUY_LIMIT, NODE_TYPE::BUY_STOP_MARKET, NODE_TYPE::BUY_STOP_LIMIT, NODE_TYPE::SELL_MARKET, NODE_TYPE::SELL_LIMIT, NODE_TYPE::SELL_STOP_MARKET, NODE_TYPE::SELL_STOP_LIMIT};
static ThreadPool tasks(thread::hardware_concurrency() * 2 + 1);
extern thread_local VectorDoublePool vectorDoublePool;
extern thread_local SparseTablePool sparseTablePool;

void Worker::init(shared_ptr<vector<shared_ptr<Bot>>> botList, string broker, string symbol, string timeframe, vector<double> open, vector<double> high, vector<double> low, vector<double> close, vector<double> volume, vector<long long> startTime, ExchangeInfo exchangeInfo, double fundingRate)
{
    VectorDoublePool::getInstance().releaseLock(this->open);
    VectorDoublePool::getInstance().releaseLock(this->high);
    VectorDoublePool::getInstance().releaseLock(this->low);
    VectorDoublePool::getInstance().releaseLock(this->close);
    VectorDoublePool::getInstance().releaseLock(this->volume);
    VectorLongLongPool::getInstance().releaseLock(this->startTime);

    this->botList = botList;
    this->broker = broker;
    this->symbol = symbol;
    this->timeframe = timeframe;
    this->open = move(open);
    this->high = move(high);
    this->low = move(low);
    this->close = move(close);
    this->volume = move(volume);
    this->startTime = move(startTime);
    this->exchangeInfo = exchangeInfo;
    this->fundingRate = fundingRate;

    for (auto &pair : cachedIndicator)
    {
        vectorDoublePool.release(pair.second);
    }

    for (auto &pair : cachedMinMax)
    {
        sparseTablePool.release(move(pair.second));
    }

    this->visited.clear();
    this->cachedExpr.clear();
    this->cachedIndicator.clear();
    this->cachedMinMax.clear();
}
void Worker::run()
{
    Timer *timer = NULL;
    if (timeframe == "30m")
    {
        timer = new Timer(StringFormat("onCloseCandle {} {} {}", broker, symbol, timeframe));
    }
    string key;
    for (const shared_ptr<Bot> &bot : *botList)
    {
        try
        {
            key.clear();
            key.append(broker);
            key.push_back(':');
            key.append(symbol);

            if (bot->symbolExist.count(hashString(key)) == 0)
            {
                continue;
            }
            if (find(bot->timeframes.begin(), bot->timeframes.end(), timeframe) == bot->timeframes.end())
            {
                continue;
            }
            visited.clear();
            dfs_handleLogic(bot->route, bot);
        }
        catch (const exception &e)
        {
            LOGE("Error in bot {}: {}", bot->botName, e.what());
            continue;
        }
    }
    if (timer)
    {
        delete timer;
    }
}

void Worker::dfs_handleLogic(Route &route, const shared_ptr<Bot> &bot)
{
    long long keyID = (route.id.empty() || route.id == "start") ? 0 : stoll(route.id);
    if (visited.count(keyID) > 0)
    {
        return;
    }
    visited.insert(keyID);
    if (handleLogic(route.data, bot))
    {
        for (Route &next : route.next)
        {
            dfs_handleLogic(next, bot);
        }
    }
}

string Worker::calculateSub(string &expr)
{
    return calculateSubExpr(expr, broker, symbol, timeframe, open.size(),
                            open.data(), high.data(), low.data(), close.data(), volume.data(),
                            startTime.data(), fundingRate, &cachedIndicator, &cachedMinMax);
}

any Worker::calculate(string &expr)
{
    long long key = hashString(expr);
    auto it = cachedExpr.find(key);
    if (it != cachedExpr.end())
    {
        return it->second;
    }

    any result = calculateExpr(
        expr, broker, symbol, timeframe, open.size(),
        open.data(), high.data(), low.data(), close.data(), volume.data(),
        startTime.data(), fundingRate, &cachedIndicator, &cachedMinMax);

    cachedExpr[key] = result;
    return result;
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
            expr = StringFormat("close() * (100 + abs({})) / 100", expr);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate stop error. expr={}", node.stop);
            return false;
        }

        node.stop = doubleToString(any_cast<double>(result), exchangeInfo.digitPrices);
    }
    else if (node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.stop.empty())
            return false;

        string expr = node.stop;
        expr = calculateSub(expr);
        if (node.unitStop == UNIT::PERCENT)
        {
            expr = StringFormat("close() * (100 - abs({})) / 100", expr);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate stop error. expr={}", node.stop);
            return false;
        }

        node.stop = doubleToString(any_cast<double>(result), exchangeInfo.digitPrices);
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
            expr = StringFormat("close() * (100 - abs({})) / 100", expr);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate entry error. expr={}", node.entry);
            return false;
        }

        node.entry = doubleToString(any_cast<double>(result), exchangeInfo.digitPrices);
    }
    else if (node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.entry.empty())
            return false;

        string expr = node.entry;
        expr = calculateSub(expr);
        if (node.unitEntry == UNIT::PERCENT)
        {
            expr = StringFormat("close() * (100 + abs({})) / 100", expr);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate entry error. expr={}", node.entry);
            return false;
        }

        node.entry = doubleToString(any_cast<double>(result), exchangeInfo.digitPrices);
    }
    else if (node.type == NODE_TYPE::BUY_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_MARKET)
    {
        node.entry = node.stop;
    }
    else if (node.type == NODE_TYPE::BUY_MARKET || node.type == NODE_TYPE::SELL_MARKET)
    {
        node.entry = doubleToString(close[0], exchangeInfo.digitPrices);
    }

    double closePrice = close[0];
    double entry = stod(node.entry);
    double stop = node.stop.empty() ? 0 : stod(node.stop);
    // match entry immediately
    if (node.type == NODE_TYPE::BUY_LIMIT && closePrice <= entry)
    {
        node.entry = doubleToString(closePrice, exchangeInfo.digitPrices);
    }
    else if (node.type == NODE_TYPE::BUY_STOP_LIMIT && closePrice <= entry && closePrice >= stop)
    {
        node.entry = doubleToString(closePrice, exchangeInfo.digitPrices);
    }
    else if (node.type == NODE_TYPE::SELL_LIMIT && closePrice >= entry)
    {
        node.entry = doubleToString(closePrice, exchangeInfo.digitPrices);
    }
    else if (node.type == NODE_TYPE::SELL_STOP_LIMIT && closePrice >= entry && closePrice <= stop)
    {
        node.entry = doubleToString(closePrice, exchangeInfo.digitPrices);
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
            expr = StringFormat("({}) * (100 - abs({})) / 100", node.entry, expr);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate SL error. expr={}", node.sl);
            return false;
        }

        node.sl = doubleToString(any_cast<double>(result), exchangeInfo.digitPrices);
    }
    else if (node.type == NODE_TYPE::SELL_MARKET || node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.sl.empty())
            return false;

        string expr = node.sl;
        expr = calculateSub(expr);
        if (node.unitSL == UNIT::PERCENT)
        {
            expr = StringFormat("({}) * (100 + abs({})) / 100", node.entry, expr);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate SL error. expr={}", node.sl);
            return false;
        }

        node.sl = doubleToString(any_cast<double>(result), exchangeInfo.digitPrices);
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
            expr = StringFormat("({}) * (100 + abs({})) / 100", node.entry, expr);
        }
        else if (node.unitTP == UNIT::RR)
        {
            expr = StringFormat("({} + abs({} - {}) * abs({}))", node.entry, node.entry, node.sl, expr);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate TP error. expr={}", node.tp);
            return false;
        }

        node.tp = doubleToString(any_cast<double>(result), exchangeInfo.digitPrices);
    }
    else if (node.type == NODE_TYPE::SELL_MARKET || node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        if (node.tp.empty())
            return false;

        string expr = node.tp;
        expr = calculateSub(expr);
        if (node.unitTP == UNIT::PERCENT)
        {
            expr = StringFormat("({}) * (100 - abs({})) / 100", node.entry, expr);
        }
        else if (node.unitTP == UNIT::RR)
        {
            expr = StringFormat("({} - abs({} - {}) * abs({}))", node.entry, node.entry, node.sl, expr);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate TP error. expr={}", node.tp);
            return false;
        }

        node.tp = doubleToString(any_cast<double>(result), exchangeInfo.digitPrices);
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
            expr = StringFormat("({}) / {}", expr, node.entry);
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate volume error. expr={}", node.volume);
            return false;
        }

        node.volume = doubleToString(any_cast<double>(result), exchangeInfo.digitVolume);
    }
    else
    {
        node.volume = "";
    }

    // expired time
    if (!node.expiredTime.empty() && node.expiredTime != "0" && node.type == NODE_TYPE::BUY_LIMIT || node.type == NODE_TYPE::BUY_STOP_MARKET || node.type == NODE_TYPE::BUY_STOP_LIMIT || node.type == NODE_TYPE::SELL_LIMIT || node.type == NODE_TYPE::SELL_STOP_MARKET || node.type == NODE_TYPE::SELL_STOP_LIMIT)
    {
        string expr = node.expiredTime;
        expr = calculateSub(expr);
        if (node.unitExpiredTime == UNIT::MINUTE)
        {
            expr = StringFormat("(({}) * 60000) + {}", expr, nextTime(startTime[0], timeframe));
        }
        else if (node.unitExpiredTime == UNIT::CANDLE)
        {
            expr = StringFormat("(({}) * 60000 * {}) + {}", expr, timeframeToNumberMinutes(timeframe), nextTime(startTime[0], timeframe));
        }

        any result = calculate(expr);
        if (!result.has_value() || result.type() != typeid(double))
        {
            LOGE("Calculate expiredTime error. expr={}", node.expiredTime);
            return false;
        }

        node.expiredTime = to_string((long long)any_cast<double>(result));
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

bool Worker::handleLogic(NodeData &nodeData, const shared_ptr<Bot> &bot)
{
    if (nodeData.type == NODE_TYPE::START)
        return true;

    if (nodeData.type == NODE_TYPE::EXPR)
    {
        any result = calculateExpr(nodeData.value, broker, symbol, timeframe, open.size(),
                                   open.data(), high.data(), low.data(), close.data(), volume.data(),
                                   startTime.data(), fundingRate, &cachedIndicator, &cachedMinMax);

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
            LOGD("No result. symbol: {}:{}, timeframe: {}, expr={}", broker, symbol, timeframe, nodeData.value);
            return false;
        }
    }
    if (nodeData.type == NODE_TYPE::TELEGRAM)
    {
        string content = calculateSub(nodeData.value);

        boost::unordered_flat_map<string, string> emoji = {
            {"binance", "🥇🥇🥇"},
            {"bybit", ""},
            {"okx", "🏁🏁🏁"},
            {"binance_future", "🥇🥇🥇"},
            {"bybit_future", ""}};

        boost::unordered_flat_map<string, string> url = {
            {"binance", "https://www.binance.com/en/trade/" + symbol + "?_from=markets&type=spot"},
            {"bybit", "https://www.bybit.com/vi-VN/trade/spot/" + symbol.substr(0, symbol.find("USDT")) + "/USDT"},
            {"okx", "https://www.okx.com/vi/trade-spot/" + symbol},
            {"binance_future", "https://www.binance.com/en/futures/" + symbol + "?_from=markets"},
            {"bybit_future", "https://www.bybit.com/trade/usdt/" + symbol}};

        string mess = emoji[broker];
        mess += StringFormat("\n<a href='https://www.botfather.tech/history/{}'><b>{}</b></a>", bot->botName, bot->botName);
        mess += StringFormat("\n<a href='{}'><b>{}</b></a>", url[broker], symbol);
        mess += StringFormat("\n{}", broker);
        mess += StringFormat("\n{} {}", timeframe, toTimeString(startTime[0]));
        mess += StringFormat("\n{}", content);

        for (const string &id : bot->idTelegram)
        {
            if (id.empty())
                continue;
            Telegram::getInstance().sendMessage(mess, id);
        }
        return true;
    }

    // new order
    NodeData node = nodeData;
    if (!adjustParam(node))
    {
        return false;
    }

    if (find(orderTypes.begin(), orderTypes.end(), node.type) != orderTypes.end())
    {
        long long createdTime = startTime[0];
        double o = open[0];
        double h = high[0];
        double l = low[0];
        double c = close[0];
        tasks.enqueue([createdTime, node, bot, broker = this->broker, symbol = this->symbol, timeframe = this->timeframe, o, h, l, c, exchangeInfo = this->exchangeInfo]()
                      {
        int botID = bot->id;

        LOGI("New order - BotName: {}. BotID: {}, Type: {}, Broker: {}, Symbol: {}, Timeframe: {}, Entry: {}, Stop: {}, TP: {}, SL: {}, Volume: {}, ExpiredTime: {}",
            bot->botName, botID, node.type, broker, symbol, timeframe,
            node.entry, node.stop, node.tp, node.sl,
            node.volume, node.expiredTime);
        LOGI("open: {}, high: {}, low: {}, close: {}, startTime: {}, timestring: {}", o, h, l, c, createdTime, toTimeString(createdTime));
        LOGI("exchangeInfo: {}, {}", exchangeInfo.digitPrices, exchangeInfo.digitVolume);

        if (broker == "binance_future" && bot->enableRealOrder && !bot->apiKey.empty() && !bot->secretKey.empty() && !bot->iv.empty())
        {
            LOGI("Real order {} {}", symbol, bot->botName);
            shared_ptr<BinanceFuture> exchange = make_shared<BinanceFuture>(bot->apiKey, bot->secretKey, bot->iv, bot->id);

            if (node.type == NODE_TYPE::BUY_MARKET)
            {
                if (compareStringNumber(node.tp, node.entry) > 0 && compareStringNumber(node.sl, node.entry) < 0)
                {
                    exchange->buyMarket(symbol, node.volume, node.tp, node.sl);
                }
                else
                {
                    LOGE("Invalid TP or SL for BUY_MARKET order. TP: {}, SL: {}, Entry: {}", node.tp, node.sl, node.entry);
                }
            }
            else if (node.type == NODE_TYPE::BUY_LIMIT)
            {
                if (compareStringNumber(node.tp, node.entry) > 0 && compareStringNumber(node.sl, node.entry) < 0)
                {
                    exchange->buyLimit(symbol, node.volume, node.entry, node.tp, node.sl, node.expiredTime);
                }
                else
                {
                    LOGE("Invalid TP or SL for BUY_LIMIT order. TP: {}, SL: {}, Entry: {}", node.tp, node.sl, node.entry);
                }
            }
            else if (node.type == NODE_TYPE::SELL_MARKET)
            {
                if (compareStringNumber(node.tp, node.entry) < 0 && compareStringNumber(node.sl, node.entry) > 0)
                {
                    exchange->sellMarket(symbol, node.volume, node.tp, node.sl);
                }
                else
                {
                    LOGE("Invalid TP or SL for SELL_MARKET order. TP: {}, SL: {}, Entry: {}", node.tp, node.sl, node.entry);
                }
            }
            else if (node.type == NODE_TYPE::SELL_LIMIT)
            {
                if (compareStringNumber(node.tp, node.entry) < 0 && compareStringNumber(node.sl, node.entry) > 0)
                {
                    exchange->sellLimit(symbol, node.volume, node.entry, node.tp, node.sl, node.expiredTime);
                }
                else
                {
                    LOGE("Invalid TP or SL for SELL_LIMIT order. TP: {}, SL: {}, Entry: {}", node.tp, node.sl, node.entry);
                }
            }
        }

        auto &db = MySQLConnector::getInstance();
        string mysql_query = "INSERT INTO Orders(symbol,broker,timeframe,orderType,volume,stop,entry,tp,sl,status,createdTime,expiredTime,botID) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
        vector<any> args;
        //  {
        //     symbol, broker, timeframe, node.type, stod(node.volume), stod(node.stop),
        //     node.entry, node.tp, node.sl, ORDER_STATUS::OPENED,
        //     toTimeString(nextTime(createdTime, timeframe)), node.expiredTime, to_string(botID)};

        args.push_back(symbol);
        args.push_back(broker);
        args.push_back(timeframe);
        args.push_back(node.type);
        args.push_back(stod(node.volume));
        if (node.stop.empty())
        {
            args.push_back(NULL);
        }
        else
        {
            args.push_back(stod(node.stop));
        }
        args.push_back(stod(node.entry));
        args.push_back(stod(node.tp));
        args.push_back(stod(node.sl));
        args.push_back(ORDER_STATUS::OPENED);
        args.push_back(nextTime(createdTime, timeframe));
        if (node.expiredTime.empty() || node.expiredTime == "0")
        {
            args.push_back(NULL);
        }
        else
        {
            args.push_back(stod(node.expiredTime));
        }
        args.push_back(botID);

        if (db.executeUpdate(mysql_query, args) <= 0)
        {
            LOGE("Failed to insert order into database");
            return ;
        } });

        return true;
    }

    return false;
}
