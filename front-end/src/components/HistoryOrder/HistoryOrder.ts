import { defineComponent, onMounted, ref } from 'vue';
import * as axios from '../../axios/axios';
import { useRoute } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from '@primevue/core/api';

interface Order {
    id: number,
    symbol: string,
    broker: string,
    timeframe: string,
    orderType: string,
    volume: number,
    stop: number,
    entry: number,
    tp: number,
    sl: number,
    status: string,
    createdTime: string,
    expiredTime: string,
    timeStop: string,
    timeEntry: string,
    timeTP: string,
    timeSL: string
};

export default defineComponent({
    components: { DataTable, Column },
    setup() {
        const route = useRoute();
        const botName = route.params.botName;

        const r_orderList = ref<Array<Order>>([]);
        const r_totalGain = ref<number>(0);
        const r_totalLoss = ref<number>(0);
        const r_cntGain = ref<number>(0);
        const r_cntLoss = ref<number>(0);
        const r_maxDD = ref<number>(0);

        onMounted(async () => {
            axios.get(`/getHistoryOrder/${botName}`).then((result: Array<Order>) => {
                let gain = 0;
                let loss = 0;
                let cntGain = 0;
                let cntLoss = 0;
                let maxProfit = 0;
                let maxDD = 0;

                let sortedData = result;
                sortedData.sort((a, b) => {
                    let timeA = 0, timeB = 0;
                    if (a.timeTP) timeA = new Date(a.timeTP).getTime();
                    if (a.timeSL) timeA = new Date(a.timeSL).getTime();
                    if (b.timeTP) timeB = new Date(b.timeTP).getTime();
                    if (b.timeSL) timeB = new Date(b.timeSL).getTime();
                    return timeA - timeB;
                });

                for (let order of sortedData) {
                    if (order.timeTP) {
                        gain += Math.abs(order.volume * (order.tp - order.entry));
                        cntGain++;
                    }
                    else if (order.timeSL) {
                        loss -= Math.abs(order.volume * (order.sl - order.entry));
                        cntLoss++;
                    }
                    maxProfit = Math.max(maxProfit, gain + loss);
                    maxDD = Math.max(maxDD, maxProfit - (gain + loss))
                }

                r_orderList.value = result;
                r_totalGain.value = parseFloat(gain.toFixed(2));
                r_totalLoss.value = parseFloat(loss.toFixed(2));
                r_maxDD.value = parseFloat(maxDD.toFixed(2));
                r_cntGain.value = cntGain;
                r_cntLoss.value = cntLoss;
            });
        });

        return {
            botName,
            r_orderList,
            r_totalGain,
            r_totalLoss,
            r_cntGain,
            r_cntLoss,
            r_maxDD
        };
    }
});