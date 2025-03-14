import request from '@/utils/request.js'
//音频
//查询音频
export const audioQueryService = (userId) => {
    return request.get(`/query/audio/${userId}`);
}
//新增音频
export const audioInsertService = (data) => {
    return request.post('/explanation',data);
}