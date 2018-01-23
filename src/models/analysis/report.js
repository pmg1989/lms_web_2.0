import moment from 'moment'
import { getCurPowers, getSchool } from 'utils'
import { queryTeacherReport, queryProTeacherReport, queryLessonCompleteReport } from 'services/analysis/report'

const page = {
  current: 1,
  pageSize: 10,
}

export default {
  namespace: 'analysisReport',
  state: {
    teacher: {
      searchQuery: {
        isPostBack: true,
        school: getSchool(),
        name: 'all',
        deadline: moment().subtract(1, 'month').endOf('month').format('X'),
      },
      list: [],
      pagination: {
        ...page,
        total: null,
      },
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/analysis/report') {
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
    * query ({ }, { select, put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({ type: 'commonModel/queryTeachers' })
      const { searchQuery } = yield select(({ analysisReport }) => analysisReport.teacher)
      yield put({
        type: 'queryTeacherReport',
        payload: searchQuery,
      })
    },
    * queryTeacherReport ({ payload }, { call, put }) {
      if (payload.isPostBack) {
        const { isPostBack, name, ...params } = payload
        const { data, success } = yield call(queryTeacherReport, params)
        if (success) {
          yield put({
            type: 'queryTeacherReportSuccess',
            payload: {
              list: data,
              pagination: {
                current: payload.current ? +payload.current : page.current,
                pageSize: payload.pageSize ? +payload.pageSize : page.pageSize,
                total: data.length,
              },
              searchQuery: payload,
            },
          })
        }
      }
    },
    * queryProTeacherReport ({ }, { call, put }) {
      const { data, success } = yield call(queryProTeacherReport, { deadline: '1517414400' })
      if (success) {
        yield put({
          type: 'queryProTeacherReportSuccess',
          payload: {
            list: data,
          },
        })
      }
    },
    * queryLessonCompleteReport ({ }, { call, put }) {
      const { data, success } = yield call(queryLessonCompleteReport, { deadline: '1517414400' })
      if (success) {
        yield put({
          type: 'queryLessonCompleteReportSuccess',
          payload: {
            list: data,
          },
        })
      }
    },
  },
  reducers: {
    queryTeacherReportSuccess (state, action) {
      return { ...state, teacher: action.payload }
    },
    queryProTeacherReportSuccess (state, action) {
      const { list } = action.payload
      return { ...state, teacher: { ...state.teacher, list } }
    },
    queryLessonCompleteReportSuccess (state, action) {
      const { list } = action.payload
      return { ...state, teacher: { ...state.teacher, list } }
    },
  },
}
