<template>
  <!-- 可以直接在标签上使用 el-table的属性和事件 -->
  <wa-main>
    <div class="default-main wa-table-box">
      <wa-table-header
        :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
      ></wa-table-header>
      <wa-table ref="tableRef" :pagination="false">
        <!-- baTableClass 实例中编程式定义的表格列会渲染在此处 -->
      </wa-table>
    </div>
  </wa-main>
  <!-- 这里正常还需引入一个表单组件，以供表格打开表单等 -->
  <!-- 请参考任意后台页面的popupForm.vue组件，比如：\src\views\backend\user\rule\popupForm.vue -->
  <PopupForm />
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import PopupForm from './popupForm.vue'
import waTableClass from '/@/utils/waTable' // 导入 baTable 类
import { waTableRouter } from '/@/cloud/common' // 导入表格api方法生成器
import { defaultOptButtons } from '/@/components/wa-table' // 导入默认表格操作按钮数据:拖拽排序、编辑、删除按钮
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tableRef = ref()

// 直接实例化 baTableClass 并传递各种参数
const waTableIns = new waTableClass(
  new waTableRouter({
    collection: 'uni-id-permissions',
    quickSearchField: 'permission_id',
    field: 'permission_name, permission_id, parent_id, comment, create_date',
    orderby: 'permission_id asc',
    pk: '_id',
  }), // 一个api类的实例，自动生成index、edit、del、等url和请求方法，提供控制器url即可
  // 表格数据
  {
    // 表格列
    column: [
      { type: 'selection', align: 'center' },
      { label: '名称', prop: 'permission_name', align: 'left', width: '200' },
      { label: '标识', prop: 'permission_id', align: 'center' },
      { label: '备注', prop: 'comment', align: 'center' },
      { label: t('Create time'), prop: 'create_date', align: 'center', width: '160', render: 'datetime' },
      {
        label: '操作',
        align: 'center',
        width: '150',
        render: 'buttons',
        // 操作按钮传递的只是一个按钮配置数组，你也可以在渲染前对数组配置进行修改
        buttons: defaultOptButtons(['edit', 'delete']),
        operator: false,
      },
    ],
    pk: '_id',
    // 不允许双击编辑的列的 prop
    dblClickNotEditColumn: [undefined, 'status'],
    // ...属性很多，请参考本文下方的表格全部可用属性，或翻阅源代码（有注释）
  },
  {
    defaultItems: {
      permission_name: '',
      permission_id: '',
      comment: ''
    }
  }
)

// 实例化表格后，将 baTable 的实例提供给上下文
provide('waTable', waTableIns)

onMounted(() => {
  waTableIns.table.ref = tableRef.value
  // 相当于表格的onMounted，也可以在页面的onMounted时执行
  waTableIns.mount()
  // 获取数据，可以在页面的onMounted时执行，也可以比如先请求一个API，再执行获取数据
  waTableIns.getIndex()!.then(() => {

  })
})

</script>
