import { getCurPowers } from 'utils'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, create, update, queryCourseCategory, enrollesson, unenrollesson } from 'services/lesson/item'
import { query as querySchools } from 'services/common/school'
import { query as queryClassRooms } from 'services/common/classroom'
import { query as queryUsers } from 'services/account/admin'

export default {
  namespace: 'lessonItem',
  state: {
    type: 'create',
    item: {},
    schools: [],
    classroomsDic: {},
    courseCategorys: [],
    teachersDic: {},
    studentList: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query: { lessonid } }) => {
        if (['/lesson/create', '/lesson/update', '/lesson/detail'].includes(pathname)) {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            if (pathname === '/lesson/update' || pathname === '/lesson/detail') {
              dispatch({ type: 'query', payload: { lessonid, type: pathname === '/lesson/update' ? 'update' : 'detail' } })
            } else {
              dispatch({ type: 'querySuccess', payload: { item: {}, type: 'create' } })
            }
            dispatch({ type: 'querySource' })
          }
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const { lessonid, type } = payload
      const { data, success } = yield call(query, { lessonid })
      // const { data: students } = yield call()

      data.categoryid = 74
      data.school_id = 2
      data.classroomid = 1 // 200001

      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            item: data,
            type,
          },
        })
      }
    },
    * querySource ({ }, { call, put }) {
      const { data: schools } = yield call(querySchools)
      const { data: classrooms } = yield call(queryClassRooms, { school_id: 0 })
      const { data: courseCategorys } = yield call(queryCourseCategory)
      const { data: teachers } = yield call(queryUsers, { rolename: 'teacher', school: '' })

      const classroomsDic = classrooms.reduce((dic, classroom) => {
        if (classroom.school_id) {
          if (!dic[classroom.school_id]) {
            dic[classroom.school_id] = []
          }
          dic[classroom.school_id].push(classroom)
        }
        return dic
      }, {})
      const teachersDic = teachers.reduce((dic, teacher) => {
        if (teacher.school_id) {
          if (!dic[teacher.school_id]) {
            dic[teacher.school_id] = []
          }
          dic[teacher.school_id].push(teacher)
        }
        return dic
      }, {})

      yield put({
        type: 'querySourceSuccess',
        payload: {
          schools,
          courseCategorys,
          classroomsDic,
          teachersDic,
        },
      })
    },
    * queryStudents ({ payload }, { call, put }) {
      const { data, success } = yield call(queryUsers, { rolename: 'student', ...payload })
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
        yield put(routerRedux.goBack())
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
  },
}
