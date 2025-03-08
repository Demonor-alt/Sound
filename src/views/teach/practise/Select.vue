<template>
    <!-- 这里可以使用接收到的 data-item -->
    <div>
        <p>2222222{{ dataItem.title }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    dataItem: {
        type: Object,
        default: () => ({})
    }
});
</script>

<style scoped>
/* 子组件样式 */
</style>