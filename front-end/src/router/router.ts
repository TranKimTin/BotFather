import { createRouter, createWebHistory } from 'vue-router';
import BotConfig from '../components/BotConfig.vue';
import HistoryOrder from '../components/HistoryOrder.vue';

const routes = [
    { path: '/', component: BotConfig },
    { path: '/history/:botName', component: HistoryOrder },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;