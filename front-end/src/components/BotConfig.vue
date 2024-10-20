<template>
    <div>
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
                <input v-model="r_botName" @keydown="getBotInfo" @change="getBotInfo" class="form-control" type="text"
                    placeholder="Nhập tên bot" />
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
            <button class="btn btn-outline-danger mr-1" id="removeBot">Xóa bot</button>
            <button class="btn btn-outline-primary mr-1" id="addNode">Thêm điều kiện</button>
            <button class="btn btn-outline-primary mr-1" id="draw-on">Draw mode on</button>
            <button class="btn btn-outline-primary mr-1" id="draw-off">Draw mode off</button>
            <button class="btn btn-outline-primary mr-1" id="editNode">Sửa điều kiện</button>
            <button class="btn btn-outline-danger mr-1" id="removeNode">Xóa</button>
            <button class="btn btn-outline-success mr-1" id="save">Lưu</button>
            <button class="btn btn-outline-info mr-1" data-toggle="modal" data-target="#instructionModal">Hướng
                dẫn</button>
        </div>
    </div>
    <div id="cy"></div>
</template>

<script lang="ts" src="./BotConfig.ts"></script>

<style scoped>
#cy {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}

.alwaysOnTop {
    position: absolute;
    z-index: 99999;
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