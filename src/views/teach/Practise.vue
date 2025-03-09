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
                <component :is="componentList[currentIndex]" :dataItem="data[dataIndex - 1]" :shouldShowWord="shouldShowWord"
                    @option-selected="handleOptionSelected"></component>
            </div>
        </div>
        <div class="divide"
            :style="{ backgroundColor: isAnswerCorrect === null ? '#e1e1e1' : isAnswerCorrect === 1 ? '#ccf2af' : '#ffdfe0' }">
        </div>
        <div class="btn" v-if="isAnswerCorrect === null">
            <div class="voice-item" v-if="isButtonDisabled"
                :style="{ opacity: '0.5', cursor: 'not-allowed', 'border-bottom-width': '2px' }">
                检查
            </div>
            <div class="voice-item" v-else @click="toggleComponent"
                :style="{ 'border-color': '#57a500', 'background-color': '#52be02', color: 'white' }">
                检查
            </div>
        </div>
        <div class="btn" v-if="isAnswerCorrect === 0" style="background-color:#ffdfe0">
            <div style="display: flex;flex-direction: row;align-items: center;gap: 20px;">
                <el-icon color="#ea2b2b" size="40" class="myicon">
                    <CloseBold />
                </el-icon>
                <div class="report">
                    <div style="color: #ea2b2b;font-weight: 800;font-size: 25px;">还不太准确，再多听几次吧！</div>
                    <div class="redbtn" @click="dialogErrorVisible = true">
                        <div class="flagred"></div>
                        报错
                    </div>
                    <el-dialog v-model="dialogErrorVisible" width="20%" align-center :show-close="false">
                        <div class="feedback-dialog">
                            <el-checkbox-group v-model="checkedErroeOptions" class="checkbox-group">
                                <el-checkbox v-for="option in errorOptions" :key="option.value" :label="option.label"
                                    class="checkbox-item" />
                            </el-checkbox-group>
                        </div>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button color="#f4f4f5" plain style="color: black; border: #e4e4e7 1px solid; "
                                    @click="dialogErrorVisible = false">取消</el-button>
                                <el-button color="black" @click="dialogErrorVisible = false; visiblePopover = false">
                                    确认
                                </el-button>
                            </span>
                        </template>
                    </el-dialog>
                </div>
            </div>
            <div class="voice-item" @click="changeComponent"
                :style="{ 'border-color': '#ea2b2b', 'background-color': '#ff4b4b', color: 'white' }">
                继续
            </div>
        </div>
        <div class="btn" v-if="isAnswerCorrect === 1" style="background-color:#ccf2af">
            <div style="display: flex;flex-direction: row;align-items: center;gap: 20px;">
                <el-icon color="#58a700" size="40" class="myicon"><Select /></el-icon>
                <div class="report">
                    <div style="color: #58a700;font-weight: 800;font-size: 25px;">你练得一副好听力，厉害呀！</div>
                    <div class="greenbtn" @click="dialogCorrectVisible = true">
                        <div class="flaggreen"></div>
                        报错
                    </div>
                    <el-dialog v-model="dialogCorrectVisible" width="20%" align-center :show-close="false">
                        <div class="feedback-dialog">
                            <el-checkbox-group v-model="checkedCorrectOptions" class="checkbox-group">
                                <el-checkbox v-for="option in correctOptions" :key="option.value" :label="option.label"
                                    class="checkbox-item" />
                            </el-checkbox-group>
                        </div>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button color="#f4f4f5" plain style="color: black; border: #e4e4e7 1px solid; "
                                    @click="dialogCorrectVisible = false">取消</el-button>
                                <el-button color="black" @click="dialogCorrectVisible = false; visiblePopover = false">
                                    确认
                                </el-button>
                            </span>
                        </template>
                    </el-dialog>
                </div>
            </div>
            <div class="voice-item" @click="changeComponent"
                :style="{ 'border-color': '#57a500', 'background-color': '#52be02', color: 'white' }">
                继续
            </div>
        </div>
    </div>
</template>

<script setup>
import { CloseBold, Select } from '@element-plus/icons-vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/language';
const { difficulty } = useLanguageStore();
const percentage = ref(0);
const router = useRouter();
const dialogVisible = ref(false);
const shouldShowWord = ref(false);
const toTeach = () => {
    router.push('/teach');
};
import MyListen from './practise/Listen.vue'
import MySelect from './practise/Select.vue'
import MyCompare from './practise/Compare.vue'
import MySpeak from './practise/Speak.vue'
import audioUrl from '@/assets/sound.m4a';
// const componentList = [MyListen, MyCompare, MySelect, MySpeak]
const componentList = [ MyCompare, MySelect, MySpeak]
const isButtonDisabled = ref(true);
const isAnswerCorrect = ref(null); //正确为1，错误为0
const currentIndex = ref(0);
const dialogCorrectVisible = ref(false);
const dialogErrorVisible = ref(false);
const correctOptions = reactive([
    { value: 1, label: '我的答案不应被接受' },
    { value: 2, label: '音频听起来不正确' },
    { value: 3, label: '缺少音频' },
    { value: 4, label: '其他问题' }
]);
const errorOptions = reactive([
    { value: 1, label: '应该接受我的答案' },
    { value: 2, label: '音频听起来不正确' },
    { value: 3, label: '缺少音频' },
    { value: 4, label: '其他问题' }
]);

const checkedCorrectOptions = ref([]);
const checkedErroeOptions = ref([]);
// const data = ref([
//     {
//         title: 'listen',
//         type: 'listen',
//         audioURL: audioUrl,
//         options: [
//             '1', '2'
//         ],
//         answer: '1'
//     },
//     {
//         title: 'select',
//         type: 'select',
//         audioURL: audioUrl,
//         options: [
//             '3', '4'
//         ],
//         answer: '3'
//     },
// ])
const data = ref([
    {
        options: [
            {
                practiseWord: '1',
                audioURL: audioUrl,
            },
            {
                practiseWord: '2',
                audioURL: audioUrl,
            },
        ],
        answer: true,//是否是同一个词
    },
    {
        options: [
            {
                practiseWord: '1',
                audioURL: audioUrl,
            },
            {
                practiseWord: '2',
                audioURL: audioUrl,
            },
        ],
        answer: true,
    },
])
const dataIndex = ref(1);

const toggleComponent = () => {
    if (isCorrect.value) {
        isAnswerCorrect.value = 1;
    } else {
        isAnswerCorrect.value = 0;
    }
    shouldShowWord.value = !shouldShowWord.value;
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
    shouldShowWord.value = !shouldShowWord.value;
}
const isCorrect = ref(false);
const handleOptionSelected = (option) => {
    isButtonDisabled.value = false;
    isCorrect.value = option;
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
    height: 60vh;
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
    height: 15.3vh;
    border-radius: 6px;
    margin: -5px -20px -200px -20px;
}

.myicon {
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

.report {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.greenbtn {
    display: flex;
    flex-direction: row;
    color: #7ec137;
    font-weight: 600;
    gap: 5px;
    cursor: pointer;
}

.greenbtn:hover {
    color: #58a700;
}

.redbtn {
    display: flex;
    flex-direction: row;
    color: #f06161;
    font-weight: 600;
    gap: 5px;
    cursor: pointer;
}

.redbtn:hover {
    color: #ea2b2b;
}

.flaggreen {
    width: 25px;
    height: 25px;
    background: url('../../assets/icons/flaggreen.svg') no-repeat center / contain;
    border-radius: 20px;
}

.flagred {
    width: 25px;
    height: 25px;
    background: url('../../assets/icons/flagred.svg') no-repeat center / contain;
    border-radius: 20px;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-left: 5%
}

.checkbox-item.is-checked {
    font-weight: bold;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: black;
    border-color: black;
}

::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: black;
}

::v-deep .el-checkbox__label {
    font-size: 17px;
}
</style>