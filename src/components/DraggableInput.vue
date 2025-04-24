<script setup lang="ts">
import type { ComponentConfig } from '../types';

defineProps<{
    config: ComponentConfig;
}>();
</script>

<template>
    <input type="text" class="custom-input" :placeholder="config.props.placeholder"
        :style="{ color: config.props.color }" />
</template>

<style scoped>
.custom-input {
    padding: 8px 12px;
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;

    &:focus {
        outline: 2px solid #409eff;
    }
}
</style>