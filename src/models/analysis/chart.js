import moment from 'moment'
import { getCurPowers } from 'utils'
import { queryTeacherChart, queryLessonCompleteChart, queryProTeacherChart } from 'services/analysis/chart'

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
  const dicList = list.reduce((dic, item) => {
    if (!dic[item.student_idnumber]) {
      dic[item.student_idnumber] = item
    } else {
      dic[item.student_idnumber].pro_ontrack = (dic[item.student_idnumber].pro_ontrack + item.pro_ontrack) / 2
      dic[item.student_idnumber].hd_ontrack = (dic[item.student_idnumber].hd_ontrack + item.hd_ontrack) / 2
      dic[item.student_idnumber].jl_ontrack = (dic[item.student_idnumber].jl_ontrack + item.jl_ontrack) / 2
    }
    return dic
  }, {})
  dicList.all = {}
  const sumPro = list.reduce((sum, item) => sum + item.pro_ontrack, 0)
  dicList.all.pro_ontrack = sumPro / list.length
  const hdList = list.filter(item => ['vocal', 'piano', 'guitar'].includes(item.category_idnumber.split('-')[0]))
  const sumHd = hdList.reduce((sum, item) => sum + item.hd_ontrack, 0)
  dicList.all.hd_ontrack = sumHd / hdList.length
  const jlList = list.filter(item => ['vocal'].includes(item.category_idnumber.split('-')[0]))
  const sumJl = jlList.reduce((sum, item) => sum + item.jl_ontrack, 0)
  dicList.all.jl_ontrack = sumJl / jlList.length
  return dicList
}

const renderProTeacherChart = (list) => {
  return list.reduce((dic, item) => {
    if (!dic.name) {
      dic.name = [item.name.substr(0, 3)]
    } else {
      dic.name.push(item.name.substr(0, 3))
    }
    if (!dic.stage1Contract) {
      dic.stage1Contract = [item.stage_1]
    } else {
      dic.stage1Contract.push(item.stage_1)
    }
    if (!dic.stage2Contract) {
      dic.stage2Contract = [item.stage_2]
    } else {
      dic.stage2Contract.push(item.stage_2)
    }
    if (!dic.stage3Contract) {
      dic.stage3Contract = [item.stage_3]
    } else {
      dic.stage3Contract.push(item.stage_3)
    }

    if (!dic.stage1Jp) {
      dic.stage1Jp = [item.stage_1_jp]
    } else {
      dic.stage1Jp.push(item.stage_1_jp)
    }
    if (!dic.stage2Jp) {
      dic.stage2Jp = [item.stage_2_jp]
    } else {
      dic.stage2Jp.push(item.stage_2_jp)
    }
    if (!dic.stage3Jp) {
      dic.stage3Jp = [item.stage_3_jp]
    } else {
      dic.stage3Jp.push(item.stage_3_jp)
    }

    if (!dic.stage1Vip) {
      dic.stage1Vip = [item.stage_1_vip]
    } else {
      dic.stage1Vip.push(item.stage_1_vip)
    }
    if (!dic.stage2Vip) {
      dic.stage2Vip = [item.stage_2_vip]
    } else {
      dic.stage2Vip.push(item.stage_2_vip)
    }
    if (!dic.stage3Vip) {
      dic.stage3Vip = [item.stage_3_vip]
    } else {
      dic.stage3Vip.push(item.stage_3_vip)
    }
    return dic
  }, {})
}

const searchTeacherQuery = {
  isPostBack: true,
  school: 'sh01',
  name: 'all',
  deadline: moment().endOf('month').format('X'),
}

const searchLessonCompleteQuery = {
  isPostBack: true,
  school: 'sh01',
  idNumber: 'all',
  deadline: moment().endOf('month').format('X'),
}

const searchProTeacherQuery = {
  isPostBack: true,
  school: 'sh01',
  name: 'all',
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
    proTeacher: {
      searchQuery: searchProTeacherQuery,
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
      yield put({
        type: 'queryProTeacherChart',
        payload: searchProTeacherQuery,
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
    * queryProTeacherChart ({ payload }, { call, put }) {
      if (payload.isPostBack) {
        const { isPostBack, name, ...params } = payload
        const { data, success } = yield call(queryProTeacherChart, params)
        if (success) {
          yield put({
            type: 'queryProTeacherChartSuccess',
            payload: {
              data: renderProTeacherChart(data),
              searchQuery: payload,
            },
          })
        }
      } else {
        yield put({
          type: 'setProTeacherChartSuccess',
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
    queryProTeacherChartSuccess (state, action) {
      return { ...state, proTeacher: action.payload }
    },
    setProTeacherChartSuccess (state, action) {
      const { searchQuery } = action.payload
      return { ...state, proTeacher: { ...state.proTeacher, searchQuery } }
    },
  },
}
