import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';


const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');