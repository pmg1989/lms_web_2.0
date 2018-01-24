import moment from 'moment'
import { getCurPowers, getSchool } from 'utils'
import { queryTeacherChart } from 'services/analysis/chart'

const renderTeacherLessonsChart = (list) => {
  return list.reduce((dicTeachers, item) => {
    if (!dicTeachers[item.name]) {
      dicTeachers[item.name] = item
    }
    if (!dicTeachers.all) {
      dicTeachers.all = { ...item }
    } else {
      dicTeachers.all.profession += item.profession
      dicTeachers.all.pro_vip += item.pro_vip
      dicTeachers.all.pro_jp += item.pro_jp
      dicTeachers.all.pro_other += item.pro_other
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
    teacher: {
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
      const { searchQuery } = yield select(({ analysisChart }) => analysisChart.teacher)
      yield put({
        type: 'queryTeacherChart',
        payload: searchQuery,
      })
    },
    * queryTeacherChart ({ payload }, { call, put }) {
      if (payload.isPostBack) {
        const { isPostBack, name, ...params } = payload
        const { data, success } = yield call(queryTeacherChart, params)
        if (success) {
          yield put({
            type: 'queryTeacherChartSuccess',
            payload: {
              data: renderTeacherLessonsChart(data),
              searchQuery: payload,
            },
          })
        }
      } else {
        yield put({
          type: 'setTeacherChartSuccess',
          payload: { searchQuery: payload },
        })
      }
    },
  },

  reducers: {
    queryTeacherChartSuccess (state, action) {
      return { ...state, teacher: action.payload }
    },
    setTeacherChartSuccess (state, action) {
      const { searchQuery } = action.payload
      return { ...state, teacher: { ...state.teacher, searchQuery } }
    },
  },
}
