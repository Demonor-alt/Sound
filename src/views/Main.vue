<template>
    <el-container class="layout-container">
      <el-header>
        <div class="logo"></div>
        <div class="menu">
          <el-popover
            placement="bottom"
            :width="170"
            trigger="hover"
          >
            <template #reference>
              <div class="menu-item">
                <el-icon size="20">
                  <Bell />
                </el-icon>音色库
              </div>
            </template>
            <div class="submenu-item" @click="setActive('discover')">
              <el-icon size="20">
                <Compass />
              </el-icon>发现
            </div>
            <div class="submenu-item" @click="setActive('mybank')">
              <el-icon size="20">
                <Folder />
              </el-icon>自定义声音
            </div>
            <div class="submenu-item" @click="setActive('collect')">
              <el-icon size="20">
                <Collection />
              </el-icon>模型收藏
            </div>
          </el-popover>
          <div class="menu-item" @click="setActive('explanation')">
            <el-icon size="20">
              <Service />
            </el-icon>语音讲解
          </div>
          <div class="menu-item" @click="setActive('teach')">
            <el-icon size="20">
              <DataBoard />
            </el-icon>语言教学
          </div>
          <div class="menu-item" @click="setActive('courseware')">
            <el-icon size="20">
              <Tickets />
            </el-icon>有声课件
          </div>
          <div class="menu-item" @click="setActive('teacher')">
            <el-icon size="20">
              <User />
            </el-icon>虚拟教师
          </div>
          <div class="menu-item" @click="setActive('voice')">
            <el-icon size="20">
              <VideoCamera />
            </el-icon>视频变声
          </div>
        </div>
        <el-avatar v-if="token.userImage !== ''" :src="token.userImage" />
        <el-avatar v-else :icon="UserFilled" />      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import {
    Bell,
     Service,
     DataBoard,
     Tickets,
     User,
     UserFilled,
     VideoCamera,
     Collection,
     Compass,
     Folder
  } from '@element-plus/icons-vue';
  const router = useRouter();
  function setActive(index) {
    router.push(`/${index}`);
  }
  import { useTokenStore } from '@/stores/token'
const {token} = useTokenStore();
  </script>
  
  <style scoped>
  .layout-container {
    height: 100vh;
  }
  
  .el-header {
    background-color: #fafafa;
    display: flex;
    align-items: center;
    height: 60px;
    justify-content: space-between;
  }
  
  .logo {
    width: 150px;
    height: 60px;
    background: url('../assets/logo.svg') no-repeat center / contain;
  }
  
  .menu {
    display: flex;
    flex-direction: row;
    gap: 80px;
  }
  
  .submenu-item {
    font-size: 16px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    margin: 5px;
    border-radius: 6px;
  }
  
  .submenu-item:hover {
    background-color: #e0e5eb;
  }
  
  .menu-item {
    font-size: 16px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    cursor: pointer;
  }
  
  .avatar {
    margin-right: 30px;
  }
  </style>