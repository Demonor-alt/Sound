import request from '@/utils/request.js'
//音色库
//查询
export const bankQueryService = () => {
    return request.get('/bank/query');
}
