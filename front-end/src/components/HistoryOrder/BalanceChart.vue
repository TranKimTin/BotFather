<template>
    <div class="balanceChart">
        <Line :data="data" :options="options" />
    </div>
</template>

<script lang="ts">
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { ref, watch } from 'vue';
import { Line } from 'vue-chartjs'
import type { PropData } from './HistoryOrder';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export default {
    name: 'BalanceChart',
    components: {
        Line
    },
    props: {
        data: {
            type: Array<PropData>,
            required: true,
            default: () => [],
        },
    },
    setup(props) {
        function getDataChart(data: Array<PropData>) {
            return {
                labels: data.map(item => item.timestamp),
                datasets: [
                    {
                        label: 'Balance',
                        backgroundColor: '#FF9900',
                        borderColor: '#FF9900',
                        data: data.map(item => item.balance),
                        fill: false,
                        pointRadius: 1,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#FF9900'
                    },
                    {
                        label: 'Balance no free',
                        backgroundColor: '#6699FF',
                        borderColor: '#6699FF',
                        data: data.map(item => item.balanceNoFee),
                        fill: false,
                        pointRadius: 1,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#6699FF'
                    }
                ]
            }
        }

        const data = ref(getDataChart(props.data));

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index" as "index", // Cho phép hover trên tất cả các điểm có cùng tọa độ dọc
                intersect: false // Đảm bảo không cần phải chạm vào chính xác điểm đó
            },
            plugins: {
                tooltip: {
                    mode: "index" as "index",
                    intersect: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 10 // Giới hạn số lượng nhãn trên trục x
                    }
                }
            }
        };

        watch(props, (newValue) => {
            console.log(newValue)
            data.value = getDataChart(newValue.data)
        });

        return { data, options };
    }
}
</script>

<style scoped>
.balanceChart {
    width: 100%;
    height: 40vh;
}
</style>