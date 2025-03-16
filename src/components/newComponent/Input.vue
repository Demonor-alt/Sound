<template>
    <div class="input" :class="{ focused: isFocused }">
        <el-input :size="size" v-model="input" :rows="props.rows" :placeholder="props.placeholder"
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
    background: {
        type: String,
        default: '#fafafa'
    },
    size: {
        type: String,
        default: 'large'
    }
});
const emit = defineEmits(['update:message']);

const input = ref(props.message || '');
const isFocused = ref(false);
watch(() => input.value, (newValue) => {
    emit('update:message', newValue);
}, { deep: true });
watch(() => props.message, (newValue) => {
    input.value = newValue;
}, { deep: true });
</script>

<style scoped>
.input {
    padding: 1px;
    border: 2px solid v-bind(color);
    border-radius: 8px;
}

.input.focused {
    border: 2px solid black !important;
    border-radius: 8px;
}

::v-deep .el-input__wrapper {
    background-color: v-bind(background) !important;
}

::v-deep .el-textarea__inner {
    background-color: v-bind(background) !important;
}
</style>