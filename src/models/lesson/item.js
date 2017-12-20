import { getCurPowers } from 'utils'
import { query } from 'services/lesson/item'
import { query as querySchools } from 'services/common/school'
import { query as queryClassRooms } from 'services/common/classroom'
import { query as queryCategorys } from 'services/common/category'
import { query as queryTeachers } from 'services/account/admin'

export default {
  namespace: 'lessonItem',
  state: {
    item: {},
    schools: [],
    classroomsDic: [],
    categorys: [],
    teachersDic: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname, query: { lessonid } }) => {
        if (['/lesson/create', '/lesson/update', '/lesson/detail'].includes(pathname)) {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'querySource' })
            if (pathname === '/lesson/update' || pathname === '/lesson/detail') {
              dispatch({ type: 'query', payload: { lessonid } })
            }
          }
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const { data, success } = yield call(query, payload)
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            item: data,
          },
        })
      }
    },
    * querySource ({ }, { call, put }) {
      const { data: schools } = yield call(querySchools)
      const { data: classrooms } = yield call(queryClassRooms, { school_id: 0 })
      const { data: categorys } = yield call(queryCategorys)
      const { data: teachers } = yield call(queryTeachers, { rolename: 'teacher', school: '' })

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
          categorys,
          classroomsDic,
          teachersDic,
        },
      })
    },
  },

  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
    querySourceSuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
