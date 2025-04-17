import Binance, { NewFuturesOrder } from 'binance-api-node'
import { NewOrderArgs, NODE_TYPE } from './common/Interface';
import delay from 'delay';

export class BinanceFuture {
    private client;

    constructor(apiKey: string, apiSecret: string) {
        this.client = Binance({
            apiKey,
            apiSecret,
            httpFutures: 'https://testnet.binancefuture.com',
            wsFutures: 'wss://stream.binancefuture.com/ws'
        });

    }

    async init(): Promise<BinanceFuture> {
        const futuresUser = await this.client.ws.futuresUser(msg => {
            console.log({ msg })
        });
        await this.client.futuresPing();
        await delay(500);
        return this;
    }


    async openOrder(args: NewOrderArgs) {
        const { symbol, type, volume, stop, limit, tp, sl } = args;
        const orders: Array<NewFuturesOrder> = [];

        //entry
        if (type === NODE_TYPE.BUY_LIMIT || type === NODE_TYPE.SELL_LIMIT) {
            orders.push({
                symbol,
                side: type === NODE_TYPE.BUY_LIMIT ? 'BUY' : 'SELL',
                type: 'LIMIT',
                quantity: volume,
                price: limit,
                timeInForce: 'GTC',
            });
        }
        else if (type === NODE_TYPE.BUY_MARKET || type === NODE_TYPE.SELL_MARKET) {
            orders.push({
                symbol,
                side: type === NODE_TYPE.BUY_MARKET ? 'BUY' : 'SELL',
                type: 'MARKET',
                quantity: volume
            });
        }
        else if (type === NODE_TYPE.BUY_STOP_LIMIT || type === NODE_TYPE.SELL_STOP_LIMIT) {
            orders.push({
                symbol,
                side: type === NODE_TYPE.BUY_STOP_LIMIT ? 'BUY' : 'SELL',
                type: 'STOP',
                quantity: volume,
                price: limit,
                stopPrice: stop,
                timeInForce: 'GTC'
            });
        }
        else if (type === NODE_TYPE.BUY_STOP_MARKET || type === NODE_TYPE.SELL_STOP_MARKET) {
            orders.push({
                symbol,
                side: type === NODE_TYPE.BUY_STOP_MARKET ? 'BUY' : 'SELL',
                type: 'STOP_MARKET',
                quantity: volume,
                stopPrice: stop,
                timeInForce: 'GTC'
            });
        }

        if (orders.length === 0) {
            console.error('openOrder invalid parameter', args);
            return;
        };


        //TP
        if (tp) {
            const entry = orders[0];
            const entrySide = entry.side;
            const closeSide = (entrySide === 'BUY') ? 'SELL' : 'BUY';
            orders.push({
                symbol,
                side: closeSide,
                type: 'TAKE_PROFIT',
                stopPrice: limit,
                price: tp,
                quantity: volume,
                timeInForce: 'GTC',
                reduceOnly: 'true'
            })
        }

        console.log(orders);

        const result = await this.client.futuresBatchOrders({
            batchOrders: JSON.stringify(orders) as any
        })

        console.log(result);
    }

}