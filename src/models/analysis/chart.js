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
              legendData: ['精品课时 | 335', 'VIP课时 | 310', '被代课时 | 234', '已代课时 | 135'],
              seriesData: [
                { value: 335, name: '精品课时 | 335' },
                { value: 310, name: 'VIP课时 | 310' },
                { value: 234, name: '被代课时 | 234' },
                { value: 135, name: '已代课时 | 135' },
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
