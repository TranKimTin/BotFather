import { defineComponent, ref, onMounted } from 'vue';
import * as axios from '../../axios/axios';
import * as Toast from '../../toast/toast';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

export default defineComponent({
    components: { Dialog, Select, InputNumber, Button },
    setup() {
        const r_visible = ref<boolean>(false);
        const r_botList = ref<Array<string>>([]);
        const r_botName = ref<string>('');
        const r_leverage = ref<number>(1);
        const r_marginType = ref<string>('ISOLATED');

        function setLeverage() {
            axios.post('/setLeverage', {
                botName: r_botName.value,
                leverage: r_leverage.value,
                marginType: r_marginType.value,
            }).then(() => {
                Toast.showSuccess(`Cài bẩy bot ${r_botName.value} ${r_marginType.value} x${r_leverage.value}`);
            });
            r_visible.value = false;
            Toast.showInfo(`Đang cài đặt đòn bẩy cho bot ${r_botName.value} ${r_marginType.value} x${r_leverage.value}...`);
        }

        onMounted(() => {
            axios.get('/getBotList', { real: 1 }).then(result => {
                console.log(result);
                r_botList.value = result;
            });
        });

        return { r_visible, r_botList, r_botName, r_leverage, r_marginType, setLeverage };
    },
});