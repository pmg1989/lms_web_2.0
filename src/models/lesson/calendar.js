import moment from 'moment'
import { getCurPowers, renderQuery, getSchool } from 'utils'
import { query } from 'services/lesson/list'

const initParams = {
  school: getSchool(),
  available: moment().startOf('month').format('X'),
  deadline: moment().add(1, 'month').startOf('month').format('X'),
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
    curDate: moment().format('X'),
    lessons: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query: { back } }) => {
        if (pathname === '/' || pathname === '/lesson/calendar') {
          const curPowers = getCurPowers('/lesson/calendar')
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'querySearch' })
            if (!back) {
              dispatch({ type: 'query', payload: { ...initParams, isPostBack: true } })
            } else {
              dispatch({ type: 'reQuery', payload: { isPostBack: true } })
            }
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
    * query ({ payload }, { select, call, put }) {
      const { searchQuery, curDate } = yield select(({ lessonCalendar }) => lessonCalendar)
      const { isPostBack, ...queryParams } = payload
      const querys = renderQuery(searchQuery, queryParams)
      console.log(moment.unix(querys.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(querys.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(querys)
      const { data, success } = yield call(query, querys)
      querys.curDate = curDate
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            lessons: renderList(data),
            isPostBack: false,
            searchQuery: querys,
          },
        })

        yield put({
          type: 'queryPrev',
          payload: {
            ...querys,
            available: moment.unix(querys.available).subtract(1, 'month').startOf('month').format('X'),
            deadline: moment.unix(querys.available).startOf('month').format('X'),
          },
        })
        yield put({
          type: 'queryNext',
          payload: {
            ...querys,
            available: querys.deadline,
            deadline: moment.unix(querys.deadline).add(1, 'months').startOf('month').format('X'),
          },
        })
      }
    },
    * queryPrev ({ payload }, { call, put }) {
      const { curDate, ...querys } = payload
      console.log(moment.unix(querys.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(querys.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(querys)
      const { data, success } = yield call(query, querys)
      if (success) {
        yield put({
          type: 'queryPrevSuccess',
          payload: {
            available: querys.available,
            curDate,
            lessons: renderList(data),
          },
        })
      }
    },
    * queryNext ({ payload }, { call, put }) {
      const { curDate, ...querys } = payload
      console.log(moment.unix(querys.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(querys.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(querys)
      const { data, success } = yield call(query, querys)
      if (success) {
        yield put({
          type: 'queryNextSuccess',
          payload: {
            deadline: querys.deadline,
            curDate,
            lessons: renderList(data),
          },
        })
      }
    },
    * reQuery ({ payload }, { select, put }) {
      const { searchQuery, curDate } = yield select(({ lessonCalendar }) => lessonCalendar)
      payload.available = moment.unix(curDate).startOf('month').format('X')
      payload.deadline = moment.unix(curDate).add(1, 'month').startOf('month').format('X')
      const querys = renderQuery(searchQuery, payload)
      yield put({
        type: 'query',
        payload: querys,
      })
    },
  },
  reducers: {
    querySuccess (state, action) {
      const { lessons, isPostBack, searchQuery: { curDate, ...otherQuery } } = action.payload
      return { ...state, isPostBack, curDate, searchQuery: otherQuery, lessons }
    },
    queryPrevSuccess (state, action) {
      const { lessons, available, curDate } = action.payload
      return { ...state, curDate, lessons: [...state.lessons, ...lessons], searchQuery: { ...state.searchQuery, available } }
    },
    queryNextSuccess (state, action) {
      const { lessons, deadline, curDate } = action.payload
      return { ...state, curDate, lessons: [...state.lessons, ...lessons], searchQuery: { ...state.searchQuery, deadline } }
    },
  },
}
