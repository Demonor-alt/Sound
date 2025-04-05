<script setup>
import { ref } from 'vue'
import ChatPanel from '@/components/ChatPanel.vue'
const isShow = ref(true)
const isRotated = ref(true)
const is3DModelLoad = ref(true)
const ModelAnimations = ref([])
const listModelanimations = (animations) => {
  const data = []
  animations.forEach((animation) => {
    data.push({
      name: animation,
      value: animation
    })
  })
  ModelAnimations.value = data
}
const ModelAnimationSelect = ref('idle')
const ModelPresetsSelect = ref('灰色长裙.glb')
</script>

<template>
  <div class="body">
    <div class="h-full">
      <div class="h-full">
        <div class="w-full h-full relative">
          <section class="wrapper--ipotBxpbNfIjelLtxAqE semi-layout semi-layout-has-sider">
            <ChatPanel :isRotated="isRotated" @changeSideBarDisplay="isShow = !isShow" :isShow="isShow"
              :is3DModelLoad="is3DModelLoad" @listModelanimations="listModelanimations"
              :changeAnimation="ModelAnimationSelect" :ModelPresetsSelect="ModelPresetsSelect" />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.body{
  height: 92vh;
  margin: -19.5px -20.3px -20px -20.3px;
}
</style>