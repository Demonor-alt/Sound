import request from '@/utils/request.js'
//音频
// //查询音频
// export const audioQueryService = () => {
//     return request.get("/query/audio");
// }
// //新增音频
// export const audioInsertService = (data) => {
//     return request.post('/explanation',data);
// }
// // 通过语音voiceId传回音频文件
// export const voiceQueryToAudioService = (voiceId) => {
//   return request.get(`/explanation/query/${voiceId}`, {
//     responseType: 'blob'
//   });
// }
//上传音频，返回url
export const voiceUploadService = (data) => {
    return request.post('/api1/explanation/upload',data);
}