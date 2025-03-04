import request from '@/utils/request.js'
//登录
export const loginService = (loginData) => {
    return request.post('/login',loginData);
}