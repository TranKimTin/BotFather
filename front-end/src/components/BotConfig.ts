import { defineComponent, onMounted, ref } from 'vue';
import cytoscape, { type Core, type NodeDataDefinition } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import * as axios from '../axios/axios';
import Cookies from 'js-cookie';
import MultiSelect from 'primevue/multiselect';
import AutoComplete from 'primevue/autocomplete';
import * as Toast from '../toast/toast';


cytoscape.use(edgehandles);

export default defineComponent({
    components: { MultiSelect, AutoComplete },
    setup() {
        Toast.showInfo("Xin chào");
        const r_botName = ref<string>('');
        const r_idTelegram = ref<string>('');
        const timeframes = ref<Array<string>>(['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d']);
        const r_timeframesSelected = ref<Array<string>>([]);
        const r_symbolList = ref<Array<string>>([]);
        const r_symbolListSelected = ref<Array<string>>([]);
        const brokerList = ['binance', 'okx', 'bybit', 'binance_future', 'bybit_future'];
        const r_botNameList = ref<Array<string>>([]);
        let allBotList: Array<string> = [];
        let cy: Core;
        let eh: edgehandles.EdgeHandlesInstance;

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

            const treeData = botData.treeData;
            if (treeData.elements.nodes.filter((item: { id: string; }) => item.id != 'start').length == 0) {
                treeData.elements.nodes.push({ data: { id: 'start', name: 'Start' }, position: { x: 400, y: 300 } });
            }
            cy.json(treeData);

        }

        function toogleAllSymbol(broker: string) {
            console.log('toogleAllSymbol', broker);
            const symbolList = r_symbolList.value;
            let selectedList = r_symbolListSelected.value;

            if (symbolList.length == 0) {
                Toast.showError('Đang load, chờ một tí');
                return;
            }

            const numberOfSymbol = symbolList.filter(item => item.startsWith(`${broker}:`)).length;
            const numberOfSymbolSelected = selectedList.filter(item => item.startsWith(`${broker}:`)).length;

            selectedList = selectedList.filter(item => !item.startsWith(`${broker}:`));
            if (numberOfSymbol !== numberOfSymbolSelected) {
                selectedList.push(...symbolList.filter(item => item.startsWith(`${broker}:`)));
                Toast.showSuccess(`Chọn toàn bộ coin ${broker} (${selectedList.length} coin)`);
            }
            else {
                Toast.showSuccess(`Bỏ toàn bộ coin ${broker} (${selectedList.length} coin)`);
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

            Toast.showSuccess(`Đã lọc coin trùng nhau (${newSymbolListSelected.length} coin)`);
        }

        function searchBot(event: any) {
            const inputValue = event.query;
            r_botNameList.value = allBotList.filter(suggestion =>
                suggestion.toLowerCase().includes(inputValue.toLowerCase())
            );
        }

        function findFreePosition(x: number = 400, y: number = 300) {
            const step = 50;
            while (true) {
                let isFree = true;
                cy.nodes().forEach(node => {
                    const pos = node.position();
                    if (Math.abs(pos.x - x) < step && Math.abs(pos.y - y) < step) {
                        isFree = false;
                    }
                });

                if (isFree) {
                    return { x, y };
                }

                x += step;
                // y += step;
            }
        }

        async function addNode() {
            const s = prompt("Nhập điều kiện");
            if (s === null) return;
            const data: NodeDataDefinition = { id: new Date().getTime().toString(), name: s };

            try {
                const res = await axios.post('/check', data);
                console.log({ res })
                const currentZoom = cy.zoom();

                cy.add({
                    group: 'nodes',
                    data,
                    position: findFreePosition()

                });

                cy.layout({
                    name: 'preset',
                    fit: false,
                    padding: 10
                }).run();

                cy.zoom(currentZoom);
            }
            catch (err: any) {
                Toast.showError(err.message);
            }
        }

        function drawModeOn() {
            eh.enableDrawMode();
            eh.stop();
            cy.autoungrabify(true);
        }

        function drawModeOff() {
            eh.disableDrawMode();
            eh.start(cy.$('node:selected'));
            cy.autoungrabify(false)
        }

        async function editNode() {
            const nodeSelected = cy.elements('.selected').filter(item => item.is('node') && item.id() != 'start');
            if (nodeSelected.length == 0) return;
            const node = nodeSelected[0];
            const id = node.data('id');
            const name = node.data('name');

            const s = prompt("Nhập điều kiện", name);
            if (s === null) return;

            const data: NodeDataDefinition = { id, name: s };
            try {
                await axios.post('/check', data);
                const currentZoom = cy.zoom();

                node.data('name', s);

                cy.layout({
                    name: 'preset',
                    fit: false,
                    padding: 10
                }).run();

                cy.zoom(currentZoom);
            }
            catch (err: any) {
                Toast.showError(err.message);
            }
        }

        function removeNode() {
            const highlightedElements = cy.elements('.selected').filter(item => !item.is('node') || item.id() != 'start');
            highlightedElements.remove();
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Delete') {
                removeNode();
            }
        });

        async function saveBot() {
            try {
                let data = {
                    treeData: cy.json(),
                    idTelegram: r_idTelegram.value,
                    timeframes: r_timeframesSelected.value,
                    symbolList: r_symbolListSelected.value,
                    botName: r_botName.value
                };

                console.log(JSON.stringify(data))

                let res = await axios.post('/save', data);
                Toast.showSuccess(`Đã lưu ${data.botName}`);
                Cookies.set("botName", data.botName);
            }

            catch (err: any) {
                console.error({ err })
                Toast.showError(err.message);
            }
        }

        async function removeBot() {
            try {
                const botName = r_botName.value;
                await axios.put('/delete', { botName });
                Toast.showWarning(`Xóa bot ${botName} thành công`);
                Cookies.set("botName", '');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            catch (err: any) {
                Toast.showError(err.message);
            }
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

            const treeData: { [key: string]: any } = { elements: { nodes: [], edges: [] } };
            if (treeData.elements.nodes.filter((item: { id: string; }) => item.id != 'start').length == 0) {
                treeData.elements.nodes.push({ data: { id: 'start', name: 'Start' }, position: { x: 400, y: 300 } });
            }

            cy = cytoscape({
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
                    fit: false,
                    padding: 10
                },
                zoomingEnabled: true,
                maxZoom: 3,
                minZoom: 0.3
            });

            eh = cy.edgehandles({
                noEdgeEventsInDraw: true,
                canConnect: function (sourceNode, targetNode) {
                    return sourceNode.edgesWith(targetNode).empty() ? !sourceNode.same(targetNode) : false;
                }
            });

            cy.on('tap', 'node', function (evt) {
                const node = evt.target;
                node.toggleClass('selected'); // Toggle class 'selected' khi click vào node
                cy.elements('.selected').not(node).removeClass('selected');

            });

            cy.on('tap', 'edge', function (evt) {
                const edge = evt.target;
                edge.toggleClass('selected'); // Toggle class 'selected' khi click vào cạnh
                cy.elements('.selected').not(edge).removeClass('selected');

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
            searchBot,
            addNode,
            drawModeOn,
            drawModeOff,
            editNode,
            removeNode,
            saveBot,
            removeBot
        };
    }
});