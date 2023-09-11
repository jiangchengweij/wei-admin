import type { Router } from 'vue-router'
import { isArray, isObject } from 'lodash-es'
import type { App } from 'vue'
import { loading } from '@/utils/loading'
import langAutoLoadMap from '/@/lang/autoload'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useConfig } from '/@/stores/config'
import { uniq } from 'lodash-es'
import { mergeMessage } from '/@/lang/index'
import { useAdminInfo } from '@/stores/adminInfo'
import { useNavTabs } from '@/stores/navTabs'
import adminConfig from '@/admin.config'
import { addParams, routePush } from '@/utils/router'

const loginPath = adminConfig?.login?.url
const notFountPath = adminConfig?.error?.url
const homePath = adminConfig?.index.url

function initRouter(app: App) {
  app.config.globalProperties = new Proxy(app.config.globalProperties, {
    set: function (target, propKey, value, receiver) {
      if (propKey === '$router') {
        (value as Router).beforeEach(async (to, from, next) => {
          NProgress.configure({ showSpinner: false })
          NProgress.start()
          if (!window.existLoading) {
            loading.show()
            window.existLoading = true
          }
          //如果没有配置登录页面无需鉴权拦截
          if(loginPath) {
            const adminInfo = useAdminInfo()
            let hasLogin = false
            if(!!adminInfo.getToken()) {
              hasLogin = true
            }
            if(to.path === loginPath && hasLogin) { //进入登录界面判断是否登录，如果已经登录，则阻止进入登录页面
              next({ path: homePath || '/' })
              return
            }
            const redirectLogin = () => {
              let url = loginPath
              if(to.path && to.path !== '/') {
                url = addParams(url, { ...to.params, redirect: to.path })
              }
              routePush(url)
            }
            if(to.path !== loginPath && !hasLogin) {
              redirectLogin()
              next()
              return;
            }
            if(to.path !== loginPath) {
              //是否需要获取初始化信息
              if(!adminInfo.hasInitAdminInfo) {
                try {
                  await adminInfo.initAdminInfo()
                } catch(e) { //获取信息失败,重新登录
                  redirectLogin()
                  next()
                  return;
                }
              }
              const navTabs = useNavTabs()
              navTabs.setActiveMenu(to)
            }
          }

          const config = useConfig()

          if(to.path === loginPath) {
            config.layout.showNavTab = false
          } else {
            config.layout.showNavTab = true
          }

          // 按需动态加载页面的语言包-start
          let loadPath: string[] = []
          
          // if (to.path in langAutoLoadMap) {
          //   loadPath.push(...langAutoLoadMap[to.path as keyof typeof langAutoLoadMap])
          // }
          let prefix = ''

          prefix = './admin/' + config.lang.defaultLang
          
          // 去除 path 中的 /pages
          let adminPath = to.path.slice(to.path.indexOf('/pages') + '/pages'.length)
          if (adminPath) {
            //去除后缀index
            if(/(\/index)$/.test(adminPath)) {
              adminPath = adminPath.slice(0, adminPath.indexOf('/index'))
            }
            loadPath.push(prefix + adminPath + '.ts')
          }

          if (!window.loadLangHandle.publicMessageLoaded) window.loadLangHandle.publicMessageLoaded = []
          const publicMessagePath = prefix + '.ts'
          if (!window.loadLangHandle.publicMessageLoaded.includes(publicMessagePath)) {
            loadPath.push(publicMessagePath)
            window.loadLangHandle.publicMessageLoaded.push(publicMessagePath)
          }
          
          // 去重
          loadPath = uniq(loadPath)

          for (const key in loadPath) {
            loadPath[key] = loadPath[key].replaceAll('${lang}', config.lang.defaultLang)
            
            if (loadPath[key] in window.loadLangHandle) {
              window.loadLangHandle[loadPath[key]]().then((res: { default: anyObj }) => {
                const pathName = loadPath[key].slice(loadPath[key].lastIndexOf(prefix) + (prefix.length + 1), loadPath[key].lastIndexOf('.'))
                mergeMessage(res.default, pathName)
              })
            }
          }
          // 动态加载语言包-end
          next()
        })
        value.afterEach(() => {
          if (window.existLoading) {
            loading.hide()
          }
          NProgress.done()
        })
      }
      return Reflect.set(target, propKey, value, receiver)
    },
  })
}

type addParamQuery<Fun> = Fun extends (params: infer Params) => unknown ? (params: Params & { query?: JSONObj | string }) => unknown : never

const ROUTERAPI = ['navigateTo', 'redirectTo', 'reLaunch', 'navigateBack', 'preloadPage'] as const

type RouterFunType = {
  navigateTo: addParamQuery<typeof uni.navigateTo>
  redirectTo: addParamQuery<typeof uni.redirectTo>
  navigateBack: typeof uni.navigateBack
  reLaunch: addParamQuery<typeof uni.reLaunch>
  preloadPage: addParamQuery<typeof uni.preloadPage>
}

type RouterKey = keyof RouterFunType

interface RouteParams {
  url?: string
  query?: JSONObj
  delta?: number
}

export function useRouter(): RouterFunType {
  const navMethod = (key: RouterKey) => {
    return (params: RouteParams) => {
      if (key === 'navigateBack') {
        return uni[key](params)
      }
      params.url = params.query ? params.url + '?' + parseParams(params.query) : params.url
      delete params.query
      const func = uni[key] as (params: RouteParams) => any
      return func(params)
    }
  }
  const obj: any = {}
  ROUTERAPI.forEach((key) => {
    obj[key] = navMethod(key)
  })
  return {
    ...obj,
  }
}

function parseParams(params: JSONObj | string) {
  if (typeof params === 'string') return params
  const arr: string[] = []
  if (!isObject(params)) throw new Error('The parameter of the route jump must be an object or a string')
  Object.keys(params).forEach((key) => {
    let val = params[key]
    if (!val) val = ''
    if (isObject(val) || isArray(val)) {
      val = encodeURIComponent(JSON.stringify(val))
    }
    arr.push(`${key}=${val}`)
  })
  return arr.join('&')
}

export default initRouter
