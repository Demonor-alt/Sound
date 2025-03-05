import request from '@/utils/request.js'
//音色库 - 发现
//查询
export const discoverQueryService = () => {
    return request.get('/discover');
}
//更改分享人数
export const discoverUpdateShareService = (id) => {
    return request.post(`/discover/share?voiceId=${id}`);
}
//更改喜欢人数
export const discoverUpdateLikeService = (data) => {
    return request.put("/discover/like",data);
}
//更改收藏人数
export const discoverUpdateCollectService = (data) => {
    return request.put("/discover/collect",data);
}
export const discoverTagService = () => {
    return request.get("/discover/tag");
}