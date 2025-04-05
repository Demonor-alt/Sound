<script setup>
import DemoControl from '../utils/DemoControl'
import DemoBoard1 from './MainPanel/board/demo1.vue'
import DemoBoard2 from './MainPanel/board/demo2.vue'
import BlankBoard from './MainPanel/board/blank.vue'
import asleep from '../utils/asleep.js'
import { toRef, watch, ref, onMounted } from 'vue'
import CWhiteBoard from './MainPanel/WhiteBoard.vue'
import CCharacterModel from './MainPanel/3DCharacterModel.vue'
import SpeechToAEIOU from '../utils/SpeechToAEIOU'
window.SpeechToAEIOU = SpeechToAEIOU
const emits = defineEmits([
  'changeSideBarDisplay',
  'listModelanimations'
])
const props = defineProps({
  isShow: {
    type: Boolean,
    default: true
  },
  isRotated: {
    type: Boolean,
    default: true
  },
  is3DModelLoad: {
    type: Boolean,
    default: false
  },
  changeAnimation: {
    type: String,
    default: 'idle'
  },
  ModelPresetsSelect: {
    type: String,
    default: ''
  }
})
const changeAnimation = ref(props.changeAnimation)
const isSideBarHide = ref(!props.isShow)
watch(toRef(props, 'isShow'), (val) => {
  isSideBarHide.value = !val
})




const AIInput = ref("")
const AIInputEnabled = ref(true)
const TalkButtonEnabled = ref(true)
const SendButtonEnabled = ref(true)
const CancelButtonEnabled = ref(false)
const LoadingIconShown = ref(false)
const SendLoadingIconShown = ref(false)
const RealContent = ref("")

const LoadingIconLeft = ref(20)

const ChatInputRef = ref()

watch(toRef(AIInput), (newVal) => {
  const style = window.getComputedStyle(ChatInputRef.value)
  const font = style.fontSize + " " + style.fontFamily;
  function getTextWidth(text, font) {
    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d")
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
  }
  const textWidth = getTextWidth(newVal, font)
  LoadingIconLeft.value = textWidth + 20
})

const listModelanimations = (animations) => {
  emits('listModelanimations', animations)
}

const startAudioRecord = async () => {
  if (!TalkButtonEnabled.value) return
  await DemoControl.startAudioRecord()
}

DemoControl.initInput(async (input) => {
  AIInput.value = " "
  const inputList = input.split('|')
  for (let i = 0; i < inputList.length; i++) {
    AIInput.value += inputList[i]
    await asleep(1000)
  }
})

DemoControl.initRefContent(RealContent)

DemoControl.initInputEnable((enabled) => {
  AIInputEnabled.value = enabled
})
DemoControl.initTalkButton((enabled) => {
  TalkButtonEnabled.value = enabled
})
DemoControl.initSendButton((enabled) => {
  SendButtonEnabled.value = enabled
})
DemoControl.initLoading((shown) => {
  LoadingIconShown.value = shown
})
DemoControl.initSendLoading((shown) => {
  SendLoadingIconShown.value = shown
})

const DemoNumber = ref(1)
DemoControl.initNumber((number) => {
  DemoNumber.value = number
})

DemoControl.changeAnimation((animation) => {
  changeAnimation.value = animation
})
</script> 
<template>
  <section class="main--i709DXFMo8U6UzrOX2CT semi-layout">
    <main class="content--tgwmYxjUbwU0Iluutse4 semi-layout-content">
      <div class="ui-layout--pPWUbm17V28nMVHbMDLw coze-home-wrap-light--miZKtdUue6kcJk7jCM0O">
        <div class="ui-content--f0SuJlgVjvkFtOGiOWZ2 ui-content--wvKCVylQoSgd1Anekll8">
          <div class="wrap--aXif_uIeeSoUJtaQl25b">
            <div class="main--H3kDrrXbbBUCJkglJgwy">
              <div class="chat-area-main--a0BdnOGko7txCGkv1GmY home coze-home--JlrpmrBivnosKeF5ZZ5t">
                <div class="cflur">
                  <img src="/bg.png" alt="background" style="object-fit:cover;height:100%">
                </div>
                <div
                  class="scroll-view--R_WS6aCLs2gN7PUhpDB0 scroll-view--cZLhMYy9ggV_mkqTmx7o scroll-mask--IqKwxodE6SsIiSSsbq7P">
                  <div class="content--hv5iKiECwMBS4Ig79KEg"
                    style="height:100%;flex-direction:unset;align-items: center;justify-content:end">

                    <CCharacterModel v-if="is3DModelLoad" @listModelanimations="listModelanimations"
                      :changeAnimation="changeAnimation" :isSideBarHide="isSideBarHide"
                      :ModelPresetsSelect="props.ModelPresetsSelect" />
                    <CWhiteBoard :rotatedStatus="isRotated">
                      <BlankBoard v-if="DemoNumber === 0" />
                      <DemoBoard1 v-else-if="DemoNumber === 1" />
                      <DemoBoard2 v-else-if="DemoNumber === 2" />
                    </CWhiteBoard>

                  </div>
                </div>
                <div class="chat-input-integration-layout--nEZ4cK4PKRUeAely3T8A">
                  <div class="chat-input--FUjI0tE29vUr893NlfjD">
                    <div style="width: 75%">
                      <div class="input-container--wR9gVK7v5II9hKJYKV93">
                        <div class="input-wrap--JmMZmVrOwngPEdAAVcoB">
                          <!-- 录音按钮 -->
                          <div class="left-actions-container--ReOCYS91GeM4iS4UyW6O">
                            <span class="" tabindex="0" aria-describedby="ax654x8" data-popupid="ax654x8"
                              style="display: inline-block;"
                              :style="{ 'cursor': TalkButtonEnabled ? 'pointer' : 'not-allowed' }">
                              <div class="coz-icon-button coz-icon-button-default" @click="startAudioRecord">
                                <button :disabled="!TalkButtonEnabled"
                                  class="semi-button  coz-button focus:outline-none transition duration-150 ease-in-out coz-btn-default coz-btn-primary coz-fg-primary coz-mg-primary hover:coz-mg-primary-hovered active:coz-mg-primary-pressed disabled:coz-fg-dim disabled:coz-mg-primary mr-12px !rounded-full outlined-icon-button--e6ef9JPgEh83gyuqszO_ base-outlined-icon-button--ZX8ba3jUI0Dc5sYKZcLJ semi-button-with-icon semi-button-with-icon-only"
                                  :class="{
                                    'cursor-not-allowed semi-button-disabled semi-button-primary-disabled': !TalkButtonEnabled
                                  }" type="button" aria-disabled="true"
                                  style="pointer-events: none;height:48px;width:48px"><span class="semi-button-content">

                                    <svg t="1727275560868" class="icon-icon icon-icon-coz_chat_plus text-xxl"
                                      viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                      p-id="4393" width="1.5em" height="1.5em" fill="currentColor">
                                      <path
                                        d="M544 830.4V960h-64v-129.6c-161.6-16-288-152.8-288-318.4h64c0 140.8 115.2 256 256 256s256-115.2 256-256h64c0 165.6-126.4 302.4-288 318.4zM512 640c70.4 0 128-57.6 128-128V192c0-70.4-57.6-128-128-128s-128 57.6-128 128v320c0 70.4 57.6 128 128 128z"
                                        p-id="4394"></path>
                                    </svg>

                                  </span></button>
                              </div>
                            </span>
                          </div>
                          <div class="textarea-with-top-rows--T2LHeTOxNUwB6GHgkXQF coz-bg-max coz-stroke-primary">
                            <div
                              class="textarea-with-actions-container--TD10K8JTITILyHP_wGTk py-8px pr-8px pl-20px textarea-with-actions-container__row--IsvlqGPTSUgYSizlYIqe">
                              <i class="input-tooltip-anchor--z2EMwtqQ0j42u0Ijfxbp"></i>
                              <textarea :disabled="!AIInputEnabled" ref="ChatInputRef" v-model="AIInput"
                                placeholder="发送消息、或点击左侧按钮语音输入"
                                class="rc-textarea textarea--mqeErm1c3cJyzW0dncHo textarea--mqeErm1c3cJyzW0dncHo coz-fg-primary coz-bg-max disabled:coz-bg-max placeholder:coz-fg-dim"
                                style="overflow-y: hidden; resize: none; height: 28px; min-height: 24px; max-height: 104px;font-size: 20px;">
                              </textarea>
                              <!-- 加载图标 -->
                              <div class="pt-[3px] absolute" v-if="LoadingIconShown"
                                :style="{ left: LoadingIconLeft + 'px' }">
                                <svg t="1727508508255" class="icon rotatingIcon" viewBox="0 0 1024 1024" version="1.1"
                                  xmlns="http://www.w3.org/2000/svg" p-id="5483" width="20" height="20">
                                  <path
                                    d="M512.930909 92.858182a420.072727 420.072727 0 1 0 0 840.145454 420.072727 420.072727 0 0 0 0-840.145454z m0 114.036363a306.036364 306.036364 0 1 1 0 612.072728 306.036364 306.036364 0 0 1 0-612.072728z"
                                    fill="#1296db" fill-opacity=".25" p-id="5484"></path>
                                  <path
                                    d="M512.930909 92.858182v114.036363a306.036364 306.036364 0 1 0 234.449455 502.737455l7.726545-9.541818 90.158546 69.818182a420.072727 420.072727 0 1 1-344.715637-676.864l12.381091-0.186182z"
                                    fill="#1296db" fill-opacity=".85" p-id="5485"></path>
                                </svg>
                              </div>
                              <!-- 发送按钮 -->
                              <div class="textarea-actions-container--xrX3jPcj3lksOloyPOqj">
                                <div class="textarea-actions-right--uqdGhcCF44rt4cvXd8rC">
                                  <span class="" tabindex="0" aria-describedby="x47dn3k" data-popupid="x47dn3k"
                                    style="display: inline-block;"
                                    :style="{ 'cursor': SendButtonEnabled ? 'pointer' : 'not-allowed' }">
                                    <div class="coz-icon-button coz-icon-button-default">
                                      <button :disabled="!SendButtonEnabled"
                                        class="semi-button coz-button focus:outline-none transition duration-150 ease-in-out coz-btn-default cursor-not-allowed coz-btn-secondary coz-fg-secondary hover:bg-transparent active:bg-transparent disabled:coz-fg-dim disabled:bg-transparent semi-button-with-icon semi-button-with-icon-only"
                                        :class="{
                                          'cursor-not-allowed semi-button-disabled semi-button-primary-disabled': !SendButtonEnabled
                                        }" type="button" aria-disabled="true" style="pointer-events: none;">

                                        <span class="semi-button-content">
                                          <svg v-if="!SendLoadingIconShown"
                                            class="icon-icon icon-icon-coz_send_fill text-xxl" width="1em" height="1em"
                                            viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                              d="M21.4159 13.3153C21.8961 13.0536 22.1965 12.5506 22.1965 11.9998C22.1965 11.449 21.8961 10.9483 21.4159 10.6865L3.99982 1.25701C3.53551 1.00437 2.98699 1.01575 2.53179 1.2866C2.07659 1.55744 1.80347 2.03768 1.80347 2.57027L3.725 10.0755L11.8947 11.2715C12.363 11.2715 12.7414 11.5969 12.7414 11.9998C12.7414 12.4026 12.363 12.7281 11.8947 12.7281C7.2906 13.4031 4.56846 13.799 3.72825 13.9159L1.80347 21.4293C1.80347 21.9619 2.07659 22.4421 2.53179 22.7153C2.98699 22.9861 3.53551 22.9975 3.99982 22.7448L21.4159 13.3153Z">
                                            </path>
                                          </svg>

                                          <svg v-if="SendLoadingIconShown" t="1727508508255" class="icon rotatingIcon"
                                            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            p-id="5483" width="1.5em" height="1.5em">
                                            <path
                                              d="M512.930909 92.858182a420.072727 420.072727 0 1 0 0 840.145454 420.072727 420.072727 0 0 0 0-840.145454z m0 114.036363a306.036364 306.036364 0 1 1 0 612.072728 306.036364 306.036364 0 0 1 0-612.072728z"
                                              fill="#1296db" fill-opacity=".25" p-id="5484"></path>
                                            <path
                                              d="M512.930909 92.858182v114.036363a306.036364 306.036364 0 1 0 234.449455 502.737455l7.726545-9.541818 90.158546 69.818182a420.072727 420.072727 0 1 1-344.715637-676.864l12.381091-0.186182z"
                                              fill="#1296db" fill-opacity=".85" p-id="5485"></path>
                                          </svg>

                                        </span>

                                      </button>
                                    </div>
                                  </span>
                                </div>
                                <div class="semi-divider semi-divider-vertical" style="height: 14px;"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="safe-area--m1haRS6B40QnzvzpsE0c safe-area-pc--cCdlsECKxs43bU2AGrGH">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>
<style scoped>
.cflur {
  background-color: rgba(255, 255, 255, 0.3);
  position: absolute;
  height: 100%;
  width: 100%;
  filter: blur(4px);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.rotatingIcon {
  animation: rotate 2s linear infinite;
}
</style>