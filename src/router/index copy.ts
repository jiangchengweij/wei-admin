
import { cloneDeep, isArray, isFunction, isObject } from "lodash-es"

const INTERCEPTOR_API: string[] = [
  'navigateTo',
  'redirectTo',
  'reLaunch',
  'switchTab',
  'navigateBack',
  'preloadPage'
]

/**
 * 路由配置项
 * @property {string} homePage 首页path
 */
interface RouteOptions {
  homePage?: string
}

const getRealParams = function(params: any | string) {
  if (typeof params === 'string') return { url: params }
  if (!isObject(params)) throw new Error('The parameter of the route jump must be an object or a string')

  const data = cloneDeep(params)
  const query: Record<string, any> = data.query || {}

  delete data.query

  // 拼接处理路由的Query参数
  const arr: string[] = []
  Object.keys(query).forEach(key => {
    let val = query[key]
    if (val === undefined || val === null) val = ''
    if (isObject(val) || isArray(val)) {
      val = encodeURIComponent(JSON.stringify(val))
    }
    arr.push(`${key}=${val}`)
  })

  const search: string = arr.length > 0 ? `?${arr.join('&')}` : ''
  return {
    ...data,
    url: data.url + search
  }
}

class Router {

  maxlength: number = 5

  /**
   * 主页路由
   */
  homePage: string

  /**
   * 当前页面栈的实例数组
   */
  pages: any[]

  /**
   * 历史记录
   */
  history: any[]

  /**
   * 路由跳转前回调
  */
  private beforeEachCallback: Function | undefined

  /**
   * 路由跳转后回调
   */
  private afterEachCallback: Function | undefined

  /**
   * 路由跳转失败回调
   */
  private errorCallback: Function | undefined

  private _historyFunc: Function | undefined

  private isNativeMethod: boolean

  [key: string]: any

  constructor(options: RouteOptions | null) {
    this.homePage = options ? options.homePage || '/' : '/'

    this.pages = []
    this.history = []
    this.beforeEachCallback = undefined
    this.afterEachCallback = undefined
    this.errorCallback = undefined
    this.isNativeMethod = true

    this._addInterceptor()

    INTERCEPTOR_API.forEach(key => {
      this[key] = (params: string | number | undefined | RouteParams) => this._execMethod(key, params)
    })
  }

  public install(Vue: any): void {
    Vue.config.globalProperties.$Router = this
    this._initHistory()
  }

  private _execMethod(key: string, params: string | number | undefined | RouteParams) {
    this._historyFunc = undefined
    // @ts-ignore
    this.page = getCurrentPages()
    this.isNativeMethod = false

    if (key !== 'navigateBack') {
      if (!params) throw new Error(`the arguments of '${key}' is required`)
      if (typeof params === 'number') throw new Error(`the arguments of '${key}' cannot be a number`)

      const realParams: Object = getRealParams(params)
      console.log('exec params: ', realParams)

      if (key !== 'preloadPage') {
        this._historyFunc = () => this.history.push(realParams)
      }

      if (key === 'navigateTo') {
        if (this.pages.length >= this.maxlength) {
          // @ts-ignore
          uni.reLaunch(realParams)
        } else {
          // @ts-ignore
          uni.navigateTo(realParams)
        }
        return
      }

      // @ts-ignore
      uni[key](realParams)
      return
    }

    // 单独处理 navigateBack
    let delta: number
    if (!params || typeof params === 'string') delta = 1
    else if (typeof params === 'number') delta = params
    else delta = params.hasOwnProperty('delta') ? (params.delta || 1) : 1
    if (delta === 0) return

    const pagesLen = this.pages.length
    const len = this.history.length
    if (delta < pagesLen) {
      // 返回的页面数小于路由栈长度，通过页面栈进行判断跳转
      if (delta >= len) {
        this._historyFunc = () => this._initHistory()
      } else {
        this._historyFunc = () => this.history.splice(-delta)
      }
      const temp: any = isObject(params) ? params : { delta }
      // @ts-ignore
      uni.navigateBack(temp)
    } else {
      // 返回的页面数大于路由栈长度，则通过历史记录进行判断跳转
      if (delta >= len) {
        this._historyFunc = () => this._initHistory()
        // @ts-ignore
        uni.reLaunch(getRealParams(this.homePage))
      } else {
        const p = this.history[len - delta - 1]
        this._historyFunc = () => this.history.splice(-delta)
        // @ts-ignore
        uni.reLaunch(p)
      }
    }
  }

  private _execError(error: Error) {
    this.isNativeMethod = true
    // 执行失败后回调
    if (
      this.errorCallback &&
      isFunction(this.errorCallback)
    ) {
      this.errorCallback(error)
    }
    throw error
  }

  private _addInterceptor() {
    const _this = this
    let to: any, from: any

    INTERCEPTOR_API.forEach(method => {
      // @ts-ignore
      uni.addInterceptor(
        method,
        {
          async invoke(args: any) {
            if (_this.isNativeMethod) {
              _this._execMethod(method, args)
              return
            }
          },
          success() {
            
          },
          fail(error: Error) {

          }
        }
      )
    })
  }

  private _getFrom() {
    // @ts-ignore
    this.pages = getCurrentPages()
    const len = this.pages.length
    if (len === 0) return null
    // @ts-ignore
    const vm = getCurrentPages()[len - 1]
    if (!vm) return
    return {
      url: vm.route,
      // @ts-ignore
      query: vm.options
    }
  }

  private _getTo(args: any) {
    let to: any = {}

    Object.keys(args).forEach(key => {
      if (!['success', 'fail', 'delta'].includes(key)) {
        to[key] = args[key]
      }
    })

    if (args.hasOwnProperty('delta')) {
      // @ts-ignore
      this.pages = getCurrentPages()
      const len = this.pages.length
      if (args.delta < len) {
        const vm = this.pages[len - args.delta - 1]
        to = {
          ...to,
          ...getRealParams({
            url: vm.route,
            query: vm.options
          })
        }
      } else {
        to = {
          ...to,
          // @ts-ignore
          ...deepCopy(this.history[this.history.length - 1 - args.delta])
        }
      }
    }

    return to
  }

  private _initHistory() {
    this.history = []
    // @ts-ignore
    const vm = getCurrentPages()[0]
    if (!vm) return

    this.history.push(getRealParams({
      // @ts-ignore
      url: vm.route,
      // @ts-ignore
      query: vm.options
    }))
  }
}

export default Router
