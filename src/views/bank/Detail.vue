<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header">
                <el-image class="image" :src="voice.voiceImage" fit="cover" />
                <div class="title">{{ voice.voiceName }}</div>
                <div class="voice-detail">
                    <span class="display-detail"> {{ voice.userName }}</span>
                    <div class="dot"></div>
                    <el-icon size="20" style="color: #6b7280;">
                        <Clock />
                    </el-icon>
                    <span class="display-detail">{{ timeDistance(voice.voiceCreationTime) }}</span>
                    <div class="dot"></div>
                    <div class="tag1"> {{ voice.voiceLanguage }}</div>
                    <div class="tag2" v-if="voice.voiceTag !== ''" style="margin-left: 5px;">
                        {{ voice.voiceTag }}
                    </div>
                </div>
                <div class="btns">
                    <el-button size="large" color="black" @click="useVoice(voice.voiceId)">使用声音</el-button>
                    <el-button size="large" color="black"
                        @click="copyDialogVisible = true">克隆模型</el-button>
                    <el-dialog v-model="copyDialogVisible" width="30%" align-center :show-close="false">
                        <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 10px;">克隆模型</div>
                        <span>确认是否克隆该模型，这将为你创建一个不可变更可见性的私有模型</span>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button color="#f4f4f5" plain style="color: black; border: #e4e4e7 1px solid; "
                                    @click="copyDialogVisible = false">取消</el-button>
                                <el-button color="black" @click="copyDialogVisible = false; cloneVoice()">
                                    确认
                                </el-button>
                            </span>
                        </template>
                    </el-dialog>
                    <div class="button">
                        <div class="shared" @click="open"></div>
                    </div>
                    <div class="button">
                        <div class="likefill" v-if="voice.voiceIsLiked === 1" @click="toggleLike(voice)">
                        </div>
                        <div class="like" v-else @click="toggleLike(voice)">
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
                    </div>
                    <el-popover placement="bottom" :width="100" :visible="visiblePopover">
                        <template #reference>
                            <div class="button" @click="visiblePopover = !visiblePopover">
                                <div class="more"></div>
                            </div>
                        </template>
                        <div class="popper" @click="openId">
                            <el-icon size="17" style="background-color: #e0e5eb; border-radius: 6px;padding: 8px;">
                                <CopyDocument />
                            </el-icon>
                            复制模型ID
                        </div>
                        <div class="popper" @click="reportDialogVisible = true">
                            <el-icon size="17" style="background-color: #e0e5eb; border-radius: 6px;padding: 8px;">
                                <WarningFilled />
                            </el-icon>
                            举报模型
                        </div>
                        <el-dialog v-model="reportDialogVisible" width="30%" align-center :show-close="false">
                            <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 10px;">报告模型</div>
                            <div class="dialog">
                                你为什么要举报这个模型?
                                <MySelect :options="reportOptions" :input-width="'432px'" :color="color"
                                    @update:value="handleReportValue" style="margin-bottom: 10px;" />
                                评论（至少20个字符）
                                <MyInputW :message="reportData.desctibe" :placeholder="placeholderTextArea" :type="type"
                                    :rows="rows" @update:message="handleMessageTextArea" />
                            </div>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button color="#f4f4f5" plain style="color: black; border: #e4e4e7 1px solid; "
                                        @click="reportDialogVisible = false">取消</el-button>
                                    <el-button color="black"
                                        @click="reportDialogVisible = false; visiblePopover = false">
                                        确认
                                    </el-button>
                                </span>
                            </template>
                        </el-dialog>
                    </el-popover>
                </div>
            </el-header>
            <el-divider />
            <el-main>
                <el-row class="main">
                    <el-col :span="15">
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
                                        <div v-if="!sample.sampleIsPlaying" class="close" @click="togglePlay(index)">
                                        </div>
                                        <div v-else class="on" @click="togglePlay(index)"></div>
                                    </div>
                                </div>
                                <div style="font-size: small;color: #71717a; padding-top: 10px;">
                                    {{ sample.sampleText }}
                                </div>
                            </el-card>
                        </div>
                    </el-col>
                    <el-col :span="9">
                        <div class="audio-description">
                            <span style="font-size: large;font-weight: 800 ;color: black;">描述</span>
                            <div class="description">
                                {{ voice.voiceDescription }}
                            </div>
                            <el-divider />
                            <div class="two-item">
                                <div class="one-item">
                                    <span class="item-name">总点赞数</span>
                                    {{ voice.voiceLikeCount }}
                                </div>
                                <div class="one-item">
                                    <span class="item-name">总标记数</span>
                                    {{ voice.voiceCollectCount }}
                                </div>
                            </div>
                            <div class="two-item">
                                <div class="one-item">
                                    <span class="item-name">总分享数</span>
                                    {{ voice.voiceShareCount }}
                                </div>
                                <div class="one-item">
                                    <span class="item-name">总使用数</span>
                                    {{ voice.voiceUseCount }}
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script setup>
import { timeDistance } from '@/hooks/display';
import MySelect from '@/components/newComponent/Select.vue'
const color = ref('#ffffff');
import MyInputW from "@/components/newComponent/Input.vue";
const placeholderTextArea = ref("输入您的评论...")
const type = ref('textarea');
const rows = ref("3");
import {
    Clock,
    Star,
    StarFilled,
    CopyDocument,
    WarningFilled
} from '@element-plus/icons-vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute();
const currentVoiceId = route.query ? route.query.id : undefined;
const useVoice = () => {
    router.push({ path: '/explanation', query: { id: currentVoiceId } });
}
const visiblePopover = ref(false)
const copyDialogVisible = ref(false)
const reportDialogVisible = ref(false)
const reportData = ref({
    type: '',
    desctibe: ''
})
const reportOptions = ref([
    { value: '1', label: '无法工作' },
    { value: '2', label: '侵犯版本' },
    { value: '3', label: '其他' },
]);
const handleReportValue = (newValue) => {
    reportData.value.type = newValue;
};
function handleMessageTextArea(newValue) {
    reportData.value.desctibe = newValue;
}
import audioUrl from '@/assets/sound.m4a';
const voice = ref({
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
    voiceIsLiked: '1',
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
    ]
})
import { ref, reactive, onMounted } from 'vue'
const openId = () => {
    navigator.clipboard.writeText(currentVoiceId)
        .then(() => {
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
// 音频实例存储对象
const audioPlayers = reactive({})

// 修改后的播放控制方法
const togglePlay = (index) => {
    const sample = voice.value.voiceSamples[index]
    const playerKey = `-${index}`

    // 如果已经有播放器实例
    if (audioPlayers[playerKey]) {
        const audio = audioPlayers[playerKey]
        if (sample.sampleIsPlaying) {
            audio.pause()
        } else {
            // 暂停所有正在播放的音频
            stopAllAudios()
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

        // 暂停其他音频并播放当前
        stopAllAudios()
        audio.play()
    }

    // 切换当前音频状态
    sample.sampleIsPlaying = !sample.sampleIsPlaying
}

// 停止所有音频的方法
const stopAllAudios = () => {
    Object.entries(audioPlayers).forEach(([key, audio]) => {
        if (!audio.paused) {
            audio.pause()
            // 更新对应样本状态
            const [voiceId, index] = key.split('-')
            voice.value.sample[index].isPlaying = false
        }
    })
}

// 添加组件卸载时的清理
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
    Object.values(audioPlayers).forEach(audio => {
        audio.pause()
        audio.src = ''
    })
})
import { bankQuerySingleDetailService,bankCloneSamplesService } from '@/api/bank/mybank'
onMounted(async () => {
    let result = await bankQuerySingleDetailService(currentVoiceId);
    voice.value = result.data
})
import { ElNotification } from 'element-plus'
const open = () => {
    if (voice.voiceIsShared === false) {
        voice.voiceIsShared = true;
        voice.voiceShareCount++;
    }
    const currentUrl = window.location.href;
    const textToCopy = `${currentUrl}?id=${currentVoiceId}`;
    navigator.clipboard.writeText(textToCopy)
        .then(async () => {
            ElNotification({
                message: "已复制到剪贴板",
                position: 'bottom-right',
            });
            try {
                let result = await discoverUpdateShareService(currentVoiceId);
            } catch (error) {
                console.error('分享服务调用失败:', error);
                ElNotification({
                    message: `分享服务调用失败: ${error.message}`,
                    position: 'bottom-right',
                    type: 'error'
                });
            }
        })
        .catch((error) => {
            ElNotification({
                message: `复制失败: ${error.message}`,
                position: 'bottom-right',
                type: 'error'
            });
        });
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
const cloneVoice = async () => {
    const clone = ref({
        ...voice.value,
        voiceType: '0'
    })
    let result = await bankCloneSamplesService(clone);
}
</script>
<style scoped>
.header {
    height: 40vh;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
}

.image {
    width: 100px;
    height: 100px;
    border-radius: 10px;
}

.title {
    font-size: 30px;
    color: black;
    font-weight: 800;
}

.voice-detail {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
}

.display-detail {
    color: #71717a;
}

.dot {
    width: 8px;
    height: 8px;
    margin: 5px;
    border-radius: 50%;
    background-color: #e5e8eb;
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

.btns {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    gap: 5px;

    .button {
        padding: 10px;
        margin-left: 10px;
        border: #e4e4e7 1px solid;
        border-radius: 6px;
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        cursor: pointer;

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

        .more {
            cursor: pointer;
            width: 20px;
            height: 20px;
            background: url('../../assets/icons/more.svg') no-repeat center / contain;
        }
    }

    .button:hover {
        background-color: #e4e4e5;
    }
}

.popper {
    padding: 5px;
    margin: 3px;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    cursor: pointer;
}

.popper:hover {
    background-color: #e4e4e5;
}

.main {
    overflow: hidden;

}

.audio-samples {
    border: #e4e4e7 1px solid;
    background-color: #FFFFFF;
    padding: 15px;
    border-radius: 6px;
    height: 100%;

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
        cursor: pointer;
        width: 25px;
        height: 25px;
        background: url('../../assets/icons/close.svg') no-repeat center / contain;
    }

    .on {
        cursor: pointer;
        width: 25px;
        height: 25px;
        background: url('../../assets/icons/on.svg') no-repeat center / contain;
    }
}

.audio-description {
    margin-left: 5%;
    border: #e4e4e7 1px solid;
    background-color: #FFFFFF;
    padding: 15px;
    border-radius: 6px;
    height: 100%;

    .description {
        color: #7e8187;
        font-size: small;
        padding-top: 10px;
        height: 10vh;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .two-item {
        margin: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;

        .one-item {
            width: 50%;
            display: flex;
            flex-direction: column;
            gap: 5px;

            .item-name {
                color: #7e8187;
            }
        }
    }
}

.dialog {
    display: flex;
    flex-direction: column;
    color: black;
    gap: 10px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>