import { query as querySchools } from 'services/common/school'
import { query as queryCategorys } from 'services/common/category'
import { query as queryTeachers } from 'services/account/admin'

export default {
  namespace: 'commonModel',
  state: {
    schools: [],
    categorys: [],
    teachersDic: {},
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
  },
}
