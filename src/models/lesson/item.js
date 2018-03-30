import { getCurPowers } from 'utils'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, update, enrollesson, unenrollesson, querylessonStudents } from 'services/lesson/item'
import { remove, removeCourse } from 'services/lesson/list'

export default {
  namespace: 'lessonItem',
  state: {
    type: 'detail',
    item: {},
    studentList: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query: { lessonid } }) => {
        if (['/lesson/update', '/lesson/detail'].includes(pathname)) {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            if (pathname === '/lesson/update') {
              dispatch({ type: 'querySource', payload: { lessonid, type: 'update' } })
            } else {
              dispatch({ type: 'querySource', payload: { lessonid, type: 'detail' } })
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
            type: payload.type,
            studentList: [], // 清空之前搜索的数据
          },
        })
      }

      yield put({
        type: 'lessonStudent/query',
        payload: { lessonid },
      })
    },
    * querySource ({ payload }, { put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({ type: 'commonModel/queryClassRooms' })
      yield put({ type: 'commonModel/queryTeachers' })

      yield put({ type: 'query', payload })
    },
    * queryStudents2 ({ payload }, { call, put }) {
      const { params } = payload
      const { data, success } = yield call(querylessonStudents, params)
      if (success) {
        yield put({
          type: 'queryStudentsSuccess',
          payload: {
            studentList: data,
            phone2: params.phone2,
          },
        })
      }
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
    * remove ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(remove, params)
      if (success) {
        yield put(routerRedux.goBack())
      }
    },
    * removeCourse ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(removeCourse, params)
      if (success) {
        yield put(routerRedux.goBack())
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
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
    resetItem (state) {
      return { ...state, type: 'detail', item: {} }
    },
  },
}
