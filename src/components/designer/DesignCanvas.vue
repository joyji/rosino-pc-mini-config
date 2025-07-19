<template>
  <div class="design-canvas">
    <!-- 手机模拟器外框 -->
    <div class="phone-simulator">
      <div class="phone-header">
        <div class="status-bar">
          <span class="time">9:41</span>
          <div class="right-icons">
            <span class="signal">●●●</span>
            <span class="wifi">📶</span>
            <span class="battery">🔋</span>
          </div>
        </div>
        <div class="navigation-bar" v-if="currentPage">
          <span class="nav-title">{{ currentPage.name }}</span>
        </div>
      </div>
      
      <!-- 页面内容区域 -->
      <div 
        class="page-content"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        :style="pageStyle"
      >
        <div v-if="currentPageComponents.length === 0" class="empty-hint">
          <el-icon :size="48" class="empty-icon">
            <Box />
          </el-icon>
          <p>拖拽组件到这里开始设计</p>
        </div>
        
        <!-- 渲染组件 -->
        <template v-for="component in currentPageComponents" :key="component.id">
          <DesignComponent 
            :component="component"
            @select="handleSelectComponent"
            @delete="handleDeleteComponent"
          />
        </template>
        
        <!-- 选中框 -->
        <div 
          v-if="selectedComponent" 
          class="selection-box"
          :style="selectionBoxStyle"
        >
          <div class="selection-handles">
            <div class="handle top-left"></div>
            <div class="handle top-right"></div>
            <div class="handle bottom-left"></div>
            <div class="handle bottom-right"></div>
          </div>
          <div class="selection-toolbar">
            <el-button size="small" type="danger" @click="handleDeleteSelected">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { getComponentDefinition } from '@/utils/componentLibrary'
import DesignComponent from './DesignComponent.vue'
import type { ComponentConfig } from '@/types'

const editorStore = useEditorStore()

// 当前页面
const currentPage = computed(() => editorStore.currentPage)
const currentPageComponents = computed(() => editorStore.currentPageComponents)
const selectedComponent = computed(() => editorStore.selectedComponent)

// 页面样式
const pageStyle = computed(() => {
  if (!currentPage.value?.globalStyle) return {}
  
  const style = currentPage.value.globalStyle
  return {
    backgroundColor: style.backgroundColor || '#ffffff',
    minHeight: '100%'
  }
})

// 选中框样式（简化处理，实际应该计算组件的真实位置）
const selectionBoxStyle = computed(() => {
  if (!selectedComponent.value) return {}
  
  // 这里应该根据实际DOM元素计算位置，简化处理
  return {
    display: 'block'
  }
})

// 处理拖拽放置
function handleDrop(event: DragEvent) {
  event.preventDefault()
  
  const dragData = editorStore.dragState.dragData
  if (!dragData || editorStore.dragState.dragType !== 'component') return
  
  // 创建组件配置
  const componentDef = getComponentDefinition(dragData.type)
  if (!componentDef) return
  
  const newComponent: ComponentConfig = {
    id: '', // 将由store生成
    type: componentDef.type,
    name: componentDef.name,
    props: { ...componentDef.defaultProps },
    style: { ...componentDef.defaultStyle }
  }
  
  // 添加到页面
  editorStore.addComponent(newComponent)
  editorStore.endDrag()
}

// 选择组件
function handleSelectComponent(componentId: string) {
  editorStore.setSelectedComponent(componentId)
}

// 删除组件
function handleDeleteComponent(componentId: string) {
  editorStore.deleteComponent(componentId)
}

// 删除选中的组件
function handleDeleteSelected() {
  if (selectedComponent.value) {
    editorStore.deleteComponent(selectedComponent.value.id)
  }
}
</script>

<style scoped>
.design-canvas {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background: #f0f2f5;
  overflow: auto;
}

.phone-simulator {
  width: 375px;
  height: 667px;
  background: #000;
  border-radius: 25px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
}

.phone-header {
  background: #fff;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.status-bar {
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
}

.time {
  color: #000;
}

.right-icons {
  display: flex;
  gap: 8px;
  color: #000;
}

.navigation-bar {
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.page-content {
  height: calc(667px - 96px);
  background: #fff;
  border-radius: 0 0 20px 20px;
  overflow: auto;
  position: relative;
}

.empty-hint {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  user-select: none;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-hint p {
  margin: 0;
  font-size: 14px;
}

.selection-box {
  position: absolute;
  border: 2px solid #409eff;
  background: rgba(64, 158, 255, 0.1);
  pointer-events: none;
  z-index: 1000;
}

.selection-handles {
  position: relative;
  width: 100%;
  height: 100%;
}

.handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #409eff;
  border: 1px solid #fff;
  border-radius: 50%;
  pointer-events: auto;
  cursor: grab;
}

.handle.top-left {
  top: -4px;
  left: -4px;
}

.handle.top-right {
  top: -4px;
  right: -4px;
}

.handle.bottom-left {
  bottom: -4px;
  left: -4px;
}

.handle.bottom-right {
  bottom: -4px;
  right: -4px;
}

.selection-toolbar {
  position: absolute;
  top: -40px;
  right: 0;
  pointer-events: auto;
}
</style>