<template>
    <div class="audio_right">
        <div class="gap">
            <img v-if="isPlaying === false" @click="startPlayback" class="audio_icon"
                :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }" src="../../assets/icons/close2.svg"
                alt="播放" />
            <img v-else @click="startPlayback" class="audio_icon"
                :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }" src="../../assets/icons/on.svg"
                alt="暂停" />

            <!-- 时间显示 -->
            <div class="audio_time">
                <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
            </div>

            <!-- 进度条 -->
            <el-slider v-model="progress" :show-tooltip="false" :max="100" @input="updateProgress"
                :disabled="!isPlaying" class="slider_box" :style="{ width: sliderLength + 'px' }" />

            <!-- 音量控制 -->
            <div class="volume">
                <div class="volume_progress" v-show="audioHuds">
                    <el-slider :show-tooltip="false" vertical height="100px" class="volume_bar" :max="1"
                        v-model="volume" step="0.01" @change="setVolume" />
                </div>
                <img class="volume_icon" v-if="volume <= 0" @click.stop="audioHuds = !audioHuds"
                    src="../../assets/icons/mute.svg" alt="" />
                <img class="volume_icon" v-if="volume > 0" @click.stop="audioHuds = !audioHuds"
                    src="../../assets/icons/speaker.svg" alt="" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Howl } from 'howler';
import { ref } from 'vue';
const props = defineProps({
    buttonSize: {
        type: String,
        default: '30'
    },
    sliderLength: {
        type: String,
        default: '520'
    },
    text: {
        type: String,
        default: '盐湖在干旱季节水分蒸发，盐分结晶析出，形成独特的盐滩景观，盐滩周边的特殊环境，为耐盐植物和卤虫等生物，提供了生存家园，说明自然的干湿变化，能创造特殊生态。'
    }
});
const isPlaying = ref(false);
const sound = ref(null);
const progress = ref(0);
const volume = ref(0.9);
const currentTime = ref(0);
const duration = ref('--');
const audioHuds = ref(false);

function formatTime(seconds) {
    if (seconds === '--') return '--';
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
}

function updateProgress() {
    if (sound.value) {
        sound.value.seek((progress.value / 100) * duration.value);
    }
}

function setVolume() {
    if (sound.value) {
        sound.value.volume(volume.value);  // 直接设置音量
    }
}

async function startPlayback() {
    // 如果音频正在播放且被点击暂停按钮
    if (isPlaying.value) {
        sound.value.pause();
        isPlaying.value = false;
        currentTime.value = 0;
        progress.value = 0;
        return; // 退出方法
    } else {
        isPlaying.value = true;
    }

    // 如果已存在音频并且是通过 Blob URL 加载的，直接播放或暂停
    if (sound.value && sound.value._src && sound.value._src.startsWith('blob:')) {
        console.log(isPlaying.value);
        if (isPlaying.value) {
            // 如果正在播放，则暂停
            sound.value.pause();
            isPlaying.value = false;
        } else {
            // 如果没有播放，则开始播放
            sound.value.play();
            isPlaying.value = true;
        }
        return;
    }

    // 设置为流式播放模式
    const formData = new FormData();
    formData.append('text', props.text);
    formData.append('text_lang', 'zh');
    formData.append('prompt_lang', 'zh');
    formData.append('streaming_mode', 'true');
    formData.append('ref_audio_path', "D://雷军.mp3");

    const queryParams = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        queryParams.append(key, value);
    }
    const apiUrl = `/api2/tts?${queryParams.toString()}`;

    // 创建流式音频
    sound.value = new Howl({
        src: [apiUrl],
        xhr: {
            method: 'GET',
        },
        html5: true,  // 使用 HTML5 Audio 来处理较大的文件
        volume: volume.value,
        format: ['wav'],
        onplay: () => {
            updateProgressInterval(); // 开始更新进度条
        },
        onload: () => {
            // 动态获取音频时长
            if (sound.value.duration() !== Infinity) {
                duration.value = sound.value.duration(); // 获取音频总时长
                console.log('音频总时长:', duration.value);
            }
        },
        onend: () => {
            isPlaying.value = false;
            duration.value = currentTime.value;
            currentTime.value = 0;
            progress.value = 0;
            // 播放完成后自动停止并清理
            sound.value.stop();
            console.log('1111', isPlaying.value);
        },
        onloaderror: (id, error) => {
            console.error('音频加载失败', error);
            isPlaying.value = false;
        }
    });

    // 通过流式播放开始音频
    sound.value.play();

    // 等待音频加载完成后创建 Blob
    sound.value.on('load', async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('音频加载失败');
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob); // 创建 Blob URL

            // 在加载完成后切换到 Blob URL（可以用来缓存音频以便后续播放）
            sound.value._src = audioUrl; // 更新音频源为 Blob URL
        } catch (error) {
            console.error('音频加载失败', error);
        }
    });
}

// 更新进度条
function updateProgressInterval() {
    const interval = setInterval(() => {
        if (sound.value && isPlaying.value) {
            // 获取当前时间
            currentTime.value = sound.value.seek();
            // 如果没有得到 duration，可以通过当前时间来动态估算进度
            if (duration.value === '--') {
                // 如果 duration 还没有被设置，可以根据当前时间来动态计算
                if (sound.value.duration() !== Infinity) {
                    duration.value = sound.value.duration(); // 获取音频总时长
                }
            }
            if (duration.value !== '--') {
                progress.value = (currentTime.value / duration.value) * 100;
            }
        } else {
            clearInterval(interval);
        }
    }, 500);
}

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
        background: black !important;
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