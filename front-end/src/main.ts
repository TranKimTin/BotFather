import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import router from './router/router';
import VueCodemirror from 'vue-codemirror';
// import { minimalSetup, basicSetup } from 'codemirror';
import { closeBrackets } from '@codemirror/autocomplete';
import { history, historyKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(router);
app.use(VueCodemirror, {
    autofocus: false,
    disabled: false,
    indentWithTab: true,
    tabSize: 2,
    placeholder: 'Nhập biểu thức',
    extensions: [closeBrackets(), history(), keymap.of(historyKeymap)]
});

app.mount('#app');