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
                    <SoundItem :sortValue="sortValue" :languageValue="languageValue" :tagValue="tagValue" />
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
const tagOptions = ref();
//需要查询标签表
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