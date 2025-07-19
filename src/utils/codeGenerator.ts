import type { ProjectConfig, PageConfig, ComponentConfig } from '@/types'

// 生成 UniApp 项目代码
export function generateUniAppProject(project: ProjectConfig) {
  const pages = project.pages.map(page => generatePageCode(page))
  const manifest = generateManifest(project)
  const pagesJson = generatePagesJson(project)
  
  return {
    manifest,
    pagesJson,
    pages,
    globalStyles: generateGlobalStyles(project)
  }
}

// 生成 manifest.json
function generateManifest(project: ProjectConfig) {
  return {
    "name": project.name,
    "appid": "",
    "description": project.description || "",
    "versionName": "1.0.0",
    "versionCode": 1,
    "transformPx": false,
    "app-plus": {
      "usingComponents": true,
      "nvueStyleCompiler": "uni-app",
      "compilerVersion": 3,
      "splashscreen": {
        "alwaysShowBeforeRender": true,
        "waiting": true,
        "autoclose": true,
        "delay": 0
      },
      "modules": {},
      "distribute": {
        "android": {
          "permissions": []
        },
        "ios": {},
        "sdkConfigs": {}
      }
    },
    "quickapp": {},
    "mp-weixin": {
      "appid": "",
      "setting": {
        "urlCheck": false,
        "es6": true,
        "enhance": true,
        "postcss": true,
        "preloadBackgroundData": false,
        "minified": true,
        "newFeature": true,
        "coverView": true,
        "nodeModules": false,
        "autoAudits": false,
        "showShadowRootInWxmlPanel": true,
        "scopeDataCheck": false,
        "uglifyFileName": false,
        "checkInvalidKey": true,
        "checkSiteMap": true,
        "uploadWithSourceMap": true,
        "compileHotReLoad": false,
        "lazyloadPlaceholderEnable": false,
        "useMultiFrameRuntime": true,
        "useApiHook": true,
        "useApiHostProcess": true,
        "babelSetting": {
          "ignore": [],
          "disablePlugins": [],
          "outputPath": ""
        },
        "enableEngineNative": false,
        "useIsolateContext": true,
        "userConfirmedBundleSwitch": false,
        "packNpmManually": false,
        "packNpmRelationList": [],
        "minifyWXSS": true,
        "disableUseStrict": false,
        "minifyWXML": true,
        "showES6CompileOption": false,
        "useCompilerPlugins": false
      },
      "usingComponents": true
    },
    "vueVersion": "3"
  }
}

// 生成 pages.json
function generatePagesJson(project: ProjectConfig) {
  const pages = project.pages.map(page => ({
    path: page.route.startsWith('/') ? page.route.substring(1) : page.route,
    style: {
      navigationBarTitleText: page.name,
      backgroundColor: project.theme?.backgroundColor || '#ffffff',
      navigationBarBackgroundColor: project.theme?.primaryColor || '#007aff'
    }
  }))

  return {
    pages,
    globalStyle: {
      navigationBarTextStyle: 'black',
      navigationBarTitleText: project.name,
      navigationBarBackgroundColor: project.theme?.primaryColor || '#007aff',
      backgroundColor: project.theme?.backgroundColor || '#ffffff'
    },
    uniIdRouter: {},
    easycom: {
      autoscan: true,
      custom: {}
    }
  }
}

// 生成页面代码
function generatePageCode(page: PageConfig) {
  const vue = generateVueCode(page)
  const script = generateScriptCode(page)
  const style = generateStyleCode(page)
  
  return {
    name: page.name,
    route: page.route,
    vue: `<template>\n${vue}\n</template>\n\n<script>\n${script}\n</script>\n\n<style>\n${style}\n</style>`
  }
}

// 生成 Vue 模板代码
function generateVueCode(page: PageConfig): string {
  const pageStyle = page.globalStyle ? ` :style="pageStyle"` : ''
  const components = page.components.map(component => generateComponentCode(component, 1)).join('\n')
  
  return `  <view class="page"${pageStyle}>\n${components}\n  </view>`
}

// 生成组件代码
function generateComponentCode(component: ComponentConfig, indent: number = 0): string {
  const indentStr = '  '.repeat(indent + 1)
  const componentStyle = generateComponentStyle(component)
  const styleAttr = componentStyle ? ` :style="component_${component.id}_style"` : ''
  
  switch (component.type) {
    case 'view':
      const children = component.children 
        ? component.children.map(child => generateComponentCode(child, indent + 1)).join('\n')
        : ''
      return `${indentStr}<view${styleAttr}>\n${children}\n${indentStr}</view>`
    
    case 'text':
      const content = component.props.content || '文本内容'
      const textAttrs = generateTextAttributes(component)
      return `${indentStr}<text${textAttrs}${styleAttr}>${content}</text>`
    
    case 'image':
      const imageAttrs = generateImageAttributes(component)
      return `${indentStr}<image${imageAttrs}${styleAttr}></image>`
    
    case 'button':
      const buttonAttrs = generateButtonAttributes(component)
      const buttonText = component.props.text || '按钮'
      return `${indentStr}<button${buttonAttrs}${styleAttr}>${buttonText}</button>`
    
    case 'input':
      const inputAttrs = generateInputAttributes(component)
      return `${indentStr}<input${inputAttrs}${styleAttr} />`
    
    case 'navigator':
      const navAttrs = generateNavigatorAttributes(component)
      const navText = component.props.text || '导航链接'
      return `${indentStr}<navigator${navAttrs}${styleAttr}>${navText}</navigator>`
    
    case 'video':
      const videoAttrs = generateVideoAttributes(component)
      return `${indentStr}<video${videoAttrs}${styleAttr}></video>`
    
    case 'map':
      const mapAttrs = generateMapAttributes(component)
      return `${indentStr}<map${mapAttrs}${styleAttr}></map>`
    
    default:
      return `${indentStr}<!-- 未知组件类型: ${component.type} -->`
  }
}

// 生成各种组件属性
function generateTextAttributes(component: ComponentConfig): string {
  const attrs: string[] = []
  if (component.props.selectable) attrs.push(' selectable="true"')
  if (component.props.decode) attrs.push(' decode="true"')
  return attrs.join('')
}

function generateImageAttributes(component: ComponentConfig): string {
  const attrs: string[] = []
  if (component.props.src) attrs.push(` src="${component.props.src}"`)
  if (component.props.mode) attrs.push(` mode="${component.props.mode}"`)
  if (component.props.lazyLoad) attrs.push(' lazy-load="true"')
  if (component.props.showMenuByLongpress) attrs.push(' show-menu-by-longpress="true"')
  return attrs.join('')
}

function generateButtonAttributes(component: ComponentConfig): string {
  const attrs: string[] = []
  if (component.props.type && component.props.type !== 'default') attrs.push(` type="${component.props.type}"`)
  if (component.props.size && component.props.size !== 'default') attrs.push(` size="${component.props.size}"`)
  if (component.props.disabled) attrs.push(' disabled="true"')
  if (component.props.loading) attrs.push(' loading="true"')
  if (component.props.formType) attrs.push(` form-type="${component.props.formType}"`)
  if (component.props.openType) attrs.push(` open-type="${component.props.openType}"`)
  return attrs.join('')
}

function generateInputAttributes(component: ComponentConfig): string {
  const attrs: string[] = []
  if (component.props.type && component.props.type !== 'text') attrs.push(` type="${component.props.type}"`)
  if (component.props.placeholder) attrs.push(` placeholder="${component.props.placeholder}"`)
  if (component.props.value) attrs.push(` value="${component.props.value}"`)
  if (component.props.password) attrs.push(' password="true"')
  if (component.props.disabled) attrs.push(' disabled="true"')
  if (component.props.maxlength && component.props.maxlength !== 140) attrs.push(` maxlength="${component.props.maxlength}"`)
  if (component.props.confirmType && component.props.confirmType !== 'done') attrs.push(` confirm-type="${component.props.confirmType}"`)
  return attrs.join('')
}

function generateNavigatorAttributes(component: ComponentConfig): string {
  const attrs: string[] = []
  if (component.props.url) attrs.push(` url="${component.props.url}"`)
  if (component.props.openType && component.props.openType !== 'navigate') attrs.push(` open-type="${component.props.openType}"`)
  return attrs.join('')
}

function generateVideoAttributes(component: ComponentConfig): string {
  const attrs: string[] = []
  if (component.props.src) attrs.push(` src="${component.props.src}"`)
  if (component.props.poster) attrs.push(` poster="${component.props.poster}"`)
  if (component.props.autoplay) attrs.push(' autoplay="true"')
  if (component.props.loop) attrs.push(' loop="true"')
  if (component.props.muted) attrs.push(' muted="true"')
  if (!component.props.controls) attrs.push(' controls="false"')
  if (!component.props.showFullscreenBtn) attrs.push(' show-fullscreen-btn="false"')
  if (!component.props.showPlayBtn) attrs.push(' show-play-btn="false"')
  if (!component.props.showCenterPlayBtn) attrs.push(' show-center-play-btn="false"')
  return attrs.join('')
}

function generateMapAttributes(component: ComponentConfig): string {
  const attrs: string[] = []
  if (component.props.longitude) attrs.push(` longitude="${component.props.longitude}"`)
  if (component.props.latitude) attrs.push(` latitude="${component.props.latitude}"`)
  if (component.props.scale && component.props.scale !== 16) attrs.push(` scale="${component.props.scale}"`)
  if (component.props.showLocation) attrs.push(' show-location="true"')
  if (component.props.showCompass) attrs.push(' show-compass="true"')
  if (component.props.showScale) attrs.push(' show-scale="true"')
  if (component.props.enableOverlooking) attrs.push(' enable-overlooking="true"')
  if (!component.props.enableZoom) attrs.push(' enable-zoom="false"')
  if (!component.props.enableScroll) attrs.push(' enable-scroll="false"')
  if (component.props.enableRotate) attrs.push(' enable-rotate="true"')
  return attrs.join('')
}

// 生成组件样式
function generateComponentStyle(component: ComponentConfig): boolean {
  const style = component.style
  return Object.keys(style).length > 0
}

// 生成 Script 代码
function generateScriptCode(page: PageConfig): string {
  const componentStyles = page.components
    .filter(component => generateComponentStyle(component))
    .map(component => {
      const styleObj = convertStyleToObject(component.style)
      return `      component_${component.id}_style: ${JSON.stringify(styleObj, null, 8)}`
    })
    .join(',\n')

  const pageStyleObj = page.globalStyle ? convertStyleToObject(page.globalStyle) : {}

  return `export default {
  data() {
    return {
${page.globalStyle ? `      pageStyle: ${JSON.stringify(pageStyleObj, null, 6)},\n` : ''}${componentStyles ? componentStyles + '\n' : ''}    }
  },
  onLoad() {
    console.log('页面加载')
  }
}`
}

// 生成样式代码
function generateStyleCode(page: PageConfig): string {
  return `.page {
  min-height: 100vh;
}

/* 页面自定义样式 */`
}

// 生成全局样式
function generateGlobalStyles(project: ProjectConfig): string {
  return `/* 全局样式 */
page {
  background-color: ${project.theme?.backgroundColor || '#ffffff'};
}

/* 通用样式类 */
.container {
  padding: 20px;
}

.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}`
}

// 转换样式对象
function convertStyleToObject(style: any): Record<string, string | number> {
  const result: Record<string, string | number> = {}
  
  Object.entries(style).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // 转换驼峰命名为连字符命名
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      result[cssKey] = value
    }
  })
  
  return result
}