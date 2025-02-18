import dotenv from 'dotenv';
import * as util from './common/util';
import Binance from 'binance-api-node'
import Telegram from './common/telegram';

dotenv.config({ path: '../.env' });

async function main() {
    const telegram = new Telegram(undefined, undefined, false);
    const client = Binance();
    const spotList = await util.getBinanceSymbolList();
    const futureList = await util.getBinanceFutureSymbolList();
    const symbolList: Array<string> = spotList.filter(item => futureList.includes(item));
    const volume = 15; //USDT

    const spotPrice: { [key: string]: number } = {};
    const futurePrice: { [key: string]: number } = {};

    for (const symbol of symbolList) {
        spotPrice[symbol] = 0;
        futurePrice[symbol] = 0;
    }

    const args = symbolList.map(symbol => ({ symbol, level: 5 }));
    client.ws.partialDepth(args, depth => {
        const symbol = depth.symbol.split('@')[0];
        let totalVol = 0;
        for (const data of depth.asks) {
            const price = +data.price;
            const quantity = +data.quantity;
            totalVol += price * quantity;
            if (totalVol >= volume) {
                spotPrice[symbol] = price;
                break;
            }
        }
    });

    client.ws.futuresPartialDepth(args, (depth: any) => {
        const symbol = depth.symbol;
        let totalVol = 0;
        for (const data of depth.bidDepth) {
            const price = +data.price;
            const quantity = +data.quantity;
            totalVol += price * quantity;
            if (totalVol >= volume) {
                futurePrice[symbol] = price;
                break;
            }
        }
    });

    setInterval(() => {
        for (let symbol of symbolList) {
            const spotAsk = spotPrice[symbol];
            const futureBid = futurePrice[symbol];
            if (!spotAsk || !futureBid) continue;
            const diff = (futureBid - spotAsk) / spotAsk * 100;
            if (diff > 1.3) {
                telegram.sendMessage(`${symbol} - diff: ${+diff.toFixed(3)} %, spot: ${spotAsk}, future: ${futureBid}`, 1833284254);
            }
        }
    }, 1000);
}


main();