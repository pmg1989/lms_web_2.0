import moment from 'moment'
import { getCurPowers, getSchool } from 'utils'
import { queryTeacherReport, queryProTeacherReport, queryLessonCompleteReport } from 'services/analysis/report'

const page = {
  current: 1,
  pageSize: 10,
}

const searchTeacherQuery = {
  isPostBack: true,
  school: getSchool(),
  name: 'all',
  deadline: moment().subtract(1, 'month').endOf('month').format('X'),
}

export default {
  namespace: 'analysisReport',
  state: {
    teacher: {
      searchQuery: searchTeacherQuery,
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
    * query ({ }, { put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({
        type: 'queryTeacherReport',
        payload: searchTeacherQuery,
      })
    },
    * queryTeacherReport ({ payload }, { call, put }) {
      if (payload.isPostBack) {
        const { data, success } = yield call(queryTeacherReport, { school: payload.school, deadline: payload.deadline })
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
      } else {
        yield put({
          type: 'setTeacherReportSuccess',
          payload: {
            pagination: {
              current: payload.current ? +payload.current : page.current,
              pageSize: payload.pageSize ? +payload.pageSize : page.pageSize,
            },
            searchQuery: payload,
          },
        })
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
    setTeacherReportSuccess (state, action) {
      const { list } = state.teacher
      return { ...state, teacher: { list, ...action.payload } }
    },
    queryProTeacherReportSuccess (state, action) {
      return { ...state, teacher: action.payload }
    },
    queryLessonCompleteReportSuccess (state, action) {
      return { ...state, teacher: action.payload }
    },
  },
}
