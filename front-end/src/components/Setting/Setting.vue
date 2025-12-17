<template>
    <div class="gap-2 p-2">
        <Button label="Cài đòn bẩy" @click="r_visibleleverage = true" severity="info" />
        <Dialog v-model:visible="r_visibleleverage" modal header="Cài đòn bẩy" :style="{ width: '70%' }"
            :closeOnEscape="false">
            <div class="grid grid-cols-[1fr_5fr] gap-2 p-2">
                <label for="type" class="font-semibold">Bot</label>
                <Select v-model="r_bot" filter :options="r_botList" optionLabel="botName" placeholder="Bot" class="flex-auto" />

                <label for="marginType" class="font-semibold">Loại:</label>
                <Select v-model="r_marginType" filter :options="['CROSSED', 'ISOLATED']" placeholder="margin type"
                    class="flex-auto" />

                <label for="leverage" class="font-semibold">Bẩy:</label>
                <InputNumber id="leverage" class="flex-auto" v-model="r_leverage" autocomplete="off" :min="1"
                    :max="150" />
            </div>

            <div class="flex p-3"></div>
            <div class="flex justify-end gap-2 p-2">
                <Button type="button" label="Hủy" severity="secondary" @click="r_visibleleverage = false"></Button>
                <Button type="button" label="Lưu" @click="setLeverage"></Button>
            </div>
        </Dialog>
    </div>

    <div class="gap-2 p-2">
        <Button label="Giới hạn lệnh" @click="r_visibleLimitOrder = true" severity="info" />
        <Dialog v-model:visible="r_visibleLimitOrder" modal header="Giới hạn lệnh" :style="{ width: '70%' }"
            :closeOnEscape="false">
            <div class="grid grid-cols-[2fr_5fr] gap-2 p-2">
                <label for="type" class="font-semibold">Bot</label>
                <Select v-model="r_bot" filter :options="r_botList" optionLabel="botName" placeholder="Bot" class="flex-auto" />

                <label for="r_maxOpenOrderPerSymbolBot" class="font-semibold">Max lệnh mở / symbol / bot</label>
                <InputNumber id="r_maxOpenOrderPerSymbolBot" class="flex-auto" v-model="r_bot.maxOpenOrderPerSymbolBot"
                    autocomplete="off" :min="1" :max="5" />

                <label for="r_maxOpenOrderAllSymbolBot" class="font-semibold">Max lệnh mở / tất cả symbol / bot</label>
                <InputNumber id="r_maxOpenOrderAllSymbolBot" class="flex-auto" v-model="r_bot.maxOpenOrderAllSymbolBot"
                    autocomplete="off" :min="1" :max="300" />

                <label for="r_maxOpenOrderPerSymbolAccount" class="font-semibold">Max lệnh mở / symbol / tài
                    khoản</label>
                <InputNumber id="r_maxOpenOrderPerSymbolAccount" class="flex-auto"
                    v-model="r_bot.maxOpenOrderPerSymbolAccount" autocomplete="off" :min="1" :max="5" />

                <label for="r_maxOpenOrderAllSymbolAccount" class="font-semibold">Max lệnh mở / tất cả symbol / tài
                    khoản</label>
                <InputNumber id="r_maxOpenOrderAllSymbolAccount" class="flex-auto"
                    v-model="r_bot.maxOpenOrderAllSymbolAccount" autocomplete="off" :min="1" :max="300" />
            </div>

            <div class="flex p-3"></div>
            <div class="flex justify-end gap-2 p-2">
                <Button type="button" label="Hủy" severity="secondary" @click="r_visibleLimitOrder = false"></Button>
                <Button type="button" label="Lưu" @click="setMaximumOrder"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts" src="./Setting.ts"></script>
