<template>
    <div class="row">
        <div class="col1">
            <h1>文本转语音</h1>
            <div class="input-section">
                <div class="text">您的文本</div>
                <MyInput :message="inputText" :placeholder="placeholderTextArea" :type="type" :maxlength="maxlength"
                    :rows="rows" :color="color1" @update:message="handleMessageTextArea" />
                <div class="counter">{{ inputText.length }}/500</div>
            </div>
            <div class="warning">
                <el-icon size="12">
                    <Memo />
                </el-icon>
                语言质量取决于模型，为获得最佳效果，请使用高质量模型，严禁合成政治、色情、赌博、毒品等违法违规内容。
            </div>
            <div class="voice-selection">
                <div class="text">语音声音</div>
                <div>没有模型? <el-button link @click="createNewSound">一分钟创建</el-button></div>
            </div>
            <div class="output-section" @click="visible = true" v-if="!voice">
                <div class="add"></div>
                <div style="font-weight: 600;">选择语音声音</div>
            </div>
            <div class="select-output-section" v-else>
                <el-row class="select-voice-item">
                    <el-col :span="4">
                        <el-image style="width: 80px; height: 80px;border-radius: 15px;" :src="voice.voiceImage"
                            fit="cover" />
                    </el-col>
                    <el-col :span="17">
                        <div class="select-voice-name">{{ voice.voiceName }}</div>
                        <div class="select-voice-detail">
                            <span class="display-detail"> {{ voice.userName }}</span>
                            <div class="mydot"></div>
                            <el-icon size="20" style="color: #6b7280;">
                                <Clock />
                            </el-icon>
                            <span class="display-detail">{{ timeDistance(voice.voiceCreationTime) }}</span>
                            <div class="mydot"></div>
                            <div class="tag1"> {{ voice.voiceLanguage }}</div>
                            <div class="tag2" v-if="voice.voiceTag !== ''" style="margin-left: 5px;"> {{ voice.voiceTag
                                }}
                            </div>
                        </div>
                        <div class="select-btns">
                            <div class="btns-plus">
                                <div class="button">
                                    <div class="likefill" v-if="voice.voiceIsLiked === 1" @click="toggleLike(voice)">
                                    </div>
                                    <div class="like" v-else @click="toggleLike(voice)">
                                    </div>
                                    <div class="number">
                                        {{ formatNumberWithK(voice.voiceLikeCount) }}
                                    </div>
                                </div>
                                <div class="button">
                                    <div class="unlikefill" v-if="voice.voiceIsLiked === 2"
                                        @click="toggleDislike(voice)"></div>
                                    <div class="unlike" v-else @click="toggleDislike(voice)"></div>
                                </div>
                                <div class="button">
                                    <el-icon size="20" color="#6b7280" style="cursor: pointer;"
                                        v-if="!voice.voiceIsCollected" @click="toggleCollect(voice)">
                                        <Star />
                                    </el-icon>
                                    <el-icon size="20" color="#6b7280" style="cursor: pointer;" v-else
                                        @click="toggleCollect(voice)">
                                        <StarFilled />
                                    </el-icon>
                                    <div class="number">
                                        {{ formatNumberWithK(voice.voiceCollectCount) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div style="display: flex;flex-direction: row;gap: 10px;">
                            <el-icon size="28" style="cursor: pointer;" @click="visible = true;">
                                <RefreshRight />
                            </el-icon>
                            <el-icon size="28" style="cursor: pointer;" @click="voice = ''">
                                <Close />
                            </el-icon>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <el-dialog v-model="visible" :show-close="false">
                <template #header="{ close, titleId, titleClass }">
                    <div class="my-header">
                        <div style="font-weight: 600;" :id="titleId" :class="titleClass">选择语音</div>
                        <el-icon style="cursor: pointer;" @click="close">
                            <Close />
                        </el-icon>
                    </div>
                </template>
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
                    <el-tab-pane label="探索" name="first">
                        <div class="action-sum">
                            <div style="width: 155px;">
                                <MyInput :message="nameValue" :placeholder="placeholder"
                                    @update:message="handleMessage" />
                            </div>
                            <div class="action-bar">
                                <span class="header-tip">排序</span>
                                <MySelect :options="sortOptions" :input-width="'155px'" :color="color"
                                    @update:value="handleSortValue" />
                                <span class="header-tip">语言</span>
                                <MySelect :options="languageOptions" :input-width="'155px'" :color="color"
                                    @update:value="handlelanguageValue" />
                                <el-popover placement="bottom" :width="250" :visible="visiblePopover">
                                    <template #reference>
                                        <el-button size="large" class="btn" @click="visiblePopover = !visiblePopover">
                                            <el-icon size="20" color="black">
                                                <Operation />
                                            </el-icon>
                                        </el-button> </template>
                                    <div class="content">
                                        <div class="content-header">
                                            <span style="font-size: large;font-weight: 600; color: black;">筛选</span>
                                        </div>
                                        <div>标签</div>
                                        <MySelectChange :options="tagOptions" :input-width="'200px'"
                                            @update:value="handletagValue" />
                                        <div style="display: flex;justify-content: center;">
                                            <el-button color="black" style="width: 95%;"
                                                @click="visiblePopover = false; tagValue = tagTemp">应用</el-button>
                                        </div>
                                    </div>
                                </el-popover>
                            </div>
                        </div>
                        <div style="max-height: 53vh;overflow-y: auto;">
                            <SoundItem :nameValue="nameValue" :sortValue="sortValue" :languageValue="languageValue"
                                :tagValue="tagValue" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="收藏" name="second">
                        <div style="max-height: 53vh;overflow-y: auto;">
                            <CollectSoundItem />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="我的语音" name="third">
                        <MyInput :message="nameValue" :placeholder="placeholder" class="action-bar"
                            @update:message="handleMessage" style="width: 20%;" />
                        <div style="max-height: 53vh;overflow-y: auto;">
                            <MySoundItem :nameValue="nameValue"></MySoundItem>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-dialog>
            <div class="advanced-settings">
                <div class="toggle-button" @click="toggle" :class="{ 'active': isExpanded }">
                    <span style="font-size: large;">高级设置</span>
                    <el-icon v-if="!isExpanded">
                        <ArrowDown />
                    </el-icon>
                    <el-icon v-else>
                        <ArrowUp />
                    </el-icon>
                </div>
                <transition name="expand" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave"
                    @leave="leave">
                    <div v-show="isExpanded" class="content-wrapper">
                        <div class="mode">
                            <div class="detail">
                                高品质模式
                                <span style="font-size: small;">生成更高品质的音频，但会增加延迟</span>
                            </div>
                            <el-switch v-model="mode" class="ml-2"
                                style="--el-switch-on-color: black; --el-switch-off-color: #e4e7ed" />
                        </div>
                        <div>
                            <div class="detail">
                                语速({{ speedPercentage.toFixed(1) }}x)
                                <span style="font-size: small;">基于参考音频的语速进行调整</span>
                            </div>
                            <div class="demo-progress">
                                <el-icon size="20" @click="decrease">
                                    <Minus />
                                </el-icon>
                                <el-slider v-model="speedPercentage" :min="0" :max="3" :show-tooltip="false" :step="0.1"
                                    style="margin-right: 10px;" />
                                <el-icon size="20" @click="increase">
                                    <Plus />
                                </el-icon>
                            </div>
                        </div>
                        <div>
                            <div class="detail">
                                音量({{ volumePercentage.toFixed(1) }})
                                <span style="font-size: small;">基于参考音频的音量进行调整</span>
                            </div>
                            <div class="demo-progress">
                                <el-icon size="20" @click="decrease2">
                                    <Minus />
                                </el-icon>
                                <el-slider v-model="volumePercentage" :min="0" :max="3" :show-tooltip="false"
                                    :step="0.1" style="margin-right: 10px;" />
                                <el-icon size="20" @click="increase2">
                                    <Plus />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="build">
                <el-button color="black" @click="addNewAudio">创建</el-button>
            </div>
            <el-dialog v-model="loadingDialogVisible" :show-close="false" width="25%" title="正在创建语言" align-center>
                <div style="margin: 20px;">
                    <div class="loading-dots">
                        <span class="dot dot1"></span>
                        <span class="dot dot2"></span>
                        <span class="dot dot3"></span>
                    </div>
                    <div style="display: flex;justify-content: center;margin: 10px;">正在分析文本</div>
                </div>
            </el-dialog>
        </div>
        <el-divider direction="vertical" style="height: auto;" />
        <div class="col2">
            <div v-if="addNewAudios">
                <h3>生成的音频</h3>
                <div class="audio-item">
                    <div class="audio-top">
                        <el-image :src="addNewAudios.voiceImage" style="width: 60px; height: 60px; border-radius: 15px;"
                            fit="cover" />
                        <div class="audio-content">
                            <div class="audio-info">
                                <div class="audio-text">{{ addNewAudios.audioText }}</div>
                                <div class="audio-name">
                                    <el-icon size="20">
                                        <User />
                                    </el-icon>
                                    {{ addNewAudios.voiceName }}
                                </div>
                            </div>
                            <div class="audio-actions">
                                <div class="dontagree" @click="showDontAgreeDialog = true"></div>
                                <el-dialog v-model="showDontAgreeDialog" width="30%" align-center :show-close="false">
                                    <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 20px;">
                                        音频质量反馈</div>
                                    <div class="dialog">
                                        反馈类型
                                        <MySelect :options="reportOptions" :input-width="'432px'" :color="colorSelect"
                                            @update:value="handleReportValue" style="margin-bottom: 10px;" />
                                    </div>
                                    <template #footer>
                                        <span class="dialog-footer">
                                            <el-button color="black" plain @click="showDontAgreeDialog = false;">
                                                取消
                                            </el-button>
                                            <el-button color="black" @click="showDontAgreeDialog = false;">
                                                确认
                                            </el-button>
                                        </span>
                                    </template>
                                </el-dialog>
                                <div class="share" @click="open(addNewAudios.audioId)"></div>
                                <div class="download" @click="downloadAudio(addNewAudios.audioURL)"></div>
                            </div>
                        </div>
                    </div>
                    <div class="divide"></div>
                    <AudioPlayer :audioUrl="addNewAudios.audioURL" :buttonSize="20" :sliderLength="300"></AudioPlayer>
                </div>
            </div>
            <h3>最新活动</h3>
            <div v-if="audios" v-for="audio in audios" :key="audio.audioId" class="audio-item">
                <div class="audio-top">
                    <el-image :src="audio.voiceImage" style="width: 60px; height: 60px; border-radius: 15px;"
                        fit="cover" />
                    <div class="audio-content">
                        <div class="audio-info">
                            <div class="audio-text">{{ audio.audioText }}</div>
                            <div class="audio-name">
                                <el-icon size="20">
                                    <User />
                                </el-icon>
                                {{ audio.voiceName }}
                            </div>
                        </div>
                        <div class="audio-actions">
                            <div class="dontagree" @click="showDontAgreeDialog = true"></div>
                            <el-dialog v-model="showDontAgreeDialog" width="30%" align-center :show-close="false">
                                <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 20px;">
                                    音频质量反馈</div>
                                <div class="dialog">
                                    反馈类型
                                    <MySelect :options="reportOptions" :input-width="'432px'" :color="colorSelect"
                                        @update:value="handleReportValue" style="margin-bottom: 10px;" />
                                </div>
                                <template #footer>
                                    <span class="dialog-footer">
                                        <el-button color="black" plain @click="showDontAgreeDialog = false;">
                                            取消
                                        </el-button>
                                        <el-button color="black" @click="showDontAgreeDialog = false;">
                                            确认
                                        </el-button>
                                    </span>
                                </template>
                            </el-dialog>
                            <div class="share" @click="open(audio.audioId)"></div>
                            <div class="download" @click="downloadAudio(audio.audioURL)"></div>
                        </div>
                    </div>
                </div>
                <div class="divide"></div>
                <AudioPlayer :audioUrl="audio.audioURL" :buttonSize="20" :sliderLength="300"></AudioPlayer>
            </div>
            <div v-else><el-empty description="暂无数据" />
            </div>
        </div>
    </div>

</template>

<script setup>
import SoundItem from '@/components/bank/SoundItem.vue';
import CollectSoundItem from '@/components/bank/CollectSoundItem.vue';
import MySoundItem from '@/components/bank/MySoundItem.vue';
import { ref, computed, watch, onMounted } from 'vue';
import AudioPlayer from "@/components/newComponent/AudioPlayer.vue";
import MyInput from "@/components/newComponent/Input.vue";
const placeholderTextArea = ref("输入您想生成的语音文本")
const type = ref('textarea');
const rows = ref("5");
const maxlength = ref("500");
const color1 = ref("#f5f5f5");
const inputText = ref('');
function handleMessageTextArea(newValue) {
    inputText.value = newValue;
}
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const currentId = ref('');
const route = useRoute();
const currentVoiceId = route.query ? route.query.id : undefined;
import audioUrl from '@/assets/sound.m4a';
watch(() => router.currentRoute.value.fullPath, (newPath, oldPath) => {
    const idMatch = newPath.match(/\?id=(\d+)/);
    if (idMatch) {
        currentId.value = idMatch[1];
    } else {
        currentId.value = '';
    }
    visible.value = false;
    queryById(currentId);
});
import { bankQueryDetailService } from '@/api/bank/mybank'
const queryById = async (id) => {
    let result = await bankQueryDetailService(id);
    voice.value = result.data;
}
onMounted(async () => {
    if (currentVoiceId) {
        queryById(currentVoiceId);
    }
})
const createNewSound = () => {
    router.push('/createbank')
}
import { timeDistance } from '@/hooks/time';
import { ElButton, ElDialog } from 'element-plus'
const activeName = ref('first');
const visible = ref(false)
import {
    Operation,
    Clock,
    Star,
    StarFilled,
    Close,
    Memo,
    RefreshRight,
    ArrowDown, ArrowUp, Minus, Plus, User
} from '@element-plus/icons-vue';
import MySelect from '@/components/newComponent/Select.vue'
const color = ref('#ffffff');
const sortOptions = ref([
    { value: '1', label: '推荐' },
    { value: '2', label: '最新' },
]);
const languageOptions = ref([
    { value: '1', label: '所有' },
    { value: 'ch', label: '汉语' },
    { value: 'en', label: 'English' },
]);
const reportOptions = ref([
    { value: '1', label: '暂无问题' },
    { value: '2', label: '音频存在截断' },
    { value: '3', label: '有多个人说话（音色跳变）' },
    { value: '4', label: '噪音' },
    { value: '5', label: '超长空白' },
    { value: '6', label: '声音太小/声音模糊' },
    { value: '7', label: '混响很大' },
    { value: '8', label: '吞字漏字错字' },
]);
const colorSelect = ref('#ffffff');
const reportType = ref();
const handleReportValue = (newValue) => {
    reportType.value = newValue;
};
const tagOptions = ref();
import { discoverTagService } from '@/api/bank/discover'
onMounted(async () => {
    let result = await discoverTagService();
    tagOptions.value = result.data;
})
const sortValue = ref('');
const languageValue = ref('1');
const tagValue = ref('');
const tagTemp = ref('');
const nameValue = ref('');
const handleTabClick = () => {
    sortValue.value = '';
    languageValue.value = '1';
    tagValue.value = '';
    nameValue.value = '';
};
const placeholder = ref('搜索声音...');
const handleSortValue = (newValue) => {
    sortValue.value = newValue;
};
const handlelanguageValue = (newValue) => {
    languageValue.value = newValue;
};
const handletagValue = (newValue) => {
    tagTemp.value = newValue;
    console.log(tagTemp.value);
};
function handleMessage(newMessage) {
    nameValue.value = newMessage;
}
import MySelectChange from '@/components/newComponent/SelectChange.vue'
const visiblePopover = ref(false);
const showDontAgreeDialog = ref(false);
// const voice = ref({
//     voiceId: 1,
//     userName: 'fc',
//     voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
//     voiceName: '55',
//     voiceDescription: '1212',
//     voiceCreationTime: new Date(2025, 1, 9, 19, 11),
//     voiceUseCount: 110000,
//     voiceShareCount: 11,
// });
const voice = ref();
// const audios = ref([{
//     audioId: 1,
//     voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
//     voiceName: '55',
//     audioText: '1232ssssssssss',
//     audioURL: audioUrl
// }]);
const audios = ref();
// const addNewAudios = ref({
//     audioId: 1,
//     voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
//     voiceName: '66',
//     audioText: '11111111111111111',
//     audioURL: audioUrl
// });
const addNewAudios = ref();
function formatNumberWithK(num) {
    if (typeof num !== 'number' || isNaN(num)) {
        return num;
    }
    const thousand = 1000;
    if (num >= thousand * 10) {
        return (num / thousand).toFixed(2) + 'K';
    }
    return num;
}
const isExpanded = ref(false);
const mode = ref(false)

const toggle = () => {
    isExpanded.value = !isExpanded.value;
};

const enter = (el) => {
    el.style.height = 'auto';
    const height = getComputedStyle(el).height;
    el.style.height = '0';
    setTimeout(() => {
        el.style.height = height;
    }, 10);
};

const afterEnter = (el) => {
    el.style.height = 'auto';
};

const beforeLeave = (el) => {
    el.style.height = getComputedStyle(el).height;
};

const leave = (el) => {
    setTimeout(() => {
        el.style.height = '0';
    }, 10);
};
const speedPercentage = ref(1.0);
const increase = () => {
    speedPercentage.value = Number((speedPercentage.value + 0.1).toFixed(1));
};
const decrease = () => {
    speedPercentage.value = Number((speedPercentage.value - 0.1).toFixed(1));
};
const volumePercentage = ref(1.0);
const increase2 = () => {
    volumePercentage.value = Number((volumePercentage.value + 0.1).toFixed(1));
};
const decrease2 = () => {
    volumePercentage.value = Number((volumePercentage.value - 0.1).toFixed(1));
};
const loadingDialogVisible = ref(false);
const addNewAudio = () => {
    loadingDialogVisible.value = true;
    const addData = {
        voiceId: voice.value.voiceId,
        audioText: inputText.value,
        audioMode: mode.value,
        audioSpeed: speedPercentage.value,
        audioVolume: volumePercentage.value,
    }
    setTimeout(async () => {
        let result = await audioInsertService(addData);
        addNewAudios.value = result.data;
        loadingDialogVisible.value = false;
        let resultplus = await audioUpdateUseService(token.token.userId, voice.value.voiceId);
    }, 2000);
}
import { ElNotification } from 'element-plus'
const open = (audioId) => {
    const currentUrl = window.location.href;
    const textToCopy = `${currentUrl}?id=${audioId}`;
    navigator.clipboard.writeText(textToCopy)
        .then(async () => {
            ElNotification({
                message: "已复制到剪贴板",
                position: 'bottom-right',
            });
        })
        .catch((error) => {
            ElNotification({
                message: `复制失败: ${error.message}`,
                position: 'bottom-right',
                type: 'error'
            });
        });
};

const downloadAudio = (audioUrl) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', audioUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
        if (xhr.status === 200) {
            const blob = new Blob([xhr.response], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'audio.mp3';
            a.click();
            URL.revokeObjectURL(url);
        }
    };
    xhr.send();
};
const toggleLike = async (voice) => {
    if (voice.voiceIsLiked === 1) {
        voice.voiceIsLiked = 0;
        voice.voiceLikeCount--;
    } else {
        if (voice.voiceIsLiked === 2) {
            voice.voiceIsUnliked = false;
        }
        voice.voiceIsLiked = 1;
        voice.voiceLikeCount++;
    }
    const editData = {
        voiceId: voice.voiceId,
        voiceLikeCount: voice.voiceLikeCount,
    }
    let result = await discoverUpdateLikeService(editData);
};
const toggleDislike = async (voice) => {
    if (voice.voiceIsLiked === 2) {
        // 当前是不喜欢状态，切换为中立
        voice.voiceIsLiked = 0;
        voice.voiceIsUnliked = false;
    } else {
        // 当前不是不喜欢状态
        if (voice.voiceIsLiked === 1) {
            voice.voiceLikeCount--;
            voice.voiceIsLiked = 0;
        }
        voice.voiceIsLiked = 2;
        voice.voiceIsUnliked = true;
    }
    const editData = {
        voiceId: voice.voiceId,
        voiceLikeCount: voice.voiceLikeCount,
    }
    let result = await discoverUpdateLikeService(editData);
};
const toggleCollect = async (voice) => {
    voice.voiceIsCollected = !voice.voiceIsCollected;
    if (voice.voiceIsCollected) {
        voice.voiceCollectCount++;
    } else {
        voice.voiceCollectCount--;
    }
    const editData = {
        voiceId: voice.voiceId,
        voiceCollectCount: voice.voiceCollectCount,
    }
    let result = await discoverUpdateCollectService(editData);
};
import { audioQueryService, audioInsertService,audioUpdateUseService } from '@/api/explanation'
import { useTokenStore } from '@/stores/token';
const token = useTokenStore();
onMounted(async () => {
    let result = await audioQueryService(token.token.userId);
    audios.value = result.data;
})
</script>

<style scoped>
.dontagree {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: url('../assets/icons/dontagree.svg') no-repeat center / contain;
}

.share {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: url('../assets/icons/share.svg') no-repeat center / contain;
}

.download {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: url('../assets/icons/download.svg') no-repeat center / contain;
}

.row {
    display: flex;
    flex-direction: row;
}

.col1 {
    margin: 0 3%;
    width: 44%;
}

.col2 {
    margin: 1% 8%;
    width: 34%;
}

.text {
    font-size: large;
    padding-bottom: 15px;
    margin-top: 10px;
}

.counter {
    text-align: right;
    color: #666;
    font-size: 0.9em;
}

.warning {
    margin: 20px 0;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    border: #e4e4e7 1px solid;
    font-size: small;
    color: #6b7280;
}

.voice-selection {
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.output-section {
    margin-bottom: 40px;
    min-height: 50px;
    padding: 20px;
    border: 2px dashed #ddd;
    text-align: center;
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    cursor: pointer;
    border-radius: 6px;

    .add {
        width: 30px;
        height: 30px;
        background: url('../assets/icons/add.svg') no-repeat center / contain;
    }
}

.select-output-section {
    min-height: 50px;
    border: 1px solid #ddd;
    text-align: center;
    align-items: center;
    background-color: white;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.select-output-section:hover {
    border-color: #ccc;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}



.select-voice-item {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
}

.select-voice-detail {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.build {
    display: flex;
    justify-content: end;
    margin-top: 40px;
}

input[type="range"] {
    width: 200px;
    margin: 0 10px;
}

.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.demo-tabs {
    width: 100%;
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

.action-sum {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.action-bar {
    height: 100%;
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    align-items: center;

    .header-tip {
        color: #6b7280;
    }
}

.content {
    margin: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .content-header {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
    }
}

.select-btns {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .btns-plus {
        display: flex;
        flex-direction: row;
        gap: 25px;

        .button {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;

            .number {
                font-size: small;
            }

            .like {
                cursor: pointer;
                width: 20px;
                height: 20px;
                background: url('../assets/icons/like.svg') no-repeat center / contain;
            }

            .likefill {
                cursor: pointer;
                width: 20px;
                height: 20px;
                background: url('../assets/icons/likefill.svg') no-repeat center / contain;
            }

            .unlike {
                cursor: pointer;
                width: 20px;
                height: 20px;
                background: url('../assets/icons/unlike.svg') no-repeat center / contain;
            }

            .unlikefill {
                cursor: pointer;
                width: 20px;
                height: 20px;
                background: url('../assets/icons/unlikefill.svg') no-repeat center / contain;
            }
        }
    }
}

.btn:hover {
    background-color: #f4f4f5 !important;
    border: #606266 1px solid !important;
}

.logo {
    width: 20px;
    height: 20px;
    background: url('../assets/icons/sound.svg') no-repeat center / contain;
}

.mydot {
    width: 8px;
    height: 8px;
    margin: 5px;
    border-radius: 50%;
    background-color: #e5e8eb;
}

::v-deep(.btn:hover .el-icon) {
    color: #606266 !important;
}

.display-detail {
    color: #71717a;
}

.close-plus {
    width: 15px;
    height: 15px;
    background: url('../assets/icons/close2.svg') no-repeat center / contain;
}

.on-plus {
    width: 15px;
    height: 15px;
    background: url('../assets/icons/on.svg') no-repeat center / contain;
}

.select-voice-name {
    font-size: 23px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    justify-content: left;
}

.voice-sample-item {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding-top: 5px;
}

.tag1 {
    background-color: #dcfce7;
    color: #16a34a;
    border: #86efac 1px solid;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: small;
}

.tag2 {
    background-color: #dbeafe;
    color: #2563eb;
    border: #93c5fd 1px solid;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: small;
}

.advanced-settings {
    width: 85vh;
    margin-top: 20px;
    width: 100%;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    overflow: hidden;
    background-color: white;
}

.toggle-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.content-wrapper {
    background: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;

    .mode {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

.detail {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-bottom: 10px;
}

.demo-progress {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

.el-slider {
    --el-slider-main-bg-color: black !important;
}

:deep() .el-slider__button {
    border-color: black !important;
}


.audio-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 85%;
    align-items: baseline
}

.audio-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.audio-actions {
    display: flex;
    flex-direction: row;
    gap: 15px;
}

.audio-name {
    font-size: 14px;
    color: #666;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

.audio-text {
    font-size: 18px;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.audio-item {
    padding: 10px 10px 0 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #FFFFFF;
    transition: all 0.3s ease;
    margin-bottom: 20px;
}

.audio-item:hover {
    border-color: #ccc;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.audio-top {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.divide {
    margin-top: 15px;
    height: 1px;
    width: 100%;
    background-color: #e4e4e7;
}

.dialog {
    display: flex;
    flex-direction: column;
    color: black;
    gap: 10px;
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