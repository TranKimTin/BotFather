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
routes.get('/getHistoryOrder/:botName', BotConfig.getHistoryOrder);

routes.post("/save", BotConfig.saveBot);
routes.post("/check", BotConfig.checkNode);


routes.delete('/delete', BotConfig.deleteBot);

export default routes;