import { getCurPowers } from 'utils'
import { routerRedux } from 'dva/router'
import { create, query, queryCourseCategory } from 'services/lesson/item'
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

      data.categoryid = 74
      data.school_id = 3
      data.classroomid = 200001
      data.openweekday = '5,6,0'
      data.numsections = 2
      data.startdate = 1513839600

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
        yield put(routerRedux.push({
          pathname: '/lesson/list',
        }))
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
