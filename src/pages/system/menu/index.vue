<template>
  <!-- 可以直接在标签上使用 el-table的属性和事件 -->
  <wa-main>
    <div class="default-main wa-table-box">
      <wa-table-header
        :buttons="['refresh', 'add', 'edit', 'delete', 'unfold', 'quickSearch', 'columnDisplay']"
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
  new waTableRouter('menu'), // 一个api类的实例，自动生成index、edit、del、等url和请求方法，提供控制器url即可
  // 表格数据
  {
    // 表格列
    column: [
      { type: 'selection', align: 'center' },
      { label: t('system.menu.title'), prop: 'title', align: 'left', width: '200' },
      { label: t('system.menu.Icon'), prop: 'icon', align: 'center', width: '60', render: 'icon', default: 'fa fa-circle-o' },
      { label: t('system.menu.name'), prop: 'name', align: 'center', showOverflowTooltip: true },
      {
        label: t('system.menu.type'),
        prop: 'type',
        align: 'center',
        render: 'tag',
        custom: { menu: 'danger', menu_dir: 'success', button: 'info' },
        replaceValue: { menu: t('system.menu.type menu'), menu_dir: t('system.menu.type menu_dir'), button: t('system.menu.type button') },
      },
      { label: t('State'), prop: 'status', align: 'center', width: '80', render: 'switch' },
      { label: t('Update time'), prop: 'updatetime', align: 'center', width: '160', render: 'datetime' },
      {
        label: t('Operate'),
        align: 'center',
        width: '130',
        render: 'buttons',
        buttons: defaultOptButtons(),
      },
    ],
    pk: '_id',
    // 不允许双击编辑的列的 prop
    dblClickNotEditColumn: [undefined, 'status'],
    dragSortLimitField: 'pid',
    // ...属性很多，请参考本文下方的表格全部可用属性，或翻阅源代码（有注释）
  },
  {
    defaultItems: {
      type: 'menu',
      menu_type: 'tab',
      extend: 'none',
      keepalive: 0,
      status: '1',
      icon: 'fa fa-circle-o',
    },
  },
)

// 实例化表格后，将 baTable 的实例提供给上下文
provide('waTable', waTableIns)

onMounted(() => {
  waTableIns.table.ref = tableRef.value
  // 相当于表格的onMounted，也可以在页面的onMounted时执行
  waTableIns.mount()
  // 获取数据，可以在页面的onMounted时执行，也可以比如先请求一个API，再执行获取数据
  waTableIns.getIndex()!.then(() => {
    // 查看请求完毕（已获取到表格数据）
    //waTableIns.initSort() // 初始化默认排序（如果需要）
    waTableIns.dragSort() // 初始化拖拽排序（如果需要）
  })
})

</script>
