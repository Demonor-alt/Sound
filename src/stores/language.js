import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useLanguageStore = defineStore('language', () => {
    const language = ref('');
    const difficulty = ref('');
    const sparkCount=ref(0);
    const gemCount=ref(50);
    function changeLanguage(newValue) {
        language.value = newValue;
    }
    function showLanguage() {
        if (language.value === 'mandarin') {
            return '普通话';
        } else if (language.value === 'english') {
            return '英语';
        } else if(language.value === 'cantonese') {
            return '粤语';
        }
    }
    function changeDifficulty(newValue) {
        difficulty.value=newValue
    }
    return {
        language,
        changeLanguage,
        showLanguage,
        difficulty,
        changeDifficulty,
        sparkCount,
        gemCount
    };
})