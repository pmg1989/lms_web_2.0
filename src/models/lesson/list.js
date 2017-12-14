import moment from 'moment'
import { getCurPowers, renderQuery, getSchool } from 'utils'
import { query } from 'services/lesson/list'
import { query as querySchools } from 'services/common/school'
import { query as queryCategorys } from 'services/common/category'
import { query as queryTeachers } from 'services/account/admin'

const page = {
  current: 1,
  pageSize: 10,
}

export default {
  namespace: 'lessonList',
  state: {
    searchQuery: {},
    schools: [],
    categorys: [],
    teachersDic: {},
    list: [],
    pagination: {
      ...page,
      total: null,
    },
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
              type: 'query',
              payload: {
                isPostBack: true,
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
    * query ({ payload }, { select, call, put }) {
      const { searchQuery } = yield select(({ lessonList }) => lessonList)
      const { isPostBack, current, pageSize, ...queryParams } = payload
      const querys = renderQuery(searchQuery, queryParams)
      console.log(moment.unix(querys.available).format('YYYY-MM-DD HH:mm:ss'))
      console.log(moment.unix(querys.deadline).format('YYYY-MM-DD HH:mm:ss'))
      console.log(querys)
      // 判断是否是首次加载页面，作为前端分页判断标识符
      if (isPostBack) {
        const { data, success } = yield call(query, querys)
        const list = (data[0] && data[0].list) || []
        if (success) {
          yield put({
            type: 'querySuccess',
            payload: {
              list,
              pagination: {
                current: payload.current ? +payload.current : page.current,
                pageSize: payload.pageSize ? +payload.pageSize : page.pageSize,
                total: list.length,
              },
              searchQuery: querys,
            },
          })
        }
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              current: payload.current ? +payload.current : page.current,
              pageSize: payload.pageSize ? +payload.pageSize : page.pageSize,
            },
            searchQuery: querys,
          },
        })
      }
    },
  },
  reducers: {
    querySearchSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
