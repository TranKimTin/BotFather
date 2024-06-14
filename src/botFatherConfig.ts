import express from "express";
import cors from "cors";
import morgan from "morgan";
import body_parser from "body-parser";
import fs from "fs";
import path from "path";
import * as util from './util'

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
}

export function checkValidExpression(condition: string) {
    const validExpression = /^[\d+\-*/%().\s><=]*$/;
    return validExpression.test(condition);
}

export function checkEval(condition: string): boolean {
    try {
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
    const regex = new RegExp(indicator + '\\([^)]*\\)', 'g');

    return inputString.match(regex) || [];
}

export function extractParamsRSI(s: string): [number, number] {
    const regex = /rsi\((\d+)(?:,(\d+))?\)/;
    const match = s.match(regex);

    let period = match ? parseInt(match[1], 10) : 0;
    let shift = match && match[2] ? parseInt(match[2], 10) : 0;

    return [period, shift];
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

    function check(condition: string) {
        try {
            if (!condition) return false;

            condition = condition.toLowerCase().replaceAll(/\s/gi, '').replace(/(?<![\=<>])\=(?![\=<>])/g, '==');

            if (condition == 'start') return true;
            if (condition.startsWith('telegram:')) return true;
            if (!(/[<>=]/.test(condition))) return false;

            let RSIs = findIndicator(condition, 'rsi');
            for (let rsi of RSIs) {
                let [period, shift] = extractParamsRSI(rsi);
                console.log([period, shift]);
                if (period == 0) return false;

                condition = condition.replaceAll(rsi, '1');
            }

            if (!checkValidExpression(condition)) return false;
            checkEval(condition);
            return true;
        }
        catch (err) {
            return false;
        }


    }

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
            if (!check(node.name)) {
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

        if (!data.id || !check(data.name)) {
            return res.json({ code: 400, message: `Điều kiện không hợp lệ ${data.name}` });
        }

        res.json({ code: 200, message: "ok" });
    });

    app.get("/getBotInfo", (req, res) => {
        let botName: any = req.query.botName;
        if (!validatekBotName(botName)) {
            return res.json({ code: 400, message: 'Tên bot không hợp lệ ' + botName });
        }
        let data: BotInfo = { treeData: { elements: { nodes: [], edges: [] } }, timeframes: [], symbolList: [], botName: '', route: { logic: "1==1", id: 'start', next: [] } };
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
        let symbolList = await util.getSymbolList();
        res.json({ code: 200, message: "ok", data: symbolList });
    })

    app.listen(port, () => {
        console.log(`\nStart server at: ${new Date()}
                    HTTP server is listening at: ${"localhost"}:${port}
        `);
    });
}