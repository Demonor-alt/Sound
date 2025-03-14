import request from '@/utils/request.js'
//视频
//查询视频
export const voiceQueryService = () => {
    return request.get("/voice/query");
}
//新增视频
export const voiceInsertService = (data) => {
    return request.post('/voice',data);
}
