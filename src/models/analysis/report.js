import { getCurPowers } from 'utils'
import { queryTeacherReport, queryProTeacherReport, queryLessonCompleteReport } from 'services/analysis/report'

export default {
  namespace: 'analysisReport',
  state: {
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/analysis/report') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'queryTeacherReport' })
          }
        }
      })
    },
  },
  effects: {
    * queryTeacherReport ({ }, { call, put }) {
      const { data, success } = yield call(queryTeacherReport, { deadline: '1517414400' })
      if (success) {
        yield put({
          type: 'queryComingLessonsSuccess',
          payload: {
            comingLessons: (data[0] && data[0].list) || [],
          },
        })
      }
    },
    * queryProTeacherReport ({ }, { call, put }) {
      const { data, success } = yield call(queryProTeacherReport, { deadline: '1517414400' })
      if (success) {
        yield put({
          type: 'queryComingLessonsSuccess',
          payload: {
            comingLessons: (data[0] && data[0].list) || [],
          },
        })
      }
    },
    * queryLessonCompleteReport ({ }, { call, put }) {
      const { data, success } = yield call(queryLessonCompleteReport, { deadline: '1517414400' })
      if (success) {
        yield put({
          type: 'queryComingLessonsSuccess',
          payload: {
            comingLessons: (data[0] && data[0].list) || [],
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
