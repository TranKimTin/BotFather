import express from "express";
import cors from "cors";
import morgan from "morgan";
import body_parser from "body-parser";
import fs from "fs";
import path from "path";
import * as util from './util'
import { TelegramIdType } from "./telegram";
import { BinanceSocket } from "./socket_binance";
import { BybitSocket } from "./socket_bybit";

util.useSport();

export const BOT_DATA_DIR = './botData';
if (!fs.existsSync(BOT_DATA_DIR)) {
    fs.mkdirSync(BOT_DATA_DIR);
}

export interface Node {
    logic: string;
    id: string;
    next: Array<Node>;
};

export interface Elements {
    nodes?: Array<{
        data: {
            id: string;
            name: string;
            [key: string]: any;
        };
        position?: {
            x: number;
            y: number;
        };
        removed?: boolean;
    }>;
    edges?: Array<{
        data: {
            id: string;
            source: string;
            target: string;
            [key: string]: any;
        };
        removed?: boolean;
    }>;
}
export interface BotInfo {
    treeData: {
        elements: Elements;
        style?: Array<any>;
        zoom?: number;
        pan?: {
            x: number;
            y: number;
        };
    };
    timeframes: Array<string>;
    symbolList: Array<string>;
    botName: string;
    route: Node;
    idTelegram: TelegramIdType;
}

export const paramsValidate: { [key: string]: Array<number> } = {
    // indicator : [leng>=, leng<=, value >=]
    'open': [0, 1],
    'high': [0, 1],
    'low': [0, 1],
    'close': [0, 1],
    'volume': [0, 1],
    'change': [0, 1],
    'change%': [0, 1],
    'ampl': [0, 1],
    'ampl%': [0, 1],
    'upper_shadow': [0, 1],
    'upper_shadow%': [0, 1],
    'lower_shadow': [0, 1],
    'lower_shadow%': [0, 1],
    'rsi': [1, 2, 1],
    'ma': [1, 2, 1],
    'ema': [1, 2, 1],
    'macd_value': [3, 4, 1, 2, 1],
    'macd_signal': [3, 4, 1, 2, 3],
    'macd_histogram': [3, 4, 1, 2, 1],
    'bb_upper': [2, 3, 1, 0],
    'bb_middle': [2, 3, 1, 0],
    'bb_lower': [2, 3, 1, 0],
    'rsi_phan_ki': [6, 7, 1, 1, 1, 0, 1, 2]
};
export const indicatorSupported: Array<string> = Object.keys(paramsValidate);


export function checkValidExpression(condition: string): boolean {
    //check condition only include number, operator +/*/%, space, e (1.5212e-9)
    const validExpression = /^[\d+\-*/%().\s><=e]*$/;
    return validExpression.test(condition);
}

export function checkEval(condition: string): boolean {
    try {
        // console.log({ condition })
        if (checkValidExpression(condition)) {
            let ret = eval(condition);
            // console.log({ condition, ret })
            return !!ret;
        }
        else {
            console.log('condition invalid: ', condition);
            return false;
        }
    }
    catch (err) {
        console.log(condition, err);
        throw err;
    }
}

export function findIndicator(inputString: string, indicator: string) {
    // const regex = /rsi\([^)]*\)/g;
    const regex = new RegExp(`\\b${indicator}\\([^)]*\\)`, 'g');

    return inputString.match(regex) || [];
}

export function extractParams(s: string): Array<number> {
    // const regex = new RegExp(`\\((\\d+)(?:,(\\d+))?\\)`, '');

    // const regex = /([\d\.]+)/;
    // const match = regex.exec(s) || [];
    // console.log(match)
    // return match.map(item => +item);

    let i = s.indexOf('(');
    let j = s.indexOf(')');
    if (i == -1 || j == -1 || i == j) return [];

    let arr: Array<number> = s.slice(s.indexOf('(') + 1, s.lastIndexOf(')')).split(',').map(item => +item);
    return arr;
}

export function checkParams(indicator: string, params: Array<number>): boolean {
    let paramsCheck = paramsValidate[indicator];
    if (!paramsCheck) return false;
    if (params.length < paramsCheck[0]) return false;
    if (params.length > paramsCheck[1]) return false;
    for (let value of params) {
        if (isNaN(value)) return false;
    }
    for (let i = 2; i < paramsCheck.length; i++) {
        if (params[i - 2] < paramsCheck[i])
            return false;
    }
    return true;
}

export function checkCondition(condition: string) {
    try {
        if (!condition) return false;

        condition = condition.toLowerCase().replaceAll(/\s/gi, '').replace(/(?<![\=<>])\=(?![\=<>])/g, '==');

        if (condition == 'start') return true;
        if (condition.startsWith('telegram:')) return true;
        if (!(/[<>=]|rsi_phan_ki/.test(condition))) return false;

        for (let indicator of indicatorSupported) {
            let fomulas = findIndicator(condition, indicator);
            for (let f of fomulas) {
                let params = extractParams(f);
                if (!checkParams(indicator, params)) {
                    console.log('invalid params', { indicator, condition, params })
                    return false;
                }
                condition = condition.replaceAll(f, '1');
            }
        }

        if (!checkValidExpression(condition)) return false;
        checkEval(condition);

        return true;
    }
    catch (err) {
        return false;
    }
}

export function CreateWebConfig(port: number, onChangeConfig: (botName: string) => void) {
    const app = express();

    app.disable("x-powered-by");
    app.set("trust proxy", true);
    app.use(cors());
    app.use(
        morgan(
            ":date[iso] :remote-addr :remote-user :user-agent :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"
        )
    );
    app.use(body_parser.json({ limit: "50mb" }));
    app.use(body_parser.urlencoded({ extended: false, limit: "50mb" }));
    app.use(express.static(path.join(__dirname, 'public')));

    function validatekBotName(botName: string) {
        const invalidChars = /[\/\\:*?"<>|]/;
        return botName && botName.length < 50 && !invalidChars.test(botName);
    }

    function buildRoute(botInfo: BotInfo): boolean {
        let elements = botInfo.treeData.elements;
        let nodes = elements.nodes?.map(item => item.data) || [];
        let edges = elements.edges?.map(item => item.data) || [];

        let nodeList: { [key: string]: Node } = {};
        for (let node of nodes) {
            let { id, name } = node;
            nodeList[id] = { logic: name, id, next: [] };
        }

        for (let edge of edges) {
            let { source, target } = edge;
            nodeList[source].next.push(nodeList[target]);
        }

        if (!nodeList['start']) return false;

        let visited: { [key: string]: boolean } = {};
        let ret = true;

        let dfs = (node: Node) => {
            if (visited[node.id]) ret = false;
            if (!ret) return;

            visited[node.id] = true;
            for (let child of node.next) {
                dfs(child);
            }
            visited[node.id] = false;
        }
        dfs(nodeList['start']);
        if (!ret) return false;

        nodeList['start'].logic = '1==1';
        botInfo.route = nodeList['start'];

        return true;
    }

    app.post("/save", (req, res) => {
        let data: BotInfo = req.body;

        let botName = data.botName;
        if (!validatekBotName(botName)) {
            return res.json({ code: 400, message: 'Tên bot không hợp lệ ' + botName });
        }

        let edges = data.treeData.elements.edges?.filter(item => !item.removed).map(item => item.data) || []; //{source, target, id}
        let nodes = data.treeData.elements.nodes?.filter(item => !item.removed).map(item => item.data) || []; //{id, name}

        console.log({ edges, nodes });

        for (let node of nodes) {
            if (!checkCondition(node.name)) {
                console.log('invalid condition ', node.name);
                return res.json({ code: 400, message: 'Điều kiện không hợp lệ ' + node.name });
            }
        }

        if (!buildRoute(data)) {
            return res.json({ code: 400, message: 'Điều kiện vòng tròn' });
        }

        let botPath = path.join(BOT_DATA_DIR, `${data.botName}.json`);
        fs.writeFileSync(botPath, JSON.stringify(data));
        onChangeConfig(data.botName);

        res.json({ code: 200, message: "Lưu thành công" });
    });

    app.post("/check", (req, res) => {
        let data = req.body;
        console.log('check', data);

        if (!data.id || !checkCondition(data.name)) {
            return res.json({ code: 400, message: `Điều kiện không hợp lệ ${data.name}` });
        }

        res.json({ code: 200, message: "ok" });
    });

    app.get("/getBotInfo", (req, res) => {
        let botName: any = req.query.botName;
        if (!validatekBotName(botName)) {
            return res.json({ code: 400, message: 'Tên bot không hợp lệ ' + botName });
        }
        let data: BotInfo = { treeData: { elements: { nodes: [], edges: [] } }, timeframes: [], symbolList: [], botName: '', idTelegram: '', route: { logic: "1==1", id: 'start', next: [] } };
        if (fs.existsSync(`${BOT_DATA_DIR}/${botName}.json`)) {
            data = JSON.parse(fs.readFileSync(`${BOT_DATA_DIR}/${botName}.json`).toString());
        }
        res.json({
            code: 200,
            message: "ok",
            data
        });
    });

    app.get('/getSymbolList', async (req, res) => {
        let binanceSymbolList = await util.getBinanceSymbolList();
        binanceSymbolList = binanceSymbolList.map(item => `${BinanceSocket.broker}:${item}`);

        let bybitSymbolList = await util.getBybitSymbolList();
        bybitSymbolList = bybitSymbolList.map(item => `${BybitSocket.broker}:${item}`);

        let symbolList = [...binanceSymbolList, ...bybitSymbolList];
        res.json({ code: 200, message: "ok", data: symbolList });
    });

    app.get('/getBotList', (req, res) => {
        let botList = fs.readdirSync(BOT_DATA_DIR);
        let data = botList.map(item => item.replace('.json', '')) || [];
        res.json({ code: 200, message: "ok", data });
    });

    app.put('/delete', (req, res) => {
        let { botName } = req.query as { botName: string };
        let botFile = path.join(BOT_DATA_DIR, `${botName}.json`);
        if (fs.existsSync(botFile)) {
            fs.unlinkSync(botFile);
            onChangeConfig(botName);
        }
        res.json({ code: 200, message: "Xóa thành công", data: [] });
    });

    app.listen(port, () => {
        console.log(`\nStart server at: ${new Date()}
                    HTTP server is listening at: ${"localhost"}:${port}
        `);
    });
}