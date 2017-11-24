import { getCurPowers } from 'utils'
import { query, queryItem, update } from 'services/account/admin'

const page = {
  current: 1,
  pageSize: 10,
}

export default {
  namespace: 'accountUser',
  state: {
    isPostBack: true, // 判断是否是首次加载页面，作为前端分页判断标识符
    curId: '', // 存储获取列表时的id, 因为在修改信息获取详细数据时id会变
    list: [],
    pagination: {
      ...page,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/account/user') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'query' })
          }
        }
      })
    },
  },

  effects: {
    * query ({ }, { select, call, put }) {
      const isPostBack = yield select(({ accountUser }) => accountUser.isPostBack)
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)

      if (isPostBack) {
        const { data, success } = yield call(query, { rolename: 'student' })
        if (success) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data,
              pagination: {
                current: pathQuery.current ? +pathQuery.current : page.current,
                pageSize: pathQuery.pageSize ? +pathQuery.pageSize : page.pageSize,
                total: data.length,
              },
              isPostBack: false,
            },
          })
        }
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              current: pathQuery.current ? +pathQuery.current : page.current,
              pageSize: pathQuery.pageSize ? +pathQuery.pageSize : page.pageSize,
            },
          },
        })
      }
    },
    * update ({ payload }, { call, put, select }) {
      const oldId = yield select(({ accountUser }) => accountUser.oldId)
      const { data, success } = yield call(update, payload.curItem)
      if (success) {
        yield put({ type: 'modal/hideModal' })
        yield put({
          type: 'updateSuccess',
          payload: { curItem: data, oldId },
        })
      }
    },
    * showModal ({ payload }, { call, put }) {
      const { type, curItem } = payload
      let newData = {}

      yield put({ type: 'modal/showModal', payload: { type } })

      if (curItem) {
        yield put({ type: 'setOldId', payload: { oldId: curItem.id } })
        const { data, success } = yield call(queryItem, { userid: curItem.id })
        if (success) {
          newData = data
        }
      }

      yield put({ type: 'modal/setItem', payload: { curItem: newData } })
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    setOldId (state, action) {
      return { ...state, ...action.payload }
    },
    updateSuccess (state, action) {
      const { curItem, oldId } = action.payload
      const list = state.list.map(item => (item.id === oldId ? { ...item, ...curItem } : item))
      return { ...state, list }
    },
  },
}
