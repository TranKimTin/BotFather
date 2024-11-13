<template>
    <h1>{{ botName }}. Tổng lãi: <span :style="{ color: r_totalProfit >= 0 ? 'green' : 'red' }"> {{ r_totalProfit >= 0 ?
        '+' : '' }}
            {{ r_totalProfit }} $</span></h1>
    <div>
        <DataTable :filters="filters" :globalFilterFields=filterFields filterDisplay="row" :value="r_orderList"
            tableStyle="min-width: 50rem" scrollable scrollHeight="90vh" :virtualScrollerOptions="{ itemSize: 50 }"
            stripedRows>
            <Column :header="`STT (${r_orderList.length})`">
                <template #body="order">
                    {{ order.index + 1 }}
                </template>
            </Column>
            <Column field="symbol" header="symbol" sortable></Column>
            <Column field="broker" header="broker" sortable> </Column>
            <Column field="timeframe" header="Khung" sortable></Column>
            <Column field="createdTime" header="Thời gian" sortable></Column>
            <Column header="orderType" sortable>
                <template #body="order">
                    <span :style="{ color: order.data.orderType.toLowerCase().includes('buy') ? 'green' : 'red' }">
                        {{ order.data.orderType }}
                    </span>
                </template>
            </Column>
            <Column field="volume" header="volume">
            </Column>
            <Column field="stop" header="stop"></Column>
            <Column header="entry">
                <template #body="order">
                    <span :title="order.data.timeEntry">{{ order.data.entry }}</span>
                </template>
            </Column>
            <Column header="tp">
                <template #body="order">
                    <span :title="order.data.timeTP">{{ order.data.tp }}</span>
                </template>
            </Column>
            <Column header="sl">
                <template #body="order">
                    <span :title="order.data.timeSL">{{ order.data.sl }}</span>
                </template>
            </Column>
            <Column sortField="status" header="status" sortable>
                <template #body="order">
                    <span v-if="!order.data.timeTP && !order.data.timeSL">
                        {{ order.data.status }}
                    </span>
                    <span v-if="order.data.timeTP" style="color: green;">
                        (+{{ +Math.abs(order.data.volume * (order.data.tp - order.data.entry)).toFixed(2) }} $)
                        (+{{ +Math.abs((order.data.tp - order.data.entry) / order.data.entry * 100).toFixed(2) }} %)
                    </span>
                    <span v-if="order.data.timeSL" style="color: red;">
                        (-{{ +Math.abs(order.data.volume * (order.data.tp - order.data.entry)).toFixed(2) }} $)
                        (-{{ +Math.abs((order.data.tp - order.data.entry) / order.data.entry * 100).toFixed(2) }} %)
                    </span>
                </template>
            </Column>
            <Column field="expiredTime" header="expiredTime"></Column>
        </DataTable>
    </div>
</template>

<script lang="ts" src="./HistoryOrder.ts"></script>