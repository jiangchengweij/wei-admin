import { useConfig } from "@/stores/config"
import type { CSSProperties } from "vue"

/**
 * main高度
 * @param extra main高度额外减去的px数,可以实现隐藏原有的滚动条
 * @returns CSSProperties
 */
export function mainHeight(extra = 0): CSSProperties {
  let height = extra
  const config = useConfig()
  height += config.layout.headerHeight
  if(config.layout.showNavTab && config.layout.navTab) {
    height += config.layout.navTabHeight
  }
  return {
    height: 'calc(100vh - ' + height.toString() + 'px)',
  }
}

/**
 * 设置导航栏宽度
 * @returns
 */
export function setNavTabsWidth() {
  const navTabs = document.querySelector('.nav-tabs') as HTMLElement
  if (!navTabs) {
    return
  }
  const navBar = document.querySelector('.nav-bar') as HTMLElement
  const navMenus = document.querySelector('.nav-menus') as HTMLElement
  const minWidth = navBar.offsetWidth - (navMenus.offsetWidth + 20)
  navTabs.style.width = minWidth.toString() + 'px'
}

export function setLayoutLogoWidth() {
  const layoutLogo = document.querySelector('.layout-logo') as HTMLElement
  if(!layoutLogo) {
    return
  }
  const navMenus = document.querySelector('.nav-menus') as HTMLElement
  console.log(navMenus.offsetWidth)
  layoutLogo.style.width = navMenus.offsetWidth + 'px'
}
