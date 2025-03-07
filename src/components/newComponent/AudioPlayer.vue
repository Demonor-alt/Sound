<template>
    <div>
        <audio @timeupdate="updateProgress" controls ref="audioRef" style="display: none">
            <source :src="audioUrl" type="audio/mpeg" />
            您的浏览器不支持音频播放
        </audio>
        <div class="audio_right">
            <div class="gap">
                <img v-if="audioIsPlay" @click="playAudio" class="audio_icon" :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }" src="../../assets/icons/close2.svg"
                    alt="播放" />
                <img v-else @click="playAudio" class="audio_icon" :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }" src="../../assets/icons/on.svg"
                    alt="暂停" />
                <div class="audio_time">
                    <span>{{ audioStart }}</span>
                    &nbsp;/&nbsp;
                    <span>{{ durationTime }}</span>
                </div>
                <el-slider class="slider_box" v-model="currentProgress" :show-tooltip="false"
                    @input="handleProgressChange" :style="{ width: sliderLength + 'px' }" />
                <div class="volume">
                    <div class="volume_progress" v-show="audioHuds">
                        <el-slider show-tooltip="false" vertical height="100px" class="volume_bar" v-model="audioVolume"
                             @change="handleAudioVolume" />
                    </div>
                    <img class="volume_icon" v-if="audioVolume <= 0" @click.stop="audioHuds = !audioHuds"
                        src="../../assets/icons/mute.svg" alt="" />
                    <img class="volume_icon" v-if="audioVolume > 0" @click.stop="audioHuds = !audioHuds"
                        src="../../assets/icons/speaker.svg" alt="" />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
const props = defineProps({
    audioUrl: String,        // 试听的链接
    buttonSize: {
        type: String,
        default: '30'
    },
    sliderLength: {
        type: String,
        default: '420'
    }
});
const audioIsPlay = ref(true);
const audioStart = ref("0:00");
const durationTime = ref("0:00");
const duration = ref(0);
const audioVolume = ref(80);
const audioHuds = ref(false);
const audioRef = ref(null);
const currentProgress = ref(0);

watch(() => props.isPauseTtsAudio, (newVal, oldVal) => {
    if (newVal) {
        // 如果 isPauseTtsAudio 为 true，试听暂停
        handleCloseMusic();
    }
});
function handleCloseMusic() {
    audioRef.value.pause();
    audioIsPlay.value = true;
}
onMounted(() => {
    calculateDuration();
});
// 获取音频时长
function calculateDuration() {
    const myVid = audioRef.value;
    myVid.loop = false;
    myVid.src = props.audioUrl;
    
    myVid.addEventListener("ended", () => {
        audioIsPlay.value = true;
        currentProgress.value = 0;
    });
    
    if (myVid) {
        myVid.oncanplay = () => {
            duration.value = myVid.duration;
            durationTime.value = transTime(myVid.duration);
        };
        myVid.volume = 0.8;
        // 移除默认播放逻辑
    }
}

// 音频播放时间换算
function transTime(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedMinutes = String(minutes).padStart(2, "0"); //padStart(2,"0") 使用0填充使字符串长度达到2
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}
// 播放暂停控制
function playAudio() {
    if (audioRef.value.paused) {
        audioRef.value.play();
        audioIsPlay.value = false;
    } else {
        audioRef.value.pause();
        audioIsPlay.value = true;
    }
}
// 根据当前播放时间，实时更新进度条
function updateProgress(e) {
    var value = e.target.currentTime / e.target.duration;
    if (audioRef.value.play) {
        currentProgress.value = value * 100;
        audioStart.value = transTime(audioRef.value.currentTime);
    }
}
//调整播放进度
const handleProgressChange = (val) => {
    console.log(val);
    if (!val) {
        return;
    }
    let currentTime = duration.value * (val / 100);
    // 更新音频的当前播放时间
    audioRef.value.currentTime = currentTime;
};
//调整音量
const handleAudioVolume = (val) => {
    audioRef.value.volume = val / 100;
};
</script>

<style lang="scss" scoped>
.audio_right {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 0 10px;
    box-sizing: border-box;
    position: relative;

    .gap {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        justify-content: center;
    }

    .slider_box {
        height: 8px;
        border-radius: 5px;
        flex: 1;
        margin: 0 8px 4px;
    }

    .audio_icon {
        /* 移除固定的 width 和 height */
        margin-bottom: 4px;
        cursor: pointer;
    }

    .audio_time {
        color: black;
        overflow: hidden;
        font-size: 15px;
        bottom: 3px;
        left: 80px;
    }
}

.volume {
    position: relative;

    .volume_progress {
        width: 32px;
        height: 140px;
        position: absolute;
        top: -142px;
        right: -4px;
    }

    .volume_bar {
        background: #fff;
        border-radius: 4px;
    }

    .volume_icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
}
</style>
<style lang="scss">
.el-slider__button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.slider_box,
.volume_bar {
    .el-slider__button {
        width: 8px;
        height: 8px;
        border: none;
    }

    .el-slider__bar {
        background: black;
    }
}

.slider_box {
    .el-slider__button-wrapper {
        width: 8px;
    }
}

.volume_bar {
    .el-slider__runway {
        margin: 0 14px !important;
    }
}
</style>