<template>
  <div class="congratulations-page">
    <h1 class="title">恭喜通关！</h1>
    <p class="message">你已经成功完成了本次挑战，干得漂亮！</p>
    <button class="restart-button" @click="toTeach">返回</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const toTeach = () => {
  router.push('/teach');
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
  padding: 15px 30px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.restart-button:hover {
  background-color: #0056b3;
}
</style>