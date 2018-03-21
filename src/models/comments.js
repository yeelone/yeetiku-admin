import { remove, query } from '../services/comments'
import queryString from 'query-string'
import { parse } from 'qs'
export default {
  namespace: 'comments',

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
        history.listen(({ pathname, search }) => {
          if (pathname === '/admin/comments') {
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
        var page = {
          total: data.body.total ,
          current: Number(payload.page),
          pageSize: Number(payload.pageSize)
        }
  
        if (data) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.body.comments,
              pagination:page,
            },
          })
        }
      },
      *'delete' ({ payload }, { select,call, put }) {
        const data = yield call(remove, { ...payload })
        if (data && data.success) {
          const list = yield select(({ comments }) => comments.list)
  
          let new_list = list.filter((element, index, array) => {
            if (_.indexOf(payload.ids, element.id )){
              return true 
            }else{
              return false
            }
          })
  
          yield put({
            type: 'updateState',
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
      }
  },
}
