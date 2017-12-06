import { getCurPowers, renderQuery } from 'utils'
import { query, queryItem, update } from 'services/account/admin'
import { queryContractList, updateTeacher, queryHistoryList } from 'services/account/user'
import { query as querySchools } from 'services/common/school'

const page = {
  current: 1,
  pageSize: 3,
}

export default {
  namespace: 'accountUser',
  state: {
    isPostBack: true, // 判断是否是首次加载页面，作为前端分页判断标识符
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
        if (pathname === '/account/user') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'querySchools' })
            dispatch({ type: 'query', payload: { school: 'bj01' } })
          }
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { select, call, put }) {
      const { isPostBack, searchQuery } = yield select(({ accountUser }) => accountUser)
      console.log(searchQuery, payload)
      const querys = renderQuery(searchQuery, payload)
      console.log(querys)
      if (isPostBack) {
        // const { data, success } = yield call(query, { rolename: 'student', school: querys.school })
        const { data, success } = yield call(query, { rolename: 'student' })
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
        const { data, success } = yield call(queryItem, { userid: curItem.id })
        if (success) {
          newData = data
        }
      }
      const { data, success } = yield call(queryContractList, { userid: curItem.id })
      if (success) {
        newData.contractList = data
      }

      yield put({ type: 'modal/setItem', payload: { curItem: newData } })
    },
    * showTeacherModal ({ payload }, { call, put }) {
      const { type, id, contract } = payload

      yield put({ type: 'modal/showModal', payload: { type, id } })

      const { data, success } = yield call(query, { rolename: 'teacher' })
      if (success) {
        yield put({ type: 'modal/setSubItem', payload: { teacherList: data, contract } })
      }
    },
    * setTeacher ({ payload }, { call, put }) {
      const { curItem } = payload
      const { success } = yield call(updateTeacher, curItem)
      if (success) {
        yield put({ type: 'modal/hideModal', payload: { showParent: true } })
      }
    },
    * showHistoryListModal ({ payload }, { call, put }) {
      const { type, id, contract } = payload

      yield put({ type: 'modal/showModal', payload: { type, id } })

      const { data, success } = yield call(queryHistoryList, { contractid: contract.contractid })
      if (success) {
        yield put({ type: 'modal/setSubItem', payload: { historyList: data } })
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
    setOldId (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
