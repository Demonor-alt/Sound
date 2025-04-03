<template>
    <h1>朗读下面的内容</h1>
    <div class="header">
        <div class="toaudio" @click="playAudio">
            <div class="audioplay"></div>
            <audio ref="audioRef" :src="dataItem.audioURL" preload="auto"></audio>
            <div>{{ dataItem.practiseWord }}</div>
        </div>
        <div class="myfont" v-if="isScore">{{ dataItem.score }}</div>
    </div>
    <div ref="waveformRef"></div>
    <div class="content">
        <div v-if="!isRecording" class="voice-item" style="cursor: pointer;"
            @click="startRecording">
            <div class="record"></div>
            点击并开始录音
        </div>
        <div v-else @click="stopRecording" class="voice-item">
            <div class="recordgray"></div>
            <div style="color: #b5b5b5;">点击并开始录音</div>
        </div>
        <el-dialog v-model="loadingDialogVisible" :show-close="false" width="25%" title="正在进行评分" align-center>
        <div style="margin: 20px;">
          <div class="loading-dots">
            <span class="dot dot1"></span>
            <span class="dot dot2"></span>
            <span class="dot dot3"></span>
          </div>
          <div style="display: flex;justify-content: center;margin: 10px;">正在分析音频</div>
        </div>
      </el-dialog>
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, onBeforeUnmount, onMounted, watch } from 'vue';

const props = defineProps({
    dataItem: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['option-selected']); // 定义事件
const audioRef = ref(null);
const playAudio = () => {
    if (audioRef.value) {
        audioRef.value.play();
    }
};
const isRecording = ref(false);

onMounted(() => {
    playAudio();
});
watch(() => props.dataItem, async () => {
    if (audioRef.value) {
        isScore.value = false;
        audioRef.value.src = props.dataItem.audioURL;
        try {
            await audioRef.value.load();
            await audioRef.value.play();
        } catch (error) {
            console.error('音频播放失败:', error);
        }
    }
}, { deep: true });
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm'
const isScore = ref(false);
// 响应式引用
const waveformRef = ref(null)
const wavesurfer = ref(null)
const record = ref(null)
const recordedUrl = ref('')
const recordedBlobType = ref('')

// 初始化波形图
onMounted(() => {
    wavesurfer.value = WaveSurfer.create({
        container: waveformRef.value,
        waveColor: '#1cb0f6',
        progressColor: '#1cb0f6',
        height: 130,
        barWidth: 10,
        barRadius: 2,
        cursorWidth: 0,
    })

    record.value = wavesurfer.value.registerPlugin(
        RecordPlugin.create({
            scrollingWaveform: false,
        })
    )

    // 录音结束事件
    record.value.on('record-end', (blob) => {
        recordedUrl.value = URL.createObjectURL(blob)
        recordedBlobType.value = blob.type.split(';')[0].split('/')[1] || 'webm'
    })
})

// 组件卸载前清理
onBeforeUnmount(() => {
    if (wavesurfer.value) {
        wavesurfer.value.destroy()
    }
})

// 开始录音
const startRecording = async () => {
    await record.value.startRecording();
    isRecording.value = true
}
const loadingDialogVisible = ref(false);
// 停止录音
const stopRecording = () => {
    record.value.stopRecording();
    isRecording.value = false;
    loadingDialogVisible.value = true;
    setTimeout(() => {
        loadingDialogVisible.value = false;
        isScore.value = true;
        emits('option-selected', true);
    },2000)
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
    margin: 40px;
}
.myfont{
    color: red;
    transform: skewX(-10deg); /* X轴倾斜角度（单位：deg）*/
    display: inline-block; /* 避免破坏父容器布局 */
    font-size: 35px;
    margin-left: 30px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    gap: 60px;
    height: 100px;
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

.recordgray {
    width: 30px;
    height: 30px;
    border-radius: 20px;
    background: url('../../../assets/icons/recordgray.svg') no-repeat center / contain;
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

.waveform {
    height: 58px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #000;
  border-radius: 50%;
  margin: 0 4px;
  animation: bounce 1.4s infinite ease-in-out both;
}

/* 为每个点设置不同的动画延迟 */
.dot1 {
  animation-delay: -0.32s;
}

.dot2 {
  animation-delay: -0.16s;
}

.dot3 {
  animation-delay: 0s;
}

/* 定义跳动动画 */
@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1.0);
  }
}
</style>
