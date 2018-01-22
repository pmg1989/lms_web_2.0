import { getCurPowers } from 'utils'

export default {
  namespace: 'analysisChart',
  state: {
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/analysis/chart') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
          }
        }
      })
    },
  },

  effects: {
  },

  reducers: {
  },
}
