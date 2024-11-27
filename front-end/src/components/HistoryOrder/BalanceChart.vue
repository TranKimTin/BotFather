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
import { onMounted, ref, watch } from 'vue';
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

interface PropData {
    timestamp: string,
    balance: number
}

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
        const data = ref({
            labels: props.data.map(item => item.timestamp),
            datasets: [
                {
                    label: 'Balance chart',
                    backgroundColor: '#FF9900',
                    borderColor: '#FF9900',
                    data: props.data.map(item => item.balance),
                    fill: false,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#FF9900'
                }
            ]
        });

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index', // Cho phép hover trên tất cả các điểm có cùng tọa độ dọc
                intersect: false // Đảm bảo không cần phải chạm vào chính xác điểm đó
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 10 // Giới hạn số lượng nhãn trên trục x
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        color: '#f87979', // Màu của nhãn trục y bên trái
                    },
                    grid: {
                        drawOnChartArea: false // Không vẽ lưới phía sau từ trục bên trái
                    }
                }
            }
        }

        watch(props, (newValue) => {
            console.log(newValue)
            data.value = {
                labels: newValue.data.map(item => item.timestamp),
                datasets: [
                    {
                        label: 'Balance chart',
                        backgroundColor: '#FF9900',
                        borderColor: '#FF9900',
                        data: newValue.data.map(item => item.balance),
                        fill: false,
                        pointRadius: 1,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#FF9900'
                    }
                ]
            }
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