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

        function setLeverage() {
            Toast.showSuccess(`Setting leverage ${r_botName.value} ${r_leverage.value}`);
            r_visible.value = false;
        }
        onMounted(() => {
            axios.get('/getBotList', { real: 1 }).then(result => {
                console.log(result);
                r_botList.value = result;
            });
        });

        return { r_visible, r_botList, r_botName, r_leverage, setLeverage };
    },
});