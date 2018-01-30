import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Table, Modal,Switch,Button  } from 'antd' 
import styles from './BankList.less' 
import classnames from 'classnames' 
import { DropOption } from '../../components' 
import { Link } from 'dva/router'

const confirm = Modal.confirm 

function list ({ loading, dataSource,openDetail, pagination,onStatusChange, onPageChange,onRecordClick, onDeleteItem, onEditItem, isMotion, location }) {
  var query = queryString.parse(location.search)

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
      title:"题库名",
      dataIndex:"name",
      key:"name",
      width: '35%',
      render: (text,record) => {
        const { pathname } = location
        const path = pathname
        return <Link to={pathname + "/"  + record.id }  > {text}  </Link>
      } ,
    },
    {
      title:"简介",
      dataIndex:"description",
      key:"description",
      width: '35%',
    },
    {
        title:"状态（启用/禁用）",
        dataIndex:"disable",
        key:"disable",
        width: '5%',
        render:  (text, record) => {
            return <Switch checkedChildren={'启用'} unCheckedChildren={'禁用'} defaultChecked={!record.disable}
                        onChange={ () => onStatusChange(record) }/>
        }
    },
    {
        title: '操作',
        key: 'operation',
        width: '20%',
        render: (text, record) => {
          return (
            <div>
              <Button onClick={() => handleRecordClick(record) }> 跟踪  </Button>
              <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
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
  onStatusChange:PropTypes.func,
  onRecordClick:PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default list 
