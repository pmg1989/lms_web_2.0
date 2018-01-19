import { getCurPowers } from 'utils'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, create, update, queryCourseCategory, enrollesson, unenrollesson, querylessonStudents, queryCourseStudents } from 'services/lesson/item'

export default {
  namespace: 'lessonItem',
  state: {
    type: 'create',
    item: {},
    courseCategorys: [],
    studentList: [],
    resultList: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query: { lessonid } }) => {
        if (['/lesson/create', '/lesson/update', '/lesson/detail'].includes(pathname)) {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            if (pathname === '/lesson/create') {
              dispatch({ type: 'querySource', payload: { lessonid, type: 'create' } })
            } else if (pathname === '/lesson/update') {
              dispatch({ type: 'querySource', payload: { lessonid, type: 'update' } })
            } else {
              dispatch({ type: 'querySource', payload: { lessonid, type: 'detail' } })
              // 清除修改时留下的数据
              dispatch({ type: 'querySuccess', payload: { item: {}, type: 'detail' } })
            }
          }
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const { lessonid } = payload
      const { data, success } = yield call(query, { lessonid })
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            item: data,
          },
        })
      }

      yield put({
        type: 'lessonStudent/query',
        payload: { lessonid },
      })
    },
    * querySource ({ payload }, { select, call, put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({ type: 'commonModel/queryClassRooms' })
      yield put({ type: 'commonModel/queryTeachers' })

      const { courseCategorys } = yield select(({ lessonItem }) => lessonItem)
      if (!courseCategorys.length) {
        const { data } = yield call(queryCourseCategory)
        yield put({
          type: 'querySourceSuccess',
          payload: {
            courseCategorys: data,
            type: payload.type,
          },
        })
      } else {
        yield put({ type: 'changeType', payload: { type: payload.type } })
      }

      if (payload.type !== 'create') {
        yield put({ type: 'query', payload })
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
          },
        })
      }
    },
    * queryStudents2 ({ payload }, { call, put }) {
      const { params, phone2 } = payload
      console.log(params, phone2)
      const { data, success } = yield call(querylessonStudents, params)
      if (success) {
        yield put({
          type: 'queryStudentsSuccess',
          payload: {
            studentList: data,
          },
        })
      }
    },
    * create ({ payload }, { call, put }) {
      const { data, success } = yield call(create, payload.params)
      if (success) {
        console.log(data)
        yield put({
          type: 'showResultListModal',
          payload: { resultList: data },
        })
      }
    },
    * showResultListModal ({ payload }, { put }) {
      const { resultList } = payload
      yield put({ type: 'modal/showModal', payload: { type: 'detail', curItem: resultList, id: 4 } })
    },
    * update ({ payload }, { call, put }) {
      const { success } = yield call(update, payload.params)
      if (success) {
        yield put(routerRedux.goBack())
      }
    },
    * changeDaiTeacher ({ payload }, { call }) {
      const { params, type } = payload
      if (type === 'change') { // 添加 / 修改代课老师
        const { success } = yield call(enrollesson, params)
        if (success) {
          message.success('成功修改代课老师！')
        }
      } else {
        // 删除代课老师
        const { success } = yield call(unenrollesson, params)
        if (success) {
          message.success('成功删除代课老师！')
        }
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    querySourceSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    queryStudentsSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    changeType (state, action) {
      return { ...state, ...action.payload }
    },
    resetStudents (state) {
      return { ...state, studentList: [] }
    },
    resetItem (state) {
      return { ...state, type: 'create', item: {} }
    },
  },
}
