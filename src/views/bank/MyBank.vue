<template>
    <el-container class="sound-manager">
        <el-header class="display">
            <h1 class="title">我的声音</h1>
            <div class="action-bar">
                <MyInput :message="searchText" :placeholder="placeholder" :color="myBorderColor" class="search-input"
                    @update:message="handleMessage" />
                <el-button color="black" @click="createNewSound" class="create-btn">
                    <el-icon size="20" style="padding-right: 5px;">
                        <Plus />
                    </el-icon> 创建新的声音
                </el-button>
            </div>
        </el-header>
        <el-main>
            <div v-if="voiceList.length === 0">
                <el-empty description="暂无数据" />
            </div>
            <el-row v-for="voice in filteredVoices" :key="voice.voiceId" class="voice-item">
                <el-col :span="2">
                    <el-image style="width: 70px; height: 70px;border-radius: 10px;" :src="voice.voiceImage"
                        fit="cover" />
                </el-col>
                <el-col :span="7">
                    <div style="font-size: 20px; font-weight: 800;padding-bottom: 10px;cursor: pointer;"
                        @click="MoreDetail(voice.voiceId)">{{ voice.voiceName }}</div>
                    <div style="color: #6b7280;">{{ voice.voiceDescription }}</div>
                </el-col>
                <el-col :span="4">
                    <div class="item">创建时间</div>
                    <div style="display: flex;flex-direction: row; gap: 10px;">
                        <el-icon size="20" style="color: #6b7280;">
                            <Clock />
                        </el-icon>
                        <span style="font-weight: 520;">{{ formatDate(voice.voiceCreationTime) }}</span>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="item">状态</div>
                    <div style="padding-top: 3%;">
                        <el-tag type="success" round effect="dark" style="width: 50px;font-weight: 1000;">成功</el-tag>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="item">音频示例</div>
                    <div>
                        <el-popover placement="bottom" :width="400" trigger="click">
                            <template #reference>
                                <div style="display: flex;flex-direction: row;gap: 10px;cursor: pointer;">
                                    <div class="logo"></div>
                                    <span style="color: #71717a;"> {{ voice.voiceSamples.length }}&nbsp音频示例</span>
                                </div>
                            </template>
                            <div class="audio-samples">
                                <span style="font-size: large;font-weight: 800 ;color: black;">示例</span>
                                <el-card v-for="(sample, index) in voice.voiceSamples" :key="index" class="samples-item"
                                    shadow="never">
                                    <div class="samples-content">
                                        <div>
                                            <span class="samples-index">{{ index + 1 }}</span>
                                            <span>{{ sample.sampleTitle }}</span>
                                        </div>
                                        <div class="sample-btn">
                                            <audio>
                                                <source :src="sample.sampleUrl" type="audio/mp4">
                                                <source :src="sample.sampleUrl" type="audio/x-m4a">
                                                浏览器不支持音频播放
                                            </audio>
                                            <div v-if="!sample.sampleIsPlaying" class="close"
                                                @click="togglePlay(voice.voiceId, index); sample.sampleIsPlaying = true">
                                            </div>
                                            <div v-else class="on"
                                                @click="togglePlay(voice.voiceId, index); sample.sampleIsPlaying = false">
                                            </div>
                                        </div>
                                    </div>
                                    <div style="font-size: small;color: #71717a; padding-top: 10px;">
                                        {{ sample.sampleText }}
                                    </div>
                                </el-card>
                            </div>
                        </el-popover>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="btns">
                        <el-button size="large" color="black" @click="useVoice(voice.voiceId)">使用声音</el-button>
                        <el-button size="large" class="btn" circle @click="toUpdate(voice.voiceId)">
                            <el-icon size="20" color="black">
                                <Edit />
                            </el-icon>
                        </el-button>
                        <el-button size="large" class="btn" circle @click="dialogVisible = true">
                            <el-icon size="20" color="black">
                                <Delete />
                            </el-icon>
                        </el-button>
                        <el-dialog v-model="dialogVisible" align-center :show-close="false" style="width: 500px;">
                            <div style="font-size: large;font-weight: 600;">您确定要删除语音吗</div>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button color="black" plain @click="dialogVisible = false">取消</el-button>
                                    <el-button color="black"
                                        @click="dialogVisible = false; deleteService(voice.voiceId)">
                                        确认
                                    </el-button>
                                </span>
                            </template>
                        </el-dialog>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import {
    Plus,
    Edit,
    Delete,
    Clock
} from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';
import MyInput from '@/components/newComponent/Input.vue';
const myBorderColor = ref('#f5f5f5');
const dialogVisible = ref(false);
import { useRouter } from 'vue-router'
const router = useRouter()
const createNewSound = () => {
    router.push('/createbank')
}
const toUpdate = (id) => {
    router.push({ path: '/createbank', query: { id: id } })
}
const MoreDetail = (id) => {
    // 跳转到添加声音的页面
    router.push({ path: '/detail', query: { id: id } });
}
function handleMessage(newMessage) {
    searchText.value = newMessage;
}
import audioUrl from '@/assets/sound.m4a';
// 模拟数据
const voiceList = ref([
    {
        "voiceId": 70,
        "voiceImage": "https://loremflickr.com/400/400?lock=567532027855895",
        "voiceName": "曲志明",
        "voiceDescription": "例面求上。果圆相称斗织是。开电年。同利算术极七等被来。问广十世。",
        "voiceCreationTime": "2024-04-22 00:28:31",
        "voiceIsCollected": true,
        "voiceSamples": [
            {
                "sampleId": 83,
                "sampleIsPlaying": false,
                "sampleTitle": "拨伟大快但是脊梁",
                "sampleText": "consectetur",
                "sampleUrl": audioUrl
            }
        ]
    }
]);
const searchText = ref('');
const placeholder = ref('搜索声音...');
const filteredVoices = computed(() => {
    return voiceList.value.filter(voice =>
        voice.voiceName.includes(searchText.value)
    )
})

// 日期格式化
const formatDate = (date) => {
    date = new Date(date);
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}

const audioPlayers = reactive({})

const togglePlay = (voiceId, sampleIndex) => {
    // 通过find正确查找voice对象
    const voice = voiceList.value.find(v => v.voiceId === voiceId)
    if (!voice) return

    const sample = voice.voiceSamples[sampleIndex]
    const playerKey = `${voiceId}-${sampleIndex}`

    // 如果已经有播放器实例
    if (audioPlayers[playerKey]) {
        const audio = audioPlayers[playerKey]
        if (sample.sampleIsPlaying) {
            audio.pause()
        } else {
            // 暂停所有正在播放的音频
            Object.values(audioPlayers).forEach(a => a.pause())
            audio.play()
        }
    } else {
        // 创建新播放器实例
        const audio = new Audio(sample.sampleUrl)
        audioPlayers[playerKey] = audio

        // 添加播放结束监听
        audio.addEventListener('ended', () => {
            sample.sampleIsPlaying = false
        })

        audio.play()
    }

    // 切换播放状态
    sample.sampleIsPlaying = !sample.sampleIsPlaying

    // 更新其他音频状态
    voice.voiceSamples.forEach((s, idx) => {
        if (idx !== sampleIndex) s.sampleIsPlaying = false
    })
}
const useVoice = (id) => {
    router.push({ path: '/explanation', query: { id: id } });
}
import { useTokenStore } from '@/stores/token';
const token = useTokenStore();
import { bankQueryService, bankDeleteService } from '@/api/bank/mybank';
const bankList = async () => {
    try {
        const result = await bankQueryService();
        voiceList.value = result.data;
    } catch (error) {
        console.error('Failed to ', error);
        voiceList.value = [];
    }
};

onMounted(() => {
    bankList();
});
const deleteService = async(id) => {
    let result = await bankDeleteService(id);
    bankList();
};
</script>

<style scoped>
.sound-manager {
    padding: 5px;
    max-width: 1400px;
    margin: 0 auto;
}

.display {
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .title {
        font-size: 25px;
        margin-bottom: 24px;
        color: #333;
    }

    .action-bar {
        height: 100%;
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        align-items: center;

        .search-input {
            flex: 1;
            max-width: 300px;
            height: 40px;
            display: flex;
            align-items: center;
        }

        .create-btn {
            height: 40px;
            width: 150px;
        }

    }
}

.voice-item {
    background-color: white;
    border-radius: 10px;
    border: #e4e4e7 1px solid;
    display: flex;
    padding: 20px;
    margin-bottom: 20px;
    transition: all 0.3s ease; 

    .el-col {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    .item {
        font-size: 14px;
        color: #6b7280;
        padding-bottom: 10%;
    }

    .btns {
        padding-top: 7%;
        display: flex;
        flex-direction: row;

        .btn:hover {
            background-color: #f4f4f5 !important;
            border: #606266 1px solid !important;
        }
    }
}
.voice-item:hover {
    border-color: #ccc; 
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); 
}

.logo {
    width: 25px;
    height: 25px;
    background: url('../../assets/icons/sound.svg') no-repeat center / contain;
}

::v-deep(.btn:hover .el-icon) {
    color: #606266 !important;
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
        background: url('../../assets/icons/close.svg') no-repeat center / contain;
    }

    .on {
        width: 25px;
        height: 25px;
        background: url('../../assets/icons/on.svg') no-repeat center / contain;
    }
}
</style>