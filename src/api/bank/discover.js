import request from '@/utils/request.js'
//音色库 - 发现
//查询
export const discoverQueryService = () => {
    return request.get('/api1/discover');
}
//更改收藏人数
export const discoverUpdateCollectService = (data) => {
    return request.put("/api1/collect/add",data);
}
export const discoverTagService = () => {
    return request.get("/api1/discover/tag");
}