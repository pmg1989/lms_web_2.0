import { routerRedux } from 'dva/router'
import { getCurPowers, renderQuery, getSchool } from 'utils'
import { create, update, query, queryItem, updateLevel, updateCancelLevel, resetPassword } from 'services/account/admin'
import { query as queryClassRooms } from 'services/common/classroom'
import { message } from 'antd'
import { initPassowrd } from 'utils/config'

const page = {
  current: 1,
  pageSize: 10,
}

export default {
  namespace: 'accountAdmin',
  state: {
    curId: '', // 存储获取列表时的id, 因为在修改信息获取详细数据时id会变
    searchQuery: {},
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
            dispatch({ type: 'querySchools' })
            dispatch({ type: 'query', payload: { isPostBack: true, school: getSchool() } })
          }
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { select, call, put }) {
      const { searchQuery } = yield select(({ accountAdmin }) => accountAdmin)
      const { isPostBack, ...queryParams } = payload
      const querys = renderQuery(searchQuery, queryParams)
      if (isPostBack) {
        const { user } = yield select(({ app }) => app)
        if (user.rolename === 'hr') {
          querys.rolename = 'teacher'
        }
        const { data, success } = yield call(query, { rolename: querys.rolename || 'staff', school: querys.school })
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
    * querySchools ({ }, { put }) {
      yield put({ type: 'commonModel/querySchools' })
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
        id,
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

      if (curItem.id) {
        yield put({ type: 'setOldId', payload: { oldId: curItem.id } })
        const { data, success } = yield call(queryItem, { userid: curItem.id })
        if (success) {
          newData = data
        }
      }
      // 新增或者 角色为老师时需要获取教室列表（新增时为获取所有）
      if (type === 'create' || newData.rolename === 'teacher') {
        const dataCR = yield call(queryClassRooms, { school_id: curItem.school_id })
        if (dataCR.success) {
          newData.classRooms = dataCR.data.reduce((dic, item) => {
            if (!dic[item.school_id]) {
              dic[item.school_id] = [item]
            } else {
              dic[item.school_id].push(item)
            }
            return dic
          }, {})
        }
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
    * resetPassword ({ payload }, { call }) {
      const { success } = yield call(resetPassword, payload.params)
      if (success) {
        message.success(`密码重置成功，重置后的密码为${initPassowrd}`, 6)
      }
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
