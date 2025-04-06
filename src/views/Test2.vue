<template>
    <div class="audio-player">
        <audio ref="audioRef" :src="audioUrl" @timeupdate="updateTime" @loadedmetadata="updateDuration"></audio>

        <div class="controls">
            <button @click="togglePlay">
                {{ isPlaying ? '⏸️ 暂停' : '▶️ 播放' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const audioUrl = 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/76bd030b-ab79-41b5-a8ee-5a64f8c32504.mp3'
const audioRef = ref(null)
const isPlaying = ref(false)

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
</script>