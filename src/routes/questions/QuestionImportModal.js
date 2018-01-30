import React from 'react'
import PropTypes from 'prop-types'
import { Modal,Upload,message, Button, Icon } from 'antd'
import  AddQuestionForm  from './AddQuestionForm'
import { config } from '../../utils'
const { server,baseURL,api } = config

const modal = ({
  visible,
  type,
  onOk,
  onCancel,
}) => {

  function handleOk () {
      onCancel()
  }

  const modalOpts = {
    title: '导入题目' ,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

   const handleChange = (info) => {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name}  上传失败`);
      } 
    }

    const beforeUpload = (file) => {
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLSX) {
        message.error('只支持 xlsx 格式的文件');
      }

      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error('不能大于 20MB!');
      }

      return isXLSX && isLt20M
    }

  return (
    <Modal {...modalOpts}>
        <div>
            <div className="clearfix">
                 <Upload
                    name="excel-file"  name="excel-file"
                    headers={ {Authorization: 'Bearer ' + localStorage.jwtToken } }
                    action={ baseURL + "/import/questions" }
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    >
                    <Button>
                     <Icon type="upload" /> 点击上传excel文件
                  </Button>
                </Upload>
             </div>
            <a  target="_blank" href={config.server + config.templates.questions}><Icon type="download" /> 模板下载： 批量导入题目模板</a>
            <div>
              当文件上传成功后，系统将在后台处理上传的数据 ，这可能需要一段时间，您此时可以关闭本窗口继续进行其它操作。稍候刷新页面即可获取处理结果。
            </div>
        </div>
    </Modal>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default modal
