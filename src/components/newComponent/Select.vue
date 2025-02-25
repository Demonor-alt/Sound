<template>
  <div class="custom-select">
    <el-popover v-model:visible="visiblePopover" placement="bottom" :width="inputWidth">
      <div class="options-wrapper">
        <div v-for="item in options" :key="item.value" class="option-item" :class="{ 'selected': value === item.value }"
          @click="handleSelect(item)">
          <div class="selected" v-if="value === item.value">
            <el-icon size="20"><Select /></el-icon>
            {{ item.label }}
          </div>
          <div v-else style="margin-left: 30px;"> {{ item.label }}</div>
        </div>
      </div>
      <template #reference>
        <el-input size="large" :value="displayValue" readonly :style="{ width: inputWidth }"
          @click="visiblePopover = !visiblePopover" :class="{ focused: visiblePopover }">
          <template #suffix>
            <el-icon :class="{ 'reverse-icon': !visiblePopover }">
              <ArrowUp />
            </el-icon>
          </template>
        </el-input>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue'
import { Select, ArrowUp } from '@element-plus/icons-vue'

const emit = defineEmits(['update:value']);

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
  },
  color: {
    type: String,
    default: '#f5f5f5'
  },
  background: {
    type: String,
    default: '#f5f5f5'
  }
})

const value = ref('1')
const visiblePopover = ref(false)

const displayValue = computed(() => {
  const selected = props.options.find(item => item.value === value.value)
  return selected ? selected.label : ''
})

const handleSelect = (item) => {
  value.value = item.value;
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

.reverse-icon {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

.el-input {
  padding: 1px;
  border: 3px solid v-bind(color);
  border-radius: 8px;
}

.focused {
  padding: 1px;
  border: 3px solid black;
  border-radius: 8px;
}
::v-deep .el-input__wrapper{
  background-color: v-bind(background) !important;
}
</style>