import request from '@/utils/request.js'
//音色库 - 我的收藏
//查询
export const collectQueryService = () => {
    return request.get(`/collect/all`);
}
//批量删除
export const collectBatchDeleteService = (params) => {
    return request.delete('/collect',{ params: params })
}
//查询收藏音色所有信息
export const collectQueryAllService = () => {
    return request.get(`/collect/all`);
}