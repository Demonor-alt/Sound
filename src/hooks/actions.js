export const toggleLike = (voice) => {
    if (voice.voiceIsLiked === 1) {
        voice.voiceIsLiked = 0;
        voice.voiceLikeCount--;
    } else {
        if (voice.voiceIsLiked === 2) {
            voice.voiceIsUnliked = false;
        }
        voice.voiceIsLiked = 1;
        voice.voiceLikeCount++;
    }
};
export const toggleDislike = (voice) => {
    if (voice.voiceIsLiked === 2) {
        // 当前是不喜欢状态，切换为中立
        voice.voiceIsLiked = 0;
        voice.voiceIsUnliked = false;
    } else {
        // 当前不是不喜欢状态
        if (voice.voiceIsLiked === 1) {
            voice.voiceLikeCount--;
            voice.voiceIsLiked = 0;
        }
        voice.voiceIsLiked = 2;
        voice.voiceIsUnliked = true;
    }
};
import {discoverUpdateCollectService } from '@/api/bank/discover'
export const toggleCollect = async (voice) => {
    voice.voiceIsCollected = !voice.voiceIsCollected;
    if (voice.voiceIsCollected) {
        voice.voiceCollectCount++;
    } else {
        voice.voiceCollectCount--;
    }
    const editData = {
        voiceId: voice.voiceId,
        voiceCollectCount: voice.voiceCollectCount,
    }
    let result = await discoverUpdateCollectService(editData);
};
