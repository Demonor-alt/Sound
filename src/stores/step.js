import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useStepStore = defineStore('step', () => {
    const step = ref(1);
    function incrementStep() {
        step.value = 2;
    }
    function reduceStep() {
        step.value=1;
    }
    return {
        step,
        incrementStep,
        reduceStep
    };
})