<template>
  <div class="row">
    <div class="col1">
      <h1>辅助阅读</h1>
      <div class="upload-section">
        <el-upload ref="upload" :auto-upload="true" action="/api/common/ppt" name="file" :on-success="uploadSuccess"
          :limit="1">
          <template #trigger>
            <el-button color="black" size="large" type="primary">选择课件</el-button>
          </template>
        </el-upload>
      </div>
      <div class="warning">
        <el-icon size="12">
          <Memo />
        </el-icon>
        音频质量取决于模型，为获得最佳效果，请使用高质量模型，严禁合成政治、色情、赌博、毒品等违法违规内容。
      </div>
      <div class="voice-selection">
        <div class="text">语音声音</div>
        <div style="display: flex;flex-direction: row;gap: 10px;">没有模型? <div class="voice-selection-btn" @click="createNewSound">一分钟创建</div></div>
      </div>
      <div class="output-section" @click="visible = true" v-if="!voice">
        <div class="add"></div>
        <div style="font-weight: 600;">选择语音声音</div>
      </div>
      <div class="select-output-section" v-else>
        <el-row class="select-voice-item">
          <el-col :span="4">
            <el-image style="width: 80px; height: 80px;border-radius: 15px;" :src="voice.voiceImage" fit="cover" />
          </el-col>
          <el-col :span="17">
            <div class="select-voice-name">{{ voice.voiceName }}</div>
            <div class="select-voice-detail">
              <span class="display-detail"> {{ voice.userName }}</span>
              <div class="mydot"></div>
              <el-icon size="20" style="color: #6b7280;">
                <Clock />
              </el-icon>
              <span class="display-detail">{{ timeDistance(voice.voiceCreationTime) }}</span>
              <div class="mydot"></div>
              <div class="tag1"> {{ voice.voiceLanguage }}</div>
              <div class="tag2" v-if="voice.voiceTag !== ''" style="margin-left: 5px;"> {{ voice.voiceTag
              }}
              </div>
            </div>
            <div class="select-btns">
              <div class="btns-plus">
                <div class="button">
                  <div class="likefill" v-if="voice.voiceIsLiked === 1" @click="toggleLike(voice)">
                  </div>
                  <div class="like" v-else @click="toggleLike(voice)">
                  </div>
                  <div class="number">
                    {{ formatNumberWithK(voice.voiceLikeCount) }}
                  </div>
                </div>
                <div class="button">
                  <div class="unlikefill" v-if="voice.voiceIsLiked === 2" @click="toggleDislike(voice)"></div>
                  <div class="unlike" v-else @click="toggleDislike(voice)"></div>
                </div>
                <div class="button">
                  <el-icon size="20" color="#6b7280" style="cursor: pointer;" v-if="!voice.voiceIsCollected"
                    @click="toggleCollect(voice)">
                    <Star />
                  </el-icon>
                  <el-icon size="20" color="#6b7280" style="cursor: pointer;" v-else @click="toggleCollect(voice)">
                    <StarFilled />
                  </el-icon>
                  <div class="number">
                    {{ formatNumberWithK(voice.voiceCollectCount) }}
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div style="display: flex;flex-direction: row;gap: 10px;">
              <el-icon size="28" style="cursor: pointer;" @click="visible = true;">
                <RefreshRight />
              </el-icon>
              <el-icon size="28" style="cursor: pointer;" @click="voice = ''">
                <Close />
              </el-icon>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-dialog v-model="visible" :show-close="false">
        <template #header="{ close, titleId, titleClass }">
          <div class="my-header">
            <div style="font-weight: 600;" :id="titleId" :class="titleClass">选择语音</div>
            <el-icon style="cursor: pointer;" @click="close">
              <Close />
            </el-icon>
          </div>
        </template>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
          <el-tab-pane label="探索" name="first">
            <div class="action-sum">
              <div style="width: 155px;">
                <MyInput :message="nameValue" :placeholder="placeholder" @update:message="handleMessage" :size="'medium'" :background="'#FFF'" />
              </div>
              <div class="action-bar">
                <span class="header-tip">排序</span>
                <MySelect :options="sortOptions" :input-width="'155px'" :color="color" :size="'medium'" :background="'#FFF'"
                  @update:value="handleSortValue" />
                <span class="header-tip">语言</span>
                <MySelect :options="languageOptions" :input-width="'155px'" :color="color" :size="'medium'" :background="'#FFF'"
                  @update:value="handlelanguageValue" />
                <el-popover placement="bottom" :width="250" :visible="visiblePopover">
                  <template #reference>
                    <el-button size="large" class="btn" @click="visiblePopover = !visiblePopover">
                      <el-icon size="20" color="black">
                        <Operation />
                      </el-icon>
                    </el-button> </template>
                  <div class="content">
                    <div class="content-header">
                      <span style="font-size: large;font-weight: 600; color: black;">筛选</span>
                    </div>
                    <div>标签</div>
                    <MySelectChange :options="tagOptions" :input-width="'200px'" @update:value="handletagValue" />
                    <div style="display: flex;justify-content: center;">
                      <el-button color="black" style="width: 95%;"
                        @click="visiblePopover = false; tagValue = tagTemp">应用</el-button>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
            <div style="max-height: 53vh;overflow-y: auto;">
              <SoundItem :path="path" :nameValue="nameValue" :sortValue="sortValue" :languageValue="languageValue"
                :tagValue="tagValue" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="收藏" name="second">
            <div style="max-height: 53vh;overflow-y: auto;">
              <CollectSoundItem :path="path" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="我的语音" name="third">
            <MyInput :message="nameValue" :placeholder="placeholder" class="action-bar" @update:message="handleMessage" :size="'medium'" :background="'#FFF'"
              style="width: 20%;" />
            <div style="max-height: 53vh;overflow-y: auto;">
              <MySoundItem :nameValue="nameValue" :path="path"></MySoundItem>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <div class="advanced-settings">
        <div class="toggle-button" @click="toggle" :class="{ 'active': isExpanded }">
          <span style="font-size: large;">高级设置</span>
          <el-icon v-if="!isExpanded">
            <ArrowDown />
          </el-icon>
          <el-icon v-else>
            <ArrowUp />
          </el-icon>
        </div>
        <transition name="expand" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="leave">
          <div v-show="isExpanded" class="content-wrapper">
            <div class="mode">
              <div class="detail">
                高品质模式
                <span style="font-size: small;">生成更高品质的音频，但会增加延迟</span>
              </div>
              <el-switch v-model="mode" class="ml-2"
                style="--el-switch-on-color: black; --el-switch-off-color: #e4e7ed" />
            </div>
            <div>
              <div class="detail">
                语速({{ speedPercentage.toFixed(1) }}x)
                <span style="font-size: small;">基于参考音频的语速进行调整</span>
              </div>
              <div class="demo-progress">
                <el-icon size="20" @click="decrease">
                  <Minus />
                </el-icon>
                <el-slider v-model="speedPercentage" :min="0" :max="3" :show-tooltip="false" :step="0.1"
                  style="margin-right: 10px;" />
                <el-icon size="20" @click="increase">
                  <Plus />
                </el-icon>
              </div>
            </div>
            <div>
              <div class="detail">
                音量({{ volumePercentage.toFixed(1) }})
                <span style="font-size: small;">基于参考音频的音量进行调整</span>
              </div>
              <div class="demo-progress">
                <el-icon size="20" @click="decrease2">
                  <Minus />
                </el-icon>
                <el-slider v-model="volumePercentage" :min="0" :max="3" :show-tooltip="false" :step="0.1"
                  style="margin-right: 10px;" />
                <el-icon size="20" @click="increase2">
                  <Plus />
                </el-icon>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="build">
        <el-button color="black" @click="addNewAudio">创建</el-button>
      </div>
      <el-dialog v-model="loadingDialogVisible" :show-close="false" width="25%" title="正在创建音频" align-center>
        <div style="margin: 20px;">
          <div class="loading-dots">
            <span class="dot dot1"></span>
            <span class="dot dot2"></span>
            <span class="dot dot3"></span>
          </div>
          <div style="display: flex;justify-content: center;margin: 10px;">正在分析课件</div>
        </div>
      </el-dialog>
    </div>
    <el-divider direction="vertical" style="height: auto;" />
    <div class="col2">
      <div v-if="addNewAudios">
        <h3>生成的音频</h3>
        <div class="audio-item">
          <div class="audio-top">
            <el-image :src="addNewAudios.voiceImage" style="width: 60px; height: 60px; border-radius: 15px;"
              fit="cover" />
            <div class="audio-content">
              <div class="audio-info">
                <div class="audio-text">{{ addNewAudios.audioText }}</div>
                <div class="audio-name">
                  <el-icon size="20">
                    <User />
                  </el-icon>
                  {{ addNewAudios.voiceName }}
                </div>
              </div>
              <div class="audio-actions">
                <div class="audio-actions-row">
                  <div class="dontagree" @click="showDontAgreeDialog = true"></div>
                  <el-dialog v-model="showDontAgreeDialog" width="30%" align-center :show-close="false">
                    <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 20px;">
                      音频质量反馈</div>
                    <div class="dialog">
                      反馈类型
                      <MySelect :options="reportOptions" :input-width="'432px'" :color="colorSelect"
                        @update:value="handleReportValue" style="margin-bottom: 10px;" />
                    </div>
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button color="black" plain @click="showDontAgreeDialog = false;">
                          取消
                        </el-button>
                        <el-button color="black" @click="showDontAgreeDialog = false;">
                          确认
                        </el-button>
                      </span>
                    </template>
                  </el-dialog>
                  <div class="share" @click="open(addNewAudios.audioId)"></div>
                  <div class="download" @click="downloadAudio(addNewAudios.audioURL)"></div>
                </div>
                <div class="audio-actions-single">
                  <audio :src="addNewAudios.audioURL" ref="audioRef"
                    @timeupdate="e => updateHighlight2(e, addNewAudios.audioId)" @ended="handleAudioEnd2()" />
                  <div v-if="!addNewAudios.isPlaying" class="close" @click="togglePlay2();">
                  </div>
                  <div v-else class="on" @click="togglePlay2();">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="divide"></div>
          <div class="text-container">
            <span v-for="(sentence, sIndex) in addNewAudios.sentences" :key="sIndex"
              :class="{ 'highlight': addNewAudios.currentIndex === sIndex }" @click="seekTo2(sIndex)">
              {{ sentence.text }}&nbsp;
            </span>
          </div>
        </div>
      </div>
      <h3>最新活动</h3>
      <div v-if="audios" v-for="audio in audios" :key="audio.audioId" class="audio-item">
        <div class="audio-top">
          <el-image :src="audio.voiceImage" style="width: 60px; height: 60px; border-radius: 15px;" fit="cover" />
          <div class="audio-content">
            <div class="audio-info">
              <div class="audio-text">{{ audio.audioText }}</div>
              <div class="audio-name">
                <el-icon size="20">
                  <User />
                </el-icon>
                {{ audio.voiceName }}
              </div>
            </div>
            <div class="audio-actions">
              <div class="audio-actions-row">
                <div class="dontagree" @click="showDontAgreeDialog = true"></div>
                <el-dialog v-model="showDontAgreeDialog" width="30%" align-center :show-close="false">
                  <div style="font-size: large;color: black;font-weight: 600;margin-bottom: 20px;">
                    音频质量反馈</div>
                  <div class="dialog">
                    反馈类型
                    <MySelect :options="reportOptions" :input-width="'432px'" :color="colorSelect"
                      @update:value="handleReportValue" style="margin-bottom: 10px;" />
                  </div>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button color="black" plain @click="showDontAgreeDialog = false;">
                        取消
                      </el-button>
                      <el-button color="black" @click="showDontAgreeDialog = false;">
                        确认
                      </el-button>
                    </span>
                  </template>
                </el-dialog>
                <div class="share" @click="open(audio.audioId)"></div>
                <div class="download" @click="downloadAudio(audio.audioURL)"></div>
              </div>
              <div class="audio-actions-single">
                <audio :src="audio.audioURL" :ref="el => setAudioRef(el, audio.audioId)"
                  @timeupdate="e => updateHighlight(e, audio.audioId)" @ended="handleAudioEnd(audio.audioId)" />
                <div v-if="!audio.isPlaying" class="close" @click="togglePlay(audio.audioId);">
                </div>
                <div v-else class="on" @click="togglePlay(audio.audioId);">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divide"></div>
        <div class="text-container">
          <span v-for="(sentence, sIndex) in audio.sentences" :key="sIndex"
            :class="{ 'highlight': audio.currentIndex === sIndex }" @click="seekTo(audio.audioId, sIndex)">
            {{ sentence.text }}&nbsp;
          </span>
        </div>
      </div>
      <div v-else><el-empty description="暂无数据" />
      </div>
    </div>
  </div>

</template>

<script setup>
import SoundItem from '@/components/bank/SoundItem.vue';
import CollectSoundItem from '@/components/bank/CollectSoundItem.vue';
import MySoundItem from '@/components/bank/MySoundItem.vue';
import { ref, watch, onMounted, reactive, computed } from 'vue';
import MyInput from "@/components/newComponent/Input.vue";
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const currentId = ref('');
const route = useRoute();
const currentVoiceId = route.query ? route.query.id : undefined;
const uploadPPTUrl = ref();
const uploadSuccess = (result, file) => {
  uploadPPTUrl.value = result.data.uploadPPTUrl;
};
const upload = ref();
// 音频元素引用
const audioRefs = ref(new Map());
// 设置audio引用
const setAudioRef = (el, audioId) => {
  if (el) {
    audioRefs.value.set(audioId, el);
  }
};
const handleAudioEnd = (audioId) => {
  const targetAudio = audios.value.find(a => a.audioId === audioId);
  if (targetAudio) {
    targetAudio.isPlaying = false;
  }
};
// 播放控制
const togglePlay = (audioId) => {
  const targetAudio = audios.value.find(a => a.audioId === audioId);
  const audioElement = audioRefs.value.get(audioId);

  audios.value.forEach(audio => {
    if (audio.audioId !== audioId && audio.isPlaying) {
      const otherElement = audioRefs.value.get(audio.audioId);
      otherElement?.pause();
      audio.isPlaying = false;
    }
  });

  if (audioElement.paused) {
    audioElement.play();
    targetAudio.isPlaying = true;
  } else {
    audioElement.pause();
    targetAudio.isPlaying = false;
  }
}

// 更新时间高亮
const updateHighlight = (event, audioId) => {
  const currentTime = event.target.currentTime;
  const targetAudio = audios.value.find(a => a.audioId === audioId);
  const currentIndex = targetAudio.sentences.findIndex(s =>
    currentTime >= s.start && currentTime <= s.end
  );

  if (currentIndex !== -1) {
    targetAudio.currentIndex = currentIndex;
  }
};

// 点击文本跳转
const seekTo = (audioId, sentenceIndex) => {
  const targetAudio = audios.value.find(a => a.audioId === audioId);
  const audioElement = audioRefs.value.get(audioId);

  if (!audioElement || sentenceIndex >= targetAudio.sentences.length) return;

  audioElement.currentTime = targetAudio.sentences[sentenceIndex].start + 0.01;
  if (!targetAudio.isPlaying) {
    audioElement.play();
    targetAudio.isPlaying = true;
  }
};
const audioRef = ref(null);
// 播放/暂停控制
const togglePlay2 = () => {
  if (!audioRef.value) {
    return;
  }

  if (audioRef.value.paused) {
    audioRef.value.play();
    addNewAudios.value.isPlaying = true;
  } else {
    audioRef.value.pause();
    addNewAudios.value.isPlaying = false;
  }
};
// 时间更新监听
const updateHighlight2 = () => {
  const currentTime = audioRef.value.currentTime;

  // 查找当前对应句子
  const index = addNewAudios.value.sentences.findIndex(s =>
    currentTime >= s.start && currentTime <= s.end
  );

  if (index !== -1 && index !== addNewAudios.value.currentIndex.value) {
    addNewAudios.value.currentIndex = index;
  }
}; const handleAudioEnd2 = () => {
  addNewAudios.value.isPlaying = false;
};

// 点击句子跳转
const seekTo2 = (index) => {
  if (index >= 0 && index < addNewAudios.value.sentences.length) {
    audioRef.value.currentTime = addNewAudios.value.sentences[index].start + 0.01;
    if (!isPlaying.value) audioRef.value.play();
  }
};
watch(() => router.currentRoute.value.fullPath, (newPath, oldPath) => {
  const idMatch = newPath.match(/\?id=(\d+)/);
  if (idMatch) {
    currentId.value = idMatch[1];
  } else {
    currentId.value = '';
  }
  visible.value = false;
  queryById(currentId);
});
import { bankQueryDetailService } from '@/api/bank/mybank'
const queryById = async (id) => {
  let result = await bankQueryDetailService(id);
  voice.value = result.data;
}
onMounted(async () => {
  if (currentVoiceId) {
    queryById(currentVoiceId);
  }
})
const createNewSound = () => {
  router.push('/createbank')
}
import { timeDistance, formatNumberWithK } from '@/hooks/display';
import { toggleLike, toggleDislike, toggleCollect } from '@/hooks/actions';
import { ElButton, ElDialog } from 'element-plus'
const activeName = ref('first');
const visible = ref(false)
import {
  Operation,
  Clock,
  Star,
  StarFilled,
  Close,
  Memo,
  RefreshRight,
  ArrowDown, ArrowUp, Minus, Plus, User
} from '@element-plus/icons-vue';
import MySelect from '@/components/newComponent/Select.vue'
const color = ref('#ffffff');
const sortOptions = ref([
  { value: '1', label: '推荐' },
  { value: '2', label: '最新' },
]);
const languageOptions = ref([
  { value: '1', label: '所有' },
  { value: 'ch', label: '汉语' },
  { value: 'en', label: 'English' },
]);
const tagOptions = ref();
const colorSelect = ref('#ffffff');
import { discoverTagService } from '@/api/bank/discover'
onMounted(async () => {
  let result = await discoverTagService();
  tagOptions.value = result.data;
})
const showDontAgreeDialog = ref(false);
const sortValue = ref('');
const languageValue = ref('1');
const tagValue = ref('');
const tagTemp = ref('');
const nameValue = ref('');
const path = ref('assistant');
const handleTabClick = () => {
  sortValue.value = '';
  languageValue.value = '1';
  tagValue.value = '';
  nameValue.value = '';
};
const placeholder = ref('搜索声音...');
const handleSortValue = (newValue) => {
  sortValue.value = newValue;
};
const handlelanguageValue = (newValue) => {
  languageValue.value = newValue;
};
const handletagValue = (newValue) => {
  tagTemp.value = newValue;
  console.log(tagTemp.value);
};
function handleMessage(newMessage) {
  nameValue.value = newMessage;
}
import MySelectChange from '@/components/newComponent/SelectChange.vue'
import AudioPlayer from "@/components/newComponent/AudioPlayer.vue";
const visiblePopover = ref(false);
// const voice = ref({
//     voiceId: 1,
//     userName: 'fc',
//     voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
//     voiceName: '55',
//     voiceDescription: '1212',
//     voiceCreationTime: new Date(2025, 1, 9, 19, 11),
//     voiceUseCount: 110000,
//     voiceShareCount: 11,
// });
const voice = ref();
import audioUrl from '@/assets/sound.m4a';
const audios = ref([{
  audioId: 1,
  voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
  voiceName: '55',
  audioText: '1232ssssssssss',
  audioURL: audioUrl,
  isPlaying: false,
  currentIndex: -1,
  sentences: [
    { text: 'Hello1', start: 0.0, end: 1.2 },
    { text: 'world!1', start: 1.2, end: 2.5 },
    { text: 'This is a demo1', start: 2.5, end: 4.0 }
  ]
},
{
  audioId: 2,
  voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
  voiceName: '55',
  audioText: '1232ssssssssss',
  audioURL: audioUrl,
  isPlaying: false,
  currentIndex: -1,
  sentences: [
    { text: 'Hello2', start: 0.0, end: 1.2 },
    { text: 'world!2', start: 1.2, end: 2.5 },
    { text: 'This is a demo2', start: 2.5, end: 4.0 }
  ]
}]);
const addNewAudios = ref({
  audioId: 1,
  voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
  voiceName: '66',
  audioText: '11111111111111111',
  audioURL: audioUrl,
  isPlaying: false,
  currentIndex: -1,
  sentences: [
    { text: 'Hello', start: 0.0, end: 1.2 },
    { text: 'world!', start: 1.2, end: 2.5 },
    { text: 'This is a demo', start: 2.5, end: 4.0 }
  ]
});
const reportOptions = ref([
  { value: '1', label: '暂无问题' },
  { value: '2', label: '音频存在截断' },
  { value: '3', label: '有多个人说话（音色跳变）' },
  { value: '4', label: '噪音' },
  { value: '5', label: '超长空白' },
  { value: '6', label: '声音太小/声音模糊' },
  { value: '7', label: '混响很大' },
  { value: '8', label: '吞字漏字错字' },
]);
const handleReportValue = (newValue) => {
  reportType.value = newValue;
};
const isExpanded = ref(false);
const mode = ref(false)

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

const enter = (el) => {
  el.style.height = 'auto';
  const height = getComputedStyle(el).height;
  el.style.height = '0';
  setTimeout(() => {
    el.style.height = height;
  }, 10);
};

const afterEnter = (el) => {
  el.style.height = 'auto';
};

const beforeLeave = (el) => {
  el.style.height = getComputedStyle(el).height;
};

const leave = (el) => {
  setTimeout(() => {
    el.style.height = '0';
  }, 10);
};
const speedPercentage = ref(1.0);
const increase = () => {
  speedPercentage.value = Number((speedPercentage.value + 0.1).toFixed(1));
};
const decrease = () => {
  speedPercentage.value = Number((speedPercentage.value - 0.1).toFixed(1));
};
const volumePercentage = ref(1.0);
const increase2 = () => {
  volumePercentage.value = Number((volumePercentage.value + 0.1).toFixed(1));
};
const decrease2 = () => {
  volumePercentage.value = Number((volumePercentage.value - 0.1).toFixed(1));
};
const loadingDialogVisible = ref(false);
import { open, downloadAudio } from '@/hooks/actions';
const addNewAudio = () => {
  loadingDialogVisible.value = true;
  const addData = {
    voiceId: voice.value.voiceId,
    uploadPPTUrl: uploadPPTUrl.value,
    vedioMode: mode.value,
    vedioSpeed: speedPercentage.value,
    vedioVolume: volumePercentage.value,
  }
  setTimeout(async () => {
    let result = await audioInsertService(addData);
    addNewAudios.value = {
      ...result.data,
      isPlaying: false,
      currentIndex: -1
    };
    loadingDialogVisible.value = false;
  }, 2000);
}
import { audioQueryService, audioInsertService } from '@/api/assistant';
onMounted(async () => {
  let result = await audioQueryService();
  audios.value = result.data.map(audio => ({
    ...audio, 
    isPlaying: false,
    currentIndex: -1
  }));
})
</script>

<style scoped>
.dontagree {
  cursor: pointer;
  width: 20px;
  height: 20px;
  background: url('../assets/icons/dontagree.svg') no-repeat center / contain;
}

.share {
  cursor: pointer;
  width: 20px;
  height: 20px;
  background: url('../assets/icons/share.svg') no-repeat center / contain;
}

.download {
  cursor: pointer;
  width: 20px;
  height: 20px;
  background: url('../assets/icons/download.svg') no-repeat center / contain;
}

.close {
  cursor: pointer;
  width: 30px;
  height: 30px;
  background: url('../assets/icons/close.svg') no-repeat center / contain;
}

.on {
  cursor: pointer;
  width: 30px;
  height: 30px;
  background: url('../assets/icons/on.svg') no-repeat center / contain;
}


.row {
  display: flex;
  flex-direction: row;
}

.col1 {
  margin: 0 3%;
  width: 44%;
}

.col2 {
  margin: 1% 8%;
  width: 34%;
}

.upload-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

.text {
  font-size: large;
  padding-bottom: 15px;
  margin-top: 10px;
}
.voice-selection-btn{
    cursor: pointer;
}
.voice-selection-btn:hover{
    color:#71717a;
}

.counter {
  text-align: right;
  color: #666;
  font-size: 0.9em;
}

.warning {
  margin: 20px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  border: #e4e4e7 1px solid;
  font-size: small;
  color: #6b7280;
}

.voice-selection {
  margin-top: 40px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.output-section {
  margin-bottom: 40px;
  min-height: 50px;
  padding: 20px;
  border: 2px dashed #ddd;
  text-align: center;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;

  .add {
    width: 30px;
    height: 30px;
    background: url('../assets/icons/add.svg') no-repeat center / contain;
  }
}
.output-section:hover {
    border-color: #ccc;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.select-output-section {
  min-height: 50px;
  border: 1px solid #ddd;
  text-align: center;
  align-items: center;
  background-color: white;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.select-output-section:hover {
  border-color: #ccc;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}



.select-voice-item {
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
}

.select-voice-detail {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.build {
  display: flex;
  justify-content: end;
  margin-top: 40px;
  margin-bottom: 95px;
}

input[type="range"] {
  width: 200px;
  margin: 0 10px;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.demo-tabs {
  width: 100%;
}

:deep(.el-tabs__active-bar) {
  background-color: #09090b !important;
  height: 2px;
}

:deep(.el-tabs__item) {
  color: #666;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-tabs__item.is-active) {
  color: #333;
  font-weight: bold;
}

:deep(.el-tabs__item:hover) {
  color: #444;
}

.action-sum {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.action-bar {
  height: 100%;
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;

  .header-tip {
    color: #6b7280;
  }
}

.content {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .content-header {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }
}

.select-btns {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .btns-plus {
    display: flex;
    flex-direction: row;
    gap: 25px;

    .button {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;

      .number {
        font-size: small;
      }

      .like {
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('../assets/icons/like.svg') no-repeat center / contain;
      }

      .likefill {
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('../assets/icons/likefill.svg') no-repeat center / contain;
      }

      .unlike {
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('../assets/icons/unlike.svg') no-repeat center / contain;
      }

      .unlikefill {
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: url('../assets/icons/unlikefill.svg') no-repeat center / contain;
      }
    }
  }
}

.btn:hover {
  background-color: #f4f4f5 !important;
  border: #606266 1px solid !important;
}

.logo {
  width: 20px;
  height: 20px;
  background: url('../assets/icons/sound.svg') no-repeat center / contain;
}

.mydot {
  width: 8px;
  height: 8px;
  margin: 5px;
  border-radius: 50%;
  background-color: #e5e8eb;
}

::v-deep(.btn:hover .el-icon) {
  color: #606266 !important;
}

.display-detail {
  color: #71717a;
}

.close-plus {
  width: 15px;
  height: 15px;
  background: url('../assets/icons/close2.svg') no-repeat center / contain;
}

.on-plus {
  width: 15px;
  height: 15px;
  background: url('../assets/icons/on.svg') no-repeat center / contain;
}

.select-voice-name {
  font-size: 23px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  justify-content: left;
}

.voice-sample-item {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding-top: 5px;
}

.tag1 {
  background-color: #dcfce7;
  color: #16a34a;
  border: #86efac 1px solid;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: small;
}

.tag2 {
  background-color: #dbeafe;
  color: #2563eb;
  border: #93c5fd 1px solid;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: small;
}

.advanced-settings {
  width: 85vh;
  margin-top: 20px;
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
  background-color: white;
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.content-wrapper {
  background: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  .mode {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 10px;
}

.demo-progress {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.el-slider {
  --el-slider-main-bg-color: black !important;
}

:deep() .el-slider__button {
  border-color: black !important;
}



.audio-actions-row {
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.audio-actions-single {
  display: flex;
  justify-content: center;
}

.dialog {
  display: flex;
  flex-direction: column;
  color: black;
  gap: 10px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #000;
  border-radius: 50%;
  margin: 0 4px;
  animation: bounce 1.4s infinite ease-in-out both;
}

/* 为每个点设置不同的动画延迟 */
.dot1 {
  animation-delay: -0.32s;
}

.dot2 {
  animation-delay: -0.16s;
}

.dot3 {
  animation-delay: 0s;
}

/* 定义跳动动画 */
@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1.0);
  }
}

.audio-top {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.audio-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 85%;
  align-items: baseline
}

.audio-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.audio-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.audio-name {
  font-size: 14px;
  color: #666;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.audio-text {
  font-size: 18px;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-item {
  padding: 10px 10px 0 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #FFFFFF;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.audio-item:hover {
  border-color: #ccc;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

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
  cursor: pointer;
}

.divide {
  margin-top: 15px;
  height: 1px;
  width: 100%;
  background-color: #e4e4e7;
}
</style>