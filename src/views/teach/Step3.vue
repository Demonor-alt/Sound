<template>
    <div class="language-selection">
        <h1>学好这门课程，你就能：</h1>
        <div class="items">
            <div class="speak"></div>
            <div class="item">
                <div style="font-weight: 600;">自信开口说外语</div>
                零压力，开心练习口语和节奏
            </div>
        </div>
        <div class="items">
            <div class="vocabulary"></div>
            <div class="item">
                <div style="font-weight: 600;">轻松提高词汇量</div>
                掌握日常高频词汇和实用短语
            </div>
        </div>
        <div class="items">
            <div class="watch"></div>
            <div class="item">
                <div style="font-weight: 600;">养成学习好习惯</div>
                有AI智能化提醒，各种好玩挑战和超多功能来助力
            </div>
        </div>
        <div class="build">
            <el-button color="black" @click="toMain">完成</el-button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const toMain = () => {
    router.push('/teach');
}
    
</script>

<style scoped>
.language-selection{
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    padding: 5% 35%;
    h1{
        display: flex;
        justify-content: center;
    }
}
.items{
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    padding: 10px;
    margin-top: 20px;
}
.speak{
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/speak.svg') no-repeat center / contain;
}
.vocabulary{
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/vocabulary.svg') no-repeat center / contain;
}
.watch{
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/watch.svg') no-repeat center / contain;
}
.build {
  display: flex;
  justify-content: end;
  margin-top: 25px;
}
</style>
