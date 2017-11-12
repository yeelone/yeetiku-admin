import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Card  } from 'antd'
import { Link } from 'dva/router'
import styles from './index.less'
import { color,menu } from '../../utils'


const DefindColors = ["#1abc9c","#3498db","#f1c40f","#e67e22", "#e74c3c","#2ecc71"]

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
        <Card style={{ width: 300 , backgroundColor:cardColor, color:"white", fontSize: "20px"}}> 
          {item.name} 
        </Card>
      </Link>
    )
  })
}

function Dashboard ({ dashboard }) {
  return (
    <div>
      {getMenus()}
    </div>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
}

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
