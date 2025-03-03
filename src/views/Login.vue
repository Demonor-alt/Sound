<template>
    <el-row style="height: 100vh;width: 100%;">
        <el-col :span="12" style="background-color: black;">
            <div class="logo"></div>
        </el-col>
        <el-col :span="12">
            <Input />
        </el-col>
    </el-row>
</template>
<script>
import Input from '@/components/newComponent/Input.vue';

</script>
<style>
  .logo {
    width: 150px;
    height: 60px;
    padding-left: 10px;
    background: url('../assets/logo2.svg') no-repeat center / contain;

  }
  
</style>