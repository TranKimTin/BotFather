import BinanceFuture, { RateData } from './BinanceFuture';
import telegram from './telegram'
import dotenv from 'dotenv';
import * as util from './util';
import getConfig from './setupConfig';
import moment from 'moment';
import googleSheet from './GoogleSheet';


dotenv.config({ path: '../.env' });

var binance: BinanceFuture;
async function main() {
    let symbolList = await util.getSymbolList();
    symbolList = symbolList.filter(item => item.endsWith("USDT"))
        .filter(item => item != 'BTCDOMUSDT'
            && item != 'USDCUSDT'
            && item != 'BTCUSDT');
    console.log(symbolList.join(' '));
    console.log(`Total ${symbolList.length} symbols`);

    binance = new BinanceFuture({
        apiKey: process.env.API_KEY,
        secretKey: process.env.SECRET_KEY,
        symbolList: symbolList,
        timeframes: [/*'1m', '3m', '5m',*/ '15m', '30m', '1h'/*, '2h', '4h', '6h', '8h', '12h', '1d'*/],
        onCloseCandle: onCloseCandle,
        onClosePosition: async (symbol: string) => { },
        onHandleError: async (err: any, symbol: string | undefined) => { await telegram.sendError((symbol ? symbol : '') + err.message); },
        isReadOnly: true
    });

    await binance.init();
}

async function onCloseCandle(symbol: string, timeframe: string, data: Array<RateData>) {
    await resistanceAlgo(symbol, timeframe, data);
    await longChaoAlgo(symbol, timeframe, data);
}

async function resistanceAlgo(symbol: string, timeframe: string, data: Array<RateData>) {
    try {
        let InConfig = getConfig().InResistance;
        // console.log(InConfig)
        if (data.length < 14) return;

        let key = timeframe[timeframe.length - 1] + timeframe.slice(0, timeframe.length - 1);
        if (!InConfig[key]) return;

        let { InVolumeUSD, InChangeRSI, InRSI_Value, InEntry1Percent, InEntry2Percent, InSL_Percent,
            InTP1_Percent, InTP2_Percent, InTrendUpConfig, InTrendDownConfig, InConfigConditionBar } = InConfig[key];

        InEntry1Percent /= 100;
        InEntry2Percent /= 100;
        InSL_Percent /= 100;
        InTP1_Percent /= 100;
        InTP2_Percent /= 100;

        let rate = data[0];
        let rsi = util.iRSI(data, 14);
        let curRSI = rsi[0];
        let preRSI = rsi[1];
        let preRSI2 = rsi[2];
        let changeRSI = Math.abs(curRSI - preRSI);


        if (changeRSI > InChangeRSI) return;
        if (InRSI_Value && curRSI > InRSI_Value.lowerbound && curRSI < InRSI_Value.upperbound) return;

        let side = 'none';

        if (InTrendUpConfig) {
            let { numberOfBar, minUpPercent, requireRSI_Up } = InTrendUpConfig;

            minUpPercent /= 100;

            let open = data[numberOfBar].open;
            let close = data[1].close;
            let change = (close - open) / open;

            if (change >= Math.abs(minUpPercent)) {
                side = 'sell';
                if (requireRSI_Up) {
                    side = (preRSI > preRSI2) ? 'sell' : 'none';
                }
            }
        }
        if (InTrendDownConfig) {
            let { numberOfBar, minDownPercent, requireRSI_Down } = InTrendDownConfig;

            minDownPercent /= 100;

            let open = data[numberOfBar].open;
            let close = data[1].close;
            let change = (close - open) / open;

            if (change <= -Math.abs(minDownPercent)) {
                side = 'buy';
                if (requireRSI_Down) {
                    side = (preRSI < preRSI2) ? 'buy' : 'none';
                }
            }
        }


        if (InConfigConditionBar) {
            let { maxAmplPercent, maxChangePercent, barColorBuy, barColorSell } = InConfigConditionBar;

            maxAmplPercent /= 100;
            maxChangePercent /= 100;

            if (rate.ampl > maxAmplPercent) return;
            if (rate.change > maxChangePercent) return;
            if (side == 'buy' && barColorBuy == 'Xanh' && rate.close <= rate.open) return;
            if (side == 'buy' && barColorBuy == 'Đỏ' && rate.close >= rate.open) return;
            if (side == 'sell' && barColorSell == 'Xanh' && rate.close <= rate.open) return;
            if (side == 'sell' && barColorSell == 'Đỏ' && rate.close >= rate.open) return;
        }

        if (InRSI_Value && InRSI_Value.onlyLowerLong && curRSI <= InRSI_Value.lowerbound && side == 'sell') return;
        if (InRSI_Value && InRSI_Value.onlyUpperShort && curRSI >= InRSI_Value.upperbound && side == 'buy') return;


        let curPrice = rate.close;
        let topShadowLength = (rate.high - Math.max(rate.open, rate.close));
        let botShadowLength = (Math.min(rate.open, rate.close) - rate.low);

        let entry1 = 0;
        let entry2: number | '' = 0;
        //entry 1 % so voi rau, entry2 % so voi entry1
        if (side == 'buy') entry1 = Math.min(rate.open, rate.close) - InEntry1Percent * botShadowLength;
        if (side == 'sell') entry1 = Math.max(rate.open, rate.close) + InEntry1Percent * topShadowLength;
        if (side == 'buy') entry2 = entry1 * (1 - InEntry2Percent);
        if (side == 'sell') entry2 = entry1 * (1 + InEntry2Percent);

        let TP1 = entry1 * (1 + (side == 'buy' ? InTP1_Percent : -InTP1_Percent));
        let TP2: number | '' = (entry1 + entry2) / 2 * (1 + (side == 'buy' ? InTP1_Percent : -InTP1_Percent));
        let SL = entry1 * (1 + (side == 'buy' ? -InSL_Percent : InSL_Percent));
        let volume = InVolumeUSD / curPrice;

        curRSI = +curRSI.toFixed(2);
        entry1 = +entry1.toFixed(binance.digits[symbol].price);
        entry2 = +entry2.toFixed(binance.digits[symbol].price);
        TP1 = +TP1.toFixed(binance.digits[symbol].price);
        TP2 = +TP2.toFixed(binance.digits[symbol].price);
        SL = +SL.toFixed(binance.digits[symbol].price);
        volume = +volume.toFixed(binance.digits[symbol].volume);

        if (entry1 == entry2) {
            entry2 = '';
            TP2 = '';
        }

        if (side == 'none') return;
        console.log(rate);
        console.log(InConfig);
        // console.log({ symbol, timeframe, rsi: curRSI, side, entry1, entry2, TP1, TP2, SL, volume });
        let dataTable = [
            ['Thời gian', moment().format('YYYY-MM-DD HH:mm')],
            ['Coin', symbol],
            ['Khung thời gian', timeframe],
            ['RSI', curRSI],
            ['RSI thay đổi', (curRSI - preRSI).toFixed(2)],
            ['Loại', (side == 'buy' ? 'LONG' : 'SHORT')],
            ['Giá vào 1', entry1],
            ['Giá vào 2', entry2],
            ['Take Profit 1', TP1],
            ['Take Profit 2', TP2],
            ['Stop Loss', SL]
        ];
        await telegram.sendTable(dataTable);
        // await googleSheet.addRow(symbol, (side == 'buy' ? 'LONG' : 'SHORT'), timeframe, entry1, entry2, TP1, TP2, SL, curRSI);

        if (!entry2) {
            let orders = await binance.getOpenOrders(symbol);
            if (orders.length > 0) {
                console.log(symbol, 'đang mở lệnh', orders);
                return;
            };
            let options = {
                TP: TP1,
                SL: SL,
                expiredTime: data[0].startTime + (data[0].startTime - data[1].startTime) * 2
            };
            await binance.orderLimit(symbol, side, volume, entry1, options);
        }

    }
    catch (err: any) {
        console.log(err);
        await telegram.sendError(err.message);
    }
}

async function longChaoAlgo(symbol: string, timeframe: string, data: Array<RateData>) {
    try {
        let InConfig = getConfig().InLongChao;
        if (data.length < 20) return;

        let key = timeframe[timeframe.length - 1] + timeframe.slice(0, timeframe.length - 1);
        if (!InConfig[key]) return;

        let { InVolumeUSD_lc, InEntry_lc, InTP_lc, InSL_lc, changeRSI1_lc, changeRSI2_lc,
            changeRSI3_lc, changeRSI4_lc, lowerboundRSI_lc, upperboundRSI_lc, requireRSI_Down_lc,
            requireRSI_Up_lc, changeCCI1_lc, changeCCI2_lc, changeCCI3_lc, changeCCI4_lc,
            lowerboundCCI_lc, upperboundCCI_lc, requireCCI_Down_lc, requireCCI_Up_lc } = InConfig[key];

        InEntry_lc /= 100;
        InTP_lc /= 100;
        InSL_lc /= 100;

        let RSI = util.iRSI(data, 14);
        let CCI = util.iCCI(data, 20);

        let side = 'none';
        if (RSI[0] >= upperboundRSI_lc) {
            let change1 = RSI[2] - RSI[1];
            let change2 = RSI[1] - RSI[0];

            let condition1 = (change1 < 0) && (change1 > -Math.abs(changeRSI1_lc));
            let condition2 = (change2 > 0) && (change2 < Math.abs(changeRSI2_lc));
            let condition3 = requireRSI_Up_lc ? (RSI[2] > RSI[3]) : true;

            if (condition1 && condition2 && condition3) side = 'sell';
        }
        if (CCI[0] >= upperboundCCI_lc) {
            let change1 = CCI[2] - CCI[1];
            let change2 = CCI[1] - CCI[0];

            let condition1 = (change1 < 0) && (change1 > -Math.abs(changeCCI1_lc));
            let condition2 = (change2 > 0) && (change2 < Math.abs(changeCCI2_lc));
            let condition3 = requireCCI_Up_lc ? (CCI[2] > CCI[3]) : true;

            if (condition1 && condition2 && condition3) side = 'sell';
        }
        if (RSI <= lowerboundRSI_lc) {
            let change1 = RSI[2] - RSI[1];
            let change2 = RSI[1] - RSI[0];

            let condition1 = (change1 > 0) && (change1 < Math.abs(changeRSI3_lc));
            let condition2 = (change2 < 0) && (change2 > -Math.abs(changeRSI4_lc));
            let condition3 = requireRSI_Down_lc ? (RSI[2] < RSI[3]) : true;

            if (condition1 && condition2 && condition3) side = 'buy';
        }
        if (CCI <= lowerboundCCI_lc) {
            let change1 = CCI[2] - CCI[1];
            let change2 = CCI[1] - CCI[0];

            let condition1 = (change1 > 0) && (change1 < Math.abs(changeCCI3_lc));
            let condition2 = (change2 < 0) && (change2 > -Math.abs(changeCCI4_lc));
            let condition3 = requireCCI_Down_lc ? (CCI[2] < CCI[3]) : true;

            if (condition1 && condition2 && condition3) side = 'buy';
        }

        if (side == 'none') return;

        let rate = data[0];
        let curPrice = rate.close;
        let topShadowLength = (rate.high - Math.max(rate.open, rate.close));
        let botShadowLength = (Math.min(rate.open, rate.close) - rate.low);

        let entry = 0;
        //entry % so voi rau nen
        if (side == 'buy') entry = Math.min(rate.open, rate.close) - InEntry_lc * botShadowLength;
        if (side == 'sell') entry = Math.max(rate.open, rate.close) + InEntry_lc * topShadowLength;

        let TP = entry * (1 + (side == 'buy' ? InTP_lc : -InTP_lc));
        let SL = entry * (1 + (side == 'buy' ? -InSL_lc : InSL_lc));
        let volume = InVolumeUSD_lc / curPrice;

        entry = +entry.toFixed(binance.digits[symbol].price);
        TP = +TP.toFixed(binance.digits[symbol].price);
        SL = +SL.toFixed(binance.digits[symbol].price);
        volume = +volume.toFixed(binance.digits[symbol].volume);

        console.log(rate);
        console.log(InConfig);

        let dataTable = [
            ['Thời gian', moment().format('YYYY-MM-DD HH:mm')],
            ['Coin', symbol],
            ['Khung thời gian', timeframe],
            ['RSI', RSI[0].toFixed(2)],
            ['CCI', CCI[0].toFixed(2)],
            ['Loại', (side == 'buy' ? 'LONG' : 'SHORT')],
            ['Giá vào', entry],
            ['Take Profit', TP],
            ['Stop Loss', SL]
        ];
        await telegram.sendTable(dataTable);
        // await googleSheet.addRowLC(symbol, (side == 'buy' ? 'LONG' : 'SHORT'), timeframe, entry, TP, SL);
    }
    catch (err: any) {
        console.log(err);
        await telegram.sendError(err.message);
    }
}

main();