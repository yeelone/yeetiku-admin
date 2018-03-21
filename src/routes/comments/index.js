import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import queryString from 'query-string'
import App from '../app'
import { Layout  } from 'antd'
import CommentFilter from './CommentFilter'
import CommentList from './CommentList'

const {  Sider, Content } = Layout

import styles from './styles.less'

function Comments ({ location, dispatch, comments,categories, loading,isMotion }) {
  const { list, pagination, currentItem, modalVisible, modalType } = comments
  const {search, pathname } = location
  var { field, keyword } = queryString.parse(search)
  const query = { field, keyword }
  
  const CommentListProps = {
    dataSource: list,
    loading,
    pagination,
    location,
    isMotion,
    onPageChange (page) {
        dispatch(routerRedux.push({
            ...location,
            search:'?'+queryString.stringify({
                ...queryString.parse(search),
                page: page.current,
                pageSize: page.pageSize
            }),
        }))
    },
    onDeleteItem (id) {
        dispatch({
            type: 'comments/delete',
            payload: {
            ids:[id]
            }
        })
    },
  }

  const CommentFilterProps = {
    ...query,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname,
        search:'?field='+fieldsValue.field+'&keyword='+fieldsValue.keyword,
      })) : dispatch(routerRedux.push({
        pathname,
      }))
    },
    switchIsMotion () {
      dispatch({ type: 'comments/switchIsMotion' })
    },
  }


  return (
    <App location={location}>
        <CommentFilter {...CommentFilterProps} />
        <CommentList {...CommentListProps} />
    </App>
  )
}

Comments.propTypes = {
  comments: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ comments, loading }) => ({ comments, loading: loading.models.comments }))(Comments)
