import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import RecordList from './RecordList'

function  records({ dispatch,banks }){
    const { currentItem, records ,loading,recordPagination,isMotion }  = banks 
    const ListProps = {
        dataSource:records,
        loading,
        pagination:recordPagination,
        location,
        isMotion,
        onPageChange (page) {
            dispatch({
                    type: 'banks/queryRecords',
                    payload: {
                        id: currentItem.id ,
                        page: page.current,
                        pageSize: page.pageSize,
                    }
                })
        },
    }

    return (
        <div>
            <RecordList {...ListProps}/> 
        </div>
    )
}


records.propTypes = {
  banks: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({banks})=>({banks}))(records)