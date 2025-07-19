<template>
  <div id="app" class="low-code-editor">
    <!-- 顶部工具栏 -->
    <Header />
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧组件库 -->
      <ComponentSidebar />
      
      <!-- 中间设计画布 -->
      <DesignCanvas />
      
      <!-- 右侧属性面板 -->
      <PropertyPanel />
    </div>
    
    <!-- 启动引导 -->
    <el-dialog
      v-model="showWelcome"
      title="欢迎使用微信小程序设计器"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="welcome-content">
        <div class="welcome-icon">
          <el-icon :size="64" color="#07c160">
            <Iphone />
          </el-icon>
        </div>
        <h3>开始您的小程序设计之旅</h3>
        <p>通过拖拽组件快速构建您的微信小程序界面</p>
        <ul class="feature-list">
          <li>🎨 丰富的组件库</li>
          <li>📱 可视化设计界面</li>
          <li>⚙️ 灵活的属性配置</li>
          <li>📦 一键导出代码</li>
        </ul>
      </div>
      
      <template #footer>
        <div class="welcome-footer">
          <el-button type="primary" @click="handleStartProject">
            开始创建项目
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEditorStore } from './stores/editor'
import Header from './components/Header.vue'
import ComponentSidebar from './components/sidebar/ComponentSidebar.vue'
import DesignCanvas from './components/designer/DesignCanvas.vue'
import PropertyPanel from './components/property/PropertyPanel.vue'
import { Iphone } from '@element-plus/icons-vue'

const editorStore = useEditorStore()

// 欢迎对话框
const showWelcome = ref(true)

// 开始项目
function handleStartProject() {
  // 创建默认页面
  editorStore.addPage({
    name: '首页',
    route: '/pages/index/index'
  })
  
  showWelcome.value = false
}

// 页面加载完成
onMounted(() => {
  // 如果已有页面，不显示欢迎对话框
  if (editorStore.project.pages.length > 0) {
    showWelcome.value = false
  }
})
</script>

<style scoped>
.low-code-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.welcome-content {
  text-align: center;
  padding: 20px 0;
}

.welcome-icon {
  margin-bottom: 20px;
}

.welcome-content h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.welcome-content p {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 14px;
}

.feature-list {
  text-align: left;
  margin: 0;
  padding: 0;
  list-style: none;
  display: inline-block;
}

.feature-list li {
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.welcome-footer {
  text-align: center;
}
</style>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f0f2f5;
}

#app {
  height: 100vh;
  overflow: hidden;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Element Plus 全局样式调整 */
.el-message {
  min-width: 200px;
}

.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  padding: 16px 20px 8px;
}

.el-dialog__body {
  padding: 8px 20px 20px;
}

.el-button {
  border-radius: 6px;
}

.el-input__wrapper {
  border-radius: 6px;
}

.el-select .el-input__wrapper {
  border-radius: 6px;
}
</style>