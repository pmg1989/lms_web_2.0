// import { getCurPowers } from 'utils'
import { query } from 'services/lesson/student'

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
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
