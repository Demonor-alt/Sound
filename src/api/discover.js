import request from '@/utils/request.js'
//音色库 - 发现
//查询
export const discoverQueryService = () => {
    return request.get('/discover');
}
//更改分享人数
export const discoverUpdateShareService = (data) => {
    return request.put('/discover/share',data)
}