<script lang="ts">
import DefaultNavBar from './components/navBar/default.vue'
export default {
  components: {
    DefaultNavBar
  }
}
</script>
<template>
  <div class="layout-header">
    <Logo />
    <component :is="config.layout.layoutMode+'NavBar'"></component>
  </div>
</template>
<script setup lang="ts">
  import Logo from './components/logo.vue'
  import { useConfig } from '/@/stores/config'
  import { watch, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  const config = useConfig()
  const topStyle = uni.getTopWindowStyle()

  onMounted(() => {
    updateTabsHeight()
  })

  watch(() => [config.layout.showNavTab, config.layout.navTab], () => {
    updateTabsHeight()
  })

  function updateTabsHeight() {
    if(config.layout.showNavTab && config.layout.navTab) {
      document.documentElement.style.setProperty('--nav-tab-height', config.layout.navTabHeight + 'px')
    } else {
      document.documentElement.style.setProperty('--nav-tab-height', '0')
    }
  }
</script>
<style>
  .layout-header {
    height: v-bind('topStyle.height');
    padding: 0;
    display: flex;
  }
</style>
