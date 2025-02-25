<template>111111</template>
<script setup>
import { useLanguageStore } from '@/stores/language';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
const { language } = useLanguageStore();
onMounted(()=> {
    if (language === '') {
        router.push('/teach/step1');
    }
})
</script>