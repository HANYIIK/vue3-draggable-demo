<script setup lang="ts">
defineProps<{
    name: string;
    icon: string;
}>();
</script>

<template>
    <n-tag class="library-item">
        <div class="item-content">
            <span class="item-icon">{{ icon }}</span>
            <span class="item-name">{{ name }}</span>
        </div>
    </n-tag>
</template>

<style scoped>
.library-item {
    width: 100%;
    margin: 8px 0;
    padding: 12px;
    justify-content: flex-start;
    transition: all 0.2s;

    &:hover {
        transform: translateX(6px);
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    }
}

.item-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.item-icon {
    font-size: 1.2em;
}
</style>