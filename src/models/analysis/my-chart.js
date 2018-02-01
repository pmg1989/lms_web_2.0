import { getCurPowers } from 'utils'
import { queryTeacherStatInfo } from 'services/analysis/my-chart'

export default {
  namespace: 'analysisMyChart',
  state: {
    teacher: {
      data: {},
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/analysis/my-chart') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
            dispatch({ type: 'queryTeacherChart' })
          }
        }
      })
    },
  },

  effects: {
    * queryTeacherChart ({ }, { call, put }) {
      const { data, success } = yield call(queryTeacherStatInfo)
      if (success) {
        yield put({
          type: 'queryTeacherChartSuccess',
          payload: {
            data,
          },
        })
      }
    },
  },

  reducers: {
    queryTeacherChartSuccess (state, action) {
      return { ...state, teacher: action.payload }
    },
  },
}
