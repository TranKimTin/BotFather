import { defineComponent, ref, onMounted } from 'vue';
import * as axios from '../../axios/axios';
import * as Toast from '../../toast/toast';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

export default defineComponent({
    components: { Select, InputNumber, Button },
    setup() {
        const r_botList = ref<Array<String>>([]);
        const r_botName = ref<string>('');
        const timeframes = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        const r_timeframe = ref<string>('15m');
        const r_startMonth = ref<number>(6);
        const r_startYear = ref<number>(2025);
        const r_endMonth = ref<number>(12);
        const r_endYear = ref<number>(2025);
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

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

            const onMessage = (mess: string) => {
                if (mess.startsWith('newOrder')) {
                    // order is array [OrderType, entry, volume, tp, sl, createdTime, expiredTime, matchTime, profit, status]
                    const order = mess.split('_').slice(1);
                    console.log('New order:', order);
                }
            };

            const onFinish = () => {
                console.log('Backtest finished');
                Toast.showSuccess(`Backtest cho bot ${r_botName.value} xong.`);
            };

            es = axios.getEventSource('/runBacktest', args, onMessage, onFinish);
        }

        return {
            r_botList,
            r_botName,
            timeframes,
            r_timeframe,
            runBacktest,
            r_startMonth,
            r_startYear,
            r_endMonth,
            r_endYear,
            months,
            years
        };
    }
});