<template>
    <div id="app">
        <div id="cy" style="width: 800px; height: 600px;"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import cytoscape, { Core } from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import axios from 'axios';
import Cookies from 'js-cookie';


cytoscape.use(edgehandles);

export default defineComponent({
    setup() {
        let cy: Core | null = null;
        const URL = 'http://103.82.25.144:8080';
        let botName = Cookies.get("botName") || '';

        onMounted(async () => {
            const symbolList = await axios.get(`${URL}/getSymbolList`);

            console.log(symbolList);
        });

        return {};
    }
});
</script>

<style>
#cy {
    border: 1px solid #ccc;
}
</style>