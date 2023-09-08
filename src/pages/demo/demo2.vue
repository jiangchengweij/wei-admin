<template>
  <!-- 可以直接在标签上使用 el-table的属性和事件 -->
  <wa-main>
    <div class="default-main wa-table-box">
      <wa-table-header
        :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
      ></wa-table-header>
      <wa-table ref="tableRef">
        <!-- baTableClass 实例中编程式定义的表格列会渲染在此处 -->
      </wa-table>
    </div>
  </wa-main>
  <!-- 这里正常还需引入一个表单组件，以供表格打开表单等 -->
  <!-- 请参考任意后台页面的popupForm.vue组件，比如：\src\views\backend\user\rule\popupForm.vue -->
  <!-- <PopupForm /> -->
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import waTableClass from '/@/utils/waTable' // 导入 baTable 类
import { waTableRouter } from '/@/cloud/common' // 导入表格api方法生成器
import { defaultOptButtons } from '/@/components/wa-table' // 导入默认表格操作按钮数据:拖拽排序、编辑、删除按钮

const tableRef = ref()

// 直接实例化 baTableClass 并传递各种参数
const waTableIns = new waTableClass(
  new waTableRouter({
    collection: 'wei-shop-categories',
    quickSearchField: 'name',
    field: ''
  }), // 一个api类的实例，自动生成index、edit、del、等url和请求方法，提供控制器url即可
  // 表格数据
  {
    // 表格列
    column: [
      { type: 'selection', align: 'center', operator: false },
      { label: 'ID', prop: '_id', align: 'center', operator: 'LIKE', operatorPlaceholder: '模糊查询'},
      { label: '用户名', prop: 'name', align: 'center', operator: 'LIKE', operatorPlaceholder: '模糊查询' },
      { label: '创建时间', prop: 'create_date', align: 'center', render: 'datetime', operator: 'RANGE', operatorPlaceholder: '时间范围' },
      {
        label: '操作',
        align: 'center',
        width: '100',
        render: 'buttons',
        // 操作按钮传递的只是一个按钮配置数组，你也可以在渲染前对数组配置进行修改
        buttons: defaultOptButtons(['edit', 'delete']),
        operator: false,
      },
    ],
    // 不允许双击编辑的列的 prop
    dblClickNotEditColumn: [undefined],
    // ...属性很多，请参考本文下方的表格全部可用属性，或翻阅源代码（有注释）
  }
)

// 实例化表格后，将 baTable 的实例提供给上下文
provide('waTable', waTableIns)

// 相当于表格的onMounted，也可以在页面的onMounted时执行
waTableIns.mount()

// 获取数据，可以在页面的onMounted时执行，也可以比如先请求一个API，再执行获取数据
waTableIns.getIndex()!.then(() => {
  // 查看请求完毕（已获取到表格数据）
  // baTable.initSort() // 初始化默认排序（如果需要）
  // baTable.dragSort() // 初始化拖拽排序（如果需要）
})
</script>
