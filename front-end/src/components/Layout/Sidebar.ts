import { defineComponent, ref, onMounted, watch } from 'vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import * as mToast from '../../toast/toast';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import * as axios from '../../axios/axios';

interface MenuItem {
    label: string,
    route: () => string,
    icon: string,
    hide?: boolean
}

export default defineComponent({
    components: { Toast, ConfirmDialog },
    setup() {
        const r_sidebarVisible = ref<boolean>(Cookies.get('sidebarVisible') !== 'false');
        const r_activeItem = ref<string>('Trang chủ');
        const user = JSON.parse(Cookies.get('user') || '{}');

        const r_menuItems = ref<Array<MenuItem>>([
            { label: 'Trang chủ', route: () => '/', icon: 'pi pi-home' },
            { label: 'Cấu hình bot', route: () => '/bot', icon: 'pi pi-cog' },
            { label: 'Lịch sử lệnh', route: () => `/history/${Cookies.get('botName')}`, icon: 'pi pi-history' },
            { label: 'Máy tính', route: () => '/calculator', icon: 'pi pi-calculator' },
            { label: 'Hướng dẫn', route: () => '/guide', icon: 'pi pi-calculator' },
            { label: 'Admin', route: () => '/admin', icon: 'pi pi-calculator', hide: user.role !== 'admin' }
        ]);
        const r_email = ref<string>('Bot Father');

        const router = useRouter();


        const toggleSidebar = () => {
            r_sidebarVisible.value = !r_sidebarVisible.value;
            Cookies.set('sidebarVisible', r_sidebarVisible.value ? 'true' : 'false');
        };

        const setActive = (item: MenuItem) => {
            const user = Cookies.get('user');
            if (user) {
                r_email.value = JSON.parse(user).email;
            }
            r_activeItem.value = item.label;
            router.push(item.route());
        };

        const logout = () => {
            axios.post('/logout').then(response => {
                Cookies.remove('token');
                Cookies.remove('user');
                mToast.showInfo('Đăng xuất thành công');
                router.push('/login');
            });
        }

        const unwatch = watch(router.currentRoute, (newValue) => {
            for (let item of r_menuItems.value) {
                if (newValue.fullPath.includes(item.route())) {
                    r_activeItem.value = item.label;
                }
                const user = Cookies.get('user');
                if (user) {
                    r_email.value = JSON.parse(user).email;
                }
            }
            unwatch();
        });

        onMounted(() => {
            mToast.init();
        });

        return { r_email, r_sidebarVisible, r_menuItems, r_activeItem, toggleSidebar, setActive };
    },
});