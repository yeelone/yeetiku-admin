import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form,Input,Upload,message,Icon,Button,Modal,Row, Col  } from 'antd'
import styles from './index.less'
import { config } from '../../utils'
const FormItem = Form.Item
const { server,baseURL,api } = config
const formItemLayout = {
  labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
  },
  wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
  }
}

function Client ({ client, dispatch,  
  form: { 
    getFieldDecorator,  
    validateFieldsAndScroll,
  },}) {
    const { name, domain ,apiPrefix,splashImage,logoImage } = client  
    function handleSubmit(e){  
      e.preventDefault()
      Modal.confirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    name: values['name'] ,
                    domain: values['domain'] ,
                    apiPrefix: values['apiPrefix'] ,
                    splashImage,
                    logoImage
                }
                console.log(data)
                dispatch({
                  type: 'client/saveAppConfig',
                  payload:{
                    data
                  }
              })

            }
        })
        },
        onCancel() {
          
        },
      })
    }

    const beforeUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
          message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 / 2014 < 200
      if (!isLt2M) {
          message.error('Image must smaller than 200KB!')
      }
      return isJPG && isLt2M
    }

    const handleChange = (info) => {
      if (info.file.status === 'done') {
        message.success('图片上传成功!');
        dispatch({
            type: 'client/updateSplashImageUrl',
            payload:{
              splashImage:info.file.response.url
            }
        })
      }else if ( info.file.status === 'error') {
        message.error("图片上传失败，参考：", info.file.response)
      }
    }

    const handleIconUploadChange = (info) => {
      if (info.file.status === 'done') {
        message.success('图片上传成功!');
        dispatch({
            type: 'client/updateLogoImageUrl',
            payload:{
              logoImage:info.file.response.url
            }
        })
      }else if ( info.file.status === 'error') {
        message.error("图片上传失败，参考：", info.file.response)
      }
    }

    return (
      <div>
        <Row>
          <Col span={14}>
            <Form onSubmit={handleSubmit} className="config-form" layout="horizontal">
                <FormItem {...formItemLayout} label="logo" >
                  <Upload
                    name="logo-image"
                    showUploadList={false}
                    headers={ {Authorization: 'Bearer ' + localStorage.jwtToken } }
                    action={ baseURL +"/client/icon/upload"}
                    beforeUpload={beforeUpload}
                    onChange={handleIconUploadChange}
                    >
                    {
                      logoImage ?
                        <img src={server+logoImage} alt="" className={styles.icon_image}/> :
                        <Icon type="plus" className={styles.uploader} />
                    }
                  </Upload>
                </FormItem>
                <FormItem {...formItemLayout} label="name" >
                    {getFieldDecorator('name', {
                              initialValue: name
                    })(
                        <Input placeholder="APP 名字" />
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="domain" >
                    {getFieldDecorator('domain', {
                              initialValue: domain
                    })(
                        <Input placeholder="域" />
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="apiPrefix" >
                    {getFieldDecorator('apiPrefix', {
                      initialValue: apiPrefix
                    })(
                        <Input placeholder="API version" />
                    )}
                </FormItem>

                <FormItem {...formItemLayout}>
                  <div className={styles.form_action}>
                      <Button type="primary"  htmlType="submit" className={styles.configFormButton}>
                          提交
                      </Button>
                  </div>
                </FormItem>
            </Form>
            </Col>
            <Col span={10}>
            <span>App 开屏画面 </span>
                  <Upload
                      name="splash-image"
                      showUploadList={false}
                      headers={ {Authorization: 'Bearer ' + localStorage.jwtToken } }
                      action={ baseURL +"/client/splash/upload"}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      >
                      {
                        splashImage ?
                          <img src={server+splashImage} alt="" className={styles.splash_image}/> :
                          <Icon type="plus" className={styles.splash_image} />
                      }
                  </Upload>
            </Col>
        </Row>
      </div>
    )
}

Client.propTypes = {
  form: PropTypes.object,
  client:PropTypes.object,
  dispatch: PropTypes.func,
}


export default connect(({client }) => ({ client}))(Form.create()(Client))