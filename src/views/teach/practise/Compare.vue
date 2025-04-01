<template>
    <h1>听音辩词</h1>
    <div class="content">
        <div class="audiodisplay top-audiodisplay" @click="playAudio(audioRef1)">
            <div class="audioplay"></div>
            <div v-if="shouldShowWord">{{ dataItem.options[0].practiseWord }}</div>
            <div v-else style="border-bottom: 2px solid #e5e5e5; width: 50%; position: relative; top: 20px;"></div>
            <audio ref="audioRef1" :src="dataItem.options[0].audioURL" preload="auto"></audio>
        </div>
        <div class="audiodisplay bottom-audiodisplay" @click="playAudio(audioRef2)">
            <div class="audioplay"></div>
            <div v-if="shouldShowWord">{{ dataItem.options[1].practiseWord }}</div>
            <div v-else style="border-bottom: 2px solid #e5e5e5; width: 50%; position: relative; top: 20px;"></div>
            <audio ref="audioRef2" :src="dataItem.options[1].audioURL" preload="auto"></audio>
        </div>
    </div>
    <h3>这两个人说的是…</h3>
    <div class="items">
        <div class="voice-item" :class="{ selected: selectedOption === 'true' }" @click="selectOption('true')">同一个词
        </div>
        <div class="voice-item" :class="{ selected: selectedOption === 'false' }" @click="selectOption('false')">
            两个不同的词</div>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
    dataItem: {
        type: Object,
        default: () => ({})
    },
    shouldShowWord: {
        type: Boolean,
        default: false
    }
});

// 修改为对 <audio> 元素的引用
const audioRef1 = ref(null);
const audioRef2 = ref(null);

const selectedOption = ref(null);

// 合并事件定义
const emits = defineEmits(['option-selected', 'clear-selection']);
console.log(props.dataItem);
const playAudio = (audio) => {
    if (audio.value) {
        audio.value.play();
    }
};

const selectOption = (option) => {
    selectedOption.value = option;
    if (JSON.parse(option) == props.dataItem.answer) {
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

    playAudio(audioRef1);
    audioRef1.value.addEventListener('ended', () => {
        setTimeout(() => {
            playAudio(audioRef2);
        }, 500);
    });

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
    width: 150px;
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
