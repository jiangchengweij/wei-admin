import { reactive, watch, withDefaults, defineProps } from "vue"
import { db as dbJQL } from './index'

export interface DatacomProps {
  collection?: string,
  action?: string,
  field?: string,
  orderby?: string,
  where?: string,
  pageData?: string,
  pageCurrent?: number,
  pageSize?: number,
  getcount?: boolean | string,
  gettree?: boolean | string,
  gettreepath?: boolean | string,
  startwidth?: string
  limitlevel?: string
  groupby?: string,
  groupField?: string,
  startwith?: string
  distinct?: string | boolean,
  manual?: boolean
}

export const datacomProps: DatacomProps = {
  collection: '',
  action: '',
  field: '',
  orderby: '',
  where: '',
  pageCurrent: 1,
  pageSize: 20,
  getcount: false,
  gettree: false,
  gettreepath: false,
  startwidth: '',
  groupby: '',
  groupField: '',
  startwith: '',
  distinct: '',
  manual: false
}

type ChangeOption = 
'pageCurrent' | 'pageSize' | 'localdata' | 'collection' | 'action' | 'field' | 'orderby'
| 'where' | 'getont' | 'getcount' | 'gettree'

export function useDatacom({ props = datacomProps, onMixinDatacomPropsChange = (needReset: boolean, changed: ChangeOption[]) => {} }: {
  props: DatacomProps
  onMixinDatacomPropsChange?: (needReset: boolean, changed: ChangeOption[]) => void
}) {
  const state = reactive({
    mixinDatacomLoading: false, // 网络请求状态
    mixinDatacomHasMore: false, // 是否有更多数据
    mixinDatacomResData: [], // 请求返回的数据，调用 loadData 后会更新
    mixinDatacomErrorMessage: '', // 请求出错时的错误消息
    mixinDatacomPage: {
      current: props.pageCurrent,
      size: props.pageSize,
      count: 0
    } // 分页信息，详情见 created 生命周期
  })

  watch(
  () => ['pageCurrent','pageSize','localdata','collection','action','field','orderby','where','getont','getcount','gettree'] 
  ,(newValue, oldValue) => {
    let needReset = false
    let changed: ChangeOption[] = []
    for (let i = 2; i < newValue.length; i++) {
      if (newValue[i] !== oldValue[i]) {
        needReset = true
        changed.push(newValue[i] as ChangeOption)
      }
      if (newValue[i] !== oldValue[0]) {
        state.mixinDatacomPage.current = props.pageCurrent
      }
      state.mixinDatacomPage.size = props.pageSize
      onMixinDatacomPropsChange(needReset, changed)
    }
  })

  const mixinDatacomEasyGet = ({
    getone = false,
    success = (res: anyObj) => {},
    fail = (res: anyObj) => {}
  } = {}): void => {
    if (state.mixinDatacomLoading) {
      return
    }
    state.mixinDatacomLoading = true

    state.mixinDatacomErrorMessage = ''

    mixinDatacomGet().then((res) => {
      state.mixinDatacomLoading = false
      const {
        data,
        count
      } = res
      if (props.getcount) {
        state.mixinDatacomPage.count = count
      }
      state.mixinDatacomHasMore = data.length < (props.pageSize || 0)
      const responseData = getone ? (data.length ? data[0] : undefined) : data
      state.mixinDatacomResData = responseData
      if (success) {
        success(responseData)
      }
    }).catch(err => {
      state.mixinDatacomLoading = false
      state.mixinDatacomErrorMessage = err
      fail && fail(err)
    })
  }

  const mixinDatacomGet = (options: DatacomProps = {}): Promise<anyObj> => {
    let db: anyObj = dbJQL

    const action = options.action || props.action
    if (action) {
      db = db.action(action)
    }

    const collection = options.collection || props.collection
    db = db.collection(collection!)

    const where = options.where || props.where
    if (!(!where || !Object.keys(where).length)) {
      db = db.where(where)
    }

    const field = options.field || props.field

    if (field) {
      db = db.field(field)
    }

    const groupby = options.groupby || props.groupby
    if (groupby) {
      db = db.groupBy(groupby)
    }

    const groupField = options.groupField || props.groupField
    if (groupField) {
      db = db.groupField(groupField)
    }

    const distinct = options.distinct !== undefined ? options.distinct : props.distinct
    if (distinct === true) {
      db = db.distinct()
    }

    const orderby = options.orderby || props.orderby
    if (orderby) {
      db = db.orderBy(orderby)
    }

    const current = options.pageCurrent !== undefined ? options.pageCurrent : state.mixinDatacomPage.current
    const size = options.pageSize !== undefined ? options.pageSize : state.mixinDatacomPage.size
    const getCount = options.getcount !== undefined ? options.getcount : props.getcount
    const gettree = options.gettree !== undefined ? options.gettree : props.gettree
    const gettreepath = options.gettreepath !== undefined ? options.gettreepath : props.gettreepath
    const limitLevel = options.limitlevel !== undefined ? options.limitlevel : props.limitlevel
    const startWith = options.startwith !== undefined ? options.startwith : props.startwith

    const getOptions: anyObj = {
      getCount
    }
    const treeOptions = {
      limitLevel,
      startWith
    }
    if (gettree) {
      getOptions.getTree = treeOptions
    }
    if (gettreepath) {
      getOptions.getTreePath = treeOptions
    }

    db = db.skip(size! * (current! - 1)).limit(size).get(getOptions)

    return db as Promise<anyObj>
  }

  return { mixinDatacomEasyGet, mixinDatacomGet }
}
