import { createRouter, createWebHistory } from 'vue-router';
import BotConfig from '../components/BotConfig/BotConfig.vue';
import HistoryOrder from '../components/HistoryOrder/HistoryOrder.vue';
import Calculator from '../components/Calculator/Calculator.vue';
import Login from '../components/Login/Login.vue';

const routes = [
    { path: '/', component: BotConfig },
    { path: '/history/:botName', component: HistoryOrder },
    { path: '/calculator', component: Calculator },
    { path: '/login', component: Login },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;