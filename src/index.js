import './index.html'
import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import { browserHistory } from 'dva/router'
import { message } from 'antd'

const ERROR_MSG_DURATION = 3
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION) 
  },
})
app.use(createLoading())

// 2. Model
app.model(require('./models/messager'))
app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
