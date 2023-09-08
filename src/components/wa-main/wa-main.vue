<template>
  <el-scrollbar 
    class="layout-main-scrollbar" 
    :style="layoutMainScrollbarStyle()" 
    ref="mainScrollbarRef"
  >
    <slot />
  </el-scrollbar>
</template>
<script setup lang="ts">
import { mainHeight as layoutMainScrollbarStyle } from '@/utils/layout'
import { ref, provide } from 'vue'
import type { ScrollbarInstance } from 'element-plus'

const mainScrollbarRef = ref<ScrollbarInstance>()

provide('mainScrollbarRef', mainScrollbarRef)
</script>
<style scoped lang="scss">
.layout-container .layout-main {
  padding: 0 !important;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.layout-main-scrollbar {
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
