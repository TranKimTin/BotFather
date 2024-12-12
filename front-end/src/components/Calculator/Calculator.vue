<template>
    <div class="grid grid-cols-[1fr_5fr] gap-2 p-2" style="max-width: 80%;">
        <label for="broker" class="font-semibold">Sàn</label>
        <Select v-model="r_broker" filter :options="brokerList" class="flex-auto" id="broker" />

        <label for="symbol" class="font-semibold">Coin</label>
        <InputText type="text" v-model="r_symbol" id="symbol" />

        <label for="timeframe" class="font-semibold">Khung thời gian</label>
        <Select v-model="r_timeframe" filter :options="timeframeList" class="flex-auto" id="timeframe" />

        <label for="expr" class="font-semibold">Biểu thức</label>
        <!-- <InputText type="text" v-model="r_expr" id="expr" placeholder="Nhập biểu thức" /> -->
        <ExprInput v-model="r_expr" id="expr"/>


        <Button type="button" label="Tính giá trị" severity="secondary" @click="calculate"></Button>
        <InputText v-model="r_value" disabled placeholder="Giá trị biểu thức" />

</div>
</template>

<script lang="ts" src="./Calculator.ts"></script>