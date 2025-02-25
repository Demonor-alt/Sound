<template>
    <div class="language-selection">
        <h1>{{ title }}</h1>
        <div class="difficulty">
            <div
                class="diff"
                :class="{ is_active: activeDiff === 0 }"
                @click="setActiveDiff(0); title = '没问题，咱们从头开始！'; changeDifficulty(0);canToStep3=true"
            >
                <div class="signal0"></div>
                <h4>我是第一次学{{ language }}</h4>
            </div>
            <div
                class="diff"
                :class="{ is_active: activeDiff === 1 }"
                @click="setActiveDiff(1);title='好呀，那咱们拉起小手，一起进阶吧！';changeDifficulty(1);canToStep3=true"
            >
                <div class="signal1"></div>
                <h4>我知道一些常用词汇</h4>
            </div>
            <div
                class="diff"
                :class="{ is_active: activeDiff === 2 }"
                @click="setActiveDiff(2);title='好呀，那咱们拉起小手，一起进阶吧！';changeDifficulty(2);canToStep3=true"
            >
                <div class="signal2"></div>
                <h4>我能进行基础的对话</h4>
            </div>
            <div
                class="diff"
                :class="{ is_active: activeDiff === 3 }"
                @click="setActiveDiff(3);title='哦，你很棒诶！';changeDifficulty(3);canToStep3=true"
            >
                <div class="signal3"></div>
                <h4>我能谈论各种话题</h4>
            </div>
            <div
                class="diff"
                :class="{ is_active: activeDiff === 4 }"
                @click="setActiveDiff(4);title='哦，你很棒诶！';changeDifficulty(4);canToStep3=true"
            >
                <div class="signal4"></div>
                <h4>我能深聊大多数话题</h4>
            </div>
        </div>
        <div class="build">
            <el-button color="black" v-if="canToStep3===true" @click="toStep3">继续</el-button>
            <el-button color="black" disabled v-else>继续</el-button>
        </div>
    </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { showLanguage,changeDifficulty } = useLanguageStore();
const language = ref(showLanguage());
const title = ref("你的" + language.value + "怎么样");
const canToStep3 = ref(false);
const activeDiff = ref(null);

const setActiveDiff = (index) => {
    activeDiff.value = index;
};
const toStep3 = () => {
    router.push('/teach/step3');
}
</script>

<style scoped>
.language-selection {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5% 30%;
}

h1 {
    display: flex;
    justify-content: center;
}

.difficulty {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.diff {
    display: flex;
    align-items: center;
    gap: 25px;
    flex-direction: row;
    padding: 5px 20px;
    border-radius: 6px;
    border: #e4e4e7 1px solid;
    background-color: white;
    cursor: pointer;
}

.diff:hover {
    background-color: #f5f5f5;
}

.diff.is_active {
    border: 3px solid black;
}
.build {
  display: flex;
  justify-content: end;
  margin-top: 20px;
}


.signal0 {
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/signal0.svg') no-repeat center / contain;
}

.signal1 {
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/signal1.svg') no-repeat center / contain;
}

.signal2 {
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/signal2.svg') no-repeat center / contain;
}

.signal3 {
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/signal3.svg') no-repeat center / contain;
}

.signal4 {
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/signal4.svg') no-repeat center / contain;
}
</style>