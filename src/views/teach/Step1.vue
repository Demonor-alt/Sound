<template>
    <div class="language-selection">
        <h1>我想学...</h1>
        <div class="languages">
            <div class="lang" @click="changeMandarin">
                <div class="image1"></div>
                <h4>普通话</h4>
            </div>
            <div class="lang" @click="changeEnglish">
                <div class="image2"></div>
                <h4>英语</h4>
            </div>
            <div class="lang" @click="changeCantonese">
                <div class="image1"></div>
                <h4>粤语</h4>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language';
import { useRouter } from 'vue-router'
const router = useRouter()
const { changeLanguage } = useLanguageStore();
const changeMandarin = () => {
    changeLanguage('mandarin');
    router.push('/teach/step2');
}
const changeEnglish = () => {
    changeLanguage('english');
    router.push('/teach/step2');
}
const changeCantonese = () => {
    changeLanguage('cantonese');
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
.languages{
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.lang{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px 40px;
    border-radius: 6px;
    border: #e4e4e7 1px solid;
    background-color: white;
    cursor: pointer;
}
.lang:hover{
    background-color: #f5f5f5;
}
.image1{
    width: 75px;
    height: 75px;
    background: url('../../assets/pictures/chinese.png') no-repeat center / contain;
    border-radius: 20px;

}
.image2{
    width: 75px;
    height: 75px;
    background: url('../../assets/pictures/america.png') no-repeat center / contain;
    border-radius: 20px;

}
</style>
