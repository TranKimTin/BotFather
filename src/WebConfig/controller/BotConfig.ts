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
        const real = req.query.real === "1" ? true : false;
        const data = await BotConfig.getBotList(userData, real);
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
        // const userData: UserTokenInfo = req.user;

        // const isOwnBot = await BotConfig.requireOwnBot(botName, userData);
        // if (!isOwnBot) {
        //     res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
        //     return;
        // }

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

export async function getOrders(req: any, res: any) {
    try {
        const botName: string = req.query.botName;

        const userData: UserTokenInfo = req.user;

        if (!botName) {
            throw 'botName không hợp lệ';
        }

        const isOwnBot = await BotConfig.requireOwnBot(botName, userData);
        if (!isOwnBot) {
            res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
            return;
        }

        const data = await BotConfig.getOrders(req.query);
        res.json({ code: 200, message: "Get order success", data: data });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}

export async function setLeverage(req: any, res: any) {
    try {
        const botName: string = req.body.botName;
        const leverage: number = req.body.leverage;
        const marginType: string = req.body.marginType;
        const userData: UserTokenInfo = req.user;
        const isOwnBot = await BotConfig.requireOwnBot(botName, userData);
        if (!isOwnBot) {
            res.json({ code: 403, message: 'Không có quyền truy cập bot', data: [] });
            return;
        }
        if (leverage < 1 || leverage > 150) {
            throw 'Đòn bẩy từ 1 đến 150';
        }
        if (marginType !== 'ISOLATED' && marginType !== 'CROSSED') {
            throw 'Margin type không hợp lệ';
        }
        await BotConfig.setLeverage(botName, leverage, marginType);
        res.json({ code: 200, message: "Set leverage success" });
    }
    catch (err: any) {
        console.error(err);
        res.json({ code: 400, message: err, data: [] });
    }
}