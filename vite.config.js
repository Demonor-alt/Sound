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
  server: {
    proxy: {
      '/api1': {
        // target:'http://127.0.0.1:4523/m1/5812788-5497864-default',//本地mock
        target: 'https://frp-bar.com:37298',//后端
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api1/, '')//api1替换为''
      },
      '/api2': {
        //target: 'https://www.u1605327.nyat.app:22465',//AI
        target: 'http://127.0.0.1:9880',//本地
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api2/, '')//api2替换为''
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