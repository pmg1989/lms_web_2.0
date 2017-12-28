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
      console.log(lessonid)
      const { data, success } = yield call(query, { lessonid })
      if (success) {
        console.log(data)
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
