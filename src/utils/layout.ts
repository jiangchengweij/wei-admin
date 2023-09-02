
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
