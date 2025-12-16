import { BotInfo, CustomRequest, MAX_CANDLE, NODE_TYPE, Node, NodeData, ROLE, RateData, UserTokenInfo } from '../../common/Interface';
import { calculate, calculateSubExpr, isValidCondition } from '../../common/Expr';
import * as util from '../../common/util'
import * as mysql from '../lib/mysql';
import moment from 'moment';
import dotenv from 'dotenv';
import axios from 'axios';
import Binance from 'binance-api-node';
import * as redis from '../../common/redis';

dotenv.config({ path: `${__dirname}/../../../.env` });

function validatekBotName(botName: string) {
    const invalidChars = /[\/\\:*?"<>|]/;
    return botName && botName.length < 50 && !invalidChars.test(botName);
}

function buildRoute(botInfo: BotInfo): boolean {
    const elements = botInfo.treeData.elements;
    const nodes = elements.nodes?.map(item => item.data) || [];
    const edges = elements.edges?.map(item => item.data) || [];

    const nodeList: { [key: string]: Node } = {};
    let startID: string | undefined = undefined;

    for (let node of nodes) {
        const { id, type } = node;
        nodeList[id] = { data: node, id, next: [] };
        if (type === 'start') startID = id;
    }

    for (let edge of edges) {
        const { source, target } = edge;
        nodeList[source].next.push(nodeList[target]);
    }

    if (startID === undefined) return false;

    const visited: { [key: string]: boolean } = {};
    let ret = true;

    const dfs = (node: Node) => {
        if (visited[node.id]) ret = false;
        if (!ret) return;

        visited[node.id] = true;
        for (let child of node.next) {
            dfs(child);
        }
        visited[node.id] = false;
    }
    dfs(nodeList[startID]);
    if (!ret) return false;

    botInfo.route = nodeList[startID];

    return true;
}


export async function getBotInfo(botName: string) {
    if (!validatekBotName(botName)) {
        throw `Tên bot không hợp lệ ${botName}`;
    }
    let botInfo: BotInfo = {
        treeData: { elements: { nodes: [], edges: [] } },
        timeframes: [],
        symbolList: [],
        botName: '',
        idTelegram: '',
        route: {
            data: {
                id: "start",
                type: NODE_TYPE.START,
                value: "Start",
            }, id: 'start', next: []
        },
        apiKey: null,
        secretKey: null,
        enableRealOrder: 0
    };

    const sql = `SELECT botName, idTelegram, route, symbolList, timeframes, treeData, apiKey, secretKey, enableRealOrder 
                    FROM Bot WHERE botName = ?`;
    const data = await mysql.query(sql, [botName]);

    if (data.length > 0) {
        const bot = data[0];
        botInfo.botName = bot.botName;
        botInfo.idTelegram = bot.idTelegram;
        botInfo.route = JSON.parse(bot.route);
        botInfo.symbolList = JSON.parse(bot.symbolList);
        botInfo.timeframes = JSON.parse(bot.timeframes);
        botInfo.treeData = JSON.parse(bot.treeData);
        botInfo.apiKey = bot.apiKey;
        botInfo.secretKey = bot.secretKey;
        botInfo.enableRealOrder = bot.enableRealOrder;
    }

    return botInfo;
}

let cacheSymbolList: { lastTime: number, data: Array<string> } = {
    lastTime: 0,
    data: []
};
export async function getSymbolList() {
    const now = new Date().getTime();
    if (now - cacheSymbolList.lastTime < 5 * 60 * 1000) {
        return cacheSymbolList.data;
    }

    let [binanceSymbolList, bybitSymbolList, okxSymbolList, binanceFutureSymbolList, bybitFutureSymbolList] = await Promise.all([
        util.getBinanceSymbolList(),
        util.getBybitSymbolList(),
        util.getOkxSymbolList(),
        util.getBinanceFutureSymbolList(),
        util.getBybitFutureSymbolList()
    ]);

    binanceSymbolList = binanceSymbolList.map(item => `${'binance'}:${item}`);
    bybitSymbolList = bybitSymbolList.map(item => `${'bybit'}:${item}`);
    okxSymbolList = okxSymbolList.map(item => `${'okx'}:${item}`);
    binanceFutureSymbolList = binanceFutureSymbolList.map(item => `${'binance_future'}:${item}`);
    bybitFutureSymbolList = bybitFutureSymbolList.map(item => `${'bybit_future'}:${item}`);


    const symbolList = [...binanceSymbolList, ...bybitSymbolList, ...okxSymbolList, ...binanceFutureSymbolList, ...bybitFutureSymbolList];

    cacheSymbolList.data = symbolList;
    cacheSymbolList.lastTime = now;

    return symbolList;
}

export async function getBotList(userData: UserTokenInfo, real: boolean) {
    const botList = await mysql.query(`SELECT botName 
                                        FROM Bot 
                                        WHERE (userID = ? OR ? = ?) ${real ? 'AND (enableRealOrder = 1 AND apiKey IS NOT NULL AND secretKey IS NOT NULL AND iv IS NOT NULL)' : ''}
                                        ORDER BY botName ASC`, [userData.id, userData.role, ROLE.ADMIN]);
    const data = botList.map((item: { botName: any; }) => item.botName);
    return data;
}

export async function getHistoryOrder(botName: string, filterBroker: Array<string>, filterTimeframe: Array<string>) {
    const key = `getHistoryOrder_${botName}_${filterBroker.join(',')}_${filterTimeframe.join(',')}`;
    const sql = `   SELECT b.id,o.symbol,o.broker,o.timeframe,o.orderType,o.volume,o.stop,o.entry,o.tp,o.sl,o.profit,o.status,o.createdTime,o.expiredTime,o.timeStop,o.timeEntry,o.timeTP,o.timeSL,o.lastTimeUpdated
                        FROM Orders o
                        JOIN Bot b ON b.id = o.botID
                        WHERE b.botName = ?
                            AND o.broker IN (?)
                            AND o.timeframe IN (?)
                        ORDER BY o.createdTime DESC`;
    const orders = await mysql.query(sql, [botName, filterBroker, filterTimeframe]);
    let startTime = orders.length > 0 ? orders.at(-1).createdTime : moment().subtract(30, 'day').valueOf();

    for (const order of orders) {
        order.createdTime = order.createdTime ? moment(order.createdTime).format('YYYY-MM-DD HH:mm') : '';
        order.expiredTime = order.expiredTime ? moment(order.expiredTime).format('YYYY-MM-DD HH:mm') : '';
        order.timeStop = order.timeStop ? moment(order.timeStop).format('YYYY-MM-DD HH:mm') : '';
        order.timeEntry = order.timeEntry ? moment(order.timeEntry).format('YYYY-MM-DD HH:mm') : '';
        order.timeTP = order.timeTP ? moment(order.timeTP).format('YYYY-MM-DD HH:mm') : '';
        order.timeSL = order.timeSL ? moment(order.timeSL).format('YYYY-MM-DD HH:mm') : '';
        order.lastTimeUpdated = order.lastTimeUpdated ? moment(order.lastTimeUpdated).format('YYYY-MM-DD HH:mm') : '';
        order.volumeInUSD = Math.round(order.volume * order.entry);
    }

    let tradeReal = [];
    let accountInfo;
    let openOrders;

    const bot = await mysql.query(`SELECT apiKey, secretKey, iv FROM Bot WHERE botName = ?`, [botName]);
    if (bot.length > 0) {
        let { apiKey, secretKey, iv } = bot[0];
        if (apiKey && secretKey && iv) {
            const key = process.env.ENCRYP_KEY || '';
            secretKey = util.decryptAES(secretKey, key, iv);
            let client = Binance({
                apiKey: apiKey,
                apiSecret: secretKey
            });

            while (1) {
                const key = `futuresIncome_${apiKey}_${startTime}`;
                const cached = await redis.get(key);
                let history: Awaited<ReturnType<typeof client.futuresIncome>> = cached ? JSON.parse(cached) : [];
                console.log(`${moment(startTime).format("YYYY-MM-YY HH:mm:ss")} cached futuresIncome length = ${history.length}.`);

                if (history.length == 0) {
                    history = await client.futuresIncome({
                        limit: 1000,
                        // incomeType: 'REALIZED_PNL',
                        startTime: startTime,
                        endTime: new Date().getTime()
                    });

                    if (history.length == 1000) {
                        await redis.set(key, JSON.stringify(history));
                    }
                }

                for (let item of history) {
                    if (item.asset === 'USDT' && ['REALIZED_PNL', 'FUNDING_FEE', 'COMMISSION'].includes(item.incomeType)) {
                        tradeReal.push(item);
                    }
                }
                if (history.length < 1000) break;
                startTime = history[history.length - 1].time + 1;
            }


            accountInfo = await client.futuresAccountInfo();
            accountInfo.positions = accountInfo.positions.filter((item: any) => item.initialMargin != '0');
            accountInfo.positions.sort((a: any, b: any) => (+a.unrealizedProfit) - (+b.unrealizedProfit));

            openOrders = await client.futuresOpenOrders({});
            const algoOpenOrder = await client.futuresGetOpenAlgoOrders({}) as any;
            openOrders.push(...algoOpenOrder);
            openOrders.sort((a, b) => a.symbol.localeCompare(b.symbol));
        }
    }
    tradeReal.sort((a, b) => a.time - b.time);

    return {
        orders,
        tradeReal,
        accountInfo,
        openOrders
    };
}

export async function calculator(broker: string, symbol: string, timeframe: string, expr: string) {
    const data = await util.getOHLCV(broker, symbol, timeframe, MAX_CANDLE);

    if (data[0] && !data[0].isFinal) {
        data.shift();
    }

    const args = {
        broker: broker,
        symbol: symbol,
        timeframe: timeframe,
        data: data,
        cacheIndicator: {}
    };


    expr = calculateSubExpr(expr, args);

    const value = calculate(expr, args);
    if (value === null) throw `Biểu thức không hợp lệ ${expr}`;
    return value;
}

export async function saveBot(data: BotInfo, userData: UserTokenInfo) {
    const botName = data.botName;
    if (!validatekBotName(botName)) {
        throw `Tên bot không hợp lệ ${botName}`;
    }

    // const edges = data.treeData.elements.edges?.filter(item => !item.removed).map(item => item.data) || []; //{source, target, id}
    const nodes = data.treeData.elements.nodes?.filter(item => !item.removed).map(item => item.data) || []; //{id, name}

    // console.log({ edges, nodes });

    for (let node of nodes) {
        if (!isValidCondition(node)) {
            console.log('invalid condition ', node.value);
            throw `Điều kiện không hợp lệ ${node.value}`;
        }
    }

    if (!buildRoute(data)) {
        throw 'Điều kiện vòng tròn';
    }

    let IV: string = '';

    if (data.apiKey || data.secretKey) {
        const query = `SELECT iv, apiKey, secretKey FROM Bot WHERE botName = ?`;
        const res = await mysql.query(query, [botName]);
        if (res.length) {
            const { iv, apiKey, secretKey } = res[0];
            if (data.apiKey === apiKey && data.secretKey === secretKey) {
                const key = process.env.ENCRYP_KEY || '';
                data.apiKey = apiKey;
                data.secretKey = util.decryptAES(secretKey, key, iv);
                IV = iv;
            }
        }
        console.log(data.apiKey, data.secretKey)

        const client = Binance({
            apiKey: data.apiKey!,
            apiSecret: data.secretKey!
        });
        try {
            const account = await client.futuresAccountInfo();
            if (!account) {
                throw "api key không hợp lệ";
            }
            console.log('account.availableBalance: ', account.availableBalance);
        } catch (error: any) {
            throw `api key không hợp lệ. ${error.message}`;
        }
    }

    const [{ count }] = await mysql.query(
        `SELECT count(1) AS count 
            FROM Bot
            WHERE botName = ?`,
        [data.botName]);

    if (count === 0) {
        console.log('Insert new bot', data.botName);
        const sql = `INSERT INTO Bot(botName, idTelegram, route, symbolList, timeframes, treeData, userID, apiKey, secretKey, iv, enableRealOrder) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
        const iv = IV || util.generateRandomIV();
        const key = process.env.ENCRYP_KEY || '';
        const apiKey = data.apiKey || '';
        const secretKey = data.secretKey ? util.encryptAES(data.secretKey, key, iv) : '';
        await mysql.query(sql,
            [
                data.botName,
                data.idTelegram,
                JSON.stringify(data.route),
                JSON.stringify(data.symbolList),
                JSON.stringify(data.timeframes),
                JSON.stringify(data.treeData),
                userData.id,
                apiKey,
                secretKey,
                iv,
                data.enableRealOrder
            ]);
    }
    else {
        console.log(' Update bot', data.botName);
        const iv = IV || util.generateRandomIV();
        const key = process.env.ENCRYP_KEY || '';
        const apiKey = data.apiKey || '';
        const secretKey = data.secretKey ? util.encryptAES(data.secretKey, key, iv) : '';

        const sql = `UPDATE Bot
                    SET idTelegram = ?,
                        route = ?,
                        symbolList = ?,
                        timeframes = ?,
                        treeData = ?,
                        apiKey = ?,
                        secretKey = ?,
                        iv = ?,
                        enableRealOrder = ?
                    WHERE botName = ?
                        `;

        await mysql.query(sql,
            [
                data.idTelegram,
                JSON.stringify(data.route),
                JSON.stringify(data.symbolList),
                JSON.stringify(data.timeframes),
                JSON.stringify(data.treeData),
                apiKey,
                secretKey,
                iv,
                data.enableRealOrder,
                data.botName
            ]);
    }

}

export async function checkNode(data: NodeData) {
    console.log('check', data);

    if (!data.id || !isValidCondition(data)) {
        throw `Điều kiện không hợp lệ ${data.value}`;
    }
}

export async function deleteBot(botName: string) {
    const conncection = await mysql.getConnection();
    const [{ id }] = await mysql.query_transaction(conncection, `Select id FROM Bot WHERE botName = ?`, [botName]);
    await mysql.query_transaction(conncection, `DELETE FROM Orders WHERE botID = ?`, [id]);
    await mysql.query_transaction(conncection, `DELETE FROM Bot WHERE id = ?`, [id]);
    conncection.release();
    return [];
}

export async function clearHistory(botName: string) {
    const [{ id }] = await mysql.query(`Select id FROM Bot WHERE botName = ?`, [botName]);
    await mysql.query(`DELETE FROM Orders WHERE botID = ?`, [id]);
    return [];
}

export async function requireOwnBot(botName: string, userData: UserTokenInfo) {
    if (userData.role === ROLE.ADMIN) return true;

    const bot = await mysql.query(`SELECT userID FROM Bot WHERE botName = ?`, [botName]);
    if (bot.length === 0 || bot[0].userID === userData.id) return true;
    return false;
}

export async function getOrders(args: any) {
    const { botName, symbol, orderId, startTime, endTime, limit = 100 } = args;
    const sql = `SELECT apiKey, secretKey, iv FROM Bot WHERE botName = ?`;
    const bot = await mysql.query(sql, [botName]);
    if (bot.length === 0) {
        throw `Không tìm thấy bot ${botName}`;
    }

    const { apiKey, secretKey, iv } = bot[0];
    if (!apiKey || !secretKey || !iv) {
        throw 'Chưa cấu hình api key';
    }

    const key = process.env.ENCRYP_KEY || '';
    const decryptedSecretKey = util.decryptAES(secretKey, key, iv);
    const client = Binance({
        apiKey: apiKey,
        apiSecret: decryptedSecretKey
    });
    try {
        const args = JSON.parse(JSON.stringify({ symbol, orderId, startTime, endTime, limit, recvWindow: 30000 }));
        const order = await client.futuresAllOrders(args);
        return order;
    } catch (error: any) {
        if (error.code === -2011) {
            throw `Không tìm thấy lệnh ${orderId}`;
        }
        throw error.message || 'Lỗi khi lấy trạng thái lệnh';
    }
}

export async function setLeverage(botName: string, leverage: number, marginType: 'ISOLATED' | 'CROSSED') {
    let errorMess: string = '';

    const sql = `SELECT symbolList, apiKey, secretKey, iv FROM Bot WHERE botName = ?`;
    const bot = await mysql.query(sql, [botName]);
    if (bot.length === 0) {
        throw `Không tìm thấy bot ${botName}`;
    }
    const { apiKey, secretKey, iv } = bot[0];
    if (!apiKey || !secretKey || !iv) {
        throw 'Chưa cấu hình api key';
    }
    const key = process.env.ENCRYP_KEY || '';
    const decryptedSecretKey = util.decryptAES(secretKey, key, iv);
    const client = Binance({
        apiKey: apiKey,
        apiSecret: decryptedSecretKey
    });
    const symbolList: Array<string> = (JSON.parse(bot[0].symbolList) as Array<string>).map((item) => item.split(':')).filter(item => item[0] === 'binance_future').map(item => item[1]);

    const futuresLeverageBracket = await client.futuresLeverageBracket({} as any);
    const leverageMap: { [key: string]: number } = {};
    for (let bracket of futuresLeverageBracket) {
        leverageMap[bracket.symbol] = bracket.brackets[0].initialLeverage; //max leverage
    }
    let futuresPositionRisk = await client.futuresPositionRisk();
    const currentLeverageMap: { [key: string]: number } = {};
    for (let position of futuresPositionRisk) {
        console.log(position)
        if (position.leverage) {
            currentLeverageMap[position.symbol] = +position.leverage;
        }
    }

    let promistList = [];

    for (let symbol of symbolList) {
        promistList.push((async () => {
            try {
                await client.futuresMarginType({
                    symbol: symbol,
                    marginType: marginType
                });
            }
            catch (err: any) {
                if (err.code !== -4046) {
                    console.error(`Set margin type ${marginType} for ${symbol} failed: ${err.message}`);
                }
            }
            try {
                let effectiveLeverage = Math.min(leverage, leverageMap[symbol] || 20);
                if (currentLeverageMap[symbol] && currentLeverageMap[symbol] === effectiveLeverage) {
                    console.log(`Leverage for ${symbol} is already x${effectiveLeverage}, skip setting.`);
                    return;
                }
                await client.futuresLeverage({
                    symbol: symbol,
                    leverage: effectiveLeverage
                });
                console.log(`Set leverage x${effectiveLeverage} for ${symbol} success`);
            } catch (error: any) {
                console.error(`Set leverage x${leverage} for ${symbol} failed: ${error.message}`);
                errorMess += `${symbol}: ${error.message}\n`;
            }
        })());
        if (promistList.length > 50) {
            await Promise.all(promistList);
            promistList = [];
        }
    }
    await Promise.all(promistList);
    if (errorMess) {
        throw errorMess;
    }
}