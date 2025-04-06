<template>
    <div class="audio-player">
      <audio ref="audioRef" :src="audioUrl" @timeupdate="updateTime" @loadedmetadata="updateDuration"></audio>
      
      <div class="controls">
        <button @click="togglePlay">
          {{ isPlaying ? '⏸️ 暂停' : '▶️ 播放' }}
        </button>
        
        <span class="time">{{ formatTime(currentTime) }}</span>
        
        <div 
          class="progress-bar" 
          @mousedown="startDragging"
          @click="handleProgressClick"
        >
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        
        <span class="time">{{ formatTime(duration) }}</span>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          v-model.number="volume"
          class="volume"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  
  const audioUrl = 'http://fo9c.cn/wp-content/uploads/2025/04/Little-Barrie-Barrie-Cadogan-Lewis-Wharton-Virgil-Howe-Better-Call-Saul-Main-Title-Theme-Extended.mp3'
  
  // 响应式状态
  const audioRef = ref(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const progress = ref(0)
  const volume = ref(1)
  const draging = ref(false)
  
  // 格式化时间显示（MM:SS）
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }
  
  // 播放/暂停切换
  const togglePlay = () => {
    if (!audioRef.value) return
    
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
  
  // 更新时间进度
  const updateTime = (e) => {
    if (!draging.value) {
      currentTime.value = e.target.currentTime
      progress.value = (currentTime.value / duration.value) * 100
    }
  }
  
  // 获取音频总时长
  const updateDuration = (e) => {
    duration.value = e.target.duration
  }
  
  // 进度条点击处理
  const handleProgressClick = (e) => {
    if (!audioRef.value) return
    
    const rect = e.target.getBoundingClientRect()
    const percentage = (e.clientX - rect.left) / rect.width
    audioRef.value.currentTime = percentage * duration.value
  }
  
  // 进度条拖拽处理
  const startDragging = (e) => {
    draging.value = true
    document.addEventListener('mousemove', handleDragging)
    document.addEventListener('mouseup', stopDragging)
  }
  
  const handleDragging = (e) => {
    if (!audioRef.value || !draging.value) return
    
    const rect = audioRef.value.parentElement
      .querySelector('.progress-bar')
      .getBoundingClientRect()
      
    let percentage = (e.clientX - rect.left) / rect.width
    percentage = Math.max(0, Math.min(1, percentage))
    
    currentTime.value = percentage * duration.value
    progress.value = percentage * 100
  }
  
  const stopDragging = () => {
    draging.value = false
    audioRef.value.currentTime = currentTime.value
    document.removeEventListener('mousemove', handleDragging)
    document.removeEventListener('mouseup', stopDragging)
  }
  
  // 音量控制
  watch(volume, (newVal) => {
    if (audioRef.value) {
      audioRef.value.volume = newVal
    }
  })
  </script>
  
  <style scoped>
  .audio-player {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
  }
  
  .controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  button {
    padding: 8px 16px;
    cursor: pointer;
  }
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background: #ddd;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
  }
  
  .progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: #42b883;
    border-radius: 3px;
    transition: width 0.1s linear;
  }
  
  .time {
    font-family: monospace;
    font-size: 14px;
  }
  
  .volume {
    width: 80px;
  }
  </style>