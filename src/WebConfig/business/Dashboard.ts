import { ORDER_STATUS, ROLE, UserTokenInfo } from '../../common/Interface';
import * as mysql from '../lib/mysql';
import * as util from '../../common/util';
import Binance, { FuturesAccountInfoResult } from 'binance-api-node';
import dotenv from 'dotenv';
import * as redis from '../../common/redis';

dotenv.config({ path: `${__dirname}/../../../.env` });

export async function getBotInfo(userData: UserTokenInfo) {
    const key = `getBotInfo_${userData.id}`;
    let cache = await redis.get(key);
    if (!cache) {
        const sql = `SELECT u.email, b.botName, b.enableRealOrder, b.apiKey, b.secretKey, b.iv,
                    COUNT(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, 1, NULL), NULL)) AS tradeCountClosed,
                    COUNT(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NULL AND o.timeTP IS NULL, 1, NULL), NULL)) AS tradeCountOpening,
                    SUM(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, o.profit, 0), 0)) AS profit,
                    SUM(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NULL AND o.timeTP IS NULL, o.profit, 0), 0)) AS unrealizedProfit,
                    SUM(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, (o.entry + IF(o.timeSL IS NOT NULL, o.sl, o.tp)) / 2 * o.volume, 0), 0)) AS volumeClosed,
                    SUM(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NULL AND o.timeTP IS NULL, o.entry * o.volume, 0), 0)) AS volumeOpening,
                    COUNT(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.profit >= 0 AND ( o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL), 1, NULL), NULL)) / COUNT(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), 1, NULL)) * 100 AS winrate
                FROM Bot b
                JOIN User u ON u.id = b.userID
                LEFT JOIN Orders o ON o.botID = b.id
                WHERE (u.id = ? OR ? = ?)
                GROUP BY b.id
                ORDER BY b.enableRealOrder DESC, b.botName ASC;`;
        const data = await mysql.query(sql, [userData.id, userData.role, ROLE.ADMIN, ORDER_STATUS.MATCH_ENTRY, ORDER_STATUS.MATCH_TP, ORDER_STATUS.MATCH_SL]);
        cache = JSON.stringify(data);
        await redis.set(key, cache, 1800);
    }
    const data: Array<any> = JSON.parse(cache);

    const accountInfo: { [key: string]: FuturesAccountInfoResult } = {};

    for (const item of data) {
        if (item.apiKey && item.secretKey && item.iv) {
            const apiKey = item.apiKey;
            if (!accountInfo[apiKey]) {
                const secretKey = util.decryptAES(item.secretKey, process.env.ENCRYP_KEY!, item.iv);
                let client = Binance({
                    apiKey: apiKey,
                    apiSecret: secretKey
                });
                accountInfo[apiKey] = await client.futuresAccountInfo();
                accountInfo[apiKey].positions = accountInfo[apiKey].positions.filter(item => item.initialMargin != '0');
                accountInfo[apiKey].positions.sort((a, b) => (+a.unrealizedProfit) - (+b.unrealizedProfit));
            }
            item.accountInfo = accountInfo[apiKey];
        }
        else {
            item.accountInfo = {
                totalWalletBalance: 0,
                availableBalance: 0,
                totalUnrealizedProfit: 0
            };
        }
        delete item.apiKey;
        delete item.secretKey;
        delete item.iv;

        if (item.winrate === null) {
            item.winrate = 0;
        }
    }
    return data;
}