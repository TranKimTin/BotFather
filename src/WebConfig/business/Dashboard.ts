import { ORDER_STATUS, ROLE, UserTokenInfo } from '../../common/Interface';
import * as mysql from '../lib/mysql';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../../.env` });

export async function getBotInfo(userData: UserTokenInfo) {
    const sql = `SELECT b.botName,
                    COUNT(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, 1, NULL), NULL)) AS tradeCountClosed,
                    COUNT(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NULL AND o.timeTP IS NULL, 1, NULL), NULL)) AS tradeCountOpening,
                    SUM(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, o.profit, 0), 0)) AS profit,
                    SUM(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NULL AND o.timeTP IS NULL, o.profit, 0), 0)) AS unrealizedProfit,
                    SUM(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, (o.entry + IF(o.timeSL IS NOT NULL, o.sl, o.tp)) / 2 * o.volume, 0), 0)) AS volumeClosed,
                    SUM(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.timeSL IS NULL AND o.timeTP IS NULL, o.entry * o.volume, 0), 0)) AS volumeOpening,
                    COUNT(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), IF(o.profit >= 0 AND ( o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL), 1, NULL), NULL)) / COUNT(IF(o.status in ('Khớp TP', 'Khớp SL', 'Khớp entry'), 1, 0)) * 100 AS winrate
                FROM Bot b
                JOIN User u ON u.id = b.userID
                LEFT JOIN Orders o ON o.botID = b.id
                WHERE (u.id = ? OR ? = ?) AND o.status in (?,?,?)
                GROUP BY b.id
                ORDER BY b.botName ASC;`;
    const data = await mysql.query(sql, [userData.id, userData.role, ROLE.ADMIN, ORDER_STATUS.MATCH_ENTRY, ORDER_STATUS.MATCH_TP, ORDER_STATUS.MATCH_SL]);
    return data;
}