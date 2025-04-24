<script setup lang="ts">
import type { ComponentConfig } from '../types';

defineProps<{
    config: ComponentConfig;
}>();
</script>

<template>
    <el-button class="custom-button" :style="{
        backgroundColor: config.props.color,
        textAlign: config.props.alignment
    }">
        {{ config.props.text }}
    </el-button>
</template>

<style scoped>
.custom-button {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: transform 0.2s;
    min-width: 100px;

    &:active {
        transform: scale(0.95);
    }
}
</style>