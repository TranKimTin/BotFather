import express from "express";
import cors from "cors";
import morgan from "morgan";
import body_parser from "body-parser";
import fs from "fs";
import moment from "moment";
import EH from "cytoscape-edgehandles";
import CY from "cytoscape";
import path from "path";

const BOT_DATA_DIR = './botData';
if (!fs.existsSync(BOT_DATA_DIR)) {
    fs.mkdirSync(BOT_DATA_DIR);
}

interface BotInfo {
    treeData: {
        elements: {
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
        };
        style?: Array<any>;
        zoom?: number;
        pan?: {
            x: number;
            y: number;
        };
    };
    timeframes: Array<string>;
    botName: string
}

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

function findRSI(inputString: string) {
    const regex = /rsi\([^)]*\)/g;
    return inputString.match(regex) || [];
}


function check(condition: string) {
    try {
        if (!condition) return false;

        condition = condition.toLowerCase().replaceAll(/\s/gi, '').replace(/(?<![\=<>])\=(?![\=<>])/g, '==');

        if (condition == 'start') return true;
        if (!(/[<>=]/.test(condition))) return false;

        let RSIs = findRSI(condition);
        for (let rsi of RSIs) {
            condition = condition.replaceAll(rsi, '1');
        }

        //check eval safe and ok
        const validExpression = /^[\d+\-*/%().\s><=]*$/;
        if (!/([><=]=?){2,}/.test(condition) && validExpression.test(condition)) {
            eval(condition);
        }

        return true;
    }
    catch (err) {
        console.log(condition)

        return false;
    }


}

function validatekBotName(botName: string) {
    const invalidChars = /[\/\\:*?"<>|]/;
    return botName && botName.length < 50 && !invalidChars.test(botName);
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

    fs.writeFileSync(`${BOT_DATA_DIR}/${data.botName}.json`, JSON.stringify(data));

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
    let data: BotInfo = { treeData: { elements: { nodes: [], edges: [] } }, timeframes: [], botName: '' };
    if (fs.existsSync(`${BOT_DATA_DIR}/${botName}.json`)) {
        data = JSON.parse(fs.readFileSync(`${BOT_DATA_DIR}/${botName}.json`).toString());
    }
    res.json({
        code: 200,
        message: "ok",
        data
    });
});

const port = 8080;
app.listen(port, () => {
    console.log(`\nStart server at: ${new Date()}
                HTTP server is listening at: ${"localhost"}:${port}
    `);
});