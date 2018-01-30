import React from 'react'
import PropTypes from 'prop-types'
import { Table,Avatar  } from 'antd'
import styles from './BankList.less'
import classnames from 'classnames'
import { Link } from 'dva/router'
import { config } from '../../utils'

function list ({ loading, dataSource, pagination,onStatusChange, onPageChange }) {

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
    },
     {
      title: '头像',
      dataIndex: 'user',
      key: 'avatar',
      width: 64,
      className: styles.avatar,
      render: (text,record) => <Avatar size="large" icon="user" src={config.server + text.avatar} /> ,
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'name',
      render: (text,record) => {
        return <div> {text.name}  </div>
      } ,
    },
    {
      title: '最近做到',
      dataIndex: 'latest',
      key: 'latest',
    },
    {
      title:"加入时间",
      dataIndex:"create_time",
      key:"create_time",
    },
    {
      title:"最近时间",
      dataIndex:"update_time",
      key:"update_time",
    },
  ]

  return (
    <div>
      <Table
        className={classnames({ [styles.table]: true })}
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
}

export default list
