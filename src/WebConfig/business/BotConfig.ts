import { BotInfo, CustomRequest, MAX_CANDLE, NODE_TYPE, Node, NodeData, ROLE, RateData, UserTokenInfo } from '../../common/Interface';
import { calculate, calculateSubExpr, isValidCondition } from '../../common/Expr';
import * as util from '../../common/util'
import * as mysql from '../lib/mysql';
import moment from 'moment';
import dotenv from 'dotenv';
import axios from 'axios';
import Binance from 'binance-api-node';

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

export async function getBotList(userData: UserTokenInfo) {
    const botList = await mysql.query(`SELECT botName 
                                        FROM Bot 
                                        WHERE userID = ? OR ? = ?
                                        ORDER BY botName ASC`, [userData.id, userData.role, ROLE.ADMIN]);
    const data = botList.map((item: { botName: any; }) => item.botName);
    return data;
}

export async function getHistoryOrder(botName: string, filterBroker: Array<string>, filterTimeframe: Array<string>) {
    const orders = await mysql.query(`SELECT b.id,o.symbol,o.broker,o.timeframe,o.orderType,o.volume,o.stop,o.entry,o.tp,o.sl,o.profit,o.status,o.createdTime,o.expiredTime,o.timeStop,o.timeEntry,o.timeTP,o.timeSL,o.lastTimeUpdated
                                        FROM Orders o
                                        JOIN Bot b ON b.id = o.botID
                                        WHERE b.botName = ?
                                            AND o.broker IN (?)
                                            AND o.timeframe IN (?)
                                        ORDER BY o.createdTime DESC`, [botName, filterBroker, filterTimeframe]);

    const startTime = orders.length > 0 ? orders.at(-1).createdTime : moment().subtract(30, 'day').valueOf();

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

            const history = await client.futuresIncome({
                limit: 1000,
                incomeType: 'REALIZED_PNL',
                startTime: startTime,
                endTime: new Date().getTime(),
                recvWindow: 30000
            });
            for (let item of history) {
                if (item.asset === 'USDT') {
                    tradeReal.push(item);
                }
            }
            accountInfo = await client.futuresAccountInfo();
            accountInfo.positions = accountInfo.positions.filter(item => item.initialMargin != '0');
            accountInfo.positions.sort((a, b) => (+a.unrealizedProfit) - (+b.unrealizedProfit));
        }
    }
    tradeReal.sort((a, b) => a.time - b.time);

    return {
        orders,
        tradeReal,
        accountInfo
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