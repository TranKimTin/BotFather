<template>
    <div class="alwaysOnTop">
        <div class="row">
            <div class="col-2"><b>Tên bot</b></div>
            <div class="col-2"><b>Telegram</b></div>
            <div class="col-2"><b>Khung thời gian</b></div>
            <div class="col-6">
                <button v-for="broker in brokerList" @click="toogleAllSymbol(broker)"
                    :title="r_symbolListSelected.filter((item: string) => item.startsWith(`${broker}:`)).length + ' / ' + r_symbolList.filter((item: string) => item.startsWith(`${broker}:`)).length">
                    <b>{{ r_symbolList.filter((item: string) =>
                        item.startsWith(`${broker}:`)).length
                        !== r_symbolListSelected.filter((item: string) => item.startsWith(`${broker}:`)).length ? '+' :
                        '-' }}</b>
                    {{ broker }}</button>
                <button @click="filterDuplicate()">Lọc trùng</button>
                <b> ({{ r_symbolListSelected.length }}/{{ r_symbolList.length }} coin)</b>
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

        <div class="justify-center">
            <button class="btn btn-outline-danger mr-1" @click="removeBot">Xóa bot</button>
            <button class="btn btn-outline-primary mr-1" @click="addNode">Thêm điều kiện</button>
            <button class="btn btn-outline-primary mr-1" @click="drawModeOn">Draw mode on</button>
            <button class="btn btn-outline-primary mr-1" @click="drawModeOff">Draw mode off</button>
            <button class="btn btn-outline-primary mr-1" @click="editNode">Sửa điều kiện</button>
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

.padding10 {
    padding: 10px;
}

.justify-center {
    display: flex;
    justify-content: center;
    z-index: 88888;
}
</style>