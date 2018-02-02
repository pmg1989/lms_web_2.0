import moment from 'moment'
import { getCurPowers } from 'utils'
import {
  queryTeacherReport, queryLessonCompleteReport, queryProTeacherReport,
  exportTeacherReport, exportLessonCompleteReport, exportProTeacherReport,
} from 'services/analysis/report'

const page = {
  current: 1,
  pageSize: 10,
}

const searchTeacherQuery = {
  isPostBack: true,
  school: 'sh01',
  name: 'all',
  deadline: moment().endOf('month').format('X'),
}

const lessonCompleteQuery = {
  isPostBack: true,
  school: 'sh01',
  name: 'all',
  deadline: moment().endOf('month').format('X'),
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
    lessonComplete: {
      searchQuery: lessonCompleteQuery,
      list: [],
      pagination: {
        ...page,
        total: null,
      },
    },
    proTeacher: {
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
    * queryLessonCompleteReport ({ payload }, { call, put }) {
      if (payload.isPostBack) {
        const { data, success } = yield call(queryLessonCompleteReport, { school: payload.school, deadline: payload.deadline })
        if (success) {
          yield put({
            type: 'queryLessonCompleteReportSuccess',
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
          type: 'setLessonCompleteReportSuccess',
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
    * queryProTeacherReport ({ payload }, { call, put }) {
      if (payload.isPostBack) {
        const { data, success } = yield call(queryProTeacherReport, { school: payload.school, deadline: payload.deadline })
        if (success) {
          yield put({
            type: 'queryProTeacherReportSuccess',
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
          type: 'setProTeacherReportSuccess',
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
    * exportTeacherReport ({ payload }, { call }) {
      const { data, success } = yield call(exportTeacherReport, { school: payload.school, deadline: payload.deadline })
      if (success) {
        window.location.href = data.url
      }
    },
    * exportLessonCompleteReport ({ payload }, { call }) {
      const { data, success } = yield call(exportLessonCompleteReport, { school: payload.school, deadline: payload.deadline })
      if (success) {
        window.location.href = data.url
      }
    },
    * exportProTeacherReport ({ payload }, { call }) {
      const { data, success } = yield call(exportProTeacherReport, { school: payload.school, deadline: payload.deadline })
      if (success) {
        window.location.href = data.url
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
    queryLessonCompleteReportSuccess (state, action) {
      return { ...state, lessonComplete: action.payload }
    },
    setLessonCompleteReportSuccess (state, action) {
      const { list } = state.lessonComplete
      return { ...state, lessonComplete: { list, ...action.payload } }
    },
    queryProTeacherReportSuccess (state, action) {
      return { ...state, proTeacher: action.payload }
    },
    setProTeacherReportSuccess (state, action) {
      const { list } = state.proTeacher
      return { ...state, proTeacher: { list, ...action.payload } }
    },
  },
}
