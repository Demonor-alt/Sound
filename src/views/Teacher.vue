<template>
  <el-row>
    <el-col :span="12">
      <div>
        <audio v-if="audioSrc" :src="audioSrc" controls class="audio-player"
          style="margin-top: 20px;">您的浏览器不支持音频播放</audio>
        <div v-if="queryVoiceId === undefined">
          <h3>输入音频</h3>
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="上传音频" name="second">
              <div class="audio-upload">
                <el-upload class="upload-component" accept="audio/*" :before-upload="handleFileUpload"
                  :show-file-list="false" :file-list="files" :on-remove="handleRemove" :limit="0">
                  <template #default>
                    <div class="upload-button">
                      <div class="insert"></div>
                      <h5>添加或删除您的音频文件</h5>
                    </div>
                  </template>
                </el-upload>
              </div>
            </el-tab-pane>
            <el-tab-pane label="录制音频" name="first">
              <div class="audio-player">
                <div v-if="!recording" @click="startRecording" class="record">
                  <div class="inRecord"></div>
                  点击开始录制
                </div>
                <div v-else @click="stopRecording" class="record">
                  <div class="noRecord"></div>
                  停止录制
                </div>
                <div style="font-size: small;color: #6b7280;margin-left: 20px;">
                  *您可以使用自己的文本或下面的建议文本录制您的声音。</div>
                <Store />
              </div>
            </el-tab-pane>
            <div class="audio-upload">
              <el-row v-for="(file, index) in files" :key="index" class="files">
                <el-col :span="2" class="logo"></el-col>
                <el-col :span="13" class="file">
                  {{ file.name }}
                  <div class="size">{{ file.size }}</div>
                </el-col>
                <el-col :span="4">{{ file.duration }}</el-col>
                <el-col :span="4" class="btns">
                  <div v-if="!file.isPlaying" class="close" @click="togglePlay(index)"></div>
                  <div v-else class="on" @click="togglePlay(index)"></div>
                  <el-icon @click="deleteFile(index)" class="delete-btn" size="25">
                    <Close />
                  </el-icon>
                </el-col>
              </el-row>
            </div>
          </el-tabs>
        </div>
        <button v-if="queryVoiceId === undefined" class="next-btn" @click="createAction">创建</button>
        <div v-else class="btnssecond">
          <button class="next-btn" @click="toStep2AndUpdate">保存</button>
          <button class="skip" @click="toStep2">跳过</button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
const samples = ref([{
  sampleId: '',
  sampleTitle: '',
  sampleText: '',
  sampleUrl: '',
  sampleIsPlaying: false,
}]);
import { useRoute } from 'vue-router'
const route = useRoute();
const queryVoiceId = route.query ? route.query.id : undefined;
const files = ref([]);
const recording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const start = ref();
const end = ref();
//录制音频
const startRecording = async () => {
  start.value = new Date();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };
    mediaRecorder.value.start();
    recording.value = true;
    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: "audio/mp3" });
      audioBlob.value = audioBlob;
      recording.value = false;
      stream.getTracks().forEach(track => track.stop());
      createRecording(audioBlob);
    };
  } catch (error) {
    console.error("获取音频流失败：", error);
  }
};
function calculateTimeDifferenceInSeconds(dateStr1, dateStr2) {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  const differenceInMillis = Math.abs(date2.getTime() - date1.getTime());
  const differenceInSeconds = Math.floor(differenceInMillis / 1000);
  return differenceInSeconds;
}
const createRecording = async (blob) => {
  end.value = new Date();
  const newRecording = {
    name: `record-${files.value.length + 1}.mp3`,
    url: URL.createObjectURL(blob),
    blob: blob,
    duration: `${calculateTimeDifferenceInSeconds(start.value, end.value)}s`,
    size: formatFileSize(blob.size),
    file: new File([blob], `record-${files.value.length + 1}.mp3`, { type: 'audio/mp3' })
  };
  files.value.unshift(newRecording);
};
const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    recording.value = false;
  }
};
const formatFileSize = (bytes) => {
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} KB`;
};
const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds === Infinity) {
    return '未知';
  }
  return `${Math.floor(seconds)}s`;
};
//上传音频
const handleFileUpload = async (file) => {
  const audioUrl = URL.createObjectURL(file);
  const audio = new Audio(URL.createObjectURL(file));
  await new Promise((resolve) => {
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      const formattedDuration = formatDuration(duration);
      const fileInfo = {
        name: file.name,
        size: formatFileSize(file.size),
        duration: formattedDuration,
        isPlaying: false,
        url: audioUrl,
        file: file, // 保存文件对象
        actualDuration: duration // 新增：将实际音频时长（秒）添加到文件信息中
      };
      files.value.push(fileInfo);
      resolve();
    });
  });
  return false;
};
// 播放音频
const audioInstances = reactive({});
const togglePlay = (index) => {
  const file = files.value[index]
  // 如果已有实例则复用
  if (!audioInstances[index]) {
    audioInstances[index] = new Audio(file.url)
  }
  const audio = audioInstances[index]
  if (file.isPlaying) {
    audio.pause()
  } else {
    // 暂停所有正在播放的音频
    Object.entries(audioInstances).forEach(([key, instance]) => {
      if (key != index && !instance.paused) {
        instance.pause()
        files.value[key].isPlaying = false
      }
    })
    audio.play()
  }
  // 更新播放状态
  file.isPlaying = !file.isPlaying
  // 添加播放结束监听
  audio.addEventListener('ended', () => {
    file.isPlaying = false
  })
}

// 修改删除文件方法
const deleteFile = (index) => {
  // 停止播放并释放资源
  if (audioInstances[index]) {
    audioInstances[index].pause()
    audioInstances[index].src = ''
    delete audioInstances[index]
  }
  files.value.splice(index, 1)
}
const activeName = ref('second');
const toStep2 = () => {
  stepStore.incrementStep();
}

import { ref, reactive, onMounted } from 'vue';
import {
  Close,
} from '@element-plus/icons-vue';
import Store from '@/components/bank/Store.vue';
import { useStepStore } from '@/stores/step';
const stepStore = useStepStore()
const currentVoiceId = ref('');
const insertData = ref({
  voiceType: '1',
  voiceImage: '',
  voiceName: '',
  voiceDescription: '',
  voiceTag: '',
  voiceLanguage: 1,
});


import { bankQueryDetailService, bankUpdateService, bankInsertMySampleService } from '@/api/bank/mybank'
const audioSrc = ref();
const sendAudiosToBackend = async () => {
  const formData = new FormData();
  formData.append('text', "在信息爆炸的时代，我们每天被海量的数据包围，而阅读，这一古老的行为，却依旧散发着独特且强大的魅力，拥有着不可估量的力量。​阅读是一座取之不尽的知识宝库。通过书籍，我们能穿越时空，与古圣先贤对话。翻开《论语》，便能聆听孔子及其弟子的智慧言论，体悟为人处世的准则与道德修养的真谛；研读《物种起源》，跟随达尔文的脚步，探索生命演化的奥秘，了解物种如何在漫长岁月中适应环境、不断进化。无论是历史、科学、文学还是艺术，每一本书都是作者知识与经验的结晶，阅读使我们能在有限的生命里，汲取无限的知识养分，拓宽认知边界，丰富精神世界。​阅读能够深度拓展我们的思维。当沉浸在一本推理小说中，如阿加莎・克里斯蒂的作品，我们会跟随主角的视角，抽丝剥茧地分析线索，从错综复杂的情节中推断出真相，这一过程极大地锻炼了逻辑思维能力。而阅读哲学书籍，像尼采的《查拉图斯特拉如是说》，那些深邃的思想和独特的观点，会促使我们突破常规思维的局限，以全新视角审视世界、思考人生意义，培养批判性思维与创新思维，让我们在面对生活中的问题时，能从更多维度去分析和解决。​阅读更是心灵的滋养剂。在疲惫的生活中，一本温暖的治愈系书籍能成为心灵的避风港。当我们翻开《小王子》，被那纯真的故事和深刻的哲理触动，小王子与狐狸之间真挚的情感，让我们重新审视人与人之间的关系，唤起内心深处那份被遗忘的童真与善良，抚平生活带来的焦虑与创伤。文学作品中的优美语句，如潺潺溪流，润泽我们的心田，让我们在喧嚣尘世中寻得片刻宁静，感受到人性的美好与生命的价值。​阅读的力量，还在于它能引发共鸣，连接不同的灵魂。当我们读到与自己经历相似、情感契合的文字时，那种心有灵犀的感觉，仿佛在茫茫人海中找到了知音。这种共鸣跨越了年龄、性别、地域的界限，让全球的读者因共同喜爱的书籍相聚在一起，分享感悟，交流思想，形成一个庞大而温暖的精神共同体。​阅读，以无声的力量塑造着我们的知识体系、思维模式和心灵世界，如同点点繁星，照亮我们前行的道路，引领我们在人生旅途中不断探索、成长，领略世间无尽的美好。​不知你对这篇关于阅读力量的文章是否满意？要是你希望更换主题，或是在风格、内容侧重点上有其他想法，都能跟我讲，我会据此修改。");
  formData.append('text_lang', 'zh');
  formData.append('prompt_lang', 'zh');
  formData.append('media_type', 'mp3');


  for (const file of files.value) {
    // 直接从 file.file 获取已存在的 File 对象
    formData.append('ref_audio', file.file);
  }

  console.log('最终 FormData 内容:', Array.from(formData.entries()));

  const audioElement = ref(null);
  const audioContext = new AudioContext();
  const sourceNode = ref(null);
  // 处理流式接收和播放音频

  const response = await fetch("/api2/tts", { method: 'POST' ,body:formData});
  const reader = response.body.getReader();
  const audioBufferArray = [];

  // 读取流并拼接数据
  const processStream = async () => {
    const { done, value } = await reader.read();
    if (done) {
      // 当流结束时处理音频
      const audioBuffer = await audioContext.decodeAudioData(new Uint8Array(audioBufferArray).buffer);
      const audioSource = audioContext.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.connect(audioContext.destination);
      audioSource.start();
      return;
    }

    // 将接收到的音频数据拼接到数组中
    audioBufferArray.push(...value);
    processStream();
  };
  processStream();

};
const createAction = async () => {
  // 发送音频数据到后端
  await sendAudiosToBackend();
  // 清除所有音频实例
  Object.keys(audioInstances).forEach(key => {
    audioInstances[key].pause();
    audioInstances[key].src = '';
    delete audioInstances[key];
  });
  // 跳转逻辑
  stepStore.incrementStep();
};

onMounted(async () => {
  if (queryVoiceId !== undefined) {
    let result = await bankQueryDetailService(queryVoiceId);
    insertData.value = result.data;
    samples.value = result.data.voiceSamples;
  }
})
const toStep2AndUpdate = async () => {
  const updateData = {
    ...insertData,
    voiceId: currentVoiceId.value,
  }
  let result = await bankUpdateService(insertData.value);
  stepStore.incrementStep();
}
</script>