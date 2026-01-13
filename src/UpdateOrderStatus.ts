import { MAX_CANDLE, NODE_TYPE, ORDER_STATUS, RateData } from './common/Interface';
import * as mysql from './WebConfig/lib/mysql';
import * as util from './common/util';
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import * as redis from './common/redis';

dotenv.config({ path: `${__dirname}/../.env` });

interface Order {
    id: number,
    symbol: string,
    broker: string,
    timeframe: string,
    orderType: NODE_TYPE,
    volume: number,
    stop: number,
    entry: number,
    tp: number,
    sl: number,
    profit: number,
    status: ORDER_STATUS,
    createdTime: number,
    expiredTime: number,
    timeStop: number,
    timeEntry: number,
    timeTP: number,
    timeSL: number,
    lastTimeUpdated: number
};

let validSymbols: { [key: string]: boolean } = {};
let cachedOHLCV: { [key: string]: Array<RateData> };

function isValidRates(rates: Array<RateData>): boolean {
    if (rates.length <= 1) return true;
    if (rates[0].open <= 0 || rates[0].close <= 0 || rates[0].high < rates[0].low) {
        console.log(`Invalid rates data: ${moment(rates[0].startTime).format("YYYY-MM-DD HH:mm")} ${rates[0].open} ${rates[0].high} ${rates[0].low} ${rates[0].close}`);
        return false;
    }
    if (rates[1].open <= 0 || rates[1].close <= 0 || rates[1].high < rates[1].low) {
        console.log(`Invalid rates data: ${moment(rates[1].startTime).format("YYYY-MM-DD HH:mm")} ${rates[1].open} ${rates[1].high} ${rates[1].low} ${rates[1].close}`);
        return false;
    }
    const timeIntervalMiliseconds = rates[0].startTime - rates[1].startTime;
    for (let i = 2; i < rates.length; i++) {
        if (rates[i - 1].startTime - rates[i].startTime !== timeIntervalMiliseconds) {
            console.log(`Invalid rates: ${moment(rates[i - 1].startTime).format("YYYY-MM-DD HH:mm")} - ${moment(rates[i].startTime).format("YYYY-MM-DD HH:mm")} = (${rates[i - 1].startTime} - ${rates[i].startTime}}) != ${timeIntervalMiliseconds}`);
            return false;
        }
        if (rates[i].open <= 0 || rates[i].close <= 0 || rates[i].high < rates[i].low) {
            console.log(`Invalid rates data: ${moment(rates[i].startTime).format("YYYY-MM-DD HH:mm")} ${rates[i].open} ${rates[i].high} ${rates[i].low} ${rates[i].close}`);
            return false;
        }
    }
    return true;
}

async function getOHLCV(broker: string, symbol: string, timeframe: string, limit: number, since?: number): Promise<Array<RateData>> {
    const cacheKey = `${broker}_${symbol}_${timeframe}_${limit}_${since}`;
    if (cachedOHLCV[cacheKey] && cachedOHLCV[cacheKey].length !== 0) {
        return [...cachedOHLCV[cacheKey]];
    }

    const key = `${broker}_${symbol}_${timeframe}`;
    let data: Array<RateData> = (await redis.getArray(key)).map(item => {
        // item: startTime_open_high_low_close_volume
        const rate = item.split('_');
        return {
            symbol: symbol,
            interval: timeframe,
            startTime: parseInt(rate[0]),
            open: parseFloat(rate[1]),
            high: parseFloat(rate[2]),
            low: parseFloat(rate[3]),
            close: parseFloat(rate[4]),
            volume: parseFloat(rate[5]),
            isFinal: true
        };
    });

    while (since && data.length > 0 && data.at(-1)!.startTime < since) {
        data.pop();
    }
    if (isValidRates(data) && data.length > 0) {
        cachedOHLCV[cacheKey] = data;
        return [...data];
    }

    data = await util.getOHLCVFromCacheServer(broker, symbol, timeframe, limit, since);

    while (since && data.length > 0 && data.at(-1)!.startTime < since) {
        data.pop();
    }
    if (isValidRates(data) && data.length > 0) {
        cachedOHLCV[cacheKey] = data;
        return [...data];
    }

    console.log(`Data invalid: ${data.length}. Get OHLCV from util: ${broker} ${symbol} ${timeframe} ${limit} ${since} (since=${moment(since).format('YYYY-MM-DD HH:mm')})`);
    cachedOHLCV[cacheKey] = await util.getOHLCV(broker, symbol, timeframe, limit, since);
    return [...cachedOHLCV[cacheKey]];
}

async function handleOrder(order: Order) {
    try {
        const { broker, symbol, lastTimeUpdated } = order;

        const timeframe = '1m';
        const since = lastTimeUpdated ? (lastTimeUpdated + 60000) : order.createdTime;
        const limit = MAX_CANDLE;
        const data: Array<RateData> = await getOHLCV(broker, symbol, timeframe, limit, since)
            .then(data => data.reverse()); //time tang dan

        let isUpdated: boolean = false;
        let lastClose = 0;
        for (const rate of data) {
            if (!rate.isFinal) break;
            if ([ORDER_STATUS.CANCELED, ORDER_STATUS.MATCH_TP, ORDER_STATUS.MATCH_SL].includes(order.status)) break;

            const handleOrder = (price: number, startTime: number) => {
                if (order.status === ORDER_STATUS.OPENED
                    && [NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT].includes(order.orderType)) {
                    //handle stop buy
                    if (price >= order.stop) {
                        order.status = ORDER_STATUS.MATCH_STOP;
                        order.timeStop = startTime;
                    }
                }
                if (order.status === ORDER_STATUS.OPENED
                    && [NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(order.orderType)) {
                    //handle stop sell
                    if (price <= order.stop) {
                        order.status = ORDER_STATUS.MATCH_STOP;
                        order.timeStop = startTime;
                    }
                }

                if ((order.status === ORDER_STATUS.MATCH_STOP && order.orderType === NODE_TYPE.BUY_STOP_LIMIT)
                    || (order.status === ORDER_STATUS.OPENED && order.orderType === NODE_TYPE.BUY_LIMIT)) {
                    //handle entry buy limit
                    if (price <= order.entry) {
                        order.status = ORDER_STATUS.MATCH_ENTRY;
                        order.timeEntry = startTime;
                    }
                }
                if ((order.status === ORDER_STATUS.MATCH_STOP && order.orderType === NODE_TYPE.SELL_STOP_LIMIT)
                    || (order.status === ORDER_STATUS.OPENED && order.orderType === NODE_TYPE.SELL_LIMIT)) {
                    //handle entry sell limit
                    if (price >= order.entry) {
                        order.status = ORDER_STATUS.MATCH_ENTRY;
                        order.timeEntry = startTime;
                    }
                }

                if ((order.status === ORDER_STATUS.MATCH_STOP && order.orderType === NODE_TYPE.BUY_STOP_MARKET)
                    || (order.status === ORDER_STATUS.OPENED && order.orderType === NODE_TYPE.BUY_MARKET)) {
                    //handle entry buy market
                    order.status = ORDER_STATUS.MATCH_ENTRY;
                    order.timeEntry = startTime;
                }
                if ((order.status === ORDER_STATUS.MATCH_STOP && order.orderType === NODE_TYPE.SELL_STOP_MARKET)
                    || (order.status === ORDER_STATUS.OPENED && order.orderType === NODE_TYPE.SELL_MARKET)) {
                    //handle entry sell market
                    order.status = ORDER_STATUS.MATCH_ENTRY;
                    order.timeEntry = startTime;
                }

                if (order.status === ORDER_STATUS.MATCH_ENTRY
                    && [NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT].includes(order.orderType)) {
                    //handle TP SL BUY
                    if (price <= order.sl) {
                        order.status = ORDER_STATUS.MATCH_SL;
                        order.timeSL = startTime;
                    }
                    else if (price >= order.tp) {
                        order.status = ORDER_STATUS.MATCH_TP;
                        order.timeTP = startTime;
                    }
                }
                if (order.status === ORDER_STATUS.MATCH_ENTRY
                    && [NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(order.orderType)) {
                    //handle TP SL SELL
                    if (price <= order.tp) {
                        order.status = ORDER_STATUS.MATCH_TP;
                        order.timeTP = startTime;
                    }
                    else {
                        if (price >= order.sl) {
                            order.status = ORDER_STATUS.MATCH_SL;
                            order.timeSL = startTime;
                        }
                    }
                }

                if (order.status === ORDER_STATUS.OPENED && order.expiredTime) {
                    //handle expired time
                    if (order.expiredTime <= startTime) {
                        order.status = ORDER_STATUS.CANCELED;
                    }
                }
            }

            if (rate.open > rate.close) {
                handleOrder(lastClose || rate.open, rate.startTime);
                handleOrder(rate.high, rate.startTime);
                handleOrder(rate.low, rate.startTime);
                handleOrder(rate.close, rate.startTime);
            }
            else {
                handleOrder(lastClose || rate.open, rate.startTime);
                handleOrder(rate.low, rate.startTime);
                handleOrder(rate.high, rate.startTime);
                handleOrder(rate.close, rate.startTime);
            }
            lastClose = rate.close;

            //profit, unrealized
            if ([NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_STOP_LIMIT, NODE_TYPE.BUY_STOP_MARKET].includes(order.orderType)) {
                if (order.status === ORDER_STATUS.MATCH_ENTRY) {
                    order.profit = order.volume * (rate.close - order.entry);
                }
                else if (order.status === ORDER_STATUS.MATCH_TP) {
                    order.profit = order.volume * (order.tp - order.entry);
                }
                else if (order.status === ORDER_STATUS.MATCH_SL) {
                    order.profit = order.volume * (order.sl - order.entry);
                }
            }
            else if ([NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_STOP_LIMIT, NODE_TYPE.SELL_STOP_MARKET].includes(order.orderType)) {
                if (order.status === ORDER_STATUS.MATCH_ENTRY) {
                    order.profit = order.volume * (order.entry - rate.close);
                }
                else if (order.status === ORDER_STATUS.MATCH_TP) {
                    order.profit = order.volume * (order.entry - order.tp);
                }
                else if (order.status === ORDER_STATUS.MATCH_SL) {
                    order.profit = order.volume * (order.entry - order.sl);
                }
            }


            order.lastTimeUpdated = rate.startTime;
            isUpdated = true;
        }

        if (!isUpdated) return;

        console.log(moment(order.lastTimeUpdated).format('YYYY-MM-DD HH:mm'), order.id, order.symbol, order.broker, order.timeframe, order.status, data.length);

        const sql = `UPDATE Orders 
                        SET profit = ?, status = ?, timeStop = ?, timeEntry=?, timeTP = ?, timeSL = ?, lastTimeUpdated = ?
                        WHERE id = ?`;
        const args = [order.profit, order.status, order.timeStop, order.timeEntry, order.timeTP, order.timeSL, order.lastTimeUpdated, order.id];
        await mysql.query(sql, args);
    }
    catch (err) {
        console.log(err);
    }
}

async function main() {
    try {
        const [binanceSymbolList, binanceFutureSymbolList, bybitSymbolList, bybitFutureSymbolList, okxSymbolList] = await Promise.all([
            util.getBinanceSymbolList(),
            util.getBinanceFutureSymbolList(),
            util.getBybitSymbolList(),
            util.getBybitFutureSymbolList(),
            util.getOkxSymbolList()
        ]);

        validSymbols = {};
        cachedOHLCV = {};

        for (const symbol of binanceSymbolList) {
            validSymbols[`binance_${symbol}`] = true;
        }
        for (const symbol of binanceFutureSymbolList) {
            validSymbols[`binance_future_${symbol}`] = true;
        }
        for (const symbol of bybitSymbolList) {
            validSymbols[`bybit_${symbol}`] = true;
        }
        for (const symbol of bybitFutureSymbolList) {
            validSymbols[`bybit_future_${symbol}`] = true;
        }
        for (const symbol of okxSymbolList) {
            validSymbols[`okx_${symbol}`] = true;
        }
        console.log(`Valid symbols: ${Object.keys(validSymbols).length}`);

        const orders: Array<Order> = await mysql.query(
            `SELECT * FROM Orders WHERE status NOT IN (?, ?, ?)`,
            [ORDER_STATUS.MATCH_TP, ORDER_STATUS.MATCH_SL, ORDER_STATUS.CANCELED]
        );
        let promiseList = [];

        for (const order of orders) {
            if (!validSymbols[`${order.broker}_${order.symbol}`]) {
                continue;
            }
            promiseList.push(handleOrder(order));
            if (promiseList.length > 20) {
                await Promise.all(promiseList);
                promiseList = [];
            }
        }
        await Promise.all(promiseList);
        console.log(`update ${orders.length} order`);
        await util.getBotInfo(true);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        setTimeout(main, 33 * 60 * 1000);
    }
}

main();