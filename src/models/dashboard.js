import { getCurPowers } from 'utils'
import { queryComingLessons, queryTeacherStatInfo } from 'services/dashboard'

export default {
  namespace: 'dashboard',
  state: {
    comingLessons: [],
    teacherStatInfo: {},
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/' || pathname === '/dashboard') {
          const curPowers = getCurPowers('/dashboard')
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'queryComingLessons' })
            dispatch({ type: 'queryTeacherStatInfo' })
          }
        }
      })
    },
  },
  effects: {
    * queryComingLessons ({}, { call, put }) {
      const { data, success } = yield call(queryComingLessons)
      if (success) {
        yield put({
          type: 'queryComingLessonsSuccess',
          payload: {
            comingLessons: (data[0] && data[0].list) || [],
          },
        })
      }
    },
    * queryTeacherStatInfo ({ }, { call, put }) {
      const { data, success } = yield call(queryTeacherStatInfo)
      if (success) {
        yield put({
          type: 'queryTeacherStatInfoSuccess',
          payload: {
            teacherStatInfo: data,
          },
        })
      }
    },
  },
  reducers: {
    queryComingLessonsSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    queryTeacherStatInfoSuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
