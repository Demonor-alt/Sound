import request from '@/utils/request.js'
//音色库 - 我的音色
//查询
export const bankQueryService = () => {
    return request.get('/bank/query');
}
