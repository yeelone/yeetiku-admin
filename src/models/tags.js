import { create, remove, update, query } from '../services/tags'
import { parse } from 'qs'
import queryString from 'query-string'
export default {

  namespace: 'tags',

  state:  {
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
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen( ({search,pathname}) => {
        if (pathname === '/admin/tags') {
          dispatch({
            type: 'query',
            payload: queryString.parse(search),
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
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
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
            list: data.body.tags,
            pagination:page,
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
            list: data.body.tags,
            pagination: data.page,
          },
        })
      }
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      const id = yield select(({ tags }) => tags.currentItem.id)
      const newTag = { ...payload, id }
      const data = yield call(update, newTag)
      const list = yield select(({ tags }) => tags.list)
      if (data && data.success) {
        const new_list = list.map((item)=>{
          if ( item.id === id ){
            return newTag
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
