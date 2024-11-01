import mysql, { Connection, PoolConnection } from 'mysql';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

let pool: mysql.Pool;

export function init() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
    }
}

export function getConnection(): Promise<PoolConnection> {
    init();
    return new Promise((resolve, reject) => {
        if (!pool) return reject('pool is not ready');
        pool.getConnection((err, connection) => {
            if (err) return reject(err);
            else resolve(connection);
        });
    });
}

export function query_transaction(connection: PoolConnection, query: string, params: Array<any>) {
    init();
    return new Promise((resolve, reject) => {
        if (!connection) return reject('connection undefined');
        connection.query(query, params, (err, rows) => {
            if (err) {
                connection?.rollback();
                return reject(err);
            } else {
                resolve(rows);
            }
        })
    });
}

export function query(query: string, params: Array<any>) {
    init();
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results, fields) => {
            if (error) return reject(error);
            results = JSON.parse(JSON.stringify(results));
            resolve(results);
        });
    });
}

export const lib = mysql;