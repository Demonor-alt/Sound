import request from '@/utils/request.js'
//音色库 - 我的音色
//查询
export const bankQueryService = (userId) => {
    return request.get(`/mybank/${userId}`);
}
//删除
export const bankDeleteService = (voiceId) => {
    return request.delete("mybank?voiceId=" + voiceId);
}
//新增
export const bankInsertService = (data) => {
    return request.post('/mybank',data);
}
