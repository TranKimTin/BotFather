import { Indicator } from "technicalindicators/declarations/indicator/indicator";

export interface Node {
    data: NodeData;
    id: string;
    next: Array<Node>;
};

export interface NodeData {
    id: string,
    type: NODE_TYPE,
    value?: string,
    volume?: string,
    stop?: any,
    entry?: any,
    tp?: any,
    sl?: any,
    expiredTime?: string,
    unitVolume?: string,
    unitStop?: string,
    unitEntry?: string,
    unitTP?: string,
    unitSL?: string,
    unitExpiredTime?: string
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

export interface RateData {
    symbol: string,
    startTime: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    interval: string,
    isFinal: boolean,
    cached?: boolean
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
    data: Array<RateData>,
    cacheIndicator: CacheIndicator
}

export interface CustomRequest extends Request {
    onChangeConfig: (botName: string) => void;
}

export enum ORDER_STATUS {
    OPENED = 'Mở lệnh',
    MATCH_STOP = 'Khớp stop',
    MATCH_ENTRY = 'Khớp entry',
    MATCH_TP = 'Khớp TP',
    MATCH_SL = 'Khớp SL',
    CANCELED = 'Đã hủy'
}

export enum UNIT {
    PRICE = 'price',
    PERCENT = 'percent',
    RR = 'rr',
    USD = 'usd',
    TOKEN = 'token',
    CANDLE = 'candle',
    MINUTE = 'minute'
}

export enum NODE_TYPE {
    START = 'start',
    EXPR = 'expr',
    TELEGRAM = 'telegram',
    BUY_MARKET = 'openBuyMarket',
    BUY_LIMIT = 'openBuyLimit',
    BUY_STOP_MARKET = 'openBuyStopMarket',
    BUY_STOP_LIMIT = 'openBuyStopLimit',
    SELL_MARKET = 'openSellMarket',
    SELL_LIMIT = 'openSellLimit',
    SELL_STOP_MARKET = 'openSellStopMarket',
    SELL_STOP_LIMIT = 'openSellStopLimit',
    CLOSE_ALL_ORDER = 'closeAllOrder',
    CLOSE_ALL_POSITION = 'closeAllPosition'
}

export interface FundingRate {
    calcTime: number,
    symbol: string,
    fundingIntervalHours: number,
    lastFundingRate: number,
    markPrice: number
}

export enum ROLE {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}

export interface UserTokenInfo {
    id: number,
    email: string,
    role: ROLE
}

export const MAX_CANDLE = 600
export const MAX_CACHE_SIZE = 300

export interface CacheIndicatorItem {
    indicator: any,
    values: Array<any>,
    lastUpdateTime: number
}
export interface CacheIndicator {
    [key: string]: CacheIndicatorItem
}

export interface WorkerData {
    broker: string,
    symbol: string,
    timeframe: string,
    lastTimeUpdated: number,
    startTime: Float64Array,
    open: Float64Array,
    high: Float64Array,
    low: Float64Array,
    close: Float64Array,
    volume: Float64Array
}

export interface MACD_Output {
    MACD: number;
    signal: number;
    histogram: number;
}

export type RateKey = 'open' | 'high' | 'low' | 'close' | 'volume';

export interface HandleLogicArgs {
    broker: string,
    symbol: string,
    timeframe: string,
    data: RateData[],
    idTelegram: TelegramIdType,
    visited: { [key: string]: boolean },
    botID: number,
    cacheIndicator: CacheIndicator,
    initCache: boolean
}

export interface DequeItem {
    value: number;
    index: number;
};

export interface NewOrderArgs {
    symbol: string,
    type: NODE_TYPE,
    volume: string,
    stop: string,
    limit: string,
    tp: string,
    sl: string
}