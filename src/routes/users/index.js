import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import queryString from 'query-string'
import App from '../app'
import UserList from './UserList'
import UserFilter from './UserFilter'
import UserModal from './UserModal'

function Users ({ location, dispatch, users, loading }) {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion } = users
  const {search, pathname } = location
  var query = queryString.parse(search)

  const userModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk (data) {
      dispatch({
        type: `users/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'users/hideModal',
      })
    },
  }

  const userListProps = {
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
    onResetPasswordItem(id){
      dispatch({
        type: 'users/resetPassword',
         payload: {
          id
        }
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'users/delete',
         payload: {
          ids: [id]
        }
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'users/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const userFilterProps = {
    ...query,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin/users',
        search:'?field='+fieldsValue.field+'&keyword='+fieldsValue.keyword,
      })) : dispatch(routerRedux.push({
        pathname: '/admin/users',
      }))
    },
    onAdd () {
      dispatch({
        type: 'users/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'users/switchIsMotion' })
    },
  }

  const UserModalGen = () =>
    <UserModal {...userModalProps} />

  return (
    <App location={location}>
    <div className="content-inner">
      <UserFilter {...userFilterProps} />
      <UserList {...userListProps} />
      <UserModalGen />
    </div>
    </App>
  )
}

Users.propTypes = {
  users: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ users, loading }) => ({ users, loading: loading.models.users }))(Users)
