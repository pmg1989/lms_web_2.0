import { routerRedux } from 'dva/router'
import { getCurPowers, renderQuery, getSchool } from 'utils'
import { create, update, query, queryItem, updateLevel, updateCancelLevel } from 'services/account/admin'
// import { query as queryRole } from 'services/account/role'
import { query as querySchools } from 'services/common/school'
import { query as queryClassRooms } from 'services/common/classroom'

const page = {
  current: 1,
  pageSize: 10,
}

export default {
  namespace: 'accountAdmin',
  state: {
    isPostBack: true, // 判断是否是首次加载页面，作为前端分页判断标识符
    curId: '', // 存储获取列表时的id, 因为在修改信息获取详细数据时id会变
    searchQuery: {},
    list: [],
    schools: [],
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
            dispatch({ type: 'querySchools' })
            dispatch({ type: 'query', payload: { school: getSchool() } })
          }
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { select, call, put }) {
      const { isPostBack, searchQuery } = yield select(({ accountAdmin }) => accountAdmin)
      const querys = renderQuery(searchQuery, payload)

      if (isPostBack || payload.school !== searchQuery.school) {
        const { data, success } = yield call(query, { rolename: 'staff', school: querys.school })
        if (success) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data,
              pagination: {
                current: payload.current ? +payload.current : page.current,
                pageSize: payload.pageSize ? +payload.pageSize : page.pageSize,
                total: data.length,
              },
              isPostBack: false,
              searchQuery: querys,
            },
          })
        }
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              current: payload.current ? +payload.current : page.current,
              pageSize: payload.pageSize ? +payload.pageSize : page.pageSize,
            },
            searchQuery: querys,
          },
        })
      }
    },
    * querySchools ({ }, { call, put }) {
      const { data, success } = yield call(querySchools)
      if (success) {
        yield put({
          type: 'querySchoolsSuccess',
          payload: {
            schools: data,
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

      const dataCR = yield call(queryClassRooms, { school_id: curItem.school_id })
      if (dataCR.success) {
        newData.classRooms = dataCR.data
      }

      // const dataRole = yield call(queryRole)
      // if (dataRole.success) {
      //   newData.roleList = dataRole.list
      // }
      yield put({ type: 'modal/setItem', payload: { curItem: newData } })
    },
    * showLeaveModal ({ payload }, { put }) {
      const { type, curItem } = payload
      yield put({ type: 'modal/showModal', payload: { type, curItem, id: 2 } })
      yield put({ type: 'setOldId', payload: { oldId: curItem.id } })
    },
    * levelTeacher ({ payload }, { call, put, select }) {
      const { curItem } = payload
      const { data, success } = yield call(updateLevel, { ...curItem })
      if (success) {
        const oldId = yield select(({ accountAdmin }) => accountAdmin.oldId)
        yield put({ type: 'modal/hideModal' })
        yield put({
          type: 'updateSuccess',
          payload: { curItem: data, oldId },
        })
      }
    },
    * cancelLevelTeacher ({ payload }, { call, put }) {
      const { curItem: { id } } = payload
      const { data, success } = yield call(updateCancelLevel, { userid: id })
      if (success) {
        yield put({ type: 'modal/hideModal' })
        yield put({
          type: 'updateSuccess',
          payload: { curItem: data, oldId: id },
        })
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    querySchoolsSuccess (state, action) {
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
      const list = state.list.map(item => (item.id === oldId ? { ...item, ...curItem } : item))
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
