import http from 'http';
import fs from 'fs';
import Telegram from './telegram';

export interface IConfigResistance {
    InVolumeUSD: number,
    InChangeRSI: number,
    InRSI_Value?: {
        lowerbound: number,
        upperbound: number,
        onlyLowerLong: boolean,
        onlyUpperShort: boolean
    },
    InEntry1Percent: number,
    InEntry2Percent: number,
    InTP1_Percent: number,
    InTP2_Percent: number,
    InSL_Percent: number,
    InTrendUpConfig?: {
        numberOfBar: number,
        minUpPercent: number,
        requireRSI_Up: boolean
    },
    InTrendDownConfig?: {
        numberOfBar: number,
        minDownPercent: number,
        requireRSI_Down: boolean
    },
    InConfigConditionBar?: {
        maxChangePercent: number,
        maxAmplPercent: number,
        barColorBuy: string,
        barColorSell: string
    }
}

export interface IConfigResistance_v2 {
    InVolumeUSD_v2: number,
    InShadown1Percent_v2: number,
    InShadown2Percent_v2: number,
    InNumberOfBarTop_v2: number,
    InNumberOfBarExpired_v2: number,
    InMinAmpl_v2: number,
    InChangePerAmplPercent_v2: number,
    InRSI_Value_v2?: {
        lowerbound_v2: number,
        upperbound_v2: number,
        onlyLowerLong_v2: boolean,
        onlyUpperShort_v2: boolean
    },
    InEnableEntryPricePercent_v2: boolean,
    InEntry1Percent_v2: number,
    InEntry2Percent_v2: number,
    InTP1_Percent_v2: number,
    InTP2_Percent_v2: number,
    InSL_Percent_v2: number,
    InTrendUpConfig_v2?: {
        numberOfBar_v2: number,
        minUpPercent_v2: number,
        requireRSI_Up_v2: boolean
    },
    InTrendDownConfig_v2?: {
        numberOfBar_v2: number,
        minDownPercent_v2: number,
        requireRSI_Down_v2: boolean
    },
    InConfigConditionBar_v2?: {
        barColorBuy_v2: string,
        barColorSell_v2: string
    }
}

export interface IConfigLongChao {
    InVolumeUSD_lc: number,

    InEntry_lc: number,
    InTP_lc: number,
    InSL_lc: number,

    changeRSI1_lc: number,
    changeRSI2_lc: number,
    changeRSI3_lc: number,
    changeRSI4_lc: number,
    lowerboundRSI_lc: number,
    upperboundRSI_lc: number,
    requireRSI_Down_lc: boolean,
    requireRSI_Up_lc: boolean,

    changeCCI1_lc: number,
    changeCCI2_lc: number,
    changeCCI3_lc: number,
    changeCCI4_lc: number,
    lowerboundCCI_lc: number,
    upperboundCCI_lc: number,
    requireCCI_Down_lc: boolean,
    requireCCI_Up_lc: boolean,
}

export interface IInConfig {
    InResistance: {
        [key: string]: IConfigResistance | null
    },
    InResistance_v2: {
        [key: string]: IConfigResistance_v2 | null
    },
    InLongChao: {
        [key: string]: IConfigLongChao | null
    }
}

export default class SetupConfig {
    private InConfig: IInConfig;

    constructor(fileConfig: string, port: number, telegram: Telegram) {
        this.InConfig = JSON.parse(fs.readFileSync(fileConfig).toString());
        console.log(JSON.stringify(this.InConfig));

        http.createServer((req, res) => {
            // var q = url.parse(req.url, true).query;
            // var txt = JSON.stringify(q);
            if (req.url == '/load') {
                return res.end(JSON.stringify(this.InConfig));
            }
            else if (req.url == '/updateConfig') {
                let requestBody = '';

                req.on('data', (chunk) => {
                    requestBody += chunk.toString();
                });

                req.on('end', () => {
                    console.log(requestBody);
                    try {
                        requestBody = requestBody.toString();
                        const config = JSON.parse(requestBody);
                        fs.writeFileSync(fileConfig, JSON.stringify(config));
                        this.InConfig = config;

                        telegram.sendMessage('Update config');

                        res.end('Cập nhật config thành công');
                    }
                    catch (err: any) {
                        console.log(err);
                        res.end('Cập nhật config thất bại ' + err.message);
                    }
                });
            }
            else if (req.url == '/') {
                try {
                    const html = fs.readFileSync('./config.html').toString();
                    return res.end(html);
                }
                catch (err: any) {
                    res.end(err.message);
                }
            }
        }).listen(port);
        console.log(`server listen port ${port}`);
    }

    getConfig() {
        return this.InConfig;
    };
}