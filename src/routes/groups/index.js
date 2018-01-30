import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import queryString from 'query-string'
import App from '../app'
import GroupList from './GroupList'
import GroupModal from './GroupModal'
import GroupFilter from './GroupFilter'

import { Selector }  from '../../components/'

function Groups ({ location, dispatch, groups , users, loading }) {
  const { list,relateUserList, pagination, currentItem, modalVisible,selectorVisible, modalType, isMotion } = groups
  const {search, pathname } = location
  var query = queryString.parse(search)

  const groupModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk (data) {
      dispatch({
        type: `groups/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'groups/hideModal',
      })
    },
  }

  const groupListProps = {
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
        type: 'groups/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'groups/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onSelectUsers(item){
      //查询所有用户的列表
      dispatch({
        type:'users/query',
        payload:{}
      })

      //查询组已关联的用户列表 
      dispatch({
        type: 'groups/queryUsers',
        payload:{
          currentItem: item 
        }
      })
    }
  }

  const groupFilterProps = {
    ...query,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin/groups',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/admin/groups',
      }))
    },
    onAdd () {
      dispatch({
        type: 'groups/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'groups/switchIsMotion' })
    },
  }
  
  const getIDList = (relateUserList) => {
      let list = []
      relateUserList.map((item)=>{
         list.push( Number(item.id)) 
      })
      return list 
  }

  const selectorProps = {
        sourceData: users.list ,//()=>{ if ( users ) return users.list }  ,
        targetKeys: getIDList(relateUserList),
        visible:selectorVisible,
        onOk : (result)=>{ 
           dispatch({
              type: 'groups/hideSelector',
           })

           dispatch({
             type:'groups/addUsers',
             payload:{
               users: result
             }
           })
        },
        onCancel: ()=>{
          dispatch({
            type: 'groups/hideSelector',
          })
        }
  }

  const GroupModalGen = () =>
    <GroupModal {...groupModalProps} />
  
  const SelectorGen = () => <Selector {...selectorProps} />

  return (
    <App location={location}>
    <div className="content-inner">
        <GroupFilter {...groupFilterProps} />
        <GroupList {...groupListProps} />
        <GroupModalGen />
        <SelectorGen />
    </div>
    </App>
  )
}

Groups.propTypes = {
  users: PropTypes.object,
  groups: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ groups,users, loading }) => ({ groups,users,loading: loading.models.groups }))(Groups)
