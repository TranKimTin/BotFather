import { BotInfo, CustomRequest, NodeData } from '../../common/Interface';
import * as BotConfig from '../business/BotConfig';

export async function getBotInfo(req: any, res: any) {
    try {
        const botName = req.query.botName;
        const data = await BotConfig.getBotInfo(botName);

        res.json({ code: 200, message: "ok", data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function getSymbolList(req: any, res: any) {
    try {
        const data = await BotConfig.getSymbolList();
        res.json({ code: 200, message: "ok", data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function getBotList(req: any, res: any) {
    try {
        const data = await BotConfig.getBotList();
        res.json({ code: 200, message: "ok", data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function getHistoryOrder(req: any, res: any) {
    try {
        const botName: string = req.query.botName;
        const filterBroker = req.query.filterBroker.split(',');
        const filterTimeframe = req.query.filterTimeframe.split(',');
        const data = await BotConfig.getHistoryOrder(botName, filterBroker, filterTimeframe);
        res.json({ code: 200, message: "ok", data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function calculator(req: any, res: any) {
    try {
        const broker: string = req.query.broker;
        const symbol: string = req.query.symbol;
        const timeframe: string = req.query.timeframe;
        const expr: string = req.query.expr;

        if (!broker) throw 'broker không hợp lệ';
        if (!symbol) throw 'symbol không hợp lệ';
        if (!timeframe) throw 'timeframe không hợp lệ';
        if (!expr) throw 'biểu thức không hợp lệ';


        const data = await BotConfig.calculator(broker, symbol, timeframe, expr);
        res.json({ code: 200, message: "ok", data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function saveBot(req: any, res: any) {
    try {
        const data: BotInfo = req.body;
        await BotConfig.saveBot(data);
        (req as unknown as CustomRequest).onChangeConfig(data.botName);

        res.json({ code: 200, message: "Lưu thành công" });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function checkNode(req: any, res: any) {
    try {
        const data: NodeData = req.body;
        await BotConfig.checkNode(data);

        res.json({ code: 200, message: "ok" });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function getUnrealizedProfit(req: any, res: any) {
    try {
        const data = req.body;
        const response = await BotConfig.getUnrealizedProfit(data);

        res.json({ code: 200, message: "ok", data: response });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function deleteBot(req: any, res: any) {
    try {
        const botName: string = req.query.botName;
        const data = await BotConfig.deleteBot(botName);
        (req as unknown as CustomRequest).onChangeConfig(botName);
        res.json({ code: 200, message: "Xóa thành công", data: data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}


export async function clearHistory(req: any, res: any) {
    try {
        const botName: string = req.query.botName;
        const data = await BotConfig.clearHistory(botName);
        res.json({ code: 200, message: "Xóa lịch sử thành công", data: data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}   