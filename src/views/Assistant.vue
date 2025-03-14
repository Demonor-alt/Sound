<template>
    <div class="row">
        <div class="col2">
            <div v-if="addNewAudios">
                <h3>生成的音频</h3>
                <div class="audio-item">
                    <div class="audio-top">
                        <!-- ... existing code ... -->
                    </div>
                    <div class="divide"></div>
                    <!-- 移除默认控制条 -->
                    <video :src="addNewAudios.audioURL" width="300" style="border: 2px solid #000; border-radius: 10px;"></video>
                    <!-- 自定义控制条 -->
                    <div class="custom-controls">
                        <button @click="playVideo">播放</button>
                        <button @click="pauseVideo">暂停</button>
                        <button @click="downloadAudio(addNewAudios.audioURL)">下载</button>
                    </div>
                </div>
            </div>
            <h3>最新活动</h3>
            <div v-if="audios" v-for="audio in audios" :key="audio.audioId" class="audio-item">
                <div class="audio-top">
                    <!-- ... existing code ... -->
                </div>
                <div class="divide"></div>
                <!-- 移除默认控制条 -->
                <video :src="audio.audioURL" width="300" style="border: 2px solid #000; border-radius: 10px;"></video>
                <!-- 自定义控制条 -->
                <div class="custom-controls">
                    <button @click="playVideo(audio.audioURL)">播放</button>
                    <button @click="pauseVideo(audio.audioURL)">暂停</button>
                    <button @click="downloadAudio(audio.audioURL)">下载</button>
                </div>
            </div>
            <div v-else><el-empty description="暂无数据" /></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import video from '@/assets/video.mp4';

// 初始化 addNewAudios 数据
const addNewAudios = ref({
    voiceImage: 'your_voice_image_url',
    audioText: '这是生成音频的文本内容',
    voiceName: '张三',
    audioId: 1,
    audioURL: video
});

const showDontAgreeDialog = ref(false);
const reportOptions = ref([]); // 这里需要根据实际情况填充选项
const colorSelect = ref('');
const handleReportValue = (value) => {
    // 处理选择的值
};
const open = (audioId) => {
    // 处理分享逻辑
};
const downloadAudio = (audioURL) => {
    // 处理下载逻辑
};

// 播放视频函数
const playVideo = (url) => {
    const videoElement = document.querySelector(`video[src="${url}"]`);
    videoElement.play();
};

// 暂停视频函数
const pauseVideo = (url) => {
    const videoElement = document.querySelector(`video[src="${url}"]`);
    videoElement.pause();
};
</script>

<style scoped>
.custom-controls {
    margin-top: 10px;
}
.custom-controls button {
    margin-right: 10px;
}
</style>