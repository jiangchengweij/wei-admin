import type { Cloud } from './interface'

const db = uniCloud.databaseForJQL()

async function CallFun(this:{ fun: Function }, data: unknown) {
  try {
    const res = await this.fun(data)
    return res
  } catch(e) {
    errroHandle(e as UniCloud.UniError)
  }
}
export function useCloud() {
  const cacheCoInsMap = {}
  const cloudProxy = new Proxy<Cloud>(cacheCoInsMap, {
    get(target, propKey: string, _receiver) {
      const key = kebabCase(propKey as string)
      if(key.endsWith('-db')) {
        return db
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
      } else {
        const fun = (data) => {
          
        }
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
  
}
