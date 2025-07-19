import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ComponentConfig, PageConfig, ProjectConfig, EditorState, DragState } from '@/types'

export const useEditorStore = defineStore('editor', () => {
  // 项目配置
  const project = ref<ProjectConfig>({
    id: 'default-project',
    name: '微信小程序项目',
    description: '通过拖拽生成的微信小程序',
    pages: [],
    theme: {
      primaryColor: '#07c160',
      backgroundColor: '#ffffff'
    }
  })

  // 当前页面
  const currentPageId = ref<string | null>(null)
  
  // 编辑器状态
  const editorState = ref<EditorState>({
    selectedComponentId: null,
    hoveredComponentId: null,
    currentPageId: null
  })

  // 拖拽状态
  const dragState = ref<DragState>({
    isDragging: false,
    dragType: null,
    dragData: null
  })

  // 计算属性：当前页面
  const currentPage = computed(() => {
    if (!currentPageId.value) return null
    return project.value.pages.find(page => page.id === currentPageId.value) || null
  })

  // 计算属性：当前页面的组件列表
  const currentPageComponents = computed(() => {
    return currentPage.value?.components || []
  })

  // 计算属性：选中的组件
  const selectedComponent = computed(() => {
    if (!editorState.value.selectedComponentId) return null
    return findComponentById(editorState.value.selectedComponentId)
  })

  // 递归查找组件
  function findComponentById(id: string, components: ComponentConfig[] = currentPageComponents.value): ComponentConfig | null {
    for (const component of components) {
      if (component.id === id) {
        return component
      }
      if (component.children) {
        const found = findComponentById(id, component.children)
        if (found) return found
      }
    }
    return null
  }

  // 生成唯一ID
  function generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 添加页面
  function addPage(pageConfig?: Partial<PageConfig>) {
    const newPage: PageConfig = {
      id: generateId(),
      name: pageConfig?.name || `页面${project.value.pages.length + 1}`,
      route: pageConfig?.route || `/page${project.value.pages.length + 1}`,
      components: [],
      ...pageConfig
    }
    project.value.pages.push(newPage)
    if (!currentPageId.value) {
      setCurrentPage(newPage.id)
    }
    return newPage
  }

  // 删除页面
  function deletePage(pageId: string) {
    const index = project.value.pages.findIndex(page => page.id === pageId)
    if (index > -1) {
      project.value.pages.splice(index, 1)
      if (currentPageId.value === pageId) {
        currentPageId.value = project.value.pages[0]?.id || null
      }
    }
  }

  // 设置当前页面
  function setCurrentPage(pageId: string) {
    currentPageId.value = pageId
    editorState.value.currentPageId = pageId
    editorState.value.selectedComponentId = null
  }

  // 添加组件到当前页面
  function addComponent(componentConfig: ComponentConfig, parentId?: string) {
    if (!currentPage.value) return

    const newComponent = {
      ...componentConfig,
      id: generateId(),
      parentId
    }

    if (parentId) {
      // 添加到父组件的children中
      const parentComponent = findComponentById(parentId)
      if (parentComponent) {
        if (!parentComponent.children) {
          parentComponent.children = []
        }
        parentComponent.children.push(newComponent)
      }
    } else {
      // 添加到根级别
      currentPage.value.components.push(newComponent)
    }

    return newComponent
  }

  // 删除组件
  function deleteComponent(componentId: string) {
    if (!currentPage.value) return

    function removeFromArray(components: ComponentConfig[]): boolean {
      const index = components.findIndex(comp => comp.id === componentId)
      if (index > -1) {
        components.splice(index, 1)
        return true
      }
      
      for (const component of components) {
        if (component.children && removeFromArray(component.children)) {
          return true
        }
      }
      return false
    }

    removeFromArray(currentPage.value.components)
    
    if (editorState.value.selectedComponentId === componentId) {
      editorState.value.selectedComponentId = null
    }
  }

  // 更新组件配置
  function updateComponent(componentId: string, updates: Partial<ComponentConfig>) {
    const component = findComponentById(componentId)
    if (component) {
      Object.assign(component, updates)
    }
  }

  // 设置选中的组件
  function setSelectedComponent(componentId: string | null) {
    editorState.value.selectedComponentId = componentId
  }

  // 设置悬浮的组件
  function setHoveredComponent(componentId: string | null) {
    editorState.value.hoveredComponentId = componentId
  }

  // 开始拖拽
  function startDrag(type: 'component' | 'move', data: any) {
    dragState.value = {
      isDragging: true,
      dragType: type,
      dragData: data
    }
  }

  // 结束拖拽
  function endDrag() {
    dragState.value = {
      isDragging: false,
      dragType: null,
      dragData: null
    }
  }

  // 导出项目配置为JSON
  function exportProject() {
    return JSON.stringify(project.value, null, 2)
  }

  // 导入项目配置
  function importProject(projectData: string) {
    try {
      const importedProject = JSON.parse(projectData)
      project.value = importedProject
      currentPageId.value = importedProject.pages[0]?.id || null
      editorState.value.selectedComponentId = null
    } catch (error) {
      console.error('导入项目失败:', error)
    }
  }

  // 生成UniApp代码
  function generateUniAppCode() {
    // 这里将实现生成UniApp代码的逻辑
    const pages = project.value.pages.map(page => ({
      name: page.name,
      route: page.route,
      components: page.components
    }))
    
    return {
      pages,
      manifest: {
        name: project.value.name,
        description: project.value.description,
        versionName: '1.0.0',
        versionCode: 1
      }
    }
  }

  return {
    project,
    currentPageId,
    editorState,
    dragState,
    currentPage,
    currentPageComponents,
    selectedComponent,
    addPage,
    deletePage,
    setCurrentPage,
    addComponent,
    deleteComponent,
    updateComponent,
    setSelectedComponent,
    setHoveredComponent,
    startDrag,
    endDrag,
    exportProject,
    importProject,
    generateUniAppCode,
    findComponentById
  }
})