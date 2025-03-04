<template>
    <el-row>
        <el-col :span="17">
            <el-container class="sound-manager">
                <el-header class="display">
                    <div class="title">列表</div>
                    <div class="action-bar">
                        <span class="header-tip">排序</span>
                        <MySelect :options="sortOptions" :input-width="'230px'" :color="color"
                            @update:value="handleSortValue" />
                        <span class="header-tip">语言</span>
                        <MySelect :options="languageOptions" :input-width="'230px'" :color="color"
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
                </el-header>
                <el-main>
                    <SoundItem :voices="filteredVoices" />
                </el-main>
            </el-container>
        </el-col>
        <el-col :span="5">111</el-col>
    </el-row>
</template>

<script setup>
import SoundItem from '@/components/bank/SoundItem.vue'
import { ref, computed } from 'vue'
import {
    Operation,
} from '@element-plus/icons-vue';
import { ElButton } from 'element-plus'
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
                url: '@/assets/sound.m4a'
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
                url: ''
            },
        ],
    },
]);
const filteredVoices = computed(() => {
    let result = [...voices.value];
    if (tagValue.value === '') {
        result = [...voices.value];
    }
    else if (tagValue.value !== '') {
        result = result.filter(voice => voice.tag === tagValue.value);
    }
    if (languageValue.value !== '1') {
        result = result.filter(voice => voice.language === languageValue.value);
    }
    if (sortValue.value === '2') {
        result.sort(((a, b) => new Date(b.creationTime) - new Date(a.creationTime)));
    } else if (sortValue.value === '1') {
        result.sort(((a, b) => b.peopleCount - a.peopleCount));
    }
    return result;
});
import MySelect from '@/components/newComponent/Select.vue'
const color = ref('#f5f5f5');
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
import MySelectChange from '@/components/newComponent/SelectChange.vue'
const visiblePopover = ref(false);

</script>

<style scoped>
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
.btn{
    background-color: #f5f5f5;
}
.btn:hover {
    background-color: #f4f4f5 !important;
    border: #606266 1px solid !important;
}

::v-deep(.btn:hover .el-icon) {
    color: #606266 !important;
}
</style>