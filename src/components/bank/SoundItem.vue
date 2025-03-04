<template>
    <div v-if="filteredVoices.length === 0">
        <el-empty description="暂无数据" />
    </div>
    <el-row v-for="voice in filteredVoices" :key="voice.id" class="voice-item">
        <el-col :span="3">
            <el-image style="width: 100px; height: 100px;border-radius: 15px;" :src="voice.image" fit="cover" />
        </el-col>
        <el-col :span="21">
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
                        <el-card v-for="(sample, index) in voice.sample" :key="index" class="samples-item"
                            shadow="never">
                            <div class="samples-content">
                                <div>
                                    <span class="samples-index">{{ index + 1 }}</span>
                                    <span>{{ sample.title }}</span>
                                </div>
                                <div class="sample-btn">
                                    <audio>
                                        <source :src="sample.url" type="audio/mp4">
                                        <source :src="sample.url" type="audio/x-m4a">
                                        浏览器不支持音频播放
                                    </audio>
                                    <div v-if="!sample.isPlaying" class="close" @click="togglePlay(voice.id, index);sample.isPlaying=true">
                                    </div>
                                    <div v-else class="on" @click="togglePlay(voice.id, index);sample.isPlaying=false"></div>
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
                        <div v-if="!sample.isPlaying" class="close-plus" @click="togglePlay(voice.id, index)">
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
                        <div class="shared" @click="open(voice.id)"></div>
                        <div class="number">
                            {{ formatNumberWithK(voice.shareCount) }}&nbsp;Shares
                        </div>
                    </div>
                    <div class="button">
                        <div class="like" v-if="!voice.isLiked"
                            @click="voice.isLiked = !voice.isLiked; voice.likeCount++; voice.isUnliked = false"></div>
                        <div class="likefill" v-else @click="voice.isLiked = !voice.isLiked; voice.likeCount--;"></div>
                        <div class="number">
                            {{ formatNumberWithK(voice.likeCount) }}
                        </div>
                    </div>
                    <div class="button">
                        <div class="unlike" v-if="!voice.isUnliked"
                            @click="voice.isUnliked = !voice.isUnliked; if (voice.isLiked === true) { voice.likeCount--; voice.isLiked = false }">
                        </div>
                        <div class="unlikefill" v-else @click="voice.isUnliked = !voice.isUnliked">
                        </div>
                    </div>
                    <div class="button">
                        <el-icon size="20" color="#6b7280" style="cursor: pointer;" v-if="!voice.isCollected"
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
</template>
<script setup>
import {
    Clock,
    Star,
    StarFilled
} from '@element-plus/icons-vue';
import { ref, defineProps, computed, reactive } from 'vue' // 添加reactive
import { timeDistance } from '@/hooks/time';
const props = defineProps({
    sortValue: {
        type: String,
    },
    languageValue: {
        type: String,
    },
    tagValue: {
        type: String,
    }
});
import audioUrl from '@/assets/sound.m4a';
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
        isUsed:false,
        isShared:false,
        isLiked: false,
        isUnliked: false,
        isCollected: false,
        sample: [
            {
                id: 1,
                isPlaying: false,
                title: 'Default Sample',
                text: '哈哈哈笑死我了，这也太搞笑了吧！我靠我靠，这是什么神仙操作啊，太离谱了哩咯。笑得我肚子疼，这也太逗了吧，绝了绝了！',
                url: audioUrl
            },
            {
                id: 2,
                isPlaying: false,
                title: '方可让父母',
                text: '对侧人防热非人发热功耗一节课iklo',
                url: audioUrl
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
        shareCount: 12,
        likeCount: 20,
        collectCount: 10,
        language: 'en',
        tag: '1',
        isUsed:false,
        isShared:false,
        isLiked: false,
        isUnliked: false,
        isCollected: false,
        sample: [
            {
                id: 1,
                isPlaying: false,
                title: 'Default Sample',
                text: '哈哈哈笑死我了，这也太搞笑了吧！我靠我靠，这是什么神仙操作啊，太离谱了哩咯。笑得我肚子疼，这也太逗了吧，绝了绝了！',
                url: audioUrl
            },
        ],
    },
]);
const filteredVoices = computed(() => {
    let result = [...voices.value];
    if (props.tagValue === '') {
        result = [...voices.value];
    }
    else if (props.tagValue !== '') {
        result = result.filter(voice => voice.tag === props.tagValue);
    }
    if (props.languageValue !== '1') {
        result = result.filter(voice => voice.language === props.languageValue);
    }
    if (props.sortValue === '2') {
        result.sort(((a, b) => new Date(b.creationTime) - new Date(a.creationTime)));
    } else if (props.sortValue === '1') {
        result.sort(((a, b) => b.peopleCount - a.peopleCount));
    }
    return result;
});
import { useRouter } from 'vue-router';
const router = useRouter();
const MoreDetail = (id) => {
    router.push({ path: '/detail', query: { id: id } });
}
const useVoice = (id) => {
    router.push({ path: '/explanation', query: { id: id } });
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
const open = (id) => {
    const voiceIndex = voices.value.findIndex(voice => voice.id === id);
    if (voices.value[voiceIndex].isShared === false) {
        voices.value[voiceIndex].isShared = true;
        voices.value[voiceIndex].shareCount++;
    }
    ElNotification({
        message: "已复制到剪贴板",
        position: 'bottom-right',
    })
}
const audioPlayers = reactive({})

const togglePlay = (voiceId, sampleIndex) => {
  // 通过find正确查找voice对象
  const voice = voices.value.find(v => v.id === voiceId)
  if (!voice) return

  const sample = voice.sample[sampleIndex]
  const playerKey = `${voiceId}-${sampleIndex}`

  // 如果已经有播放器实例
  if (audioPlayers[playerKey]) {
    const audio = audioPlayers[playerKey]
    if (sample.isPlaying) {
      audio.pause()
    } else {
      // 暂停所有正在播放的音频
      Object.values(audioPlayers).forEach(a => a.pause())
      audio.play()
    }
  } else {
    // 创建新播放器实例
    const audio = new Audio(sample.url)
    audioPlayers[playerKey] = audio
    
    // 添加播放结束监听
    audio.addEventListener('ended', () => {
      sample.isPlaying = false
    })

    audio.play()
  }

  // 切换播放状态
  sample.isPlaying = !sample.isPlaying
  
  // 更新其他音频状态
  voice.sample.forEach((s, idx) => {
    if (idx !== sampleIndex) s.isPlaying = false
  })
}
</script>
<style scoped>
.voice-item {
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
                    background: url('../../assets/icons/close2.svg') no-repeat center / contain;
                }

                .shared {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    background: url('../../assets/icons/share.svg') no-repeat center / contain;
                }

                .like {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    background: url('../../assets/icons/like.svg') no-repeat center / contain;
                }

                .likefill {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    background: url('../../assets/icons/likefill.svg') no-repeat center / contain;
                }

                .unlike {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    background: url('../../assets/icons/unlike.svg') no-repeat center / contain;
                }

                .unlikefill {
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    background: url('../../assets/icons/unlikefill.svg') no-repeat center / contain;
                }
            }
        }
    }
}

.voice-name {
    font-size: 23px;
    font-weight: 800;
    cursor: pointer;
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

.display-detail {
    color: #71717a;
}

.logo {
    width: 20px;
    height: 20px;
    background: url('../../assets/icons/sound.svg') no-repeat center / contain;
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

.close-plus {
    width: 15px;
    height: 15px;
    background: url('../../assets/icons/close2.svg') no-repeat center / contain;
}

.on-plus {
    width: 15px;
    height: 15px;
    background: url('../../assets/icons/on.svg') no-repeat center / contain;
}

.dot {
    width: 8px;
    height: 8px;
    margin: 5px;
    border-radius: 50%;
    background-color: #e5e8eb;
}
</style>