import request from '@/utils/request.js'
//音色库 - 我的音色
//查询
export const bankQueryService = () => {
    return request.get(`/api1/mybank/all`);
}
//删除
export const bankDeleteService = (voiceId) => {
    return request.delete("/api1/mybank/delete?voiceId=" + voiceId);
}
//新增(基本信息)
export const bankInsertService = (data) => {
    return request.post('/api1/mybank',data);
}
//修改音色详情
export const bankUpdateService = (data) => {
    return request.put('/api1/mybank/detail',data)
}
//修改音色示例
export const bankUpdateSamplesService = (data) => {
    return request.put('/api1/mybank/samples',data)
}
//查询我的音色所有信息
export const bankQueryAllService = () => {
    return request.get(`/api1/mybank/all`);
}
//查询音色详情
export const bankQueryDetailService = (voiceId) => {
    return request.get(`/api1/query/${voiceId}`);
}
//查询指定音色
export const bankQuerySingleDetailService = (voiceId) => {
    return request.get(`/api1/query/${voiceId}`);
}
//克隆指定音色
export const bankCloneSamplesService = (data) => {
    return request.post(`/api1/clone`,data);
}


//新增（音频）
export const bankInsertMySampleService = (data) => {
    return request.post('/api2/tts',data,{
        responseType: 'stream' 
      });
}

//上传音频
export const uploadService = (data) => {
    return request.post('/set_refer_audio', data);
}
//新增示例音频
export const bankInsertSamplesService = (data) => {
    return request.post('/api1/mybank/mysample',data);
}
//上传音频，返回url
export const uploadSampleService = (data) => {
    return request.post('/api1/explanation/upload', data);
}
