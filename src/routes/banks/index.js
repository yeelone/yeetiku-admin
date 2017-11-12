import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import BankList from './BankList'
import BankFilter from './BankFilter'
import BankModal from './BankModal'
import RecordModal from './RecordModal'

import { Layout  } from 'antd'
const {  Sider, Content } = Layout

import styles from './styles.less'

function Banks ({ location, dispatch, banks,categories, loading }) {
  const { list, pagination, currentItem, modalVisible,recordModalVisible, modalType, isMotion } = banks
  const { field, keyword } = location.query

  const BankModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    type: modalType,
    visible: modalVisible,
    onOk (data) {
      dispatch({
        type: `banks/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'banks/hideModal',
      })
    },
  }

  const RecordModalProps = {
    item: currentItem,
    visible: recordModalVisible,
    onOk (data) {
    },
    onCancel () {
    },
  }

  const BankListProps = {
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
    onStatusChange(item) {
      const status = item.disable ? 'disable' : 'enable'
      dispatch({
        type: 'banks/updateStatus',
        payload: {
          id: item.id ,
          status
        }
      })
    },
    onRecordClick(item){
      dispatch({
        type: 'banks/queryRecords',
        payload: {
          id: item.id
        }
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'banks/delete',
        payload: {
          id,
        }
      })
    },
    onEditItem (item) {
      dispatch({
        type:'banks/queryOne',
        payload:{
          id: item.id,
          modalVisible: true,
          modalType: 'update',
        }
      })
    },
  }

  const BankFilterProps = {
    field,
    keyword,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin/banks',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/admin/banks',
      }))
    },
    onAdd () {
      dispatch({
        type: 'banks/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'banks/switchIsMotion' })
    },
  }

  const BankModalGen = () =>{
    return <BankModal {...BankModalProps} />
  }

  const RecordModalGen = () =>{
    return <RecordModal {...RecordModalProps} />
  }

  return (
    <div >
          <BankFilter {...BankFilterProps} />
          <BankList {...BankListProps} />
          <BankModalGen />
    </div>
  )
}

Banks.propTypes = {
  banks: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ banks, loading }) => ({ banks, loading: loading.models.banks }))(Banks)
