<template>
  <div class="nav-tabs" ref="tabScrollbarRef">
    <div
      v-for="(item, idx) in navTabs.state.tabsView"
      @click="onTab(item)"
      class="ba-nav-tab"
      :class="navTabs.state.activeMenu?.menu_id === item.menu_id ? 'active': ''"
      :key="idx"
      :ref="tabsRefs.set"
      @contextmenu.prevent="onContextmenu(item, $event)"
    >
      {{ item.name }}
      <transition @after-leave="selectNavTab" name="el-fade-in">
        <wa-icon 
          v-show="navTabs.state.tabsView.length > 1" 
          class="close-icon"
          size="15"
          @click.stop="closeTab(item)"
          name="el-icon-Close"
        />
      </transition>
    </div>
    <div :style="activeBoxStyle" class="nav-tabs-active-box"></div>
  </div>
  <wa-contextmenu ref="contextmenuRef" :items="state.contextmenuItems" @contextmenuItemClick="onContextmenuItem"></wa-contextmenu>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useConfig } from '@/stores/config'
import { computed, onMounted, ref, watch, reactive, nextTick } from 'vue'
import { useNavTabs } from '@/stores/navTabs'
import type { AdminMenu } from '@/stores/interface'
import { routePush } from '@/utils/router'
import adminConfig from '@/admin.config'
import { useTemplateRefsList } from '@vueuse/core'
import type { ContextMenuItem, ContextmenuItemClickEmitArg } from '/@/components/wa-contextmenu/interface'
import horizontalScroll from '@/utils/horizontalScroll'

const config = useConfig()
const navTabs = useNavTabs()
const headerHeight = computed(() => config.layout.headerHeight + 'px')
const menuWidth = computed(() => config.layout.menuWidth + 'px')
const router = useRouter()
const route = useRoute()
const tabsRefs = useTemplateRefsList<HTMLDivElement>()

const contextmenuRef = ref()

const state: {
    contextmenuItems: ContextMenuItem[]
} = reactive({
  contextmenuItems: [
    { name: 'refresh', label: '重新加载', icon: 'fa fa-refresh' },
    { name: 'close', label: '关闭标签', icon: 'fa fa-times' },
    { name: 'closeOther', label: '关闭其他标签', icon: 'fa fa-minus' },
    { name: 'closeAll', label: '关闭全部标签', icon: 'fa fa-stop' },
  ],
})

const onContextmenu = (menu: AdminMenu, el: MouseEvent) => {
  // 禁用刷新
  state.contextmenuItems[0].disabled = route.path !== menu.path
  // 禁用关闭其他和关闭全部
  state.contextmenuItems[3].disabled = state.contextmenuItems[2].disabled = navTabs.state.tabsView.length == 1 ? true : false

  const { clientX, clientY } = el
  contextmenuRef.value.onShowContextmenu(menu, {
    x: clientX,
    y: clientY,
  })
}


watch(router.currentRoute, (newRoute, oldRoute) => {
  navTabs.addTab(newRoute)
  nextTick(() => {
    selectNavTab()
  })
})

function toLastTab() {
  const lastTab = navTabs.state.tabsView.slice(-1)[0]
  if(lastTab) {
    routePush(lastTab.url)
  } else {
    routePush(adminConfig.index.url || '/')
  }
}

function onTab(menu: AdminMenu) {
  routePush(menu.url)
}

function closeTab(menu: AdminMenu) {
  navTabs.closeTab(menu)
  if (navTabs.state.activeMenu?.menu_id === menu.menu_id) {
    toLastTab()
  } else {
    nextTick(() => {
      selectNavTab()
    })
  }
}

function closeOtherTab(menu: AdminMenu) {
  navTabs.closeTabs(menu)
  if (navTabs.state.activeMenu?.menu_id !== menu.menu_id) {
    routePush(menu.url)
  }
}

function closeAllTab(menu: AdminMenu) {
  navTabs.closeTabs(false)
  routePush(adminConfig.index.url || '/')
}

const onContextmenuItem = async (item: ContextmenuItemClickEmitArg) => {
  const { name, menu } = item
  if (!menu) return
  switch (name) {
    case 'refresh':
      routePush(menu.url)
    case 'close':
      closeTab(menu)
      break
    case 'closeOther':
      closeOtherTab(menu)
      break
    case 'closeAll':
      closeAllTab(menu)
      break
  }
}

const activeBoxStyle = reactive({
  width: '0',
  transform: 'translateX(0px)',
})

const tabScrollbarRef = ref()

function selectNavTab() {
  const index = navTabs.state.tabsView.findIndex((item) => item.menu_id === navTabs.state.activeMenu?.menu_id)
  if(index < 0) return false
  const dom = tabsRefs.value[index] as HTMLDivElement
  if(!dom) return false
  activeBoxStyle.width = dom.clientWidth + 'px'
  activeBoxStyle.transform = `translateX(${dom.offsetLeft}px)`
  let scrollLeft = dom.offsetLeft + dom.clientWidth - tabScrollbarRef.value.clientWidth
  if (dom.offsetLeft < tabScrollbarRef.value.scrollLeft) {
    tabScrollbarRef.value.scrollTo(dom.offsetLeft, 0)
  } else if (scrollLeft > tabScrollbarRef.value.scrollLeft) {
    tabScrollbarRef.value.scrollTo(scrollLeft, 0)
  }
}

onMounted(() => {
  new horizontalScroll(tabScrollbarRef.value)
})

</script>
<style scoped lang="scss">

.nav-tabs {
  position: fixed;
  top: v-bind('headerHeight');
  left: calc(v-bind('menuWidth') + var(--ba-main-space));
  height: var(--nav-tab-height);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-top: 1px solid #f6f6f6;

  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #eaeaea;
    border-radius: var(--el-border-radius-base);
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  &::-webkit-scrollbar-track {
    background: v-bind('config.layout.layoutMode == "Default" ? "none":config.getColorVal("headerBarBackground")');
  }
  &:hover {
    &::-webkit-scrollbar-thumb:hover {
      background: #c8c9cc;
    }
  }

  .ba-nav-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    cursor: pointer;
    height: calc(var(--nav-tab-height) - 12px);
    user-select: 0;
    z-index: 1;
    opacity: 0.7;
    border-radius: 2px;
    padding: 0 20px;
    color: v-bind('config.getColorVal("headerBarTabColor")');
    .close-icon {
      padding: 2px;
      margin: 2px 0 0 4px;
    }
    .close-icon:hover {
      background: var(--ba-color-primary-light);
      color: var(--el-border-color) !important;
      border-radius: 50%;
    }
    &.active {
      color: v-bind('config.getColorVal("headerBarTabActiveColor")');
    }
    &:hover {
      opacity: 1;
    }
  }
  .nav-tabs-active-box {
    position: absolute;
    height: calc(var(--nav-tab-height) - 12px);
    border-radius: var(--el-border-radius-base);
    background-color: v-bind('config.getColorVal("headerBarTabActiveBackground")');
    box-shadow: var(--el-box-shadow-lighter);
    transition: all 0.2s;
    -webkit-transition: all 0.2s;
  }
}
</style>
