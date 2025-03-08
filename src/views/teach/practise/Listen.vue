<template>
    <h1>你听到了什么?</h1>
    <div class="blueplay" @click="playAudio"></div>
    <audio ref="audioRef" :src="dataItem.audioURL" preload="auto"></audio>
    <div class="items">
        <div v-for="option in dataItem.options" :key="option">
            <div class="voice-item" :class="{ 'selected': selectedOption === option }" @click="selectOption(option)">{{ option }}</div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue';

const props = defineProps({
    dataItem: {
        type: Object,
        default: () => ({})
    }
});

const audioRef = ref(null);
const selectedOption = ref(null);
const emits = defineEmits(['option-selected']);

const playAudio = () => {
    if (audioRef.value) {
        audioRef.value.play();
    }
};

const selectOption = (option) => {
    selectedOption.value = option;
    emits('option-selected', option);
};
</script>

<style scoped>
.items{
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: end;
}
.blueplay {
    width: 130px;
    height: 130px;
    border-radius: 20px;
    background: url('../../../assets/icons/blueplay.svg') no-repeat center / contain;
    cursor: pointer;
}
.voice-item {
    margin: 10px;
    padding: 10px;
    border: 2px solid #e5e5e5;
    border-radius: 15px;
    width: 150px;
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
    background-color: #ddf4ff!important;
}
</style>
