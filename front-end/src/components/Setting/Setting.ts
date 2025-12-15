import { defineComponent, ref, onMounted } from 'vue';
// import * as axios from '../../axios/axios';
import * as Toast from '../../toast/toast';

export default defineComponent({
    components: {},
    setup() {
        const testValue = ref<string>('');
        onMounted(() => {
        });

        return {testValue};
    },
});