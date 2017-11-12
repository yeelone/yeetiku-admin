import { create, remove, update, query } from '../services/categories'
import { parse } from 'qs'

export default {

  namespace: 'categories',

  state: {
    list: [],
    currentItemID:0
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      dispatch({
        type:'query',
      })
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      const data = yield call(query, parse(payload))

      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.categories,
          },
        })
      }
    },
    *'delete' ({ payload }, { call, put }) {
      yield call(remove, { id: payload.id })
      const data = yield call(query, parse(payload))
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.categories,
          },
        })
      }
    },
    *create ({ payload }, { call, put }) {
      yield call(create, payload)
      const data = yield call(query, {})
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.categories,
          },
        })
      }
    },
    *update ({ payload }, { select, call, put }) {
      const data = yield call(update, payload)
      const list = yield select(({ categories }) => categories.list)
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list,
          },
        })
      }
    },
  },
  reducers: {
    querySuccess (state, action) {
      const { list  } = action.payload
      return { ...state, list }
    },
    setCurrentItem(state,action){
      return {...state, currentItemID: action.payload.id }
    }
  },

}
