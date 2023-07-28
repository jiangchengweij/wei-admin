/**
 * 跳转参数
 * @property {string} url 跳转 url
 * @property {ExtendObject} query 跳转参数
 */
export interface RouteParams extends ExtendObject {
  url: string,
  delta?: number
  query?: ExtendObject
}

