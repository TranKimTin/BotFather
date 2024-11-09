<template>
    <h1>{{ botName }}</h1>
    <div>
        <DataTable :value="r_orderList" tableStyle="min-width: 50rem">
            <Column field="symbol" header="symbol"></Column>
            <Column field="broker" header="broker"></Column>
            <Column field="timeframe" header="timeframe"></Column>
            <Column field="orderType" header="orderType"></Column>
            <Column field="volume" header="volume"></Column>
            <Column field="stop" header="stop"></Column>
            <Column field="entry" header="entry"></Column>
            <Column field="tp" header="tp"></Column>
            <Column field="sl" header="sl"></Column>
            <Column field="status" header="status"></Column>
            <Column field="createdTime" header="createdTime"></Column>
            <Column field="expiredTime" header="expiredTime"></Column>
        </DataTable>
    </div>
</template>

<script lang="ts" src="./HistoryOrder.ts"></script>