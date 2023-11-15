import http from 'http';
import url from 'url';
import fs from 'fs';
import telegram from './telegram';

const configResistance = {
    InVolumeUSD: 15,
    InChangeRSI: 0.2,
    InRSI_Value: {
        lowerbound: 30,
        upperbound: 58,
        onlyLowerLong: true,
        onlyUpperShort: true
    },
    InEntry1Percent: 90,
    InEntry2Percent: 0,
    InTP1_Percent: 0.6,
    InTP2_Percent: 0,
    InSL_Percent: 0.6,
    InTrendUpConfig: {
        numberOfBar: 3,
        minUpPercent: 0.6,
        requireRSI_Up: true
    },
    InTrendDownConfig: {
        numberOfBar: 3,
        minDownPercent: 0.6,
        requireRSI_Down: true
    },
    InConfigConditionBar: {
        maxChangePercent: 0.1,
        maxAmplPercent: 0.6,
        barColorBuy: 'Xanh',
        barColorSell: 'Đỏ'
    }
};

let configLongChao = {
    InVolumeUSD_lc: 15,

    InEntry_lc: 0,
    InTP_lc: 0,
    InSL_lc: 0,

    changeRSI1_lc: 0,
    changeRSI2_lc: 0,
    changeRSI3_lc: 0,
    changeRSI4_lc: 0,
    lowerboundRSI_lc: 0,
    upperboundRSI_lc: 0,
    requireRSI_Down_lc: true,
    requireRSI_Up_lc: true,

    changeCCI1_lc: 0,
    changeCCI2_lc: 0,
    changeCCI3_lc: 0,
    changeCCI4_lc: 0,
    lowerboundCCI_lc: 0,
    upperboundCCI_lc: 0,
    requireCCI_Down_lc: true,
    requireCCI_Up_lc: true,
};

let InConfig: any = {
    InResistance: {
        'm1': null,
        'm3': null,
        'm5': null,
        'm15': configResistance,
        'm30': configResistance,
        'h1': configResistance,
        'h2': null,
        'h4': null,
        'h6': null,
        'h8': null,
        'h12': null,
        'd1': null
    },
    InLongChao: {
        'm1': null,
        'm3': null,
        'm5': null,
        'm15': configLongChao,
        'm30': configLongChao,
        'h1': configLongChao,
        'h2': null,
        'h4': null,
        'h6': null,
        'h8': null,
        'h12': null,
        'd1': null
    }

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
                requestBody = JSON.parse(requestBody);
                InConfig = requestBody;
                fs.writeFileSync('config.txt', JSON.stringify(InConfig));

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