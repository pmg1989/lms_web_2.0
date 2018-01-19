import moment from 'moment'
import { getCurPowers, renderQuery, getSchool } from 'utils'
import { query, remove, removeCourse, deleteBatch } from 'services/lesson/list'

const page = {
  current: 1,
  pageSize: 10,
}

const initParams = {
  school: getSchool(),
  available: moment().startOf('month').format('X'),
  deadline: moment().endOf('month').format('X'),
}

export default {
  namespace: 'lessonList',
  state: {
    searchQuery: initParams,
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
            dispatch({ type: 'query', payload: { isPostBack: true } })
          }
        }
      })
    },
  },
  effects: {
    * querySearch ({ }, { put }) {
      yield put({ type: 'commonModel/querySchools' })
      yield put({ type: 'commonModel/queryCategorys' })
      yield put({ type: 'commonModel/queryTeachers' })
    },
    * query ({ payload }, { select, call, put }) {
      const { searchQuery, pagination } = yield select(({ lessonList }) => lessonList)
      const { isPostBack, isSearch, current, pageSize, ...queryParams } = payload
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
                current: payload.current || (isSearch ? +payload.current : pagination.current),
                pageSize: payload.pageSize || (isSearch ? +payload.pageSize : pagination.pageSize),
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
    * remove ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(remove, params)
      if (success) {
        yield put({
          type: 'removeSuccess',
          payload: { id: params.lessonid },
        })
      }
    },
    * removeCourse ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(removeCourse, params)
      if (success) {
        yield put({
          type: 'query',
          payload: { isPostBack: true },
        })
      }
    },
    * removeBatch ({ payload }, { call, put }) {
      const { params } = payload
      const { success } = yield call(deleteBatch, params)
      if (success) {
        yield put({
          type: 'removeBatchSuccess',
          payload: { ids: params.lessonids.split(',') },
        })
      }
    },
  },
  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },
    removeSuccess (state, { payload }) {
      const list = state.list.filter(item => item.id !== payload.id)
      return { ...state, list, pagination: { ...state.pagination, total: list.length } }
    },
    removeBatchSuccess (state, { payload }) {
      const list = state.list.filter(item => !payload.ids.includes(item.id.toString()))
      return { ...state, list, pagination: { ...state.pagination, total: list.length } }
    },
  },
}
