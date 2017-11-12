import { create, remove, update, query,queryRelatedUsers,addUsers } from '../services/groups'
import { routerRedux } from 'dva/router';
import { parse } from 'qs'

export default {

  namespace: 'groups',

  state:  {
    list: [],
    relateUserList:[],
    currentItem: {},
    modalVisible: false,
    selectorVisible: false, 
    modalType: 'create',
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`, 
      current: 1,
      total: 0,
      pageSize:10,
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/admin/groups') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
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
    queryUsersSuccess(state, action ){
      return { ...state, ...action.payload }
    },
    addUsersSuccess(state,action){
      return {...state, ...action.payload}
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    showSelector (state, action) {
      return { ...state, ...action.payload, selectorVisible: true }
    },
    hideSelector (state) {
      return { ...state, selectorVisible: false }
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
              list: data.body.groups,
              pagination:page,
            },
          })
        }
    },
    *queryUsers({ payload }, {select,call,put }){
        yield put({ type: 'showSelector'})
        const data = yield call(queryRelatedUsers, parse({id:payload.currentItem.id}))
  
        if ( data && data.success ){
          yield put({
            type: 'queryUsersSuccess',
            payload:{
                currentItem: payload.currentItem,
                relateUserList: data.body.users
            } 
          })
        }
    },
    *addUsers({payload},{select,call,put}){
        const id = yield select(({ groups }) => groups.currentItem.id)
        const data = yield call(addUsers, parse({id:id, users: payload.users}))
        if ( data && data.success ){
          yield put({
            type: 'addUsersSuccess'
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
            list: data.body.groups,
            pagination: data.page,
          },
        })
      }
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      const id = yield select(({ groups }) => groups.currentItem.id)
      const newGroup = { ...payload, id }
      const data = yield call(update, newGroup)
      const list = yield select(({ groups }) => groups.list)
      
      if (data && data.success) {
        const new_list = list.map((item)=>{
          if ( item.id === id ){
            return newGroup
          }else {
            return item 
          }
        })

        yield put({
          type: 'querySuccess',
          payload: {
            list: new_list,
          },
        })
      }
    },
  }
};
