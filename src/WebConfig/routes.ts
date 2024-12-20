import express from 'express';
import { BotInfo, CustomRequest, Node } from '../common/Interface';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { isValidCondition } from '../common/Expr';
import path from 'path';
import fs from "fs";
import * as BotConfig from './controller/BotConfig';


const routes = express.Router({});

routes.get("/getBotInfo", BotConfig.getBotInfo);
routes.get('/getSymbolList', BotConfig.getSymbolList);
routes.get('/getBotList', BotConfig.getBotList);
routes.get('/getHistoryOrder', BotConfig.getHistoryOrder);
routes.get('/calculator', BotConfig.calculator);


routes.post("/save", BotConfig.saveBot);
routes.post("/check", BotConfig.checkNode);
routes.post("/getUnrealizedProfit", BotConfig.getUnrealizedProfit);


routes.delete('/delete', BotConfig.deleteBot);
routes.delete('/clearHistory', BotConfig.clearHistory);

export default routes;