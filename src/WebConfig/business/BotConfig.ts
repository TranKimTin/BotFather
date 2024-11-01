import { BotInfo, CustomRequest, Node, NodeData } from '../../Interface';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { isValidCondition } from '../../Expr';
import path from 'path';
import * as util from '../../util'
import fs from "fs";

const BOT_DATA_DIR = '../botData';
if (!fs.existsSync(BOT_DATA_DIR)) {
    fs.mkdirSync(BOT_DATA_DIR);
}

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
        const { id } = node;
        nodeList[id] = { data: node, id, next: [] };
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

    botInfo.route = nodeList['start'];

    return true;
}


export function getBotInfo(botName: string) {
    console.log('getBotInfo')
    if (!validatekBotName(botName)) {
        throw `Tên bot không hợp lệ ${botName}`;
    }
    let data: BotInfo = {
        treeData: { elements: { nodes: [], edges: [] } },
        timeframes: [],
        symbolList: [],
        botName: '',
        idTelegram: '',
        route: {
            data: {
                id: "start",
                type: "start",
                value: "Start",
            }, id: 'start', next: []
        }
    };
    if (fs.existsSync(`${BOT_DATA_DIR}/${botName}.json`)) {
        data = JSON.parse(fs.readFileSync(`${BOT_DATA_DIR}/${botName}.json`).toString());
    }
    return data;
}

let cacheSymbolList: { lastTime: number, data: Array<string> } = {
    lastTime: 0,
    data: []
};
export async function getSymbolList() {
    const now = new Date().getTime();
    if (now - cacheSymbolList.lastTime < 5 * 60 * 1000) {
        return cacheSymbolList.data;
    }

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

    cacheSymbolList.data = symbolList;
    cacheSymbolList.lastTime = now;

    return symbolList;
}

export async function getBotList() {
    const botList = fs.readdirSync(BOT_DATA_DIR);
    const data = botList.map(item => item.replace('.json', '')) || [];
    return data;
}

export async function saveBot(data: BotInfo) {
    const botName = data.botName;
    if (!validatekBotName(botName)) {
        throw `Tên bot không hợp lệ ${botName}`;
    }

    const edges = data.treeData.elements.edges?.filter(item => !item.removed).map(item => item.data) || []; //{source, target, id}
    const nodes = data.treeData.elements.nodes?.filter(item => !item.removed).map(item => item.data) || []; //{id, name}

    console.log({ edges, nodes });

    for (let node of nodes) {
        if (!isValidCondition(node)) {
            console.log('invalid condition ', node.value);
            throw `Điều kiện không hợp lệ ${node.value}`;
        }
    }

    if (!buildRoute(data)) {
        throw 'Điều kiện vòng tròn';
    }

    const botPath = path.join(BOT_DATA_DIR, `${data.botName}.json`);
    fs.writeFileSync(botPath, JSON.stringify(data));
}

export async function checkNode(data: NodeData) {
    console.log('check', data);

    if (!data.id || !isValidCondition(data)) {
        throw `Điều kiện không hợp lệ ${data.value}`;
    }
}

export async function deleteBot(botName: string) {
    const botFile = path.join(BOT_DATA_DIR, `${botName}.json`);
    if (fs.existsSync(botFile)) {
        fs.unlinkSync(botFile);
    }
}