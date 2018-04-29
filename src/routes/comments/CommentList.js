import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Table, Modal,Switch,Button  } from 'antd' 
import styles from './CommentList.less' 
import classnames from 'classnames' 
import { DropOption } from '../../components' 
import { Link } from 'dva/router'

const confirm = Modal.confirm 

function list ({ loading, dataSource,openDetail, pagination,onStatusChange, onPageChange, onDeleteItem, isMotion, location }) {
  var query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id) 
        },
      })
    }
  }

  const handleStatusChange = (item) => {
        onStatusChange(item) 
  }

  const handleRecordClick = (item) => {
    onRecordClick(item) 
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
        render: (id, record) => {
        const { pathname } = location
        const path = pathname
        return <Link to={pathname + "/"  +id }  > {id}  </Link>
      } ,
    },
    {
      title:"用户",
      dataIndex:"user",
      key:"user",
      width: '10%',
      render: (text,record) => {
        const { pathname } = location
        const path = pathname
        return <Link to={pathname + "/"  + record.user.id }  > {record.user.nickname}  </Link>
      } ,
    },
    {
      title:"内容",
      dataIndex:"content",
      key:"content",
      width: '35%',
    },
    {
      title:"赞",
      dataIndex:"like",
      key:"like",
      width: '5%',
    },
    {
      title:"踩",
      dataIndex:"down",
      key:"down",
      width: '5%',
    },
    {
        title: '操作',
        key: 'operation',
        width: '20%',
        render: (text, record) => {
          return (
            <div>
              <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[ { key: '1', name: '删除' }]} />
            </div>
          )
        },
    },
  ] 

  const getBodyWrapperProps = {
    page: query.page,
    current: pagination.current,
  } 

  return (
    <div>
      <Table
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={onPageChange}
        pagination={pagination}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

list.propTypes = {
  loading: PropTypes.bool,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default list 
