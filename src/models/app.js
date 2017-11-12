import { getUserInfo, logout } from '../services/app'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { config } from '../utils'
import { removeToken } from '../utils/jwtToken'
const { prefix } = config

export default {
  namespace: 'app',

  state: {
    user: {} ,
    loginButtonLoading: false,
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history  }) {
      window.onresize = () => {
        dispatch({ type: 'changeNavbar' })
      }

      history.listen(location => {
        if (location.pathname ) {
          dispatch({ type: 'queryCurrentUser'})
        }
      })
    },
  },

  effects: {
    *setUser({payload}, { call, put }){
      yield put({
        type: 'setCurrentUser',
        payload:{
          user : payload.user 
        }
      })
    },
    *queryCurrentUser ({ payload }, { select,call, put }) {
      const data = yield call(getUserInfo)
      if (data.success && data.body.user) {
        yield put({
          type: 'queryUserSuccess',
          payload:{
            user:data.body.user,
          }
        })
        if (location.pathname === '/admin/login') {
          yield put(routerRedux.push('/admin/dashboard'))
        }
      } else {
       
        if (location.pathname !== '/admin/login') {
          let from = location.pathname
          if (location.pathname === '/admin/dashboard') {
            from = '/admin/dashboard'
          }
          window.location = `${location.origin}/admin/login?from=${from}`
        }
      }
    },
    *logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      removeToken()
      window.location = `${location.origin}/admin/login`
    },
    *switchSider ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchSider',
      })
    },
    *changeTheme ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleChangeTheme',
      })
    },
    *changeNavbar ({
      payload,
    }, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: 'showNavbar' })
      } else {
        yield put({ type: 'hideNavbar' })
      }
    },
    *switchMenuPopver ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchMenuPopver',
      })
    },
  },
  reducers: {
    queryUserSuccess (state, action ) {
      return {
        ...state,
        ...action.payload,
      }
    },
    showLoginButtonLoading (state) {
      return {
        ...state,
        loginButtonLoading: true,
      }
    },
    handleSwitchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    handleChangeTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },
    showNavbar (state) {
      return {
        ...state,
        isNavbar: true,
      }
    },
    hideNavbar (state) {
      return {
        ...state,
        isNavbar: false,
      }
    },
    handleSwitchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },
    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
    setCurrentUser(state,action){
      return {
        ...state,
        user: action.payload.user,
      }
    },
  },
}
