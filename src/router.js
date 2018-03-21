import React from 'react'
import PropTypes from 'prop-types'
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

  const Comments = dynamic({
    app,
    models: () => [
      require('./models/comments'),
    ],
    component: () => require('./routes/comments/'),
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
            <Route exact path="/admin/comments" component={Comments} />
            <Route exact path="/admin/client" component={ClientConfig} />
          </Switch>
        </Router>
      ) 
} 


export default RouterConfig
