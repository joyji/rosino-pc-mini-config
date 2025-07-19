<template>
  <div class="property-panel">
    <div class="panel-header">
      <h3>属性配置</h3>
    </div>
    
    <div v-if="!selectedComponent" class="no-selection">
      <el-icon :size="48" class="empty-icon">
        <Select />
      </el-icon>
      <p>请选择一个组件</p>
    </div>
    
    <div v-else class="panel-content">
      <el-scrollbar height="calc(100vh - 120px)">
        <!-- 组件基础信息 -->
        <div class="property-section">
          <h4>基础信息</h4>
          <el-form label-position="top" size="small">
            <el-form-item label="组件ID">
              <el-input v-model="selectedComponent.id" disabled />
            </el-form-item>
            <el-form-item label="组件名称">
              <el-input 
                v-model="selectedComponent.name" 
                @input="updateComponent"
                placeholder="请输入组件名称"
              />
            </el-form-item>
          </el-form>
        </div>
        
        <!-- 组件属性配置 -->
        <div class="property-section">
          <h4>组件属性</h4>
          <el-form label-position="top" size="small">
            <template v-for="propSchema in componentDefinition?.propSchema" :key="propSchema.key">
              <!-- 文本输入框 -->
              <el-form-item 
                v-if="propSchema.type === 'input'" 
                :label="propSchema.label"
                :required="propSchema.required"
              >
                <el-input 
                  v-model="selectedComponent.props[propSchema.key]"
                  :placeholder="propSchema.placeholder"
                  @input="updateComponent"
                />
              </el-form-item>
              
              <!-- 多行文本框 -->
              <el-form-item 
                v-else-if="propSchema.type === 'textarea'" 
                :label="propSchema.label"
                :required="propSchema.required"
              >
                <el-input 
                  v-model="selectedComponent.props[propSchema.key]"
                  type="textarea"
                  :rows="3"
                  :placeholder="propSchema.placeholder"
                  @input="updateComponent"
                />
              </el-form-item>
              
              <!-- 数字输入框 -->
              <el-form-item 
                v-else-if="propSchema.type === 'number'" 
                :label="propSchema.label"
                :required="propSchema.required"
              >
                <el-input-number 
                  v-model="selectedComponent.props[propSchema.key]"
                  :placeholder="propSchema.placeholder"
                  @change="updateComponent"
                  style="width: 100%"
                />
              </el-form-item>
              
              <!-- 开关 -->
              <el-form-item 
                v-else-if="propSchema.type === 'switch'" 
                :label="propSchema.label"
              >
                <el-switch 
                  v-model="selectedComponent.props[propSchema.key]"
                  @change="updateComponent"
                />
              </el-form-item>
              
              <!-- 选择器 -->
              <el-form-item 
                v-else-if="propSchema.type === 'select'" 
                :label="propSchema.label"
                :required="propSchema.required"
              >
                <el-select 
                  v-model="selectedComponent.props[propSchema.key]"
                  :placeholder="propSchema.placeholder"
                  @change="updateComponent"
                  style="width: 100%"
                >
                  <el-option 
                    v-for="option in propSchema.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </el-form-item>
              
              <!-- 颜色选择器 -->
              <el-form-item 
                v-else-if="propSchema.type === 'color'" 
                :label="propSchema.label"
              >
                <el-color-picker 
                  v-model="selectedComponent.props[propSchema.key]"
                  @change="updateComponent"
                />
              </el-form-item>
            </template>
          </el-form>
        </div>
        
        <!-- 样式配置 -->
        <div class="property-section">
          <h4>样式配置</h4>
          <el-collapse v-model="activeStyleTabs" multiple>
            <!-- 尺寸配置 -->
            <el-collapse-item title="尺寸" name="size">
              <el-form label-position="top" size="small">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="宽度">
                      <el-input 
                        v-model="selectedComponent.style.width"
                        placeholder="auto, 100px, 50%"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="高度">
                      <el-input 
                        v-model="selectedComponent.style.height"
                        placeholder="auto, 100px, 50%"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
            
            <!-- 外边距 -->
            <el-collapse-item title="外边距" name="margin">
              <el-form label-position="top" size="small">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="上">
                      <el-input 
                        v-model="selectedComponent.style.marginTop"
                        placeholder="0px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="右">
                      <el-input 
                        v-model="selectedComponent.style.marginRight"
                        placeholder="0px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="下">
                      <el-input 
                        v-model="selectedComponent.style.marginBottom"
                        placeholder="0px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="左">
                      <el-input 
                        v-model="selectedComponent.style.marginLeft"
                        placeholder="0px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
            
            <!-- 内边距 -->
            <el-collapse-item title="内边距" name="padding">
              <el-form label-position="top" size="small">
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="上">
                      <el-input 
                        v-model="selectedComponent.style.paddingTop"
                        placeholder="0px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="右">
                      <el-input 
                        v-model="selectedComponent.style.paddingRight"
                        placeholder="0px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="下">
                      <el-input 
                        v-model="selectedComponent.style.paddingBottom"
                        placeholder="0px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="左">
                      <el-input 
                        v-model="selectedComponent.style.paddingLeft"
                        placeholder="0px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
            
            <!-- 外观样式 -->
            <el-collapse-item title="外观" name="appearance">
              <el-form label-position="top" size="small">
                <el-form-item label="背景颜色">
                  <el-color-picker 
                    v-model="selectedComponent.style.backgroundColor"
                    @change="updateComponent"
                    show-alpha
                  />
                </el-form-item>
                <el-form-item label="文字颜色">
                  <el-color-picker 
                    v-model="selectedComponent.style.color"
                    @change="updateComponent"
                  />
                </el-form-item>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="字体大小">
                      <el-input 
                        v-model="selectedComponent.style.fontSize"
                        placeholder="14px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="字体粗细">
                      <el-select 
                        v-model="selectedComponent.style.fontWeight"
                        @change="updateComponent"
                        placeholder="选择粗细"
                        style="width: 100%"
                      >
                        <el-option label="正常" value="normal" />
                        <el-option label="粗体" value="bold" />
                        <el-option label="100" value="100" />
                        <el-option label="400" value="400" />
                        <el-option label="600" value="600" />
                        <el-option label="800" value="800" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="文字对齐">
                  <el-select 
                    v-model="selectedComponent.style.textAlign"
                    @change="updateComponent"
                    placeholder="选择对齐方式"
                    style="width: 100%"
                  >
                    <el-option label="左对齐" value="left" />
                    <el-option label="居中" value="center" />
                    <el-option label="右对齐" value="right" />
                  </el-select>
                </el-form-item>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="边框">
                      <el-input 
                        v-model="selectedComponent.style.border"
                        placeholder="1px solid #ddd"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="圆角">
                      <el-input 
                        v-model="selectedComponent.style.borderRadius"
                        placeholder="4px"
                        @input="updateComponent"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { getComponentDefinition } from '@/utils/componentLibrary'

const editorStore = useEditorStore()

// 选中的组件
const selectedComponent = computed(() => editorStore.selectedComponent)

// 组件定义
const componentDefinition = computed(() => {
  if (!selectedComponent.value) return null
  return getComponentDefinition(selectedComponent.value.type)
})

// 默认展开的样式标签
const activeStyleTabs = ref(['size', 'appearance'])

// 更新组件
function updateComponent() {
  if (selectedComponent.value) {
    // 触发响应式更新
    editorStore.updateComponent(selectedComponent.value.id, {
      ...selectedComponent.value
    })
  }
}
</script>

<style scoped>
.property-panel {
  width: 300px;
  height: 100vh;
  background: #f8f9fa;
  border-left: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  background: #fff;
}

.panel-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.no-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-selection p {
  margin: 0;
  font-size: 14px;
}

.panel-content {
  flex: 1;
  overflow: hidden;
}

.property-section {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  background: #fff;
  margin-bottom: 8px;
}

.property-section h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-size: 12px;
  line-height: 1.2;
  padding-bottom: 4px;
}

:deep(.el-input__wrapper) {
  font-size: 12px;
}

:deep(.el-select) {
  font-size: 12px;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  padding: 8px 0;
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}
</style>