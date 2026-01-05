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
</template>

<script lang="ts" src="./Backtest.ts"></script>