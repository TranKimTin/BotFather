import { defineComponent, ref, onMounted, watch } from 'vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import * as mToast from './toast/toast';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

interface MenuItem {
    label: string,
    route: () => string,
    icon: string
}

export default defineComponent({
    components: { Toast, ConfirmDialog },
    setup() {
        const sidebarVisible = ref<boolean>(Cookies.get('sidebarVisible') !== 'false');
        const activeItem = ref<string>('Trang chủ');
        const router = useRouter();

        const menuItems = ref<Array<MenuItem>>([
            { label: 'Trang chủ', route: () => '/', icon: 'pi pi-home' },
            { label: 'Lịch sử lệnh', route: () => `/history/${Cookies.get('botName')}`, icon: 'pi pi-history' },
            { label: 'Máy tính', route: () => '/calculator', icon: 'pi pi-calculator' },
            { label: 'Thanh toán', route: () => '/payment', icon: 'pi pi-credit-card' },
            { label: 'Cài đặt', route: () => '/setting', icon: 'pi pi-cog' },
        ]);

        const toggleSidebar = () => {
            sidebarVisible.value = !sidebarVisible.value;
            Cookies.set('sidebarVisible', sidebarVisible.value ? 'true' : 'false');
        };

        const setActive = (item: MenuItem) => {
            activeItem.value = item.label;
            router.push(item.route());
        };

        const unwatch = watch(router.currentRoute, (newValue) => {
            for (let item of menuItems.value) {
                if (newValue.fullPath.includes(item.route())) {
                    activeItem.value = item.label;
                }
            }
            unwatch();
        });

        onMounted(() => {
            mToast.init();
        });

        return { sidebarVisible, menuItems, activeItem, toggleSidebar, setActive };
    },
});