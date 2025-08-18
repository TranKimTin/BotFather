import { BotInfo, CustomRequest, NodeData, UserTokenInfo } from '../../common/Interface';
import * as BotConfig from '../business/BotConfig';

export async function getBotInfo(req: any, res: any) {
    try {
        const botName = req.query.botName;
        const userData: UserTokenInfo = req.user;

        const isOwnBot = await BotConfig.requireOwnBot(botName, userData);
        if (!isOwnBot) {
            res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
            return;
        }
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
        const userData: UserTokenInfo = req.user;
        const data = await BotConfig.getBotList(userData);
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
        const userData: UserTokenInfo = req.user;

        const isOwnBot = await BotConfig.requireOwnBot(botName, userData);
        if (!isOwnBot) {
            res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
            return;
        }

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
        const userData: UserTokenInfo = req.user;

        const isOwnBot = await BotConfig.requireOwnBot(data.botName, userData);
        if (!isOwnBot) {
            res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
            return;
        }

        await BotConfig.saveBot(data, userData);
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

export async function deleteBot(req: any, res: any) {
    try {
        const botName: string = req.query.botName;
        const userData: UserTokenInfo = req.user;

        const isOwnBot = await BotConfig.requireOwnBot(botName, userData);
        if (!isOwnBot) {
            res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
            return;
        }

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
        const userData: UserTokenInfo = req.user;

        const isOwnBot = await BotConfig.requireOwnBot(botName, userData);
        if (!isOwnBot) {
            res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
            return;
        }

        const data = await BotConfig.clearHistory(botName);
        res.json({ code: 200, message: "Xóa lịch sử thành công", data: data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function getOrder(req: any, res: any) {
    try {
        const botName: string = req.query.botName;
        const orderID: string = req.query.orderID;
        const userData: UserTokenInfo = req.user;

        const isOwnBot = await BotConfig.requireOwnBot(botName, userData);
        if (!isOwnBot) {
            res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
            return;
        }

        const data = await BotConfig.getOrder(botName, orderID);
        res.json({ code: 200, message: "Get order success", data: data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}