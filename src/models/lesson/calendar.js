import moment from 'moment'
import { getCurPowers, getSchool } from 'utils'
import { query } from 'services/lesson/list'

const initParams = {
  school: getSchool(),
  available: +moment().startOf('month').format('X'),
  deadline: +moment().add(1, 'month').startOf('month').format('X'),
}

function getCateIcon (lesson) {
  if (lesson.num_student === 0) {
    return 'e'
  } else if (lesson.num_student < lesson.category_upperlimit) {
    return 'h'
  }
  return 'o'
}

const renderList = (data) => {
  let lessons = []
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
  return lessons
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
            dispatch({ type: 'query', payload: { ...initParams, isPostBack: true } })
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
    * query ({ payload }, { call, put }) {
      const { isPostBack, ...querys } = payload
      console.log(moment.unix(querys.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(querys.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(querys)
      const { data, success } = yield call(query, querys)
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            lessons: renderList(data),
            isPostBack: false,
          },
        })
      }
    },
    * queryPrev ({ payload }, { call, put }) {
      console.log(moment.unix(payload.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(payload.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(payload)
      const { data, success } = yield call(query, payload)
      if (success) {
        yield put({
          type: 'queryPrevSuccess',
          payload: {
            available: payload.available,
            lessons: renderList(data),
          },
        })
      }
    },
    * queryNext ({ payload }, { call, put }) {
      console.log(moment.unix(payload.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(payload.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(payload)
      const { data, success } = yield call(query, payload)
      if (success) {
        yield put({
          type: 'queryNextSuccess',
          payload: {
            deadline: payload.deadline,
            lessons: renderList(data),
          },
        })
      }
    },
  },
  reducers: {
    querySuccess (state, action) {
      const { lessons, isPostBack } = action.payload
      return { ...state, isPostBack, lessons: [...state.lessons, ...lessons] }
    },
    queryPrevSuccess (state, action) {
      const { lessons, available } = action.payload
      return { ...state, lessons: [...state.lessons, ...lessons], searchQuery: { ...state.searchQuery, available } }
    },
    queryNextSuccess (state, action) {
      const { lessons, deadline } = action.payload
      return { ...state, lessons: [...state.lessons, ...lessons], searchQuery: { ...state.searchQuery, deadline } }
    },
  },
}
