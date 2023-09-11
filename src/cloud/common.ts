import type { AdminMenu } from '@/stores/interface'
import { filter, isEmpty, omit, orderBy } from 'lodash-es'
import { db, useCloud } from './index'

export type ActionName = 'index' | 'add' | 'edit' | 'info' | 'del' | 'sortable' | string


/**
 * 生成一个控制器的：增、删、改、查、排序的操作db操作
 */
export class waTableRouter {
  private controllerUrl
  public actionUrl
  private cloud

  constructor(controllerUrl: string) {
    this.controllerUrl = controllerUrl
    this.actionUrl = new Map([
      ['index', controllerUrl + '/index'],
      ['add', controllerUrl + '/add'],
      ['detail', controllerUrl + '/detail'],
      ['edit', controllerUrl + '/edit'],
      ['del', controllerUrl + '/del'],
      ['sortable', controllerUrl + '/sortable'],
    ])
    this.cloud = useCloud()
  }


  index(filter: anyObj = {}) {
    return this.cloud.adminRouter(
      this.actionUrl.get('index')!,
      filter
    )
  }

  detail(params: anyObj) {
    return this.cloud.adminRouter(
      this.actionUrl.get('detail')!,
      params
    )
  }

  edit(params: anyObj) {
    return this.cloud.adminRouter(
      this.actionUrl.get('edit')!,
      params
    )
  }

  del(ids: string[]) {
    return this.cloud.adminRouter(
      this.actionUrl.get('del')!,
      ids
    )
  }

  postData(action: string, data: anyObj) {
    return this.cloud.adminRouter(
      this.actionUrl.has(action) ? this.actionUrl.get(action)! : this.controllerUrl + '/' + action,
      data
    )
  }

  sortableApi(id: number, targetId: number) {
    return this.cloud.adminRouter(
      this.actionUrl.get('sortable')!,
      {
        id,
        targetId
      }
    )
  }
}

export class WaTableDb {
  private waTable

  constructor(waTable: WaTable) {
    this.waTable = waTable
  }

  async index() {
    const res = await db.collection(this.waTable.collection!).get({
      getCount: true
    })
    return res
  }
}
