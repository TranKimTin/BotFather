import { ref, defineComponent, onMounted } from "vue";
import * as Toast from '../../toast/toast';
import * as axios from "../../axios/axios";
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useRouter } from "vue-router";

export default defineComponent({
    components: {},
    setup() {
        const r_email = ref<string>('example@gmail.com');
        const r_password = ref<string>('123456');

        const router = useRouter();

        function login() {
            const email = r_email.value;
            const password = r_password.value;


            axios.post(`/login`, { email, password }).then(response => {
                let token = response.token;
                Cookies.set("token", token);
                let user = jwtDecode(token);
                Cookies.set('user', JSON.stringify(user));
                router.push('/');
            });
        }

        onMounted(() => {

        });

        return { r_email, r_password, login }
    },
});
