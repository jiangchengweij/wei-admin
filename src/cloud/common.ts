import type { AdminMenu } from '@/stores/interface'
import { filter, isEmpty, omit, orderBy } from 'lodash-es'
import { db, useCloud } from './index'

export type ActionName = 'index' | 'add' | 'edit' | 'info' | 'del' | 'sortable' | string

export interface RouterOptions {
  pk: string,
  controller?: string,
  action?: Record<keyof AdminMenu | string, string | Function>,
  collection?: string,
  field?: string,
  editField?: string,
  gettree?: boolean,
  getcount?: boolean,
  quickSearchField?: string | ((field: string) => string),
  pagination?: boolean,
  where?: string,
  orderby?: string,
}

/**
 * 生成一个控制器的：增、删、改、查、排序的操作db操作
 */
export class waTableRouter {
  private options
  private actionMap = new Map()
  private cloud

  constructor(options: RouterOptions) {
    this.options = Object.assign({}, {
      action: {},
      getcount: true,
      gettree: false,
      pagination: true
    }, options)
    this.cloud = useCloud()
  }

  _generateWhere(filter: anyObj = {}) {
    const whereArr: string[] = []
    if(!isEmpty(filter.quickSearch) && !isEmpty(this.options.quickSearchField)) {
      if (typeof this.options.quickSearchField === 'function') {
        whereArr.push(this.options.quickSearchField(filter.quickSearch))
      }
      whereArr.push(`/${filter.quickSearch}/.test(${this.options.quickSearchField})`)
    }
    if(!isEmpty(filter.search)) {
      let searchItem: {
        field: string,
        render: TableColumnRender,
        operator: OperatorStr,
        val: any
      }
      for(searchItem of filter.search) {
        if (['==', '!=', '>', '>=', '<', '<='].includes(searchItem.operator)) { // 等于，默认值
          whereArr.push(`${searchItem.field} ${searchItem.operator} ${searchItem.val}`)
          continue
        }
        const operatorName = searchItem.operator.toLowerCase()
        
        if (operatorName === 'like') {
          whereArr.push(`/${searchItem.val}/.test(${searchItem.field})`)
          continue
        }
        if(operatorName === 'range') {
          let rangeArr: (string | number)[] = searchItem.val.split(',')
          if(searchItem.render === 'datetime') {
            rangeArr = rangeArr.map((item) => new Date(item).getTime())
          }
          const tmpRangeWhere = []
          if(rangeArr.length > 0) {
            tmpRangeWhere.push(`${searchItem.field} >= ${rangeArr[0]}`)
          }
          if(rangeArr.length > 1) {
            tmpRangeWhere.push(`${searchItem.field} <= ${rangeArr[1]}`)
          }
          if(!isEmpty(tmpRangeWhere)) {
            whereArr.push(tmpRangeWhere.join(' && '))
          }
          continue
        }
        whereArr.push(`${searchItem.field} == ${searchItem.val}`)
      }
    }
    if(this.options.where && this.options.where != '') {
      return this.options.where + ' && ' + whereArr.join(' && ')
    }
    return whereArr.join(' && ')
  }

  _generateOrder(filter: anyObj = {}) {
    let sortArr: string[] = []
    //TODO 需要实现的排序列
    if (this.options.orderby && this.options.orderby != '') {
      return this.options.orderby + ' && ' + sortArr.join(' && ')
    }
    return sortArr.join(' && ')
  }

  async _callAction(actionName: string, params?: anyObj) {
    const actionItem = this.options.action[actionName]
    if (typeof actionItem === 'function') {
      return await actionItem.call(null, params)
    } else if(typeof actionItem === 'string') {
      if (actionItem.indexOf('/') > -1) {
        return await this.cloud.adminRouter(actionItem, params)
      } else {
        return await this.cloud.adminRouter(this.options.controller + '/' + actionItem, params)
      }
    }
    throw new Error('The '+actionName+' of action type is incorrect')
  }

  async index(filter: anyObj = {}) {
    if (this.options.action.index){
      return await this._callAction('index', filter)
    } else if(this.options.collection && this.options.collection != '') {
      let tmpCollection: UniCloud.Database | UniCloud.Query = db.collection(this.options.collection)
      const whereStr = this._generateWhere(filter)
      if (!isEmpty(whereStr)) {
        tmpCollection = tmpCollection.where(whereStr)
      }
      const orderbyStr = this._generateOrder(filter)
      if (!isEmpty(orderbyStr)) {
        //@ts-ignore
        tmpCollection = tmpCollection.orderBy(orderbyStr)
      }
      if (!isEmpty())
      if(this.options.pagination) {
        tmpCollection = tmpCollection
          .skip((filter.page - 1) * filter.limit)
          .limit(filter.limit)
      }
      const res = await tmpCollection
        .get({
          getCount: this.options.getcount,
          getTree: this.options.gettree
        })
      return { ...res, data: {
        list: res.data,
        total: res.count ? res.count : res.data.length,
        remark: null
      } }
    }
    throw new Error('action or collection name not set')
  }

  async edit(params: anyObj) {
    if (this.options.action.edit) {
      return await this._callAction('edit', params)
    } else if (this.options.collection && this.options.collection != ''){
      const curField = this.options.editField ? this.options.editField : this.options.field
      const { data } = await db.collection(this.options.collection)
        .where({ [this.options.pk]: params[this.options.pk] })
        .field(curField).get({
          getOne:true
        })
      return { data: { row: data } }
    }
    throw new Error('action or collection name not set')
  }

  async del(ids: string[]) {
    if (this.options.action['del']) {
      return await this._callAction('del', ids)
    } else if (this.options.collection && this.options.collection != '') {
      if (ids.length > 0) {
        return await db.collection(this.options.collection)
          .where({ [this.options.pk]: db.command.in(ids) })
          .remove()
      }
      return 0
    }
    throw new Error('action or collection name not set')
  }

  async postData(action: string, data: anyObj) {
    if (this.options.action['action']) {
      return await this._callAction(action, data)
    } else if(this.options.collection && this.options.collection != '') {
      if (action === 'add') {
        return await db.collection(this.options.collection).add(data)
      } else if(action === 'edit') {
        return await db.collection(this.options.collection)
          .where({ [this.options.pk]: data[this.options.pk] })
          .update(omit(data, [this.options.pk, '_id']))
      }
    }
    throw new Error('action or collection name not set')
  }

  async sortableApi(id: number, targetId: number) {
    return {}
    throw new Error('action or collection name not set')
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
