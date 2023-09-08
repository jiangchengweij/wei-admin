import type { Cloud } from './interface'
import { ElNotification } from 'element-plus'

export const db = uniCloud.databaseForJQL()

async function CallFun(this:{ fun: Function }, data: unknown) {
  let error = null
  try {
    const res = await this.fun(data)
    let resData = res.result ? res.result : res
    if (!resData.errCode || resData.errCode === 0) {
      return resData
    }
    error = res
  } catch(e) {
    error = e
  }
  errroHandle(error as UniCloud.UniError)
  throw error
}

function CallRouterFn(this:{ fun: Function }, action: string, data: unknown) {
  return CallFun.call(this, { action, data })
}

export function useCloud() {
  const cacheCoInsMap: any = {}
  const cloudProxy = new Proxy<Cloud>(cacheCoInsMap, {
    get(target, propKey: string, _receiver) {
      const key = kebabCase(propKey as string)
      if(key.endsWith('-cf')) {
        const genGun = (name: string) => {
          return async function(data: anyObj) {
            return await uniCloud.callFunction({ name, data })
          }
        }
        return CallFun.bind({ fun: genGun(key) })
      } else if(key.endsWith('-co')) {
        if(!target[propKey]) {
          const uniCoIns = uniCloud.importObject(key, {
            customUI: true
          })
          target[propKey] = new Proxy(uniCoIns, {
            get(target, propKey, _receiver) {
              return CallFun.bind({ fun: target[propKey] })
            }
          })
        }
        return target[propKey]
      } else if(key.endsWith('-router')) {
        const routerFn = (name: string) => {
          return async function (data: anyObj) {
            return await uniCloud.callFunction({ name, data })
          }
        }
        return CallRouterFn.bind({ fun: routerFn(key) })
      } else {
        return db
      }
    }
  })
  
  return cloudProxy
}

db.on('error', errroHandle)

function kebabCase(word: string) {
  return word.replace(/[A-Z]/g, (k) => '-' + k).toLowerCase()
}

function errroHandle(e: UniCloud.UniError) {
  ElNotification({
    message: e.errMsg || '未知错误',
    type: 'error'
  })
}
