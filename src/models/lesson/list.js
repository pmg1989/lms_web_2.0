import moment from 'moment'
import { getCurPowers, renderQuery, getSchool } from 'utils'
import { query as queryLessons } from 'services/lesson/list'
import { query as querySchools } from 'services/common/school'
import { query as queryCategorys } from 'services/common/category'
import { query as queryTeachers } from 'services/account/admin'

export default {
  namespace: 'lessonList',
  state: {
    searchQuery: {},
    schools: [],
    categorys: [],
    teachersDic: {},
    lessons: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/lesson/list') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'querySearch' })
            dispatch({
              type: 'getLessons',
              payload: {
                school: getSchool(),
                available: moment().startOf('month').format('X'),
                deadline: moment().endOf('month').format('X'),
              },
            })
          }
        }
      })
    },
  },
  effects: {
    * querySearch ({ }, { call, put }) {
      const { data: schools } = yield call(querySchools)
      const { data: categorys } = yield call(queryCategorys)
      const { data: teachers } = yield call(queryTeachers, { rolename: 'teacher', school: '' })
      const teachersDic = teachers.reduce((dic, teacher) => {
        if (teacher.school) {
          if (!dic[teacher.school]) {
            dic[teacher.school] = []
          }
          dic[teacher.school].push(teacher)
        }
        return dic
      }, {})
      yield put({
        type: 'querySearchSuccess',
        payload: {
          schools,
          categorys,
          teachersDic,
        },
      })
    },
    * getLessons ({ payload }, { select, call, put }) {
      const { searchQuery } = yield select(({ lessonList }) => lessonList)
      const querys = renderQuery(searchQuery, payload)
      console.log(moment.unix(querys.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(querys.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(querys)
      const { data, success } = yield call(queryLessons, querys)

      if (success) {
        yield put({
          type: 'getLessonsSuccess',
          payload: {
            searchQuery: querys,
            lessons: data[0].list,
          },
        })
      }
    },
  },
  reducers: {
    querySearchSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    getLessonsSuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
