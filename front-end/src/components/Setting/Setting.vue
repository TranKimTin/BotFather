<template>
    <Button label="Cài đòn bẩy" @click="r_visible = true" severity="info" />
    <Dialog v-model:visible="r_visible" modal header="Cài đòn bẩy" :style="{ width: '70%' }" :closeOnEscape="false">
        <div class="grid grid-cols-[1fr_5fr] gap-2 p-2">
            <label for="type" class="font-semibold">Loại</label>
            <Select v-model="r_botName" filter :options="r_botList" placeholder="Bot" class="flex-auto" />

            <label for="marginType" class="font-semibold">Loại:</label>
            <Select v-model="r_marginType" filter :options="['CROSSED', 'ISOLATED']" placeholder="margin type"
                class="flex-auto" />

            <label for="leverage" class="font-semibold">Bẩy:</label>
            <InputNumber id="leverage" class="flex-auto" v-model="r_leverage" autocomplete="off" :min="1" :max="125" />

        </div>
        <div class="flex p-3"></div>
        <div class="flex justify-end gap-2 p-2">
            <Button type="button" label="Hủy" severity="secondary" @click="r_visible = false"></Button>
            <Button type="button" label="Lưu" @click="setLeverage"></Button>
        </div>
    </Dialog>
</template>

<script lang="ts" src="./Setting.ts"></script>
