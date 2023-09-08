<template>
  <div class="w100">
    <!-- el-select 的远程下拉只在有搜索词时，才会加载数据（显示出 option 列表） -->
    <!-- 使用 el-popover 在无数据/无搜索词时，显示一个无数据的提醒 -->
    <el-popover
      width="100%"
      placement="bottom"
      popper-class="remote-select-popper"
      :visible="state.focusStatus && !state.loading && !state.keyword && !state.options.length"
      :teleported="false"
      :content="$t('utils.No data')"
    >
      <template #reference>
        <el-select
          ref="selectRef"
          class="w100"
          @focus="onFocus"
          @blur="onBlur"
          :loading="state.loading || state.accidentBlur"
          :filterable="true"
          :remote="true"
          clearable
          remote-show-suffix
          :remote-method="onLogKeyword"
          v-model="state.value"
          @change="onChangeSelect"
          :multiple="multiple"
          :key="state.selectKey"
          @clear="onClear"
          @visible-change="onVisibleChange"
          v-bind="$attrs"
        >
          <el-option
            class="remote-select-option"
            v-for="item in state.options"
            :label="item[labelField]"
            :value="item[state.primaryKey].toString()"
            :key="item[state.primaryKey]"
          >
            <el-tooltip placement="right" effect="light" v-if="!isEmpty(tooltipParams)">
              <template #content>
                <p v-for="(tooltipParam, key) in tooltipParams" :key="key">{{ key }}: {{ item[tooltipParam] }}</p>
              </template>
              <div>{{ item[field] }}</div>
            </el-tooltip>
          </el-option>
          <el-pagination
            v-if="state.total"
            :currentPage="state.pageCurrent"
            :page-size="state.pageSize"
            class="select-pagination"
            layout="->, prev, next"
            :total="state.total"
            @current-change="onSelectCurrentPageChange"
          />
        </el-select>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, onUnmounted, ref, nextTick, getCurrentInstance, toRaw } from 'vue'
// import { getSelectData } from '/@/api/common'
import { uuid } from '/@/utils/random'
import type { ElSelect } from 'element-plus'
import { isEmpty } from 'lodash-es'
import { getArrayKey } from '/@/utils/common'
import { useDatacom, datacomProps } from '@/cloud/mixinDataCom'
import type { DatacomProps } from '@/cloud/mixinDataCom'

const selectRef = ref<InstanceType<typeof ElSelect> | undefined>()
type ElSelectProps = Partial<InstanceType<typeof ElSelect>['$props']>
type valType = string | number | string[] | number[]

interface Props extends ElSelectProps, DatacomProps {
  pk?: string
  labelField?: string
  valueField?: string
  multiple?: boolean
  modelValue: valType
  labelFormatter?: (optionData: anyObj, optionKey: string) => string
  tooltipParams?: anyObj,
  keywordKey?: string,
  collection?: string,
  action?: string,
  field?: string,
  orderby?: string,
  where?: string,
  pageData?: string,
  pageCurrent?: number,
  pageSize?: number,
  getcount?: boolean | string,
  gettree?: boolean | string,
  gettreepath?: boolean | string,
  startwidth?: string
  limitlevel?: string
  groupby?: string,
  groupField?: string,
  startwith?: string
  distinct?: string | boolean,
  manual?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pk: '_id',
  modelValue: '',
  multiple: false,
  tooltipParams: () => {
    return {}
  },
  ...datacomProps,
  labelField: 'name',
})

const { mixinDatacomEasyGet, mixinDatacomGet } = useDatacom({ props })

const state: {
  // 主表字段名(不带表别名)
  primaryKey: string
  options: anyObj[]
  loading: boolean
  total: number
  pageCurrent: number
  pageSize: number
  keyword: string
  value: valType
  selectKey: string
  initializeData: boolean
  accidentBlur: boolean
  focusStatus: boolean
  where: string
} = reactive({
  primaryKey: props.pk,
  options: [],
  loading: false,
  total: 0,
  pageCurrent: 1,
  pageSize: 10,
  keyword: '',
  value: props.modelValue ? props.modelValue : '',
  selectKey: uuid(),
  initializeData: false,
  accidentBlur: false,
  focusStatus: false,
  where: ''
})

let io: null | IntersectionObserver = null
const instance = getCurrentInstance()

const emits = defineEmits<{
  (e: 'update:modelValue', value: valType): void
  (e: 'row', value: any): void
}>()

const onChangeSelect = (val: valType) => {
  emits('update:modelValue', val)
  if (typeof instance?.vnode.props?.onRow == 'function') {
    if (typeof val == 'number' || typeof val == 'string') {
      const dataKey = getArrayKey(state.options, props.pk, val.toString())
      emits('row', dataKey ? toRaw(state.options[dataKey]) : {})
    } else {
      const valueArr = []
      for (const key in val) {
        let dataKey = getArrayKey(state.options, props.pk, val[key].toString())
        if (dataKey) valueArr.push(toRaw(state.options[dataKey]))
      }
      emits('row', valueArr)
    }
  }
}

const onVisibleChange = (val: boolean) => {
  // 保持面板状态和焦点状态一致
  if (!val) {
    nextTick(() => {
      selectRef.value?.blur()
    })
  }
}

const onFocus = () => {
  state.focusStatus = true
  //TOOD 并未发现脱焦问题
  // if (selectRef.value?.query != state.keyword) {
  //   state.keyword = ''
  //   state.initializeData = false
  //   // el-select 自动清理搜索词会产生意外的脱焦
  //   state.accidentBlur = false
  // }
  if (!state.initializeData) {
    getData()
  }
}

const onBlur = () => {
  state.focusStatus = false
}

const onClear = () => {
  state.keyword = ''
  state.initializeData = false
}

const onLogKeyword = (q: string) => {
  //修复bug,关闭时候也存在接口调用
  if(state.keyword === q) return
  console.log(q)
  state.keyword = q
  getData()
}

const getData = (initValue: valType = '') => {
  state.loading = true
  if(state.keyword && state.keyword != '') {
    if (props.keywordKey && props.keywordKey != '') {
      const keywordWhere = `/${state.keyword}/.test(${props.keywordKey})`
      state.where = props.where && props.where != '' ? `${props.where} && ${keywordWhere}` : keywordWhere
    }
  } else {
    state.where = props.where
  }
  console.log(props)
  mixinDatacomGet(state).then((res) => {
    if(!res.errCode) {
      let initializeData = true
      const { data, total } = res
      let opts:anyObj[] = []
      if (props.gettree) {
        const setChildren = (parents: anyObj[], index: number = 0) => {
          let prefix = ''
          if(index > 0) {
            prefix = Array.from({length: index}).fill('  ').join('')
          }
          parents.forEach((item, ind) => {
            let tmpLabel = item[props.labelField]
            if (index > 0) {
              tmpLabel = prefix + (ind === parents.length - 1 ? '└' : '├') + item[props.labelField]
            }
            opts.push({
              ...item,
              [props.labelField]: tmpLabel
            })
            if(item.children && item.children.length > 0) {
              setChildren(item.children, index + 1)
            }
          })
        }
        setChildren(data, 0)
      } else {
        opts = data as anyObj[]
      }
      if (typeof props.labelFormatter == 'function') {
        for (const key in opts) {
          opts[key][props.labelField] = props.labelFormatter(opts[key], key)
        }
      }
      state.options = opts
      state.total = total ? total : data.length
      if (initValue) {
        // 重新渲染组件,确保在赋值前,opts已加载到-兼容 modelValue 更新
        state.selectKey = uuid()
        initializeData = false
      }
      state.loading = false
      state.initializeData = initializeData
      if (state.accidentBlur) {
        nextTick(() => {
          const inputEl = selectRef.value?.$el.querySelector('.el-select__tags .el-select__input')
          inputEl && inputEl.focus()
          state.accidentBlur = false
        })
      }
    }
  }).catch(() => {
    state.loading = false
  })
}

const onSelectCurrentPageChange = (val: number) => {
  state.pageCurrent = val
  console.log('onSelectCurrentPageChange')
  getData()
}

const initDefaultValue = () => {
  if (state.value) {
    // number[]转string[]确保默认值能够选中
    if (typeof state.value === 'object') {
      for (const key in state.value as string[]) {
        state.value[key] = state.value[key].toString()
      }
    } else if (typeof state.value === 'number') {
      state.value = state.value.toString()
    }
    console.log('initDefaultValue')
    getData(state.value)
  }
}

onMounted(() => {
  console.log("onMounted")
  if (props.pk.indexOf('.') > 0) {
    let pk = props.pk.split('.')
    state.primaryKey = pk[1] ? pk[1] : pk[0]
  }
  initDefaultValue()

  setTimeout(() => {
    if (window?.IntersectionObserver) {
      io = new IntersectionObserver((entries) => {
        for (const key in entries) {
          if (!entries[key].isIntersecting) selectRef.value?.blur()
        }
      })
      if (selectRef.value?.$el instanceof Element) {
        io.observe(selectRef.value.$el)
      }
    }
  }, 500)
})

onUnmounted(() => {
  io?.disconnect()
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (String(state.value) != String(newVal)) {
      state.value = newVal ? newVal : ''
      initDefaultValue()
    }
  }
)

const getSelectRef = () => {
  return selectRef.value
}

const focus = () => {
  selectRef.value?.focus()
}

const blur = () => {
  selectRef.value?.blur()
}

defineExpose({
  blur,
  focus,
  getSelectRef,
})
</script>

<style scoped lang="scss">
:deep(.remote-select-popper) {
  text-align: center;
}
.remote-select-option {
  white-space: pre;
}
</style>
