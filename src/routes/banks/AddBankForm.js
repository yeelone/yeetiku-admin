import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form,Select,Button,Input,Icon,Checkbox,Radio,InputNumber,Slider } from 'antd'
import { browserHistory } from 'react-router'

var _ = require('lodash')
const FormItem = Form.Item
const Option = Select.Option

const SliderMarks = {
    1: 'Level  1',
    2: 'Level  2',
    3: 'Level  3',
}

var uuid = 3;

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

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 14,
            offset: 6,
        }
    }
}

class AddBankForm extends React.Component{
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                 let data = {
                    id:  this.props.defaultData.id,
                    name: values['name'] ,
                    description: values['description'] ,
                }

                this.props.onSubmit(data)

            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form
        const item = this.props.defaultData

        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="add-bank-form" layout="horizontal">
                    <FormItem {...formItemLayout} label="题库名字" >
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: item.name
                    })(
                        <Input placeholder="题库名字" style={{ width: '80%', marginRight: 8 }} />
                    )}
                    </FormItem>
                    
                    <FormItem {...formItemLayout} label="题库简介" >
                    {getFieldDecorator('description', {
                        rules: [{ required: true }],
                        initialValue: item.description
                    })(
                        <Input  type="textarea" rows={20}  placeholder="题库简介" style={{ width: '80%', marginRight: 8 }} />
                    )}
                    </FormItem>

                    <Button type="primary" htmlType="submit" className="login-form-button">   提交  </Button>
                </Form>
            </div>
        )
    }
}

AddBankForm.propTypes = {
    dispatch: PropTypes.func,
};

export default connect()(Form.create()(AddBankForm));
