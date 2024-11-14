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
        const r_totalProfit = ref<number>(0);

        const filters = {
            broker: { value: null, matchMode: FilterMatchMode.CONTAINS }
        };
        const filterFields = ['broker'];

        onMounted(async () => {
            axios.get(`/getHistoryOrder/${botName}`).then(result => {
                r_orderList.value = result;

                let totalProfit = 0;
                for (let order of r_orderList.value) {
                    if (order.timeTP) {
                        totalProfit += Math.abs(order.volume * (order.tp - order.entry));
                    }
                    else if (order.timeSL) {
                        totalProfit -= Math.abs(order.volume * (order.sl - order.entry));
                    }
                }
                r_totalProfit.value = parseFloat(totalProfit.toFixed(2));
            });
        });

        return {
            botName,
            r_orderList,
            r_totalProfit,
            filters,
            filterFields
        };
    }
});