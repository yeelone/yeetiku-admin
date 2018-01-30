import { create, remove, update, query,reset } from '../services/users'
import { parse } from 'qs'
import queryString from 'query-string'
export default {

  namespace: 'users',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize:10,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({search,pathname}) => {
        if (pathname === '/admin/users') {
          dispatch({
            type: 'query',
            payload: queryString.parse(search),
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

      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.users,
            pagination:page,
          },
        })
      }
    },
    *'delete' ({ payload }, { select , call, put }) {
      const data = yield call(remove, {...payload})
      if (data && data.success) {
        const list = yield select(({ users }) => users.list)

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
      }
    },
    *create ({ payload }, { call, put }) {
      yield put({ type: 'hideModal' })
      yield call(create, payload)
      const data = yield call(query, {})
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.users,
            pagination: data.page,
          },
        })
      }
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      const id = yield select(({ users }) => users.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      const list = yield select(({ users }) => users.list)
      const new_list = list.map((item)=>{
        if ( item.id === id ){
          return newUser
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
    *resetPassword({payload},{select,call,put}){
      // payload = { id: 1 }
       const data = yield call(reset, parse( payload ) )
       console.log(data)
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
    deleteSuccess(state,action){
      return { ...state,...action.payload }
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    handleSwitchIsMotion (state) {
      localStorage.setItem('antdAdminUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
    setCurrentLoginedUser(state,action){
      localStorage.setItem('currentUser',action.payload)
      return { ...state, ...action.payload }
    }
  },

}
