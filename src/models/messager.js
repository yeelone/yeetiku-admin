//信息中心，作为一个统一的信息回馈调度中心。

const SUCCESS = 'success'
const ERROR = 'error'

export default {

  namespace: 'messager',

  state: {
    show:false, 
    status:'',    //网络请求状态，success , error 两种状态  
    body:'消息主体内容',      //消息主体内容
  },

  subscriptions: {
  },

  effects: {
    *show({payload},{put}){
        yield put({
          type: 'changeStatus',
          payload:{
            show:true, 
            ...payload
          },
        })
    }
  },

  reducers: {
    changeStatus (state, action) {
      return { ...state, ...action.payload  }
    }
  }

}
