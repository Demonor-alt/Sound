<template>
    <el-row>
        <el-col :span="12" v-if="step === 1">
            <h2>训练新声音</h2>
            <Step :currentStep="step" />
            <div>
                <h3>声音详情</h3>
                <div>
                    <div class="form-section">
                        类型
                        <div class="radio">
                            <el-radio-group v-model="formData.type" size="large" text-color="black" fill="#fafafa">
                                <el-radio-button label="公开" value="public" />
                                <el-radio-button label="私有" value="private" />
                            </el-radio-group>
                        </div>
                        <div v-if="formData.type === 'public'" style="font-size: small; color: #6b748b;">
                            此语音模型将在发现页面中可见，每个人都可以看到。
                        </div>
                        <div v-else style="font-size: small; color: #6b748b;">此语音模型仅对创建者可见，不能共享且不会出现在发现页面。</div>
                    </div>
                    <div class="form-section">
                        封面图 (可选)
                        <div class="avatar">
                            <div class="upload-box">
                                <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                                    action="/api/upload" name="file" :on-success="uploadSuccess">
                                    <img v-if="formData.cover" :src="formData.cover" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>
                            </div>
                            <h4>声音封面图片 (文件最大不超过 2MB)</h4>
                        </div>
                    </div>
                    <div class="form-section">
                        名称
                        <MyInput :message="formData.name" :placeholder="placeholderName" class="search-input" :color="grayColor"
                            @update:message="handleMessageName" />
                    </div>
                    <div class="form-section">
                        描述 (可选)
                        <MyInput :message="formData.description" :placeholder="placeholderDescription" :color="grayColor" :type="type"
                            @update:message="handleMessageDescription" />

                    </div>
                    <div class="form-section">
                        标签
                        <MyInput :message="formData.tags" :placeholder="placeholderTag" class="search-input" :color="grayColor"
                            @update:message="handleMessageTag" />
                    </div>
                </div>
                <h3>输入音频</h3>
                <el-tabs v-model="activeName" class="demo-tabs">
                    <el-tab-pane label="上传音频" name="second">
                        <div class="audio-upload">
                            <el-upload class="upload-component" accept="audio/*" :before-upload="handleFileUpload"
                                :file-list="files" :on-remove="handleRemove" :limit="1">
                                <template #default>
                                    <div class="upload-button">
                                        <div class="insert"></div>
                                        <h5>添加或删除您的音频文件</h5>
                                    </div>
                                </template>
                            </el-upload>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="录制音频" name="first">
                        <div class="audio-player">
                            <div v-if="!recording" @click="startRecording" class="record">
                                <div class="inRecord"></div>
                                点击开始录制
                            </div>
                            <div v-else @click="stopRecording" class="record">
                                <div class="noRecord"></div>
                                停止录制
                            </div>
                            <div style="font-size: small;color: #6b7280;">*您可以使用自己的文本或下面的建议文本录制您的声音。</div>
                            <Store />
                        </div>
                    </el-tab-pane>
                    <div class="audio-upload">
                        <el-row v-for="(file, index) in files" :key="index" class="files">
                            <el-col :span="2" class="logo"></el-col>
                            <el-col :span="13" class="file">
                                {{ file.name }}
                                <div class="size">{{ file.size }}</div>
                            </el-col>
                            <el-col :span="4">{{ file.duration }}</el-col>
                            <el-col :span="4" class="btns">
                                <div v-if="!file.isPlaying" class="close" @click="togglePlay(index)"></div>
                                <div v-else class="on" @click="togglePlay(index)"></div>
                                <el-icon @click="deleteFile(index)" class="delete-btn" size="25">
                                    <Close />
                                </el-icon>
                            </el-col>
                        </el-row>
                    </div>
                </el-tabs>
                <div class="time-picker">
                    <div class="loadHeader">
                        已上传：{{ selectedTime }}s
                        <div v-if="selectedTime <= 90 && selectedTime >= 10" class="icon">
                            <el-icon size="20" color="#16a149">
                                <CircleCheck />
                            </el-icon>
                            不错
                        </div>
                        <div v-if="selectedTime > 90 || selectedTime < 10 && selectedTime > 0" class="icon">
                            <el-icon size="20" color="#ef4343">
                                <CircleClose />
                            </el-icon>
                            过长/过短
                        </div>
                        <div v-if="selectedTime === 0" class="icon">
                            推荐 30 秒左右
                        </div>
                    </div>
                    <el-slider v-model="selectedTime" min="0" max="100" :step="1" show-stops :marks="marks"
                        :show-button="false" />
                    <div class="tip">*提示：最短10秒，最长90秒，推荐30秒</div>
                </div>
                <button class="next-btn" @click="createAction">创建</button>
            </div>
        </el-col>
        <el-col :span="12" v-else>
            <h2>训练新声音</h2>
            <Step :currentStep="step" />
            <div>
                <h3>音频样本</h3>
                <div class="audio-container">
                    <!-- 样本列表 -->
                    <div v-for="(sample, index) in samples" :key="sample.id" class="audio-card">
                        <div>
                            <div class="card-header">
                                <span style="font-weight: 600;">{{ sample.title === '' ? "样本" + sample.id : sample.title
                                }}</span>
                                <el-icon size="20" color="#606672" @click="removeSample(index)">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <div class="myinput">
                            <MyInput :message="sample.title" :placeholder="placeholderName2" 
                                @update:message="(newMessage) => handleMessageName2(index, newMessage)" />
                            <MyInput :message="sample.text" :placeholder="placeholderTextArea" :type="type"
                                :rows="rows"
                                @update:message="(newMessage) => handleMessageTextArea(index, newMessage)" />
                            <el-button color="#e7e7e8" @click="generateSample(index)"
                                style="width: 16%;margin-left: 1%;">
                                <div class="make"></div>
                                生成样本
                            </el-button>
                            <AudioPlayer :audioUrl="ttsAudioUrl" :isPauseTtsAudio="isPauseTtsAudio"></AudioPlayer>
                        </div>
                    </div>
                    <!-- 添加按钮 -->
                    <div class="add-button-container">
                        <button @click="addSample" class="add-btn">
                            <el-icon size="20" style="padding-right: 5px;">
                                <Plus />
                            </el-icon> <span style="font-size: large;">添加音频示例</span>
                        </button>
                    </div>
                    <div class="btnssecond">
                        <button class="next-btn" @click="toMyBank">保存</button>
                        <button class="skip">跳过</button>
                    </div>
                </div>
            </div>
        </el-col>
        <el-divider direction="vertical" style="height: auto;" />
        <el-col :span="11" class="reactivity">
            <Recent />
        </el-col>
    </el-row>
</template>

<script setup>
import Recent from "@/components/bank/Recent.vue";
import MyInput from "@/components/newComponent/Input.vue";
import AudioPlayer from "@/components/newComponent/AudioPlayer.vue";
const samples = reactive([]);
const nextId = ref(1);
const placeholderName2 = ref("输入音频样本标题");
const placeholderTextArea = ref("输入音频样本文本")
const type = ref('textarea');
const grayColor = ref('#f5f5f5');
const placeholderDescription = ref('填写音频描述');
const rows = ref("3");
import audioUrl from '@/assets/sound.m4a';
const ttsAudioUrl = ref(audioUrl);
const addSample = () => {
    samples.push({
        id: nextId.value++,
        title: '',
        text: '',
        audioUrl: '',
    });
};
const generateSample = (index) => {
    // 这里可以添加生成音频的逻辑
    console.log('生成样本:', samples[index]);
};
import { useRouter } from 'vue-router'
const router = useRouter()
const toMyBank = () => {
    router.push('/mybank');
    stepStore.reduceStep();
}
// 删除样本
const removeSample = (index) => {
    const sample = samples[index]
    if (sample.audio) {
        sample.audio.pause()
        sample.audio.currentTime = 0
    }
    samples.splice(index, 1)
}
function handleMessageName2(index, newMessage) {
    samples[index].title = newMessage;
}
function handleMessageTextArea(index, newMessage) {
    samples[index].text = newMessage;
}
const files = ref([]);
const recording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const start = ref();
const end = ref();
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
            audioBlob.value = audioBlob;
            recording.value = false;
            stream.getTracks().forEach(track => track.stop());
            createRecording(audioBlob);
        };
    } catch (error) {
        console.error("获取音频流失败：", error);
    }
};
function calculateTimeDifferenceInSeconds(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const differenceInMillis = Math.abs(date2.getTime() - date1.getTime());
    const differenceInSeconds = Math.floor(differenceInMillis / 1000);
    return differenceInSeconds;
}
const createRecording = (blob) => {
    end.value = new Date();
    const newRecording = {
        name: `record-${files.value.length + 1}.mp3`,
        url: URL.createObjectURL(blob),
        blob: blob,
        duration: `${calculateTimeDifferenceInSeconds(start.value, end.value)}s`,
    };
    files.value.unshift(newRecording);
};
const stopRecording = () => {
    if (mediaRecorder.value) {
        mediaRecorder.value.stop();
        recording.value = false;
    }
};
const formatFileSize = (bytes) => {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
};
const formatDuration = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) {
        return '未知';
    }
    return `${Math.floor(seconds)}s`;
};
const handleFileUpload = (file) => {
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        const formattedDuration = formatDuration(duration);
        const fileInfo = {
            name: file.name,
            size: formatFileSize(file.size),
            duration: formattedDuration,
            isPlaying: false,
            url: audioUrl,
        };
        files.value.push(fileInfo);
    });

    return false;
};
const audioInstances = reactive({});
const togglePlay = (index) => {
    const file = files.value[index]

    // 如果已有实例则复用
    if (!audioInstances[index]) {
        audioInstances[index] = new Audio(file.url)
    }

    const audio = audioInstances[index]

    if (file.isPlaying) {
        audio.pause()
    } else {
        // 暂停所有正在播放的音频
        Object.entries(audioInstances).forEach(([key, instance]) => {
            if (key != index && !instance.paused) {
                instance.pause()
                files.value[key].isPlaying = false
            }
        })
        audio.play()
    }

    // 更新播放状态
    file.isPlaying = !file.isPlaying

    // 添加播放结束监听
    audio.addEventListener('ended', () => {
        file.isPlaying = false
    })
}

// 修改删除文件方法
const deleteFile = (index) => {
    // 停止播放并释放资源
    if (audioInstances[index]) {
        audioInstances[index].pause()
        audioInstances[index].src = ''
        delete audioInstances[index]
    }
    files.value.splice(index, 1)
}

const handleRemove = (file, files) => {
    const index = files.value.findIndex((f) => f.name === file.name);
    if (index !== -1) {
        deleteFile(index);
    }
};
const isFocused = ref(false);
const activeName = ref('first');
const selectedTime = computed(() => {
    let totalSeconds = 0;
    for (const file of files.value) {
        const seconds = parseInt(file.duration.slice(0, -1), 10); // 移除末尾的's'并转换为整数
        totalSeconds += seconds;
    }
    return totalSeconds;
});
const marks = computed(() => ({
    10: {
        style: { color: '#9ca3b3', fontSize: '17px' },
        label: '最小'
    },
    30: {
        style: { color: '#9ca3b3', fontSize: '17px' },
        label: '推荐'
    },
    90: {
        style: { color: '#9ca3b3', fontSize: '17px' },
        label: '最大'
    },
}));
import { ref, reactive, computed } from 'vue';
const placeholderName = ref('填写声音名称');
const placeholderTag = ref('输入标签');
function handleMessageName(newMessage) {
    formData.value.name = newMessage;
}
function handleMessageDescription(newMessage){
    formData.value.description = newMessage;
}
function handleMessageTag(newMessage) {
    formData.value.tag = newMessage;
}
import {
    Plus,
    CircleCheck,
    CircleClose,
    Close,
} from '@element-plus/icons-vue';
import Step from '@/components/bank/Step.vue';
import Store from '@/components/bank/Store.vue';
import { useStepStore } from '@/stores/step';
import { storeToRefs } from 'pinia';
const stepStore = useStepStore()
const { step } = storeToRefs(stepStore);
const createAction = () => {
  // 清除所有录音记录
  files.value = []
  
  // 清除所有音频实例
  Object.keys(audioInstances).forEach(key => {
    audioInstances[key].pause()
    audioInstances[key].src = ''
  })
  Object.keys(audioInstances).forEach(key => {
  delete audioInstances[key];
});
  // 跳转逻辑
  stepStore.incrementStep()
}

const formData = reactive({
    type: 'public',
    cover: null,
    coverPreview: null,
    name: '',
    description: '',
    tags: '',
    quickTag: false
});

const uploadSuccess = (result) => {
    formData.value.image = result.data;
}


</script>

<style scoped>
.el-col {
    padding-top: 1.5%;
    padding-left: 3%;
    padding-right: 3%;
}

::v-deep .el-radio-button__inner {
    background-color: #e5e8eb;
    color: #9ca3b0;
    border: #e5e8eb;
}

::v-deep .el-radio-button__inner:hover {
    background-color: #e5e8eb;
    color: #9ca3b0;
    border: #e5e8eb;
}

:deep(.el-radio-button .el-radio-button__inner) {
    min-width: 43vh;
}

.radio {
    padding: 6px;
    width: 100%;
    background-color: #e5e8eb;
    display: flex;
    justify-content: space-between;
    border-radius: 6px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 24px;

    .avatar {
        display: flex;
        flex-direction: row;
        gap: 30px;
    }
}

.upload-box {
    background-color: #fafafa;
    width: 150px;
    height: 150px;
    border: 1px dashed #ccc;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
}

.avatar-uploader .el-upload {
    overflow: hidden;
    border: 2px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    text-align: center;
    background-color: #f5f5f5;
}

:deep(.el-tabs__active-bar) {
    background-color: #09090b !important;
    height: 2px;
}

:deep(.el-tabs__item) {
    color: #666;
    font-weight: 500;
    transition: all 0.3s;
}

:deep(.el-tabs__item.is-active) {
    color: #333;
    font-weight: bold;
}

:deep(.el-tabs__item:hover) {
    color: #444;
}

::v-deep .el-textarea__wrapper:focus-within {
    border: 2px solid black !important;
}

.time-picker {
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    margin-top: 5%;
    margin-bottom: 5%;

    .loadHeader {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .icon {
            display: flex;
            gap: 10px;
            align-items: center;
        }
    }

    .tip {
        margin-top: 20px;
        font-size: small;
        color: #6b7280;
    }
}

.demo-tabs {
    width: 100%;

    .audio-player {
        background-color: #fafafa;
        padding: 10px;
        border: #dcdfe6 1px solid;
        border-radius: 6px;
    }

    .record {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
    }

    .inRecord {
        width: 40px;
        height: 40px;
        background: url('../../assets/icons/recordclose.svg') no-repeat center / contain;
    }

    .noRecord {
        width: 40px;
        height: 40px;
        background: url('../../assets/icons/recordon.svg') no-repeat center / contain;
    }
}

::v-deep .el-slider__button {
    display: none !important;
}

::v-deep .el-slider__bar {
    background-color: #09090b !important;
}

::v-deep .el-slider__stop {
    background-color: #e5e8eb !important;
}

.next-btn {
    background: #09090b;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.audio-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    width: 96.5%;
    margin-right: 5.5%;
}

.upload-component {
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    padding: 10px;
    width: 100%;
    cursor: pointer;
}

.upload-button {
    display: flex;
    align-items: center;

    .insert {
        width: 20px;
        height: 20px;
        background: url('../../assets/icons/insert.svg') no-repeat center / contain;
        padding: 10px;
        background-color: #e5e8eb;
        margin: 10px;
    }
}

.upload-button i {
    font-size: 24px;
    margin-right: 8px;
}

.upload-button {
    display: flex;
    align-items: center;
    color: black !important;
}

.files {
    width: 103%;
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: #dcdfe6 1px solid;
    margin-top: 3%;
}

.btns {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.close {
    width: 25px;
    height: 25px;
    background: url('../../assets/icons/close.svg') no-repeat center / contain;
}

.on {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/on.svg') no-repeat center / contain;
}

.logo {
    width: 40px;
    height: 40px;
    background: url('../../assets/icons/file.svg') no-repeat center / contain;
}

.file {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .size {
        font-size: small;
        color: #6b7280;
    }
}

.delete-btn {
    cursor: pointer;
}



.audio-container {
    width: 100%;
    margin: 0 auto;
}

.audio-card {
    background-color: #ffffff;
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #EBEDF0;
    padding: 10px;
}

.myinput {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;

    .make {
        width: 20px;
        height: 20px;
        background: url('../../assets/icons/make.svg') no-repeat center / contain;
        padding-right: 15px;
    }
}

.add-button-container {
    border-top: 1px solid #eee;
    text-align: center;
}

.el-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.add-btn {
    width: 100%;
    padding: 12px;
    margin-bottom: 40px;
    background: #f5f5f5;
    border: 1px dashed black;
    border-radius: 8px;
    color: black;
    cursor: pointer;
}

.add-btn:hover {
    cursor: pointer;
}

audio {
    width: 100%;
    height: 50px;
}

.btnssecond {
    display: flex;
    flex-direction: row;
    gap: 20px;

    .skip {
        background: #f5f5f5;
        padding: 10px 20px;
        border: #e4e4e7 1px solid;
        border-radius: 4px;
        cursor: pointer;
    }
}
</style>