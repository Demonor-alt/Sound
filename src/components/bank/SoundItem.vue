<template>
    <div v-if="filteredVoices.length === 0">
        <el-empty description="暂无数据" />
    </div>
    <el-row v-for="voice in filteredVoices" :key="voice.voiceId" class="voice-item">
        <el-col :span="3">
            <el-image style="width: 100px; height: 100px;border-radius: 15px;" :src="voice.voiceImage" fit="cover" />
        </el-col>
        <el-col :span="21">
            <div class="voice-name" @click="MoreDetail(voice.voiceId)">{{ voice.voiceName }}</div>
            <div class="voice-detail">
                <span class="display-detail"> {{ voice.userName }}</span>
                <div class="dot"></div>
                <el-icon size="20" style="color: #6b7280;">
                    <Clock />
                </el-icon>
                <span class="display-detail">{{ timeDistance(voice.voiceCreationTime) }}</span>
                <div class="dot"></div>
                <el-popover placement="bottom" :width="400" trigger="click">
                    <template #reference>
                        <div style="display: flex;flex-direction: row;gap: 10px;cursor: pointer;">
                            <div class="logo"></div>
                            <span class="display-detail"> {{ voice.voiceSamples.length }}&nbsp音频示例</span>
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
                                        @click="togglePlay(voice.voiceId, index); sample.sampleIsPlaying = false"></div>
                                </div>
                            </div>
                            <div style="font-size: small;color: #71717a; padding-top: 10px;">
                                {{ sample.sampleText }}
                            </div>
                        </el-card>
                    </div>
                </el-popover>
                <div class="dot"></div>
                <div class="tag1"> {{ voice.voiceLanguage }}</div>
                <div class="tag2" v-if="voice.voiceTag !== ''" style="margin-left: 5px;"> {{ voice.voiceTag }}
                </div>
            </div>
            <div class="voice-sample">
                <div v-for="(sample, index) in voice.voiceSamples" :key="index" class="voice-sample-item">
                    <div class="sample-btn">
                        <div v-if="!sample.sampleIsPlaying" class="close-plus"
                            @click="togglePlay(voice.voiceId, index)">
                        </div>
                        <div v-else class="on-plus" @click="togglePlay(voice.voiceId, index)"></div>
                    </div>
                    <div
                        style="width: 50%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis; font-size: small;">
                        {{ sample.sampleText }}
                    </div>
                </div>
            </div>
            <div class="btns">
                <el-button size="large" color="black" @click="useVoice(voice.voiceId)">使用声音</el-button>
                <div class="btns-plus">
                    <div class="button">
                        <div class="used"></div>
                        <div class="number">
                            {{ formatNumberWithK(voice.voiceUseCount) }}&nbsp;Used
                        </div>
                    </div>
                    <div class="button">
                        <div class="shared" @click="open(voice.voiceId)"></div>
                        <div class="number">
                            {{ formatNumberWithK(voice.voiceShareCount) }}&nbsp;Shares
                        </div>
                    </div>
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
                        <div class="unlikefill" v-if="voice.voiceIsLiked === 2" @click="toggleDislike(voice)"></div>
                        <div class="unlike" v-else @click="toggleDislike(voice)"></div>
                    </div>
                    <div class="button">
                        <el-icon size="20" color="#6b7280" style="cursor: pointer;" v-if="!voice.voiceIsCollected"
                            @click="toggleCollect(voice)">
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
    </el-row>
</template>

<script setup>
import {
    Clock,
    Star,
    StarFilled
} from '@element-plus/icons-vue';
import { ref, defineProps, computed, reactive, onMounted } from 'vue';
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
        voiceId: 1,
        userName: 'fc',
        voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
        voiceName: '55',
        voiceDescription: '1212',
        voiceCreationTime: new Date(2025, 1, 9, 19, 11),
        voiceUseCount: 110000,
        voiceShareCount: 11,
        voiceLikeCount: 20,
        voiceCollectCount: 10,
        voiceLanguage: 'ch',
        voiceTag: 'aaaaaaaaa',
        voiceIsUsed: false,
        voiceIsShared: false,
        voiceIsLiked: false,
        voiceIsUnliked: false,
        voiceIsCollected: false,
        voiceSamples: [
            {
                sampleId: 1,
                sampleIsPlaying: false,
                sampleTitle: 'Default Sample',
                sampleText: '哈哈哈笑死我了，这也太搞笑了吧！我靠我靠，这是什么神仙操作啊，太离谱了哩咯。笑得我肚子疼，这也太逗了吧，绝了绝了！',
                sampleUrl: audioUrl
            },
            {
                sampleId: 2,
                sampleIsPlaying: false,
                sampleTitle: '可以让父母',
                sampleText: '对侧人防热非人发热功耗一节课iklo',
                sampleUrl: audioUrl
            }
        ],
    },
]);
const filteredVoices = computed(() => {
    let result = [...voices.value];
    if (props.tagValue === '') {
        result = [...voices.value];
    }
    else if (props.tagValue !== '') {
        result = result.filter(voice => voice.voiceTag === props.tagValue);
    }
    if (props.languageValue !== '1') {
        result = result.filter(voice => voice.voiceLanguage === props.languageValue);
    }
    if (props.sortValue === '2') {
        result.sort(((a, b) => new Date(b.voiceCreationTime) - new Date(a.voiceCreationTime)));
    } else if (props.sortValue === '1') {
        result.sort(((a, b) => b.voiceUseCount - a.voiceUseCount));
    }
    return result;
});
import { useRouter } from 'vue-router';
const router = useRouter();
const MoreDetail = (voiceId) => {
    router.push({ path: '/detail', query: { id: voiceId } });
}
const useVoice = (voiceId) => {
    router.push({ path: '/explanation', query: { id: voiceId } });
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
const audioPlayers = reactive({})

const togglePlay = (voiceId, sampleIndex) => {
    const voice = voices.value.find(v => v.voiceId === voiceId)
    if (!voice) return
    const sample = voice.voiceSamples[sampleIndex]
    const playerKey = `${voiceId}-${sampleIndex}`
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
// import { discoverQueryService, discoverUpdateShareService, discoverUpdateLikeService,discoverUpdateCollectService } from '@/api/discover'
// onMounted(async () => {
//     let result = await discoverQueryService();
//     voices.value = result.data;
// })
import { ElNotification } from 'element-plus'
const open = (voiceId) => {
    const voiceIndex = voices.value.findIndex(voice => voice.voiceId === voiceId);
    if (voices.value[voiceIndex].voiceIsShared === false) {
        voices.value[voiceIndex].voiceIsShared = true;
        voices.value[voiceIndex].voiceShareCount++;
    }
    const currentUrl = window.location.href;
    const textToCopy = `${currentUrl}?id=${voiceId}`;
    navigator.clipboard.writeText(textToCopy)
        .then(async () => {
            ElNotification({
                message: "已复制到剪贴板",
                position: 'bottom-right',
            });
            // try {
            //     let result = await discoverUpdateShareService(voiceId);
            // } catch (error) {
            //     console.error('分享服务调用失败:', error);
            //     ElNotification({
            //         message: `分享服务调用失败: ${error.message}`,
            //         position: 'bottom-right',
            //         type: 'error'
            //     });
            // }
        })
        .catch((error) => {
            ElNotification({
                message: `复制失败: ${error.message}`,
                position: 'bottom-right',
                type: 'error'
            });
        });
};

// const toggleLike = async (voice) => {
//     if (voice.voiceIsLiked === 1) {
//         voice.voiceIsLiked = 0;
//         voice.voiceLikeCount--;
//     } else {
//         if (voice.voiceIsLiked === 2) {
//             voice.voiceIsUnliked = false;
//         }
//         voice.voiceIsLiked = 1;
//         voice.voiceLikeCount++;
//     }
//     const editData = {
//         voiceId: voice.voiceId,
//         voiceLikeCount: voice.voiceLikeCount,
//     }
//     let result = await discoverUpdateLikeService(editData);
// };
// const toggleDislike =async(voice) => {
//     if (voice.voiceIsLiked === 2) {
//         // 当前是不喜欢状态，切换为中立
//         voice.voiceIsLiked = 0;
//         voice.voiceIsUnliked = false;
//     } else {
//         // 当前不是不喜欢状态
//         if (voice.voiceIsLiked === 1) {
//             voice.voiceLikeCount--;
//             voice.voiceIsLiked = 0;
//         }
//         voice.voiceIsLiked = 2;
//         voice.voiceIsUnliked = true;
//     }
//     const editData = {
//         voiceId: voice.voiceId,
//         voiceLikeCount: voice.voiceLikeCount,
//     }
//     let result = await discoverUpdateLikeService(editData);
// };
// const toggleCollect = async(voice) => {
//     voice.voiceIsCollected = !voice.voiceIsCollected;
//     if (voice.voiceIsCollected) {
//         voice.voiceCollectCount++;
//     } else {
//         voice.voiceCollectCount--;
//     }
//     const editData = {
//         voiceId: voice.voiceId,
//         voiceCollectCount: voice.voiceCollectCount,
//     }
//     let result = await discoverUpdateCollectService(editData);
// };
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