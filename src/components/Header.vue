<template>
  <div class="header">
    <div class="header-left">
      <h1 class="logo">
        <el-icon :size="24" class="logo-icon">
          <Iphone />
        </el-icon>
        微信小程序设计器
      </h1>
      
      <!-- 页面管理 -->
      <div class="page-tabs">
        <el-tabs 
          v-model="currentPageId" 
          type="card" 
          closable
          @tab-change="handlePageChange"
          @tab-remove="handlePageRemove"
        >
          <el-tab-pane
            v-for="page in pages"
            :key="page.id"
            :label="page.name"
            :name="page.id"
          />
        </el-tabs>
        
        <el-button 
          size="small" 
          type="primary" 
          :icon="Plus"
          @click="showAddPageDialog = true"
          class="add-page-btn"
        >
          新增页面
        </el-button>
      </div>
    </div>
    
    <div class="header-right">
      <!-- 预览模式 -->
      <el-button size="small" :icon="View" @click="handlePreview">
        预览
      </el-button>
      
      <!-- 导出功能 -->
      <el-dropdown @command="handleExport">
        <el-button size="small" :icon="Download">
          导出
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="json">导出JSON配置</el-dropdown-item>
            <el-dropdown-item command="uniapp">生成UniApp代码</el-dropdown-item>
            <el-dropdown-item command="wxml">生成WXML模板</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <!-- 项目设置 -->
      <el-button size="small" :icon="Setting" @click="showProjectSettings = true">
        设置
      </el-button>
    </div>
    
    <!-- 新增页面对话框 -->
    <el-dialog
      v-model="showAddPageDialog"
      title="新增页面"
      width="400px"
      :before-close="handleCloseAddPageDialog"
    >
      <el-form :model="newPageForm" label-width="80px">
        <el-form-item label="页面名称" required>
          <el-input 
            v-model="newPageForm.name" 
            placeholder="请输入页面名称"
          />
        </el-form-item>
        <el-form-item label="页面路径" required>
          <el-input 
            v-model="newPageForm.route" 
            placeholder="如: /pages/home/index"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddPageDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddPage">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 项目设置对话框 -->
    <el-dialog
      v-model="showProjectSettings"
      title="项目设置"
      width="500px"
    >
      <el-form :model="projectSettings" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="projectSettings.name" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input 
            v-model="projectSettings.description" 
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="主题色">
          <el-color-picker v-model="projectSettings.theme.primaryColor" />
        </el-form-item>
        <el-form-item label="背景色">
          <el-color-picker v-model="projectSettings.theme.backgroundColor" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showProjectSettings = false">取消</el-button>
          <el-button type="primary" @click="handleSaveProjectSettings">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 预览对话框 -->
    <el-dialog
      v-model="showPreviewDialog"
      title="页面预览"
      width="400px"
      class="preview-dialog"
    >
      <div class="preview-container">
        <!-- 这里可以嵌入预览组件 -->
        <div class="preview-phone">
          <div class="preview-content">
            <p>预览功能开发中...</p>
            <p>当前页面: {{ currentPage?.name }}</p>
            <p>组件数量: {{ currentPageComponents.length }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, View, Download, Setting, ArrowDown, Iphone 
} from '@element-plus/icons-vue'

const editorStore = useEditorStore()

// 当前页面
const currentPageId = computed({
  get: () => editorStore.currentPageId,
  set: (value) => {
    if (value) {
      editorStore.setCurrentPage(value)
    }
  }
})

const currentPage = computed(() => editorStore.currentPage)
const currentPageComponents = computed(() => editorStore.currentPageComponents)
const pages = computed(() => editorStore.project.pages)

// 对话框显示状态
const showAddPageDialog = ref(false)
const showProjectSettings = ref(false)
const showPreviewDialog = ref(false)

// 新增页面表单
const newPageForm = reactive({
  name: '',
  route: ''
})

// 项目设置表单
const projectSettings = reactive({
  name: '',
  description: '',
  theme: {
    primaryColor: '#07c160',
    backgroundColor: '#ffffff'
  }
})

// 页面切换
function handlePageChange(pageId: string) {
  editorStore.setCurrentPage(pageId)
}

// 页面删除
function handlePageRemove(pageId: string) {
  ElMessageBox.confirm(
    '确定要删除这个页面吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    editorStore.deletePage(pageId)
    ElMessage.success('页面删除成功')
  }).catch(() => {
    // 用户取消删除
  })
}

// 新增页面
function handleAddPage() {
  if (!newPageForm.name || !newPageForm.route) {
    ElMessage.warning('请填写完整的页面信息')
    return
  }
  
  // 检查路径是否重复
  const existingPage = pages.value.find(page => page.route === newPageForm.route)
  if (existingPage) {
    ElMessage.warning('页面路径已存在')
    return
  }
  
  editorStore.addPage({
    name: newPageForm.name,
    route: newPageForm.route
  })
  
  // 重置表单
  newPageForm.name = ''
  newPageForm.route = ''
  showAddPageDialog.value = false
  
  ElMessage.success('页面创建成功')
}

// 关闭新增页面对话框
function handleCloseAddPageDialog() {
  newPageForm.name = ''
  newPageForm.route = ''
  showAddPageDialog.value = false
}

// 预览
function handlePreview() {
  if (!currentPage.value) {
    ElMessage.warning('请先创建一个页面')
    return
  }
  showPreviewDialog.value = true
}

// 导出功能
function handleExport(command: string) {
  switch (command) {
    case 'json':
      exportJSON()
      break
    case 'uniapp':
      exportUniApp()
      break
    case 'wxml':
      exportWXML()
      break
  }
}

// 导出JSON配置
function exportJSON() {
  const jsonData = editorStore.exportProject()
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${editorStore.project.name || '微信小程序项目'}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('JSON配置已导出')
}

// 导出UniApp代码
async function exportUniApp() {
  const { generateUniAppProject } = await import('@/utils/codeGenerator')
  const uniappProject = generateUniAppProject(editorStore.project)
  
  // 创建zip包（简化处理，实际应该使用JSZip）
  const projectFiles = {
    'manifest.json': JSON.stringify(uniappProject.manifest, null, 2),
    'pages.json': JSON.stringify(uniappProject.pagesJson, null, 2),
    'App.vue': generateAppVue(),
    'uni.scss': uniappProject.globalStyles,
    ...Object.fromEntries(
      uniappProject.pages.map(page => [
        `pages${page.route}/index.vue`,
        page.vue
      ])
    )
  }
  
  // 简化：导出为JSON格式的项目结构
  const projectString = JSON.stringify(projectFiles, null, 2)
  const blob = new Blob([projectString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${editorStore.project.name || 'uniapp-project'}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('UniApp项目代码已生成')
}

// 生成App.vue文件
function generateAppVue() {
  return `<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
<\/script>

<style>
/* 应用全局样式 */
</style>`
}

// 导出WXML模板
function exportWXML() {
  // 简化的WXML生成逻辑
  let wxml = ''
  
  if (currentPage.value) {
    wxml = generateWXMLFromComponents(currentPageComponents.value)
  }
  
  const blob = new Blob([wxml], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentPage.value?.name || 'page'}.wxml`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('WXML模板已导出')
}

// 生成WXML代码
function generateWXMLFromComponents(components: any[]): string {
  let wxml = ''
  
  components.forEach(component => {
    switch (component.type) {
      case 'view':
        wxml += `<view>${component.children?.length ? generateWXMLFromComponents(component.children) : ''}</view>\n`
        break
      case 'text':
        wxml += `<text>${component.props.content || ''}</text>\n`
        break
      case 'image':
        wxml += `<image src="${component.props.src || ''}" mode="${component.props.mode || 'aspectFit'}"></image>\n`
        break
      case 'button':
        wxml += `<button type="${component.props.type || 'default'}">${component.props.text || ''}</button>\n`
        break
      case 'input':
        wxml += `<input placeholder="${component.props.placeholder || ''}" />\n`
        break
      case 'navigator':
        wxml += `<navigator url="${component.props.url || ''}">${component.props.text || ''}</navigator>\n`
        break
      default:
        wxml += `<!-- 未知组件类型: ${component.type} -->\n`
    }
  })
  
  return wxml
}

// 保存项目设置
function handleSaveProjectSettings() {
  // 更新项目配置
  editorStore.project.name = projectSettings.name
  editorStore.project.description = projectSettings.description
  editorStore.project.theme = { ...projectSettings.theme }
  
  showProjectSettings.value = false
  ElMessage.success('项目设置已保存')
}

// 初始化项目设置
function initProjectSettings() {
  projectSettings.name = editorStore.project.name
  projectSettings.description = editorStore.project.description || ''
  projectSettings.theme = { ...editorStore.project.theme }
}

// 监听项目设置对话框打开
function watchProjectSettings() {
  if (showProjectSettings.value) {
    initProjectSettings()
  }
}

// 监听对话框状态
import { watch } from 'vue'
watch(showProjectSettings, watchProjectSettings)
</script>

<style scoped>
.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo {
  margin: 0 24px 0 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  color: #07c160;
}

.page-tabs {
  display: flex;
  align-items: center;
  flex: 1;
}

.add-page-btn {
  margin-left: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-tabs) {
  flex: 1;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__nav) {
  border: none;
}

:deep(.el-tabs__item) {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  padding: 0 16px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-right: 4px;
  background: #f8f9fa;
}

:deep(.el-tabs__item.is-active) {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.preview-dialog :deep(.el-dialog__body) {
  padding: 20px;
  text-align: center;
}

.preview-container {
  display: flex;
  justify-content: center;
}

.preview-phone {
  width: 300px;
  height: 500px;
  border: 2px solid #333;
  border-radius: 20px;
  background: #000;
  padding: 20px 10px;
  position: relative;
}

.preview-content {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
}

.preview-content p {
  margin: 8px 0;
  font-size: 14px;
}
</style>