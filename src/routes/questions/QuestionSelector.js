import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Modal,Row, Col,Button,Table,Tabs } from 'antd'
import QuestionCategoryTree from './QuestionCategoryTree'
import styles from './QuestionList.less'
import classnames from 'classnames'

const confirm = Modal.confirm
const TabPane = Tabs.TabPane

const columns = [
    {
      title:"主题",
      dataIndex:"subject",
      key:"subject",
      width: '75%',
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
        width: '5%',
    },
    {
        title:"类型",
        dataIndex:"type",
        key:"type",
        width:'10%',
    },
  ];

class QuestionList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            selectedRowKeys:this.props.selectedRowKeys,
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }

    onlyShowSelected = (dataSource) => (
        dataSource.filter((item)=>{
            var _ = require('lodash');
            if ( _.indexOf(this.state.selectedRowKeys, item.id ) > -1 ){
                return item ;
            }
        })
    )

    render(){
        const { selectedRowKeys } = this.state
        const { dataSource,loading,onPageChange,pagination,onSelect } = this.props
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: (record, selected, selectedRows) => {
                onSelect(selectedRows)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                onSelect(selectedRows)
            }
        }

        return (
            <div>
                <Tabs defaultActiveKey="1" >

                    <TabPane tab="选择题目" key="1">

                        <Table
                            className={classnames({ [styles.table]: true })}
                            bordered
                            rowSelection={rowSelection}
                            scroll={{ x: 1200 }}
                            columns={columns}
                            dataSource={dataSource}
                            loading={loading}
                            onChange={onPageChange}
                            pagination={pagination}
                            simple
                            rowKey={record => record.id}/>
                    </TabPane>
                    <TabPane tab="已选题目" key="2">
                        <Table
                            className={classnames({ [styles.table]: true })}
                            bordered
                            rowSelection={rowSelection}
                            scroll={{ x: 1200 }}
                            columns={columns}
                            dataSource={this.onlyShowSelected(dataSource)}
                            loading={loading}
                            onChange={onPageChange}
                            pagination={pagination}
                            simple
                            rowKey={record => record.id}/>
                    </TabPane>
                </Tabs>
            </div>
        )

    }

}

function selector({dispatch, questions,categories, banks, loading,visible,onOk }) {
    const { list,pagination,modalVisible } = questions
    const { currentItem } = banks
    const defaultSelectedRowKeys = currentItem.questions
    const { total } = pagination
    let selectedQuestions  = []
    const setModalVisible = (visible) =>  {
        dispatch({
            type: 'questions/showModal',
      })
    }

    const handleTableChange = (pagination, filters, sorter) => {
        dispatch({
            type:"questions/query",
            payload: {
                page:pagination.current,
                pageSize: pagination.pageSize
            }
        })
    }

    const handlerOk = () => {
        onOk(selectedQuestions)
    }

    const handlerCancel = () => {
        dispatch({
            type: 'questions/hideModal',
        })
    }

    const onSelect = (selectedRowKeys) => {
        selectedQuestions = selectedRowKeys
    }

    const CategoriesProps = {
        categories,
        dispatch,
        onSelect(id){
          if ( id ){
            dispatch({
              type: 'categories/setCurrentItem',
              payload: { id },
            })
      
            dispatch({
              type:'questions/query',
              payload:{ category: id }
            })
          }
          
        }
      }


    return (
        <div id="questions-selector">
            <Button type="primary" onClick={() => setModalVisible(true)}>  添加题目   </Button>
            <Modal
                title="添加题目"
                width="1080px"
                wrapClassName="vertical-center-modal"
                visible={modalVisible}
                onOk={ handlerOk }
                onCancel={ handlerCancel } >

                <Row>
                    <Col span={4} >
                        <QuestionCategoryTree  {...CategoriesProps} />
                    </Col>
                    <Col span={18}>
                    <QuestionList
                            dataSource={list}
                            count={total}
                            onPageChange={handleTableChange}
                            pagination={pagination}
                            loading={loading}
                            onSelect={onSelect}
                            selectedRowKeys={_.map(defaultSelectedRowKeys, 'id')}
                            />
                    </Col>
                </Row>
            </Modal>
        </div>
    );
}


selector.propTypes = {
    loading: PropTypes.bool,
    questions: PropTypes.object,
    categories: PropTypes.object, 
    banks:PropTypes.object,
    dispatch: PropTypes.func,
    onOk:PropTypes.func,
};

export default connect(({ questions,banks,categories, loading }) => ({ questions,banks,categories, loading: loading.models.questions }))(selector);
