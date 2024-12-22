import { ref, defineComponent, onMounted } from "vue";
import * as Toast from '../../toast/toast';
import axios from "axios";

export default defineComponent({
    components: {},
    setup() {
        const r_email = ref<string>('example@gmail.com');
        const r_password = ref<string>('123456');

        function login() {
            const email = r_email.value;
            const password = r_password.value;


            axios.post(`/api/login`, { email, password }).then(response => {
                console.log(response);
            });
        }

        onMounted(() => {

        });

        return { r_email, r_password, login }
    },
});
