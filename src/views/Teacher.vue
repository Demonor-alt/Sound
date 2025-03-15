<template>
  <div class="container">
    <!-- 音频控制 -->
    <audio ref="audioRef" :src="audioSrc" @timeupdate="updateHighlight" />
    <button @click="togglePlay">{{ isPlaying ? '暂停' : '播放' }}</button>

    <!-- 高亮文本区域 -->
    <div class="text-container">
      <span v-for="(sentence, index) in sentences" :key="index" :class="{ 'highlight': currentIndex === index }"
        @click="seekTo(index)">
        {{ sentence.text }}&nbsp;
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import audioUrl from '@/assets/sound.m4a';

// 音频源
const audioSrc = ref(audioUrl);

// 句子结构示例（需包含时间信息）
const sentences = reactive([
  { text: 'Hello', start: 0.0, end: 1.2 },
  { text: 'world!', start: 1.2, end: 2.5 },
  { text: 'This is a demo', start: 2.5, end: 4.0 }
]);

const audioRef = ref(null);
const isPlaying = ref(false);
const currentIndex = ref(-1);

// 播放/暂停控制
const togglePlay = () => {
  if (!audioRef.value) return;

  if (audioRef.value.paused) {
    audioRef.value.play();
    isPlaying.value = true;
  } else {
    audioRef.value.pause();
    isPlaying.value = false;
  }
};

// 时间更新监听
const updateHighlight = () => {
  const currentTime = audioRef.value.currentTime;

  // 查找当前对应句子
  const index = sentences.findIndex(s =>
    currentTime >= s.start && currentTime <= s.end
  );

  if (index !== -1 && index !== currentIndex.value) {
    currentIndex.value = index;
  }
};

// 点击句子跳转
const seekTo = (index) => {
  if (index >= 0 && index < sentences.length) {
    audioRef.value.currentTime = sentences[index].start;
    if (!isPlaying.value) audioRef.value.play();
  }
};
</script>

<style>
.highlight {
  background-color: #ffeb3b;
  transition: background-color 0.3s;
}

.text-container {
  line-height: 2;
  font-size: 1.2rem;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

audio {
  margin-bottom: 20px;
}
</style>