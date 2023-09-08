<template>
  <div class="nav-bar">
    <Breadcrumb />
    <NavMenus />
    <Tabs />
  </div>
</template>
<script setup lang="ts">
  import { useConfig } from '/@/stores/config'
  import Breadcrumb from '../breadcrumb.vue'
  import NavMenus from '../navMenus.vue'
  import Tabs from './tabs.vue'
  import { onMounted, ref } from 'vue'

  const config = useConfig()

</script>
<style scoped lang="scss">
  .nav-bar {
    display: flex;
    flex: 1;
    background-color: v-bind('config.getColorVal("headerBarBackground")');
  }
</style>
