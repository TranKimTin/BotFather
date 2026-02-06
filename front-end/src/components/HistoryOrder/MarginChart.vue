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
import Heap from 'heap-js';
import moment from 'moment';
import type { MarginPropData } from './HistoryOrder';

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
            type: Array<MarginPropData>,
            required: true,
            default: () => [],
        },
    },
    setup(props) {
        function getDataChart(data: Array<MarginPropData>) {
            data.sort((a, b) => a.createdTime - b.createdTime); // time tăng dần
            data.push({
                createdTime: new Date().getTime(),
                matchTime: new Date().getTime(),
                volume: 0
            });

            const labels: Array<string> = [];
            const marginData: Array<number> = [];
            const cntOpeningOrders: Array<number> = [];
            const heap = new Heap((a: MarginPropData, b: MarginPropData) => a.matchTime - b.matchTime); // min heap
            let cnt = 0;

            let margin = 0;
            for (let i = 0; i < data.length; i++) {
                const order = data[i];

                while (!heap.isEmpty() && heap.peek()?.matchTime! <= order.createdTime) {
                    cnt--;
                    margin -= heap.peek()?.volume!;
                    const label = moment(heap.peek()?.matchTime!).format('YYYY-MM-DD HH:mm');
                    if (labels.length == 0 || label != labels[labels.length - 1]) {
                        labels.push(label);
                        marginData.push(margin);
                        cntOpeningOrders.push(cnt);
                    }
                    else {
                        marginData.pop();
                        marginData.push(margin);
                    }

                    heap.pop();
                }

                if (order.volume > 0) {
                    cnt++;
                    margin += order.volume;
                }
                heap.push(order);
                const label = moment(order.createdTime).format('YYYY-MM-DD HH:mm');
                if (labels.length == 0 || label != labels[labels.length - 1]) {
                    labels.push(label);
                    marginData.push(margin);
                    cntOpeningOrders.push(cnt);
                }
                else {
                    marginData.pop();
                    marginData.push(margin);
                }
            }

            const datasets = [
                {
                    label: 'Margin',
                    backgroundColor: '#8DD134',
                    borderColor: '#8DD134',
                    data: marginData,
                    fill: false,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#8DD134'
                },
                {
                    label: 'Số lệnh đang mở',
                    backgroundColor: '#FFA900',
                    borderColor: '#FFA900',
                    data: cntOpeningOrders,
                    fill: false,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#FFA900'
                }
            ];

            return { labels, datasets };
        }

        const data = ref(getDataChart([...props.data]));

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
            },
            animation: {
                duration: 0
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