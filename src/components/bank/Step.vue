<template>
    <!-- 步骤指示 -->
    <div class="steps">
        <div :class="['step', { active: props.currentStep === 1 }]">1</div>
        <div class="detail">
            <div class="title">步骤1</div>
            声音详情
        </div>
        <el-divider class="thick-divider" />
        <div :class="['step', { active: props.currentStep === 2 }]">2</div>
        <div class="detail">
            <div class="title">步骤2</div>
            示例音频
        </div>
    </div>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
    currentStep: Number
});
</script>
<style>
.steps {
    background-color: white;
    padding: 3%;
    border-radius: 10px;
    border: #e4e4e7 1px solid;
    display: flex;
    gap: 20px;
}

.step {
    width: 40px;
    height: 40px;
    background-color: #e5e8eb;
    color: #9ca3b0;
    border: 1px solid #d1d9e4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step.active {
    background: black;
    color: white;
}

.detail {
    width: 15%;
    display: flex;
    flex-direction: column;

    .title {
        color: #65759a;
        font-size: small;
    }
}

.thick-divider {
    width: 30%;
    border-top: 2px dotted #ccc;
}
</style>