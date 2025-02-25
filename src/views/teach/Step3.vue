<template>
    <div class="language-selection">
        <h1>学好这门课程，你就能：</h1>
        <div class="items">
            <div class="speak"></div>
            <div class="item">
                <h4>自信开口说外语</h4>
                零压力，开心练习口语和节奏
            </div>
        </div>
       
    </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language';
import { useRouter } from 'vue-router'
const router = useRouter()

    
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
.items{
    display: flex;
    flex-direction: row;
    gap: 10px;
}
.speak{
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/speaker.svg') no-repeat center / contain;
}
</style>
