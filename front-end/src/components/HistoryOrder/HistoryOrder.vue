<template>
    <h1>{{ botName }}</h1>
    <div class="grid grid-cols-4 gap-2 p-2">
        <div class="flex-auto">
            Đã chốt: <span style="color: green;">{{ r_gain }}</span>-<span style="color: red;">{{ -r_loss }}</span>
            =
            <strong :style="{ color: (r_gain + r_loss) >= 0 ? 'green' : 'red' }">{{
                +(r_gain + r_loss).toFixed(2) }} $</strong>
        </div>
        <dir class="flex-auto">Số lệnh lãi: {{ r_cntGain }} </dir>
        <dir class="flex-auto">Số lệnh lỗ: {{ r_cntLoss }} </dir>
        <div class="flex-auto">Win rate: {{ +((r_cntGain / (r_cntGain + r_cntLoss)) * 100).toFixed(2) }} % </div>

        <div class="flex-auto">
            Chưa chốt: <span style="color: green;">{{ r_unrealizedGain }}</span>-<span style="color: red;">{{
                -r_unrealizedLoss
                }}</span> =
            <strong :style="{ color: (r_unrealizedGain + r_unrealizedLoss) >= 0 ? 'green' : 'red' }">{{
                +(r_unrealizedGain + r_unrealizedLoss).toFixed(2) }} $</strong>
        </div>
        <div class="flex-auto">
            Tổng lợi nhuận: <strong
                :style="{ color: (r_gain + r_loss + r_unrealizedGain + r_unrealizedLoss) >= 0 ? 'green' : 'red' }">{{
                    +(r_gain + r_loss + r_unrealizedGain + r_unrealizedLoss).toFixed(2) }} $</strong>
        </div>
        <div class="flex-auto">
            Profit factor: {{ +((r_gain / (-r_loss))).toFixed(2) }}
        </div>
        <div class="flex-auto">
            Drawdown: <span v-if="r_maxDD > 0">-</span> {{ r_maxDD }} $
        </div>
    </div>
    <div class="grid grid-cols-2 gap-2 p-2">
        <div>
            <label for="broker">Lọc sàn</label>
            <MultiSelect v-model="r_brokerSelected" :options="brokers" filter placeholder="Khung thời gian"
                class="w-full md:w-80 form-control" id="broker" />
        </div>
        <div>
            <label for="timeframe">Lọc khung thời gian</label>
            <MultiSelect v-model="r_timeframesSelected" :options="timeframes" filter placeholder="Khung thời gian"
                class="w-full md:w-80 form-control" id="timeframe" />
        </div>
    </div>
    <BalanceChart :data="r_BalanceData" />
    <div>
        <h3 v-if="r_isLoading">Đang load, đợi tí...</h3>
        <DataTable :value="r_orderList" tableStyle="min-width: 50rem" scrollable scrollHeight="90vh"
            :virtualScrollerOptions="{ itemSize: 50 }" stripedRows>
            <Column :header="`STT (${r_orderList.length})`">
                <template #body="order">
                    {{ order.index + 1 }}
                </template>
            </Column>
            <Column sort-field="symbol" header="Coin" sortable>
                <template #body="order">
                    <a v-if="order.data.broker === 'binance'"
                        :href="`https://www.binance.com/en/trade/${order.data.symbol}?_from=markets&type=spot`"
                        target="_blank">
                        {{ order.data.symbol }}
                    </a>
                    <a v-if="order.data.broker === 'binance_future'"
                        :href="`https://www.binance.com/en/futures/${order.data.symbol}?_from=markets`" target="_blank">
                        {{ order.data.symbol }}
                    </a>
                    <a v-if="order.data.broker === 'bybit'"
                        :href="`https://www.bybit.com/vi-VN/trade/spot/${order.data.symbol.replace('USDT', '')}/USDT`"
                        target="_blank">
                        {{ order.data.symbol }}
                    </a>
                    <a v-if="order.data.broker === 'bybit_future'"
                        :href="`https://www.bybit.com/trade/usdt/${order.data.symbol}`" target="_blank">
                        {{ order.data.symbol }}
                    </a>
                    <a v-if="order.data.broker === 'okx'"
                        :href="`https://www.okx.com/vi/trade-spot/${order.data.symbol}`" target="_blank">
                        {{ order.data.symbol }}
                    </a>
                </template>
            </Column>
            <Column field="broker" header="Sàn" sortable> </Column>
            <Column field="timeframe" header="Khung" sortable></Column>
            <Column field="createdTime" header="Thời gian mở" sortable></Column>
            <Column header="orderType" sortable>
                <template #body="order">
                    <span :style="{ color: order.data.orderType.toLowerCase().includes('buy') ? 'green' : 'red' }">
                        {{ order.data.orderType }}
                    </span>
                </template>
            </Column>
            <Column field="volume" header="Volume">
            </Column>
            <Column field="stop" header="Stop"></Column>
            <Column header="entry">
                <template #body="order">
                    <span :title="order.data.timeEntry">{{ order.data.entry }}</span>
                </template>
            </Column>
            <Column header="TP">
                <template #body="order">
                    <span>{{ order.data.tp }}</span>
                </template>
            </Column>
            <Column header="SL">
                <template #body="order">
                    <span>{{ order.data.sl }}</span>
                </template>
            </Column>
            <Column sortField="status" header="Trạng thái" sortable>
                <template #body="order">
                    <span v-if="!order.data.timeTP && !order.data.timeSL" :title="order.data.lastTimeUpdated"
                        style="cursor: pointer;">
                        {{ order.data.status }}
                        <span v-if="order.data.profit"
                            :style="{ color: order.data.profit >= 0 ? 'green' : 'red', opacity: 0.5 }">
                            (<span v-if="order.data.profit >= 0">+</span>{{ +order.data.profit.toFixed(2) }} $)
                        </span>
                    </span>
                    <span v-if="order.data.timeTP" :title="order.data.timeTP" style="color: green; cursor: pointer;">
                        (+{{ +Math.abs(order.data.volume * (order.data.tp - order.data.entry)).toFixed(2) }} $)
                        (+{{ +Math.abs((order.data.tp - order.data.entry) / order.data.entry * 100).toFixed(2) }} %)
                    </span>
                    <span v-if="order.data.timeSL" :title="order.data.timeSL" style="color: red; cursor: pointer;">
                        (-{{ +Math.abs(order.data.volume * (order.data.sl - order.data.entry)).toFixed(2) }} $)
                        (-{{ +Math.abs((order.data.sl - order.data.entry) / order.data.entry * 100).toFixed(2) }} %)
                    </span>
                </template>
            </Column>
            <Column field="expiredTime" header="Thời gian hủy"></Column>
        </DataTable>
    </div>
</template>

<script lang="ts" src="./HistoryOrder.ts"></script>