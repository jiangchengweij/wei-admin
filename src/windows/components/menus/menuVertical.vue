<template>
  <el-scrollbar ref="verticalMenusRef" class="vertical-menus-scrollbar">
    <el-menu
      class="layouts-menu-vertical"
      :collapse-transition="false"
      :unique-opened="config.layout.menuUniqueOpened"
      :default-active="menuActiveId"
      :collapse="config.layout.menuCollapse"
    >
      <MenuTree :menus="menus" />
    </el-menu>
  </el-scrollbar>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useNavTabs } from '@/stores/navTabs'
import MenuTree from './menuTree.vue'
import { listToTree } from '@/utils/common'
import type { AdminMenu } from '@/stores/interface'
import { useConfig } from '@/stores/config'

const config = useConfig()
const navTabs = useNavTabs()

const menuActiveId = computed(() => {
  if(navTabs.state.activeMenu) {
    return navTabs.state.activeMenu.menu_id
  }
  return null
})

const menus = computed(() => {
  return listToTree<AdminMenu>(navTabs.state.tabsViewRoutes, 'menu_id', 'parent_id')
})

</script>
<style>
.vertical-menus-scrollbar {
  height: 100%;
  background-color: v-bind('config.getColorVal("menuBackground")');
}
.layouts-menu-vertical {
  border: 0;
  --el-menu-bg-color: v-bind('config.getColorVal("menuBackground")');
  --el-menu-text-color: v-bind('config.getColorVal("menuColor")');
  --el-menu-active-color: v-bind('config.getColorVal("menuActiveColor")');
}
</style>
