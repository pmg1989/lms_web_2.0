import { getCurPowers } from 'utils'
import { create, queryCourseCategory, queryCourseStudents } from 'services/lesson/item'

export default {
  namespace: 'lessonCreate',
  state: {
    courseCategorys: [],
    studentList: [],
    resultList: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/lesson/create') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'querySource' })
          }
        }
      })
    },
  },

  effects: {
    * querySource ({}, { select, call, put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({ type: 'commonModel/queryClassRooms' })
      yield put({ type: 'commonModel/queryTeachers' })

      const { courseCategorys } = yield select(({ lessonCreate }) => lessonCreate)
      if (!courseCategorys.length) {
        const { data } = yield call(queryCourseCategory)
        yield put({
          type: 'querySourceSuccess',
          payload: {
            courseCategorys: data,
          },
        })
      }
    },
    * queryStudents ({ payload }, { call, put }) {
      const { params, phone2 } = payload
      console.log(params, phone2)
      delete params.startdate
      const { data, success } = yield call(queryCourseStudents, params)
      if (success) {
        yield put({
          type: 'queryStudentsSuccess',
          payload: {
            studentList: data,
            phone2,
          },
        })
      }
    },
    * create ({ payload }, { call, put }) {
      const { data, success } = yield call(create, payload.params)
      if (success) {
        yield put({
          type: 'showResultListModal',
          payload: { resultList: data },
        })
      }
    },
    * showResultListModal ({ payload }, { put }) {
      const { resultList } = payload
      yield put({ type: 'modal/showModal', payload: { type: 'detail', curItem: resultList } })
    },
  },

  reducers: {
    querySourceSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    queryStudentsSuccess (state, action) {
      const { studentList, phone2 } = action.payload
      studentList.forEach((item, index) => {
        if (item.phone2 === phone2) {
          studentList.splice(index, 1)
          studentList.unshift(item)
        }
      })
      return { ...state, studentList }
    },
    resetStudents (state) {
      return { ...state, studentList: [] }
    },
  },
}
