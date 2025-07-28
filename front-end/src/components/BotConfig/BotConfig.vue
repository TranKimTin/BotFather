<template>
    <div>
        <Dialog v-model:visible="r_visible" modal :header="r_type" :style="{ width: '70%' }" :closeOnEscape="false">
            <div class="grid grid-cols-[1fr_5fr] gap-2 p-2">
                <label for="type" class="font-semibold">Loại</label>
                <Select v-model="r_currentNode.type" filter :options="nodeTypes" optionLabel="name" optionValue="value"
                    placeholder="Loại điều kiện" class="flex-auto" />

                <label v-if="r_currentNode.type == 'expr'" for="expr" class="font-semibold">Điều kiện:</label>
                <ExprInput v-if="r_currentNode.type == 'expr'" v-model="r_currentNode.value" id="expr" />

                <label v-if="r_currentNode.type == 'telegram'" for="teleContent" class="font-semibold">Nội dung:</label>
                <InputText v-if="r_currentNode.type == 'telegram'" id="teleContent" class="flex-auto"
                    v-model="r_currentNode.value" autocomplete="off" />

                <!-- volume -->
                <label
                    v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="volume">Volume:</label>
                <div v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[5fr_2fr] gap-2 p-2 flex-auto">
                    <ExprInput
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.volume" id="volume" />
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
                    class="grid grid-cols-[5fr_2fr] gap-2 p-2 flex-auto">
                    <ExprInput
                        v-if="['openBuyStopMarket', 'openBuyStopLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.stop" id="stop" />
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
                    class="grid grid-cols-[5fr_2fr] gap-2 p-2 flex-auto">
                    <ExprInput
                        v-if="['openBuyLimit', 'openBuyStopLimit', 'openSellLimit', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.entry" id="entry" />
                    <Select
                        v-if="['openBuyLimit', 'openBuyStopLimit', 'openSellLimit', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitEntry" :options="unitsEntry" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- SL -->
                <label
                    v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="sl">SL:</label>
                <div v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[5fr_2fr] gap-2 p-2 flex-auto">
                    <ExprInput
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.sl" id="sl" />
                    <Select
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitSL" :options="unitsEntry" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- TP -->
                <label
                    v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="tp">TP:</label>
                <div v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[5fr_2fr] gap-2 p-2 flex-auto">
                    <ExprInput
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.tp" id="tp" />
                    <Select
                        v-if="['openBuyMarket', 'openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellMarket', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                        v-model="r_currentNode.unitTP" :options="unitTP" optionLabel="name" optionValue="value"
                        placeholder="Đơn vị" class="flex-auto" />
                </div>

                <!-- Expired Time -->
                <label
                    v-if="['openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="font-semibold" for="expiredTime">Thời gian hủy lệnh:</label>
                <div v-if="['openBuyLimit', 'openBuyStopMarket', 'openBuyStopLimit', 'openSellLimit', 'openSellStopMarket', 'openSellStopLimit'].includes(r_currentNode.type)"
                    class="grid grid-cols-[5fr_2fr] gap-2 p-2 flex-auto">
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
            <div class="flex p-3"></div>
            <div class="flex justify-end gap-2 p-2">
                <Button type="button" label="Hủy" severity="secondary" @click="r_visible = false"></Button>
                <Button type="button" label="Lưu" @click="applyNode"></Button>
            </div>
        </Dialog>

        <Dialog v-model:visible="r_apiDialogVisible" modal header="Cấu hình API" :style="{ width: '70%' }">
            <div class="flex flex-col gap-3 p-3">
                <label class="font-semibold">API Key:</label>
                <InputText v-model="r_apiKey" placeholder="Nhập API Key" autocomplete="off" />

                <label class="font-semibold">Secret Key:</label>
                <InputText v-model="r_secretKey" placeholder="Nhập Secret Key" autocomplete="off" type="password"/>

                <div class="flex items-center gap-2 mt-2">
                    <Checkbox v-model="r_enableRealOrder" :binary="true" inputId="realOrder" />
                    <label for="realOrder">Bật chế độ vào lệnh thật</label>
                </div>
            </div>
            <div class="flex justify-end gap-2 p-2">
                <Button type="button" label="Hủy" severity="secondary" @click="r_apiDialogVisible = false"></Button>
                <Button type="button" label="Lưu" @click="saveApiConfig"></Button>
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
    </div>
    <div id="cy" @contextmenu="openContextMenu"></div>
    <ContextMenu ref="menu" :model="items">
        <template #item="{ item, props }">

            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route()" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate" :target="item.target">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <span v-if="item.shortcut"
                        class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
                            item.shortcut }}</span>
                </a>
            </router-link>
            <a v-else v-ripple class="flex items-center" v-bind="props.action">
                <span :class="item.icon" /> 
                <span class="ml-2">{{ item.label }}</span>
                <span v-if="item.shortcut"
                    class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
                        item.shortcut }}</span>
            </a>
        </template>
    </ContextMenu>
</template>

<script lang="ts" src="./BotConfig.ts"></script>

<style scoped>
#cy {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
</style>