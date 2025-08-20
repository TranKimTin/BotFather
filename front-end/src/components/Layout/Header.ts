import { defineComponent, ref, onMounted } from 'vue';
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
        const dropdownOpen = ref(false);
        const r_balance = ref<number>(0);
        const address = '0x4d20bc4aa801b728340defcf78c1ddc9d2c087c7';

        function copyAddress() {
            navigator.clipboard.writeText(address);
            mToast.showSuccess(`Xin cảm ơn ❤️ ${address}`);
        }

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

        onMounted(() => {
            if (Cookies.get('token')) {
                axios.get('/getBalance').then(data => {
                    r_balance.value = data.balance + data.credit;
                });
            }
        });

        return { dropdownOpen, r_balance, logout, address, copyAddress };
    },
});