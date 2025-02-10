import express from 'express';
import * as BotConfig from './controller/BotConfig';
import * as User from './controller/User';
import * as Dashboard from './controller/Dashboard';
import { RateData } from '../common/Interface';

const { requireToken } = User;


const routes = express.Router({});

routes.get("/getBotInfo", requireToken, BotConfig.getBotInfo);
routes.get('/getSymbolList', requireToken, BotConfig.getSymbolList);
routes.get('/getBotList', requireToken, BotConfig.getBotList);
routes.get('/getHistoryOrder', requireToken, BotConfig.getHistoryOrder);
routes.get('/calculator', requireToken, BotConfig.calculator);
routes.get('/dashboard/statistic', requireToken, Dashboard.statistic);
routes.get('/getBalance', requireToken, User.getBalance);

// routes.get('/api/getOHLCV', async (req: any, res) => {
//     try {
//         const { symbol, timeframe } = req.query;
//         const since = parseInt(req.query.since);
//         const limit = parseInt(req.query.limit || 299);

//         let data: Array<RateData> = this.getData(symbol, timeframe);

//         while (data.length > 0 && data[data.length - 1].startTime < since) data.pop();

//         if (data.length === 0 || data[data.length - 1].startTime > since) {
//             data = await this.getOHLCV(symbol, timeframe, limit + 1, since);
//         }
//         while (data.length > 0 && data[data.length - 1].startTime < since) data.pop();
//         if (data.length > limit) data = data.slice(data.length - limit);

//         res.json(data);
//     }
//     catch (err) {
//         console.error(err, req.query);
//         res.json([]);
//     }
// });


routes.post("/save", requireToken, BotConfig.saveBot);
routes.post("/check", requireToken, BotConfig.checkNode);
routes.post("/getUnrealizedProfit", requireToken, BotConfig.getUnrealizedProfit);
routes.post("/login", User.Login);
routes.post("/logout", requireToken, User.Logout);


routes.delete('/delete', requireToken, BotConfig.deleteBot);
routes.delete('/clearHistory', requireToken, BotConfig.clearHistory);

export default routes;