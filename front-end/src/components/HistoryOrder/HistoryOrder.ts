import { defineComponent, onMounted, ref, watch } from 'vue';
import * as axios from '../../axios/axios';
import { useRoute, useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import BalanceChart from "./BalanceChart.vue";
import InputText from 'primevue/inputtext';
import { useConfirm } from "primevue/useconfirm";
import * as Toast from '../../toast/toast';
import Select from 'primevue/select';
import moment from 'moment';
import ProgressSpinner from 'primevue/progressspinner';

interface Order {
    id: number,
    symbol: string,
    broker: string,
    timeframe: string,
    orderType: string,
    volume: number,
    volumeInUSD: number,
    stop: number,
    entry: number,
    tp: number,
    sl: number,
    profit: number,
    status: ORDER_STATUS,
    createdTime: string,
    expiredTime: string,
    timeStop: string,
    timeEntry: string,
    timeTP: string,
    timeSL: string,
    lastTimeUpdated: string
};

interface Income {
    symbol: string,
    incomeType: string,
    income: string,
    info: string,
    time: number,
    tranId: string,
    tradeId: string,
}

export enum ORDER_STATUS {
    OPENED = 'Mở lệnh',
    MATCH_STOP = 'Khớp stop',
    MATCH_ENTRY = 'Khớp entry',
    MATCH_TP = 'Khớp TP',
    MATCH_SL = 'Khớp SL',
    CANCELED = 'Đã hủy'
}

export interface PropData {
    timestamp: string,
    balance: number,
    balanceNoFee: number,
    balanceReal: number
}

function getMinBalanceRequired(orders: Array<Order>): number {
    let minBalanceRequired = 0;
    let list: Array<{ timestamp: number, volumeInUSD: number }> = [];
    let timeMin = 0;

    for (let item of orders) {
        list.push({ timestamp: new Date(item.createdTime).getTime(), volumeInUSD: item.volumeInUSD });

        if (item.timeTP || item.timeSL || item.status === ORDER_STATUS.CANCELED) {
            list.push({ timestamp: new Date(item.timeTP || item.timeSL || item.expiredTime).getTime(), volumeInUSD: -item.volumeInUSD });
        }
    }

    list.sort((a, b) => a.timestamp - b.timestamp);

    let currentBalance = 0;
    for (let item of list) {
        currentBalance += item.volumeInUSD;
        if (minBalanceRequired < currentBalance) {
            timeMin = item.timestamp;
            minBalanceRequired = currentBalance;
        }
    }

    console.log('time min: ', moment(timeMin).format('YYYY-MM-DD HH:mm'), ' min balance: ', minBalanceRequired);

    return minBalanceRequired * 1.1;
}

export default defineComponent({
    components: { DataTable, Column, MultiSelect, BalanceChart, Select, InputText, ProgressSpinner },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const botName: string = route.params.botName as string;

        const r_orderList = ref<Array<Order>>([]);
        const r_gain = ref<number>(0);
        const r_loss = ref<number>(0);
        const r_tradereal_profit = ref<number>(0);
        const r_unrealizedGain = ref<number>(0);
        const r_unrealizedLoss = ref<number>(0);
        const r_cntGain = ref<number>(0);
        const r_cntLoss = ref<number>(0);
        const r_cntOpening = ref<number>(0);
        const r_maxDD = ref<number>(0);
        const r_isLoading = ref<boolean>(true);
        const timeframes: Array<string> = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];
        const r_timeframesSelected = ref<Array<string>>([...timeframes]);
        const brokers: Array<string> = ['binance', 'bybit', 'okx', 'binance_future', 'bybit_future'];
        const r_brokerSelected = ref<Array<string>>([...brokers]);
        const r_balanceData = ref<Array<PropData>>([]);
        const r_tradeRealTimestamp = ref<string>('');
        const r_accountBalance = ref<number>(0);
        const r_accountMargin = ref<number>(0);
        const r_AccountUnrealizedPnL = ref<number>(0);
        const r_globalFilter = ref<string>("");
        const r_minBalanceRequired = ref<number>(0);
        const r_volumeRealOpening = ref<number>(0);

        const r_botNameList = ref<Array<string>>([]);
        const r_botName = ref<string>(botName);

        let firstLoad = true;

        const confirmation = useConfirm();

        let timeout = 0;
        function loadData(isDelay: boolean) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                r_isLoading.value = true;
                r_balanceData.value = [];
                const params = {
                    botName: route.params.botName,
                    filterBroker: r_brokerSelected.value.join(','),
                    filterTimeframe: r_timeframesSelected.value.join(',')
                };
                axios.get(`/getHistoryOrder`, params).then(async (result: { orders: Array<Order>, tradeReal: Array<Income>, accountInfo: any, openOrders: any }) => {
                    const { orders, tradeReal, accountInfo, openOrders } = result;

                    console.log({ accountInfo, openOrders });

                    const symbolErrors: Array<string> = [];

                    if (accountInfo && openOrders) {
                        for (let item of accountInfo.positions) {
                            let positionAmt = parseFloat(item.positionAmt);
                            if (positionAmt === 0) continue;

                            let totalOpenAmtTP = 0;
                            let totalOpenAmtSL = 0;
                            for (let o of openOrders) {
                                if (o.symbol === item.symbol && o.reduceOnly === true) {
                                    let orderAmt = parseFloat(o.origQty || o.quantity);
                                    if (o.origType === 'TAKE_PROFIT_MARKET' || o.orderType === 'TAKE_PROFIT_MARKET') {
                                        totalOpenAmtTP += orderAmt;
                                        if (o.closePosition === true) {
                                            totalOpenAmtTP = Math.abs(positionAmt);
                                        }
                                    }
                                    if (o.origType === 'STOP_MARKET' || o.orderType === 'STOP_MARKET') {
                                        totalOpenAmtSL += orderAmt;
                                        if (o.closePosition === true) {
                                            totalOpenAmtSL = Math.abs(positionAmt);
                                        }
                                    }
                                }
                            }
                            if (totalOpenAmtTP + 0.00000001 < Math.abs(positionAmt)) {
                                Toast.showError(`${item.symbol} thiếu TP ${Math.abs(positionAmt) - totalOpenAmtTP} (${Math.abs(positionAmt)} - ${totalOpenAmtTP})`);
                            }
                            if (totalOpenAmtSL + 0.00000001 < Math.abs(positionAmt)) {
                                Toast.showError(`${item.symbol} thiếu SL ${Math.abs(positionAmt) - totalOpenAmtSL} (${Math.abs(positionAmt)} - ${totalOpenAmtSL})`);
                            }
                        }
                    }
                    console.log({ symbolErrors });

                    let gain = 0;
                    let loss = 0;
                    let unrealizedGain = 0;
                    let unrealizedLoss = 0;
                    let cntGain = 0;
                    let cntLoss = 0;
                    let cntOpening = 0;
                    let maxProfit = 0;
                    let maxDD = 0;
                    let balanceData: Array<PropData> = [];
                    const feeRate = 0.05 / 100;
                    let feeGain = 0;
                    let feeLoss = 0;
                    let totalFee = 0;
                    let lastTimeUpdated: string = '';
                    let idxTradeReal = 0;
                    let balanceReal = 0;
                    let minBalanceRequired = getMinBalanceRequired(orders);
                    let volumeRealOpenning = 0;

                    if (accountInfo) {
                        for (let item of accountInfo.positions) {
                            volumeRealOpenning += parseFloat(item.entryPrice) * parseFloat(item.positionAmt);
                        }
                        tradeReal.push({
                            symbol: 'USDT',
                            incomeType: 'UNREALIZED_PnL',
                            income: accountInfo.totalUnrealizedProfit,
                            info: '',
                            time: new Date().getTime(),
                            tranId: '',
                            tradeId: '',
                        });
                    }

                    let sortedData = orders.filter(item => item.status !== ORDER_STATUS.CANCELED);
                    console.log('order length: ', sortedData.length);
                    sortedData.sort((a, b) => {
                        let timeA = new Date(a.createdTime).getTime();
                        let timeB = new Date(a.createdTime).getTime();

                        if (a.timeTP) timeA = new Date(a.timeTP).getTime();
                        else if (a.timeSL) timeA = new Date(a.timeSL).getTime();

                        if (b.timeTP) timeB = new Date(b.timeTP).getTime();
                        else if (b.timeSL) timeB = new Date(b.timeSL).getTime();

                        return timeA - timeB;
                    });

                    for (let i = 0; i < sortedData.length; i++) {
                        const order = sortedData[i];

                        if (lastTimeUpdated === '' || (order.lastTimeUpdated && order.timeEntry && new Date(lastTimeUpdated).getTime() < new Date(order.lastTimeUpdated).getTime()))
                            lastTimeUpdated = order.lastTimeUpdated;

                        let fee = 0;
                        if (order.status === ORDER_STATUS.MATCH_ENTRY) fee = feeRate * order.volume * order.entry;
                        else if (order.status === ORDER_STATUS.MATCH_TP) fee = feeRate * order.volume * (order.entry + order.tp);
                        else if (order.status === ORDER_STATUS.MATCH_SL) fee = feeRate * order.volume * (order.entry + order.sl);

                        totalFee += fee;

                        if (order.timeTP) {
                            gain += order.profit;
                            feeGain += fee;
                            cntGain++;
                            while (idxTradeReal < tradeReal.length && tradeReal[idxTradeReal].time <= new Date(order.timeTP).getTime() + 60000) {
                                balanceReal += parseFloat(tradeReal[idxTradeReal].income);
                                idxTradeReal++;
                            }
                            balanceData.push({ timestamp: order.timeTP, balance: gain + loss - totalFee, balanceNoFee: gain + loss, balanceReal });
                        }
                        else if (order.timeSL) {
                            loss += order.profit;
                            feeLoss += fee;
                            cntLoss++;
                            while (idxTradeReal < tradeReal.length && tradeReal[idxTradeReal].time <= new Date(order.timeSL).getTime() + 60000) {
                                balanceReal += parseFloat(tradeReal[idxTradeReal].income);
                                idxTradeReal++;
                            }
                            balanceData.push({ timestamp: order.timeSL, balance: gain + loss - totalFee, balanceNoFee: gain + loss, balanceReal });
                        }
                        else if (order.timeEntry && order.profit) {
                            cntOpening++;
                            if (order.profit > 0) {
                                unrealizedGain += order.profit;
                                feeGain += fee;
                            }
                            else {
                                unrealizedLoss += order.profit;
                                feeLoss += fee;
                            }
                        }
                        maxProfit = Math.max(maxProfit, gain + loss);
                        maxDD = Math.max(maxDD, maxProfit - (gain + loss));
                        if (order.profit) order.profit -= fee;
                    }

                    console.log({ tradeReal: tradeReal.filter(item => item.incomeType === 'REALIZED_PNL') });
                    if (idxTradeReal < tradeReal.length) {
                        while (idxTradeReal < tradeReal.length) {
                            balanceReal += parseFloat(tradeReal[idxTradeReal].income);
                            idxTradeReal++;
                        }
                    }
                    balanceData.push({ timestamp: moment(tradeReal[idxTradeReal - 1].time).format("YYYY-MM-DD HH:mm"), balance: gain + loss + unrealizedGain + unrealizedLoss - totalFee, balanceNoFee: gain + loss, balanceReal });


                    if (accountInfo) {
                        balanceReal -= accountInfo.totalUnrealizedProfit;
                    }

                    console.log({ gain, feeGain, loss, feeLoss, unrealizedGain, unrealizedLoss, cntGain, cntLoss, cntOpening })

                    r_orderList.value = orders;
                    r_gain.value = parseFloat((gain - feeGain).toFixed(2));
                    r_loss.value = parseFloat((loss - feeLoss).toFixed(2));
                    r_unrealizedGain.value = parseFloat(unrealizedGain.toFixed(2));
                    r_unrealizedLoss.value = parseFloat(unrealizedLoss.toFixed(2));
                    r_maxDD.value = parseFloat(maxDD.toFixed(2));
                    r_cntGain.value = cntGain;
                    r_cntLoss.value = cntLoss;
                    r_cntOpening.value = cntOpening;
                    r_isLoading.value = false;
                    r_balanceData.value = balanceData;
                    r_tradereal_profit.value = balanceReal;
                    r_minBalanceRequired.value = Math.round(minBalanceRequired);
                    r_volumeRealOpening.value = Math.round(volumeRealOpenning);

                    if (tradeReal.length > 0) {
                        r_tradeRealTimestamp.value = moment(tradeReal[0].time).format('DD/MM/YYYY HH:mm:ss');
                    }
                    r_accountBalance.value = accountInfo ? Math.round(accountInfo.totalWalletBalance) : 0;
                    r_accountMargin.value = accountInfo ? Math.round(accountInfo.availableBalance) : 0;
                    r_AccountUnrealizedPnL.value = accountInfo ? Math.round(accountInfo.totalUnrealizedProfit) : 0;
                    if (firstLoad) {
                        firstLoad = false;
                        const timeframeSelected = [...new Set(sortedData.map(order => order.timeframe))];
                        timeframeSelected.sort((a, b) => timeframes.indexOf(a) - timeframes.indexOf(b));
                        r_timeframesSelected.value = timeframeSelected;

                        const brokerSelected = [...new Set(sortedData.map(order => order.broker))];
                        brokerSelected.sort((a, b) => brokers.indexOf(a) - brokers.indexOf(b));
                        r_brokerSelected.value = brokerSelected;

                        watch(r_timeframesSelected, (newValue) => {
                            newValue.sort((a, b) => timeframes.indexOf(a) - timeframes.indexOf(b));
                            loadData(true);
                        });
                        watch(r_brokerSelected, (newValue) => {
                            newValue.sort((a, b) => brokers.indexOf(a) - brokers.indexOf(b));
                            loadData(true);
                        });
                        watch(r_botName, (newValue) => {
                            router.push(`/history/${r_botName.value}`);
                        });
                        watch(() => route.params.botName, (newValue) => {
                            loadData(false);
                        });
                    }
                });
            }, isDelay ? 3000 : 0);
        }

        function clearHistory() {
            confirmation.require({
                message: `Xác nhận xóa lịch sử bot ${botName}`,
                header: 'Xóa lịch sử',
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
                        await axios.delete_('/clearHistory', { botName });
                        Toast.showWarning(`Xóa bot ${botName} thành công`);
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
        onMounted(() => {
            loadData(false);
            axios.get('/getBotList').then(result => {
                r_botNameList.value = result;
            });
        });

        return {
            botName,
            r_orderList,
            r_gain,
            r_loss,
            r_unrealizedGain,
            r_unrealizedLoss,
            r_cntGain,
            r_cntLoss,
            r_cntOpening,
            r_maxDD,
            r_isLoading,
            r_timeframesSelected,
            r_brokerSelected,
            r_balanceData,
            r_botNameList,
            r_botName,
            r_tradeRealTimestamp,
            r_accountBalance,
            r_accountMargin,
            r_AccountUnrealizedPnL,
            r_tradereal_profit,
            r_globalFilter,
            r_minBalanceRequired,
            r_volumeRealOpening,
            timeframes,
            brokers,
            clearHistory
        };
    }
});