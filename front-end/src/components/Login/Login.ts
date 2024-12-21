import { ref, defineComponent, onMounted } from "vue";
import * as Toast from '../../toast/toast';

export default defineComponent({
    components: {},
    setup() {
        const r_email = ref<string>('');
        const r_password = ref<string>('');

        function validateEmail(email: string) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        function login() {
            const email = r_email.value;
            const password = r_password.value;
            Toast.showInfo(email + password)
        }

        onMounted(() => {

        });

        return { r_email, r_password, login }
    },
});
