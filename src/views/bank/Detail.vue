<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header">
                <el-image class="image" :src="voice.image" fit="cover" />
                <div class="title">{{ voice.name }}</div>
                <div class="voice-detail">
                    <span class="display-detail"> {{ voice.userName }}</span>
                    <div class="dot"></div>
                    <el-icon size="20" style="color: #6b7280;">
                        <Clock />
                    </el-icon>
                    <span class="display-detail">{{ timeDistance(voice.creationTime) }}</span>
                    <div class="dot"></div>
                    <div class="tag1"> {{ voice.language }}</div>
                    <div class="tag2" v-if="voice.tag !== ''" style="margin-left: 5px;"> {{ voice.tag }}
                    </div>
                </div>
                <div class="btns">
                    <el-button size="large" color="black" @click="useVoice(voice.id)">使用声音</el-button>
                    <el-button size="large" color="black" @click="copyDialogVisible = true">克隆模型</el-button>
                    <el-dialog v-model="copyDialogVisible" width="30%" align-center :show-close="false">
                        <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 10px;">克隆模型</div>
                        <span>确认是否克隆该模型，这将为你创建一个不可变更可见性的私有模型</span>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button color="#f4f4f5" plain style="color: black; border: #e4e4e7 1px solid; "
                                    @click="copyDialogVisible = false">取消</el-button>
                                <el-button color="black" @click="copyDialogVisible = false">
                                    确认
                                </el-button>
                            </span>
                        </template>
                    </el-dialog>
                    <div class="button">
                        <div class="shared" @click="open"></div>
                    </div>
                    <div class="button">
                        <div class="like" v-if="!voice.isLiked"
                            @click="voice.isLiked = !voice.isLiked; voice.likeCount++;"></div>
                        <div class="likefill" v-else @click="voice.isLiked = !voice.isLiked; voice.likeCount--;">
                        </div>
                    </div>
                    <div class="button">
                        <div class="unlike" v-if="!voice.isUnliked" @click="voice.isUnliked = !voice.isUnliked">
                        </div>
                        <div class="unlikefill" v-else @click="voice.isUnliked = !voice.isUnliked"></div>
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
                    </div>
                    <el-popover placement="bottom" :width="100" :visible="visiblePopover">
                        <template #reference>
                            <div class="button" @click="visiblePopover = !visiblePopover">
                                <div class="more"></div>
                            </div>
                        </template>
                        <div class="popper" @click="open">
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
                                <MySelect :options="sortOptions" :input-width="'432px'" :color="color"
                                    @update:value="handleSortValue" style="margin-bottom: 10px;"/>
                                评论（至少20个字符）
                                <MyInputW :message="reportData.desctibe" :placeholder="placeholderTextArea" :type="type"
                                    :rows="rows" @update:message="handleMessageTextArea" />
                            </div>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button color="#f4f4f5" plain style="color: black; border: #e4e4e7 1px solid; "
                                        @click="reportDialogVisible = false">取消</el-button>
                                    <el-button color="black" @click="reportDialogVisible = false; visiblePopover = false">
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
                            <el-card v-for="(sample, index) in voice.sample" :key="index" class="samples-item"
                                shadow="never">
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
                    </el-col>
                    <el-col :span="9">
                        <div class="audio-description">
                            <span style="font-size: large;font-weight: 800 ;color: black;">描述</span>
                            <div class="description">
                                {{ voice.description }}
                            </div>
                            <el-divider />
                            <div class="two-item">
                                <div class="one-item">
                                    <span class="item-name">总点赞数</span>
                                    {{ voice.likeCount }}
                                </div>
                                <div class="one-item">
                                    <span class="item-name">总标记数</span>
                                    {{ voice.collectCount }}
                                </div>
                            </div>
                            <div class="two-item">
                                <div class="one-item">
                                    <span class="item-name">总分享数</span>
                                    {{ voice.shareCount }}
                                </div>
                                <div class="one-item">
                                    <span class="item-name">总使用数</span>
                                    {{ voice.peopleCount }}
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
import { timeDistance } from '@/hooks/time';
import MySelect from '@/components/newComponent/Select.vue'
const color = ref('#ffffff');
import MyInputW from "@/components/newComponent/InputW.vue";
const placeholderTextArea = ref("输入您的评论...")
const type = ref('textarea');
const rows = ref("3");

import { ref } from 'vue';
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
const voiceId = route.query ? route.query.id : undefined;
const useVoice = () => {
    router.push({ path: '/explanation', query: { id: voiceId } });
}
const visiblePopover = ref(false)
const copyDialogVisible = ref(false)
const reportDialogVisible = ref(false)
const reportData = ref({
    type: '',
    desctibe: ''
})
const sortOptions = ref([
    { value: '1', label: '无法工作' },
    { value: '2', label: '侵犯版本' },
    { value: '3', label: '其他' },
]);
const handleSortValue = (newValue) => {
    reportData.value.type = newValue;
};
function handleMessageTextArea(newValue) {
    reportData.value.desctibe = newValue;
}
const voice = ref({
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
})
import { ElNotification } from 'element-plus'

const open = () => {
    visiblePopover.value = false;
    ElNotification({
        message: "已复制到剪贴板",
        position: 'bottom-right',
    })
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