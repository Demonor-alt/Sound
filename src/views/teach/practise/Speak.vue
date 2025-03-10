<template>
    <h1>朗读下面的内容</h1>
    <div class="content">
        <div class="toaudio" @click="playAudio">
            <div class="audioplay"></div>
            <audio ref="audioRef" :src="dataItem.audioURL" preload="auto"></audio>
            <div>{{ dataItem.practiseWord }}</div>
        </div>
        <div v-if="!recording" class="voice-item" @click="startRecording">
            <div class="record"></div>
            点击并开始录音
        </div>
        <div v-else @click="stopRecording" class="voice-item">
            <div class="record"></div>
            停止录制
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, onBeforeUnmount, onMounted, watch } from 'vue';

const props = defineProps({
    dataItem: {
        type: Object,
        default: () => ({})
    }
}); const audioRef = ref(null);
const playAudio = () => {
    if (audioRef.value) {
        audioRef.value.play();
    }
};
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const start = ref();
const end = ref();
const recording = ref(false);
const files = ref([]);

const startRecording = async () => {
    start.value = new Date();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.value = new MediaRecorder(stream);
        audioChunks.value = [];
        mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.value.push(event.data);
            }
        };
        mediaRecorder.value.start();
        recording.value = true;
        mediaRecorder.value.onstop = () => {
            const audioBlob = new Blob(audioChunks.value, { type: "audio/mp3" });
            recording.value = false;
            stream.getTracks().forEach(track => track.stop());
            createRecording(audioBlob);
        };
    } catch (error) {
        console.error("获取音频流失败：", error);
    }
};

const stopRecording = () => {
    if (mediaRecorder.value) {
        mediaRecorder.value.stop();
        recording.value = false;
    }
};
import {createAudioloadService} from '@/api/teach'
const createRecording = async (blob) => {
    end.value = new Date();
    const newRecording = {
        name: `record-${files.value.length + 1}.mp3`,
        url: URL.createObjectURL(blob),
        blob: blob,
        file: new File([blob], `record-${files.value.length + 1}.mp3`, { type: 'audio/mp3' })
    };
    files.value.unshift(newRecording);

    // 发送请求
    try {
        const formData = new FormData();
        formData.append('audio', newRecording.file);
        let result = await createAudioloadService(formData);
        console.log('请求成功:', result);
    } catch (error) {
        console.error('请求失败:', error);
    }
};
</script>

<style scoped>
.content {
    margin-top: 12%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.toaudio {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 10px 30px;
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    width: 200px;
}

.audioplay {
    width: 30px;
    height: 30px;
    border-radius: 20px;
    background: url('../../../assets/icons/audioplay.svg') no-repeat center / contain;
}

.record {
    width: 30px;
    height: 30px;
    border-radius: 20px;
    background: url('../../../assets/icons/record.svg') no-repeat center / contain;
}

.voice-item {
    margin: 10px;
    padding: 20px;
    border: 2px solid #e5e5e5;
    border-radius: 15px;
    width: 80%;
    display: flex;
    flex-direction: row;
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
</style>
