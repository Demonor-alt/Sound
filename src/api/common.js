import request from '@/utils/request.js'
//上传音频
export const createAudioloadService = (data) => {
    return request.post('/common/audio',data);
}