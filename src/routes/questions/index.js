import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import queryString from 'query-string'
import App from '../app'
import QuestionList from './QuestionList'
import QuestionFilter from './QuestionFilter'
import QuestionModal from './QuestionModal'
import QuestionImportModal from './QuestionImportModal'
import QuestionCategoryTree from './QuestionCategoryTree'
import { listToTree,config } from '../../utils'
import { Layout } from 'antd'
const {  Sider, Content } = Layout

import styles from './styles.less'

function Questions ({ location, dispatch, questions,categories, loading }) {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion,importModalVisible,importResult } = questions
  const {search, pathname } = location
  var { field, keyword } = queryString.parse(search)
  const query = { field, keyword }

  const QuestionModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    categories:categories.list,
    onOk (data) {
      dispatch({
        type: `questions/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'questions/hideModal',
      })
    },
  }

  const QuestionImportModalProps = {
    type: modalType,
    visible: importModalVisible,
    onOk (data) {
    },
    onCancel () {
      dispatch({
        type: 'questions/hideImportModal',
      })
    },
  }

  const CategoriesProps = {
    categories,
    dispatch,
    onSelect(id){
      if ( id ){
        dispatch({
          type: 'categories/setCurrentItem',
          payload: { id },
        })
  
        dispatch({
          type:'questions/query',
          payload:{ category: id }
        })
      }
      
    }
  }

  const QuestionListProps = {
    dataSource: list,
    categories: categories ,
    dispatch,
    loading,
    pagination,
    location,
    isMotion,
    onPageChange (page) {
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'questions/delete',
        payload: {
          ids: [id]
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type:'questions/queryOne',
        payload:{
          id: item.id,
          modalVisible: true,
          modalType: 'update',
        }
      })
    },
    onMoveItem (item,category){
      if (!category) return 
      dispatch({
        type: 'questions/changeCategory',
        payload: {
          id:item.id , 
          category,
        },
      })
    }
  }

  const QuestionFilterProps = {
    field,
    keyword,
    importResult,
    isMotion,
    onDeleteImportResult(){
      dispatch({
        type: 'questions/deleteImportResult',
      })
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin/questions',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/admin/questions',
      }))
    },
    onAdd () {
      dispatch({
        type: 'questions/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    onImport(){
      dispatch({
        type: 'questions/showImportModal',
        payload: {
          modalType: 'import',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'questions/switchIsMotion' })
    },
  }


  return (
    <App location={location}>
    <div className="content-inner"> 
      <Layout className={styles.layout}>
        <Sider className={styles.layout_sider}>
          <QuestionCategoryTree {...CategoriesProps}/>
        </Sider>
        <Content>
          <QuestionFilter {...QuestionFilterProps} />
          <QuestionList {...QuestionListProps} />
          { modalVisible? <QuestionModal {...QuestionModalProps} /> :null }
          { importModalVisible? <QuestionImportModal {...QuestionImportModalProps} /> :null }
        </Content>
      </Layout>
    </div>
    </App>
  )
}

Questions.propTypes = {
  questions: PropTypes.object,
  categories: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ questions, categories,loading }) => ({ questions,categories, loading: loading.models.questions }))(Questions)
