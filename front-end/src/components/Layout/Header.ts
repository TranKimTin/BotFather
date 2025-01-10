import { defineComponent, ref, onMounted, watch } from 'vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import * as mToast from '../../toast/toast';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import * as axios from '../../axios/axios';

export default defineComponent({
    components: { Toast, ConfirmDialog },
    setup() {
        const router = useRouter();
        const dropdownOpen = ref(false)

        const logout = () => {
            axios.post('/logout').then(response => {
                Cookies.remove('token');
                Cookies.remove('user');
                mToast.showInfo('Đăng xuất thành công');
                setTimeout(() => {
                    router.push('/login');
                }, 500);
            });
        };

        return { dropdownOpen, logout };
    },
});