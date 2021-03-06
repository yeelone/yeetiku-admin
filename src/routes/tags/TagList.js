import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd' 
import styles from './TagList.less' 
import classnames from 'classnames' 
import { DropOption } from '../../components' 

const confirm = Modal.confirm 

function list ({ loading, dataSource, pagination, onPageChange, onDeleteItem, onEditItem, isMotion, location }) {
  const { search, pathname } = location
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record) 
    } else if (e.key === '2') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {
          onDeleteItem(record.id) 
        },
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 64,
      className: styles.avatar,
      render: (id) => <a href="#" > {id}  </a>,
    }, {
      title: '标签名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
      },
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
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default list 
