<template>
    <div class="mbody">
        <el-row>
            <el-col :span="14">
                <div class="head">
                    <div style="font-weight: 600;font-size: 28px;">一起来学{{ lan }}发音！</div>
                    <div style="color: #777777;">磨耳朵，练就地道{{ lan }}发音</div>
                    <el-button color="black" size="large" style="width: 300px;margin-bottom: 20px;" @click="toPractise">开始 +10
                        经验</el-button>
                </div>
                <div>
                    <div class="divider">
                        <el-divider style="width: 40%;" />
                        <div style="font-size: 20px;font-weight: 600;"> 元音</div>
                        <el-divider style="width: 40%;" />
                    </div>
                    <div class="voice-list">
                        <div v-for="(vowel, index) in englishVowels" :key="index" class="voice-item">
                            <span style="font-size: large;">{{ vowel.symbol }}</span>
                            <span style="color: #ababab;">{{ vowel.word }}</span>
                            <div class="slider"></div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="9">
                <div style="margin-left: 100px;">
                    <Myaffix/>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import Myaffix from '@/components/teach/Affix.vue';
import { useLanguageStore } from '@/stores/language';
import { onMounted, ref } from 'vue';
const englishVowels = ref([
    { symbol: 'ɑ', word: 'hot' },
    { symbol: 'æ', word: 'cat' },
    { symbol: 'ʌ', word: 'but' },
    { symbol: 'ɛ', word: 'bed' },
    { symbol: 'eɪ', word: 'say' },
    { symbol: 'ɚ', word: 'bird' },
    { symbol: 'ɪ', word: 'ship' },
    { symbol: 'i', word: 'sheep' },
    { symbol: 'ə', word: 'about' },
    { symbol: 'oʊ', word: 'boat' },
    { symbol: 'ʊ', word: 'foot' },
    { symbol: 'u', word: 'food' },
    { symbol: 'aʊ', word: 'cow' },
    { symbol: 'aɪ', word: 'time' },
    { symbol: 'ɔɪ', word: 'boy' }
]);

// const englishConsonants = ref([
//     { symbol: 'b', word: 'book' },
//     { symbol: 'tʃ', word: 'chair' },
//     { symbol: 'd', word: 'day' },
//     { symbol: 'f', word: 'fish' },
//     { symbol: 'g', word: 'go' },
//     { symbol: 'h', word: 'home' },
//     { symbol: 'dʒ', word: 'job' },
//     { symbol: 'k', word: 'key' },
//     { symbol: 'l', word: 'lion' },
//     { symbol: 'm', word: 'moon' },
//     { symbol: 'n', word: 'nose' },
//     { symbol: 'ŋ', word: 'sing' },
//     { symbol: 'p', word: 'pig' },
//     { symbol: 'ɹ', word: 'red' },
//     { symbol: 's', word: 'see' },
//     { symbol: 'ʒ', word: 'measure' },
//     { symbol: 'ʃ', word: 'shoe' },
//     { symbol: 't', word: 'time' },
//     { symbol: 'ð', word: 'then' },
//     { symbol: 'θ', word: 'think' },
//     { symbol: 'v', word: 'very' },
//     { symbol: 'w', word: 'water' },
//     { symbol: 'j', word: 'you' },
//     { symbol: 'z', word: 'zoo' }
// ]);


import { useRouter } from 'vue-router'
const router = useRouter()
const { language, showLanguage } = useLanguageStore();
const lan = ref(showLanguage());
onMounted(() => {
    if (language === '') {
        router.push('/teach/step1');
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
.voice-item:hover{
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