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

                <!-- stop -->
                <label v-if="['openStopMarket', 'openStopLimit'].includes(r_currentNode.type)" class="font-semibold"
                    for="stop">Stop:</label>
                <div v-if="['openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText v-if="['openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.stop" autocomplete="off" class="flex-auto" id="stop" />
                    <Select v-if="['openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitSL" :options="units" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- entry -->
                <label v-if="['openLimit', 'openStopLimit'].includes(r_currentNode.type)" class="font-semibold"
                    for="entry">Entry:</label>
                <div v-if="['openLimit', 'openStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText v-if="['openLimit', 'openStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.entry" autocomplete="off" class="flex-auto" id="entry" />
                    <Select v-if="['openLimit', 'openStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitEntry" :options="units" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- TP -->
                <label
                    v-if="['openMarket', 'openLimit', 'openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="tp">TP:</label>
                <div v-if="['openMarket', 'openLimit', 'openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText
                        v-if="['openMarket', 'openLimit', 'openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.tp" autocomplete="off" class="flex-auto" id="tp" />
                    <Select
                        v-if="['openMarket', 'openLimit', 'openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitTP" :options="units" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- SL -->
                <label
                    v-if="['openMarket', 'openLimit', 'openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="sl">SL:</label>
                <div v-if="['openMarket', 'openLimit', 'openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[2fr_2fr] gap-2 p-2 flex-auto">
                    <InputText
                        v-if="['openMarket', 'openLimit', 'openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.sl" autocomplete="off" class="flex-auto" id="sl" />
                    <Select
                        v-if="['openMarket', 'openLimit', 'openStopMarket', 'openStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitSL" :options="units" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>


            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="r_visible = false"></Button>
                <Button type="button" label="Save" @click="applyNode"></Button>
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
            <button class="btn btn-outline-primary mr-1" @click="newNode">Thêm điều kiện</button>
            <button class="btn btn-outline-primary mr-1" @click="drawModeOn">Draw mode on</button>
            <button class="btn btn-outline-primary mr-1" @click="drawModeOff">Draw mode off</button>
            <button class="btn btn-outline-primary mr-1" @click="updateNode">Sửa điều kiện</button>
            <button class="btn btn-outline-danger mr-1" @click="removeNode">Xóa</button>
            <button class="btn btn-outline-success mr-1" @click="saveBot">Lưu</button>
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