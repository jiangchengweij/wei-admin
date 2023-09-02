<template>
  <div :class="'layout-aside-' + config.layout.layoutMode + ' ' + (config.layout.shrink ? 'shrink' : '')" >
    <MenuVertical />
  </div>
</template>
<script setup lang="ts">
  import { useConfig } from '@/stores/config'
  import { computed, watch } from 'vue';
  import MenuVertical from './components/menus/menuVertical.vue'
  const config = useConfig()

  const headerHeight = computed(() => config.layout.headerHeight + 'px')
  const menuWidth = computed(() => config.menuWidth())

  watch(() => config.layout.menuCollapse, () => {
    if(config.layout.menuCollapse) {
      uni.setLeftWindowStyle({
        width: '64px'
      })
    } else {
      uni.setLeftWindowStyle({
        width: config.layout.menuWidth + 'px'
      })
    }
  }, {
    immediate: true
  })

</script>
<style scoped lang="scss">
  .layout-aside-Default {
    background: var(--bg-bg-color-overlay);
    height: calc(100vh - v-bind('headerHeight'));
    box-shadow: var(--el-box-shadow-light);
    overflow: hidden;
    transition: width 0.3s ease;
    width: v-bind('menuWidth');
  }
</style>

