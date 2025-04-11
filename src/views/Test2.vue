<template>
    <el-upload :auto-upload="false" :show-file-list="true" :on-change="handleChange">
        <el-button slot="trigger">选择文件</el-button>
    </el-upload>
</template>

<script setup>
// 处理文件变更
const handleChange = (file, fileList) => {
    console.log(file, fileList);
};
</script>