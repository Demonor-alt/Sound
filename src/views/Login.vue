<template>
    <el-row style="height: 100vh;width: 100%;">
        <el-col :span="12" style="background-color: black;">
            <div class="logo"></div>
        </el-col>
        <el-col :span="12">
            <div class="body">
                <div
                    style="display: flex;flex-direction: column; align-items: center;width: 100%;justify-content: center;">
                    <h2>登录您的帐户</h2>
                    <div style="font-size: small;color: #71717a;">请使用您的电子邮箱和密码登录</div>
                </div>
                <MyInput :message="email" :placeholder="emailPlaceholder" :color="myBorderColor"
                    @update:message="handleEmail" />
                <MyInput :message="password" :placeholder="passwordPlaceholder" :color="myBorderColor" :type="type"
                    @update:message="handlePassword" />
                <el-button size="large" color="black" style="width: 100%;margin-top: 20px;" @click="handleLogin"
                    :loading="isLoading">登录</el-button>
            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import MyInput from '@/components/newComponent/Input.vue';
import { ref } from 'vue';
import { loginService } from '@/api/login';
const email = ref('');
const password = ref('');
const emailPlaceholder = ref('邮箱');
const passwordPlaceholder = ref('密码');
const type = ref('password');
const myBorderColor = ref('#f5f5f5');
const isLoading = ref(false);

function handleEmail(newValue) {
    email.value = newValue;
}
function handlePassword(newValue) {
    password.value = newValue;
}
import { useRouter } from 'vue-router';
const router = useRouter()
import { useTokenStore } from '@/stores/token'
const tokenStore = useTokenStore();
import { ElMessage } from 'element-plus';
const handleLogin = async () => {
    isLoading.value = true;
    const queryData = {
        email: email.value,
        password: password.value,
    };
    // let result = await loginService(queryData);
    // if (result.code == 0) {
        // tokenStore.setToken(result.data.token);
        // localStorage.setItem('user', email.value);
        setTimeout(() => {
            router.push('/discover');
            isLoading.value = false;
        }, 1000);
    // } else {
    //     setTimeout(() => {
    //         ElMessage.error(result.msg ? result.msg : '登录失败');
    //         isLoading.value = false;
    //     }, 1000);
    // }
};
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