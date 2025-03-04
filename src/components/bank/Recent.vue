<template>
    <h2>最近活动</h2>
    <div v-if="voices.length === 0">
        <el-empty description="暂无数据" />
    </div>
    <el-row v-for="voice in voices" :key="voice.id" class="voice-item">
        <el-col :span="5" style="display: flex;align-items: center;justify-content: center;">
            <el-image style=" width: 75px; height: 75px;border-radius: 10px;" :src="voice.image" fit="cover" />
        </el-col>
        <el-col :span="19">
            <div style="font-size: 18px; font-weight: 800;padding-bottom: 10px;">{{ voice.name }}</div>
            <div class="tag">
                <el-tag type="success" round effect="dark" style="width: 50px;font-weight: 1000;">{{
                    voice.status
                }}</el-tag>
                <div style="display: flex;flex-direction: row; gap: 10px;">
                    <el-icon size="20" style="color: #6b7280;">
                        <Clock />
                    </el-icon>
                    <span style="font-weight: 520;color: #71717a;">{{ timeDistance(voice.creationTime) }}</span>
                </div>
            </div>

        </el-col>
    </el-row>
</template>
<script setup>
import {
    Clock,
} from '@element-plus/icons-vue';
import { ref } from 'vue';
import { timeDistance } from '@/hooks/time';
const voices = ref([
    {
        id: 1,
        image: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
        name: '55',
        description: '1212',
        creationTime: new Date(2025, 1, 9, 19, 11),
        status: "成功",
        audioUrl: '/samples/sample1.mp3'
    },
    {
        id: 2,
        image: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
        name: '55',
        description: '1212',
        creationTime: new Date(2025, 1, 9, 19, 11),
        status: "成功",
        audioUrl: '/samples/sample1.mp3'
    },
])
</script>
<style scoped>
.reactivity {
    width: 100%;
    padding-left: 3%;
}

.voice-item {
    background-color: white;
    border-radius: 10px;
    border: #e4e4e7 1px solid;
    display: flex;
    padding: 15px;
    margin-bottom: 20px;

    .tag {
        padding-top: 3%;
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
    }

    .el-col {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }
}
</style>