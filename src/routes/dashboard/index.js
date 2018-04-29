import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Card  } from 'antd'
import { Link } from 'dva/router'
import styles from './index.less'
import { color,menu } from '../../utils'
import App from '../app'

const DefindColors = ["#1abc9c","#3498db","#f1c40f","#e67e22", "#e74c3c","#2ecc71","#6c5ce7","#2d3436","#fd79a8"]

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

function getMenus(){
  const parentPath = '/'
  return menu.map((item,index) => {
    const linkTo = parentPath + item.key
    const cardColor = DefindColors[index]
    return (
      <Link to={linkTo} key={index}>
        <Card  style={{ width: 300 ,margin:20, float:'left', backgroundColor:cardColor, color:"white", fontSize: "20px"}}> 
          {item.name} 
        </Card>
      </Link>
    )
  })
}

function Dashboard ({ dashboard }) {
  return (
    <App location={location} >
      <div className={styles.list}>
        {getMenus()}
      </div>
    </App>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
