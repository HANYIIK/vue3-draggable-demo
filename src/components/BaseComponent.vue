<script setup lang="ts">
import type { ComponentConfig } from '../types';

defineProps<{
    config: ComponentConfig;
}>();
</script>

<template>
    <div class="base-component">
        <slot :config="config"></slot>
    </div>
</template>

<style scoped>
.base-component {
    position: absolute;
    user-select: none;
    cursor: move;
    transition:
        left 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        top 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: left, top;

    &:hover {
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
}
</style>