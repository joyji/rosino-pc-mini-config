// 组件基础属性
export interface ComponentBase {
  id: string
  type: string
  name: string
  icon?: string
  category: string
}

// 组件样式配置
export interface ComponentStyle {
  width?: string | number
  height?: string | number
  marginTop?: string | number
  marginRight?: string | number
  marginBottom?: string | number
  marginLeft?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  paddingLeft?: string | number
  backgroundColor?: string
  color?: string
  fontSize?: string | number
  fontWeight?: string | number
  textAlign?: 'left' | 'center' | 'right'
  borderRadius?: string | number
  border?: string
  position?: 'static' | 'relative' | 'absolute' | 'fixed'
  top?: string | number
  left?: string | number
  right?: string | number
  bottom?: string | number
  zIndex?: number
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'none'
  flexDirection?: 'row' | 'column'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
}

// 组件属性配置
export interface ComponentProps {
  [key: string]: any
}

// 完整的组件配置
export interface ComponentConfig {
  id: string
  type: string
  name: string
  props: ComponentProps
  style: ComponentStyle
  children?: ComponentConfig[]
  parentId?: string
}

// 组件库中的组件定义
export interface ComponentDefinition extends ComponentBase {
  defaultProps: ComponentProps
  defaultStyle: ComponentStyle
  propSchema: PropSchema[]
  previewComponent?: any
  renderComponent?: any
}

// 属性配置模式
export interface PropSchema {
  key: string
  label: string
  type: 'input' | 'textarea' | 'number' | 'switch' | 'select' | 'color' | 'upload'
  defaultValue?: any
  options?: { label: string; value: any }[]
  required?: boolean
  placeholder?: string
}

// 页面配置
export interface PageConfig {
  id: string
  name: string
  route: string
  components: ComponentConfig[]
  globalStyle?: ComponentStyle
}

// 项目配置
export interface ProjectConfig {
  id: string
  name: string
  description?: string
  pages: PageConfig[]
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
}

// 拖拽状态
export interface DragState {
  isDragging: boolean
  dragType: 'component' | 'move' | null
  dragData: any
}

// 编辑器状态
export interface EditorState {
  selectedComponentId: string | null
  hoveredComponentId: string | null
  currentPageId: string | null
}