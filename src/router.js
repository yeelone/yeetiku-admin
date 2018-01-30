import React from 'react'
import PropTypes from 'prop-types'
// import { Router, Route, IndexRoute } from 'dva/router'
// import AdminApp from './routes/app'

// const cached = {}
// const registerModel = (app, model) => {
//   if (!cached[model.namespace]) {
//     app.model(model)
//     cached[model.namespace] = 1
//   }
// }
import { Router, Switch, Route } from 'dva/router' 
import dynamic from 'dva/dynamic' 

function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
         app,
         component: () => require('./routes/app'),
       }) 
  
  const AdminLogin = dynamic({
    app,
    models: () =>  [
      require('./models/login'),
    ],
    component: () => require('./routes/login/'),
  }) 

  const Dashboard = dynamic({
    app,
    component: () => require('./routes/dashboard/'),
  }) 

  const Users = dynamic({
    app,
    models: () => [
      require('./models/users'),
    ],
    component: () => require('./routes/users/'),
  }) 

  const Groups = dynamic({
    app,
    models: () => [
      require('./models/users'),
      require('./models/groups'),
    ],
    component: () => require('./routes/groups/'),
  }) 

  const Tags = dynamic({
    app,
    models: () => [
      require('./models/tags'),
    ],
    component: () => require('./routes/tags/'),
  }) 

  const Questions = dynamic({
    app,
    models: () => [
      require('./models/categories'),
      require('./models/questions'),
    ],
    component: () => require('./routes/questions/'),
  }) 

  const Banks = dynamic({
    app,
    models: () => [
      require('./models/banks'),
    ],
    component: () => require('./routes/banks/'),
  }) 

  const BankDetail = dynamic({
    app,
    models: () => [
      require('./models/categories'),
      require('./models/questions'),
      require('./models/banks'),
    ],
    component: () => require('./routes/banks/detail'),
  }) 

  const ClientConfig = dynamic({
    app,
    models: () => [
      require('./models/client'),
    ],
    component: () => require('./routes/client/'),
  }) 

  return (
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={IndexPage} />
            <Route exact path="/admin/dashboard" component={Dashboard} />
            <Route exact path="/admin/banks" component={Banks} />
            <Route exact path="/admin/banks/:id" component={BankDetail} />
            <Route exact path="/admin/questions" component={Questions} />
            <Route exact path="/admin/users" component={Users} />
            <Route exact path="/admin/groups" component={Groups} />
            <Route exact path="/admin/tags" component={Tags} />
            <Route exact path="/admin/login" component={AdminLogin} />
            <Route exact path="/admin/client" component={ClientConfig} />
          </Switch>
        </Router>
      ) 
} 

// const Routers = function ({ history, app }) {
//   const routes = [
//     {
//       path: '/',
//       component: AdminApp,
//       getIndexRoute (nextState, cb) {
//         require.ensure([], require => {
//           cb(null, { component: require('./routes/dashboard/') })
//         }, 'dashboard')
//       },
//     },
//     {
//       path: '/admin',
//       component: AdminApp,
//       getIndexRoute (nextState, cb) {
//         require.ensure([], require => {
//           cb(null, { component: require('./routes/dashboard/') })
//         }, 'dashboard')
//       },
//         }, {
//           path: 'users',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               registerModel(app, require('./models/users'))
//               cb(null, require('./routes/users/'))
//             }, 'users')
//           },
//         },{
//           path: 'groups',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               registerModel(app, require('./models/users'))// groups 依赖 users 
//               registerModel(app, require('./models/groups'))
//               cb(null, require('./routes/groups/'))
//             }, 'groups')
//           },
//         },{
//           path: 'tags',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               registerModel(app, require('./models/tags'))
//               cb(null, require('./routes/tags/'))
//             }, 'tags')
//           },
//         },
//         {
//           path: 'questions',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               registerModel(app, require('./models/categories'))
//               registerModel(app, require('./models/questions'))
//               cb(null, require('./routes/questions/'))
//             }, 'questions')
//           },
//         },
//         {
//           path: 'banks',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               registerModel(app, require('./models/banks'))
//               cb(null, require('./routes/banks/'))
//             }, 'banks')
//           },
//         },
//         {
//           path: 'banks/:id',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               registerModel(app, require('./models/categories'))
//               registerModel(app, require('./models/questions'))
//               registerModel(app, require('./models/banks'))
//               cb(null, require('./routes/banks/detail'))
//             }, 'banks')
//           },
//         },
//          {
//           path: 'login',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               registerModel(app, require('./models/login'))
//               cb(null, require('./routes/login/'))
//             }, 'login')
//           },
//         },
//         {
//           path: 'client',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               registerModel(app, require('./models/client'))
//               cb(null, require('./routes/client/'))
//             }, 'client')
//           },
//         }, 
//         {
//           path: '*',
//           getComponent (nextState, cb) {
//             require.ensure([], require => {
//               cb(null, require('./routes/error/'))
//             }, 'error')
//           },
//         },
//       ],
//     },
//   ]

//   return <Router history={history} routes={routes} />
// }

// Routers.propTypes = {
//   history: PropTypes.object,
//   app: PropTypes.object,
//   messager: PropTypes.object,
// }

export default RouterConfig
