import React from 'react'
import PropTypes from 'prop-types'
import {  Alert } from 'antd'
function Notification ({ messager }) {

  const { show,body,status } = messager

  return (
    <div >
        { show ? 
            <Alert message={body} type={status} closable  showIcon banner /> 
            : 
            null 
        }
    </div>
  )
}

Notification.propTypes = {
  messager: PropTypes.object,
}

export default Notification
