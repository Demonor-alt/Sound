import axios from 'axios';
const baseURL = '/api';
const instance = axios.create({ baseURL })
import { useTokenStore } from '@/stores/token.js'
instance.interceptors.request.use(
    (config) => {
        const tokenStore = useTokenStore();
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token.token;
        }
        return config;
    },
    (err) => {
        Promise.reject(err)
    }
)
export default instance;