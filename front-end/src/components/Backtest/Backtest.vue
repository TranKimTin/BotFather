<template>
  <div class="w-1/2">
    <div class="grid grid-cols-[1fr_5fr] gap-2 p-2">
      <label class="flex items-center">Bot:</label>
      <Select v-model="r_botName" filter :options="r_botList" placeholder="Bot" class="flex-auto" />

      <label class="flex items-center">Khung:</label>
      <Select v-model="r_timeframe" filter :options="timeframes" placeholder="Khung thời gian" class="flex-auto" />

      <label class="flex items-center">Thời gian:</label>
      <div>
        <Select v-model="r_startMonth" :options="months" class="flex-auto" />
        <Select v-model="r_startYear" :options="years" class="flex-auto" />
        <label class="gap-2 p-2"> đến </label>
        <Select v-model="r_endMonth" :options="months" class="flex-auto" />
        <Select v-model="r_endYear" :options="years" class="flex-auto" />
      </div>
    </div>

    <Button label="Chạy backtest" @click="runBacktest" severity="info" />

  </div>
  <div class="m-2">
    <h3>Kết quả backtest:</h3>
    <p>Lãi: {{ r_profit }}</p>
    <p>Số lệnh: {{ r_orderList.length }}</p>
    <div v-if="r_loading">Đang chạy backtest...</div>
    <div v-if="!r_loading">
      <div class="flex justify-end">
          <InputText v-model="r_globalFilter" placeholder="Tìm kiếm..." class="p-inputtext-sm w-72" />
      </div>
      <DataTable :value="r_orderList" class="mt-2" tableStyle="min-width: 50rem" scrollable scrollHeight="85vh"
        :virtualScrollerOptions="{ itemSize: 50 }" :globalFilterFields="['symbol', 'status']" 
        :filters="{ global: { value: r_globalFilter, matchMode: 'contains' } }">
        <Column :header="`STT (${r_orderList.length})`">
          <template #body="order">
            {{ order.index + 1 }}
          </template>
        </Column>
        <Column sort-field="symbol" header="Coin" sortable>
            <template #body="order">
                <a :href="`https://www.binance.com/en/futures/${order.data.symbol}?_from=markets`"
                    target="_blank">
                    {{ order.data.symbol }}
                </a>
            </template>
        </Column>
        <Column field="createdTime" header="Thời gian mở">
          <template #body="order">
            {{ moment(order.data.createdTime).format('YYYY-MM-DD HH:mm') }}
          </template>
        </Column>
        <Column header="Loại lệnh" sortable>
            <template #body="order">
                <span :style="{ color: order.data.orderType.toLowerCase().includes('buy') ? 'green' : 'red' }">
                    {{ order.data.orderType }}
                </span>
            </template>
        </Column>
        <Column field="entry" header="Entry"></Column>
        <Column field="volume" header="Volume"></Column>
        <Column field="tp" header="TP"></Column>
        <Column field="sl" header="SL"></Column>

        <Column field="matchTime" header="Thời gian khớp lệnh">
          <template #body="order">
            {{ order.data.matchTime ? moment(order.data.matchTime).format('YYYY-MM-DD HH:mm') : '' }}
          </template>
        </Column>
        <Column field="expiredTime" header="Thời gian hủy">
          <template #body="order">
            {{ order.data.expiredTime ? moment(order.data.expiredTime).format('YYYY-MM-DD HH:mm') : '' }}
          </template>
        </Column>
        <Column field="profit" header="Lãi">
          <template #body="order">
            <span class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full"
              :class="order.data.profit >= 0 ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'">{{
                (parseFloat(order.data.profit.toFixed(2))).toLocaleString() }} </span>
          </template>
        </Column>
        <Column field="status" header="Trạng thái"></Column>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts" src="./Backtest.ts"></script>