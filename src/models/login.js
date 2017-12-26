import { routerRedux } from 'dva/router'
import { dashboard } from 'config'
import { setLoginIn, menu } from 'utils'
import { login } from 'services/login'

function getAllPathPowers (menuArray, curPowers) {
  return menuArray.reduce((dir, item) => {
    dir[`/${item.key}`] = curPowers[item.id]
    if (item.children) {
      item.children.reduce((cdir, cur) => {
        dir[`/${cdir}/${cur.key}`] = curPowers[cur.id]
        return cdir
      }, item.key)
      getAllPathPowers(item.children, curPowers)
    }
    return dir
  }, {})
}

export default {
  namespace: 'login',
  state: {
  },
  effects: {
    * submit ({
      payload,
    }, { call, put, select }) {
      const { success, data } = yield call(login, {
        username: payload.username,
        password: payload.password,
      })
      data.role_power = {
        1: [1, 2],
        2: [1],
        21: [1, 2, 3, 4, 5],
        22: [1, 2, 3, 4, 5, 6],
        23: [2, 3],
        24: [2, 4, 12, 13],
        25: [2],
        3: [1],
        31: [1, 2, 3, 4, 5, 6],
        32: [1, 2, 3, 4, 5, 6, 8, 9],
        33: [1, 2, 4, 6, 10, 11],
        4: [1],
        41: [1, 2, 4],
      }

      if (success) {
        yield put({
          type: 'app/loginSuccess',
          payload: {
            user: data,
            userPower: data.role_power,
          },
        })

        const allPathPowers = getAllPathPowers(menu, data.role_power)
        setLoginIn(data, allPathPowers, payload)

        const nextLocation = yield select(state => state.routing.locationBeforeTransitions)
        const nextPathname = nextLocation.state && nextLocation.state.nextPathname && nextLocation.state.nextPathname !== '/no-power' ? nextLocation.state.nextPathname : dashboard
        yield put(routerRedux.push({
          pathname: nextPathname,
          search: nextLocation.state && nextLocation.state.nextSearch,
        }))
      }
    },
  },
  reducers: {
  },
}
