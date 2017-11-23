import { routerRedux } from 'dva/router'
import { getCurPowers } from 'utils'
import { create, update, query, queryItem, queryClassRooms } from 'services/account/admin'
// import { query as queryRole } from 'services/account/role'

const page = {
  current: 1,
  pageSize: 10,
}

export default {
  namespace: 'accountAdmin',
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
    * create ({ payload }, { call, put }) {
      const { data, success } = yield call(create, payload.curItem)
      if (success) {
        yield put({ type: 'modal/hideModal' })
        yield put({
          type: 'createSuccess',
          payload: { curItem: data },
        })
        yield put(routerRedux.push({
          pathname: location.pathname,
        }))
      }
    },
    * update ({ payload }, { call, put, select }) {
      const oldId = yield select(({ accountAdmin }) => accountAdmin.oldId)
      const { data, success } = yield call(update, payload.curItem)
      if (success) {
        yield put({ type: 'modal/hideModal' })
        yield put({
          type: 'updateSuccess',
          payload: { curItem: data, oldId },
        })
      }
    },
    * toggleResign ({ payload }, { call, put }) {
      const { curItem: { suspended, id } } = payload
      const { success } = yield call(update, {
        userid: id,
        suspended: suspended === 1 ? 0 : 1,
      })
      if (success) {
        yield put({
          type: 'toggleResignSuccess',
          payload: { id },
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

      const dataCR = yield call(queryClassRooms)
      if (dataCR.success) {
        newData.classRooms = dataCR.data
      }

      // const { data, success } = yield call(queryRole)
      // if (success) {
      //   newData.curItem.roleList = data
      // }
      yield put({ type: 'modal/setItem', payload: { curItem: newData } })
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    toggleResignSuccess (state, action) {
      const list = state.list.map(item => (item.id === action.payload.id ? { ...item, suspended: item.suspended === 1 ? 0 : 1 } : item))
      return { ...state, list }
    },
    setOldId (state, action) {
      return { ...state, ...action.payload }
    },
    updateSuccess (state, action) {
      const { curItem, oldId } = action.payload
      const list = state.list.map(item => (item.id === oldId ? curItem : item))
      return { ...state, list }
    },
    createSuccess (state, action) {
      return {
        ...state,
        list: [action.payload.curItem, ...state.list],
      }
    },
  },
}
