<template>
    <el-row>
        <el-col :span="12">
            <div>
                <div>
                    <el-tabs v-model="activeName" class="demo-tabs">
                        <el-tab-pane label="录制音频" name="first">
                            <div class="audio-player">
                                <div class="wave-record">
                                    <div v-if="!recording" @click="startRecording" class="record">
                                        <div class="inRecord"></div>
                                        点击开始录制
                                    </div>
                                    <div v-else @click="stopRecording" class="record">
                                        <div class="noRecord"></div>
                                        停止录制
                                    </div>
                                    <div ref="waveformRef" class="waveform"></div>
                                </div>
                                <div style="font-size: small;color: #6b7280;margin-left: 20px;">
                                    *您可以使用自己的文本或下面的建议文本录制您的声音。</div>
                            </div>
                        </el-tab-pane>
                        <div class="audio-upload">
                            <el-row v-if="file !== undefined" :key="index" class="files">
                                <el-col :span="2" class="logo"></el-col>
                                <el-col :span="13" class="file">
                                    {{ file.name }}
                                    <div class="size">{{ file.size }}</div>
                                </el-col>
                                <el-col :span="4">{{ file.duration }}</el-col>
                                <el-col :span="4" class="btns">
                                    <div v-if="!file.isPlaying" class="close" @click="togglePlay()"></div>
                                    <div v-else class="on" @click="togglePlay()"></div>
                                    <el-icon @click="handleRemove()" class="delete-btn" size="25">
                                        <Close />
                                    </el-icon>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tabs>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import WaveSurfer from 'wavesurfer.js';
import { Close } from '@element-plus/icons-vue';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm'

// 初始化变量
const file = ref();
const recording = ref(false);
const record = ref(null);
const recordedUrl = ref();
const recordedBlobType = ref();
const wavesurfer = ref(null);  // 保存 wavesurfer 实例
const waveformRef = ref(null);  // 保存 div 的引用
const start = ref();
const end = ref();

// 创建 WaveSurfer 实例
const createWaveSurferInstance = () => {
    wavesurfer.value = WaveSurfer.create({
        container: waveformRef.value,
        waveColor: '#1cb0f6',
        progressColor: '#1cb0f6',
        height: 130,
        barWidth: 10,
        barRadius: 2,
        cursorWidth: 0,
    });
};

onMounted(() => {
    createWaveSurferInstance();  // 组件挂载时创建 WaveSurfer 实例
    record.value = wavesurfer.value.registerPlugin(
        RecordPlugin.create({
            scrollingWaveform: false,
        })
    )

    // 录音结束事件
    record.value.on('record-end', (blob) => {
        recordedUrl.value = URL.createObjectURL(blob)
        recordedBlobType.value = blob.type.split(';')[0].split('/')[1] || 'webm'

        createRecording(blob)
    })
});

// 录制音频
const startRecording = async () => {
    await record.value.startRecording();
    recording.value = true;
    start.value = new Date();  // 记录录音开始时间
};

const stopRecording = () => {
    if (record.value) {
        record.value.stopRecording();  // 使用 RecordPlugin 停止录音
        recording.value = false;
        end.value = new Date();  // 记录录音结束时间
    }
};

// 计算音频的时长
function calculateTimeDifferenceInSeconds(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const differenceInMillis = Math.abs(date2.getTime() - date1.getTime());
    const differenceInSeconds = Math.floor(differenceInMillis / 1000);
    return differenceInSeconds;
}

// 创建录音文件
const createRecording = async (blob) => {
    const formData = new FormData();
    const audioFile = new File([blob], "record.mp3", { type: "audio/mp3" });
    formData.append("files", audioFile);
    try {
        file.value = {
            name: `record.mp3`,
            url: URL.createObjectURL(blob),
            blob: blob,
            duration: `${calculateTimeDifferenceInSeconds(start.value, end.value)}s`,
            size: formatFileSize(blob.size),
            file: audioFile
        };
        // 用 WaveSurfer 渲染波形
        wavesurfer.value.load(file.value.url);
    } catch (error) {
        console.error("上传失败:", error);
    }
};

// 格式化文件大小
const formatFileSize = (bytes) => {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
};

// 播放音频
const audioInstance = ref(null);
const togglePlay = () => {
    const handleEnded = () => {
        file.value.isPlaying = false;
    };
    if (audioInstance.value) {
        audioInstance.value.pause();
        audioInstance.value.removeEventListener('ended', handleEnded);
    }
    audioInstance.value = new Audio(file.value.url);
    audioInstance.value.addEventListener('ended', handleEnded);
    if (file.value.isPlaying) {
        audioInstance.value.pause();
    } else {
        audioInstance.value.play();
    }
    file.value.isPlaying = !file.value.isPlaying;
};

// 删除文件
const handleRemove = () => {
    if (audioInstance.value) {
        audioInstance.value.pause();
        audioInstance.value.src = '';
    }
    file.value = undefined;
};

const activeName = ref('second');
</script>
<style scoped>
.close {
    width: 25px;
    height: 25px;
    background: url('../assets/icons/close.svg') no-repeat center / contain;
    cursor: pointer;
}

.on {
    width: 30px;
    height: 30px;
    background: url('../assets/icons/on.svg') no-repeat center / contain;
    cursor: pointer;
}
</style>
