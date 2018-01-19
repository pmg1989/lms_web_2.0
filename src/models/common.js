import { query as querySchools } from 'services/common/school'
import { query as queryCategorys } from 'services/common/category'
import { query as queryTeachers } from 'services/account/admin'
import { query as queryClassRooms } from 'services/common/classroom'

export default {
  namespace: 'commonModel',
  state: {
    schools: [],
    categorys: [],
    teachersDic: {},
    teachers2Dic: {},
    classroomsDic: {},
  },
  effects: {
    * querySchools ({ }, { select, call, put }) {
      const { schools } = yield select(({ commonModel }) => commonModel)
      if (!schools.length) {
        const { data } = yield call(querySchools)
        yield put({
          type: 'querySchoolsSuccess',
          payload: { schools: data },
        })
      }
    },
    * queryCategorys ({ }, { select, call, put }) {
      const { categorys } = yield select(({ commonModel }) => commonModel)
      if (!categorys.length) {
        const { data } = yield call(queryCategorys)
        yield put({
          type: 'queryCategorysSuccess',
          payload: { categorys: data },
        })
      }
    },
    * queryTeachers ({ }, { select, call, put }) {
      const { teachersDic } = yield select(({ commonModel }) => commonModel)
      if (!Object.keys(teachersDic).length) {
        const { data } = yield call(queryTeachers, { rolename: 'teacher', school: '' })
        yield put({
          type: 'queryTeachersSuccess',
          payload: {
            teachersDic: data.reduce((dic, teacher) => {
              if (teacher.school) {
                if (!dic[teacher.school]) {
                  dic[teacher.school] = []
                }
                dic[teacher.school].push(teacher)
              }
              return dic
            }, {}),
            teachers2Dic: data.reduce((dic, teacher) => {
              if (teacher.school_id) {
                if (!dic[teacher.school_id]) {
                  dic[teacher.school_id] = []
                }
                dic[teacher.school_id].push(teacher)
              }
              return dic
            }, {}),
          },
        })
      }
    },
    * queryClassRooms ({ }, { select, call, put }) {
      const { classroomsDic } = yield select(({ commonModel }) => commonModel)
      if (!Object.keys(classroomsDic).length) {
        const { data } = yield call(queryClassRooms, { school_id: 0 })
        yield put({
          type: 'queryClassRoomsSuccess',
          payload: {
            classroomsDic: data.reduce((dic, classroom) => {
              if (classroom.school_id) {
                if (!dic[classroom.school_id]) {
                  dic[classroom.school_id] = []
                }
                dic[classroom.school_id].push(classroom)
              }
              return dic
            }, {}),
          },
        })
      }
    },
  },

  reducers: {
    querySchoolsSuccess (state, { payload }) {
      return { ...state, ...payload }
    },
    queryCategorysSuccess (state, { payload }) {
      return { ...state, ...payload }
    },
    queryTeachersSuccess (state, { payload }) {
      return { ...state, ...payload }
    },
    queryClassRoomsSuccess (state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
