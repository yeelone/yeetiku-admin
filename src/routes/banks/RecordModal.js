//该组件作废
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal } from 'antd'
import RecordList from './RecordList'
const FormItem = Form.Item


const modal = ({
  visible,
  item = {},
  records=[],
  onOk,
  onCancel,
}) => {
  function handleOk () {
      onOk(data)
  }

  function handleSubmit(data){
    onOk(data)
  }

  const modalOpts = {
    title:  '跟踪记录',
    width: "1080px",
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  return (
    <Modal {...modalOpts}>
      <RecordList dataSource={records}/>
    </Modal>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default modal
