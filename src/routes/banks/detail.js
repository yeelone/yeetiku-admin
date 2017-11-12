import React, { PropTypes,Component } from 'react'
import { connect } from 'dva'
import { Tabs   } from 'antd'
import { config } from '../../utils'
import BaseInfo from './BaseInfo'
import RelatedQuestions from './RelatedQuestions'
import Records from './Records'

import styles from  './styles.less'

const TabPane = Tabs.TabPane

function  detail({ dispatch,banks,location }){
    const { currentItem,quesPagination } = banks 
    const BaseInfoProps = {
        dispatch,
        banks
    }

    const _getRelatedQuestion = (key) => {
        const payload = {
                    id: currentItem.id ,
                    page: quesPagination.current,
                    pageSize: quesPagination.pageSize,
                }

        if ( key === '2' ) {
            dispatch({
                type: 'banks/queryQuestions',
                payload
            })
        }
        if ( key === '3' ) {
            dispatch({
                type: 'banks/queryRecords',
                payload
            })
        }
    }

    return (
        <Tabs type="card" onChange={ _getRelatedQuestion }>
            <TabPane tab="基本信息" key="1">
                    <BaseInfo  {...BaseInfoProps}  />
            </TabPane>
            <TabPane tab="关联题目" key="2" >
                <RelatedQuestions {...BaseInfoProps}  />
            </TabPane>
            <TabPane tab="历史记录" key="3">
                <Records {...BaseInfoProps} />
            </TabPane>
        </Tabs>
    )
}

detail.propTypes = {
  banks: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
}

export default connect(({banks})=>({banks}))(detail)
