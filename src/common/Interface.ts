import { Socket } from "socket.io-client";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export interface Node {
    data: NodeData;
    id: string;
    next: Array<Node>;
};

export interface NodeData {
    id: string,
    type: string,
    value?: string,
    volume?: string,
    stop?: string,
    entry?: string,
    tp?: string,
    sl?: string,
    unitVolume?: string,
    unitStop?: string,
    unitEntry?: string,
    unitTP?: string,
    unitSL?: string
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

export type TelegramIdType = string | number;

export interface SocketInfo {
    name: string;
    port: number;
    client: Socket<DefaultEventsMap, DefaultEventsMap>,
}

export interface SymbolListener {
    symbol: string,
    broker: string
    timeframe: string,
}

export interface RateData {
    symbol: string,
    startTime: number,
    timestring: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    interval: string,
    isFinal: boolean,
    change: number,
    ampl: number
}

export interface IParamsConstructor {
    apiKey: string | undefined,
    secretKey: string | undefined,
    symbolList: Array<string>,
    timeframes: Array<string>,
    onCloseCandle: (symbol: string, timeframe: string, data: Array<RateData>) => void,
    onClosePosition: (symbol: string) => void,
    onInitStart: () => void,
    onInitDone: () => void,
    onHandleError: (err: unknown, symbol: string | undefined) => void,
    isReadOnly?: boolean
}

export interface Digit {
    volume: number | undefined,
    price: number | undefined
}

export interface Position {
    symbol: string,
    side: string,
    volume: number,
    entryPrice: number,
    profit: number
}

export interface Order {
    id: string,
    symbol: string,
    side: 'buy' | 'sell',
    type: 'LIMIT' | 'MARKET' | 'STOP_LIMIT' | 'STOP_MARKET',
    price: number,
    volume: number,
    stopPrice: number,
    status: string,
    reduceOnly: boolean,
    closePosition: boolean,
    timestamp: string,
    timeInt: number
}

export interface ExprArgs {
    broker: string;
    symbol: string;
    timeframe: string;
    data: Array<RateData>
}

export interface CustomRequest extends Request {
    onChangeConfig: (botName: string) => void;
}