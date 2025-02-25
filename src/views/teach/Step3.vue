<template>
    <div class="language-selection">
        <h1>学好这门课程，你就能：</h1>
    </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language';
import { useRouter } from 'vue-router'
const router = useRouter()
const { changeMandarin, changeEnglish, changeCantonese } = useLanguageStore();
const changeMandarin1 = () => {
    changeMandarin();
    router.push('/teach/step2');
}
const changeEnglish1 = () => {
    changeEnglish();
    router.push('/teach/step2');
}
const changeCantonese1 = () => {
    changeCantonese();
    router.push('/teach/step2');
}
    
</script>

<style scoped>
.language-selection{
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5% 25%;
    h1{
        display: flex;
        justify-content: center;
    }
}
</style>
