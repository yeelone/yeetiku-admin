import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal,Rate,Avatar  } from 'antd'
import { DropOption } from '../../components'
import { config } from '../../utils' 
import styles from './List.less'
import classnames from 'classnames'
const confirm = Modal.confirm

function list ({ loading, dataSource, pagination,dispatch, onPageChange, isMotion }) {

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      className: styles.avatar,
      render: (id) => <a href="#" > {id}  </a>,
    }, 
    {
      title:"内容",
      dataIndex:"content",
      key:"content",
      width: '50%',
    },
    {
        title:"image",
        dataIndex:"image",
        key:"image",
        width: '5%',
        render: (text) => <Avatar size="large" icon="user" src={config.server + text} /> ,
     },
    {
        title:"联系方式",
        dataIndex:"contact",
        key:"contact",
        width: '20%',
    }, 
    {
      title: '创建时间',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    },
  ]

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
  isMotion: PropTypes.bool,
}

export default list
