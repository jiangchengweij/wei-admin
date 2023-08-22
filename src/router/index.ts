import type { Router } from 'vue-router'
import { isArray, isObject } from "lodash-es"
import type { App } from 'vue'

function initRouter(app: App) {
  app.config.globalProperties = new Proxy(app.config.globalProperties, {
    set: function (target, propKey, value, receiver) {
      if(propKey === '$router') {
        (value as Router).beforeEach((to, from, next) => {
          console.log(to)
          next()
        })
      }
      return Reflect.set(target, propKey, value, receiver);
    }
  })
}

type addParamQuery<Fun> = Fun extends (params: infer Params) => unknown
  ? (params: Params & { query?: JSONObj | string }) => unknown : never

const ROUTERAPI = [
  'navigateTo',
  'redirectTo',
  'reLaunch',
  'navigateBack',
  'preloadPage'
] as const

type RouterFunType = {
  navigateTo: addParamQuery<typeof uni.navigateTo>,
  redirectTo: addParamQuery<typeof uni.redirectTo>
  navigateBack: typeof uni.navigateBack
  reLaunch: addParamQuery<typeof uni.reLaunch>,
  preloadPage: addParamQuery<typeof uni.preloadPage>
}

type RouterKey = keyof RouterFunType

interface RouteParams {
  url?: string,
  query?: JSONObj,
  delta?: number
}

export function useRouter(): RouterFunType {
  const navMethod = (key: RouterKey) => {
    return (params: RouteParams) => {
      if(key === 'navigateBack') {
        return uni[key](params)
      }
      params.url = params.query ? params.url + '?' + parseParams(params.query) : params.url
      delete params.query
      const func = uni[key] as (params: RouteParams) => any
      return func(params)
    }
  }
  const obj: any = {};
  ROUTERAPI.forEach(key => {
    obj[key] = navMethod(key)
  })
  return {
    ...obj
  }
}

function parseParams(
  params: JSONObj | string) {
  if(typeof params === 'string') return params
  const arr: string[] = []
  if(!isObject(params)) throw new Error('The parameter of the route jump must be an object or a string')
  Object.keys(params).forEach(key => {
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
