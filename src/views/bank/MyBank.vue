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
            <div v-if="voices.length === 0">
                <el-empty description="暂无数据" />
            </div>
            <el-row v-for="voice in filteredVoices" :key="voice.id" class="voice-item">
                <el-col :span="2">
                    <el-image style="width: 70px; height: 70px;border-radius: 10px;" :src="voice.image" fit="cover" />
                </el-col>
                <el-col :span="7">
                    <div style="font-size: 20px; font-weight: 800;padding-bottom: 10px;">{{ voice.name }}</div>
                    <div style="color: #6b7280;">{{ voice.description }}</div>
                </el-col>
                <el-col :span="4">
                    <div class="item">创建时间</div>
                    <div style="display: flex;flex-direction: row; gap: 10px;">
                        <el-icon size="20" style="color: #6b7280;">
                            <Clock />
                        </el-icon>
                        <span style="font-weight: 520;">{{ formatDate(voice.creationTime) }}</span>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="item">状态</div>
                    <div style="padding-top: 3%;">
                        <el-tag type="success" round effect="dark" style="width: 50px;font-weight: 1000;">{{
                            voice.status }}</el-tag>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="item">音频示例</div>
                    <div>
                        <el-popover placement="bottom" :width="400" trigger="click">
                            <template #reference>
                                <div style="display: flex;flex-direction: row;gap: 10px;cursor: pointer;">
                                    <div class="logo"></div>
                                    <span style="color: #71717a;"> {{  voice.samples.length }}&nbsp音频示例</span>
                                </div>
                            </template>
                            <div class="audio-samples">
                                <span style="font-size: large;font-weight: 800 ;color: black;">示例</span>
                                <el-card v-for="(sample, index) in voice.samples" :key="index" class="samples-item"
                                    shadow="never">
                                    <div class="samples-content">
                                        <div>
                                            <span class="samples-index">{{ index + 1 }}</span>
                                            <span>{{ sample.title }}</span>
                                        </div>
                                        <div class="sample-btn">
                                            <div v-if="!sample.isPlaying" class="close" @click="togglePlay(index)">
                                            </div>
                                            <div v-else class="on" @click="togglePlay(index)"></div>
                                        </div>
                                    </div>
                                    <div style="font-size: small;color: #71717a; padding-top: 10px;">
                                        {{ sample.text }}
                                    </div>
                                </el-card>
                            </div>
                        </el-popover>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="btns">
                        <el-button size="large" color="black" @click="useVoice(voice.id)">使用声音</el-button>
                        <el-button size="large" class="btn" circle>
                            <el-icon size="20">
                                <Edit />
                            </el-icon>
                        </el-button>
                        <el-button size="large" class="btn" circle>
                            <el-icon size="20">
                                <Delete />
                            </el-icon>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    Plus,
    Edit,
    Delete,
    Clock
} from '@element-plus/icons-vue';
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import MyInput from '@/components/newComponent/Input.vue'
const myBorderColor = ref('#f5f5f5');
const router = useRouter()

const createNewSound = () => {
    // 跳转到添加员工的页面
    router.push('/createbank')
}
function handleMessage(newMessage) {
    searchText.value = newMessage;
}
// 模拟数据
const voices = ref([
    {
        id: 1,
        userName: 'fc',
        image: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
        name: '55',
        description: '1212',
        creationTime: new Date(2025, 1, 9, 19, 11),
        status: "成功",
        peopleCount: 110000,
        shareCount: 11,
        likeCount: 20,
        collectCount: 10,
        language: 'ch',
        tag: 'aaaaaaaaa',
        isLiked: false,
        isUnliked: false,
        isCollected: false,
        samples: [
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
        peopleCount: 15,
        shareCount: 11,
        likeCount: 20,
        collectCount: 10,
        language: 'en',
        tag: '1',
        isLiked: false,
        isUnliked: false,
        isCollected: false,
        samples: [
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
const searchText = ref('');
const placeholder = ref('搜索声音...');
const filteredVoices = computed(() => {
    return voices.value.filter(voice =>
        voice.name.includes(searchText.value)
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

const useVoice = (id) => {
    router.push({ path: '/explanation', query: { id: id } });
}
import { bankQueryService } from '@/api/bank';
const total = ref(0);
const bankList = async () => {
    try {
        const result = await bankQueryService();
        voices.value = result.data.records;
        total.value = voices.value.length;
    } catch (error) {
        console.error('Failed to ', error);
        voices.value = [];
        total.value = 0;
    }
};

onMounted(() => {
    bankList();
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