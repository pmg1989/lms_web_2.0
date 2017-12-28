// import { getCurPowers } from 'utils'
import { query, attendance } from 'services/lesson/student'

export default {
  namespace: 'lessonStudent',
  state: {
    list: [],
  },

  subscriptions: {
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const { lessonid } = payload
      const { data, success } = yield call(query, { lessonid })
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data,
          },
        })
      }
    },
    * attendance ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(attendance, params)
      if (success) {
        yield put({
          type: 'attendanceSuccess',
          payload: {
          },
        })
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    attendanceSuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
