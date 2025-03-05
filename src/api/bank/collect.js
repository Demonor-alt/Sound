import request from '@/utils/request.js'
//音色库 - 我的收藏
//查询
export const collectQueryService = (userId) => {
    return request.get(`/collect/${userId}`);
}
//批量删除
export const collectBatchDeleteService = (params) => {
    return request.delete('/collect',{ params: params })
}