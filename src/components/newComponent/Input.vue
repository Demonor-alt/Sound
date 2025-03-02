<template>
    <div class="inputW" :class="{ focused: isFocused }">
        <el-input size="large" v-model="input" :rows="props.rows" :placeholder="props.placeholder"
            :maxlength="props.maxlength" @focus="isFocused = true" @blur="isFocused = false" :type="props.type" />
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    message: String,
    placeholder: String,
    type: String,
    rows: String,
    maxlength: String,
    color: {
        type: String,
        default: '#ffffff'
    },
    background :{
        type: String,
        default: '#f5f5f5'
    },
});
const emit = defineEmits(['update:message']);

const input = ref(props.message || '');
const isFocused = ref(false);
watch(() => input.value, (newValue) => {
    emit('update:message', newValue);
});
</script>

<style scoped>
.inputW {
    padding: 1px;
    border: 3px solid v-bind(color);
    border-radius: 8px;
}

.inputW.focused {
    border: 3px solid black;
    border-radius: 8px;
}

::v-deep .el-input__wrapper{
  background-color: v-bind(background) !important;
}
::v-deep .el-textarea__inner {
    background-color: v-bind(background) !important;
}
</style>