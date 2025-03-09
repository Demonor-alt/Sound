<template>
    <div class="main-container">
        <div class="header">
            <el-icon size="30" style="cursor: pointer;" @click="dialogVisible = true">
                <CloseBold />
            </el-icon>
            <el-slider v-model="percentage" min="0" max="100" :step="1" :show-tooltip="false" :show-button="false"
                size="large" />
            <el-dialog v-model="dialogVisible" width="30%" align-center :show-close="false">
                <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 10px;">退出练习</div>
                <div class="dialog">
                    退出后不会保留进度
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button color="#f4f4f5" plain style="color: black; border: #e4e4e7 1px solid; "
                            @click="dialogVisible = false">取消</el-button>
                        <el-button color="black" @click="dialogVisible = false; toTeach();">
                            确认
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
        <div class="demo-container">
            <div class="col" style="overflow-y: auto;">
                <component :is="componentList[currentIndex]" :dataItem="data[dataIndex - 1]"
                    @option-selected="handleOptionSelected"></component>
            </div>
        </div>
        <div class="divide" :style="{ backgroundColor: isAnswerCorrect === null ? '#e1e1e1' : isAnswerCorrect === 1?'#ccf2af':'red' }"></div>
        <div class="btn" v-if="isAnswerCorrect === null">
            <div class="voice-item" v-if="isButtonDisabled"
                :style="{ opacity: '0.5', cursor: 'not-allowed', 'border-bottom-width': '2px' }">
                检查
            </div>
            <div class="voice-item" v-else @click="toggleComponent" :style="{ 'border-color': '#57a500', 'background-color': '#52be02', color: 'white' }" >
                检查
            </div>
        </div>
        <div class="btn" v-if="isAnswerCorrect === 0">
            <div class="voice-item" @click="changeComponent" :style="{ 'border-color': '#57a500', color: '#52be02' }">
                继续111
            </div>
        </div>
        <div class="btn" v-if="isAnswerCorrect === 1" style="background-color:#ccf2af">
            <div style="display: flex;flex-direction: row;align-items: center;gap: 20px;">
                <el-icon color="#58a700" size="40" class="myicon" ><Select /></el-icon>
                <div style="color: #58a700;font-weight: 800;font-size: 25px;">你练得一副好听力，厉害呀！</div>
            </div>
            <div class="voice-item" @click="changeComponent"
                :style="{ 'border-color': '#57a500', 'background-color': '#52be02', color: 'white' }">
                继续
            </div>
        </div>
    </div>
</template>

<script setup>
import { CloseBold,Select } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/language';
const { difficulty } = useLanguageStore();
const percentage = ref(0);
const router = useRouter();
const dialogVisible = ref(false);
const toTeach = () => {
    router.push('/teach');
};
import MyListen from './practise/Listen.vue'
import MySelect from './practise/Select.vue'
import MyCompare from './practise/Compare.vue'
import MySpeak from './practise/Speak.vue'
import audioUrl from '@/assets/sound.m4a';
const componentList = [MyListen, MyCompare, MySelect, MySpeak]
const isButtonDisabled = ref(true);
const isAnswerCorrect = ref(null); //正确为1，错误为0
const currentIndex = ref(0)
const data = ref([
    {
        title: 'listen',
        type: 'listen',
        audioURL: audioUrl,
        options: [
            '1', '2'
        ],
        answer: '1'
    },
    {
        title: 'select',
        type: 'select',
        audioURL: audioUrl,
        options: [
            '3', '4'
        ],
        answer: '3'
    },
])
const dataIndex = ref(1);

const toggleComponent = () => {
    if (isCorrect.value) {
        isAnswerCorrect.value = 1;
    } else {
        isAnswerCorrect.value = 0;
    }
}
const changeComponent = () => {
    const event = new Event('clear-selection');
    window.dispatchEvent(event);
    if (dataIndex.value < data.value.length) {
        dataIndex.value++;
    } else {
        dataIndex.value = 1;
        currentIndex.value = (currentIndex.value + 1) % componentList.length
    }
    isButtonDisabled.value = true;
    if (difficulty === 0) {
        percentage.value += 100 / 12;
    } else if (difficulty === 1) {
        percentage.value += 100 / 16;
    } else if (difficulty === 2) {
        percentage.value += 100 / 20;
    } else if (difficulty === 3) {
        percentage.value += 100 / 24;
    } else {
        percentage.value += 100 / 28;
    }
    isAnswerCorrect.value = null;
}
const isCorrect = ref(false);
const handleOptionSelected = (option) => {
    console.log('接收到来自 Listen 组件的选项:', option);
    isButtonDisabled.value = false;
    const currentData = data.value[dataIndex.value - 1];
    if (option === currentData.answer) {
        isCorrect.value = true;
        console.log('正确');
    } else {
        console.log('错误');
    }
};
</script>
<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
}

.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 1% 15%;
    gap: 20px;
}

.demo-container {
    margin: 0 30%;
    height: 55vh;
}

::v-deep .el-slider__button {
    display: none !important;
}

::v-deep .el-slider__bar {
    background-color: #09090b !important;
}

::v-deep .el-slider__stop {
    background-color: #e5e8eb !important;
}

::v-deep .el-slider__runway {
    height: 10px !important;
    background-color: #e5e8eb !important;
}

::v-deep .el-slider__bar {
    height: 10px !important;
    background-color: #58cc02 !important;
}

.col::-webkit-scrollbar {
    width: 8px;
}

.col::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
}

.col::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

.divide {
    height: 2px;
    width: 100%;
}

.btn {
    display: flex;
    flex-direction: row;
    gap: 500px;
    align-items: end;
    justify-content: end;
    padding-right: 10%;
    padding-bottom: 40px;
    flex-grow: 0;
    height: 20.3vh;
    border-radius:6px;
    margin: -5px -20px -200px -20px; 
}
.myicon{
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
}
.voice-item {
    margin: 10px;
    padding: 10px;
    border: 2px solid #e5e5e5;
    border-radius: 15px;
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-bottom-width: 4px;
    transition: border-bottom-width 0.1s;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    font-weight: 600;
}

.voice-item:hover {
    background-color: #f0f0f0;
}

.voice-item:active {
    border-bottom-width: 2px;
}
</style>