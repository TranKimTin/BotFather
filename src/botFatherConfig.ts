import express from "express";
import cors from "cors";
import morgan from "morgan";
import body_parser from "body-parser";
import fs from "fs";
import path from "path";
import * as util from './util'
import { TelegramIdType } from "./telegram";
import { isValidCondition } from "./Expr";

export const BOT_DATA_DIR = './botData';
if (!fs.existsSync(BOT_DATA_DIR)) {
    fs.mkdirSync(BOT_DATA_DIR);
}

export interface Node {
    logic: string;
    id: string;
    next: Array<Node>;
};

export interface NodeData {
    id: string;
    value: string;
    type: string;
}

export interface Elements {
    nodes?: Array<{
        data: NodeData;
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
        const elements = botInfo.treeData.elements;
        const nodes = elements.nodes?.map(item => item.data) || [];
        const edges = elements.edges?.map(item => item.data) || [];

        const nodeList: { [key: string]: Node } = {};
        for (let node of nodes) {
            const { id, value } = node;
            nodeList[id] = { logic: value, id, next: [] };
        }

        for (let edge of edges) {
            const { source, target } = edge;
            nodeList[source].next.push(nodeList[target]);
        }

        if (!nodeList['start']) return false;

        const visited: { [key: string]: boolean } = {};
        let ret = true;

        const dfs = (node: Node) => {
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
        const data: BotInfo = req.body;

        const botName = data.botName;
        if (!validatekBotName(botName)) {
            return res.json({ code: 400, message: 'Tên bot không hợp lệ ' + botName });
        }

        const edges = data.treeData.elements.edges?.filter(item => !item.removed).map(item => item.data) || []; //{source, target, id}
        const nodes = data.treeData.elements.nodes?.filter(item => !item.removed).map(item => item.data) || []; //{id, name}

        console.log({ edges, nodes });

        for (let node of nodes) {
            if (!isValidCondition(node)) {
                console.log('invalid condition ', node.value);
                return res.json({ code: 400, message: 'Điều kiện không hợp lệ ' + node.value });
            }
        }

        if (!buildRoute(data)) {
            return res.json({ code: 400, message: 'Điều kiện vòng tròn' });
        }

        const botPath = path.join(BOT_DATA_DIR, `${data.botName}.json`);
        fs.writeFileSync(botPath, JSON.stringify(data));
        onChangeConfig(data.botName);

        res.json({ code: 200, message: "Lưu thành công" });
    });

    app.post("/check", (req, res) => {
        const data = req.body;
        console.log('check', data);

        if (!data.id || !isValidCondition(data)) {
            return res.json({ code: 400, message: `Điều kiện không hợp lệ ${data.value}` });
        }

        res.json({ code: 200, message: "ok" });
    });

    app.get("/getBotInfo", (req, res) => {
        const botName: any = req.query.botName;
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
        let [binanceSymbolList, bybitSymbolList, okxSymbolList, binanceFutureSymbolList, bybitFutureSymbolList] = await Promise.all([
            util.getBinanceSymbolList(),
            util.getBybitSymbolList(),
            util.getOkxSymbolList(),
            util.getBinanceFutureSymbolList(),
            util.getBybitFutureSymbolList()
        ]);

        binanceSymbolList = binanceSymbolList.map(item => `${'binance'}:${item}`);
        bybitSymbolList = bybitSymbolList.map(item => `${'bybit'}:${item}`);
        okxSymbolList = okxSymbolList.map(item => `${'okx'}:${item}`);
        binanceFutureSymbolList = binanceFutureSymbolList.map(item => `${'binance_future'}:${item}`);
        bybitFutureSymbolList = bybitFutureSymbolList.map(item => `${'bybit_future'}:${item}`);


        const symbolList = [...binanceSymbolList, ...bybitSymbolList, ...okxSymbolList, ...binanceFutureSymbolList, ...bybitFutureSymbolList];
        res.json({ code: 200, message: "ok", data: symbolList });
    });

    app.get('/getBotList', (req, res) => {
        const botList = fs.readdirSync(BOT_DATA_DIR);
        const data = botList.map(item => item.replace('.json', '')) || [];
        res.json({ code: 200, message: "ok", data });
    });

    app.put('/delete', (req, res) => {
        const { botName } = req.query as { botName: string };
        const botFile = path.join(BOT_DATA_DIR, `${botName}.json`);
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