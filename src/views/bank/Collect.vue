<template>
    <el-container class="sound-manager">
        <el-header class="display">
            <h1 class="title">我的收藏</h1>
            <div class="action-bar">
                <MyInput :message="searchText" :placeholder="placeholder" :color="myBorderColor" class="search-input"
                    @update:message="handleMessage" />
            </div>
        </el-header>
        <el-main>
            <div v-if="voices.length === 0">
                <el-empty description="暂无数据" />
            </div>
            <el-row v-for="voice in filteredVoices" :key="voice.voiceId" class="voice-item">
                <el-col :span="2">
                    <el-image style="width: 70px; height: 70px;border-radius: 10px;" :src="voice.voiceImage"
                        fit="cover" />
                </el-col>
                <el-col :span="7">
                    <div class="voice-name" @click="MoreDetail(voice.voiceId)">{{ voice.voiceName }}</div>
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
                        <el-button size="large" class="btn" v-if="voice.voiceIsCollected" @click="toggleCollect(voice)">
                            <el-icon size="25" color="black">
                                <StarFilled />
                            </el-icon>
                        </el-button>
                        <el-button size="large" class="btn" v-else @click="toggleCollect(voice)">
                            <el-icon size="25" color="black">
                                <Star />
                            </el-icon>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { onBeforeUnmount } from 'vue';
import {
    StarFilled,
    Clock,
    Star
} from '@element-plus/icons-vue';
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import MyInput from '@/components/newComponent/Input.vue'
const myBorderColor = ref('#f5f5f5');
const router = useRouter()
const MoreDetail = (id) => {
    router.push({ path: '/detail', query: { id: id } });
}
function handleMessage(newMessage) {
    searchText.value = newMessage;
}
import audioUrl from '@/assets/sound.m4a';

const voices = ref([
    {
        voiceId: 1,
        voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
        voiceName: "曲志明",
        voiceDescription: "例面求上。果圆相称斗织是。开电年。同利算术极七等被来。问广十世。",
        voiceCreationTime: new Date(2025, 1, 9, 19, 11),
        voiceIsCollected: true,
        voiceSamples: [
            {
                sampleId: 83,
                sampleIsPlaying: false,
                sampleTitle: "拨伟大快但是脊梁",
                sampleText: "consectetur",
                sampleUrl: audioUrl
            }
        ]
    }
]);

const searchText = ref('');
const placeholder = ref('搜索声音...');
const filteredVoices = computed(() => {
    return voices.value.filter(voice =>
        voice.voiceName.includes(searchText.value)
    )
})

const formatDate = (date) => {
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date))
}

const audioPlayers = reactive({})

const togglePlay = (voiceId, sampleIndex) => {
    const voice = voices.value.find(v => v.voiceId === voiceId)
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
import { collectQueryService, collectBatchDeleteService } from '@/api/bank/collect'
onMounted(async () => {
    let result = await collectQueryService(token.token.userId);
    voices.value = result.data;
})
const toggleCollect = (voice) => {
    voice.voiceIsCollected = !voice.voiceIsCollected;
};
onBeforeUnmount(async () => {
    const deleteIds = [];
    if (voices.value.length > 0) {
        voices.value.forEach(voice => {
            if (!voice.voiceIsCollected) {
                deleteIds.push(voice.voiceId);
            }
        });
        if (deleteIds.length > 0) {
            const ids = deleteIds.join(',');
            let result = await collectBatchDeleteService({ userId: token.token.userId, ids: ids })
        }
    }
});

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
        gap: 10px;

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

.voice-name {
    font-size: 20px;
    font-weight: 800;
    padding-bottom: 10px;
    cursor: pointer;
}
</style>