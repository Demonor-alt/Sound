import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useLanguageStore = defineStore('language', () => {
    const language = ref('');
    const difficulty = ref('');
    function changeMandarin() {
        language.value = 'mandarin';
    }
    function changeEnglish() {
        language.value = 'english';
    }
    function changeCantonese() {
        language.value = 'cantonese';
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
    function changeDifficulty(newValue){
        difficulty.value=newValue
    }
    return {
        language,
        changeMandarin,
        changeEnglish,
        changeCantonese,
        showLanguage,
        difficulty,
        changeDifficulty,
    };
})