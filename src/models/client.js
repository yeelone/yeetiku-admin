import { saveConfig,getConfig} from '../services/client'
import { parse } from 'qs'

export default {
  namespace: 'client',

  state: {
    name: "",
    domain:"",
    apiPrefix:"",
    splashImage:"",
    logoImage:"",
  },

  subscriptions: {
    setup ({ dispatch ,history }) {
      history.listen(location => {
        if (location.pathname === '/admin/client') {
          dispatch({
            type: 'getAppConfig',
          })
        }
      })
    },
  },
  effects: {
    *saveAppConfig({ payload }, { call, put }) {
      const data = yield call(saveConfig, parse(payload.data))
      if ( data && data.success ) {
        yield put({
          type: 'messager/show',
          payload:{
            status:'success',
            body:'保存成功'
          }
        })
      }else{
        yield put({
          type: 'messager/show',
          payload:{
            status:'error',
            body:'关联失败，请重试。错误信息: ' +  data.message
          }
        })
      }
    },
    *getAppConfig({payload},{call, put}){
      const data = yield call(getConfig)
      console.log(data)
      if ( data && data.success ){
        var config = data.body.config 
        yield put({
          type: 'updateConfig',
          payload:{
            ...config
          }
        })
      }
    }
  },
  reducers: {
    updateSplashImageUrl(state,action){
        return { ...state, splashImage: action.payload.splashImage}
    },
    updateLogoImageUrl(state,action){
        return { ...state, logoImage: action.payload.logoImage}
    },
    updateConfig(state,action){
      return { ...state , ...action.payload}
    }
  },
}
