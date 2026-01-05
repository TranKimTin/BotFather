import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard/Dashboard.vue';
import BotConfig from '../components/BotConfig/BotConfig.vue';
import HistoryOrder from '../components/HistoryOrder/HistoryOrder.vue';
import Calculator from '../components/Calculator/Calculator.vue';
import Login from '../components/Login/Login.vue';
import Admin from '../components/Admin/Admin.vue';
import Guide from '../components/Guide/Guide.vue';
import Test from '../components/Test/Test.vue';
import Setting from '../components/Setting/Setting.vue';
import Backtest from '../components/Backtest/Backtest.vue';

const routes = [
    { path: '/', component: Dashboard },
    { path: '/bot', component: BotConfig },
    { path: '/history/:botName', component: HistoryOrder },
    { path: '/calculator', component: Calculator },
    { path: '/login', component: Login, meta: { layout: 'empty' } },
    { path: '/admin', component: Admin },
    { path: '/guide', component: Guide },
    { path: '/test/getOrders', component: Test },
    { path: '/settings', component: Setting },
    { path: '/payment', component: Calculator },
    { path: '/backtest', component: Backtest },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;