import { routerRedux } from 'dva/router'
import { navOpenKeys } from 'config'
import { Cookie, isLogin, getUserInfo, setLoginOut, renderMessages } from 'utils'
import { logout, queryMessageList, readMessage, queryComingLessons } from 'services/app'

const initPower = Cookie.getJSON('user_power')

export default {
  namespace: 'app',
  state: {
    login: !!isLogin(),
    user: getUserInfo(),
    menuPopoverVisible: false,
    siderFold: localStorage.getItem('antdAdminSiderFold') === 'true',
    darkTheme: localStorage.getItem('antdAdminDarkTheme') !== 'false',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem('navOpenKeys') || navOpenKeys), // 侧边栏菜单打开的keys,
    userPower: initPower,
    curPowers: [],
    messageList: [],
    comingLessons: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      window.onresize = function () {
        dispatch({ type: 'changeNavbar' })
      }

      if (!isLogin()) {
        dispatch(routerRedux.push({
          pathname: '/login',
          state: { nextPathname: location.pathname !== '/login' ? location.pathname : '/lesson/calendar', nextSearch: location.search },
        }))
      }

      history.listen(({ pathname }) => {
        if (!['/login', '/no-power'].includes(pathname)) {
          dispatch({ type: 'queryMessageList' })
        }
      })
    },
  },
  effects: {
    * logout ({ }, { call, put }) {
      yield call(logout)
      yield setLoginOut()
      yield put({ type: 'logoutSuccess' })
      yield put(routerRedux.push({
        pathname: '/login',
        state: { nextPathname: location.pathname, nextSearch: location.search },
      }))
    },
    * queryMessageList ({}, { call, put }) {
      const { data, success } = yield call(queryMessageList, { read: 0 })
      if (success) {
        yield put({
          type: 'queryMessageListSuccess',
          payload: {
            messageList: renderMessages(data),
          },
        })
      }
    },
    * readMessage ({ payload }, { call, put }) {
      const { success } = yield call(readMessage, payload)
      if (success) {
        yield put({
          type: 'readMessageSuccess',
          payload,
        })
      }
    },
    * queryComingLessons ({ }, { call, put }) {
      const { data, success } = yield call(queryComingLessons)
      if (success) {
        yield put({
          type: 'queryComingLessonsSuccess',
          payload: {
            comingLessons: (data[0] && data[0].list) || [],
          },
        })
      }
    },
  },
  reducers: {
    loginSuccess (state, action) {
      return { ...state, ...action.payload, login: true }
    },
    logoutSuccess (state) {
      return { ...state, login: false, userPower: {}, curPowers: [] }
    },
    switchSider (state) {
      localStorage.setItem('antdAdminSiderFold', !state.siderFold)
      return { ...state, siderFold: !state.siderFold }
    },
    changeTheme (state) {
      localStorage.setItem('antdAdminDarkTheme', !state.darkTheme)
      return { ...state, darkTheme: !state.darkTheme }
    },
    changeNavbar (state) {
      return { ...state, isNavbar: document.body.clientWidth < 769 }
    },
    switchMenuPopver (state) {
      return { ...state, menuPopoverVisible: !state.menuPopoverVisible }
    },
    handleNavOpenKeys (state, action) {
      return { ...state, ...action.payload }
    },
    changeCurPowers (state, action) {
      return { ...state, ...action.payload }
    },
    queryMessageListSuccess (state, action) {
      return { ...state, ...action.payload }
    },
    readMessageSuccess (state, action) {
      const { id } = action.payload
      const messageList = state.messageList.filter(item => item.id !== id)
      return { ...state, messageList }
    },
    queryComingLessonsSuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
