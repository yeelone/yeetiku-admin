import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import  QuestionSelector  from '../questions/QuestionSelector'
import QuestionList from '../questions/QuestionList'

function  relatedQuestions({ location, dispatch,banks }){
    const { currentItem, relatedQuestions ,loading,quesPagination,isMotion }  = banks 
    const QuestionListProps = {
        dataSource:relatedQuestions,
        loading,
        pagination:quesPagination,
        location,
        isMotion,
        onPageChange (page) {
            dispatch({
                    type: 'banks/queryQuestions',
                    payload: {
                        id: currentItem.id ,
                        page: page.current,
                        pageSize: page.pageSize,
                    }
                })
        },
        onDeleteItem (id) {
            dispatch({
                type: 'banks/removeRelatedQuestions',
                payload: {
                    questions: [id] ,
                }
            })
        },
        onEditItem (item) {
        },
    }
    const handlerOk = (selectedQuestions) => {
        
        dispatch({
            type: 'banks/saveRelatedQuestions',
            payload:{
                questions:selectedQuestions
            }
        })

        dispatch({
            type: 'banks/queryQuestions',
            payload: {
                id: currentItem.id ,
                page: quesPagination.current,
                pageSize: quesPagination.pageSize,
            }
        })

        dispatch({
            type: 'questions/hideModal',
        })
    }
    return (
        <div>
            <div style={{margin:'20px'}}>
                <QuestionSelector onOk={handlerOk} />
            </div>
            <QuestionList {...QuestionListProps} />
        </div>
    )
}


relatedQuestions.propTypes = {
  banks: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({banks})=>({banks}))(relatedQuestions)