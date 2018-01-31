import moment from 'moment'
import { getCurPowers, renderQuery, getSchool } from 'utils'
import { query as queryLessons } from 'services/lesson/list'

const initParams = {
  school: getSchool(),
  available: moment().startOf('month').format('X'),
  deadline: moment().endOf('month').format('X'),
}

function getCateIcon (lesson) {
  if (lesson.num_student === 0) {
    return 'e'
  } else if (lesson.num_student < lesson.category_upperlimit) {
    return 'h'
  }
  return 'o'
}

export default {
  namespace: 'lessonCalendar',
  state: {
    isPostBack: true, // 判断是否是首次加载页面，修复 + more bug
    searchQuery: initParams,
    lessons: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/' || pathname === '/lesson/calendar') {
          const curPowers = getCurPowers('/lesson/calendar')
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'querySearch' })
            dispatch({ type: 'getLessons', payload: { isPostBack: true, needMerge: false } })
          }
        }
      })
    },
  },
  effects: {
    * querySearch ({ }, { put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({ type: 'commonModel/queryCategorys' })
      yield put({ type: 'commonModel/queryTeachers' })
    },
    * getLessons ({ payload }, { select, call, put }) {
      const { searchQuery } = yield select(({ lessonCalendar }) => lessonCalendar)
      const { isPostBack, needMerge, ...queryParams } = payload
      const querys = renderQuery(searchQuery, queryParams)
      console.log(moment.unix(querys.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(querys.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(querys)
      let lessons = []
      const { data, success } = yield call(queryLessons, querys)

      if (data[0] && data[0].list) {
        lessons = data[0].list.map((lesson) => {
          const start = moment.unix(lesson.available)
          const end = moment.unix(lesson.deadline)
          lesson.title = ''
          lesson.text = `${lesson.teacher_alternatename}(${lesson.classroom}${lesson.category.includes('-vip-') ? ' V' : ''})`
          lesson.start = new Date(start.year(), start.month(), start.date(), start.hour(), start.minute(), 0)
          lesson.end = new Date(end.year(), end.month(), end.date(), end.hour(), end.minute(), 0)
          lesson.category = lesson.category_idnumber.split('-')[0]
          lesson.iconType = getCateIcon(lesson)
          lesson.allDay = false
          return lesson
        })
      }

      if (success) {
        yield put({
          type: 'getLessonsSuccess',
          payload: {
            searchQuery: querys,
            lessons,
            isPostBack: false,
            needMerge,
          },
        })
      }
    },
  },
  reducers: {
    getLessonsSuccess (state, action) {
      const { lessons, needMerge, ...newState } = action.payload
      if (needMerge) {
        return { ...state, ...newState, needMerge, lessons: [...state.lessons, ...lessons] }
      }
      return { ...state, ...newState, needMerge, lessons }
    },
    resetLessons (state, action) {
      const { available } = action.payload
      return { ...state, lessons: [], searchQuery: { ...state.searchQuery, available } }
    },
    changeDate (state, action) {
      const { available, deadline } = action.payload
      return { ...state, searchQuery: { ...state.searchQuery, available, deadline } }
    },
  },
}
