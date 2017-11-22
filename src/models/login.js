import { routerRedux } from 'dva/router'
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
        21: [1, 2, 3, 4, 5, 6, 8, 9],
        22: [1, 2, 3, 4, 5],
        23: [1, 2, 3, 4, 5],
        3: [1],
        31: [1, 2, 4],
      }
      const allPathPowers = getAllPathPowers(menu, data.role_power)
      setLoginIn(data, allPathPowers)

      if (success) {
        yield put({
          type: 'app/loginSuccess',
          payload: {
            user: data,
            userPower: data.role_power,
          },
        })

        const nextLocation = yield select(state => state.routing.locationBeforeTransitions)
        const nextPathname = nextLocation.state && nextLocation.state.nextPathname && nextLocation.state.nextPathname !== '/no-power' ? nextLocation.state.nextPathname : '/dashboard'
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
