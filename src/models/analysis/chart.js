import { getCurPowers } from 'utils'
import { queryLessonsChart } from 'services/analysis/chart'

export default {
  namespace: 'analysisChart',
  state: {
    lessons: {
      legendData: [],
      seriesData: [],
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/analysis/chart') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'query' })
          }
        }
      })
    },
  },

  effects: {
    * query ({}, { put }) {
      yield put({ type: 'queryChart' })
    },
    * queryChart ({ }, { call, put }) {
      const { success } = yield call(queryLessonsChart)
      if (success) {
        yield put({
          type: 'queryChartSuccess',
          payload: {
            lessons: {
              legendData: ['精品课时 | 100', 'VIP课时 | 200', '被代课时 | 300', '已代课时 | 400'],
              seriesData: [
                { value: 100, name: '精品课时 | 100' },
                { value: 200, name: 'VIP课时 | 200' },
                { value: 300, name: '被代课时 | 300' },
                { value: 400, name: '已代课时 | 400' },
              ],
            },
          },
        })
      }
    },
  },

  reducers: {
    queryChartSuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
