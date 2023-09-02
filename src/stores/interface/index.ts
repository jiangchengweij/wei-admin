import type { RouteLocationNormalized } from 'vue-router'

export interface AdminInfo {
  id: number
  username: string
  nickname: string
  last_login_date: string
  token: string | null,
  hasInitAdminInfo: boolean,
  role: string[]
  super: boolean
}

export interface Layout {
  showDrawer: boolean
  shrink: boolean
  layoutMode: string
  mainAnimation: string
  isDark: boolean
  menuDefaultIcon: string
  menuCollapse: boolean
  menuUniqueOpened: boolean
  menuShowTopBar: boolean
  menuBackground: string[]
  menuColor: string[]
  menuActiveBackground: string[]
  menuActiveColor: string[]
  menuWidth: number
  menuTopBarBackground: string[]
  headerBarTabColor: string[]
  headerBarBackground: string[]
  headerBarHoverBackground: string[]
  headerBarTabActiveBackground: string[]
  headerBarTabActiveColor: string[]
  headerHeight: number
  navTabHeight: number
  showNavTab: boolean,
  navTab: boolean
}

export interface AdminMenu {
  menu_id: string
  parent_id: string
  name: string
  url: string
  icon?: string
  sort: string
  children: AdminMenu[]
  path?: string
}

export interface NavTabs {
  activeTabIndex: number
  activeMenu: AdminMenu | null
  tabsView: AdminMenu[]
  tabFullScreen: boolean
  tabsViewRoutes: AdminMenu[]
  tabsViewsPathMap: Record<string, string>
  tabsViewMenuIdMap: Record<string, AdminMenu>
  authNode: Map<string, string[]>
}
