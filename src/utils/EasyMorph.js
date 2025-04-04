const EasyMorph = function () {
    this.MorphData = {}
    this.model = null
    this.stop = false

    this.getMorphData = () => {
        return this.MorphData
    }
    this.setModel = (model) => {
        this.model = model
        model.traverse((child) => {
            if (child.isMesh) {
                console.log(child)
                if (child.morphTargetDictionary) {
                    if (this.MorphData[child.name] || "Untitled") {
                        this.MorphData[child.name] = {}
                    }
                    for (let morphName in child.morphTargetDictionary) {
                        this.MorphData[child.name][morphName] = {
                            set: (value) => {
                                child.morphTargetInfluences[child.morphTargetDictionary[morphName]] = value
                            },
                            get: () => {
                                return child.morphTargetInfluences[child.morphTargetDictionary[morphName]]
                            }
                        }
                    }
                }
            }
        })
    }
    this.packageAnimation = {
        stop: () => {
            this.stop = true
        },
        talk: async (speech, total_time) => {
            total_time = total_time || speech.length * 0.05
            const EachTime = total_time / speech.length 
            const lipMorsh = this.MorphData.body001
            const availableMorph = ["AI", "E", "FV", "L", "MBP", "O", "ShCh", "U", "WQ"]
            const realInfluence = {
                "a": "AI",
                "e": "E",
                "i": "AI",
                "o": "O",
                "u": "U",
                "f": "FV",
                "v": "FV",
                "l": "L",
                "m": "MBP",
                "b": "MBP",
                "p": "MBP",
                "sh": "ShCh",
                "ch": "ShCh",
                "w": "WQ",
                "q": "WQ"
            }
            for (let char of speech) {
                if (this.stop) {
                    this.stop = false
                    break;
                }
                if (Object.keys(realInfluence).includes(char)) {
                    await RealTimeToExcute(lipMorsh[realInfluence[char]].set, EachTime, 0, 1, true)
                    console.log(`${realInfluence[char]} Excuted`)
                }
            }
        }
    }
}

const RealTimeToExcute = async (func, time, min, max, back) => {
    time = time * 1000
    let TotalSteps = Math.floor(time / 3)
    let Step = (max - min) / TotalSteps
    for (let i = 0; i < TotalSteps; i++) {
        func(min + Step * i)
        await asleep(1)
    }
    if (back) {
        for (let i = TotalSteps; i > 0; i--) {
            func(min + Step * i)
            await asleep(1)
        }
    }
}

const asleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
export default EasyMorph;