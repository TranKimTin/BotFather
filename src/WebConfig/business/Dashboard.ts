import { BotInfo, CustomRequest, NODE_TYPE, Node, NodeData, ROLE, RateData, UserTokenInfo } from '../../common/Interface';
import { calculate, calculateSubExpr, isValidCondition } from '../../common/Expr';
import * as util from '../../common/util'
import * as mysql from '../lib/mysql';
import moment from 'moment';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: `${__dirname}/../../../.env` });

export async function getBotInfo(userData: UserTokenInfo) {
    const sql = `SELECT botName,
                COUNT(IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, 1, NULL)) tradeCountClosed,
                COUNT(IF(o.timeSL IS NULL AND o.timeTP IS NULL, 1, NULL)) tradeCountOpening,
                SUM(IF(o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL, o.profit, 0)) AS profit,
                SUM(IF(o.timeSL IS NULL AND o.timeTP IS NULL, o.profit, 0)) AS unrealizedProfit,
                COUNT(IF(o.profit >= 0 AND ( o.timeSL IS NOT NULL OR o.timeTP IS NOT NULL), 1, NULL)) / COUNT(1) * 100 AS winrate
                FROM Bot b
                JOIN User u ON u.id = b.userID
                JOIN Orders o ON o.botID = b.id
                WHERE (u.id = ? OR ? = ?) AND o.status <> 'Đã hủy'
                GROUP BY b.id;`;
    const data = await mysql.query(sql, [userData.id, userData.role, ROLE.ADMIN]);
    return data;
}