import { getCurPowers, Cookie } from 'utils'
import { message } from 'antd'
import { Base64 } from 'js-base64'
import { update } from 'services/system/modifyPassword'

export default {
  namespace: 'systemModifyPassword',
  state: {
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/system/modify-password') {
          const curPowers = getCurPowers(pathname)
          if (curPowers) {
            dispatch({ type: 'app/changeCurPowers', payload: { curPowers } })
          }
        }
      })
    },
  },

  effects: {
    * update ({ payload }, { call, select }) {
      const { oldPassword, password } = payload
      const { userid } = yield select(state => state.app.user)
      const { success } = yield call(update, {
        oldpassword: oldPassword,
        password,
        userid,
      })
      if (success) {
        Cookie.set('user_password', Base64.encode(password))
        message.success('恭喜你，密码修改成功，可尝试注销重新登录！', 3)
      }
    },
  },

  reducers: {
  },
}
