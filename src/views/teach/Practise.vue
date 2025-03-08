<template>
    <div class="header">
        <el-icon size="30" style="cursor: pointer;" @click="dialogVisible = true">
            <CloseBold />
        </el-icon>
        <el-slider v-model="value3" min="0" max="100" :step="1" :show-tooltip="false" :show-button="false"
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
        <div class="col" style="overflow-y: auto; max-height: 100vh;">
            <component :is="componentList[currentIndex]" :dataItem="data[dataIndex - 1]"
                @option-selected="handleOptionSelected"></component>
        </div>
        <el-button @click="toggleComponent" :disabled="isButtonDisabled">切换组件</el-button>
    </div>
    <el-divider />
    <div class="action-btns">
        <button class="skip-btn" @click="handleSkip">跳过</button>
        <button class="check-btn" @click="handleCheck">检查</button>
    </div>
</template>

<script setup>
import { CloseBold } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const value3 = ref(20);
const router = useRouter();
const dialogVisible = ref(false);
const toTeach = () => {
    router.push('/teach');
};
import Listen from './practise/Listen.vue'
import Select from './practise/Select.vue'
import Compare from './practise/Compare.vue'
import Speak from './practise/Speak.vue'
import audioUrl from '@/assets/sound.m4a';
const componentList = [Listen, Select, Compare, Speak]
const isButtonDisabled = ref(true);
const currentIndex = ref(0)
const data = ref([
    {
        title: 'listen',
        type: 'listen',
        audioURL: audioUrl,
        options: [
            '1', '2'
        ]
    },
    {
        title: 'select',
        type: 'select',
        audioURL: audioUrl,
        options: [
            '1', '2'
        ]
    },
])
const dataIndex = ref(1);

const toggleComponent = () => {
    if (dataIndex.value < data.value.length) {
        dataIndex.value++;
    } else {
        dataIndex.value = 1;
        currentIndex.value = (currentIndex.value + 1) % componentList.length
    }
}
const handleOptionSelected = (option) => {
    console.log('接收到来自 Listen 组件的选项:', option);
    // 当接收到值时，将按钮设置为可点击
    isButtonDisabled.value = false;
    // 这里可以添加你处理接收到的值的逻辑
};
</script>
<style scoped>
.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 1% 15%;
    gap: 20px;
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
    background-color: #09090b !important;
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
</style>