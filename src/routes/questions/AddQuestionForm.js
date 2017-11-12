import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Form,Select,Button,Input,Icon,Checkbox,Radio,InputNumber,Slider } from 'antd'
import { browserHistory } from 'react-router'

const FormItem = Form.Item
const Option = Select.Option

const QuestionType = {
    single:'单选题',
    multiple:'多选题',
    truefalse:'判断题',
    // essay:'问答题',
    filling:'填空题',
}

const SliderMarks = {
    1: 'Level  1',
    2: 'Level  2',
    3: 'Level  3',
}

var uuid = 3

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


class AddQuestionForm extends React.Component{
    constructor(props){
        super(props) ;
        this.state = {
            type : 'single',
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //打包选项
                values = this.wrapOptionValues(values)

                let data = {
                    id:  this.props.defaultData.id,
                    level: parseInt(values['level'],10),
                    score: values['score'] ,
                    subject: values['subject'] ,
                    type: values['type'] ,
                }
                if (values.hasOwnProperty('filling-answers')) data['filling-answers'] = values['filling-answers']
                if (values.hasOwnProperty('true_or_false')) data['true_or_false'] = values['true_or_false']
                if (values.hasOwnProperty('options')) data['options'] = values['options']

                this.props.onSubmit(data)

            }
        })
    }

    /*根据表格来打包选项，如表格的格式为：
        correct_answer:"C"
        option-A:"a"
        option-B:"b"
        option-C:"c"
        option-D:"d"
        为了服务器便于处理，需打包成这样：
        options = [
            { content: 'content a ', is_correct: false  },
            { content: 'content b ', is_correct: false  },
            { content: 'content c ', is_correct: true   },
            { content: 'content d ', is_correct: false  },
        ]
    */
    wrapOptionValues = (values) => {
        for (let item in values) {
            if ( item.indexOf("option-") !== -1){
                values['options'] = values['options'] || [] //选择题的选项以及答案
                var option = {}
                option['content'] = values[item]
                option['is_correct'] = false
                //单选项
                if (values['type'] === 'single' && ('option-'+values['correct_option']) === (''+item) ){
                    values['correct_option'] = values['correct_option'] || ''
                    option['is_correct'] = true
                }

                //多选项
                if (values['type'] === 'multiple'){
                    values['correct_options'] = values['correct_options'] || []
                    for(let index in values['correct_options']) {
                         if ( item.indexOf(values['correct_options'][index]) !== -1){
                            option['is_correct'] = true
                        }
                    }
                }
                values['options'].push(option)
            }

            if (item.indexOf("filling-answers-") !== -1 ) {
                values['filling-answers'] = values['filling-answers'] || []//填空题的答案列表
                values['filling-answers'].push(values[item])
            }
        }

        return values
    }

    remove = (k) => {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        if (keys.length === 1) {
            return
        }

        form.setFieldsValue({
        keys: keys.filter(key => key !== k),
        })
    }

    add = () => {
        uuid++
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(String.fromCharCode(65+uuid))
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    handleTypeChange  = (value) => {
        this.setState({type:value})
    }

    handleLevelChange = (value) => {
        this.setState({level: value})
    }


    //如果type === single or multiple ,则渲1染相应的选项
    renderOptions = (type,options) => {
        // var options = this.state.options;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        var initialValue = []
        
        if (!( _.isEmpty(options))) {
            uuid = options.length - 1
            for (let i=0 ; i < options.length; i++) {
                initialValue.push(String.fromCharCode(65+i))
            }
        }else{
            options=[]
            initialValue = ['A','B','C','D']
        }
        getFieldDecorator('keys', { initialValue })
        const keys = getFieldValue('keys')

        var currect_options = []
        const formItems = keys.map((k, index) => {
            var option = options[index] || {content:"",is_correct:false}
            if ( option.is_correct ) currect_options.push(k)
            return (
                <FormItem
                   {...formItemLayout}
                        label={k}
                        required={false}
                        key={k}
                    >
                    {getFieldDecorator(`option-${k}`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: false,
                            whitespace: true,
                            message: "Please input passenger's name or delete this field.",
                        }],
                        initialValue: option['content']
                    })(
                        <Input placeholder="选项内容" style={{ width: '60%', marginRight: 8 }} />
                    )}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 1}
                        onClick={() => this.remove(k)}
                    />
                </FormItem>

            )
        })
        const CheckboxGroup = Checkbox.Group
        const RadioGroup = Radio.Group
        return  (
        <div>
            {formItems}
            <FormItem {...formItemLayout} label="操作">
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
            </FormItem>
            {/*如果是多选题，显示多选框*/}
            { ( type === 'multiple') ?
                <FormItem {...formItemLayout} label="答案">{keys}
                    {getFieldDecorator(`correct_options`,{ initialValue:currect_options})( <CheckboxGroup options={keys} /> )}
                </FormItem>
                :
                 <FormItem {...formItemLayout} label="答案">
                    {getFieldDecorator(`correct_option`,{ initialValue:currect_options[0]})(
                           <RadioGroup> {
                                Object.keys(keys).map((key,value)=>{
                                    return ( <Radio key={key} value={keys[key]}>{keys[key]}</Radio> ) ;
                                }) }</RadioGroup>
                    )}
                </FormItem>
            }
        </div>
        )
    }

    renderTrueFalse = (true_or_false) => {
        const { getFieldDecorator } = this.props.form
        const RadioGroup = Radio.Group
        return  (
            <FormItem {...formItemLayout} label="答案">
            {getFieldDecorator(`true_or_false`,{initialValue: true_or_false})(
                    <RadioGroup>
                         <Radio key={true} value={true}>正确</Radio>
                         <Radio key={false} value={false}>错误</Radio>
                    </RadioGroup>
            )}
            </FormItem>
        )
    }

    renderFilling = (correct_answers) => {
        const { getFieldDecorator, getFieldValue } = this.props.form
        var subject = getFieldValue('subject')
        //取出subject中的下划线填空部分，替换成Input
        var re =/(_)+/ig
        var strArray = []
        if ( subject ) {
            strArray = subject.match(re)
        }

        var answers = []
        if ( correct_answers ){
            answers = correct_answers.split("||")
        }

        return  (
            <div>
                <span> 填空部分必须用下划线代替 </span>
                <span> 例如： 诗词填空：但愿人长久，__________；床前明月光，__________ </span>
                <div>
                    { strArray ? Object.keys(strArray).map((index) => {
                        let value = answers[index] ;
                        index++;
                        return ( <FormItem {...formItemLayout} label={index}  key={index}>
                        {getFieldDecorator(`filling-answers-${index}`,{initialValue:value})(
                               <Input  id={index} key={index} style={{ width: '20%', marginRight: 8 }}/>
                        )}
                    </FormItem>)
                    }): null
                    }
                </div>
            </div>
        )
    }

    onCategorySeleted = (selecteddKeys) => {

    }

    render(){
        const { getFieldDecorator } = this.props.form
        const item = this.props.defaultData
        const type = item.type ? item.type : this.state.type
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="add-bank-form" layout="horizontal">
                    <div className="title-bar">  <Icon type="exclamation-circle-o" /> 基本信息  </div>
                    <FormItem {...formItemLayout} label="题型" >
                    {getFieldDecorator('type', {
                        rules: [{ required: true, message: '请选择题型' }],
                        initialValue: item.type
                    })(
                            <Select  style={{ width: 120 }} onChange={this.handleTypeChange}>
                            {
                                Object.keys(QuestionType).map((item)=>{
                                    return ( <Option key={item} > {QuestionType[item]}</Option>)
                                })
                            }
                            </Select>
                    )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="难度" >
                        {getFieldDecorator('level', {
                        rules: [{ required: true, message: '难度' }],
                        initialValue: item.level
                    })(
                        <Slider marks={SliderMarks}  min={1} max={3} onChange={this.handleLevelChange} />
                    )}
                    </FormItem>

                     <FormItem {...formItemLayout} label="分数" >
                        {getFieldDecorator('score', {
                        rules: [{ required: true, message: '分数' }],
                        initialValue: item.score
                    })(
                        <InputNumber min={1} max={100} />
                    )}
                    </FormItem>

                    <div className="title-bar">  <Icon type="exclamation-circle-o" />     试题内容        </div>

                    <FormItem {...formItemLayout} label="题干" >
                        {getFieldDecorator('subject', {
                        rules: [{ required: true, message: '题干' }],
                        initialValue: item.subject
                    })(
                        <Input type="textarea" rows={8}  style={{ width: '100%', marginRight: 8 }} />
                    )}
                    </FormItem>

                    {  ( type === 'single' || type === 'multiple') ? this.renderOptions(type,item.options): null  }
                    {  ( type === 'truefalse' )? this.renderTrueFalse(item.true_or_false):null  }
                    {  ( type === 'filling' )? this.renderFilling(item.correct_answers):null }

                    <Button type="primary" htmlType="submit" className="login-form-button">   提交  </Button>
                </Form>
            </div>
        )
    }
}

AddQuestionForm.propTypes = {
    dispatch: PropTypes.func,
}

export default connect()(Form.create()(AddQuestionForm))
