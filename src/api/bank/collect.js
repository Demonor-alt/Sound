import request from '@/utils/request.js'
//音色库 - 我的收藏
//查询
export const collectQueryService = () => {
    return request.get(`/api1/collect/all`);
}
//批量删除
export const collectBatchDeleteService = (data) => {
    return request.put('/api1/collect',data)
}
//查询收藏音色所有信息
export const collectQueryAllService = () => {
    return request.get(`/api1/collect/all`);
}