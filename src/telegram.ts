import TelegramBot from 'node-telegram-bot-api';
import moment from 'moment';
import _ from 'lodash';
import dotenv from 'dotenv';
import { TelegramIdType } from './Interface';

dotenv.config({ path: '../.env' });


let chatID: TelegramIdType = '@tintk_RSI_CCI'; //'@tintk_RSI_CCI'
let errorChatID: TelegramIdType = '@tintk_RSI_CCI'; //'@tintk_RSI_CCI'
const tinID: TelegramIdType = 1833284254;

export default class Telegram {
    private listMess: { [key: TelegramIdType]: Array<string> };
    private timeoutMess: { [key: TelegramIdType]: any };
    private listErr: Array<string>;
    private timeoutErr: any;
    private list: Array<Array<Array<number | string>>>;
    private timeout: any;
    private TAG: string;
    private bot: TelegramBot;


    constructor(tag?: string, token?: string, polling?: boolean) {
        const botToken: any = token || process.env.TELEGRAM_TOKEN;

        this.timeoutMess = {};
        this.listMess = {};
        this.listErr = [];
        this.list = [];
        this.TAG = tag ? `${tag}\n` : '';
        this.bot = new TelegramBot(botToken, { polling: !!polling });

        if (polling) {
            this.bot.on('message', (msg) => {
                const chatId = msg.chat.id;
                console.log('TELEGRAM: receive message', msg.chat);
                this.bot.sendMessage(chatId, `ID của bạn là ${chatId}`);
            });
            this.bot.on("polling_error", (msg) => console.log(msg));
        }
    }

    private encodeHTML(str: string) {
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    setChatID(id: string | number) {
        chatID = id;
        errorChatID = id;
    }

    sendMessage(mess: string, id: TelegramIdType = '') {
        try {
            console.log(this.TAG, 'Send message telegram', id, mess);
            id = id || chatID;
            mess = this.encodeHTML(mess);
            this.listMess[id] = this.listMess[id] || [];
            this.listMess[id].push(mess);
            clearTimeout(this.timeoutMess[id]);
            this.timeoutMess[id] = setTimeout(() => {
                const s = this.TAG + this.listMess[id].join('\n\n\n');
                this.bot.sendMessage(id, s, { parse_mode: 'HTML' });
                this.listMess[id] = [];
            }, 1000);
        }
        catch (err: any) {
            const logError = `${this.TAG}${moment().format('DD/MM/YYYY HH:mm:ss')} ____ ${err.message}`;
            console.error('sendTelegram ERROR', logError);
        }
    }
    sendError(mess: string) {
        try {
            console.log(this.TAG, 'Send error telegram', mess);
            mess = `❗️❗️❗️ Có lỗi ❗️❗️❗️\n<b>${mess}</b>`;
            this.listErr.push(mess);
            clearTimeout(this.timeoutErr);
            this.timeoutErr = setTimeout(() => {
                const s = this.TAG + this.listErr.join('\n\n\n');
                this.bot.sendMessage(errorChatID, s, { parse_mode: 'HTML' });
                this.listErr = [];
            }, 1000);
        }
        catch (err: any) {
            const logError = `${this.TAG}${moment().format('DD/MM/YYYY HH:mm:ss')} ____ ${err.message}`;
            console.error('sendTelegram ERROR', logError);
        }
    }
    sendTable(_data: Array<Array<number | string>>) {
        try {
            this.list.push(_data);
            clearTimeout(this.timeout);
            const sendTele = async () => {
                let mess = '';
                for (const data of this.list) {
                    const rows = data.length;
                    const cols = data[0].length;

                    const genarateString = (char: string, length: number) => {
                        let s = '';
                        for (let i = 0; i < length; i++) s += char;
                        return s;
                    }
                    for (let i = 0; i < cols; i++) {
                        let maxLength = 0;
                        for (let j = 0; j < rows; j++) {
                            maxLength = Math.max(maxLength, (data[j][i] + '').length);
                        }
                        for (let j = 0; j < rows; j++) {
                            data[j][i] += genarateString(' ', maxLength - (data[j][i] + '').length);
                        }
                    }

                    const table = data.map(item => `|${item.join('| ')}|`);
                    const tabconstoText = `\n${genarateString('-', table[0].length)}\n${table.map(item => `${item}\n${genarateString('-', item.length)}\n`).join('').trim()}\n`

                    mess += tabconstoText + '\n\n\n';
                    console.log(this.TAG, 'Send table telegram', tabconstoText);
                }
                this.list = [];
                mess = `\`\`\`\n${this.TAG}${mess}\n\`\`\``;
                await this.bot.sendMessage(chatID, mess, { parse_mode: 'Markdown' });
            }
            if (this.list.length >= 3) sendTele();
            else this.timeout = setTimeout(sendTele, 1000)
        }
        catch (err: any) {
            const logError = `${this.TAG}${moment().format('DD/MM/YYYY HH:mm:ss')} ____ ${err.message}`;
            console.error('sendTelegram ERROR', logError);
        }
    }
    async sendPhoto(path: string, caption = '') {
        try {
            console.log(this.TAG, 'Send photo telegram');
            await this.bot.sendPhoto(chatID, path, { caption });
        }
        catch (err: any) {
            const logError = `${this.TAG}${moment().format('DD/MM/YYYY HH:mm:ss')} ____ ${err.message} `;
            console.error('sendPhotoTelegram ERROR', logError);
        }
    }
};