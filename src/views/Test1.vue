<template>
    <div>
      <div ref="waveformRef"></div>
      <div v-if="!isRecording" @click="startRecording">Start Recording</div>
      <button @click="stopRecording">Stop Recording</button>
      <audio v-if="recordedUrl" :src="recordedUrl" controls></audio>
      <p v-if="recordedBlobType">文件格式: {{ recordedBlobType.toUpperCase() }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import WaveSurfer from 'wavesurfer.js'
  import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm'
  const isRecording = ref(false);

  // 响应式引用
  const waveformRef = ref(null)
  const wavesurfer = ref(null)
  const record = ref(null)
  const recordedUrl = ref('')
  const recordedBlobType = ref('')
  
  // 初始化波形图
  onMounted(() => {
    wavesurfer.value = WaveSurfer.create({
      container: waveformRef.value,
      waveColor: '#1cb0f6',
      progressColor: '#1cb0f6',
      height: 100,
      barWidth: 10,
      barRadius: 2,
      cursorWidth: 0,
    })
  
    record.value = wavesurfer.value.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: false,
      })
    )
  
    // 录音结束事件
    record.value.on('record-end', (blob) => {
      recordedUrl.value = URL.createObjectURL(blob)
      recordedBlobType.value = blob.type.split(';')[0].split('/')[1] || 'webm'
    })
  })
  
  // 组件卸载前清理
  onBeforeUnmount(() => {
    if (wavesurfer.value) {
      wavesurfer.value.destroy()
    }
  })
  
  // 开始录音
  const startRecording = async () => {
    await record.value.startRecording()
    isRecording.value = true;
  }
  
  // 停止录音
  const stopRecording = () => {
    record.value.stopRecording()
  }
  </script>
  
  <style>
  .waveform {
    width: 100%;
    height: 128px;
  }
  </style>