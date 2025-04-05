import asleep from './asleep.js'
import FullAudioRecord from './FullAudioRecord.js'
import SpeechToAEIOU from './SpeechToAEIOU.js'
let inputFunction = null
let inputEnableFunction = null
let talkFunction = null
let sendFunction = null
let loadingFunction = null
let sendloadingFunction = null
let initNumber = null
let changeAnimationFunction = null

let ContentRef = null
const AudioRecorder = new FullAudioRecord()

const demo1Text = `
There are several effective strategies. Start by using flashcards.
Write a word on one side and its definition, along with an example sentence,
on the other. Review them daily, and try to group words by themes like technology,
environment, or culture. This makes it easier to remember related words.
Another great approach is to read a variety of English materials, such as newspapers like The New York Times,
magazines like The Economist, and classic English novels. As you read, highlight new words and look them up.
Contextual learning helps solidify your understanding. You can also use vocabulary - building apps.
They often use gamification
`
const demo2Text = `
There are numerous practical approaches.First, practice active listening.
When you listen to English materials, focus intently, trying to catch every detail.
Listen to a wide range of sources like English news on BBC or CNN,
While listening, take brief notes of key information such as names, numbers, and main ideas.
This will not only improve your listening comprehension but also help you answer questions more accurately.
Additionally, do a lot of mock listening tests. After each test, go through the questions
`
const DemoControl = {
    initInput: function (inputMiddleFunction) {
        inputFunction = inputMiddleFunction
    },
    initInputEnable: function (inputEnableMiddleFunction) {
        inputEnableFunction = inputEnableMiddleFunction
    },
    initTalkButton: function (talkMiddleFunction) {
        talkFunction = talkMiddleFunction
    },
    initSendButton: function (sendMiddleFunction) {
        sendFunction = sendMiddleFunction
    },
    initLoading: function (loadingMiddleFunction) {
        loadingFunction = loadingMiddleFunction
    },
    initSendLoading: function (sendloadingMiddleFunction) {
        sendloadingFunction = sendloadingMiddleFunction
    },
    initNumber: function (number) {
        initNumber = number
    },
    changeAnimation: function (animation) {
        changeAnimationFunction = animation
    },
    playMusic: function (url) {
        const audio = new Audio(url)
        audio.play()
    },

    initRefContent: function (ref) {
        ContentRef = ref
    },
    play: {
        InitStatus: async function () {
            // await asleep(500)
            // await inputFunction(" ")
            // inputEnableFunction(false)
            // talkFunction(false)
            // sendFunction(false)
            // loadingFunction(true)
            // DemoControl.playMusic("/intro/ask4.mp3")
            // await inputFunction("||There is | a large | amount of | vocabulary | to learn || and  |I find |the listening |section |rather |difficult. ||What |strategies |can I |use?​")
            // loadingFunction(false)
            // sendloadingFunction(true)
            // await asleep(2000)
            await initNumber(2)
            changeAnimationFunction("伸手")
            DemoControl.playMusic("/Sound/intro/answer2.mp3")
            window.fileMorphs.packageAnimation.talk(SpeechToAEIOU(demo2Text))
            await asleep(50000)
            sendloadingFunction(false)
            sendFunction(true)
            inputEnableFunction(true)
            talkFunction(true)

            // await inputFunction(" ")
            // inputEnableFunction(false)
            // talkFunction(false)
            // sendFunction(false)
            // loadingFunction(true)
            // DemoControl.playMusic("/intro/ask4.mp3")
            // await inputFunction("||The listening |component |is seriously |tripping |me up.|| What | proven | methods |can I |use to |master it?")
            // loadingFunction(false)
            // sendloadingFunction(true)
            // await asleep(2000)
            // await initNumber(2)
            // await asleep(4300)
            // changeAnimationFunction("伸手")
            // DemoControl.playMusic("/intro/demo4.mp3")
            // window.fileMorphs.packageAnimation.talk(SpeechToAEIOU(demo2Text))
            // await asleep(50000)
            // sendloadingFunction(false)
            // sendFunction(true)
            // inputEnableFunction(true)
            // talkFunction(true)
        }
    },
    startModelTalk: async function (text, totalTime) {
        await window.fileMorphs.packageAnimation.talk(SpeechToAEIOU(text), totalTime)
        //this.stopModelTalk()
    },
    stopModelTalk: function () {
        window.fileMorphs.packageAnimation.stop()
    },
    stopAudioRecord: function () {
        AudioRecorder.stop()
    },
    //录音功能实现
    startAudioRecord: async function () {
        inputEnableFunction(false)
        talkFunction(false)
        sendFunction(false)
        await inputFunction("正在监听麦克风，请尝试说话以激活录音...")
        await inputFunction("正在录音中...")
        this.play.InitStatus()
        talkFunction(true)
        sendFunction(true)
        loadingFunction(false)
        inputEnableFunction(true)
    }
}
window.DemoControl = DemoControl

export default DemoControl;