<template>
    <!-- 按钮元素，点击触发 openDialog 方法 -->
    <el-button @click="openDialog">打开对话框</el-button>
    <!-- 对话框组件 -->
    <el-dialog v-model="dialogVisible" title="问题反馈" width="400px">
        <div class="feedback-dialog">
            <el-checkbox-group v-model="checkedOptions" class="checkbox-group">
                <el-checkbox v-for="option in options" :key="option.value" :label="option.label"
                             class="checkbox-item" />
            </el-checkbox-group>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessageBox } from 'element-plus';

// 对话框显示状态
const dialogVisible = ref(false);

// 复选框配置项
const options = reactive([
    { value: 1, label: '我的答案不应被接受' },
    { value: 2, label: '音频听起来不正确' },
    { value: 3, label: '缺少音频' },
    { value: 4, label: '其他问题' }
]);

// 选中的选项
const checkedOptions = ref([]);

const openDialog = () => dialogVisible.value = true;
const closeDialog = () => dialogVisible.value = false;

defineExpose({ openDialog, closeDialog });
</script>

<style scoped>
.feedback-dialog {
    padding: 10px 20px;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.checkbox-item {
    :deep(.el-checkbox__label) {
        font-size: 14px;
        color: #606266;
    }
}

.action-row {
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
    border-top: 1px solid #ebeef5;
}
</style>