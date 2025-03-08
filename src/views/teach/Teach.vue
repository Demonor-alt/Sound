<template>
    <div class="mbody">
        <el-row>
            <el-col :span="14">
                <div class="head">
                    <div style="font-weight: 600;font-size: 28px;">一起来学{{ currentLanguage }}发音！</div>
                    <div style="color: #777777;">磨耳朵，练就地道{{ currentLanguage }}发音</div>
                    <el-button color="black" size="large" style="width: 300px;margin-bottom: 20px;"
                        @click="toPractise">开始 +10
                        经验</el-button>
                </div>
                <div v-for="pronounce in pronounces">
                    <div class="divider">
                        <el-divider style="width: 40%;" />
                        <div style="font-size: 20px;font-weight: 600;"> {{ pronounce.pronounceType }}</div>
                        <el-divider style="width: 40%;" />
                    </div>
                    <div class="voice-list">
                        <div v-for="(sound, index) in pronounce.members" :key="index" class="voice-item"
                            @click="playAudio(sound.memberUrl)">
                            <span style="font-size: large;">{{ sound.memberSymbol }}</span>
                            <span style="color: #ababab;">{{ sound.memberWord }}</span>
                            <div class="slider"></div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="9">
                <div style="margin-left: 100px;">
                    <Myaffix />
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import Myaffix from '@/components/teach/Affix.vue';
import { useLanguageStore } from '@/stores/language';
import { onMounted, ref } from 'vue';
import audioUrl from '@/assets/sound.m4a';
const pronounces = ref([
    {
        pronounceType: '元音',
        members: [
            { memberSymbol: 'ɑ', memberWord: 'hot', memberUrl: audioUrl },
            { memberSymbol: 'æ', memberWord: 'cat', memberUrl: audioUrl },
            { memberSymbol: 'ʌ', memberWord: 'but', memberUrl: audioUrl },
            { memberSymbol: 'ɛ', memberWord: 'bed', memberUrl: audioUrl },
            { memberSymbol: 'eɪ', memberWord: 'say', memberUrl: audioUrl },
            { memberSymbol: 'ɚ', memberWord: 'bird', memberUrl: audioUrl },
            { memberSymbol: 'ɪ', memberWord: 'ship', memberUrl: audioUrl },
            { memberSymbol: 'i', memberWord: 'sheep', memberUrl: audioUrl },
            { memberSymbol: 'ə', memberWord: 'about', memberUrl: audioUrl },
            { memberSymbol: 'oʊ', memberWord: 'boat', memberUrl: audioUrl },
            { memberSymbol: 'ʊ', memberWord: 'foot', memberUrl: audioUrl },
            { memberSymbol: 'u', memberWord: 'food', memberUrl: audioUrl },
            { memberSymbol: 'aʊ', memberWord: 'cow', memberUrl: audioUrl },
            { memberSymbol: 'aɪ', memberWord: 'time', memberUrl: audioUrl },
            { memberSymbol: 'ɔɪ', memberWord: 'boy', memberUrl: audioUrl }
        ]
    },
    {
        pronounceType: '辅音',
        members: [
            { memberSymbol: 'b', memberWord: 'book', memberUrl: audioUrl },
            { memberSymbol: 'tʃ', memberWord: 'chair', memberUrl: audioUrl },
            { memberSymbol: 'd', memberWord: 'day', memberUrl: audioUrl },
            { memberSymbol: 'f', memberWord: 'fish', memberUrl: audioUrl },
            { memberSymbol: 'g', memberWord: 'go', memberUrl: audioUrl },
            { memberSymbol: 'h', memberWord: 'home', memberUrl: audioUrl },
            { memberSymbol: 'dʒ', memberWord: 'job', memberUrl: audioUrl },
            { memberSymbol: 'k', memberWord: 'key', memberUrl: audioUrl },
            { memberSymbol: 'l', memberWord: 'lion', memberUrl: audioUrl },
            { memberSymbol: 'm', memberWord: 'moon', memberUrl: audioUrl },
            { memberSymbol: 'n', memberWord: 'nose', memberUrl: audioUrl },
            { memberSymbol: 'ŋ', memberWord: 'sing', memberUrl: audioUrl },
            { memberSymbol: 'p', memberWord: 'pig', memberUrl: audioUrl },
            { memberSymbol: 'ɹ', memberWord: 'red', memberUrl: audioUrl },
            { memberSymbol: 's', memberWord: 'see', memberUrl: audioUrl },
            { memberSymbol: 'ʒ', memberWord: 'measure', memberUrl: audioUrl },
            { memberSymbol: 'ʃ', memberWord: 'shoe', memberUrl: audioUrl },
            { memberSymbol: 't', memberWord: 'time', memberUrl: audioUrl },
            { memberSymbol: 'ð', memberWord: 'then', memberUrl: audioUrl },
            { memberSymbol: 'θ', memberWord: 'think', memberUrl: audioUrl },
            { memberSymbol: 'v', memberWord: 'very', memberUrl: audioUrl },
            { memberSymbol: 'w', memberWord: 'water', memberUrl: audioUrl },
            { memberSymbol: 'j', memberWord: 'you', memberUrl: audioUrl },
            { memberSymbol: 'z', memberWord: 'zoo', memberUrl: audioUrl }
        ]
    }
])
const playAudio = (url) => {
    if (url) {
        const audio = new Audio(url);
        audio.play();
    }
}
import { useRouter } from 'vue-router'
const router = useRouter()
const { language, showLanguage } = useLanguageStore();
const currentLanguage = ref(showLanguage());
import { teachQueryService } from '@/api/teach';
onMounted(async() => {
    if (language === '') {
        router.push('/teach/step1');
    }
    else {
        let languageType;
        if (language === 'mandarin') {
            languageType = 0;
        } else if (language === 'english') {
            languageType = 1;
        } else if (language === 'cantonese') {
            languageType = 2;
        }
        let result=await teachQueryService(languageType);
        pronounces.value = result.data;
    }
})
const toPractise = () => {
    router.push('/teach/practise');
}
</script>
<style scoped>
.mbody {
    margin: 1% 10%;
}

.head {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    justify-content: center;
}

header {
    margin-bottom: 20px;
}

.divider {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    padding-left: 10%;
}

.voice-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: end;
}

.voice-item {
    margin: 10px;
    padding: 10px;
    border: 2px solid #e5e5e5;
    border-radius: 15px;
    width: 150px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-bottom-width: 4px;
    transition: border-bottom-width 0.1s;
    cursor: pointer;
    justify-content: center;
    align-items: center;
}

.voice-item:hover {
    background-color: #f0f0f0;
}

.voice-item:active {
    border-bottom-width: 2px;
}

.slider {
    width: 50px;
    height: 9px;
    background-color: #e5e5e5;
    border-radius: 20px;
}
</style>