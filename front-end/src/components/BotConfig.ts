import { defineComponent, onMounted, ref } from 'vue';
import cytoscape, { type Core } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import * as axios from '../axios/axios';
import Cookies from 'js-cookie';
import MultiSelect from 'primevue/multiselect';
import AutoComplete from 'primevue/autocomplete';


cytoscape.use(edgehandles);

export default defineComponent({
    components: { MultiSelect, AutoComplete },
    setup() {
        const r_botName = ref<string>('');
        const r_idTelegram = ref<string>('');
        const timeframes = ref<Array<string>>(['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d']);
        const r_timeframesSelected = ref<Array<string>>([]);
        const r_symbolList = ref<Array<string>>([]);
        const r_symbolListSelected = ref<Array<string>>([]);
        const brokerList = ['binance', 'okx', 'bybit', 'binance_future', 'bybit_future'];
        const r_botNameList = ref<Array<string>>([]);
        let allBotList: Array<string> = [];

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

        function searchBot(event: any) {
            const inputValue = event.query;
            r_botNameList.value = allBotList.filter(suggestion =>
                suggestion.toLowerCase().includes(inputValue.toLowerCase())
            );
        }

        onMounted(async () => {
            r_botName.value = Cookies.get("botName") || '';

            axios.get('/getSymbolList').then(result => {
                r_symbolList.value = result;
            });

            axios.get('/getBotList').then(result => {
                allBotList = result;
            });

            loadData();

            let treeData: { [key: string]: any } = { elements: { nodes: [], edges: [] } };
            if (treeData.elements.nodes.filter((item: { id: string; }) => item.id != 'start').length == 0) {
                treeData.elements.nodes.push({ data: { id: 'start', name: 'Start' }, position: { x: 100, y: 100 } });
            }

            let cy = cytoscape({
                container: document.getElementById('cy'),
                ...treeData,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#666',
                            'label': 'data(name)'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 3,
                            'line-color': '#ccc',
                            'target-arrow-color': '#ccc',
                            'target-arrow-shape': 'triangle',
                            'curve-style': 'bezier'
                        }
                    },
                    {
                        selector: '.eh-handle',
                        style: {
                            'background-color': 'red',
                            'width': 12,
                            'height': 12,
                            'shape': 'ellipse',
                            'overlay-opacity': 0,
                            'border-width': 12, // makes the handle easier to hit
                            'border-opacity': 0
                        }
                    },

                    {
                        selector: '.eh-hover',
                        style: {
                            'background-color': 'red'
                        }
                    },

                    {
                        selector: '.eh-source',
                        style: {
                            'border-width': 2,
                            'border-color': 'red'
                        }
                    },

                    {
                        selector: '.eh-target',
                        style: {
                            'border-width': 2,
                            'border-color': 'red'
                        }
                    },

                    {
                        selector: '.eh-preview, .eh-ghost-edge',
                        style: {
                            'background-color': 'red',
                            'line-color': 'red',
                            'target-arrow-color': 'red',
                            'source-arrow-color': 'red'
                        }
                    },

                    {
                        selector: '.eh-ghost-edge.eh-preview-active',
                        style: {
                            'opacity': 0
                        }
                    },
                    {
                        selector: '.selected',
                        style: {
                            'background-color': 'blue',
                            'line-color': 'blue',
                            'target-arrow-color': 'blue',
                            'transition-property': 'background-color, line-color, target-arrow-color',
                            'transition-duration': 0.5
                        }
                    }
                ],
                layout: {
                    name: 'preset',
                    // directed: true,
                    padding: 10
                },
                zoomingEnabled: true,
                maxZoom: 3,
                minZoom: 0.3
            });

            let eh = cy.edgehandles({
                noEdgeEventsInDraw: true,
                canConnect: function (sourceNode, targetNode) {
                    return sourceNode.edgesWith(targetNode).empty() ? !sourceNode.same(targetNode) : false;
                }
            });
        });



        return {
            r_botName,
            r_idTelegram,
            timeframes,
            r_timeframesSelected,
            r_symbolList,
            r_symbolListSelected,
            brokerList,
            r_botNameList,
            getBotInfo,
            toogleAllSymbol,
            filterDuplicate,
            searchBot
        };
    }
});