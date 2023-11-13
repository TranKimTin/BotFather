import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

//https://docs.google.com/spreadsheets/d/${id}/edit#gid={sheetID}
export class GoogleSheet {
    private serviceAccountAuth: JWT;
    private sheetIDResistance: number;
    private sheetID_lc: number;
    private id: string;
    private list: Array<Array<string | number>>;
    private listLC: Array<Array<string | number>>;
    private timeout: any;
    private timeoutLC: any;

    constructor() {
        this.serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SHEET_EMAIL,
            key: process.env.GOOGLE_SHEET_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        this.sheetIDResistance = 1402460613;
        this.sheetID_lc = 253910119;
        this.id = '1Y66p8jvlSJeBafEcWuzfs8G4iK4NeMS_OVXDefrG4BM';

        this.list = [];
        this.listLC = [];
    }

    async getSheet(sheetID: number) {
        try {
            let doc = new GoogleSpreadsheet(this.id, this.serviceAccountAuth);
            await doc.loadInfo();

            let sheet = doc.sheetsById[sheetID];
            return sheet;
        }
        catch (err) {
            console.log('getSheet error', err);
            return null;
        }
    };

    async addRow(symbol: string, side: string, timeframe: string, entry1: number | string, entry2: number | string, tp1: number | string, tp2: number | string, sl: number | string, rsi: number | string) {
        try {
            // let totalRow = sheet.rowCount;
            // const rows = await sheet.getRows();
            // for (let row of rows) {
            //     let tt = row.get('TT');
            //     let coin = row.get('Coin');
            //     let longshort = row.get('Long/Short');
            //     console.log(tt, coin, longshort)
            // }
            let row = [symbol, side, timeframe, moment().format('YYYY-MM-DD HH:mm'), entry1, entry2, tp1, tp2, sl, '', '', '', '', '', '', rsi];
            console.log('add row google sheet resistance');
            console.log(JSON.stringify(row));

            this.list.push(row);
            clearTimeout(this.timeout);
            this.timeout = setTimeout(async () => {
                let sheet = await this.getSheet(this.sheetIDResistance);
                let rows = [...this.list];
                this.list = [];
                for (let item of rows) {
                    await sheet?.addRow(item);
                }
            }, 1000);
        }
        catch (err) {
            console.log("ERROR sheet", err);
        }
    }

    async addRowLC(symbol: string, side: string, timeframe: string, entry: number | string, tp: number | string, sl: number | string) {
        try {
            let row = [symbol, side, timeframe, moment().format('YYYY-MM-DD HH:mm'), entry, tp, sl];
            console.log('add row google sheet lòng chảo');
            console.log(JSON.stringify(row));

            this.listLC.push(row);
            clearTimeout(this.timeoutLC);
            this.timeoutLC = setTimeout(async () => {
                let sheet = await this.getSheet(this.sheetID_lc);
                let rows = [...this.listLC];
                this.listLC = [];
                for (let item of rows) {
                    await sheet?.addRow(item);
                }
            }, 1000);
        }
        catch (err) {
            console.log("ERROR sheet", err);
        }
    }
}
 export default new GoogleSheet();