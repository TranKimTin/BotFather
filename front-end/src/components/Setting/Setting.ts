import { defineComponent, ref, onMounted } from 'vue';
import * as axios from '../../axios/axios';
import * as Toast from '../../toast/toast';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

interface Bot {
    botName: string;
    maxOpenOrderPerSymbolBot: number;
    maxOpenOrderAllSymbolBot: number;
    maxOpenOrderPerSymbolAccount: number;
    maxOpenOrderAllSymbolAccount: number;
}
export default defineComponent({
    components: { Dialog, Select, InputNumber, Button },
    setup() {
        const r_visibleleverage = ref<boolean>(false);
        const r_visibleLimitOrder = ref<boolean>(false);
        const r_botList = ref<Array<Bot>>([]);
        const r_bot = ref<Bot>({ botName: '', maxOpenOrderPerSymbolBot: 5, maxOpenOrderAllSymbolBot: 300, maxOpenOrderPerSymbolAccount: 5, maxOpenOrderAllSymbolAccount: 300 });
        const r_leverage = ref<number>(1);
        const r_marginType = ref<string>('ISOLATED');

        function setLeverage() {
            if (!r_bot.value.botName) {
                Toast.showError('Vui lòng chọn bot trước khi cài đặt đòn bẩy');
                return;
            }
            axios.post('/setLeverage', {
                botName: r_bot.value.botName,
                leverage: r_leverage.value,
                marginType: r_marginType.value,
            }).then(() => {
                Toast.showSuccess(`Cài bẩy bot ${r_bot.value.botName} ${r_marginType.value} x${r_leverage.value}`);
            });
            r_visibleleverage.value = false;
            Toast.showInfo(`Đang cài đặt đòn bẩy cho bot ${r_bot.value.botName} ${r_marginType.value} x${r_leverage.value}...`);
        }

        function setMaximumOrder() {
            if (!r_bot.value.botName) {
                Toast.showError('Vui lòng chọn bot trước khi cài đặt giới hạn lệnh');
                return;
            }
            axios.post('/setMaximumOrder', r_bot.value).then(() => {
                r_visibleLimitOrder.value = false;
                Toast.showSuccess(`Cài đặt giới hạn lệnh thành công cho bot ${r_bot.value.botName}`);
            });
        }

        onMounted(() => {
            axios.get('/getBotList', { real: 1 }).then(result => {
                console.log(result);
                r_botList.value = result;
            });
        });

        return {
            r_visibleleverage,
            r_visibleLimitOrder,
            r_botList, 
            r_bot,
            r_leverage,
            r_marginType,
            setLeverage,
            setMaximumOrder
        };
    },
});