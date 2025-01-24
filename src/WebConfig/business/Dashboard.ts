import { ROLE, UserTokenInfo } from '../../common/Interface';
import * as mysql from '../lib/mysql';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../../.env` });

export async function getBotInfo(userData: UserTokenInfo) {
    const sql = `SELECT b.botName,
                    COUNT(IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, 1, NULL)) tradeCountClosed,
                    COUNT(IF(o.timeSL IS NULL AND o.timeTP IS NULL, 1, NULL)) tradeCountOpening,
                    SUM(IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, o.profit, 0)) AS profit,
                    SUM(IF(o.timeSL IS NULL AND o.timeTP IS NULL, o.profit, 0)) AS unrealizedProfit,
                    SUM(IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, o.entry * o.volume, 0)) AS volumeClosed,
                    SUM(IF(o.timeSL IS NULL AND o.timeTP IS NULL, o.entry * o.volume, 0)) AS volumeOpening,
                    COUNT(IF(o.profit >= 0 AND ( o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL), 1, NULL)) / COUNT(1) * 100 AS winrate
                FROM Bot b
                JOIN User u ON u.id = b.userID
                JOIN Orders o ON o.botID = b.id
                WHERE (u.id = ? OR ? = ?) AND o.status <> 'Đã hủy'
                GROUP BY b.id
                ORDER BY b.botName ASC;`;
    const data = await mysql.query(sql, [userData.id, userData.role, ROLE.ADMIN]);
    return data;
}