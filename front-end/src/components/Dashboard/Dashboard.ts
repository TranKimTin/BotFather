import { defineComponent, ref } from 'vue';
import * as axios from '../../axios/axios';
import * as Toast from '../../toast/toast';

interface BotInfo {
    name: string
    tradeCount: number
    profit: number
    cost: number
}

export default defineComponent({
    components: {},
    setup() {
        const botList = ref<BotInfo[]>([]);
        for (let i = 0; i < 10; i++) {
            let bot: BotInfo = {
                name: 'bot ' + i,
                tradeCount: Math.round(Math.random() * 100) + 1,
                profit: Math.round(Math.random() * 10000) - 5000,
                cost: Math.round(Math.random() * 20) * 100
            };
            botList.value.push(bot);
        }

        let totalProfit = 0;
        let totalCost = 0;
        for (let bot of botList.value) {
            totalProfit += bot.profit;
            totalCost += bot.cost;
        }

        return {
            botList,
            totalProfit,
            totalCost
        };
    }
});