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
import { ElNotification } from 'element-plus'
export const open = (audioId) => {
  const currentUrl = window.location.href;
  const textToCopy = `${currentUrl}?id=${audioId}`;
  navigator.clipboard.writeText(textToCopy)
    .then(async () => {
      ElNotification({
        message: "已复制到剪贴板",
        position: 'bottom-right',
      });
    })
    .catch((error) => {
      ElNotification({
        message: `复制失败: ${error.message}`,
        position: 'bottom-right',
        type: 'error'
      });
    });
};
export const downloadAudio = (audioUrl) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', audioUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audio.mp3';
        a.click();
        URL.revokeObjectURL(url);
      }
    };
    xhr.send();
  };