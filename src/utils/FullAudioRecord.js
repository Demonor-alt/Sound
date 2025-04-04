import Crunker from 'crunker'
function FullAutioRecord() {
    navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
    this.scriptProcessor = null
    this.mediaStreamSource = null
    this.getStream = async function () {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia({ audio: true }, function (stream) {
                resolve(stream)
            }, function (e) {
                console.log('No live audio input: ' + e)
            })
        })
    }
    this.stream = null
    this.stop = function () {
        if (this.scriptProcessor) {
            this.scriptProcessor.disconnect()
            this.scriptProcessor.onaudioprocess = null
            this.scriptProcessor = null
        }
        if (this.mediaStreamSource) {
            this.mediaStreamSource.disconnect()
            this.mediaStreamSource = null
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop()
            })
            this.stream = null
        }
    }
    this.start = async function (startRecordCallback) {
        return new Promise(async (resolve, reject) => {
            this.stream = await this.getStream()
            let audioContext = new AudioContext()
            this.mediaStreamSource = audioContext.createMediaStreamSource(this.stream)
            this.scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1)
            this.mediaStreamSource.connect(this.scriptProcessor)
            this.scriptProcessor.connect(audioContext.destination)
            let status = 0
            let recordBuffer = []
            let waitTime = 0
            this.scriptProcessor.onaudioprocess = (e) => {
                let buffer = e.inputBuffer.getChannelData(0)
                let maxVal = Math.max.apply(Math, buffer) * 100
                console.log(maxVal)
                if (maxVal > 14) {
                    waitTime = new Date().getTime()
                    if (status == 0) {
                        status = 1
                        console.log('Start')
                        startRecordCallback()
                    }
                } else {
                    let nowTime = new Date().getTime()
                    if (nowTime - waitTime > 3000) {
                        if (status == 1) {
                            this.stop()
                            console.log('End')
                            let crunker = new Crunker()
                            const blob = crunker.concatAudio(recordBuffer)
                            resolve(crunker.export(blob, 'audio/wav').blob)
                        }
                    }
                }
                if (status == 1) {
                    let audioBuffer = audioContext.createBuffer(1, buffer.length, audioContext.sampleRate)
                    audioBuffer.getChannelData(0).set(buffer)
                    recordBuffer.push(audioBuffer)
                }
            }
        })
    }
    this.play = async function (blob) {
        window.recordBuffer = blob
        let audio = new Audio(URL.createObjectURL(new Blob([blob], { type: 'audio/wav' })))
        await audio.play()
    }
}

window.FullAutioRecord = FullAutioRecord;

export default FullAutioRecord;