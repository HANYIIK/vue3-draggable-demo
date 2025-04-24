<script setup lang="ts">
import type { ComponentConfig } from '../types';

defineProps<{
    config: ComponentConfig;
}>();
</script>

<template>
    <div class="image-container">
        <img :src="config.props.src" class="custom-image" alt="图片组件" />
        <div class="image-caption">{{ config.props.text }}</div>
    </div>
</template>

<style scoped>
.image-container {
    position: relative;
    width: 100px;
}

.custom-image {
    width: 100%;
    height: auto;
    border: 2px solid #eee;
    border-radius: 4px;
}

.image-caption {
    margin-top: 4px;
    font-size: 12px;
    text-align: center;
    color: #666;
}
</style>