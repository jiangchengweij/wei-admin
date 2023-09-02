<template>
  <template v-for="menu in menus">
    <template v-if="menu.children && menu.children.length > 0">
      <el-sub-menu :index="menu.menu_id" :key="menu.menu_id">
        <template #title>
          <wa-icon :color="config.getColorVal('menuColor')" :name="menu?.icon ? menu?.icon : config.layout.menuDefaultIcon" />
          <span>{{ menu.name }}</span>
        </template>
        <menu-tree :menus="menu.children"></menu-tree>
      </el-sub-menu>
    </template>
    <template v-else>
      <el-menu-item :index="menu.menu_id" :key="menu.menu_id" @click="onClickMenu(menu)">
        <wa-icon :color="config.getColorVal('menuColor')" :name="menu?.icon ? menu?.icon : config.layout.menuDefaultIcon" />
        <span>{{ menu.name }}</span>
      </el-menu-item>
    </template>
  </template>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { AdminMenu } from '@/stores/interface'
import { useConfig } from '@/stores/config'
import { onClickMenu } from '@/utils/router'

const config = useConfig()
const props = defineProps({
  menus: {
    type: Array as PropType<AdminMenu[]>,
    default: () => [],
  },
})

</script>
<style scoped lang="scss">
.el-sub-menu .icon,
.el-menu-item .icon {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}
.is-active > .icon {
  color: var(--el-menu-active-color) !important;
}
.el-menu-item.is-active {
  background-color: v-bind('config.getColorVal("menuActiveBackground")');
}
</style>
