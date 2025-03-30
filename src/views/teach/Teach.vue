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
            { memberSymbol: 'ɑ', memberWord: 'hot', memberUrl: '' },
            { memberSymbol: 'æ', memberWord: 'cat', memberUrl: '' },
            { memberSymbol: 'ʌ', memberWord: 'but', memberUrl: '' },
            { memberSymbol: 'ɛ', memberWord: 'bed', memberUrl: '' },
            { memberSymbol: 'eɪ', memberWord: 'say', memberUrl: '' },
            { memberSymbol: 'ɚ', memberWord: 'bird', memberUrl: '' },
            { memberSymbol: 'ɪ', memberWord: 'ship', memberUrl: '' },
            { memberSymbol: 'i', memberWord: 'sheep', memberUrl: '' },
            { memberSymbol: 'ə', memberWord: 'about', memberUrl: '' },
            { memberSymbol: 'oʊ', memberWord: 'boat', memberUrl: '' },
            { memberSymbol: 'ʊ', memberWord: 'foot', memberUrl: '' },
            { memberSymbol: 'u', memberWord: 'food', memberUrl: '' },
            { memberSymbol: 'aʊ', memberWord: 'cow', memberUrl: '' },
            { memberSymbol: 'aɪ', memberWord: 'time', memberUrl: '' },
            { memberSymbol: 'ɔɪ', memberWord: 'boy', memberUrl: '' }
        ]
    },
    {
        pronounceType: '辅音',
        members: [
            { memberSymbol: 'b', memberWord: 'book', memberUrl: '' },
            { memberSymbol: 'tʃ', memberWord: 'chair', memberUrl: '' },
            { memberSymbol: 'd', memberWord: 'day', memberUrl: '' },
            { memberSymbol: 'f', memberWord: 'fish', memberUrl: '' },
            { memberSymbol: 'g', memberWord: 'go', memberUrl: '' },
            { memberSymbol: 'h', memberWord: 'home', memberUrl: '' },
            { memberSymbol: 'dʒ', memberWord: 'job', memberUrl: '' },
            { memberSymbol: 'k', memberWord: 'key', memberUrl: '' },
            { memberSymbol: 'l', memberWord: 'lion', memberUrl: '' },
            { memberSymbol: 'm', memberWord: 'moon', memberUrl: '' },
            { memberSymbol: 'n', memberWord: 'nose', memberUrl: '' },
            { memberSymbol: 'ŋ', memberWord: 'sing', memberUrl: '' },
            { memberSymbol: 'p', memberWord: 'pig', memberUrl: '' },
            { memberSymbol: 'ɹ', memberWord: 'red', memberUrl: '' },
            { memberSymbol: 's', memberWord: 'see', memberUrl: '' },
            { memberSymbol: 'ʒ', memberWord: 'measure', memberUrl: '' },
            { memberSymbol: 'ʃ', memberWord: 'shoe', memberUrl: '' },
            { memberSymbol: 't', memberWord: 'time', memberUrl: '' },
            { memberSymbol: 'ð', memberWord: 'then', memberUrl: '' },
            { memberSymbol: 'θ', memberWord: 'think', memberUrl: '' },
            { memberSymbol: 'v', memberWord: 'very', memberUrl: '' },
            { memberSymbol: 'w', memberWord: 'water', memberUrl: '' },
            { memberSymbol: 'j', memberWord: 'you', memberUrl: '' },
            { memberSymbol: 'z', memberWord: 'zoo', memberUrl: '' }
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
// import { teachQueryService } from '@/api/teach';
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
        // let result=await teachQueryService(languageType);
        // pronounces.value = result.data;
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