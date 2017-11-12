import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL } from '../utils'
import { saveToken } from '../utils/jwtToken'

export default {
  
  namespace: 'login',

  state: {
    loginLoading: false,
  },

  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.success) {
        const token = data.token
        saveToken(token)
        // yield put({ type: 'app/queryCurrentUser' })
        yield put({ type:'app/setUser', payload:{ user: data.body.user }  })

        const from = queryURL('from')
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/admin/dashboard'))
        }
      } else {
        throw data
      }
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
    
  },
}
