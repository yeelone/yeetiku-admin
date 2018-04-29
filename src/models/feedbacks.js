import {  query } from '../services/feedback'
import { parse } from 'qs'
import queryString from 'query-string'
export default {

  namespace: 'feedbacks',

  state: {
    list: [],
    currentItem: {},
    modalType: 'create',
    modalVisible: false,
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
      history.listen(({ pathname, search }) => {
        if (pathname === '/admin/feedback') {
          dispatch({
            type: 'query',
            payload:  queryString.parse(search),
          })
        }
      })
    }
  },

  effects: {
    *query ({ payload }, { call, put }) {
      const data = yield call(query, parse(payload))
      console.log(data)
      var page = {
        total: data.body.total ,
        current: Number(payload.page),
        pageSize: Number(payload.pageSize)
      }

      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.feedbacks,
            pagination:page,
          },
        })
      }
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
    updateState(state,action){
      return { ...state, ...action.payload }
    },
    showModal (state, action) {
        return { ...state, ...action.payload, modalVisible: true }
      },
    hideModal (state) {
        return { ...state, modalVisible: false }
    },
  },

}
