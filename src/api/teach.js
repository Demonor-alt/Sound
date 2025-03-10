import request from '@/utils/request.js'
//语言教学
//查询发音
export const teachQueryService = (languageType) => {
    return request.get(`/teach/pronounce/${languageType}`);
}
//发送练习录音
export const createAudioloadService = (data) => {
    return request.post('/teach/record',data);
}
//
export const teachExerciseQueryService = (params) => {
    return request.get('/teach/exercise',{params:params});
}