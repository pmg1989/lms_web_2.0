import { getCurPowers, renderQuery } from 'utils'
import { query as queryLessons } from 'services/lesson/list'

export default {
  namespace: 'dashboard',
  state: {
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/' || pathname === '/dashboard') {
          const curPowers = getCurPowers('/dashboard')
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            // dispatch({ type: 'query', payload: {} })
          }
        }
      })
    },
  },
  effects: {
    * query ({ payload }, { select, call, put }) {
      const { searchQuery } = yield select(({ dashboard }) => dashboard)
      const querys = renderQuery(searchQuery, payload)
      const { data, success } = yield call(queryLessons, querys)

      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchQuery: querys,
            data,
          },
        })
      }
    },
  },
  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
