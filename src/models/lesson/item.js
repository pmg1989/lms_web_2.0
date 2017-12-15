import { getCurPowers } from 'utils'

export default {
  namespace: 'lessonItem',
  state: {
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/lesson/create') {
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
