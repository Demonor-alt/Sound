<template>
    <el-table v-loading="loading" :data="tableData" style="width: 100%" class="custom-loading-table">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
    </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(true)

const tableData = [
    {
        date: '2016-05-02',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District',
    },
    {
        date: '2016-05-04',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District',
    },
    {
        date: '2016-05-01',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District',
    },
]
</script>

<style>
.custom-loading-table .el-loading-mask {
    background-color: #f5f5f5 !important;
}

.custom-loading-table .el-loading-spinner .path {
    stroke: black !important;
}

.custom-loading-table .el-loading-spinner svg {
    width: 30px !important;
    height: 30px !important;
    animation: rotating 2s linear infinite;
}

@keyframes rotating {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>