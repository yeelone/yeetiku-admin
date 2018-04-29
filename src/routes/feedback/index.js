import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { listToTree,config } from '../../utils'
import { Layout } from 'antd'
import queryString from 'query-string'
import App from '../app'
import List from './List'
import Filter from './Filter'
import styles from './styles.less'
const {  Sider, Content } = Layout

function Feedbacks ({ location, dispatch, feedbacks, loading }) {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion } = feedbacks
  const {search, pathname } = location
  var { field, keyword } = queryString.parse(search)
  const query = { field, keyword }

  const ListProps = {
    dataSource: list,
    dispatch,
    loading,
    pagination,
    location,
    isMotion,
    onPageChange (page) {
      dispatch(routerRedux.push({
        ...location,
        search:'?'+queryString.stringify({
            ...queryString.parse(search),
            page: page.current,
            pageSize: page.pageSize
        }),
    }))
    },
  }

  const FilterProps = {
    field,
    keyword,
    isMotion,
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/admin/feedbacks',
        search:'?field='+fieldsValue.field+'&keyword='+fieldsValue.keyword,
      })) : dispatch(routerRedux.push({
        pathname: '/admin/feedbacks',
      }))
    },
    switchIsMotion () {
      dispatch({ type: 'feedbacks/switchIsMotion' })
    },
  }


  return (
    <App location={location}>
    <div className="content-inner"> 
      <Layout className={styles.layout}>
        <Content>
          <Filter {...FilterProps} />
          <List {...ListProps} />
        </Content>
      </Layout>
    </div>
    </App>
  )
}

Feedbacks.propTypes = {
  feedbacks: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ feedbacks,loading }) => ({ feedbacks, loading: loading.models.feedbacks }))(Feedbacks)
