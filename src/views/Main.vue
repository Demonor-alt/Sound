<template>
  <el-container class="layout-container">
    <el-header>
      <div class="logo"></div>
      <div class="menu">
        <el-popover placement="bottom" :width="170" trigger="hover">
          <template #reference>
            <div class="menu-item" :class="{ active: activeMenu === 'discover' || activeMenu === 'mybank' || activeMenu === 'collect'}" @click="setActive('discover')">
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
        <div class="menu-item" :class="{ active: activeMenu === 'createbank' }" @click="setActive('createbank')">
          <el-icon size="20">
            <MagicStick />
          </el-icon>克隆声音
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'explanation' }" @click="setActive('explanation')">
          <el-icon size="20">
            <Service />
          </el-icon>语音合成
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'teach' }" @click="setActive('teach')">
          <el-icon size="20">
            <DataBoard />
          </el-icon>语言教学
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'courseware' }" @click="setActive('courseware')">
          <el-icon size="20">
            <Tickets />
          </el-icon>有声课件
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'assistant' }" @click="setActive('assistant')">
          <el-icon size="20">
            <Connection />
          </el-icon>辅助阅读
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'teacher' }" @click="setActive('teacher')">
          <el-icon size="20">
            <User />
          </el-icon>虚拟教师
        </div>
        <div class="menu-item" :class="{ active: activeMenu === 'voice' }" @click="setActive('voice')">
          <el-icon size="20">
            <VideoCamera />
          </el-icon>视频变声
        </div>
      </div>
      <el-avatar src="http://yiyangqianxihsdkhejknfnbhuyjwes.online/975adcd7-15bf-44d4-a440-be2fbc972af1.jpg" :icon="UserFilled" />
      <!-- <el-avatar v-if="token.userImage !== ''" :src="token.userImage"  style="margin-right: 20px;"/>
      <el-avatar v-else :icon="UserFilled" /> -->
    </el-header>
    <div style="background-color: #e4e4e7;height: 1px;width: 100%;"></div>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Bell,
  MagicStick,
  Service,
  DataBoard,
  Tickets,
  Connection,
  User,
  UserFilled,
  VideoCamera,
  Collection,
  Compass,
  Folder
} from '@element-plus/icons-vue';
const router = useRouter();
const route = useRoute();
const activeMenu = ref('');
watchEffect(() => {
  const pathSegments = route.path.split('/');
  activeMenu.value = pathSegments[1] || '';
});
function setActive(index) {
  router.push(`/${index}`);
}
import { useTokenStore } from '@/stores/token'
const { token } = useTokenStore();
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
.el-main{
  background-color: #fafafa;
}

.logo {
  width: 130px;
  height: 45px;
  background: url('../assets/background.png') no-repeat center / contain;
  border: #e0e5eb 1px solid;
  border-radius: 10px;
}

.menu {
  display: flex;
  flex-direction: row;
  gap: 20px;
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
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  gap: 10px;
}

.menu-item:hover {
  background-color: #e0e5eb;
}

.menu-item.active {
  background-color: #e0e5eb;
}

.avatar {
  margin-right: 30px;
}
</style>