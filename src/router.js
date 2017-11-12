import React, { PropTypes } from 'react'
import { Router, Route, IndexRoute } from 'dva/router';
import AdminApp from './routes/app'

const cached = {}
const registerModel = (app, model) => {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: AdminApp,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
    },
    {
      path: '/admin',
      component: AdminApp,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'users',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/users'))
              cb(null, require('./routes/users/'))
            }, 'users')
          },
        },{
          path: 'groups',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/users'))// groups 依赖 users 
              registerModel(app, require('./models/groups'))
              cb(null, require('./routes/groups/'))
            }, 'groups')
          },
        },{
          path: 'tags',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/tags'))
              cb(null, require('./routes/tags/'))
            }, 'tags')
          },
        },
        {
          path: 'questions',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/categories'))
              registerModel(app, require('./models/questions'))
              cb(null, require('./routes/questions/'))
            }, 'questions')
          },
        },
        {
          path: 'banks',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/banks'))
              cb(null, require('./routes/banks/'))
            }, 'banks')
          },
        },
        {
          path: 'banks/:id',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/categories'))
              registerModel(app, require('./models/questions'))
              registerModel(app, require('./models/banks'))
              cb(null, require('./routes/banks/detail'))
            }, 'banks')
          },
        },
         {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        },
        {
          path: 'client',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/client'))
              cb(null, require('./routes/client/'))
            }, 'client')
          },
        }, 
        {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
  messager: PropTypes.object,
}

export default Routers
