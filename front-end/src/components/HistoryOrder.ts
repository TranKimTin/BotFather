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
    createdTime: number,
    expiredTime: number
};

export default defineComponent({
    components: {},
    setup() {
        const route = useRoute();


        onMounted(async () => {

        });

        return {
            botName: route.params.botName
        };
    }
});