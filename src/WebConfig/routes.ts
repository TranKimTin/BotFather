import express from 'express';
import * as BotConfig from './controller/BotConfig';
import * as User from './controller/User';


const routes = express.Router({});

routes.get("/getBotInfo", BotConfig.getBotInfo);
routes.get('/getSymbolList', BotConfig.getSymbolList);
routes.get('/getBotList', BotConfig.getBotList);
routes.get('/getHistoryOrder', BotConfig.getHistoryOrder);
routes.get('/calculator', BotConfig.calculator);


routes.post("/save", BotConfig.saveBot);
routes.post("/check", BotConfig.checkNode);
routes.post("/getUnrealizedProfit", BotConfig.getUnrealizedProfit);
routes.post("/login", User.Login);


routes.delete('/delete', BotConfig.deleteBot);
routes.delete('/clearHistory', BotConfig.clearHistory);

export default routes;