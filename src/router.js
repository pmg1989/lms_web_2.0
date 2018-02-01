import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import { isLogin } from 'utils'
import App from './routes/App'

function redirectToLogin (nextState, replace) {
  if (!isLogin()) {
    replace({
      pathname: '/login',
      state: {
        nextPathname: nextState.location.pathname,
        nextSearch: location.search,
      },
    })
  }
}

function redirectToDashboard (nextState, replace) {
  if (isLogin()) {
    replace('/')
  }
}

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      onEnter: redirectToLogin,
      getIndexRoute (nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/lesson/calendar'))
          cb(null, { component: require('./routes/lesson/Calendar') })
        }, 'dashboard')
      },
      childRoutes: [
        // dashboard
        {
          path: 'dashboard',
          name: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/Dashboard'))
            }, 'dashboard')
          },
        },
        // lesson
        {
          path: 'lesson',
          name: 'lesson',
          childRoutes: [
            {
              path: 'calendar',
              name: 'calendar',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/lesson/calendar'))
                  cb(null, require('./routes/lesson/Calendar'))
                }, 'lesson-calendar')
              },
            },
            {
              path: 'list',
              name: 'list',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/lesson/list'))
                  cb(null, require('./routes/lesson/List'))
                }, 'lesson-list')
              },
            },
            {
              path: 'create',
              name: 'create',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/lesson/item'))
                  cb(null, require('./routes/lesson/Item'))
                }, 'lesson-item')
              },
            },
            {
              path: 'update',
              name: 'update',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/lesson/item'))
                  registerModel(app, require('./models/lesson/student'))
                  cb(null, require('./routes/lesson/Item'))
                }, 'lesson-item')
              },
            },
            {
              path: 'detail',
              name: 'detail',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/lesson/item'))
                  registerModel(app, require('./models/lesson/student'))
                  cb(null, require('./routes/lesson/Item'))
                }, 'lesson-item')
              },
            },
          ],
        },
        // account
        {
          path: 'account',
          name: 'account',
          childRoutes: [
            {
              path: 'admin',
              name: 'admin',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/account/admin'))
                  cb(null, require('./routes/account/Admin'))
                }, 'account-admin')
              },
            }, {
              path: 'user',
              name: 'user',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/account/user'))
                  cb(null, require('./routes/account/User'))
                }, 'account-user')
              },
            }, {
              path: 'role',
              name: 'role',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/account/role'))
                  cb(null, require('./routes/account/Role'))
                }, 'account-role')
              },
            },
          ],
        },
        // system
        {
          path: 'system',
          name: 'system',
          childRoutes: [
            {
              path: 'modify-password',
              name: 'modify-password',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/system/modifyPassword'))
                  cb(null, require('./routes/system/ModifyPassword'))
                }, 'modify-password')
              },
            },
          ],
        },
        // analysis
        {
          path: 'analysis',
          name: 'analysis',
          childRoutes: [
            {
              path: 'report',
              name: 'report',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/analysis/report'))
                  cb(null, require('./routes/analysis/Report'))
                }, 'analysis-report')
              },
            },
            {
              path: 'chart',
              name: 'chart',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/analysis/chart'))
                  cb(null, require('./routes/analysis/Chart'))
                }, 'analysis-chart')
              },
            },
            {
              path: 'my-chart',
              name: 'my-chart',
              getComponent (nextState, cb) {
                require.ensure([], (require) => {
                  registerModel(app, require('./models/analysis/my-chart'))
                  cb(null, require('./routes/analysis/MyChart'))
                }, 'analysis-my-chart')
              },
            },
          ],
        },
        // no-power
        {
          path: 'no-power',
          name: 'no-power',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/NoPower'))
            }, 'no-power')
          },
        },
      ],
    },
    // login
    {
      path: 'login',
      name: 'login',
      onEnter: redirectToDashboard,
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/login'))
          cb(null, require('./routes/Login'))
        }, 'login')
      },
    },
    // demo
    {
      path: 'demo',
      name: 'demo',
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./routes/Demo'))
        }, 'demo')
      },
    },
    // *
    {
      path: '*',
      name: 'error',
      getComponent (nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('./routes/Error'))
        }, 'error')
      },
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
}

export default Routers
