import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Form ,Upload,Modal,Icon,Switch,Input,Button,message ,Row, Col  } from 'antd'
import { EditableTagGroup,EditableTagTree } from '../../components/tag'
import { config } from '../../utils'
import styles from  './styles.less'

const { server,baseURL,api } = config
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

function  baseinfo({dispatch,banks,form,saveTags,removeTags }){
    const { getFieldDecorator } = form
    const { currentItem,status,tags,tagsTree,tagsTreeTotal  } = banks
    var imageUrl = server + currentItem.image

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success('图片上传成功!');
            dispatch({
                type: 'banks/updateImageUrl',
                payload:{
                    imageUrl:info.file.response.url
                }
            })
        }else if ( info.file.status === 'error') {
            message.error("图片上传失败，参考：", info.file.response)
        }
        
    }

    const beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 / 2014 < 200;
        if (!isLt2M) {
            message.error('Image must smaller than 200KB!');
        }
        return isJPG && isLt2M;
    }

     const handleSubmit = (e) => {
         e.preventDefault()
         form.validateFields((err, values) => {

            if (!err) {
                dispatch({
                    type: 'banks/update',
                    payload:{
                        ...currentItem,
                        ...values,
                    }
                })
            }
        })
     }

     const EditableTagGroupProps = {
        dispatch, 
        tags, 
        onClose(tag){
            dispatch({
                type: 'banks/removeRelatedTag',
                payload:{
                    tagID:tag.id
                }
            })
        }
     }

     const EditableTagTreeProps = {
        dispatch,
        tagsTree,
        tagsTreeTotal,
        onEnter(name, branch){
            if ( !name ) return 
            
            dispatch({
                type: 'banks/saveTag',
                payload:{
                    name,
                    branch
                }
            })
        },
        onClose(tagID,branch ){
            dispatch({
                type: 'banks/deleteTag',
                payload:{
                    tagID,
                    branch
                }
            })
        },
        onSelected(checked, tag){
            if (checked){
                dispatch({
                    type: 'banks/saveRelatedTag',
                    payload:{
                        tagID:tag.id
                    }
                })
            }else{
                dispatch({
                    type: 'banks/removeRelatedTag',
                    payload:{
                        tagID:tag.id
                    }
                })
            }
            
        }
    }

    return (
        <div className=" input-form">
             <Row>
                <Col span={14}>
                  <div className="clearfix">
                    <Upload
                        className={styles.avatar_uploader}
                        name="bank-image"
                        showUploadList={false}
                        headers={ {Authorization: 'Bearer ' + localStorage.jwtToken } }
                        action={ baseURL + api.banks + "/" + currentItem.id + "/upload"}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        >
                        {
                        imageUrl ?
                            <img src={imageUrl} alt="" className={styles.avatar}/> :
                            <Icon type="plus" className={styles.avatar_uploader_trigger} />
                        }
                    </Upload>
                  </div>
                  <Form onSubmit={handleSubmit} className={styles.bank_form} >
                     <FormItem label="ID" hasFeedback {...formItemLayout} style={{ display:"none" }}>
                        {getFieldDecorator('id', {
                            initialValue:currentItem.id
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <FormItem label="题库名称" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入题库的名称' }],
                            initialValue:currentItem.name
                        })(
                            <Input addonBefore={<Icon type="database" />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem label="描述" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('description', {
                            rules: [{ required: true, message: '请输入题库简介' }],
                            initialValue:currentItem.description
                        })(
                            <Input  type="textarea" rows={10}  placeholder="description" />
                        )}
                    </FormItem>
                   <FormItem label="启用状态" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('disable', {
                            rules: [{ required: true, message: '请输入题库的名称' }],
                            initialValue:currentItem.disable
                        })(
                            <Switch checkedChildren={'启用'} unCheckedChildren={'禁用'} defaultChecked={!currentItem.disable}/>
                        )}
                    </FormItem>
                    
                    <div className={styles.form_action}>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            保存
                        </Button>
                    </div>
                  </Form>
                </Col>
                <Col span={10}>
                    <span> 为题库建立标签可方便用户搜索...</span>
                    <EditableTagGroup {...EditableTagGroupProps}/>
                    <EditableTagTree {...EditableTagTreeProps}/>
                </Col>
             </Row>
        </div>
    )

}

baseinfo.propTypes = {
  banks: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({banks})=>({banks}))(Form.create()(baseinfo))
