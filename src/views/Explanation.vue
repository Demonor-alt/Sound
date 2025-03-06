<template>
    <div class="row">
        <div class="col">
            <h1>文本转语音</h1>
            <div class="input-section">
                <div class="text">您的文本</div>
                <MyInputW :message="inputText" :placeholder="placeholderTextArea" :type="type" :maxlength="maxlength"
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
            <div class="output-section" @click="visible = true" v-if="!submitData">
                <div class="add"></div>
                <div style="font-weight: 600;">选择语音声音</div>
            </div>
            <div class="select-output-section" v-else>
                <el-row class="select-voice-item">
                    <el-col :span="5">
                        <el-image style="width: 80px; height: 80px;border-radius: 15px;" :src="submitData.image"
                            fit="cover" />
                    </el-col>
                    <el-col :span="15">
                        <div class="select-voice-name">{{ submitData.name }}</div>
                        <div class="select-voice-detail">
                            <span class="display-detail"> {{ submitData.userName }}</span>
                            <div class="dot"></div>
                            <el-icon size="20" style="color: #6b7280;">
                                <Clock />
                            </el-icon>
                            <span class="display-detail">{{ timeDistance(submitData.creationTime) }}</span>
                            <div class="dot"></div>
                            <div class="tag1"> {{ submitData.language }}</div>
                            <div class="tag2" v-if="submitData.tag !== ''" style="margin-left: 5px;"> {{ submitData.tag
                                }}
                            </div>
                        </div>
                        <div class="select-btns">
                            <div class="btns-plus">
                                <div class="button">
                                    <div class="like" v-if="!submitData.isLiked"
                                        @click="submitData.isLiked = !submitData.isLiked; submitData.likeCount++;">
                                    </div>
                                    <div class="likefill" v-else
                                        @click="submitData.isLiked = !submitData.isLiked; submitData.likeCount--;">
                                    </div>
                                    <div class="number">
                                        {{ formatNumberWithK(submitData.likeCount) }}
                                    </div>
                                </div>
                                <div class="button">
                                    <div class="unlike" v-if="!submitData.isUnliked"
                                        @click="submitData.isUnliked = !submitData.isUnliked">
                                    </div>
                                    <div class="unlikefill" v-else
                                        @click="submitData.isUnliked = !submitData.isUnliked">
                                    </div>
                                </div>
                                <div class="button">
                                    <el-icon size="20" color="#6b7280" style="cursor: pointer;"
                                        v-if="!submitData.isCollected"
                                        @click="submitData.isCollected = !submitData.isCollected; submitData.collectCount++;">
                                        <Star />
                                    </el-icon>
                                    <el-icon size="20" color="#6b7280" style="cursor: pointer;" v-else
                                        @click="submitData.isCollected = !submitData.isCollected; submitData.collectCount--;">
                                        <StarFilled />
                                    </el-icon>
                                    <div class="number">
                                        {{ formatNumberWithK(submitData.collectCount) }}
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
                            <el-icon size="28" style="cursor: pointer;" @click="submitData = ''">
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
                                <MyInputW :message="nameValue" :placeholder="placeholder" class="search-input"
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
                    </el-tab-pane>
                    <el-tab-pane label="我的收藏" name="second">
                    </el-tab-pane>
                    <el-tab-pane label="我的语音" name="third">
                        <MyInputW :message="nameValue" :placeholder="placeholder" class="search-input"
                            @update:message="handleMessage" style="width: 20%;" />
                    </el-tab-pane>
                </el-tabs>
                <div v-if="filteredVoices.length === 0">
                    <el-empty description="暂无数据" />
                </div>
                <div style="height: 58vh;overflow-y: auto;">
                    <el-row v-for="voice in filteredVoices" :key="voice.id" class="voice-item">
                        <el-col :span="4">
                            <el-image style="width: 100px; height: 100px;border-radius: 15px;" :src="voice.image"
                                fit="cover" />
                        </el-col>
                        <el-col :span="20">
                            <div class="voice-name" @click="MoreDetail(voice.id)">{{ voice.name }}</div>
                            <div class="voice-detail">
                                <span class="display-detail"> {{ voice.userName }}</span>
                                <div class="dot"></div>
                                <el-icon size="20" style="color: #6b7280;">
                                    <Clock />
                                </el-icon>
                                <span class="display-detail">{{ timeDistance(voice.creationTime) }}</span>
                                <div class="dot"></div>
                                <el-popover placement="bottom" :width="400" trigger="click">
                                    <template #reference>
                                        <div style="display: flex;flex-direction: row;gap: 10px;cursor: pointer;">
                                            <div class="logo"></div>
                                            <span class="display-detail"> {{ voice.sample.length }}&nbsp音频示例</span>
                                        </div>
                                    </template>
                                    <div class="audio-samples">
                                        <span style="font-size: large;font-weight: 800 ;color: black;">示例</span>
                                        <el-card v-for="(sample, index) in voice.sample" :key="index"
                                            class="samples-item" shadow="never">
                                            <div class="samples-content">
                                                <div>
                                                    <span class="samples-index">{{ index + 1 }}</span>
                                                    <span>{{ sample.title }}</span>
                                                </div>
                                                <div class="sample-btn">
                                                    <div v-if="!sample.isPlaying" class="close"
                                                        @click="togglePlay(voice.id, index)">
                                                    </div>
                                                    <div v-else class="on" @click="togglePlay(voice.id, index)"></div>
                                                </div>
                                            </div>
                                            <div style="font-size: small;color: #71717a; padding-top: 10px;">
                                                {{ sample.text }}
                                            </div>
                                        </el-card>
                                    </div>
                                </el-popover>
                                <div class="dot"></div>
                                <div class="tag1"> {{ voice.language }}</div>
                                <div class="tag2" v-if="voice.tag !== ''" style="margin-left: 5px;"> {{ voice.tag }}
                                </div>
                            </div>
                            <div class="voice-sample">
                                <div v-for="(sample, index) in voice.sample" :key="index" class="voice-sample-item">
                                    <div class="sample-btn">
                                        <div v-if="!sample.isPlaying" class="close-plus"
                                            @click="togglePlay(voice.id, index)">
                                        </div>
                                        <div v-else class="on-plus" @click="togglePlay(voice.id, index)"></div>
                                    </div>
                                    <div
                                        style="width: 50%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis; font-size: small;">
                                        {{ sample.text }}
                                    </div>
                                </div>
                            </div>
                            <div class="btns">
                                <el-button size="large" color="black" @click="useVoice(voice.id)">使用声音</el-button>
                                <div class="btns-plus">
                                    <div class="button">
                                        <div class="used"></div>
                                        <div class="number">
                                            {{ formatNumberWithK(voice.peopleCount) }}&nbsp;Used
                                        </div>
                                    </div>
                                    <div class="button">
                                        <div class="shared" @click="open"></div>
                                        <div class="number">
                                            {{ formatNumberWithK(voice.shareCount) }}&nbsp;Shares
                                        </div>
                                    </div>
                                    <div class="button">
                                        <div class="like" v-if="!voice.isLiked"
                                            @click="voice.isLiked = !voice.isLiked; voice.likeCount++;">
                                        </div>
                                        <div class="likefill" v-else
                                            @click="voice.isLiked = !voice.isLiked; voice.likeCount--;"></div>
                                        <div class="number">
                                            {{ formatNumberWithK(voice.likeCount) }}
                                        </div>
                                    </div>
                                    <div class="button">
                                        <div class="unlike" v-if="!voice.isUnliked"
                                            @click="voice.isUnliked = !voice.isUnliked">
                                        </div>
                                        <div class="unlikefill" v-else @click="voice.isUnliked = !voice.isUnliked">
                                        </div>
                                    </div>
                                    <div class="button">
                                        <el-icon size="20" color="#6b7280" style="cursor: pointer;"
                                            v-if="!voice.isCollected"
                                            @click="voice.isCollected = !voice.isCollected; voice.collectCount++;">
                                            <Star />
                                        </el-icon>
                                        <el-icon size="20" color="#6b7280" style="cursor: pointer;" v-else
                                            @click="voice.isCollected = !voice.isCollected; voice.collectCount--;">
                                            <StarFilled />
                                        </el-icon>
                                        <div class="number">
                                            {{ formatNumberWithK(voice.collectCount) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
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
                <el-button color="black">创建</el-button>
            </div>
        </div>
        <el-divider direction="vertical" style="height: auto;" />
        <div class="col">

        </div>
    </div>

</template>

<script setup>
import { ref, computed } from 'vue';
import MyInputW from "@/components/newComponent/Input.vue";
const placeholderTextArea = ref("输入您想生成的语音文本")
const type = ref('textarea');
const rows = ref("5");
const maxlength = ref("500");
const color1 = ref("#f5f5f5");
const inputText = ref('');
function handleMessageTextArea(newValue) {
    inputText.value = newValue;
}
import { useRouter } from 'vue-router'
const router = useRouter()

const createNewSound = () => {
    // 跳转到添加员工的页面
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
    ArrowDown, ArrowUp, Minus, Plus
} from '@element-plus/icons-vue';
const MoreDetail = (id) => {
    router.push({ path: '/detail', query: { id: id } });

}
const voices = ref([
    {
        id: 1,
        userName: 'fc',
        image: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
        name: '55',
        description: '1212',
        creationTime: new Date(2025, 1, 9, 19, 11),
        status: "成功",
        audioUrl: '/samples/sample1.mp3',
        peopleCount: 110000,
        shareCount: 11,
        likeCount: 20,
        collectCount: 10,
        language: 'ch',
        tag: 'aaaaaaaaa',
        isLiked: false,
        isUnliked: false,
        isCollected: false,
        sample: [
            {
                id: 1,
                isPlaying: false,
                title: 'Default Sample',
                text: '哈哈哈笑死我了，这也太搞笑了吧！我靠我靠，这是什么神仙操作啊，太离谱了哩咯。笑得我肚子疼，这也太逗了吧，绝了绝了！',
                url: ''
            },
            {
                id: 2,
                isPlaying: false,
                title: '方可让父母',
                text: '对侧人防热非人发热功耗一节课iklo',
                url: ''
            }
        ],
    },
    {
        id: 2,
        userName: 'fcds',
        image: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
        name: '55',
        description: '1212',
        creationTime: new Date(2025, 1, 9, 19, 10),
        status: "成功",
        audioUrl: '/samples/sample1.mp3',
        peopleCount: 15,
        shareCount: 11,
        likeCount: 20,
        collectCount: 10,
        language: 'en',
        tag: '1',
        isLiked: false,
        isUnliked: false,
        isCollected: false,
        sample: [
            {
                id: 1,
                isPlaying: false,
                title: 'Default Sample',
                text: '哈哈哈笑死我了，这也太搞笑了吧！我靠我靠，这是什么神仙操作啊，太离谱了哩咯。笑得我肚子疼，这也太逗了吧，绝了绝了！',
                url: ''
            },
        ],
    },
]);
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
const tagOptions = computed(() => {
    const tags = new Set();
    voices.value.forEach(voice => {
        tags.add(voice.tag);
    });
    return Array.from(tags).map(tag => ({ value: tag, label: tag }));
});
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
const filteredVoices = computed(() => {
    let result = voices.value.filter(voice =>
        voice.name.includes(nameValue.value)
    );

    if (tagValue.value) {
        result = result.filter(voice => voice.tag === tagValue.value);
    }

    if (languageValue.value !== '1') {
        result = result.filter(voice => voice.language === languageValue.value);
    }

    if (sortValue.value === '2') {
        result.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
    } else if (sortValue.value === '1') {
        result.sort((a, b) => b.peopleCount - a.peopleCount);
    }
    return result;
});
import MySelectChange from '@/components/newComponent/SelectChange.vue'
const visiblePopover = ref(false);

const togglePlay = (id, index) => {
    if (!voices.value[id].sample[index].url) {
        console.error('Audio URL is empty');
        return;
    }
    const audio = new Audio(voices.value[id].sample[index].url);
    const fileInfo = voices.value[id].sample[index];

    if (fileInfo.isPlaying) {
        audio.pause();
        fileInfo.isPlaying = false;
    } else {
        audio.play();
        fileInfo.isPlaying = true;
    }
    audio.addEventListener('ended', () => {
        voices.value[id].sample[index].isPlaying = false;
    });
};
const submitData = ref();
const useVoice = (id) => {
    submitData.value = voices.value.find(voice => voice.id === id);
    visible.value = false;
}
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
import { ElNotification } from 'element-plus'

const open = () => {
    ElNotification({
        message: "已复制到剪贴板",
        position: 'bottom-right',
    })
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
</script>

<style scoped>
.row {
    display: flex;
    flex-direction: row;
}

.col {
    margin: 0 3%;
    width: 85vh;
}

.text {
    font-size: large;
    padding-bottom: 15px;
}


textarea {
    width: 100%;
    height: 150px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
}

.counter {
    text-align: right;
    color: #666;
    font-size: 0.9em;
}

.warning {
    margin: 10px 0;
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.output-section {
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
    margin-top: 20px;
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

.actions {
    display: flex;
    flex-direction: row;
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

.sound-manager {
    padding: 5px 45px;
    max-width: 1400px;
    margin: 0 auto;
}


.display {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .title {
        font-size: 25px;
        margin-bottom: 24px;
        color: #333;
        font-weight: 800;
    }
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

.voice-item {
    width: 100%;
    background-color: white;
    border-radius: 10px;
    border: #e4e4e7 1px solid;
    display: flex;
    padding: 20px;
    margin-bottom: 20px;

    .el-col {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }


    .btns {
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

                .used {
                    width: 20px;
                    height: 20px;
                    background: url('../assets/icons/close2.svg') no-repeat center / contain;
                }

                .shared {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    background: url('../assets/icons/share.svg') no-repeat center / contain;
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

.dot {
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

.audio-samples {
    padding: 1%;

    .samples-item {
        border: #e4e4e7 1px solid;
        margin-top: 15px;
    }

    .samples-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .samples-index {
            background-color: #e0e5eb;
            border-radius: 25px;
            padding: 2px 7px;
            margin-right: 10px;
        }
    }

    .close {
        width: 25px;
        height: 25px;
        background: url('../assets/icons/close.svg') no-repeat center / contain;
    }

    .on {
        width: 25px;
        height: 25px;
        background: url('../assets/icons/on.svg') no-repeat center / contain;
    }

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

.voice-name {
    font-size: 23px;
    font-weight: 800;
    cursor: pointer;
}

.select-voice-name {
    font-size: 23px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    justify-content: left;
}

.voice-detail {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    font-size: small;
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
}

.tag2 {
    background-color: #dbeafe;
    color: #2563eb;
    border: #93c5fd 1px solid;
    padding: 2px 10px;
    border-radius: 20px;
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

.expand-enter-active,
.expand-leave-active {
    transition: height 0.3s ease-in-out;
    overflow: hidden;
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
</style>