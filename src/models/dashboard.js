import moment from 'moment'
import { getCurPowers, renderQuery, getSchool } from 'utils'
import { query as queryLessons } from 'services/lesson/list'

export default {
  namespace: 'dashboard',
  state: {
    lessons: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/' || pathname === '/dashboard') {
          const curPowers = getCurPowers('/dashboard')
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'getLessons', payload: { school: getSchool() } })
          }
        }
      })
    },
  },
  effects: {
    * getLessons ({ payload }, { select, call, put }) {
      const { searchQuery } = yield select(({ dashboard }) => dashboard)
      const querys = renderQuery(searchQuery, payload)
      querys.available = 1509465600
      querys.deadline = 1517414400
      const { data, success } = yield call(queryLessons, querys)
      let lessons = []
      if (data[0] && data[0].list) {
        lessons = data[0].list.map((lesson, index) => {
          const start = moment.unix(lesson.available)
          const end = moment.unix(lesson.deadline)
          const title = `${start.format('HH:mm－')}${end.format('HH:mm')}\n${lesson.teacher}\n
                教室: ${lesson.classroom}\n${lesson.category_summary}`
          lesson.title = title
          lesson.start = new Date(start.year(), start.month(), start.date(), start.hour(), start.minute(), 0)
          lesson.end = new Date(end.year(), end.month(), end.date(), end.hour(), end.minute(), 0)
          lesson.allDay = false
          lesson.index = index
          return lesson
        })
      }
      if (success) {
        yield put({
          type: 'getLessonsSuccess',
          payload: {
            searchQuery: querys,
            lessons,
          },
        })
      }
    },
  },
  reducers: {
    getLessonsSuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
