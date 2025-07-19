<template>
  <div 
    class="design-component"
    :class="{ 
      'is-selected': isSelected,
      'is-hovered': isHovered 
    }"
    :style="componentStyle"
    @click.stop="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- View 容器组件 -->
    <div v-if="component.type === 'view'" class="component-view">
      <template v-if="component.children && component.children.length > 0">
        <DesignComponent 
          v-for="child in component.children" 
          :key="child.id"
          :component="child"
          @select="$emit('select', $event)"
          @delete="$emit('delete', $event)"
        />
      </template>
      <div v-else class="view-placeholder">
        View容器
      </div>
    </div>
    
    <!-- Text 文本组件 -->
    <div v-else-if="component.type === 'text'" class="component-text">
      {{ component.props.content || '文本内容' }}
    </div>
    
    <!-- Image 图片组件 -->
    <img 
      v-else-if="component.type === 'image'" 
      class="component-image"
      :src="component.props.src || 'https://via.placeholder.com/300x200'"
      :alt="component.name"
      @error="handleImageError"
    />
    
    <!-- Button 按钮组件 -->
    <button 
      v-else-if="component.type === 'button'" 
      class="component-button"
      :class="`btn-${component.props.type || 'default'}`"
      :disabled="component.props.disabled"
    >
      <span v-if="component.props.loading" class="loading-icon">⏳</span>
      {{ component.props.text || '按钮' }}
    </button>
    
    <!-- Input 输入框组件 -->
    <input 
      v-else-if="component.type === 'input'" 
      class="component-input"
      :type="component.props.password ? 'password' : 'text'"
      :placeholder="component.props.placeholder || '请输入内容'"
      :value="component.props.value || ''"
      :disabled="component.props.disabled"
      readonly
    />
    
    <!-- Navigator 导航组件 -->
    <a 
      v-else-if="component.type === 'navigator'" 
      class="component-navigator"
      href="#"
      @click.prevent
    >
      {{ component.props.text || '点击跳转' }}
    </a>
    
    <!-- Video 视频组件 -->
    <div v-else-if="component.type === 'video'" class="component-video">
      <div class="video-placeholder">
        <el-icon :size="32"><VideoPlay /></el-icon>
        <p>视频组件</p>
        <small v-if="component.props.src">{{ component.props.src }}</small>
        <small v-else>未设置视频源</small>
      </div>
    </div>
    
    <!-- Map 地图组件 -->
    <div v-else-if="component.type === 'map'" class="component-map">
      <div class="map-placeholder">
        <el-icon :size="32"><Location /></el-icon>
        <p>地图组件</p>
        <small>经度: {{ component.props.longitude }}</small>
        <small>纬度: {{ component.props.latitude }}</small>
      </div>
    </div>
    
    <!-- 未知组件类型 -->
    <div v-else class="component-unknown">
      <el-icon :size="24"><QuestionFilled /></el-icon>
      <p>未知组件: {{ component.type }}</p>
    </div>
    
    <!-- 选中指示器 -->
    <div v-if="isSelected" class="selected-indicator">
      <span class="component-label">{{ component.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import type { ComponentConfig } from '@/types'

interface Props {
  component: ComponentConfig
}

interface Emits {
  (e: 'select', componentId: string): void
  (e: 'delete', componentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editorStore = useEditorStore()

// 计算组件样式
const componentStyle = computed(() => {
  const style = props.component.style
  const computedStyle: Record<string, string | number> = {}
  
  // 基础样式
  if (style.width !== undefined) computedStyle.width = typeof style.width === 'number' ? `${style.width}px` : style.width
  if (style.height !== undefined) computedStyle.height = typeof style.height === 'number' ? `${style.height}px` : style.height
  
  // 间距
  if (style.marginTop !== undefined) computedStyle.marginTop = typeof style.marginTop === 'number' ? `${style.marginTop}px` : style.marginTop
  if (style.marginRight !== undefined) computedStyle.marginRight = typeof style.marginRight === 'number' ? `${style.marginRight}px` : style.marginRight
  if (style.marginBottom !== undefined) computedStyle.marginBottom = typeof style.marginBottom === 'number' ? `${style.marginBottom}px` : style.marginBottom
  if (style.marginLeft !== undefined) computedStyle.marginLeft = typeof style.marginLeft === 'number' ? `${style.marginLeft}px` : style.marginLeft
  
  if (style.paddingTop !== undefined) computedStyle.paddingTop = typeof style.paddingTop === 'number' ? `${style.paddingTop}px` : style.paddingTop
  if (style.paddingRight !== undefined) computedStyle.paddingRight = typeof style.paddingRight === 'number' ? `${style.paddingRight}px` : style.paddingRight
  if (style.paddingBottom !== undefined) computedStyle.paddingBottom = typeof style.paddingBottom === 'number' ? `${style.paddingBottom}px` : style.paddingBottom
  if (style.paddingLeft !== undefined) computedStyle.paddingLeft = typeof style.paddingLeft === 'number' ? `${style.paddingLeft}px` : style.paddingLeft
  
  // 背景和文字
  if (style.backgroundColor) computedStyle.backgroundColor = style.backgroundColor
  if (style.color) computedStyle.color = style.color
  if (style.fontSize) computedStyle.fontSize = typeof style.fontSize === 'number' ? `${style.fontSize}px` : style.fontSize
  if (style.fontWeight) computedStyle.fontWeight = style.fontWeight
  if (style.textAlign) computedStyle.textAlign = style.textAlign
  
  // 边框和圆角
  if (style.border) computedStyle.border = style.border
  if (style.borderRadius) computedStyle.borderRadius = typeof style.borderRadius === 'number' ? `${style.borderRadius}px` : style.borderRadius
  
  // 布局
  if (style.display) computedStyle.display = style.display
  if (style.position) computedStyle.position = style.position
  if (style.top !== undefined) computedStyle.top = typeof style.top === 'number' ? `${style.top}px` : style.top
  if (style.left !== undefined) computedStyle.left = typeof style.left === 'number' ? `${style.left}px` : style.left
  if (style.right !== undefined) computedStyle.right = typeof style.right === 'number' ? `${style.right}px` : style.right
  if (style.bottom !== undefined) computedStyle.bottom = typeof style.bottom === 'number' ? `${style.bottom}px` : style.bottom
  if (style.zIndex !== undefined) computedStyle.zIndex = style.zIndex
  
  // Flex布局
  if (style.flexDirection) computedStyle.flexDirection = style.flexDirection
  if (style.justifyContent) computedStyle.justifyContent = style.justifyContent
  if (style.alignItems) computedStyle.alignItems = style.alignItems
  
  return computedStyle
})

// 是否选中
const isSelected = computed(() => {
  return editorStore.editorState.selectedComponentId === props.component.id
})

// 是否悬浮
const isHovered = computed(() => {
  return editorStore.editorState.hoveredComponentId === props.component.id
})

// 点击事件
function handleClick() {
  emit('select', props.component.id)
}

// 鼠标进入
function handleMouseEnter() {
  editorStore.setHoveredComponent(props.component.id)
}

// 鼠标离开
function handleMouseLeave() {
  editorStore.setHoveredComponent(null)
}

// 图片加载错误
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/300x200?text=加载失败'
}
</script>

<style scoped>
.design-component {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.design-component:hover {
  box-shadow: 0 0 0 1px #409eff;
}

.design-component.is-selected {
  box-shadow: 0 0 0 2px #409eff;
}

.design-component.is-hovered {
  box-shadow: 0 0 0 1px #67c23a;
}

/* 组件样式 */
.component-view {
  min-height: 60px;
  border: 1px dashed #ddd;
  position: relative;
}

.view-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  color: #999;
  font-size: 12px;
}

.component-text {
  line-height: 1.4;
  word-break: break-all;
}

.component-image {
  max-width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.component-button {
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.component-button.btn-primary {
  background: #07c160;
  color: #fff;
}

.component-button.btn-warn {
  background: #fa5151;
  color: #fff;
}

.component-button.btn-default {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.component-input {
  border: 1px solid #ddd;
  outline: none;
  background: #fff;
}

.component-input:focus {
  border-color: #409eff;
}

.component-navigator {
  color: #576b95;
  text-decoration: none;
}

.component-navigator:hover {
  text-decoration: underline;
}

.component-video,
.component-map {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  border: 1px solid #ddd;
}

.video-placeholder,
.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  color: #666;
  text-align: center;
}

.video-placeholder p,
.map-placeholder p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.video-placeholder small,
.map-placeholder small {
  font-size: 11px;
  color: #999;
  display: block;
}

.component-unknown {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  border: 1px dashed #ddd;
  color: #999;
  text-align: center;
}

.component-unknown p {
  margin: 8px 0 0 0;
  font-size: 12px;
}

.selected-indicator {
  position: absolute;
  top: -24px;
  left: 0;
  z-index: 100;
}

.component-label {
  background: #409eff;
  color: #fff;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 11px;
  white-space: nowrap;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>