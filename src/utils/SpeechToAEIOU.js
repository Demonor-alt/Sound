import pinyinUtil from './pinyin/pinyinUtil.cjs';
import './pinyin/pinyin_dict_notone.js';

const SpeechToAEIOU = (speech) => {
    let result = [];
    let vowels = ['a', 'e', 'i', 'o', 'u', "f", "l", "m", "b", "p", "sh", "ch", "w", "q"];
    let pinyin = pinyinUtil.getPinyin(speech, ' ', false, false).split(' ');
    for (let char of pinyin) {
        for (let i = 0; i < char.length; i++) {
            if (vowels.indexOf(char.slice(i, i + 2)) !== -1) {
                result.push(char.slice(i, i + 2));
                i += 1
            }
            else if (vowels.indexOf(char[i]) !== -1) {
                result.push(char[i]);
            } 
            // else {
            //     result.push(0.001);
            // }
        }
        // result.push(0.002);
        // if ([",", "。", "，", " ", "?", "!", "？", "！"].includes(char)) {
        //     result.push(0.7);
        // }
    }
    console.log("Success!");
    return result;
}


const SpeechToPinYin = (speech) => {
    return pinyinUtil.getPinyin(speech, ' ', false, false);
}

export default SpeechToAEIOU;