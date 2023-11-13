import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import moment from 'moment';
import * as ccxt from 'ccxt';
import delay from 'delay';

async function getOHLCV(symbol: string, since: number | undefined) {
    try {
        let binance = new ccxt.binanceusdm({});
        let ret = [];
        while (1) {
            let res = await binance.fetchOHLCV(symbol, '1m', since, 1000);
            let data = res.map(item => ({
                symbol,
                startTime: item[0],
                timestring: moment(item[0]).format('YYYY-MM-DD HH:mm'),
                open: item[1],
                high: item[2],
                low: item[3],
                close: item[4],
                volume: item[5],
            }));
            ret.push(...data);
            if (data.length < 1000) break;
            since = data[999].startTime + 1000;
        }

        return ret;
    }
    catch (err) {
        console.error({ symbol }, err);
        return [];
    }
}

async function main() {
    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SHEET_EMAIL,
            key: process.env.GOOGLE_SHEET_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });
        let sheetID = 1402460613;
        let id = '1Y66p8jvlSJeBafEcWuzfs8G4iK4NeMS_OVXDefrG4BM';
        const doc = new GoogleSpreadsheet(id, serviceAccountAuth);
        await doc.loadInfo(); // loads document properties and worksheets
        let sheet = doc.sheetsById[sheetID];

        let totalRow = sheet.rowCount;
        const rows = await sheet.getRows();
        for (let row of rows) {
            try {
                let symbol = row.get('Coin');
                // console.log(row.get('TP entry 2'))
                let side = row.get('Long/Short');
                let timeframe = row.get('Time');
                let timestamp = row.get('Báo vào lúc')
                let entry1 = row.get('Entry 1')?.replace(',', '.') * 1;
                let entry2 = row.get('Entry 2')?.replace(',', '.') * 1;
                let TP1 = row.get('TP entry 1')?.replace(',', '.') * 1;
                let TP2 = row.get('TP entry 2')?.replace(',', '.') * 1;
                let SL = row.get('SL')?.replace(',', '.') * 1;

                if (!symbol || row.get('Khớp entry 1') == 'không' || row.get('Lợi nhuận %')) continue;

                let expireTime = moment(timestamp).add(timeframe.slice(0, timeframe.length - 1), timeframe[timeframe.length - 1]).valueOf();
                // if (symbol != 'BCHUSDT') continue;
                let data = await getOHLCV(symbol, new Date(timestamp).valueOf());

                let matchEntry1 = '';
                let matchEntry2 = '';
                let matchTP1 = '';
                let matchTP2 = '';
                let matchSL = '';
                let profit: number | '' = '';

                let timeEntry1 = '';
                let timeEntry2 = '';
                let timeTP1 = '';
                let timeTP2 = '';
                let timeSL = '';

                console.log({ symbol, side, timeframe, timestamp, entry1, entry2, TP1, TP2, SL, expireTime });
                for (let rate of data) {
                    if (!matchEntry1 && rate.startTime >= expireTime) {
                        matchEntry1 = 'không';
                        console.log(rate);
                        break;
                    }
                    if (side == 'LONG') {
                        if (!matchEntry1 && rate.low <= entry1) {
                            matchEntry1 = 'Khớp entry 1';
                            timeEntry1 = rate.timestring;
                            console.log('Khớp entry 1', rate);
                        }
                        if (entry2 && matchEntry1 && !matchEntry2 && rate.low <= entry2) {
                            matchEntry2 = 'Khớp entry 2';
                            timeEntry2 = rate.timestring;
                            console.log('Khớp entry 2', rate);
                        }
                        if (matchEntry1 && rate.low <= SL) {
                            matchSL = 'có';
                            matchTP1 = 'không';
                            matchTP2 = 'không';
                            timeSL = rate.timestring;
                            console.log('Dính SL', rate);
                            break;
                        }
                        if (matchEntry1 && !matchEntry2 && rate.high >= TP1) {
                            matchTP1 = 'có';
                            matchTP2 = 'không';
                            matchEntry2 = 'không';
                            matchSL = 'không';
                            timeTP1 = rate.timestring;
                            console.log('khớp TP 1', rate);
                            break;
                        }
                        if (entry2 && matchEntry2 && rate.high >= TP2) {
                            matchTP1 = 'không';
                            matchTP2 = 'có';
                            matchSL = 'không';
                            timeTP2 = rate.timestring;
                            console.log('khớp TP 2', rate);
                            break;
                        }
                    }
                    else if (side == 'SHORT') {
                        if (!matchEntry1 && rate.high >= entry1) {
                            matchEntry1 = 'Khớp entry 1';
                            timeEntry1 = rate.timestring;
                            console.log('Khớp entry 1', rate);
                        }
                        if (entry2 && matchEntry1 && !matchEntry2 && rate.high >= entry2) {
                            matchEntry2 = 'Khớp entry 2';
                            timeEntry2 = rate.timestring;
                            console.log('Khớp entry 2', rate);
                        }
                        if (matchEntry1 && rate.high >= SL) {
                            matchSL = 'có';
                            matchTP1 = 'không';
                            matchTP2 = 'không';
                            timeSL = rate.timestring;
                            console.log('Dính SL', rate);
                            break;
                        }
                        if (matchEntry1 && !matchEntry2 && rate.low <= TP1) {
                            matchTP1 = 'có';
                            matchTP2 = 'không';
                            matchEntry2 = 'không';
                            matchSL = 'không';
                            timeTP1 = rate.timestring;
                            console.log('Khớp TP 1', rate);
                            break;
                        }
                        if (entry2 && matchEntry2 && rate.low <= TP2) {
                            matchTP1 = 'không';
                            matchTP2 = 'có';
                            matchSL = 'không';
                            timeTP2 = rate.timestring;
                            console.log('Khớp TP 2', rate);
                            break;
                        }
                    }
                }

                if (matchEntry1 == 'Khớp entry 1') { //tính lãi
                    let open = entry1;
                    let close = null;
                    if (entry2 && matchEntry2 == 'Khớp entry 2') open = (entry1 + entry2) / 2;
                    if (matchTP1 == 'có') close = TP1;
                    if (entry2 && matchTP2 == 'có') close = TP2;
                    if (matchSL == 'có') close = SL;

                    if (close) {
                        profit = (close - open) / open * 100;
                        if (entry2 && matchEntry2 == 'Khớp entry 2') profit *= 2;
                        if (side == 'SHORT') profit *= -1;
                        console.log({ open, close, profit })
                    }
                }

                if (!entry2) {
                    matchEntry2 = '';
                    matchTP2 = '';
                    timeEntry2 = '';
                    timeTP2 = '';
                }
                console.log({ matchEntry1, matchEntry2, matchTP1, matchTP2, matchSL, profit });
                if (!matchEntry1) continue;
                row.assign({
                    'Khớp entry 1': matchEntry1,
                    'Khớp entry 2': matchEntry2,
                    'Đạt TP entry 1': matchTP1,
                    'Đạt TP entry 2': matchTP2,
                    'Dính SL': matchSL,
                    'Lợi nhuận %': profit
                });

                await row.save();

                //set note
                let rowIndex = (row as any)._rowNumber;
                await sheet.loadCells();

                if (timeEntry1) {
                    sheet.getCellByA1("J" + rowIndex).note = timeEntry1;
                    // await sheet.saveUpdatedCells();
                }
                if (timeEntry2) {
                    sheet.getCellByA1("K" + rowIndex).note = timeEntry2;
                    // await sheet.saveUpdatedCells();
                }
                if (timeTP1) {
                    sheet.getCellByA1("L" + rowIndex).note = timeTP1;
                    // await sheet.saveUpdatedCells();
                }
                if (timeTP2) {
                    sheet.getCellByA1("M" + rowIndex).note = timeTP2;
                    await sheet.saveUpdatedCells();
                }
                if (timeSL) {
                    sheet.getCellByA1("N" + rowIndex).note = timeSL;
                    // await sheet.saveUpdatedCells();
                }
                await sheet.saveUpdatedCells();

                await delay(3000);
                // return;

                if (global.gc) global.gc();
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    catch (err: any) {
        console.log("ERROR sheet", err.message);
        if (global.gc) global.gc();
    }
    finally {
        if (global.gc) global.gc();
    }
}

async function mainLC() {
    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SHEET_EMAIL,
            key: process.env.GOOGLE_SHEET_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });
        //https://docs.google.com/spreadsheets/d/${id}/edit#gid={sheetID}
        let sheetID = 253910119;
        let id = '1Y66p8jvlSJeBafEcWuzfs8G4iK4NeMS_OVXDefrG4BM';
        const doc = new GoogleSpreadsheet(id, serviceAccountAuth);
        await doc.loadInfo(); // loads document properties and worksheets
        let sheet = doc.sheetsById[sheetID];

        let totalRow = sheet.rowCount;
        const rows = await sheet.getRows();
        for (let row of rows) {
            try {
                let symbol = row.get('Coin');
                // console.log(row.get('TP entry 2'))
                let side = row.get('Long/Short');
                let timeframe = row.get('Time');
                let timestamp = row.get('Báo vào lúc')
                let entry1 = row.get('Entry 1')?.replace(',', '.') * 1;
                let entry2 = 0;
                let TP1 = row.get('TP entry 1')?.replace(',', '.') * 1;
                let TP2 = 0;
                let SL = row.get('SL')?.replace(',', '.') * 1;

                if (!symbol || row.get('Khớp entry 1') == 'không' || row.get('Lợi nhuận %')) continue;

                let expireTime = moment(timestamp).add(timeframe.slice(0, timeframe.length - 1), timeframe[timeframe.length - 1]).valueOf();
                // if (symbol != 'BCHUSDT') continue;
                let data = await getOHLCV(symbol, new Date(timestamp).valueOf());

                let matchEntry1 = '';
                let matchEntry2 = '';
                let matchTP1 = '';
                let matchTP2 = '';
                let matchSL = '';
                let profit: number | '' = '';

                let timeEntry1 = '';
                let timeEntry2 = '';
                let timeTP1 = '';
                let timeTP2 = '';
                let timeSL = '';

                console.log({ symbol, side, timeframe, timestamp, entry1, entry2, TP1, TP2, SL, expireTime });
                for (let rate of data) {
                    if (!matchEntry1 && rate.startTime >= expireTime) {
                        matchEntry1 = 'không';
                        console.log(rate);
                        break;
                    }
                    if (side == 'LONG') {
                        if (!matchEntry1 && rate.low <= entry1) {
                            matchEntry1 = 'Khớp entry 1';
                            timeEntry1 = rate.timestring;
                            console.log('Khớp entry 1', rate);
                        }
                        if (entry2 && matchEntry1 && !matchEntry2 && rate.low <= entry2) {
                            matchEntry2 = 'Khớp entry 2';
                            timeEntry2 = rate.timestring;
                            console.log('Khớp entry 2', rate);
                        }
                        if (matchEntry1 && rate.low <= SL) {
                            matchSL = 'có';
                            matchTP1 = 'không';
                            matchTP2 = 'không';
                            timeSL = rate.timestring;
                            console.log('Dính SL', rate);
                            break;
                        }
                        if (matchEntry1 && !matchEntry2 && rate.high >= TP1) {
                            matchTP1 = 'có';
                            matchTP2 = 'không';
                            matchEntry2 = 'không';
                            matchSL = 'không';
                            timeTP1 = rate.timestring;
                            console.log('khớp TP 1', rate);
                            break;
                        }
                        if (entry2 && matchEntry2 && rate.high >= TP2) {
                            matchTP1 = 'không';
                            matchTP2 = 'có';
                            matchSL = 'không';
                            timeTP2 = rate.timestring;
                            console.log('khớp TP 2', rate);
                            break;
                        }
                    }
                    else if (side == 'SHORT') {
                        if (!matchEntry1 && rate.high >= entry1) {
                            matchEntry1 = 'Khớp entry 1';
                            timeEntry1 = rate.timestring;
                            console.log('Khớp entry 1', rate);
                        }
                        if (entry2 && matchEntry1 && !matchEntry2 && rate.high >= entry2) {
                            matchEntry2 = 'Khớp entry 2';
                            timeEntry2 = rate.timestring;
                            console.log('Khớp entry 2', rate);
                        }
                        if (matchEntry1 && rate.high >= SL) {
                            matchSL = 'có';
                            matchTP1 = 'không';
                            matchTP2 = 'không';
                            timeSL = rate.timestring;
                            console.log('Dính SL', rate);
                            break;
                        }
                        if (matchEntry1 && !matchEntry2 && rate.low <= TP1) {
                            matchTP1 = 'có';
                            matchTP2 = 'không';
                            matchEntry2 = 'không';
                            matchSL = 'không';
                            timeTP1 = rate.timestring;
                            console.log('Khớp TP 1', rate);
                            break;
                        }
                        if (entry2 && matchEntry2 && rate.low <= TP2) {
                            matchTP1 = 'không';
                            matchTP2 = 'có';
                            matchSL = 'không';
                            timeTP2 = rate.timestring;
                            console.log('Khớp TP 2', rate);
                            break;
                        }
                    }
                }

                if (matchEntry1 == 'Khớp entry 1') { //tính lãi
                    let open = entry1;
                    let close = null;
                    if (entry2 && matchEntry2 == 'Khớp entry 2') open = (entry1 + entry2) / 2;
                    if (matchTP1 == 'có') close = TP1;
                    if (entry2 && matchTP2 == 'có') close = TP2;
                    if (matchSL == 'có') close = SL;

                    if (close) {
                        profit = (close - open) / open * 100;
                        if (entry2 && matchEntry2 == 'Khớp entry 2') profit *= 2;
                        if (side == 'SHORT') profit *= -1;
                        console.log({ open, close, profit })
                    }
                }

                if (!entry2) {
                    matchEntry2 = '';
                    matchTP2 = '';
                    timeEntry2 = '';
                    timeTP2 = '';
                }
                console.log({ matchEntry1, matchEntry2, matchTP1, matchTP2, matchSL, profit });
                if (!matchEntry1) continue;
                row.assign({
                    'Khớp entry 1': matchEntry1,
                    'Khớp entry 2': matchEntry2,
                    'Đạt TP entry 1': matchTP1,
                    'Đạt TP entry 2': matchTP2,
                    'Dính SL': matchSL,
                    'Lợi nhuận %': profit
                });

                await row.save();

                //set note
                let rowIndex = (row as any)._rowNumber;
                await sheet.loadCells();

                if (timeEntry1) {
                    sheet.getCellByA1("H" + rowIndex).note = timeEntry1;
                    // await sheet.saveUpdatedCells();
                }
                if (timeTP1) {
                    sheet.getCellByA1("I" + rowIndex).note = timeTP1;
                    // await sheet.saveUpdatedCells();
                }
                if (timeSL) {
                    sheet.getCellByA1("J" + rowIndex).note = timeSL;
                    // await sheet.saveUpdatedCells();
                }
                await sheet.saveUpdatedCells();

                await delay(3000);
                // return;

                if (global.gc) global.gc();
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    catch (err: any) {
        console.log("ERROR sheet", err.message);
        if (global.gc) global.gc();
    }
    finally {
        if (global.gc) global.gc();
    }
}

main().then(() => { mainLC() });
setInterval(async () => {
    try {
        console.log('update');
        await main();
        await mainLC();
    }
    catch (err) {
        console.log(err);
    }
}, 10 * 60 * 1000);
