import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import queryString from 'query-string'
import App from '../app'
import TagList from './TagList'
import TagModal from './TagModal'
import TagFilter from './TagFilter'

function Tags ({ location, dispatch, tags, loading }) {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion } = tags
  const { search, pathname } = location
  var query = queryString.parse(search)

  const tagModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk (data) {
      dispatch({
        type: `tags/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'tags/hideModal',
      })
    },
  }

  const tagListProps = {
    dataSource: list,
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
        type: 'tags/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'tags/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const tagFilterProps = {
    ...query,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin/tags',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/admin/tags',
      }))
    },
    onAdd () {
      dispatch({
        type: 'tags/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'tags/switchIsMotion' })
    },
  }
  
  const TagModalGen = () =>
    <TagModal {...tagModalProps} />

  return (
    <App location={location}>
    <div className="content-inner">
        <TagFilter {...tagFilterProps} />
        <TagList {...tagListProps} />
        <TagModalGen />
    </div>
    </App>
  )
}

Tags.propTypes = {
  tags: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ tags, loading }) => ({ tags, loading: loading.models.tags }))(Tags)
