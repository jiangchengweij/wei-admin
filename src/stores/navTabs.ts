import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { AdminMenu, NavTabs } from './interface'
import type { RouteLocationNormalized } from 'vue-router'
import { findIndex } from 'lodash-es'
import { addParams } from '@/utils/router'

export const useNavTabs = defineStore(
  'navTabs',
  () => {
    const state: NavTabs = reactive({
      // 激活tab的index
      activeTabIndex: 0,
      // 激活的tab
      activeMenu: null,
      // tab列表
      tabsView: [],
      // 当前tab是否全屏
      tabFullScreen: false,
      // 从后台加载到的菜单路由列表
      tabsViewRoutes: [],
      // path对应的路由Id
      tabsViewsPathMap: {},
      // menuId建立的路由映射
      tabsViewMenuIdMap: {},
      // 按钮权限节点
      authNode: new Map(),
    })

    function addTab(route: RouteLocationNormalized) {
      if(state.tabsViewsPathMap[route.path]) {
        const curMenu = state.tabsViewMenuIdMap[state.tabsViewsPathMap[route.path]]
        for (const key in state.tabsView) {
          if (state.tabsView[key].menu_id === curMenu.menu_id) {
            state.tabsView[key].url = addParams(curMenu.url, route.params)
            return
          }
        }
        state.tabsView.push({...curMenu})
      }
    }

    function closeTab(menu: AdminMenu) {
      if(menu.menu_id) {
        let index = -1
        if((index = findIndex(state.tabsView, (item) => item.menu_id === menu.menu_id)) >= 0) {
          state.tabsView.splice(index, 1)
        }
      }
    }

    /**
     * 关闭多个标签
     * @param retainMenu 需要保留的标签，否则关闭全部标签
     */
    function closeTabs(retainMenu: AdminMenu | false = false) {
      if (retainMenu) {
        state.tabsView = [retainMenu]
      } else {
        state.tabsView = []
      }
    }

    const setActiveMenu = (route: RouteLocationNormalized) => {
      if(state.tabsViewsPathMap[route.path]) {
        state.activeMenu = state.tabsViewMenuIdMap[state.tabsViewsPathMap[route.path]]
      }
    }

    const setTabsViewRoutes = (data: AdminMenu[]): void => {
      state.tabsViewRoutes = data.map((item) => {
        item.path = item.url.indexOf('?') != -1 ? item.url.slice(0, item.url.indexOf('?')) : item.url
        return item
      })
      const tmpPathMap: Record<string, string> = {}
      const menuIdMap: Record<string, AdminMenu> = {}
      state.tabsViewRoutes.forEach((route) => {
        if(route.path && route.path !== '') {
          tmpPathMap[route.path] = route.menu_id
        }
        menuIdMap[route.menu_id] = route
      })
      state.tabsViewsPathMap = tmpPathMap
      state.tabsViewMenuIdMap = menuIdMap
    }
    return { addTab, closeTab, closeTabs, state, setTabsViewRoutes, setActiveMenu }
  }
)
