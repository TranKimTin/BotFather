import { createClient, RedisFunctions, RedisModules, RedisScripts } from 'redis';
import { RedisClientType } from '@redis/client';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

let client: ReturnType<typeof createClient>;

initConnection();

async function initConnection() {
    if (!client) {
        const redis_username = process.env.REDUS_USERNAME || '';
        const redis_password = process.env.REDIS_PASSWORD || '';
        const redis_host = process.env.REDIS_SERVER || '127.0.0.1';
        const redis_port = process.env.REDIS_PORT || 6379;

        client = await createClient({
            url: `redis://${redis_username}:${redis_password}@${redis_host}:${redis_port}`,
            socket: {
                connectTimeout: 10 * 60 * 100,
                timeout: 10 * 60 * 1000,
                keepAlive: 10 * 60 * 1000
            }
        })
            .on('error', err => console.error('Redis Client Error', err))
            .connect();
        console.log(`connected redis server ${redis_host}:${redis_port}`);
    }
}

export async function get(key: string) {
    if (!client) await initConnection();
    return client.get(key);
}

export async function getArray(key: string): Promise<Array<string>> {
    if (!client) await initConnection();
    return await client.lRange(key, 0, -1)
}

export async function pushFront(key: string, value: string) {
    if (!client) await initConnection();
    return await client.lPush(key, value)
}

export async function pushBack(key: string, value: string) {
    if (!client) await initConnection();
    return await client.rPush(key, value)
}

export async function popFront(key: string) {
    if (!client) await initConnection();
    return await client.lPop(key)
}

export async function popBack(key: string) {
    if (!client) await initConnection();
    return await client.rPop(key)
}

export async function getAt(key: string, index: number) {
    if (!client) await initConnection();
    return client.lIndex(key, index);
}

export async function setByIndex(key: string, index: number, value: string) {
    if (!client) await initConnection();
    return client.lSet(key, index, value);
}

export async function length(key: string) {
    if (!client) await initConnection();
    return client.lLen(key);
}

export async function set(key: string, value: string) {
    if (!client) await initConnection();
    return await client.set(key, value);
}

export async function remove(key: string) {
    if (!client) await initConnection();
    return await client.del(key);
}

export async function clearAll() {
    if (!client) await initConnection();
    return await client.flushAll();
}