<template>
  <div class="row">
    <div class="col1">
      <h1>辅助阅读</h1>
      <div class="upload-section">
        <el-upload ref="upload" :auto-upload="true" action="/api1/common/ppt" name="file" :on-success="uploadSuccess"
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
        <div style="display: flex;flex-direction: row;gap: 10px;">没有模型? <div class="voice-selection-btn"
            @click="createNewSound">一分钟创建</div>
        </div>
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
                <MyInput :message="nameValue" :placeholder="placeholder" @update:message="handleMessage"
                  :size="'medium'" :background="'#FFF'" />
              </div>
              <div class="action-bar">
                <span class="header-tip">排序</span>
                <MySelect :options="sortOptions" :input-width="'155px'" :color="color" :size="'medium'"
                  :background="'#FFF'" @update:value="handleSortValue" />
                <span class="header-tip">语言</span>
                <MySelect :options="languageOptions" :input-width="'155px'" :color="color" :size="'medium'"
                  :background="'#FFF'" @update:value="handlelanguageValue" />
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
            <MyInput :message="nameValue" :placeholder="placeholder" class="action-bar" @update:message="handleMessage"
              :size="'medium'" :background="'#FFF'" style="width: 20%;" />
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
      <h3>生成的音频</h3>
      <div v-if="addNewAudios">
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
              <span v-html="sentence.text.replace(/\n/g, '<br>')"></span>&nbsp;
            </span>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <div class="emptyimage"></div>
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
};
const handleAudioEnd2 = () => {
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
import assUrl from '@/assets/assistant/ass.mp3';
const addNewAudios = ref();
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
  setTimeout(() => {
    addNewAudios.value = {
      audioId: 1,
      voiceImage: 'http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg',
      voiceName: '66',
      audioText: '11111111111111111',
      audioURL: assUrl,
      isPlaying: false,
      currentIndex: -1,
      sentences: [
        { text: '《背 影》朱自清', start: 0.0, end: 3.0 },
        { text: '\n导入新课', start: 3.0, end: 4.5 },
        { text: '\n生活中时时有感动，处处有感动。', start: 4.5, end: 8.0 },
        { text: '它有时是一种声音，有时是一种色彩，有时是一种状态，有时是一种场景。', start: 8.0, end: 15.0 },
        { text: '如果你有一颗善感的心，同学的批评可以给你感动，妈妈的唠叨可以给你感动，甚至于爸爸的背影也可以给你持久的感动。', start: 15.0, end: 25.0 },
        { text: '今天我们来一起学习朱自清的《背影》，看他是怎样被父亲的背影感动的。', start: 25.0, end: 33.0 },
        { text: '\n作者简介', start: 33.0, end: 34.0 },
        { text: '\n朱自清(1898—1948) ，字佩弦，号秋实，江苏扬州人。', start: 34.0, end: 41.0 },
        { text: '1923年发表长诗《毁灭》，影响很大。', start: 41.0, end: 45.0 },
        { text: '1928年出版第一本散文集《背影》，成了著名的散文作家。', start: 45.0, end: 51.0 },
        { text: '主要作品有《踪迹》，散文集《背影》、《欧游杂记》、《你我》、《伦敦杂记》，文艺论著《诗言志辨》、《记雅俗共赏》等。', start: 51.0, end: 62.0 },
        { text: '我们熟知的作品有《匆匆》、《春》、《荷塘月色》、《桨声灯影里的秦淮河》等。', start: 62.0, end: 70.0 },
        { text: '\n写作背景', start: 1.2, end: 2.5 },
        { text: '\n《背影》写于1925年10月，作者在清华大学任教。', start: 1.2, end: 0 },
        { text: '1917年冬，作者祖母去世，父亲朱鸿钧原任徐州烟酒公卖局局长，被解职。', start: 1.2, end: 2.5 },
        { text: '文中“祸不单行”正是指这两件事。', start: 1.2, end: 2.5 },
        { text: '作者当时在北大哲学系读书，得知祖母去世，从北京赶到徐州与父亲一道回扬州奔丧。', start: 1.2, end: 2.5 },
        { text: '丧事完毕，父亲到南京找工作，作者回北京念书，父子在浦口车站惜别。', start: 1.2, end: 2.5 },
        { text: '\n字词积累', start: 1.2, end: 2.5 },
        { text: '\n 迂 褂 搀 交卸', start: 1.2, end: 2.5 },
        { text: '\n狼藉 簌簌 赋闲', start: 1.2, end: 2.5 },
        { text: '\n游逛  踌躇  蹒跚', start: 1.2, end: 2.5 },
        { text: '\n颓唐  琐屑  晶莹', start: 1.2, end: 2.5 },
        { text: '\n触目伤怀', start: 1.2, end: 2.5 },
        { text: '\n整体感知', start: 1.2, end: 2.5 },
        { text: '\n1.本文写的主要事件是什么？', start: 1.2, end: 2.5 },
        { text: '\n父子车站送别。', start: 1.2, end: 2.5 },
        { text: '\n2.表达了什么中心？', start: 1.2, end: 2.5 },
        { text: '\n父疼子，子爱父，——父子情深。', start: 1.2, end: 2.5 },
        { text: '\n3.全文共写到父亲的哪几次背影？', start: 1.2, end: 2.5 },
        { text: '\n四写背影。', start: 1.2, end: 2.5 },
        { text: '“背影”在文章中出现了四次，每次的情况有所不同，而思想感情却是一脉相承的。', start: 1.2, end: 2.5 },
        { text: '分别为：\n①怀念父亲，难忘背影。第一次是开篇点题“背影”，有一种浓厚的感情气氛笼罩全文。', start: 1.2, end: 2.5 },
        { text: '\n②望父买橘，刻画背影。第二次是在车站送别的场面中，父亲胖胖的身躯，步履艰难，蹒跚地走过铁道为儿子买橘子，使儿子感动得热泪盈眶。', start: 1.2, end: 2.5 },
        { text: '\n③父子分手，惜别背影。第三次是父亲和儿子告别后，儿子眼望着父亲的“背影”在人群中消逝，离情别绪，又催人泪下。', start: 1.2, end: 2.5 },
        { text: '\n④别后思念，再现背影。', start: 1.2, end: 2.5 },
        { text: '第四次是在文章的结尾，儿子读着父亲的来信，在泪光中再次浮现了父亲的“背影”，思念之情不能自已，与文章开头呼应。', start: 1.2, end: 2.5 },
        { text: '\n4.在送行过程中，父亲为儿子做了哪些事？\n', start: 1.2, end: 2.5 },
        { text: '亲自送行，照看行李，讲定价钱，送子上车，拣定座位，叮嘱儿子，嘱咐茶房，为子买橘。', start: 1.2, end: 2.5 },
        { text: '\n问题探究', start: 1.2, end: 2.5 },
        { text: '\n1.(朗读第6段）体会父亲对儿子的爱。', start: 1.2, end: 2.5 },
        { text: '\n①父亲的穿戴：黑、深青——穿着朴素，心情沉重。', start: 1.2, end: 2.5 },
        { text: '（黑色给人压抑沉重的感觉，这是一个沉重的背影！）', start: 1.2, end: 2.5 },
        { text: '\n②走路的姿势：蹒跚——年纪较大，腿脚不便。 ', start: 1.2, end: 2.5 },
        { text: '（这是一个蹒跚的背影！）', start: 1.2, end: 2.5 },
        { text: '\n③爬月台动作：探、攀、缩、倾——行动不便，步履艰难。', start: 1.2, end: 2.5 },
        { text: '（动作描写，“探”，体胖动作不灵便，下铁道小心翼翼；“攀”，既写出月台的高度，又可以想象父亲爬月台的吃力；“缩”，两脚无处可蹬，把怎样爬写得更细致；“倾”，爬上月台虽然十分艰难，但又十分努力的样子。这是一个艰难的背影！） ', start: 1.2, end: 2.5 },
        { text: '\n④作用：突出父亲行动的艰难，表现父亲的爱子之情。', start: 1.2, end: 2.5 },
        { text: '\n2.父亲对儿子的关怀，除了为儿子做了这么多繁琐细小的事以外，还以什么方式表达了这种关爱？\n', start: 1.2, end: 2.5 },
        { text: '父亲的语言。 ', start: 1.2, end: 2.5 },
        { text: '\n①不要紧，他们去不好！', start: 1.2, end: 2.5 },
        { text: '\n②我买几个橘子去。你就在此地，不要走动。', start: 1.2, end: 2.5 },
        { text: '\n③我走了，到那边来信！', start: 1.2, end: 2.5 },
        { text: '\n④进去吧，里边没人。', start: 1.2, end: 2.5 },
        { text: '\n体现：怜惜体贴，依依不舍。', start: 1.2, end: 2.5 },
        { text: '\n3.文中几次写到“我”流泪？分别应做何理解？', start: 1.2, end: 2.5 },
        { text: '文中四次写到“我”流泪。', start: 1.2, end: 2.5 },
        { text: '\n①第一次流泪，是悲哀；因为作者怀着沉重的心情，从北京赶到徐州跟父亲一起奔丧，见到那“满院狼藉的东西”，触目伤怀，才不禁潸然泪下。', start: 1.2, end: 2.5 },
        { text: '\n②第二次流泪，因为感动；父亲的形象最为感人的地方，表现在他老态蹒跚地为“我”来回买橘子，那真挚而灼热的感情达到了最高点。人非木石，作者怎能不为之流泪？', start: 1.2, end: 2.5 },
        { text: '\n③第三次流泪，是惆怅之泪；这样一位至情至善、爱子如命的父亲，当他的背影消失在来来往往的人群中的时候，作者感到特别的怜惜、怅惘、依恋，当然潸然泪下了。', start: 1.2, end: 2.5 },
        { text: '\n④第四次流泪，是伤心之泪；以在晶莹的泪光中再现的父亲的“背影”结篇，与文章开头回环呼应，进一步突出父亲的“背影”给“我”留下的深刻印象，表达了作者对年迈的父亲无限思念的感情，写得凄切动人。', start: 1.2, end: 2.5 },
        { text: '\n4.文中的儿子理解了父亲的关爱了吗？你能从文中找出依据吗？\n', start: 1.2, end: 2.5 },
        { text: '儿子的几次流泪和两次自责说明他对父爱的理解和感激。', start: 1.2, end: 2.5 },
        { text: '\n父疼子，子爱父——父子情深就是这篇文章所表现的中心。', start: 1.2, end: 2.5 },
        { text: '\n品味语言', start: 1.2, end: 2.5 },
        { text: '\n父亲朴实而简洁的语言包含着怎样的深情？', start: 1.2, end: 2.5 },
        { text: '\n（1）“事已如此，不必难过，好在天无绝人之路！”', start: 1.2, end: 2.5 },
        { text: '父亲甘愿承受家庭重负，只愿儿子能轻松愉快地生活。', start: 1.2, end: 2.5 },
        { text: '\n（2）“不要紧，他们去不好！”', start: 1.2, end: 2.5 },
        { text: '父亲不放心，怕别人照顾不周到，即使劳碌费神，也毫不在意。', start: 1.2, end: 2.5 },
        { text: '这表明父亲对儿子无微不至的关心。', start: 1.2, end: 2.5 },
        { text: '\n（3）“我买几个橘子去，你就在此地，不要走动。”', start: 1.2, end: 2.5 },
        { text: '对儿子的关怀体贴十分周到。', start: 1.2, end: 2.5 },
        { text: '\n（4）“我走了，到那边来信！”', start: 1.2, end: 2.5 },
        { text: '惦记儿子旅途是否平安，反映了父亲对儿子深切的惦念和细心的关照。', start: 1.2, end: 2.5 },
        { text: '\n（5）“进去吧，里边没人。”', start: 1.2, end: 2.5 },
        { text: '怕儿子离开作座位丢失行李，反映了父亲对儿子细心的关照。', start: 1.2, end: 2.5 },
        { text: '\n文章主旨', start: 1.2, end: 2.5 },
        { text: '\n本文追述了作者八年前和父亲在浦口车站分别时的情景，刻画了一个感人至深的慈父形象，表达出真挚深沉的父子之情，也抒发了作者对父亲深切的思念之情。', start: 1.2, end: 2.5 },
        { text: '\n课堂小结', start: 1.2, end: 2.5 },
        { text: '\n同学们，至爱亲情是我们拥有的无比宝贵的财富。一桌准备好的饭菜，一件放在床头的衣服，一个鼓励的微笑，一句体贴的话语，都凝聚着亲人对我们的期望和关怀。', start: 1.2, end: 2.5 },
        { text: '正像父亲的背影一样，永远感动着我们；让我们对他们说一声：我爱你们，我理解了你们。', start: 1.2, end: 2.5 },
        { text: '\n课后作业', start: 1.2, end: 2.5 },
        { text: '\n1.完成课后习题。', start: 1.2, end: 2.5 },
        { text: '\n2.我们在爱的呵护下一天天长大，学习了这一课，你感悟到了什么？', start: 1.2, end: 2.5 },
        { text: '你一定有许多想对父亲说的话，请以“爸爸，我想对您说”为开头，写一个片段，展示给大家。', start: 1.2, end: 2.5 },
        { text: '\n3.预习第14课', start: 1.2, end: 2.5 },
      ]
    };
    loadingDialogVisible.value = false;
  }, 2000);
  // setTimeout(async () => {
  //   let result = await audioInsertService(addData);
  //   addNewAudios.value = {
  //     ...result.data,
  //     isPlaying: false,
  //     currentIndex: -1
  //   };
  //   loadingDialogVisible.value = false;
  // }, 2000);
}
// import { audioInsertService } from '@/api/assistant';

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

.voice-selection-btn {
  cursor: pointer;
}

.voice-selection-btn:hover {
  color: #71717a;
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
  display: inline-block;
  max-width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.empty {
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emptyimage {
  width: 350px;
  height: 350px;
  background: url('../assets/pictures/empty.png') no-repeat center / contain;
  border-radius: 10px;
}
</style>