import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css';
import Aura from '@primevue/themes/aura';

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import MultiSelect from 'primevue/multiselect';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.mount('#app');