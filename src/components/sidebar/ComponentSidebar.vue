<template>
  <div class="component-sidebar">
    <div class="sidebar-header">
      <h3>组件库</h3>
    </div>
    
    <div class="sidebar-content">
      <el-collapse v-model="activeCategories" multiple>
        <el-collapse-item 
          v-for="(components, category) in componentsByCategory" 
          :key="category"
          :title="category" 
          :name="category"
        >
          <div class="component-list">
            <div
              v-for="component in components"
              :key="component.id"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart(component)"
              @dragend="handleDragEnd"
            >
              <div class="component-icon">
                <el-icon :size="20">
                  <component :is="component.icon" />
                </el-icon>
              </div>
              <div class="component-name">{{ component.name }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { getComponentsByCategory } from '@/utils/componentLibrary'
import type { ComponentDefinition } from '@/types'

const editorStore = useEditorStore()

// 组件分类
const componentsByCategory = computed(() => getComponentsByCategory())

// 默认展开的分类
const activeCategories = ref(Object.keys(componentsByCategory.value))

// 拖拽开始
function handleDragStart(component: ComponentDefinition) {
  editorStore.startDrag('component', component)
}

// 拖拽结束
function handleDragEnd() {
  editorStore.endDrag()
}
</script>

<style scoped>
.component-sidebar {
  width: 260px;
  height: 100vh;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  background: #fff;
}

.sidebar-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.component-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 8px 0;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s ease;
  min-height: 70px;
}

.component-item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.component-item:active {
  cursor: grabbing;
  transform: translateY(0);
}

.component-icon {
  margin-bottom: 8px;
  color: #409eff;
}

.component-name {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.2;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}
</style>