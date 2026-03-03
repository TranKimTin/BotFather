import * as util from './common/util';
import moment from 'moment';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '../.env' });

type OHLCV = {
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

async function getBinanceOHLCV1mMonth(symbol: string, year: number, month: number // 1-12
): Promise<OHLCV[]> {

    const limit = 1000;
    const intervalMs = 60000;

    const startTime = Date.UTC(year, month - 1, 1);
    const endTime =
        month === 12
            ? Date.UTC(year + 1, 0, 1)
            : Date.UTC(year, month, 1);

    let current = startTime;
    const result: OHLCV[] = [];

    while (current < endTime) {
        const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=1m&startTime=${current}&limit=${limit}`;

        const res = await fetch(url);
        const data = await res.json() as Array<any>;

        if (!data.length) break;

        for (const k of data) {
            const openTime = k[0];
            if (openTime >= endTime) break;

            result.push({
                time: openTime,
                open: Number(k[1]),
                high: Number(k[2]),
                low: Number(k[3]),
                close: Number(k[4]),
                volume: Number(k[5]),
            });
        }

        const lastOpenTime = data[data.length - 1][0];
        current = lastOpenTime + intervalMs;

        await new Promise(r => setTimeout(r, 30)) // tránh rate limit
    }

    return result
}

async function main() {
    const symbolList = await util.getBinanceFutureSymbolList();
    if (!fs.existsSync('../data')) {
        fs.mkdirSync('../data');
    }
    // const symbolList = ['LTCUSDT'];
    const since = new Date('2019-10-01').getTime();
    let i = 0;
    for (const symbol of symbolList) {
        const months = (await util.getBinanceFutureOHLCV(symbol, '1M', 300, since)).map(item => moment(item.startTime).format('YYYY-MM')).reverse();
        months.pop();
        for (const month of months) {
            const binPath = `../data/${symbol}-1m-${month}.bin`;
            if (fs.existsSync(binPath)) {
                continue;
            }
            console.log(`Downloading ${symbol} 1m data for ${month}...`);
            const data = await getBinanceOHLCV1mMonth(symbol, Number(month.slice(0, 4)), Number(month.slice(5, 7)));
            const buffer = Buffer.alloc(data.length * 6 * 8); // n row * 6 column * 8 bytes per value
            let offset = 0;
            for (const row of data) {
                buffer.writeBigInt64LE(BigInt(row.time), offset);
                offset += 8;
                buffer.writeDoubleLE(row.open, offset);
                offset += 8;
                buffer.writeDoubleLE(row.high, offset);
                offset += 8;
                buffer.writeDoubleLE(row.low, offset);
                offset += 8;
                buffer.writeDoubleLE(row.close, offset);
                offset += 8;
                buffer.writeDoubleLE(row.volume, offset);
                offset += 8;
            }

            fs.writeFileSync(binPath, buffer);
        }
        i++;
        console.log(`Downloaded data for ${i}/${symbolList.length} symbols.`);
    }
}

main();