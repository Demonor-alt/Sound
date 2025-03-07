<template>
    <h2>最近活动</h2>
    <div v-if="voiceList.length === 0">
        <el-empty description="暂无数据" />
    </div>
    <el-row v-for="voice in voiceList" :key="voice.voiceId" class="voice-item">
        <el-col :span="5" style="display: flex;align-items: center;justify-content: center;">
            <el-image style=" width: 75px; height: 75px;border-radius: 10px;" :src="voice.voiceImage" fit="cover" />
        </el-col>
        <el-col :span="19">
            <div style="font-size: 18px; font-weight: 800;padding-bottom: 10px;">{{ voice.voiceName }}</div>
            <div class="tag">
                <el-tag type="success" round effect="dark" style="width: 50px;font-weight: 1000;">成功</el-tag>
                <div class="dot"></div>
                <div style="display: flex;flex-direction: row; gap: 10px;">
                    <el-icon size="20" style="color: #6b7280;">
                        <Clock />
                    </el-icon>
                    <span style="font-weight: 520;color: #71717a;">{{ timeDistance(voice.voiceCreationTime) }}</span>
                </div>
            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import { Clock } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import { timeDistance } from '@/hooks/time';
const voiceList = ref([
    {
        "voiceId": 70,
        "voiceImage": "https://loremflickr.com/400/400?lock=567532027855895",
        "voiceName": "曲志明",
        "voiceDescription": "例面求上。果圆相称斗织是。开电年。同利算术极七等被来。问广十世。",
        "voiceCreationTime": "2024-04-22 00:28:31",
        "voiceIsCollected": true,
        "voiceSamples": [
            {
                "sampleId": 83,
                "sampleIsPlaying": false,
                "sampleTitle": "拨伟大快但是脊梁",
                "sampleText": "consectetur",
                "sampleUrl": "https://nutritious-designation.com/"
            }
        ]
    }
]);
import { useTokenStore } from '@/stores/token';
const token = useTokenStore();
import { bankQueryService } from "@/api/bank/mybank";
onMounted(async () => {
    let result = await bankQueryService(token.token.userId);
    voiceList.value = result.data;
})
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
    transition: all 0.3s ease; 

    .tag {
        padding-top: 3%;
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        .dot {
            width: 8px;
            height: 8px;
            margin: 5px;
            border-radius: 50%;
            background-color: #e5e8eb;
        }
    }
    .el-col {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }
}
.voice-item:hover {
    border-color: #ccc; 
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); 
}
</style>