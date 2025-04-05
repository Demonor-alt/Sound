import './assets/main.scss'
import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//import './theme/index.css'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import router from '@/router'
import * as buffer from "buffer";
if (typeof window.global === "undefined") {
    window.global = window;
}
if (typeof window.Buffer === "undefined") {
    window.Buffer = buffer.Buffer;
}
const app = createApp(App);
const pinia = createPinia();
const persist = createPersistedState();
pinia.use(persist)
app.use(pinia)
app.use(ElementPlus);
app.use(router);
app.mount('#app');
