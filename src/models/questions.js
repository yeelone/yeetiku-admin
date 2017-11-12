import { create, remove, update, query,queryByID,queryImportResult, changeCategory ,removeImportResult} from '../services/questions'
import { parse } from 'qs'

export default {

  namespace: 'questions',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    importModalVisible: false, 
    modalType: 'create',
    importResult:null, 
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize:1,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/admin/questions'  ) {
          dispatch({
            type: 'query',
            payload: location.query,
          })
          dispatch({
            type:'queryImportResult',
          })
        }
      })
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      const data = yield call(query, parse(payload))
      var page = {
        total: data.body.total ,
        current: Number(payload.page),
        pageSize: Number(payload.pageSize)
      } 

      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.questions,
            pagination:page,
          },
        })
      }
    },
    *queryOne ({ payload }, { call, put }) {
      const data = yield call( queryByID,parse({id:payload.id}) )
      if (data && data.success ) {
        yield put({
          type: 'queryOneSuccess',
          payload: {
            currentItem: data.body.question,
            ...payload,
          },
        })
      }
    },
    *queryImportResult({payload},{select,call,put}){
      const user = yield select(({ app }) => app.user)
      const data = yield call(queryImportResult, parse({userID:user.id}))
      if (data && data.success) {
        yield put({
          type: 'setImportResult',
          payload: {
            importResult:data['body']['result'],
          },
        })
      }
    },
    *deleteImportResult({payload}, {select, call, put }){
      const user = yield select(({ app }) => app.user)
      const data = yield call(removeImportResult, parse({userID:user.id}))
      if (data && data.success) {
        yield put({
          type: 'setImportResult',
          payload: {
            importResult:"",
          },
        })
      }
      
    },
    *'delete' ({ payload }, { select,call, put }) {
      const data = yield call(remove, { ...payload })
      if (data && data.success) {
        const list = yield select(({ questions }) => questions.list)

        let new_list = list.filter((element, index, array) => {
          if (_.indexOf(payload.ids, element.id )){
            return true 
          }else{
            return false
          }
        })


        yield put({
          type: 'deleteSuccess',
          payload: {
            list: new_list,
          },
        })
      }else{
         yield put({
              type: 'messager/show',
              payload:{
                status:'error',
                body:'删除失败 ' +  data.message
              }
            })
      }
    },
    *create ({ payload }, { select,call, put }) {
      yield put({ type: 'hideModal' })
      const cat = yield select(({ categories }) => categories.currentItemID)
      yield call(create, {...payload, category:cat } )
      const data = yield call(query, {})
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.questions,
            pagination: data.page,
          },
        })
      }
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      const data = yield call(update, payload)
      const list = yield select(({ questions }) => questions.list)
      const new_list = list.map((item)=>{
        if ( item.id === payload.id ){
          return payload
        }else {
          return item 
        }
      })
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: new_list,
          },
        })
      }
    },
    *changeCategory({payload}, { select , call , put }){
      const data = yield call(changeCategory, payload)
      if ( data && data.success){
      }else{
        yield put({
          type: 'messager/show',
          payload:{
            status:'error',
            body:'删除失败 ' +  data.message
          }
        })
      }
    },
    *switchIsMotion ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchIsMotion',
      })
    },
  },
  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    queryOneSuccess(state, action) {
      const { currentItem } = action.payload
      return { ...state,...action.payload, currentItem }
    },
    deleteSuccess(state,action){
      return { ...state,...action.payload }
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    showImportModal (state, action) {
      return { ...state, ...action.payload, importModalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    hideImportModal (state) {
      return { ...state, importModalVisible: false }
    },
    handleSwitchIsMotion (state) {
      localStorage.setItem('antdAdminUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
    setCurrentLoginedUser(state,action){
      localStorage.setItem('currentQuestion',action.payload)
      return { ...state, ...action.payload }
    },
    setImportResult(state,action){
      return { ...state, ...action.payload }
    }
  },

}
