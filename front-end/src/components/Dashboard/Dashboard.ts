import { defineComponent, ref } from 'vue';
import * as axios from '../../axios/axios';

interface BotInfo {
    botName: string,
    email: string,
    tradeCountClosed: number,
    tradeCountOpening: number,
    profit: number,
    unrealizedProfit: number,
    volumeClosed: number,
    volumeOpening: number,
    winrate: number
    cost: number,
    enableRealOrder: number,
    accountInfo: any
}

export default defineComponent({
    components: {},
    setup() {
        const botList = ref<BotInfo[]>([]);
        let totalProfit = ref<number>(0);
        let totalCost = ref<number>(0);
        let totalBalanceReal = ref<number>(0);
        const feeRate = 0.05 / 100;

        axios.get(`/dashboard/statistic`).then(data => {
            botList.value = data;
            let check: { [key: number]: boolean } = {};

            for (let bot of botList.value) {
                bot.cost = 0;
                bot.profit -= (feeRate * bot.volumeClosed * 2);
                bot.unrealizedProfit -= (feeRate * bot.volumeOpening)
                totalProfit.value += bot.profit;
                totalCost.value += bot.cost;
                bot.profit = parseFloat(bot.profit.toFixed(2));
                bot.unrealizedProfit = parseFloat(bot.unrealizedProfit.toFixed(2));
                bot.volumeOpening = parseFloat(bot.volumeOpening.toFixed(2));
                bot.volumeClosed = parseFloat(bot.volumeClosed.toFixed(2));
                bot.winrate = parseFloat(bot.winrate.toFixed(2));

                if (bot.accountInfo) {
                    let balance: number = parseFloat(bot.accountInfo.totalWalletBalance);
                    if (!check[balance]) {
                        check[balance] = true;
                        totalBalanceReal.value += balance;
                    }
                }
            }

            totalBalanceReal.value = Math.round(totalBalanceReal.value);
            totalProfit.value = parseFloat(totalProfit.value.toFixed(2));
            console.log(botList.value)
        });



        return {
            botList,
            totalProfit,
            totalCost,
            totalBalanceReal
        };
    }
});