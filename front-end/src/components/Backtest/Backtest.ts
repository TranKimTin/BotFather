import { defineComponent, ref, onMounted } from 'vue';
import * as axios from '../../axios/axios';
import * as Toast from '../../toast/toast';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import BalanceChart from "../HistoryOrder/BalanceChart.vue";
import moment from 'moment';
import { ORDER_STATUS } from '../HistoryOrder/HistoryOrder';

interface Order {
    orderType: string,
    symbol: string,
    entry: number,
    volume: number,
    tp: number,
    sl: number,
    createdTime: number,
    expiredTime: number,
    matchTime: number,
    profit: number,
    status: string
}

export interface PropData {
    timestamp: string,
    balance: number,
    balanceNoFee: number,
    balanceReal: number
}

export default defineComponent({
    components: { Select, InputNumber, Button, DataTable, Column, InputText, BalanceChart },
    setup() {
        const r_botList = ref<Array<String>>([]);
        const r_botName = ref<string>('');
        const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        const r_timeframe = ref<string>('1h');
        const r_startMonth = ref<number>(1);
        const r_startYear = ref<number>(2025);
        const r_endMonth = ref<number>(12);
        const r_endYear = ref<number>(2025);
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
        const r_profit = ref<number>(0);
        const r_orderList = ref<Array<Order>>([]);
        const r_loading = ref<boolean>(false);
        const r_globalFilter = ref<string>('');
        const r_balanceData = ref<Array<PropData>>([]);
        const r_win = ref<number>(0);
        const r_lose = ref<number>(0);
        const r_progress = ref<number>(0);
        const r_drawdown = ref<number>(0);

        onMounted(() => {
            axios.get('/getBotList').then(result => {
                console.log(result);
                r_botList.value = result.map((item: any) => item.botName);
            });
        });

        let es: EventSource | null = null;

        function runBacktest() {
            if (!r_botName.value) {
                Toast.showError('Chưa chọn bot');
                return;
            }
            if (r_startYear.value > r_endYear.value || (r_startYear.value === r_endYear.value && r_startMonth.value > r_endMonth.value)) {
                Toast.showError('Khoảng thời gian không hợp lệ');
                return;
            }
            const args = {
                botName: r_botName.value,
                timeframe: r_timeframe.value,
                startMonth: r_startMonth.value,
                startYear: r_startYear.value,
                endMonth: r_endMonth.value,
                endYear: r_endYear.value
            };

            Toast.showInfo(`Đang chạy backtest cho bot ${r_botName.value}...`);
            if (es) {
                es.close();
            }

            r_profit.value = 0;
            r_orderList.value = [];
            r_balanceData.value = [];
            r_loading.value = true;
            r_win.value = 0;
            r_lose.value = 0;
            r_progress.value = 0;
            r_drawdown.value = 0;

            const onMessage = (mess: string) => {
                if (mess.startsWith('NewOrder')) {
                    // order is array [symbol, OrderType, entry, volume, tp, sl, createdTime, expiredTime, matchTime, profit, status]
                    const order = mess.split('_').slice(1);
                    const [symbol, orderType, entry, volume, tp, sl, createdTime, expiredTime, matchTime, profit, status] = order;
                    r_profit.value += parseFloat(profit);

                    const newOrder: Order = {
                        symbol,
                        orderType,
                        entry: parseFloat(entry),
                        volume: parseFloat(volume),
                        tp: parseFloat(tp),
                        sl: parseFloat(sl),
                        createdTime: parseInt(createdTime),
                        expiredTime: parseInt(expiredTime),
                        matchTime: parseInt(matchTime),
                        profit: parseFloat(profit),
                        status
                    };
                    r_orderList.value.push(newOrder);
                    if (newOrder.status == ORDER_STATUS.MATCH_TP || newOrder.status == ORDER_STATUS.MATCH_SL) {
                        if (newOrder.profit > 0) {
                            r_win.value++;
                        }
                        else {
                            r_lose.value++;
                        }
                    }
                    // console.log(newOrder);
                }
                else if (mess.startsWith('Progress')) {
                    r_progress.value = +mess.split('_')[1];
                    console.log(mess);
                }
                else {
                    console.log(mess);
                }
            };

            const onFinish = () => {
                console.log('Backtest finished');
                Toast.showSuccess(`Backtest cho bot ${r_botName.value} xong.`);
                r_orderList.value.sort((a, b) => b.createdTime - a.createdTime);
                r_loading.value = false;

                const sortedData = r_orderList.value.filter(item => item.status === ORDER_STATUS.MATCH_TP || item.status === ORDER_STATUS.MATCH_SL);
                sortedData.sort((a, b) => a.matchTime - b.matchTime);
                let balance = 0;
                let fee = 0;
                let maxBalance = 0;

                for (const order of sortedData) {
                    balance += order.profit;
                    fee += order.volume * order.entry * 0.1 / 100;
                    maxBalance = Math.max(maxBalance, balance - fee);
                    r_drawdown.value = Math.max(r_drawdown.value, maxBalance - (balance - fee));
                    r_balanceData.value.push({
                        timestamp: moment(order.matchTime).format('YYYY-MM-DD HH:mm'),
                        balance: balance - fee,
                        balanceNoFee: balance,
                        balanceReal: 0
                    });
                }
                const remainData = r_orderList.value.filter(item => item.status === ORDER_STATUS.MATCH_ENTRY);
                if (remainData.length > 0) {
                    for (const order of remainData) {
                        balance += order.profit;
                        fee += order.volume * order.entry * 0.1 / 100;
                    }
                    maxBalance = Math.max(maxBalance, balance - fee);
                    r_drawdown.value = Math.max(r_drawdown.value, maxBalance - (balance - fee));
                    r_balanceData.value.push({
                        timestamp: moment({ year: r_endYear.value, month: r_endMonth.value - 1 }).add(1, 'month').format('YYYY-MM-DD HH:mm'),
                        balance: balance - fee,
                        balanceNoFee: balance,
                        balanceReal: 0
                    });
                }
                r_profit.value = balance - fee;
            };

            es = axios.getEventSource('/runBacktest', args, onMessage, onFinish);
        }

        return {
            r_botList,
            r_botName,
            timeframes,
            r_timeframe,
            r_startMonth,
            r_startYear,
            r_endMonth,
            r_endYear,
            r_profit,
            r_orderList,
            r_loading,
            r_globalFilter,
            r_balanceData,
            r_win,
            r_lose,
            r_drawdown,
            months,
            years,
            runBacktest,
            r_progress,
            moment
        };
    }
});