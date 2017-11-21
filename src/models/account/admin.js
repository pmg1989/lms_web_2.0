import { routerRedux } from 'dva/router'
import { getCurPowers } from 'utils'
import { create, remove, update, query, get } from 'services/account/admin'
import { query as queryRole } from 'services/account/role'

const page = {
  current: 1,
  pageSize: 10,
}

export default {
  namespace: 'accountAdmin',
  state: {
    isPostBack: true, // 判断是否是首次加载页面，作为前端分页判断标识符
    list: [],
    pagination: {
      ...page,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/account/admin') {
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
    * query ({}, { select, call, put }) {
      const isPostBack = yield select(({ accountAdmin }) => accountAdmin.isPostBack)
      const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)

      if (isPostBack) {
        const { data, success } = yield call(query, { rolename: 'teacher' })
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
    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload.id })
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    * create ({ payload }, { select, call, put }) {
      const data = yield call(create, payload.curItem)
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        const pathQuery = yield select(({ routing }) => routing.locationBeforeTransitions.query)
        const { current } = pathQuery
        yield put(routerRedux.push({
          pathname: location.pathname,
          query: current ? { ...pathQuery, current: 1 } : pathQuery,
        }))
      }
    },
    * update ({ payload }, { call, put }) {
      const data = yield call(update, payload.curItem)
      if (data && data.success) {
        yield put({ type: 'modal/hideModal' })
        yield put({ type: 'query' })
      }
    },
    * updateStatus ({ payload }, { call, put }) {
      const { curItem } = payload
      const data = yield call(update, { ...curItem, status: !curItem.status })
      if (data && data.success) {
        yield put({ type: 'query' })
      }
    },
    * showModal ({ payload }, { call, put }) {
      const { type, curItem } = payload
      let newData = { curItem: {} }

      yield put({ type: 'modal/showModal', payload: { type } })

      if (curItem) {
        const dataGet = yield call(get, { id: curItem.id })
        if (dataGet && dataGet.success) {
          newData.curItem = dataGet.data
        }
      }

      const dataRole = yield call(queryRole)
      if (dataRole && dataRole.success) {
        newData.curItem.roleList = dataRole.list
      }
      yield put({ type: 'modal/setItem', payload: newData })
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
