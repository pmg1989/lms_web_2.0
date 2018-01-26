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
    const avaliable = item.contract_available
    const avaliableArr = avaliable.split('/')
    const year = avaliableArr[0]
    const month = avaliableArr[1]
    const day = avaliableArr[2]
    const yearMonth = `${year}/${month}`
    const monthDay = `${month}/${day}`
    if (!dic[year]) {
      dic[year] = {
        all: {
          count: 1,
          profession: item.pro_ontrack,
          hd: item.hd_ontrack,
          jl: item.jl_ontrack,
        },
        [yearMonth]: {
          all: {
            count: 1,
            profession: item.pro_ontrack,
            hd: item.hd_ontrack,
            jl: item.jl_ontrack,
          },
          [monthDay]: {
            count: 1,
            profession: item.pro_ontrack,
            hd: item.hd_ontrack,
            jl: item.jl_ontrack,
          },
        },
      }
    } else {
      dic[year].all.count += 1
      dic[year].all.profession += item.pro_ontrack
      dic[year].all.hd += item.hd_ontrack
      dic[year].all.jl += item.jl_ontrack
      if (!dic[year][yearMonth]) {
        dic[year][yearMonth] = {
          all: {
            count: 1,
            profession: item.pro_ontrack,
            hd: item.hd_ontrack,
            jl: item.jl_ontrack,
          },
          [monthDay]: {
            count: 1,
            profession: item.pro_ontrack,
            hd: item.hd_ontrack,
            jl: item.jl_ontrack,
          },
        }
      } else {
        dic[year][yearMonth].all.count += 1
        dic[year][yearMonth].all.profession += item.pro_ontrack
        dic[year][yearMonth].all.hd += item.hd_ontrack
        dic[year][yearMonth].all.jl += item.jl_ontrack
        if (!dic[year][yearMonth][monthDay]) {
          dic[year][yearMonth][monthDay] = {
            count: 1,
            profession: item.pro_ontrack,
            hd: item.hd_ontrack,
            jl: item.jl_ontrack,
          }
        } else {
          dic[year][yearMonth][monthDay].count += 1
          dic[year][yearMonth][monthDay].profession += item.pro_ontrack
          dic[year][yearMonth][monthDay].hd += item.hd_ontrack
          dic[year][yearMonth][monthDay].jl += item.jl_ontrack
        }
      }
    }
    return dic
  }, {})
}

const monthAll = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

const emptyData = {
  count: 1,
  profession: 0,
  hd: 0,
  jl: 0,
}

const fillLessonCompleteChart = (data) => {
  return Object.keys(data).reduce((dic, year) => {
    function fillMonthDays (yearMonth, isEmpty) {
      const month = yearMonth.split('/')[1]
      const days = moment(yearMonth, 'YYYY-MM').daysInMonth()
      const _dic = {}
      for (let day = 1; day <= days; day += 1) {
        const dayPad = day.toString().padStart(2, '0')
        if (isEmpty) {
          _dic[`${month}/${dayPad}`] = emptyData
        } else {
          _dic[`${month}/${dayPad}`] = data[year][yearMonth][`${month}/${dayPad}`] || emptyData
        }
      }
      return _dic
    }

    const yearMonthAll = monthAll.map(month => `${year}/${month}`)
    return yearMonthAll.reduce((dic2, yearMonth) => {
      if (!dic2[year][yearMonth]) {
        dic2[year][yearMonth] = {
          all: emptyData,
          ...fillMonthDays(yearMonth, true),
        }
      } else {
        dic2[year][yearMonth] = {
          all: dic2[year][yearMonth].all,
          ...fillMonthDays(yearMonth, false),
        }
      }
      return dic2
    }, dic)
  }, data)
}

const searchTeacherQuery = {
  isPostBack: true,
  school: getSchool(),
  name: 'all',
  deadline: moment().subtract(1, 'month').endOf('month').format('X'),
}

const searchLessonCompleteQuery = {
  isPostBack: true,
  school: 'cd01', // getSchool(),
  type: 'month',
  deadline: moment().endOf('day').format('X'),
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
        const { isPostBack, type, ...params } = payload
        const { data, success } = yield call(queryLessonCompleteChart, params)
        const dataDic = renderLessonCompleteChart(data)
        console.log(dataDic)
        if (success) {
          yield put({
            type: 'queryLessonCompleteChartSuccess',
            payload: {
              data: fillLessonCompleteChart(dataDic),
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
      console.log(action.payload.data)
      return { ...state, lessonComplete: action.payload }
      // return { ...state, lessonComplete: { searchQuery: state.lessonComplete.searchQuery, data: {} } }
    },
    setLessonCompleteChartSuccess (state, action) {
      const { searchQuery } = action.payload
      return { ...state, lessonComplete: { ...state.lessonComplete, searchQuery } }
    },
  },
}
