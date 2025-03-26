import request from '@/utils/request.js'
//音色库 - 发现
//查询
export const discoverQueryService = () => {
    return request.get('/discover');
}
//更改收藏人数
export const discoverUpdateCollectService = (data) => {
    return request.put("/collect/add",data);
}
export const discoverTagService = () => {
    return request.get("/discover/tag");
}