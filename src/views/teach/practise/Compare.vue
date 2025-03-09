<template>
    <h1>听音辩词</h1>
    <div class="content">
        <div>
            <div class="audioplay" @click="playAudio"></div>
            <audio ref="audioRef" :src="dataItem.audioURL" preload="auto"></audio>
        </div>
        <h4>你听到的词是？</h4>
        <div class="items">

                <div class="voice-item" :class="{ 'selected': selectedOption === dataItem.answer }"
                    @click="selectOption(selectedOption === dataItem.answer)"></div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
    dataItem: {
        type: Object,
        default: () => ({})
    }
});

const audioRef = ref(null);
const selectedOption = ref(null);

// 合并事件定义
const emits = defineEmits(['option-selected', 'clear-selection']);

const playAudio = () => {
    if (audioRef.value) {
        audioRef.value.play();
    }
};

const selectOption = (option) => {
    selectedOption.value = option;
    emits('option-selected', option);
};
// 新增：清空选择状态的方法
const clearSelection = () => {
    selectedOption.value = null;
};

// 新增：监听父组件的清空事件
onMounted(() => {
    const handleClearSelection = () => {
        clearSelection();
    };
    // 监听自定义事件
    window.addEventListener('clear-selection', handleClearSelection);
    onBeforeUnmount(() => {
        window.removeEventListener('clear-selection', handleClearSelection);
    });
});
</script>

<style scoped>
.items {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: end;
}

.audioplay {
    width: 30px;
    height: 30px;
    border-radius: 20px;
    background: url('../../../assets/icons/audioplay.svg') no-repeat center / contain;
    cursor: pointer;
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
}

.voice-item:hover {
    background-color: #f0f0f0;
}

.voice-item:active {
    border-bottom-width: 2px;
}

.selected {
    border-color: #84d8ff;
    background-color: #ddf4ff !important;
}

.content {
    margin-top: 12%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}
</style>
