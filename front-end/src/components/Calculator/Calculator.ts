import { defineComponent, ref } from 'vue';
import * as axios from '../../axios/axios';
import * as Toast from '../../toast/toast';
import Button from 'primevue/button';
import Select from 'primevue/select';
import ExprInput from '../ExprInput/ExprInput.vue';
import InputText from 'primevue/inputtext';

export default defineComponent({
    components: { Select, Button, InputText, ExprInput },
    setup() {
        const r_broker = ref<string>('binance');
        const r_symbol = ref<string>('BTCUSDT');
        const r_timeframe = ref<string>('1h');
        const r_expr = ref<string>('');
        const r_value = ref<string>('');

        const brokerList = ['binance', 'binance_future', 'bybit', 'bybit_future', 'okx'];
        const timeframeList = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];


        async function calculate() {
            try {
                const symbol = r_symbol.value;
                const broker = r_broker.value;
                const timeframe = r_timeframe.value;
                const expr = r_expr.value;

                r_value.value = expr;

                const result = await axios.get('/calculator', { symbol, broker, timeframe, expr });
                r_value.value = result;
                Toast.showSuccess(result);
            }
            catch (err: any) {
                r_value.value = err.message;
                console.log(err);
                Toast.showError(err.message);
            }
        }

        return {
            r_broker,
            r_symbol,
            r_timeframe,
            r_expr,
            r_value,
            brokerList,
            timeframeList,
            calculate
        };
    }
});