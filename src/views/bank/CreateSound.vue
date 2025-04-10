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
                            <el-radio-group v-model="insertData.voiceType" size="large" text-color="black"
                                fill="#fafafa">
                                <el-radio-button label="公开" value="1" />
                                <el-radio-button label="私有" value="0" />
                            </el-radio-group>
                        </div>
                        <div v-if="insertData.voiceType === '1'" style="font-size: small; color: #6b748b;">
                            此语音模型将在发现页面中可见，每个人都可以看到。
                        </div>
                        <div v-else style="font-size: small; color: #6b748b;">此语音模型仅对创建者可见，不能共享且不会出现在发现页面。</div>
                    </div>
                    <div class="form-section">
                        封面图 (可选)
                        <div class="avatar">
                            <div class="upload-box">
                                <!-- <el-upload class="avatar-uploader" :show-file-list="false"
                                    action="/api1/common/upload" name="file" :on-success="uploadSuccess">
                                    <img v-if="insertData.voiceImage" :src="insertData.voiceImage" class="avatar" :auto-upload="false"/>
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload> -->
                                <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false"
                                    :on-change="handleChange">
                                    <img v-if="insertData.voiceImage" :src="insertData.voiceImage" class="avatar" />
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
                        <MyInput :message="insertData.voiceName" :placeholder="placeholderName" class="search-input"
                            :color="grayColor" @update:message="handleMessageName" />
                    </div>
                    <div class="form-section">
                        描述 (可选)
                        <MyInput :message="insertData.voiceDescription" :placeholder="placeholderDescription"
                            :color="grayColor" :type="type" @update:message="handleMessageDescription" />

                    </div>
                    <div class="form-section">
                        标签
                        <MyInput :message="insertData.voiceTag" :placeholder="placeholderTag" class="search-input"
                            :color="grayColor" @update:message="handleMessageTag" />
                    </div>
                    <div class="form-section">
                        语言
                        <MySelect :options="languageOptions" :input-width="'655px'" :color="'#fafafa'"
                            @update:value="handlelanguageValue" />
                    </div>
                </div>
                <div v-if="queryVoiceId === undefined">
                    <h3>输入音频</h3>
                    <el-tabs v-model="activeName" class="demo-tabs">
                        <el-tab-pane label="上传音频" name="second">
                            <div class="audio-upload">
                                <el-upload class="upload-component" accept="audio/*" :before-upload="handleFileUpload"
                                    :show-file-list="false" :on-remove="handleRemove" :limit="1">
                                    <template #default>
                                        <div class="upload-button">
                                            <div class="insert"></div>
                                            <h5>添加您的音频文件</h5>
                                        </div>
                                    </template>
                                </el-upload>
                            </div>
                        </el-tab-pane>
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
                                    <div ref="waveformRef" ></div>
                                </div>
                                <div style="font-size: small;color: #6b7280;margin-left: 20px;">
                                    *您可以使用自己的文本或下面的建议文本录制您的声音。</div>
                                <Store />
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
                    <div class="time-picker">
                        <div class="loadHeader">
                            已上传：{{ selectedTime }}s
                            <div v-if="selectedTime <= 50 && selectedTime >= 5" class="icon">
                                <el-icon size="20" color="#16a149">
                                    <CircleCheck />
                                </el-icon>
                                不错
                            </div>
                            <div v-if="selectedTime > 30" class="icon">
                                <el-icon size="20" color="#ef4343">
                                    <CircleClose />
                                </el-icon>
                                过长
                            </div>
                            <div v-if="selectedTime < 5 && selectedTime > 0" class="icon">
                                <el-icon size="20" color="#ef4343">
                                    <CircleClose />
                                </el-icon>
                                过短
                            </div>
                            <div v-if="selectedTime === 0" class="icon">
                                推荐 20 秒左右
                            </div>
                        </div>
                        <el-slider v-model="selectedTime" min="0" max="30" :step="1" show-stops :marks="marks"
                            :show-tooltip="false" :show-button="false" />
                        <div class="tip">*提示：最短5秒，最长30秒，推荐20秒</div>
                    </div>
                </div>
                <button v-if="queryVoiceId === undefined" class="next-btn" @click="createAction">创建</button>
                <div v-else class="btnssecond">
                    <button class="next-btn" @click="toStep2AndUpdate">保存</button>
                    <button class="skip" @click="toStep2">跳过</button>
                </div>
            </div>
        </el-col>
        <el-col :span="12" v-else>
            <h2>训练新声音</h2>
            <Step :currentStep="step" />
            <div>
                <h3>音频样本</h3>
                <div class="audio-container">
                    <!-- 样本列表 -->
                    <div v-for="(sample, index) in samples" :key="sample.sampleId" class="audio-card">
                        <div>
                            <div class="card-header">
                                <span style="font-weight: 600;">{{ sample.sampleTitle === '' ? "样本" + index :
                                    sample.sampleTitle
                                    }}</span>
                                <el-icon size="20" color="#606672" style="cursor: pointer;"
                                    @click="removeSample(index)">
                                    <Close />
                                </el-icon>
                            </div>
                        </div>
                        <div class="myinput">
                            <MyInput :message="sample.sampleTitle" :placeholder="placeholderName2"
                                @update:message="(newMessage) => handleMessageName2(index, newMessage)" />
                            <MyInput :message="sample.sampleText" :placeholder="placeholderTextArea" :type="type"
                                :rows="rows"
                                @update:message="(newMessage) => handleMessageTextArea(index, newMessage)" />
                            <el-button color="#e7e7e8" @click="generateSample(index)"
                                style="width: 16%;margin-left: 1%;">
                                <div class="make"></div>
                                生成样本
                            </el-button>
                            <StreamAudioPlayer :text="sample.sampleText" />
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
                        <button class="next-btn" v-if="queryVoiceId === undefined"
                            @click="toMyBankAndInsert">保存</button>
                        <button class="next-btn" v-else @click="toMyBankAndUpdate">保存</button>
                        <button class="skip" @click="toMyBank">跳过</button>
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
import StreamAudioPlayer from "@/components/newComponent/StreamAudioPlayer.vue";
import MySelect from '@/components/newComponent/Select.vue'
const placeholderName2 = ref("输入音频样本标题");
const placeholderTextArea = ref("输入音频样本文本")
const type = ref('textarea');
const grayColor = ref('#fafafa');
const placeholderDescription = ref('填写音频描述');
const rows = ref("3");
const samples = ref([{
    sampleId: '',
    sampleTitle: '',
    sampleText: '',
    sampleUrl: '',
    sampleIsPlaying: false,
}]);
const addSample = () => {
    samples.value.push({
        sampleTitle: '',
        sampleText: '',
        sampleUrl: '',
        sampleIsPlaying: false,
    });
};
const languageOptions = ref([
    { value: '1', label: '中文' },
    { value: '2', label: 'English' },
]);
const handlelanguageValue = (newValue) => {
    insertData.value.voiceLanguage = parseInt(newValue, 10);
};
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute();
const queryVoiceId = route.query ? route.query.id : undefined;
// 删除样本
const removeSample = (index) => {
    const sample = samples.value[index]
    if (sample.audio) {
        sample.audio.pause()
        sample.audio.currentTime = 0
    }
    samples.value.splice(index, 1)
}
function handleMessageName2(index, newMessage) {
    samples.value[index].sampleTitle = newMessage;
}
function handleMessageTextArea(index, newMessage) {
    samples.value[index].sampleText = newMessage;
}
const file = ref();
const recording = ref(false);
const record = ref(null);
const recordedUrl = ref();
const recordedBlobType = ref();
const wavesurfer = ref(null);  // 保存 wavesurfer 实例
const waveformRef = ref(null);  // 保存 div 的引用
const start = ref();
const end = ref();
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm'
// 创建 WaveSurfer 实例
const createWaveSurferInstance = () => {
    wavesurfer.value = WaveSurfer.create({
        container: waveformRef.value,
        waveColor: '#000000',
        progressColor: '#000000',
        height: 80,
        width:210,
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
        wavesurfer.value.load(file.value.url);
    } catch (error) {
        console.error("上传失败:", error);
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
//上传音频
const handleFileUpload = async (newFile) => {
    const audioUrl = URL.createObjectURL(newFile);
    const audio = new Audio(audioUrl);
    await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration;
            const formattedDuration = formatDuration(duration);
            file.value = {
                name: newFile.name,
                size: formatFileSize(newFile.size),
                duration: formattedDuration,
                isPlaying: false,
                url: audioUrl,
                file: newFile,
                actualDuration: duration
            };
            resolve();
        });
    });
    // const formData = new FormData();
    // formData.append("files", newFile);
    // try {
    //     let result = await voiceUploadService(formData);
    //     voiceUrl.value = result.data.voiceUrl;
    // } catch (error) {
    //     console.error("上传失败:", error);
    // }
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

// 修改删除文件方法
const handleRemove = () => {
    if (audioInstance.value) {
        audioInstance.value.pause()
        audioInstance.value.src = ''
    }
    file.value = undefined
}
const activeName = ref('second');
const toStep2 = () => {
    stepStore.incrementStep();
}
//声音长度总和
const selectedTime = computed(() => {
    if (file.value === undefined) {
        return 0;
    }
    const seconds = parseInt(file.value.duration.slice(0, -1), 10); // 移除末尾的's'并转换为整数
    return seconds;
});
//声音节点
const marks = computed(() => ({
    5: {
        style: { color: '#9ca3b3', fontSize: '17px' },
        label: '最小'
    },
    20: {
        style: { color: '#9ca3b3', fontSize: '17px' },
        label: '推荐'
    },
    30: {
        style: { color: '#9ca3b3', fontSize: '17px' },
        label: '最大'
    },
}));
import { ref, reactive, computed, onMounted } from 'vue';
const placeholderName = ref('填写声音名称');
const placeholderTag = ref('输入标签');
function handleMessageName(newMessage) {
    insertData.value.voiceName = newMessage;
}
function handleMessageDescription(newMessage) {
    insertData.value.voiceDescription = newMessage;
}
function handleMessageTag(newMessage) {
    insertData.value.voiceTag = newMessage;
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
const currentVoiceId = ref('');
const insertData = ref({
    voiceType: '1',
    voiceImage: '',
    voiceName: '',
    voiceDescription: '',
    voiceTag: '',
    voiceLanguage: 1,
});

const uploadSuccess = (result) => {
    // console.log(result);
    insertData.value.voiceImage = result.data.voiceImage;
}
const handleChange = () => {
    insertData.value.voiceImage = 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/cb1abdbd-987c-41f9-b374-ff85e46b92e7.png'
}
import { bankInsertService, bankInsertSamplesService, bankQueryDetailService, bankUpdateService, bankUpdateSamplesService, bankInsertMySampleService, uploadService } from '@/api/bank/mybank'

const sendAudiosToBackend = async () => {
    try {
        let result2 = await bankInsertService(insertData.value);
        currentVoiceId.value = result2.data.voiceId;
        samples.value = [{
            sampleId: '001',
            sampleTitle: '默认文本',
            sampleText: '盐湖在干旱季节水分蒸发，盐分结晶析出，形成独特的盐滩景观，盐滩周边的特殊环境，为耐盐植物和卤虫等生物，提供了生存家园，说明自然的干湿变化，能创造特殊生态。',
        }]

    } catch (error) {
        console.error('音频上传失败:', error);
    }
};
const createAction = async () => {
    // 发送音频数据到后端
    await sendAudiosToBackend();
    // 跳转逻辑
    stepStore.incrementStep();
};

const toMyBank = () => {
    router.push('/mybank');
    stepStore.reduceStep();
}
const toMyBankAndInsert = async () => {
    router.push('/mybank');
    stepStore.reduceStep();
    const addData = {
        voiceId: currentVoiceId.value,
        samples: samples.value
    }
    let result = await bankInsertSamplesService(addData);
}
const toMyBankAndUpdate = async () => {
    router.push('/mybank');
    stepStore.reduceStep();
    const newSamples = samples.value.slice(1);
    let result = await bankUpdateSamplesService(newSamples);
}
const generateSample = async (index) => {
    const createAudioData = {
        voiceId: currentVoiceId.value,
        sampleText: samples.value[index].sampleText,
    }
    // let result = await createAudioloadService(createAudioData);
    // samples.value[index].sampleUrl = result.data.sampleUrl;
};
onMounted(async () => {
    if (queryVoiceId !== undefined) {
        let result = await bankQueryDetailService(queryVoiceId);
        insertData.value = result.data;
        samples.value = result.data.voiceSamples;
    }
})
const toStep2AndUpdate = async () => {
    const updateData = {
        ...insertData,
        voiceId: currentVoiceId.value,
    }
    let result = await bankUpdateService(insertData.value);
    stepStore.incrementStep();
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
    width: 200px;
    height: 200px;
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
    background-color: #fafafa;
}

.avatar {
    width: 100%;
    height: auto;
    object-fit: contain;
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
    .wave-record{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-right: 5%;
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
    cursor: pointer;
}

.on {
    width: 30px;
    height: 30px;
    background: url('../../assets/icons/on.svg') no-repeat center / contain;
    cursor: pointer;
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