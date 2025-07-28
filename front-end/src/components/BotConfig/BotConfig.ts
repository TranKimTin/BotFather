import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import cytoscape, { type NodeSingular, type Core } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import * as axios from '../../axios/axios';
import Cookies from 'js-cookie';
import MultiSelect from 'primevue/multiselect';
import AutoComplete from 'primevue/autocomplete';
import * as Toast from '../../toast/toast';
import Button from 'primevue/button';
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import ExprInput from '../ExprInput/ExprInput.vue';
import ContextMenu from 'primevue/contextmenu';
import { useEventListener } from '@/Composables/useEvent';
import Checkbox from 'primevue/checkbox';

cytoscape.use(edgehandles);

interface NodeData {
    id: string,
    type: string,
    value?: string,
    volume?: string,
    stop?: string,
    entry?: string,
    tp?: string,
    sl?: string,
    expiredTime?: string,
    unitVolume?: string,
    unitStop?: string,
    unitEntry?: string,
    unitTP?: string,
    unitSL?: string,
    unitExpiredTime?: string
}

interface NodeCopy {
    data: NodeData;
    position: { x: number, y: number };
    next: Array<NodeCopy>
}

export default defineComponent({
    components: { MultiSelect, AutoComplete, Button, Dialog, InputText, Select, ExprInput, ContextMenu, Checkbox },
    setup() {
        const r_botName = ref<string>('');
        const r_idTelegram = ref<string>('');
        const timeframes: Array<string> = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        const r_timeframesSelected = ref<Array<string>>([]);
        const r_symbolList = ref<Array<string>>([]);
        const r_symbolListSelected = ref<Array<string>>([]);
        const r_botNameList = ref<Array<string>>([]);
        const r_visible = ref<boolean>(false);
        const r_currentNode = ref<NodeData>({ id: '', type: '' });
        const r_type = ref<string>('');
        const r_apiDialogVisible = ref<boolean>(false);
        const r_apiKey = ref<string>("");
        const r_secretKey = ref<string>("");
        const r_enableRealOrder = ref<boolean>(false);

        const menu = ref();
        const items = ref([
            {
                label: 'Thêm nút mới',
                icon: 'pi pi-plus',
                shortcut: 'Ctrl + B',
                command: newNode
            },
            {
                label: 'Xóa nút',
                icon: 'pi pi-eraser',
                shortcut: 'Delete',
                command: () => {
                    console.log('paste')
                }
            },
            {
                label: 'sửa nút',
                icon: 'pi pi-pen-to-square',
                shortcut: 'Ctr + U',
                command: updateNode
            },
            {
                label: 'Vẽ cạnh',
                icon: 'pi pi-pencil',
                shortcut: 'Ctrl + E',
                command: drawModeOn
            },
            {
                label: 'Sắp xếp nút',
                icon: 'pi pi-wrench',
                shortcut: 'Ctrl + R',
                command: drawModeOff
            },
            {
                label: 'Copy nút',
                icon: 'pi pi-copy',
                shortcut: 'Ctrl + C',
                command: copyNode
            },
            {
                label: 'Paste nút',
                icon: 'pi pi-clipboard',
                shortcut: 'Ctrl + V',
                command: pasteNode
            },
            {
                label: 'Lưu cấu hình bot',
                icon: 'pi pi-save',
                shortcut: 'Ctrl + S',
                command: saveBot
            },
            {
                label: 'Xem lịch sử lệnh',
                icon: 'pi pi-history',
                shortcut: 'Ctrl + H',
                route: () => `/history/${r_botName.value}`,
                target: '_blank'
            },
            {
                label: 'API key',
                icon: 'pi pi-key',
                shortcut: 'Ctrl + K',
                command: settingApiKey,
            },
            {
                label: 'Xóa bot',
                icon: 'pi pi-trash',
                shortcut: 'Ctrl + Delete',
                command: removeBot
            },
        ]);

        const brokerList = ['binance', 'okx', 'bybit', 'binance_future', 'bybit_future'];
        const nodeTypes = [
            { name: 'Biểu thức', value: 'expr' },
            { name: 'Báo tín hiệu telegram', value: 'telegram' },
            { name: 'Mở lệnh BUY Market', value: 'openBuyMarket' },
            { name: 'Mở lệnh BUY Limit', value: 'openBuyLimit' },
            { name: 'Mở lệnh BUY Stop Market', value: 'openBuyStopMarket' },
            { name: 'Mở lệnh BUY Stop Limit', value: 'openBuyStopLimit' },
            { name: 'Mở lệnh SELL Market', value: 'openSellMarket' },
            { name: 'Mở lệnh SELL Limit', value: 'openSellLimit' },
            { name: 'Mở lệnh SELL Stop Market', value: 'openSellStopMarket' },
            { name: 'Mở lệnh SELL Stop Limit', value: 'openSellStopLimit' },
            { name: 'Đóng toàn bộ lệnh chưa khớp entry', value: 'closeAllOrder' },
            { name: 'Đóng toàn bộ vị thế', value: 'closeAllPosition' }
        ];
        const unitsEntry = [{ name: 'Theo giá', value: 'price' }, { name: '%', value: 'percent' }];
        const unitTP = [...unitsEntry, { name: 'Risk-Reward', value: 'rr' }];
        const unitsVulume = [{ name: 'USD', value: 'usd' }, { name: 'token', value: 'token' }];
        const unitExpiredTime = [{ name: 'Nến', value: 'candle' }, { name: 'Phút', value: 'minute' }];

        let allBotList: Array<string> = [];
        let cy: Core;
        let eh: edgehandles.EdgeHandlesInstance;

        const defaultTree = {
            style: [
                {
                    selector: 'node[type="expr"]',
                    style: {
                        'background-color': '#FF9999',
                        'label': 'data(value)'
                    }
                },
                {
                    selector: 'node[type="telegram"]',
                    style: {
                        'background-color': '#33CCFF',
                        'label': 'data(value)'
                    }
                },
                {
                    selector: 'node[type="start"]',
                    style: {
                        'background-color': '#FF6600',
                        'label': 'data(value)'
                    }
                },
                {
                    selector: 'node[type="openBuyMarket"], node[type="openBuyLimit"], node[type="openBuyStopMarket"], node[type="openBuyStopLimit"]',
                    style: {
                        'background-color': '#33CC33',
                        'label': 'data(display)',
                    },
                },
                {
                    selector: 'node[type="openSellMarket"], node[type="openSellLimit"], node[type="openSellStopMarket"], node[type="openSellStopLimit"]',
                    style: {
                        'background-color': '#ff0000',
                        'label': 'data(display)',
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#FFCCCC',
                        'target-arrow-color': '#FFCCCC',
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
        };

        const confirmation = useConfirm();
        watch(r_timeframesSelected, (newValue) => {
            newValue.sort((a, b) => timeframes.indexOf(a) - timeframes.indexOf(b));
        });
        watch(r_botName, (newValue) => {
            Cookies.set("botName", newValue);
        });


        let timeout: any;
        function getBotInfo() {
            clearTimeout(timeout);
            timeout = setTimeout(loadData, 500);
        }

        function updateDisplay(node: NodeSingular) {
            const data: NodeData = node.data();

            const { type, volume, stop, entry, tp, sl, unitVolume, unitStop, unitEntry, unitTP, unitSL } = data;

            const getUnit = (unit?: string) => {
                if (unit === 'price') return 'USD';
                if (unit === 'percent') return '%';
                if (unit === 'usd') return 'USD';
                if (unit === 'token') return 'Token';
                if (unit === 'rr') return 'R';
                return '';
            }

            if (type === 'openBuyMarket' || type === 'openSellMarket') {
                let label = `Open ${type === 'openBuyMarket' ? 'BUY' : 'SELL'} Market. `;
                label += `Volume=${volume} (${getUnit(unitVolume)}), `;
                label += `TP=${tp} (${getUnit(unitTP)}), `;
                label += `SL=${sl} (${getUnit(unitSL)})`;
                node.data('display', label);
            }
            else if (type === 'openBuyLimit' || type === 'openSellLimit') {
                let label = `Open ${type === 'openBuyLimit' ? 'BUY' : 'SELL'} Limit. `;
                label += `Volume=${volume} (${getUnit(unitVolume)}), `;
                label += `Entry=${entry} (${getUnit(unitEntry)}), `;
                label += `TP=${tp} (${getUnit(unitTP)}), `;
                label += `SL=${sl} (${getUnit(unitSL)})`;
                node.data('display', label);
            }
            else if (type === 'openBuyStopMarket' || type === 'openSellStopMarket') {
                let label = `Open ${type === 'openBuyStopMarket' ? 'BUY' : 'SELL'} Stop Market. `;
                label += `Volume=${volume} (${getUnit(unitVolume)}), `;
                label += `Stop=${stop} (${getUnit(unitStop)}), `;
                label += `TP=${tp} (${getUnit(unitTP)}), `;
                label += `SL=${sl} (${getUnit(unitSL)})`;
                node.data('display', label);
            }
            else if (type === 'openBuyStopLimit' || type === 'openSellStopLimit') {
                let label = `Open ${type === 'openBuyStopLimit' ? 'BUY' : 'SELL'} Stop Market. `;
                label += `Volume=${volume} (${getUnit(unitVolume)}), `;
                label += `Stop=${stop} (${getUnit(unitStop)}), `;
                label += `Entry=${entry} (${getUnit(unitEntry)}), `;
                label += `TP=${tp} (${getUnit(unitTP)}), `;
                label += `SL=${sl} (${getUnit(unitSL)})`;
                node.data('display', label);
            }
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
            r_apiKey.value = botData.apiKey;
            r_secretKey.value = botData.secretKey;
            r_enableRealOrder.value = botData.enableRealOrder;

            const treeData = {
                ...botData.treeData,
                ...defaultTree
            };
            if (treeData.elements.nodes.filter((item: { type: string; }) => item.type != 'start').length == 0) {
                treeData.elements.nodes.push({ data: { id: 'start', value: 'Start', type: 'start' }, position: { x: 400, y: 300 } });
            }

            cy.json(treeData);

            cy.nodes().forEach(node => {
                updateDisplay(node);
            });

            cy.elements('.selected').removeClass('selected');
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
                Toast.showSuccess(`Chọn toàn bộ coin ${broker} (${numberOfSymbol} / ${numberOfSymbol})`);
            }
            else {
                Toast.showSuccess(`Bỏ toàn bộ coin ${broker} (0 / ${numberOfSymbol})`);
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

            Toast.showSuccess(`Đã lọc coin trùng nhau (${newSymbolListSelected.length} / ${r_symbolList.value.length})`);
        }

        function removeVietnameseTones(str: string) {
            return str
                .normalize('NFD') // Chuẩn hóa chuỗi
                .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu thanh
                .replace(/đ/g, 'd') // Thay thế chữ "đ"
                .replace(/Đ/g, 'D') // Thay thế chữ "Đ"
                .toLocaleLowerCase()
                .trim();
        }

        function searchBot(event: any) {
            const inputValue = event.query;
            r_botNameList.value = allBotList.filter(suggestion =>
                removeVietnameseTones(suggestion).includes(removeVietnameseTones(inputValue))
            );
        }

        function findFreePosition() {
            let minX = Infinity;
            let maxY = -Infinity;

            cy.nodes().forEach(node => {
                const pos = node.position();
                minX = Math.min(minX, pos.x);
                maxY = Math.max(maxY, pos.y);
            });

            if (minX === Infinity) minX = 400;
            if (maxY === -Infinity) maxY = 300;


            return { x: minX, y: maxY + 100 };
        }

        function drawModeOn() {
            eh.enableDrawMode();
            eh.stop();
            cy.autoungrabify(true);
            Toast.showSuccess("Bật chế độ vẽ cạnh");
        }

        function drawModeOff() {
            eh.disableDrawMode();
            eh.start(cy.$('node:selected'));
            cy.autoungrabify(false);
            Toast.showSuccess("Bật chế độ sắp xếp nút");
        }


        function removeNode() {
            const highlightedElements = cy.elements('.selected');

            const startSelectedCount = highlightedElements.filter(item => item.data('type') === 'start').length;
            const startConnt = cy.nodes().filter(item => item.data('type') === 'start').length;
            if (startSelectedCount === startConnt) {
                Toast.showError('Phải có 1 nút start');
                return;
            }

            highlightedElements.remove();
        }

        function copyNode() {
            localStorage.removeItem("NodeCopy");
            localStorage.removeItem("offsetY");

            const nodeSelected = cy.elements('.selected').filter(item => item.is('node'));
            if (nodeSelected.length == 0) {
                Toast.showWarning('Chưa chọn nút nào');
                return;
            };

            let minY = Infinity;

            function getNodeData(id: string): NodeCopy {
                const node = cy.getElementById(id);

                const nodeCopy: NodeCopy = { data: { ...node.data() }, position: { ...node.position() }, next: [] };
                minY = Math.min(minY, nodeCopy.position.y);

                const connectedEdge = node.connectedEdges();
                for (const edge of connectedEdge) {
                    const { source, target } = edge.data();
                    if (source === id) {
                        nodeCopy.next.push(getNodeData(target));
                    }
                }
                return nodeCopy;
            };

            const node = nodeSelected[0];
            const id = node.data('id');

            const nodeCopy: NodeCopy = getNodeData(id);

            if (minY === Infinity) minY = 0;
            const offsetY = - minY;

            localStorage.setItem("NodeCopy", JSON.stringify(nodeCopy));
            localStorage.setItem("offsetY", offsetY.toString());

            Toast.showSuccess('Copy');

            console.log(nodeCopy)
        }

        function pasteNode() {
            const stringObject = localStorage.getItem("NodeCopy");
            const offsetY = parseInt(localStorage.getItem("offsetY") || '0') + findFreePosition().y;

            console.log(stringObject)
            if (!stringObject) {
                Toast.showError('Chưa copy');
                return;
            }

            const nodeCopy: NodeCopy = JSON.parse(stringObject);

            let newID = new Date().getTime();

            function addNode(node: NodeCopy, parrentID?: string) {
                node.data.id = (newID++).toString();
                cy.add({
                    group: 'nodes',
                    data: node.data,
                    position: { x: node.position.x, y: node.position.y + offsetY }
                });
                if (parrentID) {
                    cy.add({
                        group: 'edges',
                        data: { source: parrentID, target: node.data.id },
                    });
                }
                for (const nodeNext of node.next) {
                    addNode(nodeNext, node.data.id);
                }
            }

            addNode(nodeCopy);
            Toast.showSuccess('Paste');
        }

        useEventListener(document, 'keydown', (event: KeyboardEvent) => {
            if (r_visible.value) return;
            if (isTextSelected()) return;
            if (!event.ctrlKey && event.key === 'Delete') {
                removeNode();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'c') {
                copyNode();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'v') {
                pasteNode();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'b') {
                event.preventDefault();
                newNode();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'e') {
                event.preventDefault();
                drawModeOn();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'r') {
                event.preventDefault();
                drawModeOff();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'u') {
                event.preventDefault();
                updateNode();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 's') {
                event.preventDefault();
                saveBot();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'h') {
                window.open(`/history/${r_botName.value}`);
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                settingApiKey();
            }
            else if (event.ctrlKey && event.key.toLowerCase() === 'delete') {
                removeBot();
            }
        });

        async function saveBot() {
            try {
                const botName = r_botName.value;
                if (!botName) {
                    Toast.showError("Tên bot không hợp lệ");
                    return;
                }
                if (cy.nodes().filter(item => item.data('type') === 'start').length !== 1) {
                    Toast.showError("Chỉ được có 1 nút start");
                    return;
                }

                let data = {
                    treeData: cy.json(),
                    idTelegram: r_idTelegram.value,
                    timeframes: r_timeframesSelected.value,
                    symbolList: r_symbolListSelected.value,
                    botName: botName,
                    apiKey: r_apiKey.value,
                    secretKey: r_secretKey.value,
                    enableRealOrder: r_enableRealOrder.value ? 1 : 0
                };

                let res = await axios.post('/save', data);
                Toast.showSuccess(`Đã lưu ${data.botName}`);
                Cookies.set("botName", data.botName);
            }

            catch (err: any) {
                console.error({ err })
                Toast.showError(err.message);
            }
        }

        function removeBot() {
            const botName = r_botName.value;
            if (!botName) {
                Toast.showError("Tên bot không hợp lệ");
                return;
            }
            confirmation.require({
                message: `Xác nhận xóa bot ${r_botName.value}`,
                header: 'Xóa bot',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                rejectProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true
                },
                acceptProps: {
                    label: 'Delete',
                    severity: 'danger'
                },
                accept: async () => {
                    try {
                        const botName = r_botName.value;
                        await axios.delete_('/delete', { botName });
                        Toast.showWarning(`Xóa bot ${botName} thành công`);
                        Cookies.set("botName", '');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                    catch (err: any) {
                        Toast.showError(err.message);
                    }
                },
                reject: () => {
                }
            });
        }

        async function settingApiKey() {
            r_apiDialogVisible.value = true;
        }

        function newNode() {
            r_visible.value = true;
            r_type.value = 'Thêm nút mới';

            const id = new Date().getTime().toString();
            const value = '';
            const type = 'expr';
            const unitVolume = 'usd';
            const unitEntry = 'price';
            const unitTP = 'price';
            const unitSL = 'price';
            const unitStop = 'price';
            const unitExpiredTime = 'candle';
            const expiredTime = '0';

            r_currentNode.value = { id, value, type, unitVolume, unitEntry, unitTP, unitSL, unitStop, unitExpiredTime, expiredTime };
        }

        function updateNode() {
            const nodeSelected = cy.elements('.selected').filter(item => item.is('node') && item.data('type') != 'start');
            if (nodeSelected.length == 0) {
                Toast.showWarning('Chưa chọn nút nào');
                return;
            };

            r_type.value = 'Cập nhật nút';
            r_visible.value = true;

            const node = nodeSelected[0];
            r_currentNode.value = { ...node.data() };
        }

        async function applyNode() {
            try {
                const data: NodeData = r_currentNode.value;
                if (!data.id) {
                    Toast.showWarning('Chưa nhập điều kiện');
                    return;
                }
                await axios.post('/check', data);

                if (r_type.value == 'Thêm nút mới') {
                    cy.add({
                        group: 'nodes',
                        data,
                        position: findFreePosition()
                    });
                    const node = cy.getElementById(data.id);
                    updateDisplay(node);
                }
                else if (r_type.value == 'Cập nhật nút') {
                    const node = cy.getElementById(data.id);
                    node.data({ ...data });

                    updateDisplay(node);
                }

                const currentZoom = cy.zoom();

                cy.layout({
                    name: 'preset',
                    fit: false,
                    padding: 10
                }).run();

                cy.zoom(currentZoom);

                r_visible.value = false;
            }
            catch (err: any) {
                Toast.showError(err.message);
            }
        }

        function isInputFocused() {
            const activeElement = document.activeElement;
            if (activeElement === null) return false;
            return activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA';
        }

        function isTextSelected() {
            const selection = window.getSelection();
            if (!selection) return true;
            if (selection.type === 'Range' && selection.toString().length > 0) {
                return true;
            }
            return isInputFocused();
        }

        function clearTextSelection() {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
            }
        }

        function openContextMenu(event: any) {
            if (r_visible.value) return;
            if (isTextSelected()) {
                clearTextSelection();
                return;
            }
            menu.value.show(event);
        }

        function saveApiConfig() {
            Toast.showSuccess(`Save api config`);
            r_apiDialogVisible.value = false;
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
            if (treeData.elements.nodes.filter((item: { type: string; }) => item.type != 'start').length == 0) {
                treeData.elements.nodes.push({ data: { id: 'start', value: 'Start', type: 'start' }, position: { x: 400, y: 300 } });
            }

            cy = cytoscape({
                container: document.getElementById('cy'),
                ...treeData,
                ...defaultTree
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
            r_botNameList,
            r_visible,
            r_currentNode,
            r_type,
            r_apiDialogVisible,
            r_apiKey,
            r_secretKey,
            r_enableRealOrder,
            brokerList,
            nodeTypes,
            unitsEntry,
            unitTP,
            unitsVulume,
            unitExpiredTime,
            menu,
            items,
            getBotInfo,
            toogleAllSymbol,
            filterDuplicate,
            searchBot,
            drawModeOn,
            drawModeOff,
            removeNode,
            saveBot,
            removeBot,
            newNode,
            updateNode,
            applyNode,
            openContextMenu,
            saveApiConfig
        };
    }
});