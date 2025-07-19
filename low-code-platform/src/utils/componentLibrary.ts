import type { ComponentDefinition } from '@/types'

// 微信小程序组件库
export const componentLibrary: ComponentDefinition[] = [
  // 基础组件
  {
    id: 'view',
    type: 'view',
    name: 'View容器',
    icon: 'Box',
    category: '基础组件',
    defaultProps: {
      text: ''
    },
    defaultStyle: {
      width: '100%',
      height: 'auto',
      backgroundColor: 'transparent',
      padding: '10px',
      display: 'block'
    },
    propSchema: [
      {
        key: 'hoverClass',
        label: '点击态样式类',
        type: 'input',
        defaultValue: '',
        placeholder: '点击时的样式类名'
      },
      {
        key: 'hoverStopPropagation',
        label: '阻止冒泡',
        type: 'switch',
        defaultValue: false
      }
    ]
  },
  {
    id: 'text',
    type: 'text',
    name: 'Text文本',
    icon: 'Document',
    category: '基础组件',
    defaultProps: {
      content: '文本内容',
      selectable: false,
      decode: false
    },
    defaultStyle: {
      fontSize: '14px',
      color: '#333333',
      lineHeight: '1.4'
    },
    propSchema: [
      {
        key: 'content',
        label: '文本内容',
        type: 'textarea',
        defaultValue: '文本内容',
        required: true,
        placeholder: '请输入文本内容'
      },
      {
        key: 'selectable',
        label: '可选择',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'decode',
        label: 'HTML解码',
        type: 'switch',
        defaultValue: false
      }
    ]
  },
  {
    id: 'image',
    type: 'image',
    name: 'Image图片',
    icon: 'Picture',
    category: '基础组件',
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      mode: 'aspectFit',
      lazyLoad: false,
      showMenuByLongpress: false
    },
    defaultStyle: {
      width: '300px',
      height: '200px'
    },
    propSchema: [
      {
        key: 'src',
        label: '图片地址',
        type: 'input',
        defaultValue: 'https://via.placeholder.com/300x200',
        required: true,
        placeholder: '请输入图片URL'
      },
      {
        key: 'mode',
        label: '裁剪模式',
        type: 'select',
        defaultValue: 'aspectFit',
        options: [
          { label: '保持纵横比缩放', value: 'aspectFit' },
          { label: '保持纵横比填充', value: 'aspectFill' },
          { label: '宽度不变', value: 'widthFix' },
          { label: '高度不变', value: 'heightFix' },
          { label: '拉伸填充', value: 'scaleToFill' },
          { label: '裁剪居中', value: 'center' }
        ]
      },
      {
        key: 'lazyLoad',
        label: '懒加载',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'showMenuByLongpress',
        label: '长按显示菜单',
        type: 'switch',
        defaultValue: false
      }
    ]
  },
  
  // 表单组件
  {
    id: 'button',
    type: 'button',
    name: 'Button按钮',
    icon: 'Switch',
    category: '表单组件',
    defaultProps: {
      text: '按钮',
      type: 'default',
      size: 'default',
      disabled: false,
      loading: false,
      formType: '',
      openType: ''
    },
    defaultStyle: {
      width: 'auto',
      height: 'auto',
      backgroundColor: '#ffffff',
      color: '#333333',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '8px 16px'
    },
    propSchema: [
      {
        key: 'text',
        label: '按钮文字',
        type: 'input',
        defaultValue: '按钮',
        required: true,
        placeholder: '请输入按钮文字'
      },
      {
        key: 'type',
        label: '按钮类型',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: '默认', value: 'default' },
          { label: '主要', value: 'primary' },
          { label: '警告', value: 'warn' }
        ]
      },
      {
        key: 'size',
        label: '按钮大小',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: '默认', value: 'default' },
          { label: '迷你', value: 'mini' }
        ]
      },
      {
        key: 'disabled',
        label: '禁用状态',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'loading',
        label: '加载状态',
        type: 'switch',
        defaultValue: false
      }
    ]
  },
  {
    id: 'input',
    type: 'input',
    name: 'Input输入框',
    icon: 'Edit',
    category: '表单组件',
    defaultProps: {
      placeholder: '请输入内容',
      value: '',
      type: 'text',
      password: false,
      disabled: false,
      maxlength: 140,
      confirmType: 'done'
    },
    defaultStyle: {
      width: '100%',
      height: '40px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '0 12px',
      fontSize: '14px'
    },
    propSchema: [
      {
        key: 'placeholder',
        label: '占位文字',
        type: 'input',
        defaultValue: '请输入内容',
        placeholder: '请输入占位文字'
      },
      {
        key: 'value',
        label: '默认值',
        type: 'input',
        defaultValue: '',
        placeholder: '请输入默认值'
      },
      {
        key: 'type',
        label: '输入类型',
        type: 'select',
        defaultValue: 'text',
        options: [
          { label: '文本', value: 'text' },
          { label: '数字', value: 'number' },
          { label: '身份证', value: 'idcard' },
          { label: '小数', value: 'digit' }
        ]
      },
      {
        key: 'password',
        label: '密码模式',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'disabled',
        label: '禁用状态',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'maxlength',
        label: '最大长度',
        type: 'number',
        defaultValue: 140
      }
    ]
  },
  
  // 导航组件
  {
    id: 'navigator',
    type: 'navigator',
    name: 'Navigator导航',
    icon: 'Link',
    category: '导航组件',
    defaultProps: {
      url: '/pages/index/index',
      openType: 'navigate',
      text: '点击跳转'
    },
    defaultStyle: {
      display: 'inline-block',
      color: '#576b95',
      textDecoration: 'none'
    },
    propSchema: [
      {
        key: 'text',
        label: '链接文字',
        type: 'input',
        defaultValue: '点击跳转',
        required: true,
        placeholder: '请输入链接文字'
      },
      {
        key: 'url',
        label: '跳转链接',
        type: 'input',
        defaultValue: '/pages/index/index',
        required: true,
        placeholder: '请输入跳转页面路径'
      },
      {
        key: 'openType',
        label: '跳转方式',
        type: 'select',
        defaultValue: 'navigate',
        options: [
          { label: '保留当前页面', value: 'navigate' },
          { label: '关闭当前页面', value: 'redirect' },
          { label: '关闭所有页面', value: 'reLaunch' },
          { label: '返回上级页面', value: 'navigateBack' },
          { label: '跳转到tabBar页面', value: 'switchTab' }
        ]
      }
    ]
  },
  
  // 媒体组件
  {
    id: 'video',
    type: 'video',
    name: 'Video视频',
    icon: 'VideoPlay',
    category: '媒体组件',
    defaultProps: {
      src: '',
      poster: '',
      autoplay: false,
      loop: false,
      muted: false,
      controls: true,
      showFullscreenBtn: true,
      showPlayBtn: true,
      showCenterPlayBtn: true
    },
    defaultStyle: {
      width: '100%',
      height: '200px'
    },
    propSchema: [
      {
        key: 'src',
        label: '视频地址',
        type: 'input',
        defaultValue: '',
        required: true,
        placeholder: '请输入视频URL'
      },
      {
        key: 'poster',
        label: '封面图片',
        type: 'input',
        defaultValue: '',
        placeholder: '请输入封面图片URL'
      },
      {
        key: 'autoplay',
        label: '自动播放',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'loop',
        label: '循环播放',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'muted',
        label: '静音播放',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'controls',
        label: '显示控制栏',
        type: 'switch',
        defaultValue: true
      }
    ]
  },
  
  // 地图组件
  {
    id: 'map',
    type: 'map',
    name: 'Map地图',
    icon: 'Location',
    category: '媒体组件',
    defaultProps: {
      longitude: 116.397477,
      latitude: 39.909652,
      scale: 16,
      showLocation: false,
      showCompass: false,
      showScale: false,
      enableOverlooking: false,
      enableZoom: true,
      enableScroll: true,
      enableRotate: false
    },
    defaultStyle: {
      width: '100%',
      height: '300px'
    },
    propSchema: [
      {
        key: 'longitude',
        label: '经度',
        type: 'number',
        defaultValue: 116.397477,
        required: true,
        placeholder: '请输入经度'
      },
      {
        key: 'latitude',
        label: '纬度',
        type: 'number',
        defaultValue: 39.909652,
        required: true,
        placeholder: '请输入纬度'
      },
      {
        key: 'scale',
        label: '缩放级别',
        type: 'number',
        defaultValue: 16,
        placeholder: '3-20'
      },
      {
        key: 'showLocation',
        label: '显示用户位置',
        type: 'switch',
        defaultValue: false
      },
      {
        key: 'enableZoom',
        label: '支持缩放',
        type: 'switch',
        defaultValue: true
      },
      {
        key: 'enableScroll',
        label: '支持拖拽',
        type: 'switch',
        defaultValue: true
      }
    ]
  }
]

// 根据分类分组组件
export function getComponentsByCategory() {
  const categories: { [key: string]: ComponentDefinition[] } = {}
  
  componentLibrary.forEach(component => {
    if (!categories[component.category]) {
      categories[component.category] = []
    }
    categories[component.category].push(component)
  })
  
  return categories
}

// 根据类型获取组件定义
export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return componentLibrary.find(comp => comp.type === type)
}