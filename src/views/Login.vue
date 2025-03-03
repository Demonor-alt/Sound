<template>
    <el-row style="height: 100vh;width: 100%;">
        <el-col :span="12" style="background-color: black;">
            <div class="logo"></div>
        </el-col>
        <el-col :span="12">
            <div class="body">
                <div style="display: flex;flex-direction: column; align-items: center;width: 100%;justify-content: center;">
                    <h2>登录您的帐户</h2>
                    <div style="font-size: small;color: #71717a;">请使用您的电子邮箱和密码登录</div>
                </div>
                <MyInput :message="no" :placeholder="noPlaceholder" :color="myBorderColor" @update:message="handleNo" />
                <MyInput :message="password" :placeholder="passwordPlaceholder" :color="myBorderColor"
                    @update:message="handlePassword" />
                <el-button size="large" color="black" style="width: 100%;margin-top: 20px;"
                    @click="login">登录</el-button>
            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import MyInput from '@/components/newComponent/Input.vue';
import { ref } from 'vue';
const no = ref('');
const password = ref('');
const noPlaceholder = ref('邮箱');
const passwordPlaceholder = ref('密码');
const myBorderColor = ref('#f5f5f5')
function handleNo(newValue) {
    searchText.value = newValue;
}
function handlePassword(newValue) {
    searchText.value = newValue;
}
import { useRouter } from 'vue-router'
const router = useRouter()
const login = () => {
    router.push('/discover');
}
</script>
<style>
.logo {
    width: 150px;
    height: 60px;
    padding-left: 10px;
    background: url('../assets/logo2.svg') no-repeat center / contain;
}

.body {
    display: flex;
    flex-direction: column;
    width: 50%;
    gap: 5px;
    padding-top: 25%;
    padding-left: 25%;
}
</style>