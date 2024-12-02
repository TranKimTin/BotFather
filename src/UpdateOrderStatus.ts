import { NODE_TYPE, ORDER_STATUS, RateData } from './common/Interface';
import * as mysql from './WebConfig/lib/mysql';
import * as util from './common/util';
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';

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

async function handleOrder(order: Order) {
    try {
        const { broker, symbol, lastTimeUpdated } = order;

        const BASE_URL = util.getSocketURL(broker);
        const url = `${BASE_URL}/api/getOHLCV`;
        const params = {
            symbol,
            timeframe: '1m',
            since: lastTimeUpdated ? (lastTimeUpdated + 60000) : order.createdTime
        };
        const data: Array<RateData> = await axios.get(url, { params })
            .then(res => res.data.reverse()); //time tang dan

        let isUpdated: boolean = false;
        for (const rate of data) {
            if (!rate.isFinal) break;
            if ([ORDER_STATUS.CANCELED, ORDER_STATUS.MATCH_TP, ORDER_STATUS.MATCH_SL].includes(order.status)) break;

            if (order.status === ORDER_STATUS.OPENED
                && [NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT].includes(order.orderType)) {
                //handle stop buy
                if (rate.high >= order.stop) {
                    order.status = ORDER_STATUS.MATCH_STOP;
                    order.timeStop = rate.startTime;
                }
            }
            if (order.status === ORDER_STATUS.OPENED
                && [NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(order.orderType)) {
                //handle stop sell
                if (rate.low <= order.stop) {
                    order.status = ORDER_STATUS.MATCH_STOP;
                    order.timeStop = rate.startTime;
                }
            }

            if ((order.status === ORDER_STATUS.MATCH_STOP && order.orderType === NODE_TYPE.BUY_STOP_LIMIT)
                || (order.status === ORDER_STATUS.OPENED && order.orderType === NODE_TYPE.BUY_LIMIT)) {
                //handle entry buy limit
                if (rate.low <= order.entry) {
                    order.status = ORDER_STATUS.MATCH_ENTRY;
                    order.timeEntry = rate.startTime;
                }
            }
            if ((order.status === ORDER_STATUS.MATCH_STOP && order.orderType === NODE_TYPE.SELL_STOP_LIMIT)
                || (order.status === ORDER_STATUS.OPENED && order.orderType === NODE_TYPE.SELL_LIMIT)) {
                //handle entry sell limit
                if (rate.high >= order.entry) {
                    order.status = ORDER_STATUS.MATCH_ENTRY;
                    order.timeEntry = rate.startTime;
                }
            }

            if ((order.status === ORDER_STATUS.MATCH_STOP && order.orderType === NODE_TYPE.BUY_STOP_MARKET)
                || (order.status === ORDER_STATUS.OPENED && order.orderType === NODE_TYPE.BUY_MARKET)) {
                //handle entry buy market
                order.status = ORDER_STATUS.MATCH_ENTRY;
                order.timeEntry = rate.startTime;
            }
            if ((order.status === ORDER_STATUS.MATCH_STOP && order.orderType === NODE_TYPE.SELL_STOP_MARKET)
                || (order.status === ORDER_STATUS.OPENED && order.orderType === NODE_TYPE.SELL_MARKET)) {
                //handle entry sell market
                order.status = ORDER_STATUS.MATCH_ENTRY;
                order.timeEntry = rate.startTime;
            }

            if (order.status === ORDER_STATUS.MATCH_ENTRY
                && [NODE_TYPE.BUY_MARKET, NODE_TYPE.BUY_LIMIT, NODE_TYPE.BUY_STOP_MARKET, NODE_TYPE.BUY_STOP_LIMIT].includes(order.orderType)) {
                //handle TP SL BUY
                if (rate.low <= order.sl) {
                    order.status = ORDER_STATUS.MATCH_SL;
                    order.timeSL = rate.startTime;
                }
                else if (rate.high >= order.tp) {
                    order.status = ORDER_STATUS.MATCH_TP;
                    order.timeTP = rate.startTime;
                }
            }
            if (order.status === ORDER_STATUS.MATCH_ENTRY
                && [NODE_TYPE.SELL_MARKET, NODE_TYPE.SELL_LIMIT, NODE_TYPE.SELL_STOP_MARKET, NODE_TYPE.SELL_STOP_LIMIT].includes(order.orderType)) {
                //handle TP SL SELL
                if (rate.high >= order.sl) {
                    order.status = ORDER_STATUS.MATCH_SL;
                    order.timeSL = rate.startTime;
                }
                else if (rate.low <= order.tp) {
                    order.status = ORDER_STATUS.MATCH_TP;
                    order.timeTP = rate.startTime;
                }
            }

            if (order.status === ORDER_STATUS.OPENED && order.expiredTime) {
                //handle expired time
                if (order.expiredTime <= rate.startTime) {
                    order.status = ORDER_STATUS.CANCELED;
                }
            }

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

async function updateRate() {
    const sql = `   SELECT distinct o1.broker, o1.symbol, temp.closeTime
                    FROM Orders o1
                    JOIN (
                        SELECT distinct o2.botID, COALESCE(o2.timeTP, o2.timeSL) AS closeTime 
                        FROM Orders o2
                        WHERE (o2.timeTP IS NOT NULL OR o2.timeSL IS NOT NULL)
                            AND COALESCE(o2.timeTP, o2.timeSL) NOT IN (SELECT timestamp FROM Rates)
                    ) temp ON o1.botID = temp.botID
                    WHERE o1.timeEntry IS NOT NULL
                        AND o1.timeEntry < temp.closeTime
                        AND ((o1.timeSL IS NULL AND o1.timeTP IS NULL) 
                                OR (o1.timeSL IS NOT NULL AND o1.timeSL > temp.closeTime) 
                                OR (o1.timeTP IS NOT NULL AND o1.timeTP > temp.closeTime)
                            )
                        AND CONCAT(o1.broker, ':', o1.symbol, ':', temp.closeTime) NOT IN (SELECT CONCAT(symbol, ':', timestamp) FROM Rates);`

    const data = await mysql.query(sql);
    for (const { broker, symbol, closeTime } of data) {
        try {
            const s = `${broker}:${symbol}`;
            const [{ count }] = await mysql.query(`SELECT count(1) AS count FROM Rates WHERE symbol = ? AND timestamp = ?`, [s, closeTime]);
            if (count > 0) continue;

            const BASE_URL = util.getSocketURL(broker);
            const url = `${BASE_URL}/api/getOHLCV`;
            const params = {
                symbol: symbol,
                timeframe: '1m',
                since: closeTime,
                limit: 1
            };
            const rate: RateData = await axios.get(url, { params }).then(res => res.data[0]);
            await mysql.query(
                `INSERT INTO Rates(symbol,timestamp,open,high,low,close) VALUES(?,?,?,?,?,?)`,
                [s, closeTime, rate.open, rate.high, rate.low, rate.close]
            );
            console.log({ s, closeTime });
        }
        catch (err) {
            console.error(err);
        }
    }
}

async function main() {
    try {
        const orders: Array<Order> = await mysql.query(
            `SELECT * FROM Orders WHERE status NOT IN (?, ?, ?)`,
            [ORDER_STATUS.MATCH_TP, ORDER_STATUS.MATCH_SL, ORDER_STATUS.CANCELED]
        );
        console.log(`update ${orders.length} order`);

        let promiseList = [];

        for (const order of orders) {
            promiseList.push(handleOrder(order));
            if (promiseList.length > 10) {
                await Promise.all(promiseList);
                promiseList = [];
            }
        }
        await Promise.all(promiseList);
        await updateRate();
    }
    catch (err) {
        console.error(err);
    }
    finally {
        setTimeout(main, 1 * 60 * 1000);
    }
}

setTimeout(main, 60 * 1000);