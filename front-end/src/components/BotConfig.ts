import { defineComponent, onMounted, ref } from 'vue';
import cytoscape, { type Core } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import * as axios from '../axios/axios';
import Cookies from 'js-cookie';
import MultiSelect from 'primevue/multiselect';

cytoscape.use(edgehandles);

export default defineComponent({
    components: { MultiSelect },
    setup() {
        let r_botName = ref<string>('');
        let r_idTelegram = ref<string>('');
        const timeframes = ref<Array<string>>(['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d']);
        let r_timeframesSelected = ref<Array<string>>([]);
        let r_symbolList = ref<Array<string>>([]);
        let r_symbolListSelected = ref<Array<string>>([]);
        const brokerList = ['binance', 'okx', 'bybit', 'binance_future', 'bybit_future'];

        let timeout: number | undefined;
        function getBotInfo() {
            clearTimeout(timeout);
            timeout = setTimeout(loadData, 500);
        }

        async function loadData() {
            const botName: string = r_botName.value;
            console.log({ botName })
            if (!botName) return;
            const botData = await axios.get(`/getBotInfo`, { botName });

            r_botName.value = botData.botName || r_botName.value;
            r_idTelegram.value = botData.idTelegram;
            r_symbolListSelected.value = botData.symbolList;
            r_timeframesSelected.value = botData.timeframes;
        }

        function toogleAllSymbol(broker: string) {
            console.log('toogleAllSymbol', broker);
            const symbolList = r_symbolList.value;
            let selectedList = r_symbolListSelected.value;

            if (symbolList.length == 0) {
                alert('Đang load, chờ một tí');
                return;
            }

            const numberOfSymbol = symbolList.filter(item => item.startsWith(`${broker}:`)).length;
            const numberOfSymbolSelected = selectedList.filter(item => item.startsWith(`${broker}:`)).length;

            selectedList = selectedList.filter(item => !item.startsWith(`${broker}:`));
            if (numberOfSymbol !== numberOfSymbolSelected) {
                selectedList.push(...symbolList.filter(item => item.startsWith(`${broker}:`)));
                alert(`Chọn toàn bộ coin ${broker} (${selectedList.length} coin)`);
            }
            else {
                alert(`Bỏ toàn bộ coin ${broker} (${selectedList.length} coin)`);
            }

            r_symbolListSelected.value = selectedList;

        }

        function filterDuplicate() {
            const symbolListSelected = r_symbolListSelected.value.map(item => item.split(':')).map(item => ({ broker: item[0], symbol: item[1] }));

            const newSymbolListSelected = [];
            const isExisted: { [key: string]: boolean } = {};
            for (const broker of brokerList) {
                for (const item of symbolListSelected) {
                    if (item.broker !== broker) continue;
                    if (isExisted[item.symbol.replace('-', '')]) continue;
                    isExisted[item.symbol.replace('-', '')] = true;
                    newSymbolListSelected.push(`${item.broker}:${item.symbol}`);
                }
            }
            r_symbolListSelected.value = newSymbolListSelected;

            alert(`Đã lọc coin trùng nhau (${newSymbolListSelected.length} coin)`);
        }

        onMounted(async () => {
            let cy: Core | null = null;
            r_botName.value = Cookies.get("botName") || '';
            let treeData = { elements: { nodes: [], edges: [] } };

            r_symbolList.value = await axios.get('/getSymbolList');

            loadData();
        });

        return {
            r_botName,
            r_idTelegram,
            timeframes,
            r_timeframesSelected,
            r_symbolList,
            r_symbolListSelected,
            brokerList,
            getBotInfo,
            toogleAllSymbol,
            filterDuplicate
        };
    }
});