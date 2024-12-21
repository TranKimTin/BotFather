<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Đăng nhập</h2>

            <form class="space-y-4" @submit.prevent="login">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" v-model="r_email" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="example@gmail.com" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input type="password" v-model="r_password" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="••••••••" />
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <span class="ml-2 text-sm text-gray-600">Nếu chưa có tài khoản sẽ tự tạo mới</span>
                    </label>
                    <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">Quên mật khẩu</a>
                </div>

                <button
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                    Đăng nhập
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" src="./Login.ts"></script>
