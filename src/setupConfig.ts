import http from 'http';
import url from 'url';
import fs from 'fs';
import telegram from './telegram';

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
    InLongChao: {
        [key: string]: IConfigLongChao | null
    }
}

let InConfig: IInConfig = {
    InResistance: {},
    InLongChao: {}
}

// fs.writeFileSync('config.txt', JSON.stringify(InConfig))
InConfig = JSON.parse(fs.readFileSync('config.txt').toString());
console.log(JSON.stringify(InConfig));

http.createServer(function (req, res) {
    // var q = url.parse(req.url, true).query;
    // var txt = JSON.stringify(q);
    if (req.url == '/load') {
        return res.end(JSON.stringify(InConfig));
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
                let config = JSON.parse(requestBody);
                fs.writeFileSync('config.txt', JSON.stringify(config));
                InConfig = config;

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
            let html = fs.readFileSync('./config.html').toString();
            return res.end(html);
        }
        catch (err: any) {
            res.end(err.message);
        }
    }
}).listen(80);
console.log('server listen port 80');

export default function getConfig() {
    return InConfig;
};