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

routes.get('/test/getOrders', requireToken, BotConfig.getOrders);


routes.post("/save", requireToken, BotConfig.saveBot);
routes.post("/check", requireToken, BotConfig.checkNode);
routes.post('/setLeverage', requireToken, BotConfig.setLeverage);
routes.post('/setMaximumOrder', requireToken, BotConfig.setMaximumOrder);

routes.post("/login", User.Login);
routes.post("/logout", requireToken, User.Logout);


routes.delete('/delete', requireToken, BotConfig.deleteBot);
routes.delete('/clearHistory', requireToken, BotConfig.clearHistory);

export default routes;