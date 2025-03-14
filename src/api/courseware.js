import request from '@/utils/request.js'
//视频
//查询视频
export const pptQueryService = () => {
    return request.get("/ppt/query");
}
//新增视频
export const pptInsertService = (data) => {
    return request.post('/ppt',data);
}
