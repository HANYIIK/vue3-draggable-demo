<script setup lang="ts">
import { reactive, ref } from 'vue';
import { NCard } from 'naive-ui';
import BaseComponent from './components/BaseComponent.vue';
import LibraryItem from './components/LibraryItem.vue';
import DraggableButton from './components/DraggableButton.vue';
import DraggableInput from './components/DraggableInput.vue';
import DraggableImage from './components/DraggableImage.vue';
import type { ComponentConfig, ComponentType } from './types';

// 类型定义 (types.ts)
export type Alignment = 'left' | 'center' | 'right';

export interface ComponentConfig {
  id: number;
  type: ComponentType;
  position: { x: number; y: number };
  props: {
    text?: string;
    color?: string;
    placeholder?: string;
    alignment?: Alignment;
    src?: string;
  };
}

// 组件库配置
const componentLibrary = [
  {
    type: 'button',
    name: '按钮组件',
    icon: '🔘',
    defaultProps: {
      text: '按钮',
      color: '#409eff',
      alignment: 'center'
    }
  },
  {
    type: 'input',
    name: '输入框',
    icon: '📝',
    defaultProps: {
      placeholder: '请输入内容',
      color: '#333'
    }
  },
  {
    type: 'image',
    name: '图片',
    icon: '🖼️',
    defaultProps: {
      src: 'https://ky-shop-oss.oss-cn-beijing.aliyuncs.com/settings/avatars/482d06ae-a37d-4b8e-8967-9cf3ab309c31.jpg',
      text: '图片标题'
    }
  }
];

const GRID_SIZE = 20;
const SNAP_THRESHOLD = 8;
const canvasComponents = reactive<ComponentConfig[]>([]);
const canvasContainer = ref<HTMLElement | null>(null);

// 网格对齐方法
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

const addToCanvas = (component: typeof componentLibrary[number]) => {
  if (!canvasContainer.value) return;

  const canvasRect = canvasContainer.value.getBoundingClientRect();
  const newComponent: ComponentConfig = {
    id: Date.now(),
    type: component.type,
    position: {
      x: snapToGrid(canvasRect.width / 2 - 50),
      y: snapToGrid(canvasRect.height / 2 - 20)
    },
    props: { ...component.defaultProps }
  };
  canvasComponents.push(newComponent);
};

const startDrag = (item: ComponentConfig, event: MouseEvent) => {
  event.preventDefault();
  if (!canvasContainer.value) return;

  const canvasRect = canvasContainer.value.getBoundingClientRect();
  const startX = event.clientX - canvasRect.left;
  const startY = event.clientY - canvasRect.top;
  const initialX = item.position.x;
  const initialY = item.position.y;

  const onMouseMove = (e: MouseEvent) => {
    const currentX = e.clientX - canvasRect.left;
    const currentY = e.clientY - canvasRect.top;

    let deltaX = currentX - startX;
    let deltaY = currentY - startY;

    // 网格吸附计算
    const targetX = initialX + deltaX;
    const targetY = initialY + deltaY;

    const snappedX = snapToGrid(targetX);
    const snappedY = snapToGrid(targetY);

    if (Math.abs(targetX - snappedX) < SNAP_THRESHOLD) deltaX = snappedX - initialX;
    if (Math.abs(targetY - snappedY) < SNAP_THRESHOLD) deltaY = snappedY - initialY;

    // 边界检查
    const maxX = canvasRect.width - 120; // 假设组件最大宽度120px
    const maxY = canvasRect.height - 60; // 假设组件最大高度60px

    item.position.x = Math.max(0, Math.min(initialX + deltaX, maxX));
    item.position.y = Math.max(0, Math.min(initialY + deltaY, maxY));
  };

  const onMouseUp = () => {
    // 最终位置对齐网格
    item.position.x = snapToGrid(item.position.x);
    item.position.y = snapToGrid(item.position.y);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const selectedComponent = ref<typeof componentLibrary[number]>({
  id: 0,
  type: '',
  position: { x: 0, y: 0 },
  props: {
    text: '',
    color: '',
    placeholder: '',
    alignment: 'center',
    src: ''
  }
});
const showDrawer = ref(false);
const alignmentOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中对齐', value: 'center' },
  { label: '右对齐', value: 'right' }
];
const handleComponentClick = (component: ComponentConfig) => {
  console.log('Clicked component:', component);
  // 设置选中的组件
  selectedComponent.value = component;
  showDrawer.value = true;
};
</script>

<template>
  <div class="container">
    <!-- 左侧组件库 -->
    <div class="library">
      <n-card title="组件库" size="small">
        <LibraryItem v-for="comp in componentLibrary" :key="comp.type" :name="comp.name" :icon="comp.icon"
          @click="addToCanvas(comp)" />
      </n-card>
    </div>

    <!-- 右侧画布 -->
    <div class="canvas" ref="canvasContainer">
      <BaseComponent v-for="comp in canvasComponents" :key="comp.id" :config="comp" :style="{
        left: `${comp.position.x}px`,
        top: `${comp.position.y}px`,
        zIndex: comp.id
      }" @mousedown="startDrag(comp, $event)">
        <DraggableButton @dblclick="handleComponentClick(comp)" v-if="comp.type === 'button'" :config="comp" />
        <DraggableInput @dblclick="handleComponentClick(comp)" v-else-if="comp.type === 'input'" :config="comp" />
        <DraggableImage @dblclick="handleComponentClick(comp)" v-else-if="comp.type === 'image'" :config="comp" />
      </BaseComponent>
    </div>

    <!-- 抽屉配置 -->
    <div class="drawer">
      <el-drawer v-model="showDrawer" title="组件配置" placement="right">
        <el-form>
          <el-form-item label="文本">
            <el-input v-model="selectedComponent.props.text" />
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="selectedComponent.props.color" />
          </el-form-item>
          <el-form-item label="对齐方式">
            <el-select v-model="selectedComponent.props.alignment" placeholder="请选择对齐方式">
              <el-option v-for="option in alignmentOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="占位符">
            <el-input v-model="selectedComponent.props.placeholder" />
          </el-form-item>
          <el-form-item label="图片链接">
            <el-input v-model="selectedComponent.props.src" />
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
  </div>

</template>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  .library {
    width: 240px;
    padding: 20px;
    border-right: 1px solid #ddd;
    background: white;
  
    .component-item {
      margin: 8px;
      padding: 12px;
      width: 100%;
      justify-content: flex-start;
      transition: all 0.2s;
  
      &:hover {
        transform: translateX(6px);
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .canvas {
    padding: 20px;
    position: relative;
    flex: 1;
    overflow: hidden;
    background:
      linear-gradient(90deg, #eee 1px, transparent 1px),
      linear-gradient(#eee 1px, transparent 1px);
    background-size: v-bind('GRID_SIZE + "px"') v-bind('GRID_SIZE + "px"');
    .canvas-item {
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
  }

  .drawer {
    z-index: 2147483647; /* 32位有符号整数的最大值 */
    position: relative;
  }
}


</style>
