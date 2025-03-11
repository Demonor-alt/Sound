<template>
  <div class="congratulations-page">
    <h1 class="title">恭喜通关！</h1>
    <p class="message">你已经成功完成了本次挑战，干得漂亮！</p>
    <div v-if="isSparked === false" class="spark-container">
      <div class="sparkfill"></div>
      <div>{{ sparkCount + 1 }}</div>
    </div>
    <el-button color="black" class="restart-button" @click="toTeach">返回</el-button>
  </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/language';
import { storeToRefs } from 'pinia';
const languageStore = useLanguageStore()
const { language, sparkCount, gemCount, isSparked, currentExperience } = storeToRefs(languageStore);
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
currentExperience.value += 1000/(((isSparked.value ? 0 : 1)+sparkCount.value) *10);
const toTeach = () => {
  router.push('/teach');
  if (isSparked.value === false) {
    isSparked.value = true;
    sparkCount.value += 1;
  }
};
</script>

<style scoped>
.congratulations-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
}

.title {
  font-size: 48px;
  color: #333;
  margin-bottom: 20px;
}

.message {
  font-size: 24px;
  color: #666;
  margin-bottom: 40px;
}

.restart-button {
  width: 200px;
  font-size: large;
  margin-top: 60px;
  padding: 20px
}

.sparkfill {
  width: 130px;
  height: 130px;
  background: url('../../../assets/icons/sparkfill.svg') no-repeat center / contain;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes fill-animation {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.spark-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 30px;
  gap: 20px;
  color: #ff9f17;
  animation: fill-animation 1.0s ease-out;
}
</style>