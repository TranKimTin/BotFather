<template>
    <div class="alwaysOnTop">
        <Dialog v-model:visible="r_visible" modal :header="r_type" :style="{ width: '40%' }">
            <div class="grid grid-cols-[1fr_3fr] gap-2 p-2">
                <label for="type" class="font-semibold">Loại</label>
                <Select v-model="r_currentNode.type" filter :options="nodeTypes" optionLabel="name" optionValue="value"
                    placeholder="Loại điều kiện" class="flex-auto" />

                <label v-if="r_currentNode.type == 'expr'" for="expr" class="font-semibold">Điều kiện:</label>
                <InputText v-if="r_currentNode.type == 'expr'" id="expr" class="flex-auto" v-model="r_currentNode.value"
                    autocomplete="off" />

                <label v-if="r_currentNode.type == 'telegram'" for="teleContent" class="font-semibold">Nội dung:</label>
                <InputText v-if="r_currentNode.type == 'telegram'" id="teleContent" class="flex-auto"
                    v-model="r_currentNode.value" autocomplete="off" />

                <!-- volume -->
                <label
                    v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="volume">Volume:</label>
                <div v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.volume" autocomplete="off" class="flex-auto" id="volume"
                        placeholder="Nhập biểu thức" />
                    <Select
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitVolume" :options="unitsVulume" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- stop -->
                <label
                    v-if="['openBuyStopMarket', 'openBuyStopLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="stop">Stop:</label>
                <div v-if="['openBuyStopMarket', 'openBuyStopLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText
                        v-if="['openBuyStopMarket', 'openBuyStopLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.stop" autocomplete="off" class="flex-auto" id="stop"
                        placeholder="Nhập biểu thức" />
                    <Select
                        v-if="['openBuyStopMarket', 'openBuyStopLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitSL" :options="unitsEntry" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- entry -->
                <label
                    v-if="['openBuyLimit', 'openBuyStopLimit', 'openSellLimit', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="entry">Entry:</label>
                <div v-if="['openBuyLimit', 'openBuyStopLimit', 'openSellLimit', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText
                        v-if="['openBuyLimit', 'openBuyStopLimit', 'openSellLimit', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.entry" autocomplete="off" class="flex-auto" id="entry"
                        placeholder="Nhập biểu thức" />
                    <Select
                        v-if="['openBuyLimit', 'openBuyStopLimit', 'openSellLimit', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitEntry" :options="unitsEntry" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- TP -->
                <label
                    v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="tp">TP:</label>
                <div v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.tp" autocomplete="off" class="flex-auto" id="tp"
                        placeholder="Nhập biểu thức" />
                    <Select
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitTP" :options="unitsEntry" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- SL -->
                <label
                    v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="sl">SL:</label>
                <div v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.sl" autocomplete="off" class="flex-auto" id="sl"
                        placeholder="Nhập biểu thức" />
                    <Select
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitSL" :options="unitsEntry" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- Expired Time -->
                <label
                    v-if="['openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="expiredTime">Thời gian hủy lệnh:</label>
                <div v-if="['openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText
                        v-if="['openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.expiredTime" autocomplete="off" class="flex-auto" id="expiredTime"
                        placeholder="Không hủy thì nhập 0" />
                    <Select
                        v-if="['openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitExpiredTime" :options="unitExpiredTime" optionLabel="name"
                        optionValue="value" placeholder="Đơn vị" class="flex-auto" />
                </div>


            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Hủy" severity="secondary" @click="r_visible = false"></Button>
                <Button type="button" label="Lưu" @click="applyNode"></Button>
            </div>
        </Dialog>

        <div class="row">
            <div class="col-2"><b>Tên bot</b></div>
            <div class="col-2"><b>Telegram</b></div>
            <div class="col-2"><b>Khung thời gian</b></div>
            <div class="col-6">
                <button v-for="broker in brokerList" @click="toogleAllSymbol(broker)" class="btn btn-outline-primary"
                    :title="r_symbolListSelected.filter((item: string) => item.startsWith(`${broker}:`)).length + ' / ' + r_symbolList.filter((item: string) => item.startsWith(`${broker}:`)).length">
                    <b>{{ r_symbolList.filter((item: string) =>
                        item.startsWith(`${broker}:`)).length
                        !== r_symbolListSelected.filter((item: string) => item.startsWith(`${broker}:`)).length ? '+' :
                        '-' }}</b>
                    {{ broker }}</button>
                <button @click="filterDuplicate()" class="btn btn-outline-primary">Lọc trùng</button>
                <b> ({{ r_symbolListSelected.length }}/{{ r_symbolList.length }})</b>
            </div>
        </div>

        <div class="row">
            <div class="col-2">
                <AutoComplete v-model="r_botName" :suggestions="r_botNameList" @complete="searchBot" dropdown
                    @keydown="getBotInfo" @change="getBotInfo" placeholder="Nhập tên..." />
            </div>
            <div class="col-2">
                <input v-model="r_idTelegram" class="form-control" type="text" placeholder="Nhập id telegram" />
            </div>
            <div class="col-2">
                <MultiSelect v-model="r_timeframesSelected" :options="timeframes" filter placeholder="Khung thời gian"
                    class="w-full md:w-80 form-control" />
            </div>
            <div class="col-6">
                <MultiSelect v-model="r_symbolListSelected" :options="r_symbolList" filter placeholder="Symbols"
                    class="w-full md:w-80 form-control" :virtualScrollerOptions="{ itemSize: 30 }" />
            </div>
        </div>

        <div class="flex justify-center">
            <button class="btn btn-outline-danger mr-1" @click="removeBot">Xóa bot</button>
            <button class="btn btn-outline-primary mr-1" @click="newNode">Thêm nút mới</button>
            <button class="btn btn-outline-primary mr-1" @click="drawModeOn">Chế độ vẽ cạnh</button>
            <button class="btn btn-outline-primary mr-1" @click="drawModeOff">Chế độ sắp xếp nút</button>
            <button class="btn btn-outline-primary mr-1" @click="updateNode">Sửa nút đã chọn</button>
            <button class="btn btn-outline-danger mr-1" @click="removeNode">Xóa nút đã chọn</button>
            <button class="btn btn-outline-success mr-1" @click="saveBot">Lưu cấu hình bot</button>
            <a :href="`/history/${r_botName}`" target="_blank">
                <button class="btn btn-outline-success mr-1">Xem lịch sử lệnh</button>
            </a>
            <router-link :to="{ path: `/calculator` }">
                <button class="btn btn-outline-success mr-1">Máy tính</button>
            </router-link>
        </div>
    </div>
    <div id="cy"></div>
</template>

<script lang="ts" src="./BotConfig.ts"></script>

<style scoped>
#cy {
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    position: fixed;
}

.alwaysOnTop {
    position: absolute;
    z-index: 1000;
    width: 100%;
}
</style>