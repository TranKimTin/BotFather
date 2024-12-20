import { defineComponent, ref } from 'vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import * as mToast from './toast/toast';

export default defineComponent({
  components: { Toast, ConfirmDialog },
  setup() {
    mToast.showInfo("Xin chào");

    const sidebarVisible = ref(true);
    const activeItem = ref('Home');

    const menuItems = [
      { label: 'Trang chủ', route: '/', icon: 'pi pi-home' },
      { label: 'Lịch sử lệnh', route: '/history', icon: 'pi pi-book' },
      { label: 'Máy tính', route: '/calculator', icon: 'pi pi-calculator' },
      { label: 'Thanh toán', route: '/contact', icon: 'pi pi-credit-card' },
      { label: 'Cài đặt', route: '/team', icon: 'pi pi-cog' },
    ];

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value;
    };

    const setActive = (item: string) => {
      activeItem.value = item;
    };

    return { sidebarVisible, menuItems, activeItem, toggleSidebar, setActive };
  },
});