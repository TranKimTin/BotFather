import { ORDER_STATUS, ROLE, UserTokenInfo } from '../../common/Interface';
import * as mysql from '../lib/mysql';
import * as util from '../../common/util';
import Binance from 'binance-api-node';
import dotenv from 'dotenv';
import * as redis from '../../common/redis';

dotenv.config({ path: `${__dirname}/../../../.env` });

export async function getBotInfo(userData: UserTokenInfo) {
    const data = (await util.getBotInfo()).filter(item => item.id == userData.id || userData.role == ROLE.ADMIN);

    const accountInfo: { [key: string]: any } = {};
    const openOrders: { [key: string]: any[] } = {};
    let promiseList: Array<Promise<any>> = [];

    for (const item of data) {
        if (item.apiKey && item.secretKey && item.iv) {
            const apiKey = item.apiKey;
            if (!accountInfo[apiKey]) {
                accountInfo[apiKey] = {
                    totalWalletBalance: 0,
                    availableBalance: 0,
                    totalUnrealizedProfit: 0
                };
                openOrders[apiKey] = [];

                promiseList.push((async () => {
                    const secretKey = util.decryptAES(item.secretKey, process.env.ENCRYP_KEY!, item.iv);
                    let client = Binance({
                        apiKey: apiKey,
                        apiSecret: secretKey
                    });
                    try {
                        accountInfo[apiKey] = await client.futuresAccountInfo();
                        accountInfo[apiKey].positions = accountInfo[apiKey].positions.filter((item: any) => item.initialMargin != '0');
                        accountInfo[apiKey].positions.sort((a: any, b: any) => (+a.unrealizedProfit) - (+b.unrealizedProfit));
                        openOrders[apiKey] = await client.futuresOpenOrders({});
                        const algoOpenOrder = await client.futuresGetOpenAlgoOrders({}) as any;
                        openOrders[apiKey].push(...algoOpenOrder);

                        openOrders[apiKey].sort((a: any, b: any) => a.symbol.localeCompare(b.symbol));
                    }
                    catch (err) {
                        console.error(item.botName, err);
                    }
                })());

                if (promiseList.length >= 10) {
                    await Promise.all(promiseList);
                    promiseList = [];
                }
            }
        }
    }
    if (promiseList.length >= 10) {
        await Promise.all(promiseList);
    }
    for (const item of data) {
        if (item.apiKey && item.secretKey && item.iv) {
            const apiKey = item.apiKey;
            item.accountInfo = accountInfo[apiKey];
            item.openOrders = openOrders[apiKey];
        }
        else {
            item.accountInfo = {
                totalWalletBalance: 0,
                availableBalance: 0,
                totalUnrealizedProfit: 0,
            };
            item.openOrders = [];
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