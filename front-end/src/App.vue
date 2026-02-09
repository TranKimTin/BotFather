<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const defaultLayout = 'default'

const { currentRoute } = useRouter()

const layout = computed(
    () => `${currentRoute.value.meta.layout || defaultLayout}-layout`,
)

onMounted(() => {
    document.addEventListener("keydown", function (d) {
        (d.key === "F12") && console.log("%cÁi chà, Anh/Chị nhấn F12 tính làm gì đấy!", "color: red; font-weight: bold; font-size: 25px; border-style: dashed; padding: 10px;")
    })
})

</script>

<template>
    <component :is="layout">
        <router-view />
    </component>
</template>
