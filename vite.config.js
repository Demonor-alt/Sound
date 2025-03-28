import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/Sound/',
  build: {
    outDir: 'docs'
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // server:{
  //   proxy:{
  //     '/api':{
  //         target:'http://127.0.0.1:4523/m1/5812788-5497864-default',//后台服务所在的源
  //         changeOrigin:true,//修改源
  //         rewrite:(path)=>path.replace(/^\/api/,'')///api替换为''
  //     }
  //   }
  // }
  server: {
    proxy: {
      '/api': {
        target: 'https://frp-bar.com:44463',//后台服务所在的源
        changeOrigin: true,
        secure: false,
        ws: true, // 如果需要 WebSocket
        rewrite: (path) => path.replace(/^\/api/, '')///api替换为''
      }
    }
  }
})
/*const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/": {
        target: "http://127.0.0.1:4523/m1/486777-0-default",
        changeOrigin: true,
      },
    },
  },
});*/