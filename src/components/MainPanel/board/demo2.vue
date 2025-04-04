<script setup>
import { marked } from 'marked'
import { onMounted, ref, toRef } from 'vue'
import asleep from '../../../utils/asleep';


const hasImage = ref(false)
const srcImage = ref('')
const content = `
There are numerous practical approaches.

First, practice active listening.
When you listen to English materials, focus intently, |trying to catch every detail.
Listen to a wide range of sources like English news |on BBC |or CNN.
|While listening, take brief notes of key information such as names, numbers, and main ideas.
This will not only improve your listening |comprehension ||but also help you answer questions more accurately.

Additionally, do a lot of mock listening tests.
After each test, |go through the questions you got wrong.
Figure out if it was due to mishearing words, not understanding the context,
or issues with question - |answering techniques. This targeted review will boost your performance.
`
let rawContent = ""
const markedContent = ref('')

!(async () => {
    for (let i = 0; i < content.length; i++) {
        await asleep(50)
        if(["|"].includes(content[i])) {
            await asleep(300)
            continue
        } else if (["."].includes(content[i])) {
            rawContent+=content[i]
            await asleep(600)
            continue
        } else if ([","].includes(content[i])) {
            rawContent+=content[i]
            await asleep(400)
            continue
        } 
        rawContent += content[i]
        //判断图片
        if(rawContent.match(/<img src="(.+?)">/)) {
            hasImage.value = true
            srcImage.value = rawContent.match(/<img src="(.+?)">/)[1]
            rawContent = rawContent.replace(/<img src="(.+?)">/,"")
        }
        markedContent.value = marked(rawContent+"🤔...")
    }
    await asleep(2000)
    markedContent.value = marked(rawContent)
})()
// const rdata = {
//   x: [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   y: {
//     "提交的反馈": {
//       data: [1, 2, 2, 1, 3, 5, 9, 7, 8],
//       color: "#4e40e5",
//     },
//     "解决的反馈": {
//       data: [0, 1, 0, 3, 0, 1, 2, 5, 3],
//       color: "#3A416F",
//     },
//   }
// }

</script>
<template>
    <div v-html="markedContent"  style="font-size: 25px;">

    </div>
</template>

<style scoped>
.rotatingIcon {
    animation: rotate 2s linear infinite;
}
</style>