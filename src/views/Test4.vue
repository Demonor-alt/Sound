<template>
    <button @click="startPlayback" :disabled="isPlaying">
        {{ isPlaying ? '播放中...' : '开始播放' }}
    </button>
    <div v-if="error" class="error">{{ error }}</div>
</template>

<script setup>
import { Howl } from 'howler'
import {ref} from 'vue'
const isPlaying = ref(false);
async function startPlayback() {
    const formData = new FormData();
    formData.append('text', "在信息,爆炸的时代，我们每天被海量的数据包围，而阅读，这一古老的行为，却依旧散发着独特且强大的魅力，拥有着不可估量的力量。​阅读是一座取之不尽的知识宝库。通过书籍，我们能穿越时空，与古圣先贤对话。翻开《论语》，便能聆听孔子及其弟子的智慧言论，体悟为人处世的准则与道德修养的真谛；研读《物种起源》，跟随达尔文的脚步，探索生命演化的奥秘，了解物种如何在漫长岁月中适应环境、不断进化。无论是历史、科学、文学还是艺术，每一本书都是作者知识与经验的结晶，阅读使我们能在有限的生命里，汲取无限的知识养分，拓宽认知边界，丰富精神世界。​阅读能够深度拓展我们的思维。当沉浸在一本推理小说中，如阿加莎・克里斯蒂的作品，我们会跟随主角的视角，抽丝剥茧地分析线索，从错综复杂的情节中推断出真相，这一过程极大地锻炼了逻辑思维能力。而阅读哲学书籍，像尼采的《查拉图斯特拉如是说》，那些深邃的思想和独特的观点，会促使我们突破常规思维的局限，以全新视角审视世界、思考人生意义，培养批判性思维与创新思维，让我们在面对生活中的问题时，能从更多维度去分析和解决。​阅读更是心灵的滋养剂。在疲惫的生活中，一本温暖的治愈系书籍能成为心灵的避风港。当我们翻开《小王子》，被那纯真的故事和深刻的哲理触动，小王子与狐狸之间真挚的情感，让我们重新审视人与人之间的关系，唤起内心深处那份被遗忘的童真与善良，抚平生活带来的焦虑与创伤。文学作品中的优美语句，如潺潺溪流，润泽我们的心田，让我们在喧嚣尘世中寻得片刻宁静，感受到人性的美好与生命的价值。​阅读的力量，还在于它能引发共鸣，连接不同的灵魂。当我们读到与自己经历相似、情感契合的文字时，那种心有灵犀的感觉，仿佛在茫茫人海中找到了知音。这种共鸣跨越了年龄、性别、地域的界限，让全球的读者因共同喜爱的书籍相聚在一起，分享感悟，交流思想，形成一个庞大而温暖的精神共同体。​阅读，以无声的力量塑造着我们的知识体系、思维模式和心灵世界，如同点点繁星，照亮我们前行的道路，引领我们在人生旅途中不断探索、成长，领略世间无尽的美好。​不知你对这篇关于阅读力量的文章是否满意？要是你希望更换主题，或是在风格、内容侧重点上有其他想法，都能跟我讲，我会据此修改。");
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
    const sound = new Howl({
        src: [apiUrl],
        xhr: {
            method: 'GET',
        },
        html5: true,
        format: ['wav'],
        onplay: () => {
            isPlaying.value = true
        },
        onend: () => { isPlaying.value = false },
        onloaderror: (id, error) => {
            console.error('音频加载失败', error)
            isPlaying.value = false
        }
    })
    sound.play()
}


</script>