import type { Router } from 'vue-router'
import { isArray, isObject } from 'lodash-es'
import type { App } from 'vue'
import { loading } from '@/utils/loading'
import langAutoLoadMap from '/@/lang/autoload'
import { useConfig } from '/@/stores/config'
import { uniq } from 'lodash-es'
import { mergeMessage } from '/@/lang/index'

export const loginPath = '/pages/login'

export const homePath = '/pages/index/index'

export const loadingPath = '/pages/loading'

function initRouter(app: App) {
  app.config.globalProperties = new Proxy(app.config.globalProperties, {
    set: function (target, propKey, value, receiver) {
      if (propKey === '$router') {
        (value as Router).beforeEach((to, from, next) => {
          if (!window.existLoading) {
            loading.show()
            window.existLoading = true
          }

          if(to.fullPath !== loginPath) {
            uni.redirectTo({
              url: '/pages/login'
            })
            next()
            return
          }

          // 按需动态加载页面的语言包-start
          let loadPath: string[] = []
          const config = useConfig()
          if (to.path in langAutoLoadMap) {
            loadPath.push(...langAutoLoadMap[to.path as keyof typeof langAutoLoadMap])
          }
          let prefix = ''

          prefix = './backend/' + config.lang.defaultLang

          // 去除 path 中的 /pages
          const adminPath = to.path.slice(to.path.indexOf('/pages') + '/pages'.length)
          if (adminPath) loadPath.push(prefix + adminPath + '.ts')

          // 根据路由 name 加载的语言包
          if (to.name) {
            loadPath.push(prefix + '/' + to.name.toString() + '.ts')
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
