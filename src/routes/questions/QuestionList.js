import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal,Rate  } from 'antd'
import styles from './QuestionList.less'
import classnames from 'classnames'
import { DropOption } from '../../components'
import QuestionCategoryTree from './QuestionCategoryTree'
const confirm = Modal.confirm

const QUES_TYPE = {
  'multiple' :'多选题', 
  'single' : '单选题',
  'truefalse':'判断题',
  'filling':'填空题'
}
function list ({ loading, dataSource,categories, pagination,dispatch, onPageChange, onDeleteItem,onMoveItem, onEditItem, isMotion }) {
  const CategoriesProps = {
    categories,
    dispatch,
  }

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }else if (e.key === '2'){
      let catID = 0  
        Modal.info({
          title: '选择分类',
          content: (
            <div>
              <QuestionCategoryTree {...CategoriesProps} onSelect={  (key) => catID = key  }
              />
            </div>
          ),
          onOk() {onMoveItem(record, catID)},
        })
    } else if (e.key === '3') {
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
      width: '10%',
      className: styles.avatar,
      render: (id) => <a href="#" > {id}  </a>,
    }, 
    {
      title:"主题",
      dataIndex:"subject",
      key:"subject",
      width: '35%',
    },
    {
        title:"分数",
        dataIndex:"score",
        key:"score",
        width: '5%',
     },
    {
        title:"难度",
        dataIndex:"level",
        key:"level",
        width: '10%',
        render:(text) => {
          return <Rate allowHalf defaultValue={text} count={3} style={{ fontSize: 10 }}/>
        }
    },
    {
      title:"解答",
      dataIndex:"explanation",
      key:"explanation",
      width: '35%',
    },
    {
        title:"类型",
        dataIndex:"type",
        key:"type",
        width:'5%',
        render: (text) => {
          return <span>{QUES_TYPE[text]}</span>
        },
    },
    {
        title: '操作',
        key: 'operation',
        width: '10%',
        render: (text, record) => {
          return <DropOption onMenuClick={e => handleMenuClick(record, e)} 
            menuOptions={[ 
                { key: '1', name: '编辑' },
                { key: '2', name: '移动' },
                { key: '3', name: '删除' }]} />
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
}

export default list
