import request from '@/utils/request.js'
//语言教学
//查询发音
export const teachQueryService = (languageType) => {
    return request.get(`/teach/pronounce/${languageType}`);
}