<template>
    <h1>听音辩词</h1>
    <div class="content">
        <div class="audiodisplay top-audiodisplay"  @click="playAudio">
            <div class="audioplay"></div>
            <div>{{ dataItem.options[0].practiseWord }}</div>
            <audio ref="audioRef" :src="dataItem.options[0].audioURL" preload="auto"></audio>
        </div>
        <div class="audiodisplay bottom-audiodisplay"  @click="playAudio">
            <div class="audioplay"></div>
            <div>{{ dataItem.options[1].practiseWord }}</div>
            <audio ref="audioRef" :src="dataItem.options[1].audioURL" preload="auto"></audio>
        </div>
    </div>
    <h4>你听到的词是？</h4>
    <div class="items">
        <div class="voice-item" :class="{ selected: selectedOption === 'same' }" @click="selectOption('same')">同一个词
        </div>
        <div class="voice-item" :class="{ selected: selectedOption === 'notsame' }" @click="selectOption('notsame')">
            两个不同的词</div>
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
    if (option === 'same') {
        emits('option-selected', true);
        return;
    }
    emits('option-selected', false);
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
    gap: 5px;
    align-items: end;
}

.audioplay {
    width: 30px;
    height: 30px;
    border-radius: 20px;
    background: url('../../../assets/icons/audioplay.svg') no-repeat center / contain;
}

.audiodisplay {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    cursor: pointer;
    padding: 20px 40px;
    border: 2px solid #e5e5e5;
}
.top-audiodisplay {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.bottom-audiodisplay {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.audiodisplay:hover {
    background-color: #f0f0f0;
}

.voice-item {
    margin: 10px;
    padding: 10px;
    border: 2px solid #e5e5e5;
    border-radius: 15px;
    width: 250px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-bottom-width: 4px;
    transition: border-bottom-width 0.1s;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
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
    margin-top: 4%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 5%;
}
</style>
