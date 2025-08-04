<template>
    <div>
        <div class="mt-4">
            <div class="flex flex-wrap -mx-6">
                <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
                    <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                        <div class="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
                            <svg class="svg-icon" viewBox="0 0 20 20">
                                <polygon fill="none"
                                    points="18.198,7.95 3.168,7.95 3.168,8.634 9.317,9.727 9.317,19.564 12.05,19.564 12.05,9.727 18.198,8.634 ">
                                </polygon>
                                <path fill="none"
                                    d="M2.485,10.057v-3.41H2.473l0.012-4.845h1.366c0.378,0,0.683-0.306,0.683-0.683c0-0.378-0.306-0.683-0.683-0.683H1.119c-0.378,0-0.683,0.306-0.683,0.683c0,0.378,0.306,0.683,0.683,0.683h0.683v4.845C1.406,6.788,1.119,7.163,1.119,7.609v2.733c0,0.566,0.459,1.025,1.025,1.025c0.053,0,0.105-0.008,0.157-0.016l-0.499,5.481l5.9,2.733h0.931C8.634,13.266,5.234,10.458,2.485,10.057z">
                                </path>
                                <path fill="none"
                                    d="M18.169,6.584c-0.303-3.896-3.202-6.149-7.486-6.149c-4.282,0-7.183,2.252-7.484,6.149H18.169z M15.463,3.187c0.024,0.351-0.103,0.709-0.394,0.977c-0.535,0.495-1.405,0.495-1.94,0c-0.29-0.268-0.418-0.626-0.394-0.977C13.513,3.827,14.683,3.827,15.463,3.187z">
                                </path>
                                <path fill="none"
                                    d="M18.887,10.056c-2.749,0.398-6.154,3.206-6.154,9.508h0.933l5.899-2.733L18.887,10.056z">
                                </path>
                            </svg>
                        </div>

                        <div class="mx-5">
                            <h4 class="text-2xl font-semibold text-gray-700">
                                {{ botList.length }}
                            </h4>
                            <div class="text-gray-500">
                                Số lượng bot
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                    <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                        <div class="p-3 bg-emerald-600 bg-opacity-75 rounded-full">
                            <svg class="svg-icon" viewBox="0 0 20 20">
                                <path fill="none"
                                    d="M4.423,9.141H3.565c-0.237,0-0.429,0.192-0.429,0.429s0.192,0.429,0.429,0.429h0.858c0.237,0,0.429-0.192,0.429-0.429S4.66,9.141,4.423,9.141 M6.997,16.861H6.139c-0.237,0-0.429,0.192-0.429,0.43s0.192,0.429,0.429,0.429h0.858c0.237,0,0.429-0.191,0.429-0.429S7.234,16.861,6.997,16.861 M4.423,16.861H3.565c-0.237,0-0.429,0.192-0.429,0.43s0.192,0.429,0.429,0.429h0.858c0.237,0,0.429-0.191,0.429-0.429S4.66,16.861,4.423,16.861M13.861,9.998h0.857c0.236,0,0.429-0.192,0.429-0.429s-0.192-0.429-0.429-0.429h-0.857c-0.237,0-0.43,0.192-0.43,0.429S13.624,9.998,13.861,9.998 M14.719,16.861h-0.857c-0.237,0-0.43,0.192-0.43,0.43s0.192,0.429,0.43,0.429h0.857c0.236,0,0.429-0.191,0.429-0.429S14.955,16.861,14.719,16.861 M15.576,13.001c-0.236,0-0.429,0.192-0.429,0.43c0,0.236,0.192,0.429,0.429,0.429c0.237,0,0.43-0.192,0.43-0.429C16.006,13.193,15.813,13.001,15.576,13.001 M6.997,9.141H6.139c-0.237,0-0.429,0.192-0.429,0.429s0.192,0.429,0.429,0.429h0.858c0.237,0,0.429-0.192,0.429-0.429S7.234,9.141,6.997,9.141M12.145,9.141h-0.857c-0.236,0-0.429,0.192-0.429,0.429s0.193,0.429,0.429,0.429h0.857c0.237,0,0.43-0.192,0.43-0.429S12.382,9.141,12.145,9.141 M17.722,10.856V7.424c0-0.948-0.769-1.716-1.716-1.716h-0.617l-1.038-3.873c-0.245-0.916-1.186-1.458-2.101-1.213L3.592,2.912C2.676,3.157,2.133,4.098,2.378,5.014l0.186,0.695H2.278c-0.947,0-1.716,0.768-1.716,1.716V17.72c0,0.947,0.769,1.716,1.716,1.716h13.728c0.947,0,1.716-0.769,1.716-1.716v-1.716c0.947,0,1.716-0.769,1.716-1.716v-1.716C19.438,11.624,18.669,10.856,17.722,10.856 M16.006,6.566c0.473,0,0.857,0.384,0.857,0.858v0.238c-0.253-0.146-0.544-0.238-0.857-0.238h-0.157l-0.229-0.858H16.006z M14.41,5.372l0.55,2.053H6.67L14.41,5.372z M3.814,3.741l8.657-2.29c0.458-0.123,0.928,0.149,1.051,0.607l0.222,0.828L3.43,5.621l-0.223-0.83C3.084,4.333,3.356,3.863,3.814,3.741M1.42,7.424c0-0.474,0.384-0.858,0.858-0.858h0.517l0.229,0.858H2.278c-0.314,0-0.605,0.091-0.858,0.238V7.424z M16.863,17.72c0,0.474-0.385,0.858-0.857,0.858H2.278c-0.474,0-0.858-0.385-0.858-0.858V9.141c0-0.474,0.384-0.858,0.858-0.858h13.728c0.473,0,0.857,0.384,0.857,0.858v1.715h-1.716c-0.947,0-1.716,0.768-1.716,1.716v1.716c0,0.947,0.769,1.716,1.716,1.716h1.716V17.72z M18.58,14.288c0,0.474-0.385,0.857-0.858,0.857h-2.574c-0.474,0-0.857-0.384-0.857-0.857v-1.716c0-0.474,0.384-0.858,0.857-0.858h2.574c0.474,0,0.858,0.385,0.858,0.858V14.288z M9.571,16.861H8.713c-0.237,0-0.429,0.192-0.429,0.43s0.192,0.429,0.429,0.429h0.858c0.236,0,0.429-0.191,0.429-0.429S9.808,16.861,9.571,16.861M12.145,16.861h-0.857c-0.236,0-0.429,0.192-0.429,0.43s0.193,0.429,0.429,0.429h0.857c0.237,0,0.43-0.191,0.43-0.429S12.382,16.861,12.145,16.861 M9.571,9.141H8.713c-0.237,0-0.429,0.192-0.429,0.429s0.192,0.429,0.429,0.429h0.858C9.808,9.998,10,9.806,10,9.569S9.808,9.141,9.571,9.141">
                                </path>
                            </svg>
                        </div>

                        <div class="mx-5">
                            <h4 class="text-2xl font-semibold"
                                :class="totalProfit >= 0 ? 'text-green-900' : 'text-red-900'">
                                {{ totalProfit.toLocaleString() }} $
                            </h4>
                            <div class="text-gray-500">
                                Tổng lợi nhuận
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                    <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                        <div class="p-3 bg-amber-600 bg-opacity-75 rounded-full">
                            <svg class="svg-icon" viewBox="0 0 20 20">
                                <path fill="none"
                                    d="M18.665,4.784H1.335c-0.479,0-0.866,0.388-0.866,0.866v8.665c0,0.479,0.388,0.866,0.866,0.866h17.33c0.479,0,0.866-0.388,0.866-0.866V5.65C19.531,5.172,19.144,4.784,18.665,4.784 M1.769,5.65c0.239,0,0.433,0.194,0.433,0.434S2.008,6.517,1.769,6.517c-0.24,0-0.434-0.193-0.434-0.433S1.529,5.65,1.769,5.65 M1.769,14.315c-0.24,0-0.434-0.194-0.434-0.434s0.194-0.433,0.434-0.433c0.239,0,0.433,0.193,0.433,0.433S2.008,14.315,1.769,14.315 M18.231,14.315c-0.239,0-0.433-0.194-0.433-0.434s0.193-0.433,0.433-0.433c0.24,0,0.434,0.193,0.434,0.433S18.472,14.315,18.231,14.315M18.665,12.662c-0.136-0.049-0.281-0.08-0.434-0.08c-0.718,0-1.3,0.583-1.3,1.3c0,0.152,0.031,0.298,0.08,0.434H2.989c0.048-0.136,0.08-0.281,0.08-0.434c0-0.717-0.583-1.3-1.3-1.3c-0.153,0-0.297,0.031-0.434,0.08V7.304c0.136,0.048,0.281,0.079,0.434,0.079c0.717,0,1.3-0.582,1.3-1.299c0-0.153-0.032-0.297-0.08-0.434h14.023c-0.049,0.136-0.08,0.281-0.08,0.434c0,0.718,0.582,1.299,1.3,1.299c0.152,0,0.298-0.031,0.434-0.079V12.662z M18.231,6.517c-0.239,0-0.433-0.193-0.433-0.433s0.193-0.434,0.433-0.434c0.24,0,0.434,0.194,0.434,0.434S18.472,6.517,18.231,6.517 M5.235,6.517H4.368c-0.24,0-0.433,0.194-0.433,0.433c0,0.24,0.193,0.433,0.433,0.433h0.867c0.239,0,0.433-0.193,0.433-0.433C5.668,6.711,5.474,6.517,5.235,6.517 M15.632,12.582h-0.866c-0.239,0-0.433,0.194-0.433,0.434s0.193,0.434,0.433,0.434h0.866c0.239,0,0.434-0.194,0.434-0.434S15.871,12.582,15.632,12.582 M10,6.517c-1.914,0-3.465,1.552-3.465,3.466c0,1.915,1.552,3.466,3.465,3.466c1.914,0,3.467-1.552,3.467-3.466C13.467,8.069,11.914,6.517,10,6.517 M11.795,9.474c-0.059,0.4-0.279,0.593-0.571,0.661c0.401,0.21,0.606,0.534,0.411,1.093c-0.241,0.694-0.815,0.753-1.579,0.607l-0.185,0.747L9.423,12.47l0.183-0.737c-0.116-0.028-0.234-0.06-0.356-0.093l-0.184,0.74l-0.447-0.111l0.185-0.749c-0.104-0.027-0.211-0.056-0.319-0.083l-0.582-0.146l0.222-0.516c0,0,0.33,0.088,0.325,0.082c0.127,0.032,0.183-0.051,0.205-0.107l0.292-1.18C8.964,9.573,8.98,9.578,8.995,9.581C8.978,9.573,8.961,9.569,8.949,9.566l0.208-0.842C9.163,8.627,9.13,8.507,8.949,8.461c0.006-0.004-0.325-0.082-0.325-0.082l0.119-0.48L9.36,8.054v0.002c0.092,0.023,0.188,0.045,0.285,0.067l0.184-0.74l0.447,0.113l-0.18,0.725c0.121,0.027,0.241,0.056,0.359,0.085l0.177-0.721l0.449,0.112l-0.184,0.74C11.464,8.634,11.876,8.928,11.795,9.474 M9.976,8.753L9.753,9.652c0.252,0.064,1.032,0.322,1.158-0.187C11.042,8.935,10.229,8.816,9.976,8.753 M9.641,10.106l-0.246,0.991c0.303,0.076,1.239,0.378,1.377-0.181C10.917,10.333,9.944,10.183,9.641,10.106">
                                </path>
                            </svg>
                        </div>

                        <div class="mx-5">
                            <h4 class="text-2xl font-semibold text-gray-700">
                                {{ totalCost.toLocaleString() }}đ
                            </h4>
                            <div class="text-gray-500">
                                Tổng chi phí
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8" />

        <div class="flex flex-col mt-8">
            <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div
                    class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th
                                    class="w-16 text-center px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">

                                </th>
                                <th
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Tên bot
                                </th>
                                <th
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Real / Demo
                                </th>
                                <th
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Số lệnh (đã đóng)
                                </th>
                                <th
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Số lệnh (đang mở)
                                </th>
                                <th
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Lãi / volume (đã đóng)
                                </th>
                                <th
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Lãi / volume (đang mở)
                                </th>
                                <th
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Tỉ lệ thắng
                                </th>
                                <th
                                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Chi phí / ngày
                                </th>
                                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50">
                                </th>
                            </tr>
                        </thead>

                        <tbody class="bg-white">
                            <tr v-for="(u, index) in botList" :key="index">
                                <td class="w-16 text-center px-6 py-4 border-b border-gray-200 whitespace-nowrap ">
                                    <div class="text-sm leading-5 text-gray-900">
                                        {{ index + 1 }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <div class="text-sm leading-5 text-gray-900">
                                        {{ u.botName }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <div class="text-sm leading-5 text-gray-900">
                                        {{ u.enableRealOrder == 1 ? "Real" : "Demo" }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <div class="text-sm leading-5 text-gray-900">
                                        {{ u.tradeCountClosed.toLocaleString() }}
                                    </div>
                                </td>

                                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <div class="text-sm leading-5 text-gray-900">
                                        {{ u.tradeCountOpening.toLocaleString() }}
                                    </div>
                                </td>

                                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <span class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full"
                                        :class="u.profit >= 0 ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'">{{
                                            u.profit.toLocaleString() }} </span> / {{ u.volumeClosed.toLocaleString() }} $
                                </td>

                                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <span class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full"
                                        :class="u.unrealizedProfit >= 0 ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'">{{
                                            u.unrealizedProfit.toLocaleString() }} </span> / {{ u.volumeOpening.toLocaleString() }} $
                                </td>

                                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                                    <span class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full">
                                        {{ u.winrate }} %
                                    </span>
                                </td>

                                <td
                                    class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                                    {{ u.cost.toLocaleString() }}đ
                                </td>

                                <td
                                    class="px-6 py-4 text-sm font-medium leading-5 border-b border-gray-200 whitespace-nowrap">
                                    <a :href="`/history/${u.botName}`" target="_blank" class="text-indigo-600 hover:text-indigo-900"><i
                                            class="pi pi-cog"></i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./Dashboard.ts"></script>

<style scoped>
.svg-icon {
    width: 2em;
    height: 2em;
}

.svg-icon path,
.svg-icon polygon,
.svg-icon rect {
    fill: white;
}

.svg-icon circle {
    stroke: white;
    stroke-width: 1;
}
</style>