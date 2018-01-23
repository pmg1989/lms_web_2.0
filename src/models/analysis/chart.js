import moment from 'moment'
import { getCurPowers, getSchool } from 'utils'
import { queryLessonsChart } from 'services/analysis/chart'

const renderTeacherLessonsChart = (list) => {
  return list.reduce((dicTeachers, item) => {
    if (!dicTeachers[item.name]) {
      dicTeachers[item.name] = item
    }
    if (!dicTeachers.all) {
      dicTeachers.all = { ...item }
    } else {
      dicTeachers.all.profession += item.profession
      dicTeachers.all.hd += item.hd
      dicTeachers.all.jl += item.jl
      dicTeachers.all.substitutee += item.substitutee
      dicTeachers.all.substituter += item.substituter
      dicTeachers.all.all += item.all
    }
    return dicTeachers
  }, {})
}

export default {
  namespace: 'analysisChart',
  state: {
    lessons: {
      searchQuery: {
        isPostBack: true,
        school: getSchool(),
        name: 'all',
        deadline: moment().subtract(1, 'month').endOf('month').format('X'),
      },
      data: {},
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/analysis/chart') {
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
    * query ({}, { select, put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({ type: 'commonModel/queryTeachers' })
      const { searchQuery } = yield select(({ analysisChart }) => analysisChart.lessons)
      yield put({
        type: 'queryTeacherLessonsChart',
        payload: searchQuery,
      })
    },
    * queryTeacherLessonsChart ({ payload }, { call, put }) {
      if (payload.isPostBack) {
        const { isPostBack, name, ...params } = payload
        const { data, success } = yield call(queryLessonsChart, params)
        if (success) {
          yield put({
            type: 'queryTeacherLessonsChartSuccess',
            payload: {
              data: renderTeacherLessonsChart(data),
              searchQuery: payload,
            },
          })
        }
      } else {
        yield put({
          type: 'setTeacherLessonsChartSuccess',
          payload: { searchQuery: payload },
        })
      }
    },
  },

  reducers: {
    queryTeacherLessonsChartSuccess (state, action) {
      return { ...state, lessons: action.payload }
    },
    setTeacherLessonsChartSuccess (state, action) {
      return { ...state, lessons: { ...state.lessons, searchQuery: action.payload.searchQuery } }
    },
  },
}
