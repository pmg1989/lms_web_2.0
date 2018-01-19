import { getCurPowers, renderQuery, getSchool } from 'utils'
import { query, queryItem, update } from 'services/account/admin'
import { queryContractList, updateTeacher, queryHistoryList, queryContractLesson } from 'services/account/user'

const page = {
  current: 1,
  pageSize: 10,
}

export default {
  namespace: 'accountUser',
  state: {
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
        if (pathname === '/account/user') {
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
      const { searchQuery } = yield select(({ accountUser }) => accountUser)
      const { isPostBack, ...queryParams } = payload
      const querys = renderQuery(searchQuery, queryParams)
      if (isPostBack) {
        const { data, success } = yield call(query, { rolename: 'student', school: querys.school })
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
    * showTeacherModal ({ payload }, { call, put, select }) {
      const { type, id, contract } = payload

      yield put({ type: 'modal/showModal', payload: { type, id } })
      const { school } = yield select(({ modal }) => modal.curItem)
      const { data, success } = yield call(query, { rolename: 'teacher', school })
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
    * showContractLessonModal ({ payload }, { call, put }) {
      const { type, id, contract } = payload
      yield put({ type: 'modal/showModal', payload: { type, id } })

      const { data, success } = yield call(queryContractLesson, { ccid: contract.contractid, category_idnumber: contract.category_idnumber })
      if (success) {
        yield put({ type: 'modal/setSubItem', payload: { lessons: data.lessons } })
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    setOldId (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
