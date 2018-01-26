import moment from 'moment'
import { getCurPowers, getSchool } from 'utils'
import { queryTeacherChart, queryLessonCompleteChart } from 'services/analysis/chart'

const renderTeacherChart = (list) => {
  return list.reduce((dic, item) => {
    if (!dic[item.name]) {
      dic[item.name] = item
    }
    if (!dic.all) {
      dic.all = { ...item }
    } else {
      dic.all.profession += item.profession
      dic.all.pro_vip += item.pro_vip
      dic.all.pro_jp += item.pro_jp
      dic.all.pro_other += item.pro_other
      dic.all.hd += item.hd
      dic.all.jl += item.jl
      dic.all.substitutee += item.substitutee
      dic.all.substituter += item.substituter
      dic.all.all += item.all
    }
    return dic
  }, {})
}

const renderLessonCompleteChart = (list) => {
  return list.reduce((dic, item) => {
    if (!dic[item.student_idnumber]) {
      dic[item.student_idnumber] = item
    } else {
      dic[item.student_idnumber].pro_ontrack = (dic[item.student_idnumber].pro_ontrack + item.pro_ontrack) / 2
      dic[item.student_idnumber].hd_ontrack = (dic[item.student_idnumber].hd_ontrack + item.hd_ontrack) / 2
      dic[item.student_idnumber].jl_ontrack = (dic[item.student_idnumber].jl_ontrack + item.jl_ontrack) / 2
    }
    if (!dic.all) {
      dic.all = { ...item }
    } else {
      dic.all.pro_ontrack = (dic.all.pro_ontrack + item.pro_ontrack) / 2
      dic.all.hd_ontrack = (dic.all.hd_ontrack + item.hd_ontrack) / 2
      dic.all.jl_ontrack = (dic.all.jl_ontrack + item.jl_ontrack) / 2
    }
    return dic
  }, {})
}

const searchTeacherQuery = {
  isPostBack: true,
  school: getSchool(),
  name: 'all',
  deadline: moment().endOf('month').format('X'),
}

const searchLessonCompleteQuery = {
  isPostBack: true,
  school: getSchool(),
  idNumber: 'all',
  deadline: moment().endOf('month').format('X'),
}

export default {
  namespace: 'analysisChart',
  state: {
    teacher: {
      searchQuery: searchTeacherQuery,
      data: {},
    },
    lessonComplete: {
      searchQuery: searchLessonCompleteQuery,
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
    * query ({}, { put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({ type: 'commonModel/queryTeachers' })
      yield put({
        type: 'queryTeacherChart',
        payload: searchTeacherQuery,
      })
      yield put({
        type: 'queryLessonComplete',
        payload: searchLessonCompleteQuery,
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
              data: renderTeacherChart(data),
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
    * queryLessonComplete ({ payload }, { call, put }) {
      if (payload.isPostBack) {
        const { isPostBack, idNumber, ...params } = payload
        const { data, success } = yield call(queryLessonCompleteChart, params)
        if (success) {
          yield put({
            type: 'queryLessonCompleteChartSuccess',
            payload: {
              data: renderLessonCompleteChart(data),
              searchQuery: payload,
            },
          })
        }
      } else {
        yield put({
          type: 'setLessonCompleteChartSuccess',
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
    queryLessonCompleteChartSuccess (state, action) {
      return { ...state, lessonComplete: action.payload }
    },
    setLessonCompleteChartSuccess (state, action) {
      const { searchQuery } = action.payload
      return { ...state, lessonComplete: { ...state.lessonComplete, searchQuery } }
    },
  },
}
