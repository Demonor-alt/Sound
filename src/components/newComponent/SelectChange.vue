<template>
    <div class="custom-select">
        <el-popover :visible="visiblePopover" placement="bottom" :width="inputWidth">
            <div class="options-wrapper">
                <div v-for="item in filteredOptions" :key="item.value" class="option-item"
                    :class="{ 'selected': value === item.value }" @click="handleSelect(item)">
                    <div style="margin-left: 20px;">{{ item.label }}</div>
                </div>
            </div>
            <template #reference>
                <el-input v-model="value" clearable  placeholder="请选择" :style="{ width: inputWidth }"
                    @click="visiblePopover = !visiblePopover"
                    @clear=" emit('update:value', '')"
                    :class="{ focused: visiblePopover }">
                </el-input>
            </template>
        </el-popover>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
    options: {
        type: Array,
        default: () => [
            { value: '1', label: '选项1' },
            { value: '2', label: '选项2' },
            { value: '3', label: '选项3' }
        ]
    },
    inputWidth: {
        type: String,
        default: '240px'
    }
});

const value = ref('');
const visiblePopover = ref(false);
const emit = defineEmits(['update:value']);

const filteredOptions = computed(() => {
    return props.options.filter((item) =>
        item.label.includes(value.value)
    );
});

const handleSelect = (item) => {
    value.value = item.label;
    visiblePopover.value = false;
    emit('update:value', item.value);
};
</script>

<style scoped>
.options-wrapper {
    max-height: 200px;
    overflow-y: auto;
}

.option-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s;
}

.selected {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
}

.option-item:hover {
    background-color: #f5f7fa;
}

.el-input {
    padding: 1px;
    border: 2px solid #ffffff;
    border-radius: 8px;
}

.focused {
    padding: 1px;
    border: 2px solid black;
    border-radius: 8px;
}
::v-deep .el-input__wrapper{
  background-color: #f5f5f5 !important;
}
</style>