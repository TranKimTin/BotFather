import BotRSI_CCI from "./bot_rsi_cci";

let bot = new BotRSI_CCI(1433272476, 274430991, 185055787, 'config82.txt', 82, 'BOT_82', true);
bot.init(6 * 60 * 1000);
