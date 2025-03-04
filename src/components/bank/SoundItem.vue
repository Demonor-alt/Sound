<template>
    <div v-if="voices.length === 0">
        <el-empty description="暂无数据" />
    </div>
    <el-row v-for="voice in voices" :key="voice.id" class="voice-item">
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
                                    <div v-if="!sample.isPlaying" class="close" @click="togglePlay(voice.id, index)">
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
import { ref, defineProps } from 'vue'
import { timeDistance } from '@/hooks/time';
const props = defineProps({
    voices: {
        type: Array,
        required: true
    }
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
    const voiceIndex = props.voices.findIndex(voice => voice.id === id);
    if (props.voices[voiceIndex].isShared === false) {
        props.voices[voiceIndex].isShared =true;
        props.voices[voiceIndex].shareCount++;
    }
    ElNotification({
        message: "已复制到剪贴板",
        position: 'bottom-right',
    })
}
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