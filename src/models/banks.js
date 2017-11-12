import { create, remove, update, query,queryByID,status } from '../services/banks'
import { saveRelatedQuestions ,queryRecords,queryRelatedQuestions,removeRelatedQuestions } from '../services/banks'
import { removeRelatedTag,saveTag,relatingTag,getTags,queryAllTags,deleteTag } from '../services/banks'
import { parse } from 'qs'

export default {

  namespace: 'banks',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    recordModalVisible:false,
    records:[],
    tagsTree:[],
    tagsTreeTotal:0,
    tags:[],
    tagsTotal:0, 
    modalType: 'create',
    relatedQuestions:[],
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize:10,
    },
    quesPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize:10,
    },
    recordPagination: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize:10,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/admin/banks') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }

        let re = /\/admin\/banks\/(.*)/g 
        //匹配URL 中的ID ：/admin/banks/1  
        let query = re.exec(location.pathname)
        if (!( _.isEmpty(query))) {
          if ( query[1] > 0  ) {
            //依赖于所有问题列表
            dispatch({
                type: 'questions/query',
                payload: {
                  page:1,
                  pageSize:10
                },
            })

            dispatch({
              type:'queryOne',
              payload:{
                id:query[1],
              }
            })

            dispatch({
              type:'queryDesignatedBankTags',
              payload:{
                id:query[1],
              }
            })

            dispatch({
              type:'queryAllTags',
              payload:{
                id:query[1],
              }
            })

        }
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
            list: data.body.banks,
            pagination:page,
          },
        })
      }
    },
    *queryOne ({ payload }, { call, put }) {
      const data = yield call( queryByID,parse({id:payload.id}) )
      if (data) {
        yield put({
          type: 'queryOneSuccess',
          payload: {
            currentItem: data.body.bank,
            ...payload,
          },
        })
      }
    },
    *queryQuestions({payload}, {call, put}){
        const data = yield call(queryRelatedQuestions, parse({...payload}))
        var page = {
          total: data.body.total ,
          current: Number(payload.page),
          pageSize: Number(payload.pageSize)
        }
        if ( data && data.success ){
          yield put({
            type: 'queryQuestionsSuccess',
            payload: {
              relatedQuestions:data.body.questions,
              quesPagination:page
            },
          })

          yield put({
            type: 'messager/show',
            payload:{
              status:'success',
              body:'请求关联题目成功！'
            }
          })
        } else {
          yield put({
            type: 'messager/show',
            payload:{
              status:'error',
              body:'请求关联题目失败，错误信息: ' +  data.message
            }
          })
        }
    },
    *saveRelatedQuestions({payload}, {select,call, put}){
      const id = yield select(({ banks }) => banks.currentItem.id)
      const questions = _.map(payload.questions, 'id'); // [12, 14, 16, 18]
      const data = yield call(saveRelatedQuestions, parse({id , questions }))
     
      if ( data && data.success ) {
        yield put({
          type: 'saveQuestionsSuccess',
          payload:{ 
            relatedQuestions:payload.questions
          }
        })

        yield put({
          type: 'messager/show',
          payload:{
            status:'success',
            body:'关联成功'
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
    *queryDesignatedBankTags({payload},{select, call, put }){
      const data = yield call(getTags, parse({id:payload.id}))
      if ( data && data.success ) {
        yield put({
          type: 'updateState',
          payload:{ 
            tags:data.body.tags,
            tagsTotal: data.body.total
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
    *queryAllTags({payload}, { call , put }){
      const data = yield call(queryAllTags)
      if (data && data.success){
        yield put({
          type: 'updateState',
          payload:{ 
            tagsTree:data.body.tags,
            tagsTreeTotal: data.body.total
          }
        })
      }
    },
    *saveRelatedTag({payload}, {select,call, put}){
      const id = yield select(({ banks }) => banks.currentItem.id)
      const data = yield call( relatingTag, parse({id, bank:id, tag:payload.tagID }))
      if ( data && data.success ) {
        yield put({
          type: 'banks/queryDesignatedBankTags',
          payload:{
            id,
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
    *saveTag({payload}, {select,call, put}){
      const parent = _.last(payload.branch) || 0 
      const id = yield select(({ banks }) => banks.currentItem.id)
      const data = yield call(saveTag, parse({id, bank:id, name:payload.name,parent }))

      if ( data && data.success ) {
        //将新标签添加到标签树中
        let tagsTree =  yield select(({ banks }) => banks.tagsTree)
        const tagsTreeTotal =  yield select(({ banks }) => banks.tagsTreeTotal)
   
        const newTag = data.body.tag
        if ( payload.branch.length === 2){
          tagsTree[payload.branch[0]]['children'][payload.branch[1]]['children'][newTag.id] =  {tag:newTag,children:{}}
        }else if ( payload.branch.length === 1){
          tagsTree[payload.branch[0]]['children'][newTag.id] =  {tag:newTag,children:{}}
        }else{
          tagsTree[newTag.id] =  {tag:newTag,children:{}}
        }

        yield put ({
          type: 'updateState',
          payload:{ 
            tagsTree,
            tagsTreeTotal:tagsTreeTotal+1
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
    *deleteTag({payload}, {select,call, put} ){
      const id = yield select(({ banks }) => banks.currentItem.id)
      const data = yield call(deleteTag, parse({id , tag:payload.tagID }))
      if ( data && data.success ) {
        //将新标签从标签树中移除
        let tagsTree =  yield select(({ banks }) => banks.tagsTree)
        const tagsTreeTotal =  yield select(({ banks }) => banks.tagsTreeTotal)
   
        if ( payload.branch.length === 2){
          tagsTree[payload.branch[0]]['children'][payload.branch[1]]['children'][payload.tagID] = {tag:null , children:null} 
        }else if ( payload.branch.length === 1){
          tagsTree[payload.branch[0]]['children'][payload.tagID] = {tag:null , children:null}   
        }else{
          tagsTree[payload.tagID] = {tag:null , children:null}   
        }

        yield put ({
          type: 'updateState',
          payload:{ 
            tagsTree,
            tagsTreeTotal: tagsTreeTotal-1 ,
          }
        })

        yield put({
          type: 'messager/show',
          payload:{
            status:'success',
            body:'成功删除标签，同时清除了所有该标签的关联关系'
          }
        })
      }else{
        yield put({
          type: 'messager/show',
          payload:{
            status:'error',
            body:'取消失败，请重试。错误信息: ' +  data.message
          }
        })
      }
    },
    *removeRelatedTag({payload}, {select, call , put}){
      const id = yield select(({ banks }) => banks.currentItem.id)
      const data = yield call(removeRelatedTag, parse({id , bank:id, tag:payload.tagID }))
      if ( data && data.success ) {
        yield put({
          type: 'banks/queryDesignatedBankTags',
          payload:{
            id,
          }
        })
      }else{
        yield put({
          type: 'messager/show',
          payload:{
            status:'error',
            body:'取消失败，请重试。错误信息: ' +  data.message
          }
        })
      }
    },
    *removeRelatedQuestions({payload}, {select,call, put}){
      const id = yield select(({ banks }) => banks.currentItem.id)
      const data = yield call(removeRelatedQuestions, parse({id , questions:payload.questions}))

      if ( data && data.success ) {
        let relatedQuestions = yield select(({ banks }) => banks.relatedQuestions)
        let ques = relatedQuestions.filter((element, index, array) => {
          if (_.indexOf(payload.questions, element.id )){
            return true 
          }else{
            return false
          }
        })

        yield put({
          type: 'removeQuestionsSuccess',
          payload:{
            relatedQuestions:ques
          }
        })

        yield put({
          type: 'messager/show',
          payload:{
            status:'success',
            body:'成功移除该题目'
          }
        })
      }else{
        yield put({
          type: 'messager/show',
          payload:{
            status:'error',
            body:'删除失败，请重试。错误信息: ' +  data.message
          }
        })
      }
    },
    *updateStatus({payload}, {select,call, put}){
      const data = yield call(status, parse({id: payload.id, status:payload.status}))

      if (data) {
        const list = yield select(({ banks }) => banks.list)
        const new_list = list.map((item)=>{
          if ( item.id === payload.id ){
            item.disable = !item.disable
            return item
          }else {
            return item
          }
        })

        yield put({
          type: 'changeStatusSuccess',
          list: new_list
        })
      }
    },
    *'delete' ({ payload }, { select, call, put }) {
      const data = yield call(remove, { id: payload.id })
      if (data && data.success) {
        const list = yield select(({ banks }) => banks.list)

        let new_list = list.filter((element, index, array) => {
          if (payload.id !== element.id ){
            return true 
          }else{
            return false
          }
        })
        
        yield put({
          type: 'querySuccess',
          payload: {
            list: new_list,
            pagination: {
              total: data.page.total,
              current: data.page.current,
            },
          },
        })
      }else {
        yield put({
          type: 'messager/show',
          payload:{
            status:'error',
            body:'删除失败，错误信息: ' + data.message
          }
        })
      }
    },
    *create ({ payload }, { select,call, put }) {
      yield put({ type: 'hideModal' })
      yield call(create, payload )
      const data = yield call(query, {})
      if (data && data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.body.banks,
            pagination: data.page,
          },
        })
      }
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      const data = yield call(update, payload)
      const list = yield select(({ banks }) => banks.list)
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
    *switchIsMotion ({ payload }, { put }) {
      yield put({
        type: 'handleSwitchIsMotion',
      })
    },
    *queryRecords({payload},{call,put}){
        const data = yield call(queryRecords,parse({...payload}))
        var page = {
          total: data.body.total ,
          current: Number(payload.page),
          pageSize: Number(payload.pageSize)
        }

        if (data && data.success) {
          yield put({
            type: 'queryRecordsSuccess',
            payload:{
              records: data.body.records,
              recordPagination:page
            }
            
          })
        } else {
            yield put({
              type: 'messager/show',
              payload:{
                status:'error',
                body:'获取记录失败，错误信息: ' +  data.message
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
    queryOneSuccess(state, action) {
      return { ...state,...action.payload  }
    },
    changeStatusSuccess(state,action){
       return { ...state , list: action.list }
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
    setCurrentItem(state,action){
      return {...state, currentItem: action.payload.currentItem }
    },
    saveQuestionsSuccess(state, action ){
      return { ...state, ...action.payload }
    },
    removeQuestionsSuccess(state, action ){
      return { ...state, ...action.payload }
    },
    updateImageUrl(state,action){
      let  { currentItem }  = state
      if ( currentItem === undefined ) {
        currentItem = {}
      }
      currentItem.image = action.payload.imageUrl
      return { ...state, currentItem }
    },
    queryRecordsSuccess(state,action){
      return { ...state, ...action.payload }
    },
    queryQuestionsSuccess(state, action){
      const { relatedQuestions, quesPagination } = action.payload
      return { ...state,
        relatedQuestions,
        quesPagination: {
          ...state.pagination,
          ...quesPagination,
        } }
    },
    updateState(state,action){
      return { ...state, ...action.payload }
    }
  },

}
