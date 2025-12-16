import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import * as axios from '../../axios/axios';
import * as Toast from '../../toast/toast';

export default defineComponent({
    components: {},
    setup() {
        const r_data = ref<string>('loading...');
        
        onMounted(() => {
            const route = useRoute();
            const botName = route.query.botName as string || undefined;
            const symbol = route.query.symbol as string || undefined;
            const orderId = route.query.orderId as string || undefined;
            const startTime = route.query.startTime as string || undefined;
            const endTime = route.query.endTime as string || undefined;
            const limit = route.query.limit as string || undefined;

            const args = JSON.parse(JSON.stringify({ botName, symbol, orderId, startTime, endTime, limit }));

            axios.get('/test/getOrders', args).then(data => {
                r_data.value = JSON.stringify(data, null, 4);
                Toast.showSuccess('Get order successfully');
            }).catch(err => {
                r_data.value = 'Error: ' + err.message;
                Toast.showError('Get order failed: ' + err.message);
            });
        });

        return { r_data };
    },
});