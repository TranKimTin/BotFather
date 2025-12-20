import * as util from './common/util';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

async function main() {
    // const symbolList = await util.getBinanceFutureSymbolList();
   const symbolList = ['BTCUSDT', '0GUSDT'];
    const since = new Date('2025-01-01').getTime();
    for (const symbol of symbolList) {
        const months = (await util.getBinanceFutureOHLCV(symbol, '1M', 300, since)).map(item => moment(item.startTime).format('YYYY-MM')).reverse();
        months.pop();
        for (const month of months) {
            await util.downloadData(symbol, month, '../data');
        } 
    }
}

main();