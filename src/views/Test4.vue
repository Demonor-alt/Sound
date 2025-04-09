<template>
    <div class="gap">
      <img v-if="isPlaying === false" @click="startPlayback" class="audio_icon"
        :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }" src="../assets/icons/close2.svg"
        alt="播放" />
      <img v-else @click="startPlayback" class="audio_icon"
        :style="{ width: buttonSize + 'px', height: buttonSize + 'px' }" src="../assets/icons/on.svg" alt="暂停" />
      
      <!-- 时间显示 -->
      <div class="time-display">
        <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      </div>
  
      <!-- 进度条 -->
      <div class="progress-bar">
        <el-slider v-model="progress" :show-tooltip="false" :max="100" @input="updateProgress"
          :disabled="!isPlaying" class="slider_box" :style="{ width: sliderLength + 'px' }" />
      </div>
  
      <!-- 音量控制 -->
      <div class="volume-control">
        <div class="volume_progress" v-show="audioHuds">
          <el-slider show-tooltip="false" vertical height="100px" class="volume-input"  v-model="volume" step="0.01"
            @input="setVolume" />
        </div>
        <img class="volume_icon" v-if="volume <= 0" @click.stop="audioHuds = !audioHuds"
          src="../assets/icons/mute.svg" alt="" />
        <img class="volume_icon" v-if="volume > 0" @click.stop="audioHuds = !audioHuds"
          src="../assets/icons/speaker.svg" alt="" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { Howl } from 'howler';
  import { ref } from 'vue';
  import { ElSlider } from 'element-plus';
  import 'element-plus/dist/index.css';
  
  const isPlaying = ref(false);
  const sound = ref(null);
  const progress = ref(0);
  const volume = ref(1);
  const currentTime = ref(0);
  const duration = ref('--');
  const audioHuds = ref(false);
  const sliderLength = ref(300); // 进度条长度，可以根据需要调整
  
  function formatTime(seconds) {
      if (seconds === '--') return '--';
      const minutes = Math.floor(seconds / 60);
      const secondsRemaining = Math.floor(seconds % 60);
      return `${minutes}:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;
  }
  
  function updateProgress() {
      if (sound.value) {
          sound.value.seek((progress.value / 100) * duration.value);
      }
  }
  
  function setVolume() {
      if (sound.value) {
          sound.value.volume(volume.value);  // 直接设置音量
      }
  }
  
  async function startPlayback() {
      // 如果音频正在播放且被点击暂停按钮
      if (isPlaying.value) {
          sound.value.pause();
          isPlaying.value = false;
          currentTime.value = 0;
          progress.value = 0;
          return; // 退出方法
      } else {
          isPlaying.value = true;
      }
      const formData = new FormData();
      formData.append('text', "在信息爆炸的时代，我们每天被海量的数据包围，而阅读，这一古老的行为...");
      formData.append('text_lang', 'zh');
      formData.append('prompt_lang', 'zh');
      formData.append('streaming_mode', 'true');
      formData.append('ref_audio_path', "D://雷军.mp3");
  
      console.log('最终 FormData 内容:', Array.from(formData.entries()));
      const queryParams = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
          queryParams.append(key, value);
      }
      const apiUrl = `/api2/tts?${queryParams.toString()}`;
  
      sound.value = new Howl({
          src: [apiUrl],
          xhr: {
              method: 'GET',
          },
          html5: true,
          volume: volume.value, 
          format: ['wav'],
          onplay: () => {
              updateProgressInterval();
          },
          onload: () => {
              if (sound.value.duration() && sound.value.duration() !== Infinity) {
                  duration.value = sound.value.duration(); // 获取音频总时长
              }
          },
          onend: () => {
              isPlaying.value = false;
              currentTime.value = 0;
              progress.value = 0;
          },
          onloaderror: (id, error) => {
              console.error('音频加载失败', error);
              error.value = "音频加载失败";
              isPlaying.value = false;
          }
      });
      sound.value.play();
  }
  
  // 更新进度条
  function updateProgressInterval() {
      const interval = setInterval(() => {
          if (sound.value && isPlaying.value) {
              currentTime.value = sound.value.seek();
              if (duration.value !== '--') {
                  progress.value = (currentTime.value / duration.value) * 100;
              }
          } else {
              clearInterval(interval);
          }
      }, 500);
  }
  </script>
  