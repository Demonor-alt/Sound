import request from '@/utils/request.js'
//登录
export const uploadAudioloadService = (loginData) => {
    return request.post('/common/uploadaudio',loginData);
}