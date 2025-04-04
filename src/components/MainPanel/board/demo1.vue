<script setup>
import { marked } from 'marked'
import { onMounted, ref, toRef } from 'vue'
import asleep from '../../../utils/asleep';


const hasImage = ref(false)
const srcImage = ref('')
const content = `
There are several effective strategies.|

Start by using flashcards. |Write a word on one side and its definition, along with an example sentence, on the other.
Review them daily, and try to group words by themes like technology, environment, or culture.
This makes it easier to remember | related words.

|Another great approach is to read a variety of English materials, |such as newspapers like The New York Times,
magazines like The Economist, and classic English novels.
|As you read, highlight new words and look them up. Contextual learning helps solidify your understanding.

You can also use vocabulary - |building apps.| They often use gamification and spaced - |repetition techniques to make learning fun and efficient.

Additionally, make a habit of using new words in your own writing and speaking.
  This practical application will ensure the words become a part of your active vocabulary.
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