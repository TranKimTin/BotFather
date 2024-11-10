import { defineComponent, onMounted, ref, watch } from 'vue';
import * as axios from '../axios/axios';
import Cookies from 'js-cookie';
import MultiSelect from 'primevue/multiselect';
import AutoComplete from 'primevue/autocomplete';
import * as Toast from '../toast/toast';
import Button from 'primevue/button';
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { useRoute } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

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

        onMounted(async () => {
            axios.get(`/getHistoryOrder/${botName}`).then(result => {
                r_orderList.value = result;
            });


        });

        return {
            botName,
            r_orderList
        };
    }
});