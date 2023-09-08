<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item 
        v-for="(item, idx) in breadcrumbList"
        :key="idx"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { useNavTabs } from '@/stores/navTabs';
import type { AdminMenu } from '@/stores/interface';

const navTabs = useNavTabs()
const breadcrumbList = ref<AdminMenu[]>([])
watch(() => navTabs.state.activeMenu, () => {
  if(navTabs.state.activeMenu?.menu_id) {
    updateBreadcrumbList(navTabs.state.activeMenu?.menu_id)
  }
}, {
  immediate: true
})

function updateBreadcrumbList(menuId: string, tmpList: AdminMenu[] = []) {
  if(!menuId) {
    breadcrumbList.value = tmpList.reverse()
  } else {
    const tmpMenu = navTabs.state.tabsViewMenuIdMap[menuId]
    tmpList.push(tmpMenu)
    updateBreadcrumbList(tmpMenu.parent_id, tmpList)
  }
}
</script>
<style scoped>
  .breadcrumb {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: var(--ba-main-space);
  }
  .breadcrumb .is-link {
    cursor: pointer;
  }
</style>
