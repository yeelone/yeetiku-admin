import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'

import TagList from './TagList'
import TagModal from './TagModal'
import TagFilter from './TagFilter'

function Tags ({ location, dispatch, tags, loading }) {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion } = tags
  const { field, keyword } = location.query

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
      const { query, pathname } = location
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
    field,
    keyword,
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
    <div className="content-inner">
        <TagFilter {...tagFilterProps} />
        <TagList {...tagListProps} />
        <TagModalGen />
    </div>
  )
}

Tags.propTypes = {
  tags: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ tags, loading }) => ({ tags, loading: loading.models.tags }))(Tags)
