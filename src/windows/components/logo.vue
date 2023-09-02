<template>
  <div class="layout-logo">
    <img v-if="!config.layout.menuCollapse" class="logo-img" src="~assets/logo.png" alt="logo" />
    <div v-if="!config.layout.menuCollapse" :style="{ color: config.getColorVal('menuActiveColor') }" class="website-name">
      {{ pages.globalStyle.navigationBarTitleText }}
    </div>
    <wa-icon
      @click="onMenuCollapse"
      :name="config.layout.menuCollapse ? 'fa fa-indent' : 'fa fa-dedent'"
      :class="config.layout.menuCollapse ? 'unfold' : ''"
      :color="config.getColorVal('menuActiveColor')"
      size="18"
      class="fold collapse-icon"
    ></wa-icon>
  </div>
</template>
<script setup lang="ts">
import { useConfig } from '@/stores/config'
import pages from '@/pages.json'
import { computed } from 'vue'
import { setNavTabsWidth, setLayoutLogoWidth } from '/@/utils/layout'
import { Session } from '@/utils/storage'
import { BEFORE_RESIZE_LAYOUT } from '/@/stores/constant/cacheKey'

const config = useConfig()
const menuWidth = computed(() => config.menuWidth())

const onMenuCollapse = function() {
  config.setLayout('menuCollapse', !config.layout.menuCollapse)

  Session.set(BEFORE_RESIZE_LAYOUT, {
    layoutMode: config.layout.layoutMode,
    menuCollapse: config.layout.menuCollapse,
  })
  // 等待侧边栏动画结束后重新计算导航栏宽度
  // setTimeout(() => {
  //   setNavTabsWidth()
  //   setLayoutLogoWidth()
  // }, 350)
}
</script>
<style scoped lang="scss">
.layout-logo {
  height: 100%;
  width: v-bind('menuWidth');
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: v-bind('config.getColorVal("menuTopBarBackground")');
}
.logo-img {
  width: 28px;
}
.website-name {
  display: block;
  width: 180px;
  padding-left: 4px;
  font-size: var(--el-font-size-extra-large);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fold {
  margin-left: auto;
}
.unfold {
  margin: 0 auto;
}
.collapse-icon {
  cursor: pointer;
}
</style>
