<template>
  <div class="input" :class="{ focused: isFocused }">
    <el-input size="large" v-model="input" :placeholder="props.placeholder" @focus="isFocused = true"
      @blur="isFocused = false" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  message: String,
  placeholder: String
});
const emit = defineEmits(['update:message']);

const input = ref(props.message || '');
const isFocused = ref(false);
watch(() => input.value, (newValue) => {
    emit('update:message', newValue);
  });
</script>

<style scoped>
.input {
  padding: 1px;
  border: 3px solid #f5f5f5;
  border-radius: 8px;
}

.input.focused {
  border: 3px solid black;
  border-radius: 8px;
}
::v-deep .el-input__wrapper{
  background-color: #f5f5f5 !important;
}
</style>