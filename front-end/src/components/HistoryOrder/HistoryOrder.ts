import { defineComponent, onMounted, ref, watch } from 'vue';
import * as axios from '../../axios/axios';
import { useRoute } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';

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
    profit: number,
    status: string,
    createdTime: string,
    expiredTime: string,
    timeStop: string,
    timeEntry: string,
    timeTP: string,
    timeSL: string,
    lastTimeUpdated: string
};

export default defineComponent({
    components: { DataTable, Column, MultiSelect },
    setup() {
        const route = useRoute();
        const botName = route.params.botName;

        const r_orderList = ref<Array<Order>>([]);
        const r_gain = ref<number>(0);
        const r_loss = ref<number>(0);
        const r_unrealizedGain = ref<number>(0);
        const r_unrealizedLoss = ref<number>(0);
        const r_cntGain = ref<number>(0);
        const r_cntLoss = ref<number>(0);
        const r_maxDD = ref<number>(0);
        const r_isLoading = ref<boolean>(true);
        const timeframes: Array<string> = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        const r_timeframesSelected = ref<Array<string>>([...timeframes]);
        const brokers: Array<string> = ['binance', 'bybit', 'okx', 'binance_future', 'bybit_future'];
        const r_brokerSelected = ref<Array<string>>([...brokers]);

        watch(r_timeframesSelected, (newValue) => {
            newValue.sort((a, b) => timeframes.indexOf(a) - timeframes.indexOf(b));
            loadData(true);
        });
        watch(r_brokerSelected, (newValue) => {
            newValue.sort((a, b) => brokers.indexOf(a) - brokers.indexOf(b));
            loadData(true);
        });

        let timeout = 0;
        function loadData(delay: boolean) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                r_isLoading.value = true;
                const params = {
                    filterBroker: r_brokerSelected.value.join(','),
                    filterTimeframe: r_timeframesSelected.value.join(',')
                };
                axios.get(`/getHistoryOrder/${botName}`, params).then((result: Array<Order>) => {
                    let gain = 0;
                    let loss = 0;
                    let unrealizedGain = 0;
                    let unrealizedLoss = 0;
                    let cntGain = 0;
                    let cntLoss = 0;
                    let maxProfit = 0;
                    let maxDD = 0;


                    let sortedData = [...result];
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
                            gain += order.profit;
                            cntGain++;
                        }
                        else if (order.timeSL) {
                            loss += order.profit;
                            cntLoss++;
                        }
                        else if (order.profit) {
                            if (order.profit > 0) unrealizedGain += order.profit;
                            else unrealizedLoss += order.profit;
                        }
                        maxProfit = Math.max(maxProfit, gain + loss);
                        maxDD = Math.max(maxDD, maxProfit - (gain + loss))
                    }

                    r_orderList.value = result;
                    r_gain.value = parseFloat(gain.toFixed(2));
                    r_loss.value = parseFloat(loss.toFixed(2));
                    r_unrealizedGain.value = parseFloat(unrealizedGain.toFixed(2));
                    r_unrealizedLoss.value = parseFloat(unrealizedLoss.toFixed(2));
                    r_maxDD.value = parseFloat(maxDD.toFixed(2));
                    r_cntGain.value = cntGain;
                    r_cntLoss.value = cntLoss;
                    r_isLoading.value = false;
                });
            }, delay ? 1000 : 0);
        }

        onMounted(() => {
            loadData(false);
        });

        return {
            botName,
            r_orderList,
            r_gain,
            r_loss,
            r_unrealizedGain,
            r_unrealizedLoss,
            r_cntGain,
            r_cntLoss,
            r_maxDD,
            r_isLoading,
            r_timeframesSelected,
            r_brokerSelected,
            timeframes,
            brokers
        };
    }
});