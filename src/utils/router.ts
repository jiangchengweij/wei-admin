import type { AdminMenu } from "@/stores/interface";
import { i18n } from '/@/lang'
import { ElNotification } from 'element-plus'
import adminConfig from '@/admin.config'
import { isArray, isObject } from 'lodash-es'
import { isEmpty } from 'lodash-es'

/**
 * 导航失败有错误消息的路由push
 * @param to — 导航位置，同 uni.navigateTo
 */
export const routePush = (to: string) => {
  uni.redirectTo({
    url: to,
    fail(e) {
      ElNotification({
        message: i18n.global.t('utils.Navigation failed, invalid route!'),
        type: 'error',
      })
      uni.redirectTo({
        url: adminConfig.error.url
      })
    }
  })
}

export const onClickMenu = (menu: AdminMenu) => {
  routePush(menu.url)
}

export function addParams(path: string, params: JSONObj | string) {
  if(!isEmpty(params) && params) {
    try {
      let paramsStr: string = parseParams(params)
      let paramsArr: string[] = paramsStr.split('&')
      if(path.indexOf('?') !== -1 ) {
        let oldParamsArr = path.slice(0, path.indexOf('?')).split('&')
        oldParamsArr = oldParamsArr.filter((item) => !paramsArr.includes(item))
        paramsArr = paramsArr.concat(oldParamsArr)
      }
      return `${path}?${paramsArr.join('&')}`
    } catch(e) {  }
  }
  return path
}

export function parseParams(params: JSONObj | string) {
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

