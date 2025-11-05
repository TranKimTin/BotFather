import { defineComponent, ref } from 'vue';
import * as axios from '../../axios/axios';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';
import * as Toast from '../../toast/toast';

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
    accountInfo: any,
    openOrders: any[]
}

export default defineComponent({
    components: { DataTable, Column, InputText, ProgressSpinner },
    setup() {
        const botList = ref<BotInfo[]>([]);
        let totalProfit = ref<number>(0);
        let totalCost = ref<number>(0);
        let totalBalanceReal = ref<number>(0);
        const feeRate = 0.05 / 100;
        const r_globalFilter = ref<string>('');
        const r_isLoading = ref<boolean>(true);

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

                if (bot.accountInfo && bot.accountInfo.positions && bot.openOrders) {
                    for (let item of bot.accountInfo.positions) {
                        let order = bot.openOrders.find((o: any) => o.symbol === item.symbol);
                        if (!order) {
                            console.log('not found order for position: ', item);
                            Toast.showError(`${bot.botName} ${item.symbol} không có TP SL!`);
                        }
                    }
                }
            }

            totalBalanceReal.value = Math.round(totalBalanceReal.value);
            totalProfit.value = parseFloat(totalProfit.value.toFixed(2));
            r_isLoading.value = false;
            console.log(botList.value);
        });



        return {
            botList,
            totalProfit,
            totalCost,
            totalBalanceReal,
            r_globalFilter,
            r_isLoading
        };
    }
});